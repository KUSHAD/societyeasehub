/**
 * v0 by Vercel.
 * @see https://v0.dev/t/OVpH6B3Q5CV
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Image from "next/image";
import { Suspense, type JSX, type SVGProps } from "react";
import Skeleton from "react-loading-skeleton";
import { CardContent, Card } from "~/components/ui/card";
import GetStartedButton from "./GetStartedButton";

export default function LandingPage() {
  return (
    <div className="bg-backgroundtext-foregroud dark:bg-backgrounddark:text-foregroud min-h-screen">
      <header className="bg-card text-card-foreground shadow dark:bg-card dark:text-card-foreground">
        <div className="container mx-auto flex flex-col items-center px-6 py-16">
          <Image
            alt="Building Icon"
            className="mb-6"
            height="120"
            src="/favicon.png"
            style={{
              aspectRatio: "120/120",
              objectFit: "cover",
            }}
            width="120"
          />
          <h1 className="mb-2 text-center text-4xl font-bold">
            SocietyEaseHub
          </h1>
          <h2 className="mb-2 text-center text-2xl font-bold">
            Society Management, Simplified
          </h2>
          <p className="mb-6 text-center">
            Manage your society operations seamlessly with our comprehensive
            SaaS platform.
          </p>
          <Suspense fallback={<Skeleton className="h-[50px] w-[200px]" />}>
            <GetStartedButton />
          </Suspense>
        </div>
      </header>
      <section className="container mx-auto px-6 py-16" id="features">
        <h2 className="mb-8 text-center text-3xl font-bold">Key Features</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-card text-card-foreground dark:bg-card dark:text-card-foreground">
            <CardContent>
              <SaveIcon className="mb-4 h-12 w-12 text-primary dark:text-primary-foreground" />
              <h3 className="text-lg font-semibold">Creating Societies</h3>
              <p>
                Easily set up and customize your society structure within
                minutes.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card text-card-foreground dark:bg-card dark:text-card-foreground">
            <CardContent>
              <LockIcon className="mb-4 h-12 w-12 text-primary dark:text-primary-foreground" />
              <h3 className="text-lg font-semibold">Role-Based Access</h3>
              <p>
                Control permissions with role-based access for members and
                administrators.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card text-card-foreground dark:bg-card dark:text-card-foreground">
            <CardContent>
              <GiftIcon className="mb-4 h-12 w-12 text-primary dark:text-primary-foreground" />
              <h3 className="text-lg font-semibold">Invite-Only Membership</h3>
              <p>
                Maintain exclusivity with an invitation-only membership system.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card text-card-foreground dark:bg-card dark:text-card-foreground">
            <CardContent>
              <ActivityIcon className="mb-4 h-12 w-12 text-primary dark:text-primary-foreground" />
              <h3 className="text-lg font-semibold">Managing Accounts</h3>
              <p>
                Keep track of society finances with integrated account
                management.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card text-card-foreground dark:bg-card dark:text-card-foreground">
            <CardContent>
              <MapIcon className="mb-4 h-12 w-12 text-primary dark:text-primary-foreground" />
              <h3 className="text-lg font-semibold">Managing Roadmaps</h3>
              <p>
                Plan and visualize your society's future with strategic
                roadmaps.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      <footer className="bg-card text-card-foreground shadow dark:bg-card dark:text-card-foreground">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <p>
              © {new Date().getFullYear()} SocietyEaseHub. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <a href="https://twitter.com/__toxic_stan_" target="_blank">
                <TwitterIcon className="h-6 w-6 text-primary dark:text-primary-foreground" />
              </a>
              <a
                href="https://www.facebook.com/dev.chakraborty.5836711"
                target="_blank"
              >
                <FacebookIcon className="h-6 w-6 text-primary dark:text-primary-foreground" />
              </a>
              <a
                href="https://www.instagram.com/another_toxic_stan"
                target="_blank"
              >
                <InstagramIcon className="h-6 w-6 text-primary dark:text-primary-foreground" />
              </a>
              <a href="https://github.com/KUSHAD">
                <GithubIcon className="h-6 w-6 text-primary dark:text-primary-foreground" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ActivityIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

function FacebookIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function GiftIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect width="20" height="5" x="2" y="7" />
      <line x1="12" x2="12" y1="22" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  );
}

function GithubIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="lucide lucide-github"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LockIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function MapIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" x2="9" y1="3" y2="18" />
      <line x1="15" x2="15" y1="6" y2="21" />
    </svg>
  );
}

function SaveIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

function TwitterIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

function InstagramIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="lucide lucide-instagram"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
