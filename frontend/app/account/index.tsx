"use client";

import useLocalStorage from "@/lib/use-local-store";
import { TodayLogsProps, UserProps, Activites } from "@/payload-types";
import {
  Button,
  Link,
  Accordion,
  AccordionItem,
  Card,
  CardHeader,
  Tooltip,
  CardBody,
  CardFooter,
  Spinner,
} from "@nextui-org/react";
import { GraduationCap, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto";
import { colors } from "./[classId]";

export function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  //@ts-ignore
  const [todayLogs, setTodayLogs] = useState<TodayLogsProps>({});
  // @ts-ignore
  const [user]: UserProps[] = useLocalStorage("user", null);

  useEffect(() => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const getTodayLogs = async () => {
      const res = await fetch(process.env.NEXT_PUBLIC_API + "/api/today", {
        method: "get",
        cache: "no-store",
        headers: headers,
      });
      const data: TodayLogsProps = await res.json();
      setTodayLogs(data);
      setLoading(false);
    };

    if (user) {
      headers.append("Authorization", "users API-Key " + user.user.apiKey);
      getTodayLogs();
    }
  }, [user]);

  function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const todayChartCanvas = useRef<HTMLCanvasElement>(null);
  const monthChartCanvas = useRef<HTMLCanvasElement>(null);
  const yearChartCanvas = useRef<HTMLCanvasElement>(null);

  function createChart(canvasRef: any, data: Activites) {
    const ctx = canvasRef.current?.getContext("2d");

    if (ctx && Object.keys(data).length > 0) {
      const labels = Object.keys(data).map((act) => capitalizeFirstLetter(act));
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
  useEffect(() => {
    if (Object.keys(todayLogs).length > 1) {
      const todayChartCleanup = createChart(
        todayChartCanvas,
        todayLogs.activities.today,
      );
      const monthChartCleanup = createChart(
        monthChartCanvas,
        todayLogs.activities.month,
      );
      const yearChartCleanup = createChart(
        yearChartCanvas,
        todayLogs.activities.year,
      );

      return function cleanup() {
        todayChartCleanup && todayChartCleanup();
        monthChartCleanup && monthChartCleanup();
        yearChartCleanup && yearChartCleanup();
      };
    }
  }, [todayLogs]);

  if (todayLogs.message === "You must be logged in") {
    router.push("/login");
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl p-5 pt-10 flex justify-center min-h-[50vh] items-center">
        <Spinner color="success" size="lg" />
      </main>
    );
  }

  const todaysLogsSort =
    !loading && todayLogs ? [...todayLogs.logs].reverse() : [];

  if (todayLogs && Object.keys(todayLogs).length > 1) {
    const [maxTodayKey, maxTodayVal] = Object.entries(
      todayLogs.activities.today,
    ).reduce((a, b) => (a[1] > b[1] ? a : b));
    const [maxMonthKey, maxMonthVal] = Object.entries(
      todayLogs.activities.month,
    ).reduce((a, b) => (a[1] > b[1] ? a : b));
    const [maxYearKey, maxYearVal] = Object.entries(
      todayLogs.activities.year,
    ).reduce((a, b) => (a[1] > b[1] ? a : b));

    return (
      <main className="mx-auto max-w-7xl p-5 pt-10">
        <section className="flex justify-between items-center max-sm:flex-wrap gap-2 max-sm:justify-end">
          <div className="flex sm:items-center gap-2 max-sm:flex-col grow">
            <h1 className="text-5xl grow">
              Hello {!loading && todayLogs && todayLogs.user.name}
            </h1>
            {!loading && todayLogs && todayLogs.user.is_class_teacher && (
              <Tooltip content="Teacher">
                <Button
                  as={Link}
                  href={"/account/" + todayLogs.user.my_class?.id}
                  variant="light"
                  color="success"
                  className="w-max"
                >
                  <GraduationCap />
                  Go to your class
                </Button>
              </Tooltip>
            )}
          </div>

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
            <h1 className="font-semibold text-3xl">Today&apos;s Logs</h1>

            <div className="flex sm:gap-2 sm:items-center max-sm:flex-col">
              {!loading && (
                <>
                  <h2>
                    <strong>Today&apos;s Emission:</strong>{" "}
                    {todayLogs.emission_stats.total_emission.today ?? 0} kg of
                    CO
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

          {todaysLogsSort && todaysLogsSort.length > 0 && (
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

          {!todaysLogsSort && (
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

        {todaysLogsSort && (
          <section className="mt-6">
            <h1 className="font-semibold text-3xl">Stats</h1>

            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 w-full mt-3">
              <Card className="lg:col-span-2">
                <CardHeader className="text-lg font-medium flex max-sm:flex-col justify-between gap-2 sm:items-center">
                  <h3 className="max-md:w-full font-semibold">Today</h3>
                  <div className="flex max-md:flex-col sm:gap-4 text-base">
                    <h3>
                      <strong>Today&apos;s Emission: </strong>
                      <span className="justify-self-start">
                        {todayLogs.emission_stats.total_emission.today} kg of CO
                        <sub>2</sub>
                      </span>
                    </h3>
                    <h3>
                      <strong>Today&apos;s Avg Emission: </strong>
                      <span className="justify-self-start">
                        {todayLogs.emission_stats.average_emission.today} kg of
                        CO
                        <sub>2</sub>
                      </span>
                    </h3>
                  </div>
                </CardHeader>
                <CardBody>
                  <canvas
                    id="today-graph"
                    ref={todayChartCanvas}
                    height={398}
                  ></canvas>
                </CardBody>
                <CardFooter>
                  <h4 className="text-base">
                    <strong>Highest emission: </strong>
                    {capitalizeFirstLetter(maxTodayKey)} produced {maxTodayVal}
                    kg of CO<sub>2</sub>
                  </h4>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="text-lg font-medium flex max-sm:flex-col justify-between gap-2 sm:items-center">
                  <h3 className="max-md:w-full font-semibold">Month</h3>
                  <div className="flex max-md:flex-col sm:gap-4 text-base">
                    <h3>
                      <strong>Month&apos;s Emission: </strong>
                      <span className="justify-self-start">
                        {todayLogs.emission_stats.total_emission.month} kg of CO
                        <sub>2</sub>
                      </span>
                    </h3>
                    <h3>
                      <strong>Month&apos;s Avg Emission: </strong>
                      <span className="justify-self-start">
                        {todayLogs.emission_stats.average_emission.month} kg of
                        CO
                        <sub>2</sub>
                      </span>
                    </h3>
                  </div>
                </CardHeader>
                <CardBody>
                  <canvas
                    id="month-graph"
                    ref={monthChartCanvas}
                    height={398}
                  ></canvas>
                </CardBody>
                <CardFooter>
                  <h4 className="text-base">
                    <strong>Highest emission: </strong>
                    {capitalizeFirstLetter(maxMonthKey)} produced {maxMonthVal}
                    kg of CO<sub>2</sub>
                  </h4>
                </CardFooter>
              </Card>
              <Card className="lg:col-span-3 md:col-span-2">
                <CardHeader className="text-lg font-medium flex max-sm:flex-col justify-between gap-2 sm:items-center">
                  <h3 className="max-md:w-full font-semibold">Year</h3>
                  <div className="flex max-md:flex-col sm:gap-4 text-base">
                    <h3>
                      <strong>Year&apos;s Emission: </strong>
                      <span className="justify-self-start">
                        {todayLogs.emission_stats.total_emission.year} kg of CO
                        <sub>2</sub>
                      </span>
                    </h3>
                    <h3>
                      <strong>Year&apos;s Avg Emission: </strong>
                      <span className="justify-self-start">
                        {todayLogs.emission_stats.average_emission.year} kg of
                        CO
                        <sub>2</sub>
                      </span>
                    </h3>
                  </div>
                </CardHeader>
                <CardBody>
                  <canvas
                    id="year-graph"
                    ref={yearChartCanvas}
                    height={398}
                  ></canvas>
                </CardBody>
                <CardFooter>
                  <h4 className="text-base">
                    <strong>Highest emission: </strong>
                    {capitalizeFirstLetter(maxYearKey)} produced {maxYearVal}
                    kg of CO<sub>2</sub>
                  </h4>
                </CardFooter>
              </Card>
            </div>
          </section>
        )}
      </main>
    );
  }
}
