import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { env } from "~/env";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  if (typeof window !== "undefined") return path;
  if (env.NEXTAUTH_URL) return `https://${env.NEXTAUTH_URL}${path}`;
  return `http://localhost:${process.env.PORT ?? 3000}${path}`;
}
