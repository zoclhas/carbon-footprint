"use client";

import { UserProps, Events } from "@/payload-types";
import { Badge, Button, Link, NavbarItem } from "@nextui-org/react";
import { getCookie } from "cookies-next";
import { CalendarRange } from "lucide-react";
import { useEffect, useState } from "react";

export const EventsButton = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<number>(0);
  const [mounted, setMounted] = useState(false);
  // @ts-ignore
  const user: UserProps | null = JSON.parse(getCookie("user") ?? "null");

  let headers = {
    "Content-Type": "application/json",
    Authorization: "",
  };

  useEffect(() => {
    setMounted(true);

    const getEventsCount = async () => {
      const res = await fetch(process.env.NEXT_PUBLIC_API + "/api/my-events", {
        method: "GET",
        headers: headers,
      });
      const data: Events = await res.json();

      setEvents(data.current_upcoming.totalDocs);
      setLoading(false);
    };

    // @ts-ignore
    const user: UserProps | null = JSON.parse(getCookie("user") ?? "null");
    if (user) {
      headers.Authorization = "users API-Key " + user!.user.apiKey;
      getEventsCount();
    }
  }, []);

  if (user && mounted) {
    if (events > 0) {
      return (
        <NavbarItem>
          <Badge content={events} variant="faded">
            <Button
              as={Link}
              href="/events"
              isIconOnly
              variant="flat"
              color="default"
              startContent={!loading && <CalendarRange />}
              isLoading={loading}
            />
          </Badge>
        </NavbarItem>
      );
    }

    return (
      <NavbarItem>
        <Button
          as={Link}
          href="/events"
          isIconOnly
          variant="flat"
          color="default"
          startContent={!loading && <CalendarRange />}
          isLoading={loading}
        />
      </NavbarItem>
    );
  }
};
