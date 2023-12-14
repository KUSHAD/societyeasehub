"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

interface SocietyCardProps {
  society: {
    id: string;
    name: string;
    _count: {
      members: number;
    };
    ownerEmail: string;
    owner: {
      name: string | null;
    };
  };
}

const SocietyCard: React.FC<SocietyCardProps> = ({ society }) => {
  const { data } = useSession();
  return (
    <Link
      href={`/society/${society.id}`}
      className="scale-95 cursor-pointer rounded bg-secondary shadow  transition-transform ease-in-out hover:scale-100"
    >
      <div className="flex flex-col truncate px-2 py-4">
        <strong>{society.name}</strong>
        <em>
          Owned by{" "}
          {data?.user.email === society.ownerEmail ? "Me" : society.owner.name}
        </em>
        <p>{society._count.members} Members</p>
      </div>
    </Link>
  );
};
export default SocietyCard;
