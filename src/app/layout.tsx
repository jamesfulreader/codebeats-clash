import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";
import { Providers } from "./providers";

// tRPC client (Client Component provider)
import { TRPCReactProvider } from "~/trpc/react";
// RSC hydration helpers (Server file exporting a Client hydrator)
import { HydrateClient } from "~/trpc/server";

export const metadata: Metadata = {
  title: "CodeBeats Clash",
  description: "Real-time DJ battles with live coding & voting",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={geist.variable}>
      <body>
        <Providers>
          {/* tRPC + React Query client w/ wsLink + httpBatchStreamLink */}
          <TRPCReactProvider>
            {/* Hydrates any data prefetched in RSC with createHydrationHelpers */}
            <HydrateClient>
              <Navbar />
              {children}
              <Footer />
            </HydrateClient>
          </TRPCReactProvider>
        </Providers>
      </body>
    </html>
  );
}
