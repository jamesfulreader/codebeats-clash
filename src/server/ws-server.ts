import { createServer } from "http";
import type { IncomingMessage } from "http";
import { WebSocketServer } from "ws";
import { parse as parseCookie } from "cookie";
import { applyWSSHandler } from "@trpc/server/adapters/ws";

import { env } from "./env.server";
import { appRouter } from "./api/root";
import { createTRPCContext } from "./api/trpc";
import { db } from "./db";

const PORT = env.PORT;
const WS_PATH = env.WS_PATH;

type AugmentedReq = IncomingMessage & {
  auth?: {
    user: {
      id: string;
      name: string | null;
      email: string | null;
      image: string | null;
    };
    sessionToken: string;
    expires: Date;
  };
};

const SESSION_COOKIE_CANDIDATES = [
  "__Secure-next-auth.session-token",
  "next-auth.session-token",
  "__Secure-authjs.session-token",
  "authjs.session-token",
] as const;

type SessionCookieName = (typeof SESSION_COOKIE_CANDIDATES)[number];

function getSessionCookieName(
  cookies: Record<string, string | undefined>,
): SessionCookieName | undefined {
  return SESSION_COOKIE_CANDIDATES.find((name) => cookies[name] !== undefined);
}

const server = createServer((_, res) => {
  res.writeHead(404);
  res.end();
});

const wss = new WebSocketServer({ noServer: true });

const handler = applyWSSHandler({
  wss,
  router: appRouter,
  createContext: ({ req }) =>
    createTRPCContext({
      headers: new Headers((req as IncomingMessage).headers as any),
      // @ts-ignore - Adapt to your context shape if needed
      session: (req as AugmentedReq).auth && {
        user: (req as AugmentedReq).auth!.user,
        expires: (req as AugmentedReq).auth!.expires.toISOString(),
      },
    }),
});

server.on("upgrade", async (req: AugmentedReq, socket, head) => {
  if (req.url !== WS_PATH) {
    socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    return socket.destroy();
  }

  // ✅ FIX #2: Remove the incorrect type annotation and let TypeScript infer it
  const cookies = parseCookie(req.headers.cookie ?? "");

  const cookieName = getSessionCookieName(cookies);
  const sessionToken = cookieName ? cookies[cookieName] : undefined;

  if (!sessionToken) {
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    return socket.destroy();
  }

  try {
    const session = await db.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    });

    if (!session || session.expires <= new Date()) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      return socket.destroy();
    }

    req.auth = {
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      },
      sessionToken,
      expires: session.expires,
    };

    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req);
    });
  } catch (err) {
    console.warn("WS auth error:", err);
    socket.write("HTTP/1.1 500 Internal Server Error\r\n\r\n");
    return socket.destroy();
  }
});

server.listen(PORT, () => {
  console.log(`🚀 WS server: ws://localhost:${PORT}${WS_PATH}`);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received");
  handler.broadcastReconnectNotification();
  wss.close(() => process.exit(0));
});
