"use client";

import React from "react";

interface ListWrapperProps {
  children: React.ReactNode;
}

export default function ListWrapper({ children }: ListWrapperProps) {
  return (
    <div className="h-full w-[272px] shrink-0 select-none">{children}</div>
  );
}
