"use client";

import { TodayLogsProps, UserProps, Activities } from "@/payload-types";
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
import { getCookie } from "cookies-next";
import { titleWord } from "@/lib/title-str";

export function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  //@ts-ignore
  const [todayLogs, setTodayLogs] = useState<TodayLogsProps>({});
  // @ts-ignore
  const user: UserProps | null = JSON.parse(getCookie("user") ?? "null");

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
      headers.append("Authorization", "users API-Key " + user!.user.apiKey);
      getTodayLogs();
    }
  }, []);

  function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const todayChartCanvas = useRef<HTMLCanvasElement>(null);
  const monthChartCanvas = useRef<HTMLCanvasElement>(null);
  const yearChartCanvas = useRef<HTMLCanvasElement>(null);

  function createChart(canvasRef: any, data: Activities) {
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
      <main className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center p-5 pt-10">
        <Spinner color="success" size="lg" />
      </main>
    );
  }

  if (todayLogs.message) {
    return (
      <main className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center p-5 pt-10">
        <Card className="bg-danger-50">
          <CardHeader>{todayLogs.message}</CardHeader>
        </Card>
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
        <section className="flex items-center justify-between gap-2 max-sm:flex-wrap max-sm:justify-end">
          <div className="flex grow gap-2 max-sm:flex-col sm:items-center">
            <h1 className="grow text-5xl">
              Hello {todayLogs.user.user || todayLogs.user.name}
            </h1>
            {todayLogs.user.is_class_teacher && (
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
            {todayLogs.user.is_supervisor && (
              <Tooltip
                content={titleWord(
                  `${todayLogs.user.my_section?.section} supervisor`,
                )}
              >
                <Button
                  as={Link}
                  href={"/account/section/" + todayLogs.user.my_section?.id}
                  variant="light"
                  color="success"
                  className="w-max"
                >
                  <GraduationCap />
                  Go to your classes
                </Button>
              </Tooltip>
            )}
            {todayLogs.user.is_principal && (
              <Tooltip content="Go to sections">
                <Button
                  as={Link}
                  href="/account/section/"
                  variant="light"
                  color="success"
                  className="w-max"
                >
                  <GraduationCap />
                  Go to your sections
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
          <div className="mb-3 flex justify-between gap-2 max-sm:flex-col sm:items-center">
            <h1 className="text-3xl font-semibold">Today&apos;s Logs</h1>

            <div className="flex max-sm:flex-col sm:items-center sm:gap-2">
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

          {todaysLogsSort.length === 0 && (
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

        {todayLogs.emission_stats && (
          <section className="mt-6">
            <h1 className="text-3xl font-semibold">Stats</h1>

            <div className="mt-3 grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader className="flex justify-between gap-2 text-lg font-medium max-sm:flex-col sm:items-center">
                  <h3 className="font-semibold max-md:w-full">Today</h3>
                  <div className="flex text-base max-md:flex-col sm:gap-4">
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
                  <canvas id="today-graph" ref={todayChartCanvas}></canvas>
                </CardBody>
                <CardFooter>
                  <h4 className="text-base">
                    {maxTodayVal === 0 ? (
                      <>Add logs to view highest emission</>
                    ) : (
                      <>
                        <strong>Highest emission: </strong>
                        {capitalizeFirstLetter(maxTodayKey)} produced{" "}
                        {maxTodayVal}
                        kg of CO<sub>2</sub>
                      </>
                    )}
                  </h4>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="flex justify-between gap-2 text-lg font-medium max-sm:flex-col sm:items-center">
                  <h3 className="font-semibold max-md:w-full">Month</h3>
                  <div className="flex text-base max-md:flex-col sm:gap-4">
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
                    height={298}
                  ></canvas>
                </CardBody>
                <CardFooter>
                  <h4 className="text-base">
                    {maxMonthVal === 0 ? (
                      <>Add logs to view highest emission</>
                    ) : (
                      <>
                        <strong>Highest emission: </strong>
                        {capitalizeFirstLetter(maxMonthKey)} produced{" "}
                        {maxMonthVal}
                        kg of CO<sub>2</sub>
                      </>
                    )}
                  </h4>
                </CardFooter>
              </Card>
              <Card className="md:col-span-2 lg:col-span-3">
                <CardHeader className="flex justify-between gap-2 text-lg font-medium max-sm:flex-col sm:items-center">
                  <h3 className="font-semibold max-md:w-full">Year</h3>
                  <div className="flex text-base max-md:flex-col sm:gap-4">
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
                  <canvas id="year-graph" ref={yearChartCanvas}></canvas>
                </CardBody>
                <CardFooter>
                  <h4 className="text-base">
                    {maxYearVal === 0 ? (
                      <>Add logs to view highest emission</>
                    ) : (
                      <>
                        <strong>Highest emission: </strong>
                        {capitalizeFirstLetter(maxYearKey)} produced{" "}
                        {maxYearVal}
                        kg of CO<sub>2</sub>
                      </>
                    )}
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
