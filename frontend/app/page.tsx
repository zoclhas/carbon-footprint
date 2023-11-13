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

      <svg
        viewBox="0 0 1000 1000"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute blur-3xl -z-[2] opacity-10 left-0 -bottom-64 max-sm:top-20"
      >
        <defs>
          <clipPath id="a">
            <path
              fill="currentColor"
              d="M829.5 642.5Q839 785 713 888.5t-252 0Q335 785 206 719.5T123.5 517q46.5-137 110-253T425 175q128 27 280.5 25.5t133.5 149q-19 150.5-9.5 293Z"
            />
          </clipPath>
        </defs>
        <g clipPath="url(#a)">
          <path
            fill="#16c15f"
            d="M829.5 642.5Q839 785 713 888.5t-252 0Q335 785 206 719.5T123.5 517q46.5-137 110-253T425 175q128 27 280.5 25.5t133.5 149q-19 150.5-9.5 293Z"
          />
        </g>
      </svg>

      <section id="more" className="mx-auto max-w-7xl px-4 pb-6">
        <ul className="flex flex-col gap-12">
          {more.map((m, i) => (
            <li
              key={i}
              className="p-4 rounded-2xl backdrop-blur-2xl bg-default-50/40"
            >
              <h1 className="text-4xl font-medium">{m.q}</h1>
              <p className="text-xl mt-2">{m.a}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

const more = [
  {
    q: "What is a carbon footprint?",
    a: "A carbon footprint is a measure of the total amount of greenhouse gases (like carbon dioxide, methane, and nitrous oxide) emitted into the atmosphere as a result of human activities. These activities can range from daily living, to manufacturing, transportation, and use of goods. The carbon footprint is often expressed in terms of carbon dioxide equivalent, such as tonnes, kilograms, or grams. Every individual, product, organization, or even country has a carbon footprint. The carbon footprint concept also includes emissions of other greenhouse gases, such as methane, nitrous oxide, or chlorofluorocarbons (CFCs).",
  },
  {
    q: "What does CarbTrkr do?",
    a: "CarbTrkr is a tool designed to track your carbon footprint at the moment. All your logs are added at the exact time you log it and you can't edit it later, meaning you're really leaving a footprint behind! We then compile your stats and give you recommendation on lowering your carbon footprint. The logs are then viewable by your class teacher and principal! So try to lower you carbon footprint!",
  },
  {
    q: "How can I get started?",
    a: "Start by creating your account, then it will automatically redirect you to your account page. You can start adding logs there. And your school may add you to their list!",
  },
];
