"use client";

import {
  UserProps,
  Activities,
  ClassStudent,
  MessageSendProps,
  Wastes,
} from "@/payload-types";
import { useState, useRef, useEffect } from "react";
import Chart from "chart.js/auto";
import { colors } from "@/app/account/[classId]/index";
import {
  Card,
  CardHeader,
  Spinner,
  Button,
  Accordion,
  AccordionItem,
  Tooltip,
  CardBody,
  CardFooter,
  Chip,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Textarea,
  ModalFooter,
  Tabs,
  Tab,
  ScrollShadow,
} from "@nextui-org/react";
import { Send } from "lucide-react";
import { getCookie } from "cookies-next";

export function StudentIdPage({
  classId,
  studentId,
}: {
  classId: string;
  studentId: string;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"travel" | "waste" | "electricity">("travel");
  //@ts-ignore
  const [student, setStudent] = useState<ClassStudent>({});
  // @ts-ignore
  const user: UserProps | null = JSON.parse(getCookie("user") ?? "null");

  useEffect(() => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const getStudentDetails = async () => {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API + "/api/my-class/student",
        {
          method: "post",
          cache: "no-store",
          headers: headers,
          body: JSON.stringify({
            class_id: classId,
            student_id: studentId,
          }),
        },
      );
      const data: ClassStudent = await res.json();
      setStudent(data);
      setLoading(false);
    };

    if (user) {
      headers.append("Authorization", "users API-Key " + user.user.apiKey);
      getStudentDetails();
    }
  }, []);

  function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const todayChartCanvas = useRef<HTMLCanvasElement>(null);
  const monthChartCanvas = useRef<HTMLCanvasElement>(null);
  const yearChartCanvas = useRef<HTMLCanvasElement>(null);
  const electricityYearChartCanvas = useRef<HTMLCanvasElement>(null);

  function createChart(
    canvasRef: any,
    data: Activities | Wastes | Record<string, string>,
  ) {
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
    if (Object.keys(student).length > 1) {
      if (tab === "travel") {
        const todayChartCleanup = createChart(
          todayChartCanvas,
          student.activities.today,
        );
        const monthChartCleanup = createChart(
          monthChartCanvas,
          student.activities.month,
        );
        const yearChartCleanup = createChart(
          yearChartCanvas,
          student.activities.year,
        );

        return function cleanup() {
          todayChartCleanup && todayChartCleanup();
          monthChartCleanup && monthChartCleanup();
          yearChartCleanup && yearChartCleanup();
        };
      } else if (tab == "waste") {
        const todayChartCleanup = createChart(
          todayChartCanvas,
          student.waste.stats.today,
        );
        const monthChartCleanup = createChart(
          monthChartCanvas,
          student.waste.stats.month,
        );
        const yearChartCleanup = createChart(
          yearChartCanvas,
          student.waste.stats.year,
        );

        return function cleanup() {
          todayChartCleanup && todayChartCleanup();
          monthChartCleanup && monthChartCleanup();
          yearChartCleanup && yearChartCleanup();
        };
      } else if (tab === "electricity") {
        const yearlyElectricityCleanup = createChart(
          electricityYearChartCanvas,
          student.electricity,
        );

        return function cleanup() {
          yearlyElectricityCleanup && yearlyElectricityCleanup();
        };
      }
    }
  }, [student, tab]);

  const [msgLoading, setMsgLoading] = useState<boolean>(false);
  const [msgData, setMsgData] = useState<MessageSendProps>({});

  const sendMessage = async (formData: FormData, onClose: () => void) => {
    setMsgLoading(true);
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "users API-Key " + user!.user.apiKey);
    const message = formData.get("message")!;

    const res = await fetch(process.env.NEXT_PUBLIC_API + "/api/send-message", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        stud_id: studentId,
        message,
      }),
    });
    const data: MessageSendProps = await res.json();
    setMsgData(data);
    setMsgLoading(false);

    if (data.success) {
      setTimeout(() => onClose(), 1000);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center p-5 pt-10">
        <Spinner color="success" size="lg" />
      </main>
    );
  }

  if (student.message) {
    return (
      <main className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center p-5 pt-10">
        <Card className="bg-danger-50">
          <CardHeader>{student.message}</CardHeader>
        </Card>
      </main>
    );
  }

  const todaysLogsSort = !loading && student ? [...student.logs].reverse() : [];

  if (student && Object.keys(student).length > 1) {
    const [maxTodayKey, maxTodayVal] = Object.entries(
      tab === "travel" ? student.activities.today : student.waste.stats.today,
    ).reduce((a, b) => (a[1] > b[1] ? a : b));
    const [maxMonthKey, maxMonthVal] = Object.entries(
      tab === "travel" ? student.activities.month : student.waste.stats.month,
    ).reduce((a, b) => (a[1] > b[1] ? a : b));
    const [maxYearKey, maxYearVal] = Object.entries(
      tab === "travel" ? student.activities.year : student.waste.stats.year,
    ).reduce((a, b) => (a[1] > b[1] ? a : b));
    const [maxElectricityKey, maxElectricityVal] = Object.entries(
      student.electricity,
    ).reduce((a, b) => (a[1] > b[1] ? a : b));

    return (
      <main className="mx-auto max-w-7xl p-5 pt-10">
        <section className="flex items-center justify-between gap-2 max-sm:flex-wrap">
          <div className="flex items-center gap-2">
            <div className="flex gap-2 max-sm:flex-col sm:items-center">
              <h1 className="text-5xl">{student.student.name}</h1>
            </div>
            <Chip variant="dot" color="primary">
              {student.student.class}
            </Chip>
          </div>
          <Tooltip content="Send Message">
            <Button
              variant="flat"
              color="warning"
              startContent={<Send />}
              isIconOnly
              onPress={onOpen}
            />
          </Tooltip>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
            <ModalContent>
              {(onClose) => (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage(new FormData(e.currentTarget), onClose);
                  }}
                >
                  {!msgLoading && msgData.success && (
                    <ModalHeader>Sent Message!</ModalHeader>
                  )}
                  {!msgData.message && !msgData.success && (
                    <>
                      <ModalHeader>
                        Send message to {student.student.name}
                      </ModalHeader>
                      <ModalBody>
                        <Textarea
                          name="message"
                          isRequired
                          label="Message"
                          isDisabled={msgLoading}
                        />
                      </ModalBody>
                      <ModalFooter className="flex justify-end">
                        <Button
                          type="submit"
                          variant="flat"
                          color="success"
                          isLoading={msgLoading}
                          startContent={!msgLoading && <Send />}
                        >
                          Send
                        </Button>
                      </ModalFooter>
                    </>
                  )}
                </form>
              )}
            </ModalContent>
          </Modal>
        </section>

        {student.emission_stats && (
          <Tabs
            size="lg"
            selectedKey={tab}
            onSelectionChange={setTab as any}
            className="mt-8"
          >
            <Tab key="travel" title="Travel">
              <>
                <section className="mt-6">
                  <div className="mb-3 flex justify-between gap-2 max-sm:flex-col sm:items-center">
                    <h1 className="text-3xl font-semibold">
                      Today&apos;s Logs
                    </h1>

                    <div className="flex max-sm:flex-col sm:items-center sm:gap-2">
                      {!loading && (
                        <>
                          <h2>
                            <strong>Today&apos;s Emission:</strong>{" "}
                            {student.emission_stats.total_emission.today ?? 0}{" "}
                            kg of CO
                            <sub>2</sub>
                          </h2>
                          <h2>
                            <strong>Today&apos;s Average Emission:</strong>{" "}
                            {student.emission_stats.average_emission.today ?? 0}{" "}
                            kg of CO
                            <sub>2</sub>
                          </h2>
                        </>
                      )}
                    </div>
                  </div>

                  {todaysLogsSort.length ? (
                    <ScrollShadow className="h-[420px]">
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

                            function capitalizeFirstLetter(
                              str: string,
                            ): string {
                              return str.charAt(0).toUpperCase() + str.slice(1);
                            }

                            return (
                              <AccordionItem key={log.id} title={time}>
                                <ul>
                                  <li>
                                    <strong>Activity:</strong>&nbsp;
                                    <span>
                                      {capitalizeFirstLetter(log.activity)}
                                    </span>
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
                    </ScrollShadow>
                  ) : null}

                  {todaysLogsSort.length === 0 && (
                    <Card>
                      <CardHeader>
                        <h3>
                          {student.student.name} has&apos;t added any logs
                          today!
                        </h3>
                      </CardHeader>
                    </Card>
                  )}
                </section>
                {student.emission_stats && (
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
                                {student.emission_stats.total_emission.today} kg
                                of CO
                                <sub>2</sub>
                              </span>
                            </h3>
                            <h3>
                              <strong>Today&apos;s Avg Emission: </strong>
                              <span className="justify-self-start">
                                {student.emission_stats.average_emission.today}{" "}
                                kg of CO
                                <sub>2</sub>
                              </span>
                            </h3>
                          </div>
                        </CardHeader>
                        <CardBody>
                          <canvas
                            id="today-graph"
                            ref={todayChartCanvas}
                          ></canvas>
                        </CardBody>
                        <CardFooter>
                          <h4 className="text-base">
                            {maxTodayVal === 0 ? (
                              <>Add logs to view highest emission</>
                            ) : (
                              <>
                                <strong>Highest emission: </strong>
                                {capitalizeFirstLetter(
                                  maxTodayKey,
                                )} produced {maxTodayVal}
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
                                {student.emission_stats.total_emission.month} kg
                                of CO
                                <sub>2</sub>
                              </span>
                            </h3>
                            <h3>
                              <strong>Month&apos;s Avg Emission: </strong>
                              <span className="justify-self-start">
                                {student.emission_stats.average_emission.month}{" "}
                                kg of CO
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
                                {capitalizeFirstLetter(
                                  maxMonthKey,
                                )} produced {maxMonthVal}
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
                                {student.emission_stats.total_emission.year} kg
                                of CO
                                <sub>2</sub>
                              </span>
                            </h3>
                            <h3>
                              <strong>Year&apos;s Avg Emission: </strong>
                              <span className="justify-self-start">
                                {student.emission_stats.average_emission.year}{" "}
                                kg of CO
                                <sub>2</sub>
                              </span>
                            </h3>
                          </div>
                        </CardHeader>
                        <CardBody>
                          <canvas
                            id="year-graph"
                            ref={yearChartCanvas}
                          ></canvas>
                        </CardBody>
                        <CardFooter>
                          <h4 className="text-base">
                            {maxYearVal === 0 ? (
                              <>Add logs to view highest emission</>
                            ) : (
                              <>
                                <strong>Highest emission: </strong>
                                {capitalizeFirstLetter(
                                  maxYearKey,
                                )} produced {maxYearVal}
                                kg of CO<sub>2</sub>
                              </>
                            )}
                          </h4>
                        </CardFooter>
                      </Card>
                    </div>
                  </section>
                )}
              </>
            </Tab>
            <Tab key="waste" title="Waste">
              <section className="mt-6">
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
                              {student.waste.total.today} kg of CO
                              <sub>2</sub>
                            </span>
                          </h3>
                        </div>
                      </CardHeader>
                      <CardBody>
                        <canvas
                          id="today-graph"
                          ref={todayChartCanvas}
                        ></canvas>
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
                              {student.waste.total.month} kg of CO
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
                              {student.waste.total.year} kg of CO
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
              </section>
            </Tab>
            <Tab key="electricity" title="Electricity">
              <section className="mt-6">
                <Card className="md:col-span-2 lg:col-span-3">
                  <CardBody>
                    <canvas
                      id="year-graph"
                      ref={electricityYearChartCanvas}
                    ></canvas>
                  </CardBody>
                  <CardFooter>
                    <h4 className="text-base">
                      <strong>Highest emission: </strong>
                      {capitalizeFirstLetter(maxElectricityKey)} with{" "}
                      {maxElectricityVal} kWh
                    </h4>
                  </CardFooter>
                </Card>
              </section>
            </Tab>
          </Tabs>
        )}
      </main>
    );
  }
}
