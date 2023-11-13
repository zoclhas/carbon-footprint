import { Metadata } from "next";
import { MyClass } from ".";

export const metadata: Metadata = {
  title: "My Class | CarbTrkr",
  description: "Login in view your class.",
};

export default function MyClassPage({
  params,
  searchParams,
}: {
  params: { classId: string };
  searchParams: {
    tab: "students" | "stats";
  };
}) {
  return (
    <MyClass classId={params.classId} tab={searchParams.tab ?? "students"} />
  );
}
