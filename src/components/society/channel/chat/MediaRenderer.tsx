import Image from "next/image";

export default function MediaRenderer({
  uri,
  type,
}: {
  uri: string;
  type: "image" | "video";
}) {
  return (
    <div className="snap-center">
      {type === "image" ? (
        <Image src={uri} alt="Message Attachment" width={100} height={100} />
      ) : type === "video" ? (
        <video src={uri} />
      ) : (
        <iframe src={uri} />
      )}
    </div>
  );
}
