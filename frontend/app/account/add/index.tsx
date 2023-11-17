"use client";

import useLocalStorage from "@/lib/use-local-store";
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
} from "@nextui-org/react";
import { Bike, Plus } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { getCookie } from "cookies-next";

export function Page() {
  const router = useRouter();
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

  return (
    <main className="mx-auto max-w-7xl p-5 pt-10">
      <h1 className="font-semibold text-3xl">Add Log</h1>

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

const emissionValues = {
  car: 0.17,
  bus: 0.096,
  metro: 0.035,
  cycle: 0.008,
  walk: 0.001,
  plane: 0.249,
};
