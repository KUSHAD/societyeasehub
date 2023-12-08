import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" passHref className="mr-auto">
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
