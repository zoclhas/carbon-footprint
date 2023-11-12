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
                {
                  "logs.activity": {
                    equals: "car",
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
  ],
});
