import { Card, CardBody } from "@nextui-org/react";
import { Metadata } from "next";
import { Form } from "./form";

export const metadata: Metadata = {
  title: "Forgot Password | CarbTrkr",
  description: "Did you forget your password? Change it here.",
};

export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const message = searchParams.message ?? null;

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 gap-2 flex-col">
      {message && (
        <Card className="bg-danger-50 max-w-[450px] w-full">
          <CardBody>{message.split("+").join(" ")}</CardBody>
        </Card>
      )}
      <Form />
    </main>
  );
}
