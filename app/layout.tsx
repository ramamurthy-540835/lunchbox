import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./franchise-insights.css";
import "./v2-pages.css";
import V2ModeNotice from "@/components/V2ModeNotice";

export const viewport: Viewport = { themeColor: "#18392c", colorScheme: "light" };

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_LUNCHBOX_ENV === "v2" ? "LunchBox V2 | Development" : "LunchBox | Better school lunches",
  description: "Balanced school lunches for students in Tamil Nadu.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "LunchBox", statusBarStyle: "default" },
  icons: { icon: "/icons/lunchbox-192.png", apple: "/icons/apple-touch-icon.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><V2ModeNotice />{children}</body>
    </html>
  );
}
