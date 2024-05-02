"use client";

import { useParams } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import NotFound from "~/components/NotFound";
import { SheetHeader, SheetTitle } from "~/components/ui/sheet";
import { api } from "~/trpc/react";
import MediaRenderer from "../channel/chat/MediaRenderer";
import { Button } from "~/components/ui/button";
import { toast } from "~/components/ui/use-toast";
import { AspectRatio } from "~/components/ui/aspect-ratio";

export default function ViewDocs({ transactionId }: { transactionId: string }) {
  const { id } = useParams<{ id: string }>();
  const utils = api.useUtils();
  const { isLoading: deleting, mutate: remove } =
    api.transactionDocs.delete.useMutation({
      async onSuccess() {
        await utils.transactionDocs.getByTransaction.invalidate({
          societyId: id,
          transactionId,
        });
        toast({
          title: "Message",
          description: "Document Deleted ",
        });
      },
    });
  const { data: docs, isLoading } =
    api.transactionDocs.getByTransaction.useQuery({
      transactionId,
      societyId: id,
    });

  const { data: canManage, isLoading: gettingPerms } =
    api.member.canManageAccounts.useQuery({
      societyId: id,
    });
  return (
    <>
      <SheetHeader>
        <SheetTitle>Transaction Documents</SheetTitle>
      </SheetHeader>
      {isLoading ? (
        <AspectRatio ratio={1 / 1}>
          <Skeleton className="my-2 h-[300px] w-full" count={5} />
        </AspectRatio>
      ) : docs && docs.length === 0 ? (
        <NotFound
          message="No Documents Found or this Transaction"
          description="Add Documents to this transaction to view them here"
        />
      ) : (
        docs?.map((_doc) => (
          <>
            <MediaRenderer key={_doc.id} uri={_doc.uri} />
            {canManage ? (
              <Button
                disabled={deleting || gettingPerms}
                variant="destructive"
                onClick={() => {
                  remove({
                    docId: _doc.id,
                    societyId: id,
                    transactionId,
                  });
                }}
                className="mb-2 w-full"
              >
                Delete This Doc
              </Button>
            ) : null}
          </>
        ))
      )}
    </>
  );
}
