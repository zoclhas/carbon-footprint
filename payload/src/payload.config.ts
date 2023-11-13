import path from "path";

import { payloadCloud } from "@payloadcms/plugin-cloud";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { webpackBundler } from "@payloadcms/bundler-webpack";
import { slateEditor } from "@payloadcms/richtext-slate";
import { buildConfig } from "payload/config";
import payload from "payload";

import Users from "./collections/Users";
import Media from "./collections/Media";
import Footprint from "./collections/Footprint";

export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
  },
  editor: slateEditor({}),
  collections: [Users, Footprint, Media],
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, "generated-schema.graphql"),
  },
  plugins: [payloadCloud()],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
  endpoints: [
    {
      path: "/today",
      method: "get",
      handler: async (req, res, next) => {
        const uid = req.query.uid ?? "get_a_life";

        try {
          const todayStart = new Date();
          todayStart.setHours(0, 0, 0, 0);

          const todayEnd = new Date();
          todayEnd.setHours(23, 59, 59, 999);

          const data = await payload.find({
            collection: "footprint",
            where: {
              and: [
                {
                  "user.id": {
                    equals: uid,
                  },
                },
              ],
            },
          });

          if (data.totalDocs === 0) {
            res.status(403).json({
              message: "Log in to fetch your data",
            });
            return;
          }

          const logs = data.docs[0].logs;
          const todayLogs = logs.filter((log) => {
            const timestamp = new Date(log.timestamp);
            return timestamp >= todayStart && timestamp <= todayEnd;
          });

          res.status(200).json({
            emission_stats: data.docs[0].emission_stats,
            logs: todayLogs,
          });
        } catch (err) {
          console.error(err);
          res.status(500).json({
            message: "Failed to fetch your data",
          });
        }
      },
    },
    {
      path: "/logs",
      method: "get",
      handler: async (req, res, next) => {
        try {
          const uid = req.query.uid ?? "get_a_life";
          const footprint = await payload.find({
            collection: "footprint",
            where: {
              and: [
                {
                  "user.id": {
                    equals: uid,
                  },
                },
              ],
            },
          });

          res.status(200).json({
            logs: footprint.docs[0].logs,
            id: footprint.docs[0].id,
          });
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: "Failed to fetch all logs." });
        }
      },
    },

    {
      path: "/logs",
      method: "post",
      handler: async (req, res, next) => {
        try {
          const user = req.user;
          const log: { timestamp: string; emission: number } = req.body;

          const footprint = await payload.find({
            collection: "footprint",
            where: {
              and: [
                {
                  "user.id": {
                    equals: user.id,
                  },
                },
              ],
            },
          });
          const currentLogs = footprint.docs[0].logs;
          const newLogs = [...currentLogs, log];

          const today = new Date().toISOString().split("T")[0];
          const todayLogs = newLogs.filter(
            (log) => log.timestamp.split("T")[0] === today
          );
          const todaysEmission = Number(
            todayLogs.reduce((total, log) => total + log.emission, 0).toFixed(2)
          );
          let avgTodaysEmission: number =
            Number(todaysEmission) / todayLogs.length;
          if (todayLogs.length === 0) {
            avgTodaysEmission = 0;
          }

          const month = new Date().getMonth() + 1;
          const monthLogs = newLogs.filter(
            (log) => log.timestamp.split("-")[1] === String(month)
          );
          const monthsEmission = Number(
            monthLogs.reduce((total, log) => total + log.emission, 0).toFixed(2)
          );
          let avgMonthsEmission = monthsEmission / monthLogs.length;
          if (monthLogs.length === 0) {
            avgMonthsEmission = 0;
          }

          const year = new Date().getFullYear();
          const yearLogs = newLogs.filter(
            (log) => log.timestamp.split("-")[0] === String(year)
          );
          const yearsEmission = Number(
            yearLogs.reduce((total, log) => total + log.emission, 0).toFixed(2)
          );
          let avgYearsEmission = yearsEmission / yearLogs.length;
          if (yearLogs.length === 0) {
            avgYearsEmission = 0;
          }

          const updatedFootprint = await payload.update({
            collection: "footprint",
            user: req.user,
            where: {
              and: [
                {
                  "user.id": {
                    equals: user.id,
                  },
                },
              ],
            },
            data: {
              logs: newLogs,
              emission_stats: {
                average_emission: {
                  today: avgTodaysEmission,
                  month: avgMonthsEmission,
                  year: avgYearsEmission,
                },
                total_emission: {
                  today: todaysEmission,
                  month: monthsEmission,
                  year: yearsEmission,
                },
              },
            },
          });

          res.status(200).json(updatedFootprint.docs);
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: "Failed to fetch all logs." });
        }
      },
    },
  ],
});
