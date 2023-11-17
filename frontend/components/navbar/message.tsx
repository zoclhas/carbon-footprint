"use client";

import useLocalStorage from "@/lib/use-local-store";
import { useEffect, useState } from "react";
import { NavbarItem, Badge, Link, Button } from "@nextui-org/react";
import { MessageCircle } from "lucide-react";
import { UserProps, Message } from "@/payload-types";

export const MessageButton = () => {
  const [loading, setLoading] = useState(true);
  const [refetch, setRefetch] = useState<number>(0);
  const [messages, setMessages] = useState<number>(0);
  // @ts-ignore
  const [user]: UserProps[] = useLocalStorage("user", null);

  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  useEffect(() => {
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

    if (user) {
      headers.append("Authorization", "users API-Key " + user.user.apiKey);
      getMessageCount();
    }
  }, [user, refetch]);

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

  if (user) {
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
