export default function Footer() {
  return (
    <footer className="bg-dark glow-magenta p-4 text-center text-white">
      <div className="container mx-auto">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Codebeats Clash.
        </p>
        <p className="mt-2 text-xs">Made with ❤️ by jamesfulreader</p>
      </div>
    </footer>
  );
}
