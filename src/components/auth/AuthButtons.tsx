"use client";

import { DiscordLogoIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

export default function AuthButtons() {
  return (
    <div className="flex flex-col">
      <Button
        className="my-2 w-full"
        onClick={() =>
          signIn("google", { redirect: false, callbackUrl: "/dashboard" })
        }
      >
        <FcGoogle className="mx-2" />
        Sign In With Google
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          signIn("github", { redirect: false, callbackUrl: "/dashboard" })
        }
        className="my-2 w-full"
      >
        <GitHubLogoIcon className="mx-2" />
        Sign In With Github
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          signIn("discord", { redirect: false, callbackUrl: "/dashboard" })
        }
        className="my-2 w-full"
      >
        <DiscordLogoIcon className="mx-2" />
        Sign In With Discord
      </Button>
    </div>
  );
}
