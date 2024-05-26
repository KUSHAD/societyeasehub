import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { env } from "~/env";
import countries from "world-countries";
import { type HomeFeature } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  const url =
    env.NODE_ENV === "production"
      ? "https://societyeasehub.vercel.app"
      : "http://localhost:3000";
  return `${url}${path}`;
}

export const formattedCountries = countries.map((country) => ({
  label: country.name.common,
}));

export const uploaderClassName =
  "ut-allowed-content:ut-uploading:text-danger bg-transparent ut-label:text-lg ut-label:text-primary ut-button:cursor-pointer ut-button:ut-uploading:cursor-not-allowed ut-button:ut-uploading:bg-primary/70 ut-button:ut-uploading:after:bg-primary ut-button:bg-primary";

export function getAuthErrors(errorCode: string) {
  const errors = {
    Signin: "Try signing with a different account.",
    OAuthSignin: "Try signing with a different account.",
    OAuthCallback: "Try signing with a different account.",
    OAuthCreateAccount: "Try signing with a different account.",
    EmailCreateAccount: "Try signing with a different account.",
    Callback: "Try signing with a different account.",
    OAuthAccountNotLinked:
      "To confirm your identity, sign in with the same account you used originally.",
    EmailSignin: "Check your email address.",
    CredentialsSignin:
      "Sign in failed. Check the details you provided are correct.",
    default: "Unable to sign in.",
  };

  const message =
    errorCode && (errors[errorCode as keyof typeof errors] ?? errors.default);

  return message;
}

export const pricingFeatures = [
  "Create unlimited societies",
  "Assign limitless roles",
  "Accommodate infinite members",
  "Send unlimited society invites",
  "Comprehensive accounts management",
  "Design unlimited roadmaps",
  "Host unlimited society meetings",
  "Broadcast announcements effortlessly",
  "Conduct engaging polls",
  "Interactive channel-based chat",
];

export const homeFeatures: HomeFeature[] = [
  {
    title: "Creating Societies",
    description:
      "Effortlessly set up and tailor your society's structure with just a few clicks.",
  },
  {
    title: "Role-Based Access",
    description:
      "Seamlessly control permissions and access for different members within your society.",
  },
  {
    title: "Accommodate Infinite Members",
    description:
      "Grow your society without any limitations on the number of members.",
  },
  {
    title: "Invite-Only Membership",
    description:
      "Ensure exclusivity and privacy by inviting members to join your society.",
  },
  {
    title: "Unlimited Society Invites",
    description:
      "Extend limitless invitations to grow your society without restrictions.",
  },
  {
    title: "Managing Accounts",
    description: "Easily track financial transactions and manage member dues.",
  },
  {
    title: "Managing Roadmaps",
    description:
      "Strategically plan and visualize future projects and maintenance schedules.",
  },
  {
    title: "Host Unlimited Meetings",
    description:
      "Conduct an unlimited number of meetings to keep your society engaged and informed.",
  },
  {
    title: "Effortless Announcements",
    description: "Broadcast announcements seamlessly to all society members.",
  },
  {
    title: "Engaging Polls",
    description:
      "Organize interactive polls to gather opinions and make decisions.",
  },
  {
    title: "Channel-Based Chat",
    description:
      "Facilitate dynamic and organized communication with channel-based chat.",
  },
];

export async function getMediaTypeFromURL(uri: string) {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob.type;
  } catch (error) {
    console.error("Error fetching MIME type:", error);
    return "";
  }
}

export function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed!);

  return result;
}
export function generateRandomColor(): string {
  const r = Math.floor(Math.random() * 256); // Random number between 0 and 255 for red
  const g = Math.floor(Math.random() * 256); // Random number between 0 and 255 for green
  const b = Math.floor(Math.random() * 256); // Random number between 0 and 255 for blue

  return `rgb(${r}, ${g}, ${b})`;
}

export function getDateRange(start: Date, end: Date): Date[] {
  const arr: Date[] = [];
  for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
    arr.push(new Date(dt));
  }
  return arr;
}

export const DAY_IN_MS = 86_400_000;
