"use client";

import { ClassStudent, UserProps } from "@/payload-types";
import { Card, CardHeader, Spinner } from "@nextui-org/react";
import { getCookie } from "cookies-next";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function SectionPage({ sectionId }: { sectionId: string }) {
  const [loading, setLoading] = useState(true);
  // @ts-ignore
  const [sectionDetails, setSectionDetails] = useState();
  const user: UserProps | null = JSON.parse(getCookie("user") ?? "null");

  useEffect(() => {
    if (!user) {
      redirect("/login");
    }
  }, [user]);
  useEffect(() => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const getSectionsDetails = async () => {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API + "/api/my-sections",
        {
          method: "post",
          cache: "no-store",
          headers: headers,
          body: JSON.stringify({
            section_id: sectionId,
          }),
        },
      );
      const data: MyClassProps = await res.json();
      console.log(data);

      setSectionDetails(data);
      setLoading(false);
    };

    if (user) {
      headers.append("Authorization", "users API-Key " + user.user.apiKey);
      getSectionsDetails();
    }
  }, [sectionId]);

  if (loading) {
    return (
      <main className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center p-5 pt-10">
        <Spinner color="success" size="lg" />
      </main>
    );
  }

  if (sectionDetails.message) {
    return (
      <main className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center p-5 pt-10">
        <Card className="bg-danger-50">
          <CardHeader>{sectionDetails.message}</CardHeader>
        </Card>
      </main>
    );
  }

  return <main className="mx-auto max-w-7xl p-5 pt-10">{sectionId}</main>;
}
