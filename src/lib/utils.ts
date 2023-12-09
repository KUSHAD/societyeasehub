import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { getBaseUrl } from "~/trpc/shared";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  return `${getBaseUrl()}${path}`;
}
