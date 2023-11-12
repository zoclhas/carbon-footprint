"use client";

import { Button, Link } from "@nextui-org/react";
import { useEffect, useState } from "react";

export function Page() {
  const [loading, setLoading] = useState(true);

  return (
    <main className="mx-auto max-w-7xl p-5 pt-10">
      <div className="flex justify-end">
        <Button
          as={Link}
          href="/account/add"
          variant="flat"
          size="lg"
          color="success"
        >
          Add Log
        </Button>
      </div>

      <section>
        <h1 className="font-semibold text-3xl">Today's Logs</h1>
      </section>
    </main>
  );
}
