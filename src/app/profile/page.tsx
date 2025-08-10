"use client";

import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const {
    data: profile,
    isLoading,
    isError,
  } = api.profile.getProfile.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  if (status === "loading" || isLoading) {
    return (
      <div className="flex justify-center p-8">
        <p className="glow-cyan text-2xl">Loading Profile. . .</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="container mx-auto flex justify-center p-8">
        <p className="glow-cyan text-2xl">
          You must sign in with Discord to view your DJ profile
        </p>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="container mx-auto p-8">
        <p className="text-red-500">Failed to load profile.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto h-screen max-w-lg space-y-6 p-8">
      <h1 className="glow-cyan text-4xl font-medium">DJ Profile</h1>
      <p>
        <span className="font-semibold">Name:</span> {profile.name}
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded bg-gray-800 p-4">
          <h2 className="text-xl">Wins</h2>
          <p className="text-neon-lime text-2xl">{profile.wins}</p>
        </div>
        <div className="rounded bg-gray-800 p-4">
          <h2 className="text-xl">Losses</h2>
          <p className="text-neon-magenta text-2xl">{profile.losses}</p>
        </div>
      </div>
    </div>
  );
}
