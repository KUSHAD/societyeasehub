import { type MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/pricing", "/auth", "/tos", "/privacy", "/cookie","/refund","/support"],
      disallow: ["/dashboard", "/profile", "/society/*", "/society", "/invite"],
    },
  };
}
