import { Metadata } from "next";
import { MessageId } from ".";

export const metadata: Metadata = {
  title: "Message | CarbTrkr",
  description: "Login in view your message.",
};

export default function MessagePage({ params }: { params: { msgId: string } }) {
  return <MessageId msgId={params.msgId} />;
}
