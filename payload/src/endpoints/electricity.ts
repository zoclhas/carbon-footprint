import payload from "payload";
import { Endpoint } from "payload/config";
import { User } from "payload/generated-types";

export const electricityEndpoints: Endpoint[] = [
  {
    path: "/check-electricity",
    method: "get",
    handler: async (req, res, next) => {
      try {
        const user: User = req.user;
        if (!user) {
          res.status(500).json({
            message: "User not found.",
          });
          return;
        }

        const uid = user.id;
        const date = new Date();
        const firstDay = new Date(
          date.getFullYear(),
          date.getMonth(),
          1
        ).setHours(0, 0, 0);
        const lastDay = new Date(
          date.getFullYear(),
          date.getMonth() + 1,
          0
        ).setHours(24, 60, 60);

        const electrictyDocs = await payload.find({
          collection: "electricity",
          where: {
            and: [
              {
                user: {
                  equals: uid,
                },
              },
              {
                timestamp: {
                  greater_than_equal: firstDay,
                  less_than_equal: lastDay,
                },
              },
            ],
          },
        });

        if (electrictyDocs.totalDocs > 0) {
          res.status(200).json({
            present: true,
          });
        } else {
          res.status(200).json({
            present: false,
          });
        }
      } catch (err) {
        console.error(err);
        res.status(500).json({
          message: "Something went wrong.",
        });
      }
    },
  },
  {
    path: "/add-electricity",
    method: "post",
    handler: async (req, res, next) => {
      try {
        const user: User = req.user;
        if (!user) {
          res.status(500).json({
            message: "User not found.",
          });
          return;
        }

        const uid = user.id;
        const date = new Date();
        const firstDay = new Date(
          date.getFullYear(),
          date.getMonth(),
          1
        ).setHours(0, 0, 0);
        const lastDay = new Date(
          date.getFullYear(),
          date.getMonth() + 1,
          0
        ).setHours(24, 60, 60);

        const electrictyDocs = await payload.find({
          collection: "electricity",
          where: {
            and: [
              {
                user: {
                  equals: uid,
                },
              },
              {
                timestamp: {
                  greater_than_equal: firstDay,
                  less_than_equal: lastDay,
                },
              },
            ],
          },
        });

        if (electrictyDocs.totalDocs > 0) {
          res.status(409).json({
            message: "Already exists",
          });
        } else {
          const { timestamp, consumption } = req.body;
          const data = await payload.create({
            collection: "electricity",
            data: {
              user: uid,
              consumption,
              timestamp,
            },
          });
          res.status(200).json(data);
        }
      } catch (err) {
        console.error(err);
        res.status(500).json({
          message: "Something went wrong.",
        });
      }
    },
  },
];
