"use client";

import { useEffect, useState } from "react";
import { NavbarItem, Badge, Link, Button } from "@nextui-org/react";
import { MessageCircle } from "lucide-react";
import { UserProps, Message } from "@/payload-types";
import { getCookie } from "cookies-next";

export const MessageButton = () => {
  const [loading, setLoading] = useState(true);
  const [refetch, setRefetch] = useState<number>(0);
  const [messages, setMessages] = useState<number>(0);
  const [mounted, setMounted] = useState(false);
  // @ts-ignore
  const user: UserProps | null = JSON.parse(getCookie("user") ?? "null");

  let headers = {
    "Content-Type": "application/json",
    Authorization: "",
  };

  useEffect(() => {
    setMounted(true);

    const getMessageCount = async () => {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API + "/api/my-messages",
        {
          method: "GET",
          headers: headers,
        },
      );
      const data: Message = await res.json();

      setMessages(data.unread.totalDocs);
      setLoading(false);
    };

    // @ts-ignore
    const user: UserProps | null = JSON.parse(getCookie("user") ?? "null");
    if (user) {
      headers.Authorization = "users API-Key " + user!.user.apiKey;
      getMessageCount();
    }
  }, [refetch]);

  useEffect(() => {
    window.addEventListener("refetch-messages", () =>
      setRefetch((prev) => prev + 1),
    );

    return () => {
      window.removeEventListener("refetch-messages", () =>
        setRefetch((prev) => prev + 1),
      );
    };
  }, []);

  if (user && mounted) {
    if (messages > 0) {
      return (
        <NavbarItem>
          <Badge content={messages} color="secondary" variant="faded">
            <Button
              as={Link}
              href="/messages"
              isIconOnly
              variant="flat"
              color="secondary"
              isLoading={loading}
            >
              <MessageCircle />
            </Button>
          </Badge>
        </NavbarItem>
      );
    }

    return (
      <NavbarItem>
        <Button
          as={Link}
          href="/messages"
          isIconOnly
          variant="flat"
          color="secondary"
          isLoading={loading}
        >
          <MessageCircle />
        </Button>
      </NavbarItem>
    );
  }
};
