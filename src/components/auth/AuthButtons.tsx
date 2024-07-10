"use client";

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
        Sign in with Google
      </Button>
    </div>
  );
}
