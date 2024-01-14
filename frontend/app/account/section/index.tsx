"use client";

import { titleWord } from "@/lib/title-str";
import {
  Activities,
  MessageSendProps,
  UserProps,
  SectionsProps,
} from "@/payload-types";
import {
  Accordion,
  AccordionItem,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { getCookie } from "cookies-next";
import { Eye, PieChart, Send, Users2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { colors } from "../[classId]";
import { Chart } from "chart.js";

export default function SectionPage() {
  const [loading, setLoading] = useState(true);
  const [sectionDetails, setSectionDetails] = useState<SectionsProps | null>(
    null,
  );
  const user: UserProps | null = JSON.parse(getCookie("user") ?? "null");
  const [currTab, setCurrTab] = useState<"sections" | "stats">("sections");

  useEffect(() => {
    if (!user) {
      redirect("/login");
    }
  }, [user]);
  useEffect(() => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const getSectionsDetails = async () => {
      const res = await fetch(process.env.NEXT_PUBLIC_API + "/api/section", {
        cache: "no-store",
        headers: headers,
      });
      const data: SectionsProps = await res.json();

      setSectionDetails(data);
      setLoading(false);
    };

    if (user) {
      headers.append("Authorization", "users API-Key " + user.user.apiKey);
      getSectionsDetails();
    }
  }, []);

  const todayChartCanvas = useRef<HTMLCanvasElement>(null);
  const monthChartCanvas = useRef<HTMLCanvasElement>(null);
  const yearChartCanvas = useRef<HTMLCanvasElement>(null);

  function createChart(canvasRef: any, data: Activities) {
    const ctx = canvasRef.current?.getContext("2d");

    if (ctx && Object.keys(data).length > 0) {
      const labels = Object.keys(data).map((act) => titleWord(act));
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
    if (sectionDetails && Object.keys(sectionDetails).length > 1) {
      const todayChartCleanup = createChart(
        todayChartCanvas,
        sectionDetails.emissions_stats.today.activties,
      );
      const monthChartCleanup = createChart(
        monthChartCanvas,
        sectionDetails.emissions_stats.month.activties,
      );
      const yearChartCleanup = createChart(
        yearChartCanvas,
        sectionDetails.emissions_stats.year.activties,
      );

      return function cleanup() {
        todayChartCleanup && todayChartCleanup();
        monthChartCleanup && monthChartCleanup();
        yearChartCleanup && yearChartCleanup();
      };
    }
  }, [currTab, sectionDetails]);

  if (loading) {
    return (
      <main className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center p-5 pt-10">
        <Spinner color="success" size="lg" />
      </main>
    );
  }

  if (sectionDetails && sectionDetails.message) {
    return (
      <main className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center p-5 pt-10">
        <Card className="bg-danger-50">
          <CardHeader>{sectionDetails.message}</CardHeader>
        </Card>
      </main>
    );
  }

  if (sectionDetails) {
    const [maxTodayKey, maxTodayVal] = Object.entries(
      sectionDetails.emissions_stats.today.activties,
    ).reduce((a, b) => (a[1] > b[1] ? a : b));
    const [maxMonthKey, maxMonthVal] = Object.entries(
      sectionDetails.emissions_stats.month.activties,
    ).reduce((a, b) => (a[1] > b[1] ? a : b));
    const [maxYearKey, maxYearVal] = Object.entries(
      sectionDetails.emissions_stats.year.activties,
    ).reduce((a, b) => (a[1] > b[1] ? a : b));
    return (
      <main className="mx-auto max-w-7xl p-5 pt-10">
        <section className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-5xl font-semibold">My School</h1>
          </div>

          <div className="flex flex-col sm:justify-center">
            <h3 className="w-full grid-cols-2 gap-1 sm:grid sm:place-items-end">
              <strong>Today&apos;s Emission: </strong>
              <span className="justify-self-start">
                {sectionDetails.emissions_stats.today.total} kg of CO
                <sub>2</sub>
              </span>
            </h3>
            <h3 className="w-full grid-cols-2 gap-1 sm:grid sm:place-items-end">
              <strong>Today&apos;s Avg Emission: </strong>
              <span className="justify-self-start">
                {sectionDetails.emissions_stats.today.avg} kg of CO
                <sub>2</sub>
              </span>
            </h3>
          </div>
        </section>

        <Divider className="my-8" />

        <ButtonGroup>
          <Button
            size="lg"
            variant={currTab === "sections" ? "flat" : "faded"}
            color="success"
            onPress={() => setCurrTab("sections")}
            startContent={<Users2 />}
          >
            Sections
          </Button>
          <Button
            size="lg"
            variant={currTab === "stats" ? "flat" : "faded"}
            color="success"
            onPress={() => setCurrTab("stats")}
            startContent={<PieChart />}
          >
            Stats
          </Button>
        </ButtonGroup>

        {currTab === "sections" && (
          <section className="mt-4">
            <Table isHeaderSticky className="mt-3">
              <TableHeader>
                <TableColumn>SECTION</TableColumn>
                <TableColumn>SECTION SUPERVISOR</TableColumn>
                <TableColumn>QUICK STATS</TableColumn>
                <TableColumn>
                  <span className="opacity-0">ROLE</span>
                </TableColumn>
              </TableHeader>
              <TableBody>
                {sectionDetails.sections.map((section) => (
                  <TableRow key={section.my_section.id}>
                    <TableCell className="text-lg">
                      {titleWord(section.my_section.section)}
                    </TableCell>
                    <TableCell className="text-lg">
                      {section.my_section.supervisor.name}
                    </TableCell>
                    <TableCell className="text-lg">
                      <Accordion isCompact>
                        <AccordionItem
                          key="1"
                          title="Quick Stats"
                          className="flex flex-col gap-2"
                        >
                          <div className="flex gap-2 max-md:flex-col">
                            <strong>Today Emission:</strong>
                            <span>
                              {section.emissions_stats.today.total} kg of CO
                              <sub>2</sub>
                            </span>
                          </div>
                          <div className="flex gap-2 max-md:flex-col">
                            <strong>Today Average Emission:</strong>
                            <span>
                              {section.emissions_stats.today.avg} kg of CO
                              <sub>2</sub>
                            </span>
                          </div>
                          <div className="flex gap-2 max-md:flex-col">
                            <strong>Month Emission:</strong>
                            <span>
                              {section.emissions_stats.month.total} kg of CO
                              <sub>2</sub>
                            </span>
                          </div>
                          <div className="flex gap-2 max-md:flex-col">
                            <strong>Year Emission:</strong>
                            <span>
                              {section.emissions_stats.year.total} kg of CO
                              <sub>2</sub>
                            </span>
                          </div>
                        </AccordionItem>
                      </Accordion>
                    </TableCell>
                    <TableCell className="flex justify-end">
                      <Button
                        as={Link}
                        href={"/account/section/" + section.my_section.id}
                        color="success"
                        variant="flat"
                        startContent={<Eye />}
                      >
                        View Section
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>
        )}

        {currTab === "stats" && (
          <section className="mt-4">
            <div className="mt-8 grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader className="flex justify-between gap-2 text-lg font-medium max-sm:flex-col sm:items-center">
                  <h3 className="font-semibold max-md:w-full">Today</h3>
                  <div className="flex text-base max-md:flex-col sm:gap-4">
                    <h3>
                      <strong>Today&apos;s Emission: </strong>
                      <span className="justify-self-start">
                        {sectionDetails.emissions_stats.today.total} kg of CO
                        <sub>2</sub>
                      </span>
                    </h3>
                    <h3>
                      <strong>Today&apos;s Avg Emission: </strong>
                      <span className="justify-self-start">
                        {sectionDetails.emissions_stats.today.avg} kg of CO
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
                        {titleWord(maxTodayKey)} produced {maxTodayVal}
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
                        {sectionDetails.emissions_stats.month.total} kg of CO
                        <sub>2</sub>
                      </span>
                    </h3>
                    <h3>
                      <strong>Month&apos;s Avg Emission: </strong>
                      <span className="justify-self-start">
                        {sectionDetails.emissions_stats.month.avg} kg of CO
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
                        {titleWord(maxMonthKey)} produced {maxMonthVal}
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
                        {sectionDetails.emissions_stats.year.total} kg of CO
                        <sub>2</sub>
                      </span>
                    </h3>
                    <h3>
                      <strong>Year&apos;s Avg Emission: </strong>
                      <span className="justify-self-start">
                        {sectionDetails.emissions_stats.year.avg} kg of CO
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
                        {titleWord(maxYearKey)} produced {maxTodayVal}
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
  return null;
}
