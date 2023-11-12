"use client";

import useLocalStorage from "@/lib/use-local-store";
import { TodayLogsProps, UserProps } from "@/payload-types";
import {
  Button,
  Link,
  Card,
  CardHeader,
  CardBody,
  Select,
  SelectItem,
  Input,
  CardFooter,
} from "@nextui-org/react";
import { Bike, Plus } from "lucide-react";

export function Page() {
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

  return (
    <main className="mx-auto max-w-7xl p-5 pt-10">
      <h1 className="font-semibold text-3xl">Add Log</h1>

      <Card as="form" className="mt-4">
        <CardHeader>
          <h2 className="text-xl">{rightNow}</h2>
        </CardHeader>
        <CardBody className="flex flex-col gap-2">
          <Select
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
            name="distance"
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
