"use client";

import { useCopyToClipboard } from "@uidotdev/usehooks";
import { useShareModalStore } from "~/store/shareModal";
import { toast } from "../ui/use-toast";
import { Button } from "../ui/button";
import { CheckCheck, Copy } from "lucide-react";
import { useAPIKeyStore } from "~/store/apiKey";
import { useParams } from "next/navigation";

export default function IntegrateEmbed() {
  const { societyId } = useParams<{ societyId: string }>();
  const { uri } = useShareModalStore();
  const { getAPIKey } = useAPIKeyStore();

  const [copiedText, copyToClipboard] = useCopyToClipboard();
  const hasCopiedText = Boolean(copiedText);

  const codeBlock = `<iframe
  className="w-full h-screen"
  src="${uri}?apiKey=${getAPIKey(societyId)}&res=embed"
>`;

  return (
    <>
      <div className="my-2 flex w-fit flex-row">
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
      <pre className="w-fit overflow-auto rounded bg-primary text-white">
        <div className="p-2">
          <code>{codeBlock}</code>
        </div>
      </pre>
    </>
  );
}
