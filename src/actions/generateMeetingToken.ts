"use server";

import { StreamChat } from "stream-chat";
import { getCurrentUser } from "./getCurrentUser";
import { env } from "~/env";

export async function generateMeetingToken() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error("No session found");
  }

  const serverClient = StreamChat.getInstance(
    env.NEXT_PUBLIC_GETSTREAM_API_KEY,
    env.GETSTREAM_SECRET_KEY,
  );

  const token = serverClient.createToken(currentUser.id);
  console.log("token", token);

  return token;
}
