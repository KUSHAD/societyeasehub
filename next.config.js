/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  experimental: {
    ppr: true,
    typedRoutes: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "lh3.googleusercontent.com",
        protocol: "https",
      },
      {
        hostname: "res.cloudinary.com",
        protocol: "https",
        pathname: "/dst2pmia1/image/upload/**",
      },
      {
        hostname: "utfs.io",
        protocol: "https",
        pathname: "/f/**",
      },
      { hostname: "cdn.discordapp.com", protocol: "https" },
    ],
  },
};

export default config;
