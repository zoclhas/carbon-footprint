import payload from "payload";
import { Endpoint } from "payload/config";

export const eventsEndpoints: Endpoint[] = [
  {
    path: "/my-events",
    method: "get",
    handler: async (req, res, next) => {
      try {
        if (!req.user) {
          res.status(402).json({
            message: "You need to be logged in to view your events.",
          });
          return;
        }

        const today = new Date().setHours(0, 0, 0, 0);

        const currentOrUpcomingEvents = await payload.find({
          collection: "events",
          where: {
            and: [
              {
                "duration.starts": {
                  greater_than_equal: today,
                },
              },
            ],
          },
        });
        const previousEvents = await payload.find({
          collection: "events",
          where: {
            and: [
              {
                "duration.ends": {
                  less_than: today,
                },
              },
            ],
          },
        });

        res.status(200).json({
          current_upcoming: currentOrUpcomingEvents,
          previous: previousEvents,
        });
      } catch (err) {
        console.error(err);
        res.status(500).json(err);
      }
    },
  },

  {
    path: "/my-events/:id",
    method: "get",
    handler: async (req, res, next) => {
      try {
        if (!req.user) {
          res.status(402).json({
            message: "You need to be logged in to view your events.",
          });
          return;
        }

        const eventId = req.params.id;
        const eve = await payload.findByID({
          collection: "events",
          id: eventId,
        });

        const starts = new Date(eve.duration.starts).getTime(),
          ends = new Date(eve.duration.ends).getTime();

        const classes = await payload.find({
          collection: "classes",
          depth: 0,
        });

        let classData: {
          class_section: string;
          activity: {
            car: number;
            bus: number;
            metro: number;
            cycle: number;
            walk: number;
            plane: number;
          };
          total_emission: number;
        }[] = [];

        await Promise.all(
          classes.docs.map(async (cls) => {
            const activity = {
              car: 0,
              bus: 0,
              metro: 0,
              cycle: 0,
              walk: 0,
              plane: 0,
            };

            const students = cls.students;

            await Promise.all(
              students.map(async (std) => {
                const studentData = await payload.find({
                  collection: "footprint",
                  where: {
                    and: [
                      {
                        "user.id": {
                          equals: std,
                        },
                      },
                    ],
                  },
                });
                const logs = studentData.docs[0].logs;
                const filteredLogs = logs.filter((log) => {
                  const logTimestamp = new Date(log.timestamp).getTime();
                  return logTimestamp >= starts && logTimestamp <= ends;
                });

                filteredLogs.forEach(
                  (log) => (activity[log.activity] += log.emission)
                );
              })
            );

            const totalEmission: number = Object.keys(activity).reduce(
              (total, act) => total + activity[act],
              0
            );
            classData.push({
              class_section: cls.combined_class_section,
              activity,
              total_emission: Number(totalEmission.toFixed(2)),
            });
          })
        );

        const removeEmpty = classData.filter((cls) => cls.total_emission > 0);
        const sortByLeastEmission = removeEmpty.sort(
          (a, b) => a.total_emission - b.total_emission
        );

        res.status(200).json({
          event_data: eve,
          classes: sortByLeastEmission,
        });
      } catch (err) {
        console.error(err);
        res.status(500).json(err);
      }
    },
  },
];
