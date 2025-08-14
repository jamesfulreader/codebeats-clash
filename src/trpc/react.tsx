"use client";

import { useState } from "react";
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import { createTRPCReact } from "@trpc/react-query";
import {
  httpBatchStreamLink,
  loggerLink,
  splitLink,
  wsLink,
  createWSClient,
} from "@trpc/client";
import SuperJSON from "superjson";

import { type AppRouter } from "~/server/api/root";
import { createQueryClient } from "./query-client";

let clientQueryClientSingleton: QueryClient | undefined = undefined;
const getQueryClient = () => {
  if (typeof window === "undefined") {
    return createQueryClient();
  }
  clientQueryClientSingleton ??= createQueryClient();
  return clientQueryClientSingleton;
};

export const api = createTRPCReact<AppRouter>();

export type RouterInputs = import("@trpc/server").inferRouterInputs<AppRouter>;
export type RouterOutputs =
  import("@trpc/server").inferRouterOutputs<AppRouter>;

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  const [trpcClient] = useState(() => {
    const getBaseUrl = () => {
      if (typeof window !== "undefined") return window.location.origin;
      if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
      return `http://localhost:${process.env.PORT ?? 3000}`;
    };

    const getWsUrl = () => {
      if (typeof window === "undefined") return null;
      if (process.env.NEXT_PUBLIC_WS_URL) return process.env.NEXT_PUBLIC_WS_URL;
      const proto = window.location.protocol === "https:" ? "wss" : "ws";
      // WS endpoint must match your server/ws-server.ts path
      return `${proto}://${window.location.host}/socket`;
    };

    const wsUrl = getWsUrl();
    const wsClient = wsUrl ? createWSClient({ url: wsUrl }) : undefined;

    return api.createClient({
      // Note: transformer goes on each link (see below), not here
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        // Route subscriptions to WS; everything else over HTTP streaming
        splitLink({
          condition: (op) => op.type === "subscription" && !!wsClient,
          true: wsLink({
            client: wsClient!,
            transformer: SuperJSON, // required on link
          }),
          false: httpBatchStreamLink({
            url: getBaseUrl() + "/api/trpc",
            transformer: SuperJSON, // required on link
            headers: () => {
              const headers = new Headers();
              headers.set("x-trpc-source", "nextjs-react");
              return headers;
            },
          }),
        }),
      ],
    });
  });

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  );
}
