"use client";

import { redirect, useRouter } from "next/navigation";
import { User, UserProps } from "@/payload-types";
import { setCookie } from "cookies-next";
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
import useLocalStorage from "@/lib/use-local-store";

export const Form = () => {
  const router = useRouter();
  const [user, setUser] = useLocalStorage("user", {});

  const submitHandler = async (data: FormData) => {
    const email = data.get("email")!;
    const password = data.get("password")!;

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const res = await fetch(process.env.NEXT_PUBLIC_API + "/api/users/login", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json();
      try {
        const error = err.errors[0].message;
        router.push("/login?message=" + error.split(" ").join("+"));
      } catch {
        router.push("/login?message=Error+logging+you+in");
      }
    }
    const userData: UserProps = await res.json();
    // @ts-ignore
    setUser(userData);
  };

  if (Object.keys(user).length > 1) {
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
          <h1 className="text-2xl font-semibold">Login</h1>
        </CardHeader>
        <Divider />
        <CardBody className="flex flex-col gap-2">
          <Input name="email" type="email" label="Email" size="lg" isRequired />
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
  );
};