"use client";

import { useSession } from "next-auth/react";
import AutoForm, { AutoFormSubmit } from "~/components/ui/auto-form";
import { Card, CardContent } from "~/components/ui/card";
import { announcementSchema } from "~/lib/validators/announcement";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import AnnouncementAttachmentContainer from "./attachment/AnnouncementAttachmentContainer";
import { useAnnouncementStore } from "~/store/announcement";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { toast } from "~/components/ui/use-toast";
import { useAnnouncementAttachmentStore } from "~/store/announcementAttachment";

export default function AnnouncementInput() {
  const { data } = useSession();
  const announcementStore = useAnnouncementStore();
  const announcementAttachmentStore = useAnnouncementAttachmentStore();
  const { societyId } = useParams<{ societyId: string }>();
  const utils = api.useUtils();
  const { mutate: create, isPending } = api.announcement.create.useMutation({
    async onSuccess() {
      toast({
        title: "Success",
        description: "Announcement Created",
      });
      await utils.announcement.getBySociety.invalidate({});
      announcementStore.updateBySociety(societyId, "");
      announcementAttachmentStore.clearBySociety(societyId);
    },
  });
  return (
    <Drawer>
      <Card>
        <CardContent>
          <div className="flex w-full flex-row py-4">
            <Avatar className="my-2">
              <AvatarImage
                src={
                  data?.user.image ??
                  "https://res.cloudinary.com/dst2pmia1/image/upload/c_crop,h_300,w_300/default_profile_pic.jpg"
                }
              />
              <AvatarFallback>
                {data?.user.name?.slice(0, 1) ?? "U"}
              </AvatarFallback>
            </Avatar>
            <AutoForm
              onSubmit={({ content }) =>
                create({
                  content,
                  societyId,
                  attachments:
                    announcementAttachmentStore.getBySociety(societyId),
                })
              }
              values={{
                content: announcementStore.getBySociety(societyId) ?? "",
              }}
              onValuesChange={({ content }) =>
                announcementStore.updateBySociety(societyId, content!)
              }
              className="ml-2 w-full"
              formSchema={announcementSchema}
              fieldConfig={{
                content: {
                  fieldType: "textarea",
                  inputProps: {
                    showLabel: false,
                    className: "resize-none h-20",
                    placeholder:
                      "Announce here something that will be  shown to everyone",
                  },
                },
              }}
            >
              <div className="flex w-full flex-row">
                <div className="mr-auto" />
                <DrawerTrigger asChild>
                  <Button
                    variant="secondary"
                    className="mx-2"
                    disabled={isPending}
                  >
                    Add Attachments
                  </Button>
                </DrawerTrigger>
                <AutoFormSubmit disabled={isPending}>
                  Make Announcement
                </AutoFormSubmit>
              </div>
            </AutoForm>
          </div>
        </CardContent>
      </Card>
      <DrawerContent className="h-[90%]">
        <DrawerHeader>
          <DrawerTitle>Add Announcement Attachments</DrawerTitle>
        </DrawerHeader>
        <AnnouncementAttachmentContainer />
      </DrawerContent>
    </Drawer>
  );
}
