import { getCurrentUser } from "~/actions/getCurrentUser";
import { getUserSubscription } from "~/actions/subscription";
import { pusher } from "~/server/pusher";

export async function POST(req: Request) {
  console.log("authenticating pusher perms...");
  const data = await req.text();
  const [socketId, channelName] = data
    .split("&")
    .map((str) => str.split("=")[1]);

  // logic to check user permissions

  const currentUser = await getCurrentUser();
  const userSubscription = await getUserSubscription();

  if (!currentUser || !userSubscription)
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 403,
    });

  const authResponse = pusher.authorizeChannel(socketId!, channelName!);

  return new Response(JSON.stringify(authResponse));
}
