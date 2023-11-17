"use client";

import useLocalStorage from "@/lib/use-local-store";
import { Message, UserProps } from "@/payload-types";
import { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Link,
  Spinner,
  Tooltip,
} from "@nextui-org/react";
import { CheckCheck, Eye } from "lucide-react";

export function MessagesPage() {
  const [loading, setLoading] = useState(true);
  const [refetch, setRefetch] = useState<number>(0);
  //@ts-ignore
  const [messages, setMessages] = useState<Message>({});
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

      setMessages(data);
      setLoading(false);
    };

    if (user) {
      headers.append("Authorization", "users API-Key " + user.user.apiKey);
      getMessageCount();
    }
  }, [user, refetch]);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl p-5 pt-10 flex justify-center min-h-[50vh] items-center">
        <Spinner color="success" size="lg" />
      </main>
    );
  }

  const markMessageAsRead = async (id: string) => {
    headers.append("Authorization", "users API-Key " + user.user.apiKey);

    const res = await fetch(process.env.NEXT_PUBLIC_API + "/api/my-messages", {
      method: "post",
      headers: headers,
      body: JSON.stringify({
        mid: id,
      }),
    });
    const data: Message = await res.json();

    if (data.success) {
      const event = new Event("refetch-messages");
      window.dispatchEvent(event);
      setRefetch((prev) => prev + 1);
    }
  };

  if (messages.unread && messages.read) {
    const unread = messages.unread;
    const read = messages.read;
    return (
      <main className="mx-auto max-w-7xl p-5 pt-10 flex flex-col gap-10">
        <section>
          <h1 className="font-semibold text-3xl">
            Unread Messages&nbsp;
            {unread.totalDocs > 0 && <>({unread.totalDocs})</>}
          </h1>

          <ul className="flex flex-col gap-4 mt-3">
            {unread.docs.map((msg) => {
              const date = new Date(msg.createdAt);
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
                <Card key={msg.id} as={Link}>
                  <CardHeader className="flex justify-between gap-2">
                    <h2 className="text-lg">
                      From&nbsp;<strong>{msg.from.name}</strong>
                    </h2>

                    <Tooltip content="Mark as read">
                      <Button
                        variant="flat"
                        color="success"
                        isIconOnly
                        onPress={() => markMessageAsRead(msg.id)}
                      >
                        <CheckCheck />
                      </Button>
                    </Tooltip>
                  </CardHeader>
                  <Divider />
                  <CardBody>{msg.message}</CardBody>
                  <Divider />
                  <CardFooter className="flex justify-between gap-2">
                    <h3>{sentAt}</h3>
                    <Tooltip content="View message">
                      <Button
                        variant="light"
                        color="primary"
                        isIconOnly
                        as={Link}
                        href={"/message" + msg.id}
                      >
                        <Eye />
                      </Button>
                    </Tooltip>
                  </CardFooter>
                </Card>
              );
            })}

            {unread.totalDocs === 0 && (
              <Card>
                <CardHeader>
                  <h2 className="text-lg">You have no unread messages.</h2>
                </CardHeader>
              </Card>
            )}
          </ul>
        </section>

        <section>
          <h1 className="font-semibold text-3xl">Read Messages</h1>

          <ul className="flex flex-col gap-4 mt-3">
            {read.docs.map((msg) => {
              const date = new Date(msg.createdAt);
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
                <Card key={msg.id}>
                  <CardHeader className="flex justify-between gap-2">
                    <h2 className="text-lg">
                      From&nbsp;<strong>{msg.from.name}</strong>
                    </h2>
                  </CardHeader>
                  <Divider />
                  <CardBody>{msg.message}</CardBody>
                  <Divider />
                  <CardFooter className="flex justify-between gap-2">
                    <h3>{sentAt}</h3>
                    <div className="flex">
                      <Tooltip content="View message">
                        <Button
                          variant="light"
                          color="primary"
                          isIconOnly
                          as={Link}
                          href={"/message" + msg.id}
                        >
                          <Eye />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Message read">
                        <Button
                          variant="light"
                          color="success"
                          isIconOnly
                          isDisabled
                        >
                          <CheckCheck />
                        </Button>
                      </Tooltip>
                    </div>
                  </CardFooter>
                </Card>
              );
            })}

            {read.totalDocs === 0 && (
              <Card>
                <CardHeader>
                  <h2 className="text-lg">You have no read messages.</h2>
                </CardHeader>
              </Card>
            )}
          </ul>
        </section>
      </main>
    );
  }
}
