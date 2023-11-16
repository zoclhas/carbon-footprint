import { StudentIdPage } from ".";

export default function SudentId({
  params,
}: {
  params: { classId: string; studId: string };
}) {
  return <StudentIdPage classId={params.classId} studentId={params.studId} />;
}
