"use client";

import { useShareModalStore } from "~/store/shareModal";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import { CheckCheck, Copy } from "lucide-react";
import { useCopyToClipboard } from "@uidotdev/usehooks";

export default function IntegrateJson() {
  const { apiKey, uri } = useShareModalStore();

  const [copiedText, copyToClipboard] = useCopyToClipboard();
  const hasCopiedText = Boolean(copiedText);

  const codeBlock = `function getData() {
  const res = await fetch('${uri}?apiKey=${apiKey}&res=json')
  const data = await res.json()
  return data
}`;
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
