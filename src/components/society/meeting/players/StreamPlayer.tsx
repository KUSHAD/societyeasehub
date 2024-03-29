"use client";

import "@stream-io/video-react-sdk/dist/css/styles.css";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import {
  CallControls,
  CallParticipantsList,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  type User,
} from "@stream-io/video-react-sdk";
import { env } from "~/env";
import { useSession } from "next-auth/react";
import { useMeetingStore } from "~/store/meeting";
import { api } from "~/trpc/react";
import { generateMeetingToken } from "~/actions/generateMeetingToken";

export default function StreamPlayer() {
  const { meetingId, id } = useParams<{ meetingId: string; id: string }>();
  const router = useRouter();
  const meetingStore = useMeetingStore();

  const session = useSession();

  api.meetingRoom.checkExpiry.useQuery(
    {
      id: meetingId,
    },
    {
      onSuccess(data) {
        if (data.expired) {
          router.push(`/society/${id}/meeting`);
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
    meetingStore.setClient(client);
    const call = client.call("default", meetingId);
    void call.join({ create: true });

    meetingStore.setCall(call);
    return () => {
      void call.leave();
      void client.disconnectUser();
      meetingStore.setCall(null);
      meetingStore.setClient(null);
    };
  }, [session, meetingId, meetingStore]);
  return (
    meetingStore.client &&
    meetingStore.call && (
      <StreamVideo client={meetingStore.client}>
        <StreamTheme>
          <StreamCall call={meetingStore.call}>
            <SpeakerLayout />
            <CallControls
              onLeave={() => {
                meetingStore.setCall(null);
                meetingStore.setClient(null);
                router.push(`/society/${id}/meeting`);
              }}
            />
            <CallParticipantsList
              onClose={() => {
                undefined;
              }}
            />
          </StreamCall>
        </StreamTheme>
      </StreamVideo>
    )
  );
}
