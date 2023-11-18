"use client";

import { UserProps, EventDetails, Events, Activities } from "@/payload-types";
import { getCookie } from "cookies-next";
import { useState, useEffect } from "react";
import {
  Spinner,
  Card,
  CardHeader,
  Chip,
  CardBody,
  Tabs,
  Tab,
  Accordion,
  AccordionItem,
} from "@nextui-org/react";
import serialize from "@/lib/serialize";
import Chart from "chart.js/auto";
import { colors } from "@/app/account/[classId]";

export function EventsIdPage({ eventId }: { eventId: string }) {
  const [selected, setSelected] = useState("desc");
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [loading, setLoading] = useState(true);
  // @ts-ignore
  const [eventDetails, setEventDetails] = useState<EventDetails>({});
  // @ts-ignore
  const user: UserProps | null = JSON.parse(getCookie("user") ?? "null");

  let headers = {
    "Content-Type": "application/json",
    Authorization: "",
  };

  useEffect(() => {
    const getEventDetails = async () => {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API + "/api/my-events/" + eventId,
        {
          method: "GET",
          headers: headers,
        },
      );
      const data: EventDetails = await res.json();

      setEventDetails(data);
      setLoading(false);
    };

    if (user) {
      headers.Authorization = "users API-Key " + user!.user.apiKey;
      getEventDetails();
    }
  }, []);

  function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  function createChart(i: number, data: Activities) {
    const canvas = document.getElementById(i + "-graph") as HTMLCanvasElement;

    if (canvas) {
      const ctx = canvas.getContext("2d");

      if (ctx && Object.keys(data).length > 0) {
        const labels = Object.keys(data).map((act) =>
          capitalizeFirstLetter(act),
        );
        const weight = Object.values(data);

        const gradient = ctx.createLinearGradient(0, 16, 0, 600);
        gradient.addColorStop(0, colors.green.half);
        gradient.addColorStop(0.65, colors.green.quarter);
        gradient.addColorStop(1, colors.green.zero);

        const chartData = {
          labels: labels,
          datasets: [
            {
              backgroundColor: gradient,
              label: "Activity / CO2 (kg)",
              data: weight,
              fill: true,
              borderWidth: 2,
              borderColor: colors.green.default,
              lineTension: 0.2,
              pointBackgroundColor: colors.green.default,
              pointRadius: 7,
            },
          ],
        };
        const config = {
          type: "line",
          data: chartData,
          options: {
            responsive: true,
          },
        };
        // @ts-ignore
        const myLineChart = new Chart(ctx, config);

        return function cleanup() {
          myLineChart.destroy();
        };
      }
    }
  }
  useEffect(() => {
    if (eventDetails.classes && selected === "lb") {
      const classes = eventDetails.classes;
      classes.forEach((cls, i) => {
        const chart = createChart(i, cls.activity);

        return function cleanup() {
          chart && chart();
        };
      });
    }
  }, [eventDetails, selected]);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl p-5 pt-10 flex justify-center min-h-[50vh] items-center">
        <Spinner color="success" size="lg" />
      </main>
    );
  }

  if (eventDetails.message || !user) {
    return (
      <main className="mx-auto max-w-7xl p-5 pt-10 flex justify-center min-h-[50vh] items-center">
        <Card className="bg-danger-50">
          <CardHeader>{eventDetails.message ?? "Log in to view."}</CardHeader>
        </Card>
      </main>
    );
  }

  if (eventDetails.event_data && eventDetails.classes) {
    const details = eventDetails.event_data;
    const classes = eventDetails.classes;

    const giveHumanDate = (date: Date): string => {
      return date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    };
    const starts = giveHumanDate(new Date(details.duration.starts));
    const ends = giveHumanDate(new Date(details.duration.ends));

    return (
      <main className="mx-auto max-w-7xl p-5 pt-10">
        <section>
          <h1 className="text-4xl font-semibold">{details.title}</h1>
          <h2 className="text-2xl flex items-center mt-4">
            <strong>From:</strong>&nbsp;
            <Chip variant="flat" color="warning" size="lg">
              {starts}
            </Chip>
          </h2>
          <h2 className="text-2xl flex items-center mt-2">
            <strong>Till:</strong>&nbsp;
            <Chip variant="flat" color="warning" size="lg">
              {ends}
            </Chip>
          </h2>
        </section>

        <Tabs
          className="mt-16"
          size="lg"
          selectedKey={selected}
          // @ts-ignore
          onSelectionChange={setSelected}
        >
          <Tab key="desc" title="Description">
            <Card
              as="article"
              className="prose dark:prose-invert max-w-none prose-sm"
            >
              <CardBody>{serialize(details.description)}</CardBody>
            </Card>
          </Tab>

          <Tab key="lb" title="Leaderboard">
            <ul className="flex flex-col gap-4">
              {classes.map((cls, i) => {
                return (
                  <Card as="li" key={i}>
                    <CardHeader className="flex justify-between max-sm:gap-2 max-sm:flex-wrap">
                      <span className="flex gap-2">
                        <span
                          className={
                            i === 0
                              ? "text-amber-500"
                              : i === 1
                              ? "text-zinc-500"
                              : i === 2
                              ? "text-[#b46e43]"
                              : "text-zinc-800"
                          }
                        >
                          #{i + 1}
                        </span>
                        {cls.class_section}
                      </span>
                      <span className="max-sm:text-sm">
                        <strong>Total Emission:</strong>&nbsp;
                        {cls.total_emission} kg of CO<sub>2</sub>
                      </span>
                    </CardHeader>
                    <CardBody>
                      <canvas id={i + "-graph"} height={300}></canvas>
                    </CardBody>
                  </Card>
                );
              })}
            </ul>
          </Tab>
        </Tabs>
      </main>
    );
  }
}
