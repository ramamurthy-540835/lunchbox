import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  const isV2 = process.env.NEXT_PUBLIC_LUNCHBOX_ENV === "v2";
  return {
    id: isV2 ? "/lunchbox-v2" : "/",
    name: isV2 ? "LunchBox V2 Development" : "LunchBox by ChennaiFood",
    short_name: isV2 ? "LunchBox V2" : "LunchBox",
    description: "Balanced school lunches delivered to onboarded schools in Tamil Nadu.",
    start_url: isV2 ? "/?app=lunchbox-v2" : "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#fffdf7",
    theme_color: "#18392c",
    categories: ["food", "education", "lifestyle"],
    icons: [
      { src: "/icons/lunchbox-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/lunchbox-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/lunchbox-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
