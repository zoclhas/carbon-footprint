import payload from "payload";
import { Endpoint } from "payload/config";
import { User } from "payload/generated-types";
import { checkRole } from "../collections/Users/checkRole";
import { getAllClassesData } from "./supervisor";

export const principalEndpoints: Endpoint[] = [
  {
    path: "/section",
    method: "get",
    handler: async (req, res, next) => {
      try {
        if (!req.user) {
          res.status(402).json({
            message: "Unauthenticated",
          });
          return;
        }

        const user: User = req.user;

        const access = checkRole(["principal"], user);
        if (!access) {
          res.status(403).json({
            message: "Unauthorised.",
          });
          return;
        }

        const sectionsDocs = await payload.find({
          collection: "supervisor",
        });
        let sections = sectionsDocs.docs;
        // @ts-ignore
        sections = await Promise.all(
          sections.map(async (section) => {
            // @ts-ignore
            section.classes = await Promise.all(
              // @ts-ignore
              getAllClassesData(section.classes)
            );
            section.classes = section.classes
              .sort((a, b) =>
                // @ts-ignore
                a.combined_class_section.localeCompare(b.combined_class_section)
              )
              .reverse();
            const emissionStats = section.classes.reduce(
              // @ts-ignore
              (total, c: ClassDataProps) => {
                const activties = [
                  "car",
                  "bus",
                  "metro",
                  "cycle",
                  "walk",
                  "plane",
                ];

                ["today", "month", "year"].forEach((timePeriod) => {
                  const emissions =
                    c.emissions_stats[`${timePeriod}s_emission`];
                  total[timePeriod].total += emissions.total;
                  total[timePeriod].avg += emissions.avg;

                  activties.forEach((activity) => {
                    total[timePeriod].activties[activity] +=
                      emissions.activties[activity];
                  });
                });

                return total;
              },
              {
                today: {
                  total: 0,
                  avg: 0,
                  activties: {
                    car: 0,
                    bus: 0,
                    metro: 0,
                    cycle: 0,
                    walk: 0,
                    plane: 0,
                  },
                },
                month: {
                  total: 0,
                  avg: 0,
                  activties: {
                    car: 0,
                    bus: 0,
                    metro: 0,
                    cycle: 0,
                    walk: 0,
                    plane: 0,
                  },
                },
                year: {
                  total: 0,
                  avg: 0,
                  activties: {
                    car: 0,
                    bus: 0,
                    metro: 0,
                    cycle: 0,
                    walk: 0,
                    plane: 0,
                  },
                },
              }
            );

            return { my_section: section, emissions_stats: emissionStats };
          })
        );

        const emissionStats = sections.reduce(
          // @ts-ignore
          (total, c: ClassDataProps) => {
            const activties = ["car", "bus", "metro", "cycle", "walk", "plane"];

            ["today", "month", "year"].forEach((timePeriod) => {
              const emissions = c.emissions_stats[timePeriod];
              total[timePeriod].total += emissions.total;
              total[timePeriod].avg += emissions.avg;

              activties.forEach((activity) => {
                total[timePeriod].activties[activity] +=
                  emissions.activties[activity];
              });
            });

            return total;
          },
          {
            today: {
              total: 0,
              avg: 0,
              activties: {
                car: 0,
                bus: 0,
                metro: 0,
                cycle: 0,
                walk: 0,
                plane: 0,
              },
            },
            month: {
              total: 0,
              avg: 0,
              activties: {
                car: 0,
                bus: 0,
                metro: 0,
                cycle: 0,
                walk: 0,
                plane: 0,
              },
            },
            year: {
              total: 0,
              avg: 0,
              activties: {
                car: 0,
                bus: 0,
                metro: 0,
                cycle: 0,
                walk: 0,
                plane: 0,
              },
            },
          }
        );

        res.status(200).json({ sections, emissions_stats: emissionStats });
      } catch (err) {
        console.error(err);
        res.status(500).json({
          message: "Failed to fetch data.",
        });
      }
    },
  },
];
