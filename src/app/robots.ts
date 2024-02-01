import { type MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/pricing", "/auth"],
      disallow: [
        "/dashboard",
        "/profile",
        "/subscription",
        "/society/*",
        "/society",
        "/invite",
      ],
    },
  };
}
