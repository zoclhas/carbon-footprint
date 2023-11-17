"use client";

import { useRouter } from "next/navigation";
import { UserProps } from "@/payload-types";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Input,
} from "@nextui-org/react";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { getCookie } from "cookies-next";

export const Form = ({ token }: { token: string }) => {
  const router = useRouter();
  const [visible, setVisible] = useState<boolean>(false);
  // @ts-ignore
  const user: UserProps | null = JSON.parse(getCookie("user") ?? "null");
  const toggleVisibility = () => setVisible(!visible);

  const submitHandler = async (data: FormData) => {
    const password = data.get("password")!;
    const confirmPassword = data.get("confirm-password")!;

    if (password !== confirmPassword) {
      router.push(`/login/reset?token=${token}&message=Passwords+must+match`);
      return;
    }

    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API + "/api/user/reset", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          token: token,
          password: confirmPassword,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        try {
          const error = err.errors[0].message;
          router.push("/login/reset?message=" + error.split(" ").join("+"));
        } catch {
          router.push("/login/reset?message=Error+resetting+your+password");
        }
      }
      const sent: { message: string } = await res.json();

      if (sent.message === "Password reset successfully.") {
        router.push(
          "/login?message=Password+has+been+reset.+You+may+log+in+now&success=true",
        );
      }
    } catch (err) {
      console.error(err);
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
          <h1 className="text-2xl font-semibold">Reset Password</h1>
        </CardHeader>
        <Divider />
        <CardBody className="flex flex-col gap-2">
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
            Send
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};
