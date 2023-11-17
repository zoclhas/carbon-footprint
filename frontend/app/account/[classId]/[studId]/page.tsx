import { StudentIdPage } from ".";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Class | Student | CarbTrkr",
  description: "Login in view your class.",
};

export default function SudentId({
  params,
}: {
  params: { classId: string; studId: string };
}) {
  return <StudentIdPage classId={params.classId} studentId={params.studId} />;
}
