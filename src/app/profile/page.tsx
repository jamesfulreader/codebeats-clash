import { auth } from "~/server/auth";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) {
    return (
      <div className="container mx-auto max-w-lg justify-center space-y-6 p-8">
        <p className="glow-cyan text-2xl">
          You must be signed in to view this page
        </p>
      </div>
    );
  }
  return (
    <div className="container mx-auto max-w-lg space-y-6 p-8">
      <h1 className="glow-magenta text-4xl font-medium">Profile</h1>
      <p>Welcome back {session.user.name}!</p>
      <p>Your stats:</p>
    </div>
  );
}
