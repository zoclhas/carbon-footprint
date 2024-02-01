import { Card, CardBody, CardHeader } from "@nextui-org/react";
import Image from "next/image";

export default function Cop28() {
  return (
    <main className="cop-28 mx-4 py-8 sm:mx-auto sm:max-w-5xl">
      <section>
        <h1>What is Cop28?</h1>
        <p>
          COP28 UAE will be a milestone moment when the world will take stock of
          its progress on the Paris Agreement.
        </p>
        <p>
          The first Global Stock Take (GST), will provide a comprehensive
          assessment of progress since adopting the Paris Agreement. This will
          help align eforts on climate action, including measures that need to
          be put in place to bridge the gaps in progress.
        </p>
        <p>
          The COP28 UAE Presidency will work to ensure that the world responds
          to the GST with a clear plan of action.
        </p>
        <p>
          By hosting COP28, the UAE is focusing on practical and positive
          solutions that drive progress for the climate and the economy, as well
          as provide relief and support to vulnerable communities. The UAE
          intends to make COP28 highly inclusive, reflecting the views of all
          geographies, sectors, and constituencies.
        </p>

        <Card className="mt-4">
          <CardBody>
            <Image
              src="/cop28.png"
              alt="cop 28 info outputs"
              width={786}
              height={747}
              className="h-full w-full rounded-lg"
            />
          </CardBody>
        </Card>
      </section>

      <section>
        <h1>What is COP?</h1>
        <p>
          COP stands for &quot;Conference of Parties&quot;. These are high-level
          conferences that bring together states, regional organizations and
          non-state actors. There are 198 official Parties, comprising 197
          countries, plus the European Union.
        </p>
      </section>

      <section>
        <h1>The UAE Leadership Team</h1>
        <div className="flex flex-col gap-4">
          <Card className="grid grid-cols-[0.25fr_1.75fr]">
            <CardBody>
              <Image
                src="https://www.desmog.com/wp-content/uploads/2023/04/Al-Jaber-COP28-1024x825.jpeg.webp"
                alt="Dr Sultan Al Jaber"
                width={220}
                height={220}
                className="aspect-square w-full rounded-full object-cover object-center shadow-xl"
              />
            </CardBody>
            <div className="flex flex-col">
              <CardHeader className="flex flex-col items-start">
                <h2 className="text-lg">Dr. Sultan Al Jaber</h2> <br />
                <strong className="block">COP28 UAE President</strong>
              </CardHeader>
              <CardBody>
                <ul>
                  <li>
                    The President steers the COP process and facilitates
                    consensus among Parties on the negotiated agreement for
                    climate action.
                  </li>
                  <li>
                    The President engages world leaders and enhances inclusivity
                    of the COP process.
                  </li>
                  <li>
                    The President can also use their platform to deliver
                    non-negotiated outcomes, and the COP28 Presidency has
                    publicly set out its Action Agenda.
                  </li>
                </ul>
              </CardBody>
            </div>
          </Card>

          <Card className="grid grid-cols-[0.25fr_1.75fr]">
            <CardBody>
              <Image
                src="https://climatechampions.unfccc.int/wp-content/uploads/2023/01/Razan-Al-Mubarak-MD-MBZF-c-1-871x1024.jpg"
                alt="H.E. Razan Al Mubarak"
                width={220}
                height={220}
                className="aspect-square w-full rounded-full object-cover object-center shadow-xl"
              />
            </CardBody>
            <div className="flex flex-col">
              <CardHeader className="flex flex-col items-start">
                <h2 className="text-lg">H.E. Razan Al Mubarak</h2> <br />
                <strong className="block">High-Level Champion</strong>
              </CardHeader>
              <CardBody>
                <ul>
                  <li>
                    This is a UN-mandated role to ensure engagement and foster
                    leadership of the private sector and civil society in the
                    COP process.
                  </li>
                  <li>
                    The UN Climate Change High-Level Champion connects and
                    creates coalitions to deliver results outside and in support
                    of the negotiations.
                  </li>
                  <li>
                    Drives the Race to Zero, Race to Resilience & Breakthrough
                    Agendas.
                  </li>
                </ul>
              </CardBody>
            </div>
          </Card>
          <Card className="grid grid-cols-[0.25fr_1.75fr]">
            <CardBody>
              <Image
                src="https://s3.amazonaws.com/berkley-center/ShammaAlMazrui.jpg"
                alt="H.E. Shamma Al Mazrui"
                width={220}
                height={220}
                className="aspect-square w-full rounded-full object-cover object-center shadow-xl"
              />
            </CardBody>
            <div className="flex flex-col">
              <CardHeader className="flex flex-col items-start">
                <h2 className="text-lg">H.E. Shamma Al Mazrui</h2> <br />
                <strong className="block">Youth Climate Champion</strong>
              </CardHeader>
              <CardBody>
                <ul>
                  <li>
                    This role is intended to enhance meaningful youth
                    participation in the COP process.
                  </li>
                  <li>
                    The Youth Climate Champion consults with youth globally,
                    amplifies their advocacy in the COP process, and strengthens
                    capacity-building efforts.
                  </li>
                  <li>
                    Facilitate opportunities to strengthen capacity of and
                    resources for youth in the climate sector.
                  </li>
                </ul>
              </CardBody>
            </div>
          </Card>
        </div>
      </section>

      <section>
        <h1>COP28&apos;s Action Agenda</h1>
        <ul className="decimal">
          <li>Fast-tracking a just and orderly transition</li>
          <li>Fixing climate finance</li>
          <li>Focusing on nature, lives and livelihoods</li>
          <li>Fostering inclusivity for all</li>
        </ul>
      </section>

      <section>
        <Card>
          <CardBody>
            <Image
              src="/1.png"
              alt="cop 28 info outputs"
              width={786}
              height={747}
              className="h-full w-full rounded-lg"
            />
          </CardBody>
        </Card>
        <Card className="mt-4">
          <CardBody>
            <Image
              src="/2.png"
              alt="cop 28 info outputs"
              width={786}
              height={747}
              className="h-full w-full rounded-lg"
            />
          </CardBody>
        </Card>
      </section>
    </main>
  );
}
