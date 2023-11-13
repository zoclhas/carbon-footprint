"use client";

import useLocalStorage from "@/lib/use-local-store";
import { UserProps, MyClassProps, Activites } from "@/payload-types";
import {
  Chip,
  Divider,
  Spinner,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Link,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@nextui-org/react";
import Chart from "chart.js/auto";
import { Eye, PieChart, Users2 } from "lucide-react";
import { notFound } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export const colors = {
  green: {
    default: "rgba(23, 201, 100, 1)",
    half: "rgba(23, 201, 100, 0.5)",
    quarter: "rgba(23, 201, 100, 0.25)",
    zero: "rgba(23, 201, 100, 0)",
  },
  dGreen: {
    default: "rgba(13, 145, 70, 1)",
    quarter: "rgba(13, 145, 70, 0.25)",
  },
};

export function MyClass({
  classId,
  tab,
}: {
  classId: string;
  tab: "students" | "stats";
}) {
  const [loading, setLoading] = useState(true);
  //@ts-ignore
  const [classDetails, setClassDetails] = useState<MyClassProps>({});
  // @ts-ignore
  const [user]: UserProps[] = useLocalStorage("user", null);
  const [currTab, setCurrTab] = useState<"students" | "stats">("students");

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
    if (Object.keys(classDetails).length > 1) {
      const todayChartCleanup = createChart(
        todayChartCanvas,
        classDetails.emissions_stats.todays_emission.activties,
      );
      const monthChartCleanup = createChart(
        monthChartCanvas,
        classDetails.emissions_stats.months_emission.activties,
      );
      const yearChartCleanup = createChart(
        yearChartCanvas,
        classDetails.emissions_stats.years_emission.activties,
      );

      return function cleanup() {
        todayChartCleanup && todayChartCleanup();
        monthChartCleanup && monthChartCleanup();
        yearChartCleanup && yearChartCleanup();
      };
    }
  }, [currTab, classDetails]);

  useEffect(() => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const getClassDetails = async () => {
      const res = await fetch(process.env.NEXT_PUBLIC_API + "/api/my-class", {
        method: "post",
        cache: "no-store",
        headers: headers,
        body: JSON.stringify({
          class_id: classId,
        }),
      });
      const data: MyClassProps = await res.json();
      const errorMessages = [
        "No class found under your account.",
        "You need to be a teacher to access this.",
        "Failed to fetch your class data.",
      ];
      if (data.message && errorMessages.includes(data.message)) {
        return notFound();
      }

      setClassDetails(data);
      setLoading(false);
    };

    if (user) {
      headers.append("Authorization", "users API-Key " + user.user.apiKey);
      getClassDetails();
    }
  }, [user]);
  useEffect(() => {
    setCurrTab(tab);
  }, [tab]);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl p-5 pt-10 flex justify-center min-h-[50vh] items-center">
        <Spinner color="success" size="lg" />
      </main>
    );
  }

  if (Object.keys(classDetails).length > 0) {
    const [maxTodayKey, maxTodayVal] = Object.entries(
      classDetails.emissions_stats.todays_emission.activties,
    ).reduce((a, b) => (a[1] > b[1] ? a : b));
    const [maxMonthKey, maxMonthVal] = Object.entries(
      classDetails.emissions_stats.months_emission.activties,
    ).reduce((a, b) => (a[1] > b[1] ? a : b));
    const [maxYearKey, maxYearVal] = Object.entries(
      classDetails.emissions_stats.years_emission.activties,
    ).reduce((a, b) => (a[1] > b[1] ? a : b));

    return (
      <main className="mx-auto max-w-7xl p-5 pt-10">
        <section className="flex md:flex-row flex-col justify-between gap-4 md:items-center">
          <div>
            <h1 className="text-5xl font-semibold">
              {classDetails.class_section}
            </h1>
            <h2 className="sm:text-3xl text-xl font-medium flex items-center gap-1 flex-wrap">
              Class Teacher:{" "}
              <Chip
                variant="flat"
                color={
                  classDetails.class_teacher.name === user.user.name
                    ? "success"
                    : "warning"
                }
                className="sm:text-3xl text-xl h-full"
              >
                {classDetails.class_teacher.name}
              </Chip>
            </h2>
          </div>

          <div className="flex flex-col sm:justify-center">
            <h3 className="sm:grid grid-cols-2 gap-1 w-full sm:place-items-end">
              <strong>Total Students:</strong>{" "}
              <span className="justify-self-start">
                {classDetails.students.length}
              </span>
            </h3>
            <h3 className="sm:grid grid-cols-2 gap-1 w-full sm:place-items-end">
              <strong>Today&apos;s Emission: </strong>
              <span className="justify-self-start">
                {classDetails.emissions_stats.todays_emission.total} kg of CO
                <sub>2</sub>
              </span>
            </h3>
            <h3 className="sm:grid grid-cols-2 gap-1 w-full sm:place-items-end">
              <strong>Today&apos;s Avg Emission: </strong>
              <span className="justify-self-start">
                {classDetails.emissions_stats.todays_emission.avg} kg of CO
                <sub>2</sub>
              </span>
            </h3>
          </div>
        </section>

        <Divider className="my-8" />

        <ButtonGroup>
          <Button
            size="lg"
            variant={currTab === "students" ? "flat" : "faded"}
            color="success"
            onPress={() => setCurrTab("students")}
            startContent={<Users2 />}
          >
            Students
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

        {currTab === "students" ? (
          <section className="mt-4">
            <h1 className="text-3xl font-medium">Students</h1>
            <Table isHeaderSticky isStriped className="mt-3">
              <TableHeader>
                <TableColumn>NAME</TableColumn>
                <TableColumn>
                  <span className="opacity-0">ROLE</span>
                </TableColumn>
              </TableHeader>
              <TableBody>
                {classDetails.students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="text-lg">{student.name}</TableCell>
                    <TableCell className="flex justify-end">
                      <Button
                        as={Link}
                        href={"/account/" + classId + "/" + student.id}
                        color="success"
                        variant="flat"
                        startContent={<Eye />}
                      >
                        View Student
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>
        ) : (
          <section className="mt-4">
            <h1 className="text-3xl font-medium">Stats</h1>
            <Card className="mt-2 bg-warning-50">
              <CardHeader>
                <h2 className="text-xl font-semibold">
                  <strong>
                    {classDetails.student_with_highest_emission.student.name}
                  </strong>{" "}
                  has produced the most carbon footprint with{" "}
                  <strong>
                    {classDetails.student_with_highest_emission.emission} kg of
                    CO
                    <sub>2</sub>
                  </strong>
                </h2>
              </CardHeader>
            </Card>

            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 w-full mt-8">
              <Card className="lg:col-span-2">
                <CardHeader className="text-lg font-medium flex max-sm:flex-col justify-between gap-2 sm:items-center">
                  <h3 className="max-md:w-full font-semibold">Today</h3>
                  <div className="flex max-md:flex-col sm:gap-4 text-base">
                    <h3>
                      <strong>Today&apos;s Emission: </strong>
                      <span className="justify-self-start">
                        {classDetails.emissions_stats.todays_emission.total} kg
                        of CO
                        <sub>2</sub>
                      </span>
                    </h3>
                    <h3>
                      <strong>Today&apos;s Avg Emission: </strong>
                      <span className="justify-self-start">
                        {classDetails.emissions_stats.todays_emission.avg} kg of
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
                        {classDetails.emissions_stats.months_emission.total} kg
                        of CO
                        <sub>2</sub>
                      </span>
                    </h3>
                    <h3>
                      <strong>Month&apos;s Avg Emission: </strong>
                      <span className="justify-self-start">
                        {classDetails.emissions_stats.months_emission.avg} kg of
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
                        {classDetails.emissions_stats.years_emission.total} kg
                        of CO
                        <sub>2</sub>
                      </span>
                    </h3>
                    <h3>
                      <strong>Year&apos;s Avg Emission: </strong>
                      <span className="justify-self-start">
                        {classDetails.emissions_stats.years_emission.avg} kg of
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
