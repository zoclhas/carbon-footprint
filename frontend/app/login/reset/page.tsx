import { Card, CardBody } from "@nextui-org/react";
import { Metadata } from "next";
import { Form } from "./form";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Reset Password | CarbTrkr",
};

export default function Login({
  searchParams,
}: {
  searchParams: { message: string; token: string };
}) {
  const message = searchParams.message ?? null;
  const token = searchParams.token ?? null;

  if (!token) redirect("/login");

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 gap-2 flex-col">
      {message && (
        <Card className="bg-danger-50 max-w-[450px] w-full">
          <CardBody>{message.split("+").join(" ")}</CardBody>
        </Card>
      )}
      <Form token={token} />
    </main>
  );
}
