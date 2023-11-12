"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Input,
} from "@nextui-org/react";
import { PasswordInput } from "@/components/password";
import { getUserDetails, submitHandler } from "./actions";
import { redirect } from "next/navigation";

export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const message = searchParams.message ?? null;

  const user = getUserDetails();
  if (user) {
    redirect("/account");
  }

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 gap-2 flex-col">
      {message && (
        <Card className="bg-danger-50 max-w-[450px] w-full">
          <CardBody>{message.split("+").join(" ")}</CardBody>
        </Card>
      )}
      <form action={submitHandler} className="max-w-[450px] w-full">
        <Card className="max-w-[450px] w-full">
          <CardHeader>
            <h1 className="text-2xl font-semibold">Login</h1>
          </CardHeader>
          <Divider />
          <CardBody className="flex flex-col gap-2">
            <Input name="email" type="email" label="Email" size="lg" required />
            <PasswordInput />
          </CardBody>
          <Divider />
          <CardFooter className="flex justify-end">
            <Button size="lg" type="submit" variant="flat" color="success">
              Login
            </Button>
          </CardFooter>
        </Card>
      </form>
    </main>
  );
}
