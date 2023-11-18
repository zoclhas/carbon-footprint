"use client";

import { UserProps } from "@/payload-types";
import { Button, Link, NavbarItem } from "@nextui-org/react";
import { getCookie } from "cookies-next";
import { CalendarRange } from "lucide-react";
import { useEffect, useState } from "react";

export const EventsButton = () => {
  const [mounted, setMounted] = useState(false);
  // @ts-ignore
  const user: UserProps | null = JSON.parse(getCookie("user") ?? "null");

  useEffect(() => setMounted(true), []);

  if (user && mounted) {
    return (
      <NavbarItem>
        <Button
          as={Link}
          href="/events"
          isIconOnly
          variant="flat"
          color="default"
          startContent={<CalendarRange />}
        />
      </NavbarItem>
    );
  }
};
