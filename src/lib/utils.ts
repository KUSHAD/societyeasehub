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
  "ut-allowed-content:ut-uploading:text-danger bg-transparent ut-label:text-lg ut-label:text-primary ut-button:ut-uploading:bg-primary/70 ut-button:ut-uploading:after:bg-primary ut-button:bg-primary";

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
  "Unlimited society creation",
  "Unlimited roles",
  "Unlimited members",
  "Accounts management",
  "Unlimited roadmaps",
];

export const homeFeatures: HomeFeature[] = [
  {
    title: "Creating Societies",
    description:
      "Easily set up and customize your society's structure with a few clicks.",
  },
  {
    title: "Role-Based Access",
    description:
      "Control permissions and access for different members within your society.",
  },
  {
    title: "Invite-Only Membership",
    description:
      "Maintain exclusivity and privacy by inviting members to join your society.",
  },
  {
    title: "Managing Accounts",
    description:
      "Keep track of financial transactions and member dues with ease.",
  },
  {
    title: "Managing Roadmaps",
    description:
      "Plan and visualize future projects and maintenance schedules.",
  },
];
