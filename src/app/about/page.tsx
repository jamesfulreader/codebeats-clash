export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-lg space-y-6 p-8">
      <h1 className="glow-magenta text-4xl font-medium">
        About CodeBeats Clash
      </h1>
      <p className="text-lg">
        CodeBeats Clash is a real-time DJ battle arena where your code becomes
        the beat. Challenge friends, craft 30-second jams, and let the community
        decide the champion.
      </p>
      <h2 className="glow-cyan mt-8 text-2xl font-semibold">How it works</h2>
      <ol className="list-inside list-decimal space-y-2">
        <li>Pick a mood wave (Lofi, House, etc.)</li>
        <li>Live-code your 30s beat in Strudel.cc</li>
        <li>Lock in &amp; let the audience vote</li>
      </ol>
      <p className="mt-8">
        Built with Next.js, T3 Stack, Tailwind CSS, Prisma, Neon.
      </p>
      <p className="mt-8 text-lg">
        <a
          href="https://github.com/yourrepo"
          className="hover:text-neon-lime underline"
          target="_blank"
          rel="noreferrer"
        >
          View on GitHub
        </a>
      </p>
    </div>
  );
}
