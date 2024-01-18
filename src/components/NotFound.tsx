import { Ghost } from "lucide-react";
import React from "react";

interface NotFoundProps {
  message: string;
  description?: string;
  children?: React.ReactNode;
}

export default function NotFound({
  message,
  description,
  children,
}: NotFoundProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Ghost className="h-8 w-8 text-zinc-800" />
      <h3 className="text-xl font-semibold">{message}</h3>
      <p>{description ?? ""}</p>
      {children}
    </div>
  );
}
