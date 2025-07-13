import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import Navbar from "./_components/Navbar";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      <Navbar />
      <main className="bg-dark flex min-h-screen flex-col items-center justify-between p-24">
        <h1 className="glow-magenta text-5xl font-medium text-white">
          Welcome to Codebeats
        </h1>
        <div className="text-neon-cyan glow-cyan text-5xl">
          {session?.user ? (
            <p className="text-lg">Logged in as {session.user.email}</p>
          ) : (
            <p className="text-lg">You are not logged in</p>
          )}
        </div>
      </main>
    </HydrateClient>
  );
}
