import { Button, Link } from "@nextui-org/react";
import Image from "next/image";
import Markdown from "react-markdown";

export default function Home() {
  return (
    <main>
      <section className="relative mx-auto grid min-h-[calc(100vh-65px)] w-screen max-w-7xl grid-cols-1 items-center justify-center overflow-hidden px-4 py-20 md:grid-cols-2">
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
            <Button
              as={Link}
              href="/cop28"
              size="lg"
              variant="light"
              color="success"
              className="w-max"
            >
              COP28
            </Button>
          </div>
        </div>

        <Image
          src="/hero.png"
          alt="Foot depicting various methods of Carbon footprinting"
          loading="eager"
          height={576}
          width={1000}
          className="left-40 rotate-90 -scale-y-100 object-cover object-center max-md:absolute max-md:top-44 max-md:-z-[1] max-md:scale-y-100 max-md:opacity-20"
        />
      </section>

      <svg
        viewBox="0 0 1000 1000"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute -bottom-64 left-0 -z-[2] opacity-10 blur-3xl max-sm:top-20"
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
              className="bg-default-50/40 rounded-2xl p-4 backdrop-blur-2xl"
            >
              <h1 className="text-4xl font-medium">{m.q}</h1>
              <Markdown
                components={{
                  p(props) {
                    return <p className="mt-2 text-xl">{props.children}</p>;
                  },
                  ul(props) {
                    return <ul className="pl-4">{props.children}</ul>;
                  },
                  li(props) {
                    return (
                      <li className="ml-4 list-decimal text-xl">
                        {props.children}
                      </li>
                    );
                  },
                }}
              >
                {m.a}
              </Markdown>
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
  {
    q: "How to dispose e-waste?",
    a: `Electronic waste, or e-waste, refers to discarded electronic devices such as computers, smartphones, TVs, and other electronic gadgets. Proper disposal of e-waste is crucial to prevent environmental pollution and health hazards. Here are several methods to dispose of e-waste:



1. **Recycling Centers:**
   - Many countries and regions have dedicated e-waste recycling centers. These facilities are equipped to handle the proper dismantling and recycling of electronic components.
   - Check with local authorities or waste management agencies for information on nearby e-waste recycling centers.

2. **Manufacturer Take-Back Programs:**
   - Some electronics manufacturers have take-back programs where they accept old products for recycling. Check with the manufacturer of your device to see if they offer such a program.

3. **Retailer Drop-Off Programs:**
   - Some electronics retailers have drop-off programs where you can return old devices. They may partner with recycling facilities to ensure proper disposal.

4. **Community E-Waste Collection Events:**
   - Local communities or environmental organizations occasionally organize e-waste collection events. Residents can bring their old electronics to a specified location for proper disposal.

5. **Mail-Back Programs:**
   - Some companies offer mail-back programs, allowing you to send your old electronics to them for proper recycling. This can be a convenient option for smaller devices.

6. **Donation to Charities or Schools:**
   - Consider donating still-functioning electronic devices to charities, schools, or community organizations. This helps extend the life of the product and benefits others who may not afford new electronics.

7. **Refurbishing and Reselling:**
   - Companies that specialize in refurbishing electronics may accept old devices. These companies restore and resell the products, reducing waste and extending the lifespan of the electronics.

8. **Data Destruction and Secure Disposal:**
   - Before disposing of any electronic device, ensure that all personal and sensitive data is securely wiped. Many e-waste disposal methods involve data destruction as part of the process.

9. **Landfill Disposal (as a last resort):**
   - Landfill disposal should be the last resort due to the environmental impact. Many electronic components contain hazardous materials that can contaminate soil and water if not properly handled.

It's important to follow local regulations and guidelines for e-waste disposal, as different areas may have specific rules and facilities for handling electronic waste. Always prioritize environmentally friendly methods to minimize the impact on the planet.
`,
  },
];
