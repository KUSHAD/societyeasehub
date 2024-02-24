import Image from "next/image";

export default function SocietyIllustration() {
  return (
    <div className="lg:w-1/2">
      <Image
        alt="Society Management Illustration"
        className="h-auto w-full"
        height="400"
        src="/favicon.png"
        style={{ aspectRatio: "600/400", objectFit: "cover" }}
        width="600"
      />
    </div>
  );
}
