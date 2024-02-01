import { Card, CardBody, Link } from "@nextui-org/react";
import { Metadata } from "next";
import { Form } from "./form";

export const metadata: Metadata = {
  title: "Register | CarbTrkr",
  description: "Register into CarbTrkr",
};

export default function Register({
  searchParams,
}: {
  searchParams: { message: string; success: string };
}) {
  const message = searchParams.message ?? null;
  const success = searchParams.success ?? null;
  const messageBg = success === "true" ? "bg-success-50" : "bg-danger-50";

  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center gap-2 px-4">
      {message && (
        <Card className={`${messageBg} max-w-[450px] w-full`}>
          <CardBody>{message.split("+").join(" ")}</CardBody>
        </Card>
      )}
      <Form />
      <div className="flex w-full max-w-[450px] flex-wrap justify-between gap-4">
        <Link href="/login" color="success">
          Login
        </Link>
      </div>
    </main>
  );
}
