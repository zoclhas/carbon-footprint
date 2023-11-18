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
        const happenedEvents = await payload.find({
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
          happened: happenedEvents,
        });
      } catch (err) {
        console.error(err);
        res.status(500).json(err);
      }
    },
  },
];
