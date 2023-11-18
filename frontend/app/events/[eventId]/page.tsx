import { Metadata } from "next";
import { EventsIdPage } from ".";

export const metadata: Metadata = {
  title: "Event Details | CarbTrkr",
  description: "Login in view your events.",
};

export default function EventId({ params }: { params: { eventId: string } }) {
  return <EventsIdPage eventId={params.eventId} />;
}
