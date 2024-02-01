import { type MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    theme_color: "#18181b",
    background_color: "#18181b",
    display: "standalone",
    scope: "/",
    start_url: "/dashboard",
    name: "SocietyEaseHub",
    short_name: "SocietyEaseHub",
    description:
      "Effortlessly manage societies with our SaaS society management system. Enjoy role-based access, invite-only memberships, streamlined account management, and efficient roadmap tracking. Elevate your community management experience today!",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-256x256.png",
        sizes: "256x256",
        type: "image/png",
      },
      {
        src: "/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
