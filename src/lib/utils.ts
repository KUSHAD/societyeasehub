import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { env } from "~/env";
import countries from "world-countries";
import { type HomeFeature, type ActiveDaysData, type Period } from "./types";
import {
  eachDayOfInterval,
  format,
  isSameDay,
  subDays,
  isValid,
} from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  const url = env.NEXT_PUBLIC_ABSOLUTE_URL;
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
  "Effortlessly Create Unlimited Societies",
  "Assign Limitless Roles with Precision",
  "Seamlessly Accommodate Infinite Members",
  "Send Unlimited Society Invites Instantly",
  "Comprehensive Finance Management",
  "Design Unlimited Roadmaps for Strategic Success",
  "Host Unlimited Society Meetings",
  "Broadcast Announcements with Ease",
  "Conduct Engaging and Interactive Polls",
  "Utilize Dynamic Channel-Based Chat",
];

export const homeFeatures: HomeFeature[] = [
  {
    title: "Create Societies with Ease",
    description:
      "Effortlessly set up and customize your society's structure with just a few clicks, streamlining your organization’s foundation.",
  },
  {
    title: "Role-Based Access Control",
    description:
      "Precisely control permissions and access levels for different members within your society, ensuring smooth and secure operations.",
  },
  {
    title: "Accommodate Infinite Members",
    description:
      "Expand your society without any limitations on member count, allowing for unlimited growth and inclusivity.",
  },
  {
    title: "Exclusive Invite-Only Membership",
    description:
      "Maintain the exclusivity and privacy of your society by inviting members personally, ensuring a trusted community.",
  },
  {
    title: "Unlimited Society Invites",
    description:
      "Grow your society without restrictions by sending unlimited invitations, facilitating effortless expansion.",
  },
  {
    title: "Effortless Finance Management",
    description:
      "Easily track financial transactions and manage member dues, providing financial clarity and peace of mind.",
  },
  {
    title: "Strategic Roadmap Planning",
    description:
      "Plan and visualize future projects and maintenance schedules with precision, driving your society’s success.",
  },
  {
    title: "Host Unlimited Society Meetings",
    description:
      "Keep your society engaged and informed with unlimited meetings, ensuring seamless communication and collaboration.",
  },
  {
    title: "Effortless Announcements",
    description:
      "Broadcast announcements seamlessly to all members, ensuring everyone stays informed and connected.",
  },
  {
    title: "Engaging Interactive Polls",
    description:
      "Conduct interactive polls to gather opinions and make informed decisions, promoting active member participation.",
  },
  {
    title: "Dynamic Channel-Based Chat",
    description:
      "Facilitate organized and vibrant communication with our dynamic channel-based chat, enhancing member interaction.",
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

export const DAY_IN_MS = 86_400_000;

export function convertAmountFromMiliUnits(amount: number) {
  return amount / 1000;
}

export function convertAmountToMiliUnits(amount: number) {
  return Math.round(amount * 1000);
}

export function formatCurrency(amount: number) {
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatPercentage(
  value: number,
  options: { addPrefix?: boolean } = { addPrefix: false },
) {
  const formattedPercentage = new Intl.NumberFormat("en-US", {
    style: "percent",
  }).format(value / 100);

  if (options.addPrefix && value > 0) return `+${formattedPercentage}`;

  return formattedPercentage;
}

export function calculatePercentageChange(current: number, previous: number) {
  if (previous === 0) return previous === current ? 0 : 100;

  return ((current - previous) / previous) * 100;
}

export function fillMissingDays(
  activeDays: ActiveDaysData[],
  startDate: Date,
  endDate: Date,
) {
  if (activeDays.length === 0) return [];

  const allDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const transactionsByDate = allDays.map((day) => {
    const found = activeDays.find((d) => isSameDay(d.date, day));

    if (found) return found;
    else
      return {
        date: day,
        income: 0,
        expense: 0,
      };
  });

  return transactionsByDate;
}

export function formatDateRange(period?: Period): string {
  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  const from = period?.from && isValid(period.from) ? period.from : defaultFrom;
  const to = period?.to && isValid(period.to) ? period.to : defaultTo;

  if (!period?.from) {
    return `${format(defaultFrom, "LLL dd")} - ${format(defaultTo, "LLL dd, y")}`;
  }

  if (period?.to) {
    return `${format(from as Date, "LLL dd")} - ${format(to as Date, "LLL dd, y")}`;
  }

  return format(from as Date, "LLL dd, y");
}
