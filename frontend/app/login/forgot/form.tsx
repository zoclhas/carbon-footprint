"use client";

import { redirect, useRouter } from "next/navigation";
import { User, UserProps } from "@/payload-types";
import { setCookie, getCookie } from "cookies-next";
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

export const Form = () => {
  const router = useRouter();
  // @ts-ignore
  const user: UserProps | null = JSON.parse(getCookie("user") ?? "null");

  const submitHandler = async (data: FormData) => {
    const email = data.get("email")!;

    const myHeaders = new Headers();

    const formData = new FormData();
    formData.append("email", email);

    const res = await fetch(
      process.env.NEXT_PUBLIC_API + "/api/users/forgot-password",
      {
        method: "POST",
        headers: myHeaders,
        body: formData,
      },
    );

    if (!res.ok) {
      const err = await res.json();
      try {
        const error = err.errors[0].message;
        router.push("/login/forgot?message=" + error.split(" ").join("+"));
      } catch {
        router.push("/login/forgot?message=Error+sending");
      }
    }
    const sent: { message: string } = await res.json();

    if (sent.message === "Success") {
      router.push("/login?message=Check+your+mail&success=true");
    }
  };

  if (user && Object.keys(user).length > 1) {
    router.push("/account");
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submitHandler(new FormData(e.currentTarget));
      }}
      className="max-w-[450px] w-full"
    >
      <Card className="max-w-[450px] w-full">
        <CardHeader>
          <h1 className="text-2xl font-semibold">Forgot Password</h1>
        </CardHeader>
        <Divider />
        <CardBody className="flex flex-col gap-2">
          <Input name="email" type="email" label="Email" size="lg" isRequired />
        </CardBody>
        <Divider />
        <CardFooter className="flex justify-end">
          <Button size="lg" type="submit" variant="flat" color="success">
            Send
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};
