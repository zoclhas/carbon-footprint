import path from "path";

import payload from "payload";
import { payloadCloud } from "@payloadcms/plugin-cloud";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { webpackBundler } from "@payloadcms/bundler-webpack";
import { slateEditor } from "@payloadcms/richtext-slate";
import { buildConfig } from "payload/config";
import { v4 as uuid } from "uuid";

import Users from "./collections/Users";
import Media from "./collections/Media";
import Footprint from "./collections/Footprint";
import ClassSections from "./collections/Classses";
import Supervisor from "./collections/supervisor";
import Events from "./collections/Events";
import Messages from "./collections/Messages";
import Surverys from "./collections/Surveys";
import Waste from "./collections/Waste";
import Electricity from "./collections/Electricity";
import Donation from "./collections/Donation";

import { slateOptions } from "./lib/slate-options";
import { endpoints } from "./endpoints";
import { eventsEndpoints } from "./endpoints/events";
import { supervisorEndpoints } from "./endpoints/supervisor";
import { principalEndpoints } from "./endpoints/principal";
import { surverysEndpoints } from "./endpoints/surverys";
import { electricityEndpoints } from "./endpoints/electricity";

export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
  },
  editor: slateEditor(slateOptions),
  collections: [
    Users,
    Footprint,
    ClassSections,
    Supervisor,
    Events,
    Messages,
    Surverys,
    Waste,
    Electricity,
    Donation,
    Media,
  ],
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
      path: "/user/reset",
      method: "post",
      handler: async (req, res, next) => {
        try {
          const body = req.body;
          const resetUser = await payload.resetPassword({
            collection: "users",
            data: {
              token: body.token,
              password: body.password,
            },
            overrideAccess: true,
          });

          const uid = resetUser.user.id;
          await payload.update({
            collection: "users",
            where: {
              and: [
                {
                  id: {
                    equals: uid,
                  },
                },
              ],
            },
            data: {
              apiKey: uuid(),
            },
          });

          res.status(200).json({
            message: "Password reset successfully.",
          });
        } catch (err) {
          console.error(err);
          res.status(500).json(err);
        }
      },
    },
    ...endpoints,
    ...eventsEndpoints,
    ...supervisorEndpoints,
    ...principalEndpoints,
    ...surverysEndpoints,
    ...electricityEndpoints,
  ],
});
