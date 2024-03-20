/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");
import million from "million/compiler";

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
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

const millionConfig = {
  auto: {
    threshold: 0.05, // default: 0.1,
    rsc: true,
  },
};

export default million.next(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  nextConfig,
  millionConfig,
);
