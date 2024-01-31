"use client";

import { Log, UserProps } from "@/payload-types";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Select,
  SelectItem,
  Input,
  CardFooter,
  Tabs,
  Tab,
} from "@nextui-org/react";
import { Bike, Plus, Trash2 } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { useState } from "react";

export function Page() {
  const router = useRouter();
  const [tab, setTab] = useState<"travel" | "waste" | "electricity">("travel");
  // @ts-ignore
  const user: UserProps | null = JSON.parse(getCookie("user") ?? "null");
  const userDetails = user && user.user;

  const date = new Date();
  const rightNow = date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  const rightNowISO = date.toISOString();

  const submitHandler = async (data: FormData) => {
    const apiKey = userDetails!.apiKey;
    const activity = data.get("activity")!;
    const distance = data.get("distance")!;
    const people = data.get("people")!;

    const log = {
      timestamp: rightNowISO,
      activity: activity,
      distance: distance,
      people: people,
      //@ts-ignore
      emission: emissionValues[activity] * Number(distance) * Number(people),
    };

    const headers = new Headers();
    headers.append("Authorization", `users API-Key ${apiKey}`);
    headers.append("Content-Type", "application/json");

    const res = await fetch(process.env.NEXT_PUBLIC_API + "/api/logs", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(log),
    });
    const updatedData = await res.json();

    if (updatedData) {
      router.push("/account");
    }
  };
  const wasteSubmitHandler = async (data: FormData) => {
    const apiKey = userDetails!.apiKey;
    const waste = data.get("waste")!;
    const qty = data.get("quantity")!;

    const log = {
      user: user!.user.id,
      timestamp: rightNowISO,
      waste: waste,
      quantity: Number(qty),
      // @ts-ignore
      emission: emissionValuesWaste[waste] * Number(qty),
    };

    const headers = new Headers();
    headers.append("Authorization", `users API-Key ${apiKey}`);
    headers.append("Content-Type", "application/json");

    const res = await fetch(process.env.NEXT_PUBLIC_API + "/api/waste", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(log),
    });
    const updatedData = await res.json();

    if (updatedData && res.ok) {
      router.push("/account");
    }
  };

  return (
    <main className="mx-auto max-w-7xl p-5 pt-10">
      <h1 className="text-3xl font-semibold">Add Log</h1>

      <Tabs
        size="lg"
        selectedKey={tab}
        onSelectionChange={setTab as any}
        className="mt-6"
      >
        <Tab value="travel" title="Travel">
          <form
            className="mt-4"
            onSubmit={(e) => {
              e.preventDefault();
              submitHandler(new FormData(e.currentTarget));
            }}
          >
            <Card>
              <CardHeader>
                <h2 className="text-xl">{rightNow}</h2>
              </CardHeader>
              <CardBody className="flex flex-col gap-2">
                <Select
                  name="activity"
                  label="Activity"
                  isRequired
                  size="lg"
                  startContent={<Bike />}
                  defaultSelectedKeys={["car"]}
                >
                  {activities.map((act) => (
                    <SelectItem key={act.value} value={act.value}>
                      {act.label}
                    </SelectItem>
                  ))}
                </Select>

                <Input
                  name="distance"
                  label="Distance (km)"
                  type="number"
                  isRequired
                />
                <Input
                  name="people"
                  label="Person Count"
                  type="number"
                  min={1}
                  defaultValue="1"
                  isRequired
                />
              </CardBody>

              <CardFooter className="flex justify-end">
                <Button
                  type="submit"
                  color="success"
                  variant="flat"
                  startContent={<Plus />}
                >
                  Add
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Tab>
        <Tab key="waste" title="Waste">
          <form
            className="mt-4"
            onSubmit={(e) => {
              e.preventDefault();
              wasteSubmitHandler(new FormData(e.currentTarget));
            }}
          >
            <Card>
              <CardHeader>
                <h2 className="text-xl">{rightNow}</h2>
              </CardHeader>
              <CardBody className="flex flex-col gap-2">
                <Select
                  name="waste"
                  label="Waste"
                  isRequired
                  size="lg"
                  startContent={<Trash2 />}
                  defaultSelectedKeys={["plastic"]}
                >
                  {wastes.map((act) => (
                    <SelectItem key={act.value} value={act.value}>
                      {act.label}
                    </SelectItem>
                  ))}
                </Select>

                <Input
                  name="quantity"
                  label="Quantity"
                  type="number"
                  isRequired
                />
              </CardBody>

              <CardFooter className="flex justify-end">
                <Button
                  type="submit"
                  color="success"
                  variant="flat"
                  startContent={<Plus />}
                >
                  Add
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Tab>
        <Tab key="electricity" title="Electricity"></Tab>
      </Tabs>
    </main>
  );
}

const activities = [
  { label: "Car", value: "car" },
  { label: "Bus", value: "bus" },
  { label: "Metro", value: "metro" },
  { label: "Cycle", value: "cycle" },
  { label: "Walk", value: "walk" },
  { label: "Plane", value: "plane" },
];

const wastes = [
  { label: "E-Waste", value: "ewaste" },
  { label: "Plastic", value: "plastic" },
  { label: "Paper", value: "paper" },
  { label: "Glass", value: "glass" },
  { label: "Can", value: "can" },
];

const emissionValues = {
  car: 0.17,
  bus: 0.096,
  metro: 0.035,
  cycle: 0.008,
  walk: 0.001,
  plane: 0.249,
};
const emissionValuesWaste = {
  ewaste: 110.3,
  plastic: 0.1,
  paper: 0.8,
  glass: 0.025,
  can: 0.025,
};
