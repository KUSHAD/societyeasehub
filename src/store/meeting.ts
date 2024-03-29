import { type Call, type StreamVideoClient } from "@stream-io/video-react-sdk";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface MeetingStore {
  call: Call | null;
  client: StreamVideoClient | null;
  setCall: (call: Call | null) => void;
  setClient: (client: StreamVideoClient | null) => void;
}

export const useMeetingStore = create<MeetingStore>()(
  devtools((set) => ({
    call: null,
    client: null,
    setCall(call) {
      set({
        call,
      });
    },
    setClient(client) {
      set({
        client,
      });
    },
  })),
);
