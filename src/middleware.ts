export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard",
    "/profile",
    "/subscription",
    "/invite",
    "/society/:path*",
  ],
};
