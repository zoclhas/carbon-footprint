import { MessagesPage } from ".";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messages | CarbTrkr",
  description: "Login in view your messages.",
};

export default function Messages({
  searchParams,
}: {
  searchParams: { tab: "received" | "sent" | null };
}) {
  return <MessagesPage tab={searchParams.tab ?? "received"} />;
}
