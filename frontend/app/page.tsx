import { Button, Link } from "@nextui-org/react";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <section className="mx-auto max-w-7xl px-4 py-20 min-h-[calc(100vh-65px)] grid grid-cols-1 md:grid-cols-2 items-center justify-center overflow-hidden w-screen relative">
        <div className="flex flex-col">
          <h1 className="text-6xl font-semibold">CarbTrkr</h1>
          <h2 className="text-2xl">(Your carbon footprint tracker)</h2>

          <p className="mt-6 text-lg">
            Start learning about your carbon footprint that you leave behind
            everyday. Add logs, check stats, learn ways to reduce!
          </p>
          <div className="mt-2 flex gap-2">
            <Button
              as={Link}
              href="/login"
              size="lg"
              variant="flat"
              color="success"
              className="w-max"
            >
              Start Tracking
            </Button>
            <Button
              as={Link}
              href="/#more"
              size="lg"
              variant="light"
              color="success"
              className="w-max"
            >
              Learn More
            </Button>
          </div>
        </div>

        <Image
          src="/hero.png"
          alt="Foot depicting various methods of Carbon footprinting"
          loading="eager"
          height={576}
          width={1000}
          className="object-cover object-center rotate-90 -scale-y-100 max-md:absolute max-md:-z-[1] max-md:opacity-20 max-md:scale-y-100 max-md:top-44 left-40"
        />
      </section>
    </main>
  );
}
