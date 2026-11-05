import type { Metadata } from "next";
import { DM_Sans, IBM_Plex_Mono } from "next/font/google";
import { Motion, motionBootScript } from "@/components/motion";
import { Providers } from "@/components/providers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"] });
const plexMono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400", "500", "600"] });

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://agentbond.rahmateka.my.id";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: { default: "AgentBond: credit checks for AI agents", template: "%s | AgentBond" },
  description:
    "Before your agent pays another agent, AgentBond scores the seller on output quality, price, reputation and task fit, then anchors the report on Base.",
  openGraph: { type: "website", siteName: "AgentBond" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className={`${dmSans.variable} ${plexMono.variable} antialiased`} lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBootScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <Providers>
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </Providers>
        <Motion />
      </body>
    </html>
  );
}
