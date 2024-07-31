"use client";

import { useShareModalStore } from "~/store/shareModal";
import { Button } from "../ui/button";
import { CheckCheck, Copy } from "lucide-react";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { toast } from "../ui/use-toast";
import { useAPIKeyStore } from "~/store/apiKey";
import { useParams } from "next/navigation";

export default function IntegrateNextjs() {
  const { uri } = useShareModalStore();
  const { societyId } = useParams<{ societyId: string }>();
  const { getAPIKey } = useAPIKeyStore();

  const [copiedText, copyToClipboard] = useCopyToClipboard();
  const hasCopiedText = Boolean(copiedText);

  const codeBlock = `// in next.config.js

const otherNextConfigs = {
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    remotePatterns: [],
  },
}

module.exports = {
  ...otherNextConfigs,
  async rewrites() {
      return [
        source: '/your-route',
        destination:'${uri}?apiKey=${getAPIKey(societyId)}&res=embed'
      ]
  }
}`;
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
      <pre className="w-full overflow-auto rounded bg-primary text-white">
        <div className="p-2">
          <code>{codeBlock}</code>
        </div>
      </pre>
    </>
  );
}
