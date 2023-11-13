"use client";

import useLocalStorage from "@/lib/use-local-store";
import { TodayLogsProps, UserProps } from "@/payload-types";
import {
  Button,
  Link,
  Accordion,
  AccordionItem,
  Card,
  CardHeader,
} from "@nextui-org/react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  //@ts-ignore
  const [todayLogs, setTodayLogs] = useState<TodayLogsProps>({});
  // @ts-ignore
  const [user]: UserProps[] = useLocalStorage("user", null);
  const userDetails = user && user.user;

  useEffect(() => {
    const getTodayLogs = async () => {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API + "/api/today?uid=" + userDetails.id,
        { method: "get", cache: "no-store" },
      );
      const data: TodayLogsProps = await res.json();
      setTodayLogs(data);
      setLoading(false);
    };

    if (user) {
      getTodayLogs();
    }
  }, [user]);

  const todaysLogsSort =
    !loading && todayLogs.logs.length > 0 ? [...todayLogs.logs].reverse() : [];

  return (
    <main className="mx-auto max-w-7xl p-5 pt-10">
      <section className="flex justify-between items-center max-sm:flex-wrap gap-2 max-sm:justify-end">
        <h1 className="text-5xl grow">
          Hello {userDetails && userDetails.name}
        </h1>

        <Button
          as={Link}
          href="/account/add"
          variant="flat"
          size="lg"
          color="success"
          startContent={<Plus />}
        >
          Add Log
        </Button>
      </section>

      <section className="mt-6">
        <div className="flex gap-2 justify-between max-sm:flex-col sm:items-center mb-3">
          <h1 className="font-semibold text-3xl">Today&nbsp;s Logs</h1>

          <div className="flex sm:gap-2 sm:items-center max-sm:flex-col">
            {!loading && (
              <>
                <h2>
                  <strong>Today&apos;s Emission:</strong>{" "}
                  {todayLogs.emission_stats.total_emission.today ?? 0} kg of CO
                  <sub>2</sub>
                </h2>
                <h2>
                  <strong>Today&apos;s Average Emission:</strong>{" "}
                  {todayLogs.emission_stats.average_emission.today ?? 0} kg of
                  CO
                  <sub>2</sub>
                </h2>
              </>
            )}
          </div>
        </div>

        {todaysLogsSort.length > 0 && (
          <Accordion variant="splitted">
            {todaysLogsSort.map((log) => {
              const date = new Date(log.timestamp);
              const time = date.toLocaleString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              });

              function capitalizeFirstLetter(str: string): string {
                return str.charAt(0).toUpperCase() + str.slice(1);
              }

              return (
                <AccordionItem key={log.id} title={time}>
                  <ul>
                    <li>
                      <strong>Activity:</strong>&nbsp;
                      <span>{capitalizeFirstLetter(log.activity)}</span>
                    </li>
                    <li>
                      <strong>Distance:</strong>&nbsp;
                      <span>{log.distance} km</span>
                    </li>
                    <li>
                      <strong>Person Count:</strong>&nbsp;
                      <span>{log.people}</span>
                    </li>
                    <li>
                      <strong>Emission:</strong>&nbsp;
                      <span>
                        {log.emission} kg of CO<sub>2</sub>
                      </span>
                    </li>
                  </ul>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}

        {!loading && todayLogs.logs.length === 0 && (
          <Card>
            <CardHeader>
              <h3>
                You should add some logs today! Click on{" "}
                <Link
                  href="/account/add"
                  color="success"
                  underline="focus"
                  isBlock
                >
                  Add Log
                </Link>
              </h3>
            </CardHeader>
          </Card>
        )}
      </section>
    </main>
  );
}
