import Link from "next/link";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      <main className="bg-dark flex flex-col items-center justify-between p-24">
        <div className="flex flex-col items-center space-y-4 text-white">
          {session?.user ? (
            <p className="text-lg">
              Welcome Back DJ{" "}
              <span className="glow-magenta">{session.user.name}</span>
            </p>
          ) : (
            <p className="text-lg">You are not logged in</p>
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
        </div>
        <div className="mt-5 space-x-7 text-white">
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
      </main>
    </HydrateClient>
  );
}
