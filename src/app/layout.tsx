import "~/styles/globals.css";
import "react-loading-skeleton/dist/skeleton.css";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import { cn } from "~/lib/utils";
import { Toaster } from "~/components/ui/toaster";
import { ourFileRouter } from "~/server/storage";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { NextAuthReactProvider } from "~/next-auth/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { type Metadata } from "next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "SocietyEaseHub",
  description:
    "Effortlessly manage societies with our SaaS society management system. Enjoy role-based access, invite-only memberships, streamlined account management, and efficient roadmap tracking. Elevate your community management experience today!",
  keywords: [
    "Society management system",
    "SaaS community platform",
    "Role-based access",
    "Invite-only memberships",
    "Account management",
    "Roadmap tracking",
    "Community software",
    "Society administration tool",
    "Membership management",
  ],
  metadataBase:new URL("https://societyeasehub.vercel.app/")
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
        )}
      >
        <div className="m-auto w-full max-w-screen-lg">
          <TRPCReactProvider cookies={cookies().toString()}>
            <NextAuthReactProvider>
              <NextSSRPlugin
                routerConfig={extractRouterConfig(ourFileRouter)}
              />
              {children}
              <Toaster />
              <SpeedInsights debug />
              <Analytics />
            </NextAuthReactProvider>
          </TRPCReactProvider>
        </div>
      </body>
    </html>
  );
}
