import Image from "next/image";
import Link from "next/link";

export default function Logo({ isPublic }: { isPublic?: boolean }) {
  return (
    <Link href={isPublic ? "/" : "/dashboard"} passHref className="mr-auto">
      <Image
        alt="App Logo"
        src={"/favicon.ico"}
        height={64}
        width={64}
        quality={100}
      />
    </Link>
  );
}
