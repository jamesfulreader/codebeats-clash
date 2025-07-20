import Link from "next/link";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      <main className="bg-dark flex h-screen flex-col items-center justify-between">
        <div className="flex flex-col items-center space-y-4">
          {session?.user ? (
            <p className="text-lg">
              Welcome Back DJ{" "}
              <span className="glow-magenta">{session.user.name}</span>
            </p>
          ) : (
            <Link
              href="/api/auth/signin"
              className="text-lg hover:[text-shadow:0_0_4px_var(--neon-cyan),0_0_8px_var(--neon-cyan),0_0_16px_var(--neon-cyan)]"
            >
              Sign In with Discord
            </Link>
          )}
          <h1 className="glow-magenta text-5xl font-bold text-white">
            Codebeats Clash
          </h1>
          <p>Where code meets beats--join live DJ battles</p>
          <p className="space-x-2">
            <span className="glow-lime">Challenge.</span>
            <span className="glow-magenta">Create.</span>
            <span className="glow-cyan">Clash.</span>
          </p>
          <div className="mt-5 space-x-7">
            <Link
              className="rounded bg-cyan-600 px-4 py-2 hover:bg-cyan-300"
              href="/create-battle"
            >
              Create Battle
            </Link>
            <Link
              className="rounded bg-purple-600 px-4 py-2 hover:bg-purple-300"
              href="#arenas"
            >
              Browse Arenas
            </Link>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
