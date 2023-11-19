"use client";

import { UserProps, Events } from "@/payload-types";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import {
  Spinner,
  Card,
  CardHeader,
  Chip,
  Divider,
  CardBody,
  ScrollShadow,
  CardFooter,
  Button,
} from "@nextui-org/react";
import Link from "next/link";
import serialize from "@/lib/serialize";
import { Eye } from "lucide-react";

export function EventsPage() {
  const [loading, setLoading] = useState(true);
  // @ts-ignore
  const [events, setEvents] = useState<Events>({});
  // @ts-ignore
  const user: UserProps | null = JSON.parse(getCookie("user") ?? "null");

  let headers = {
    "Content-Type": "application/json",
    Authorization: "",
  };

  useEffect(() => {
    const getEvents = async () => {
      const today = new Date().toISOString();
      const res = await fetch(
        process.env.NEXT_PUBLIC_API + "/api/my-events?today=" + today,
        {
          method: "GET",
          headers: headers,
        },
      );
      const data: Events = await res.json();

      setEvents(data);
      setLoading(false);
    };

    if (user) {
      headers.Authorization = "users API-Key " + user!.user.apiKey;
      getEvents();
    }
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl p-5 pt-10 flex justify-center min-h-[50vh] items-center">
        <Spinner color="success" size="lg" />
      </main>
    );
  }

  if (events.message || !user) {
    return (
      <main className="mx-auto max-w-7xl p-5 pt-10 flex justify-center min-h-[50vh] items-center">
        <Card className="bg-danger-50">
          <CardHeader>{events.message ?? "Log in to view."}</CardHeader>
        </Card>
      </main>
    );
  }

  if (events.current_upcoming && events.previous) {
    const curr = events.current_upcoming;
    const prev = events.previous;

    return (
      <main className="mx-auto max-w-7xl p-5 pt-10 flex flex-col gap-10">
        <section>
          <h1 className="font-semibold text-3xl">
            Current/Upcoming Events&nbsp;
            {curr.totalDocs > 0 && <>({curr.totalDocs})</>}
          </h1>

          <ul className="flex flex-col gap-4 mt-3">
            {curr.docs.map((e) => {
              function giveHumanDate(date: Date): string {
                return date.toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                });
              }
              const starts = giveHumanDate(new Date(e.duration.starts));
              const ends = giveHumanDate(new Date(e.duration.ends));

              return (
                <Card
                  key={e.id}
                  as={Link}
                  href={"/events/" + e.id}
                  isHoverable
                  isPressable
                >
                  <CardHeader className="flex-col items-start justify-center">
                    <h2 className="font-medium text-xl">{e.title}</h2>
                    <div className="flex sm:gap-2 gap-0.5 flex-wrap mt-2">
                      <Chip variant="flat" color="warning">
                        {starts}
                      </Chip>
                      &nbsp;-&nbsp;
                      <Chip variant="flat" color="warning">
                        {ends}
                      </Chip>
                    </div>
                  </CardHeader>
                  <Divider />
                  <CardBody
                    as={ScrollShadow}
                    className="prose max-w-none dark:prose-invert max-h-96"
                  >
                    {serialize(e.description)}
                  </CardBody>
                  <Divider />
                  <CardFooter className="justify-end">
                    <Button
                      as={Link}
                      href={"/events/" + e.id}
                      variant="flat"
                      color="primary"
                      startContent={<Eye />}
                    >
                      View
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
            {curr.totalDocs === 0 && (
              <Card>
                <CardHeader>
                  <h2 className="font-medium text-xl">
                    No current/upcoming events
                  </h2>
                </CardHeader>
              </Card>
            )}
          </ul>
        </section>

        <section>
          <h1 className="font-semibold text-3xl">
            Past Events&nbsp;
            {prev.totalDocs > 0 && <>({prev.totalDocs})</>}
          </h1>

          <ul className="flex flex-col gap-4 mt-3">
            {prev.docs.map((e) => {
              function giveHumanDate(date: Date): string {
                return date.toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                });
              }
              const starts = giveHumanDate(new Date(e.duration.starts));
              const ends = giveHumanDate(new Date(e.duration.ends));

              return (
                <Card
                  key={e.id}
                  as={Link}
                  href={"/events/" + e.id}
                  isHoverable
                  isPressable
                >
                  <CardHeader className="flex-col items-start justify-center">
                    <h2 className="font-medium text-xl">{e.title}</h2>
                    <div className="flex sm:gap-2 gap-0.5 flex-wrap mt-2">
                      <Chip variant="flat" color="warning">
                        {starts}
                      </Chip>
                      &nbsp;-&nbsp;
                      <Chip variant="flat" color="warning">
                        {ends}
                      </Chip>
                    </div>
                  </CardHeader>
                  <Divider />
                  <CardBody
                    as={ScrollShadow}
                    className="prose max-w-none dark:prose-invert max-h-96"
                  >
                    {serialize(e.description)}
                  </CardBody>
                  <Divider />
                  <CardFooter className="justify-end">
                    <Button
                      as={Link}
                      href={"/events/" + e.id}
                      variant="flat"
                      color="primary"
                      startContent={<Eye />}
                    >
                      View
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
            {prev.totalDocs === 0 && (
              <Card>
                <CardHeader>
                  <h2 className="font-medium text-xl">No past events</h2>
                </CardHeader>
              </Card>
            )}
          </ul>
        </section>
      </main>
    );
  }
}
