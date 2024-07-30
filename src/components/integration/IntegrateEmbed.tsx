"use client";

import { useCopyToClipboard } from "@uidotdev/usehooks";
import { useShareModalStore } from "~/store/shareModal";
import { toast } from "../ui/use-toast";
import { Button } from "../ui/button";
import { CheckCheck, Copy } from "lucide-react";

export default function IntegrateEmbed() {
  const { apiKey, uri } = useShareModalStore();

  const [copiedText, copyToClipboard] = useCopyToClipboard();
  const hasCopiedText = Boolean(copiedText);

  const codeBlock = `<iframe
  className="w-full h-screen"
  src="${uri}?apiKey=${apiKey}&res=embed"
>`;

  return (
    <>
      <div className="my-2 flex flex-row">
        <div className="mr-auto">
          <strong>Copy Code</strong>
        </div>
        <Button
          variant="outline"
          size="icon"
          disabled={hasCopiedText}
          onClick={async () => {
            await copyToClipboard(codeBlock);

            toast({
              title: "Message",
              description: "Code copied to clipboard",
            });
          }}
        >
          {hasCopiedText ? <CheckCheck /> : <Copy />}
        </Button>
      </div>
      <pre className="w-full overflow-auto rounded bg-primary text-white">
        <div className="p-2">
          <code>{codeBlock}</code>
        </div>
      </pre>
    </>
  );
}
