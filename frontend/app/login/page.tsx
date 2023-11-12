import { Card, CardBody, Link } from "@nextui-org/react";
import { Metadata } from "next";
import { Form } from "./form";

export const metadata: Metadata = {
  title: "Login | CarbTrkr",
  description: "Login into CarbTrkr",
};

export default function Login({
  searchParams,
}: {
  searchParams: { message: string; success: string };
}) {
  const message = searchParams.message ?? null;
  const success = searchParams.success ?? null;
  const messageBg = success === "true" ? "bg-success-50" : "bg-danger-50";

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 gap-2 flex-col">
      {message && (
        <Card className={`${messageBg} max-w-[450px] w-full`}>
          <CardBody>{message.split("+").join(" ")}</CardBody>
        </Card>
      )}
      <Form />
      <div className="max-w-[450px] w-full flex justify-between gap-4 flex-wrap">
        <Link href="/register" color="success">
          New Here? Register
        </Link>
        &#183;
        <Link href="/login/forgot">Forgot Password?</Link>
      </div>
    </main>
  );
}
