"use client";

import useLocalStorage from "@/lib/use-local-store";
import { MessageProps, UserProps, Message } from "@/payload-types";
import { useState, useEffect } from "react";
import { Spinner, Card, CardHeader, Button, Tooltip } from "@nextui-org/react";
import { CheckCheck } from "lucide-react";

export function MessageId({ msgId }: { msgId: string }) {
  const [loading, setLoading] = useState(true);
  //@ts-ignore
  const [message, setMessage] = useState<MessageProps>({});
  // @ts-ignore
  const [user]: UserProps[] = useLocalStorage("user", null);

  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  useEffect(() => {
    const getMessageCount = async () => {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API + "/api/my-messages/" + msgId,
        {
          method: "GET",
          headers: headers,
        },
      );
      const data: MessageProps = await res.json();

      setMessage(data);
      setLoading(false);

      if (!data.message) {
        const updateRes = await fetch(
          process.env.NEXT_PUBLIC_API + "/api/my-messages",
          {
            method: "post",
            headers: headers,
            body: JSON.stringify({
              mid: msgId,
            }),
          },
        );
        const updateData: Message = await updateRes.json();

        if (updateData.success) {
          const event = new Event("refetch-messages");
          window.dispatchEvent(event);
        }
      }
    };

    if (user && msgId) {
      headers.append("Authorization", "users API-Key " + user.user.apiKey);
      getMessageCount();
    }
  }, [user]);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl p-5 pt-10 flex justify-center min-h-[50vh] items-center">
        <Spinner color="success" size="lg" />
      </main>
    );
  }

  if (message.message) {
    return (
      <main className="mx-auto max-w-7xl p-5 pt-10 flex justify-center min-h-[50vh] items-center">
        <Card className="bg-danger-50">
          <CardHeader>{message.message}</CardHeader>
        </Card>
      </main>
    );
  }

  if (message.totalDocs > 0) {
    const details = message.docs[0];
    const date = new Date(details.createdAt);
    const sentAt = date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    return (
      <main className="mx-auto max-w-7xl p-5 pt-10 flex flex-col">
        <h1 className="text-4xl">
          From <strong>{details.from.name}</strong>
        </h1>
        <h2>{sentAt}</h2>
        {details.is_read && (
          <Tooltip content="Message read">
            <Button variant="light" color="success" isIconOnly isDisabled>
              <CheckCheck />
            </Button>
          </Tooltip>
        )}

        <article className="mt-8 text-xl">
          {details.message.split("\n").map((item, i) => (
            <p key={i}>{item}</p>
          ))}
        </article>
      </main>
    );
  }
}
