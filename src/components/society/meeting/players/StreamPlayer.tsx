"use client";

import "@stream-io/video-react-sdk/dist/css/styles.css";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  type Call,
  CallControls,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  type User,
} from "@stream-io/video-react-sdk";
import { env } from "~/env";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import { generateMeetingToken } from "~/actions/generateMeetingToken";

export default function StreamPlayer() {
  const { meetingId, id } = useParams<{ meetingId: string; id: string }>();
  const router = useRouter();
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);

  const session = useSession();

  api.meetingRoom.checkExpiry.useQuery(
    {
      id: meetingId,
    },
    {
      onSuccess(data) {
        if (data.expired) {
          router.push(`/society/${id}/meeting`);
          window.location.reload();
        }
      },
    },
  );

  const user: User = {
    id: session.data!.user.id,
    name: session.data!.user.name!,
    image: session.data!.user.image!,
    type: "authenticated",
  };

  useEffect(() => {
    const client = new StreamVideoClient({
      apiKey: env.NEXT_PUBLIC_GETSTREAM_API_KEY,
      user,
      tokenProvider: () => generateMeetingToken(),
    });
    setClient(client);
    const call = client.call("default", meetingId);
    void call.join({ create: true, notify: true });
    void call.camera.enable();
    void call.microphone.enable();
    setCall(call);

    return () => {
      void call.camera.disable();
      void call.microphone.disable();
      void call.leave();
      void client.disconnectUser();
    };
  }, [session, meetingId]);
  return (
    client &&
    call && (
      <StreamVideo client={client}>
        <StreamTheme>
          <StreamCall call={call}>
            <SpeakerLayout
              participantsBarLimit="dynamic"
              participantsBarPosition="bottom"
            />
            <CallControls
              onLeave={() => {
                window.location.reload();
                router.push(`/society/${id}/meeting`);
              }}
            />
          </StreamCall>
        </StreamTheme>
      </StreamVideo>
    )
  );
}
