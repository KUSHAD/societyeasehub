"use  client";

import NotFound from "~/components/NotFound";

export default function MessageContainer() {
  return (
    <div className="flex flex-col">
      <NotFound
        message="No Messages"
        description="Send a message to this chanel to see it here"
      />
    </div>
  );
}
