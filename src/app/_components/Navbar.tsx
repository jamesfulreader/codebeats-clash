import { auth } from "~/server/auth";
import { type GetServerSideProps } from "next";
import Link from "next/link";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="bg-dark text-neon-cyan glow-cyan p-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-medium">
          Codebeats
        </Link>
        <div className="glow-cyan flex space-x-4">
          {session?.user ? (
            <>
              <Link href="/profile" className="text-lg">
                Profile
              </Link>
              <Link href="/api/auth/signout" className="text-lg">
                Sign Out
              </Link>
            </>
          ) : (
            <Link href="/api/auth/signin" className="text-lg">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
