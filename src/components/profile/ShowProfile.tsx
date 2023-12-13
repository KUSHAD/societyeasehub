import { getCurrentUser } from "~/actions/getCurrentUser";
import { Skeleton } from "~/components/ui/skeleton";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import ClientOnly from "../ClientOnly";
import UpdateProfileImage from "./UpdateProfileImage";
import UpdateProfileName from "./UpdateProfileName";

export default async function ShowProfile() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("api/auth/signin");
  return (
    <>
      <div className="my-2 rounded border">
        <div className="flex flex-row px-2 py-4">
          <Avatar className="mr-auto h-[100px] w-[100px]">
            <AvatarImage
              src={
                currentUser.image ??
                "https://res.cloudinary.com/dst2pmia1/image/upload/c_crop,h_300,w_300/default_profile_pic.jpg"
              }
            />
            <AvatarFallback>
              {currentUser.name?.slice(0, 1) ?? "U"}
            </AvatarFallback>
          </Avatar>
          <ClientOnly>
            <UpdateProfileImage />
          </ClientOnly>
        </div>
      </div>
      <div className="my-2 rounded border">
        <div className="flex flex-row px-2 py-4">
          <span className="my-2 mr-auto">{currentUser.name ?? "User"}</span>
          <ClientOnly>
            <UpdateProfileName name={currentUser.name ?? "User"} />
          </ClientOnly>
        </div>
      </div>
      <div className="my-2 rounded border">
        <div className="flex flex-row px-2 py-4">{currentUser.email}</div>
      </div>
    </>
  );
}

export function ShowProfileSkeleton() {
  return (
    <>
      <div className="my-2 rounded border">
        <div className="flex flex-row px-2 py-4">
          <Skeleton className="mr-auto h-[100px] w-[100px] rounded-full" />
          <Button variant="ghost" disabled size="icon" className="my-8">
            <Pencil2Icon />
          </Button>
        </div>
      </div>
      <div className="my-2 rounded border">
        <div className="flex flex-row px-2 py-4">
          <Skeleton className="my-3 mr-auto h-[14px] w-3/4 rounded" />
          <Button variant="ghost" disabled size="icon">
            <Pencil2Icon />
          </Button>
        </div>
      </div>
      <div className="my-2 rounded border">
        <div className="flex flex-row px-2 py-4">
          <Skeleton className="my-3 mr-auto h-[14px] w-3/4 rounded" />
        </div>
      </div>
    </>
  );
}
