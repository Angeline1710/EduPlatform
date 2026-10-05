import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Nav from "@/components/Nav";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Heartbeat from "@/components/Heartbeat";
import AmbientCanvas from "@/components/art/AmbientCanvas";

import PageTransition from "@/components/magic/PageTransition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Display face for the wordmark, headlines, and prices — the mockup's
// lettering is a high-contrast serif, not the UI sans.
const displaySerif = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "EduPlatform",
  description: "Learn new skills with expert-led online courses.",
};

// Applies the stored theme before first paint so the page never flashes
// the wrong palette. Must stay in sync with ThemeToggle's storage key.
const themeScript = `
(function(){try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${displaySerif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <body className="bg-[var(--shell)] text-[var(--text)]">
        <Providers>
          {/* Reports presence so the admin's live count is real */}
          <Heartbeat />
          {/* Living backdrop, so the artwork continues past the hero */}
          <AmbientCanvas />
          {/* Rail + column. The rail is its own scroll context so the main
              column scrolls independently, as in the reference layout. */}
          {/* First stop for a keyboard visitor, past the rail and the bar. */}
          <a href="#main" className="skip-link">
            Skip to content
          </a>

          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
              <Nav />
              {/* A real landmark, so assistive tech can jump straight here. */}
              <main id="main" className="flex-1">
                <PageTransition>{children}</PageTransition>
              </main>
              <Footer />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
