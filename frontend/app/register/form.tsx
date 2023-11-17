"use client";

import { redirect, useRouter } from "next/navigation";
import { v4 as uuid4 } from "uuid";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Input,
} from "@nextui-org/react";
import useLocalStorage from "@/lib/use-local-store";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { UserProps } from "@/payload-types";
import { getCookie, setCookie } from "cookies-next";

export const Form = () => {
  const router = useRouter();
  // @ts-ignore
  const user: UserProps | null = JSON.parse(getCookie("user") ?? "null");
  const [visible, setVisible] = useState<boolean>(false);
  const toggleVisibility = () => setVisible(!visible);

  const submitHandler = async (data: FormData) => {
    const name = data.get("name")!;
    const email = data.get("email")!;
    const password = data.get("password")!;
    const confirmPassword = data.get("confirm-password")!;

    if (password !== confirmPassword) {
      router.push(`/register?message=Passwords+must+match`);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", confirmPassword);
      formData.append("enableAPIKey", "true");
      formData.append("apiKey", uuid4());

      const res = await fetch(process.env.NEXT_PUBLIC_API + "/api/users", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        try {
          const error = err.errors[0].message;
          router.push("/register?message=" + error.split(" ").join("+"));
        } catch {
          router.push("/register?message=Error+logging+you+in");
        }
      }

      const loginRes = await fetch(
        process.env.NEXT_PUBLIC_API + "/api/users/login",
        {
          method: "POST",
          body: formData,
        },
      );
      if (!loginRes.ok) {
        const err = await res.json();
        try {
          const error = err.errors[0].message;
          router.push("/register?message=" + error.split(" ").join("+"));
        } catch {
          router.push("/register?message=Error+logging+you+in");
        }
      }
      const loginUser = await loginRes.json();

      // @ts-ignore
      setCookie("user", JSON.stringify(loginUser), {
        maxAge: 2650000,
      });

      router.push("/account");
      location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  if (user && Object.keys(user).length > 1) {
    router.push("/account");
    location.reload();
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
          <h1 className="text-2xl font-semibold">Register</h1>
        </CardHeader>
        <Divider />
        <CardBody className="flex flex-col gap-2">
          <Input name="name" type="text" label="Name" size="lg" isRequired />
          <Input name="email" type="email" label="Email" size="lg" isRequired />
          <Input
            name="password"
            type={visible ? "text" : "password"}
            label="Password"
            size="lg"
            isRequired
            endContent={
              <Button
                isIconOnly
                variant="light"
                color="success"
                onClick={toggleVisibility}
              >
                {visible ? (
                  <EyeOff className="stroke-foreground-400" />
                ) : (
                  <Eye className="stroke-foreground-400" />
                )}
              </Button>
            }
          />
          <Input
            name="confirm-password"
            type={visible ? "text" : "password"}
            label="Password"
            size="lg"
            isRequired
            endContent={
              <Button
                isIconOnly
                variant="light"
                color="success"
                onClick={toggleVisibility}
              >
                {visible ? (
                  <EyeOff className="stroke-foreground-400" />
                ) : (
                  <Eye className="stroke-foreground-400" />
                )}
              </Button>
            }
          />
        </CardBody>
        <Divider />
        <CardFooter className="flex justify-end">
          <Button size="lg" type="submit" variant="flat" color="success">
            Register
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};
