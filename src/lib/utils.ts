import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { env } from "~/env";
import countries from "world-countries";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  const url =
    env.NODE_ENV === "production"
      ? "https://flat-management-system.vercel.app"
      : "http://localhost:3000";
  return `${url}${path}`;
}

export const formattedCountries = countries.map((country) => ({
  label: country.name.common,
}));
