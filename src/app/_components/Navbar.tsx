import { auth } from "~/server/auth";
import Link from "next/link";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="bg-dark p-4 text-white transition-all duration-200">
      <div className="container mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold hover:[text-shadow:0_0_4px_var(--neon-magenta),0_0_8px_var(--neon-magenta),0_0_16px_var(--neon-magenta)]"
        >
          Codebeats Clash
        </Link>
        <div className="text-md flex space-x-4 font-bold">
          {session?.user ? (
            <>
              <Link
                href="/create-battle"
                className="hover:[text-shadow:0_0_4px_var(--neon-magenta),0_0_8px_var(--neon-magenta),0_0_16px_var(--neon-magenta)]"
              >
                Create Battle
              </Link>
              <Link
                href="/about"
                className="hover:[text-shadow:0_0_4px_var(--neon-magenta),0_0_8px_var(--neon-magenta),0_0_16px_var(--neon-magenta)]"
              >
                About
              </Link>
              <Link
                href="/profile"
                className="hover:[text-shadow:0_0_4px_var(--neon-magenta),0_0_8px_var(--neon-magenta),0_0_16px_var(--neon-magenta)]"
              >
                Profile
              </Link>
              <Link
                href="/api/auth/signout"
                className="hover:[text-shadow:0_0_4px_var(--neon-magenta),0_0_8px_var(--neon-magenta),0_0_16px_var(--neon-magenta)]"
              >
                Sign Out
              </Link>
            </>
          ) : (
            <Link
              href="/api/auth/signin"
              className="text-lg hover:[text-shadow:0_0_4px_var(--neon-magenta),0_0_8px_var(--neon-magenta),0_0_16px_var(--neon-magenta)]"
            >
              Sign In with Discord
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
