import { type MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://societyeasehub.vercel.app/",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: "https://societyeasehub.vercel.app/auth",
      lastModified: new Date(),
      changeFrequency: "never",
      priority: 0.8,
    },
    {
      url: "https://societyeasehub.vercel.app/dashboard",
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 0.8,
    },
    {
      url: "https://societyeasehub.vercel.app/pricing",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}
