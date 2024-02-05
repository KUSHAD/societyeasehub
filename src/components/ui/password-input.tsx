"use client";

/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/threlMtHpMw
 */
import { Input, type InputProps } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { useState } from "react";

export function PasswordInput(props: InputProps) {
  const [showPass, setShowPass] = useState(false);
  return (
    <div className="relative">
      <Input {...props} type={showPass ? "text" : "password"} />
      <Button
        type="button"
        onClick={() => setShowPass((_prevState) => !_prevState)}
        className="absolute right-2 top-1/2 -translate-y-1/2 transform"
        size="icon"
        variant="ghost"
      >
        {showPass ? (
          <EyeOpenIcon className="h-4 w-4" />
        ) : (
          <EyeClosedIcon className="h-4 w-4" />
        )}
        <span className="sr-only">Toggle password visibility</span>
      </Button>
    </div>
  );
}
