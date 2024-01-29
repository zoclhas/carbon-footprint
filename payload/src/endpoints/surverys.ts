import payload from "payload";
import type { Endpoint } from "payload/config";

export const surverysEndpoints: Endpoint[] = [
  {
    path: "/check-survey",
    method: "get",
    handler: async (req, res, next) => {
      try {
        const user = req.user;
        if (!user) {
          throw new Error("Not a user");
        }

        const uid = user.id;

        const surveryDocs = await payload.find({
          collection: "surverys",
          where: {
            user: {
              equals: uid,
            },
          },
          depth: 0,
        });
        if (surveryDocs.totalDocs === 0) {
          res.status(200).json({
            done: false,
          });
          return;
        }

        res.status(200).json({
          done: true,
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({
          error: true,
          message: "Something went wrong",
        });
      }
    },
  },

  {
    path: "/set-survey",
    method: "post",
    handler: async (req, res, next) => {
      try {
        const user = req.user;
        const { cooking, vehicle } = req.body;

        if (!user) {
          throw new Error("Not a user");
        }

        const uid = user.id;

        const surveryDocs = await payload.find({
          collection: "surverys",
          where: {
            user: {
              equals: uid,
            },
          },
          depth: 0,
        });
        if (surveryDocs.totalDocs > 0) {
          res.status(200).json({
            done: true,
          });
          return;
        }

        await payload.create({
          collection: "surverys",
          data: {
            user: uid,
            cooking,
            vehicle,
          },
        });

        res.status(200).json({
          done: true,
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({
          error: true,
          message: "Something went wrong",
        });
      }
    },
  },
];
