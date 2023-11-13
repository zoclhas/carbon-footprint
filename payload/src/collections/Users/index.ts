import { CollectionConfig, PayloadRequest } from "payload/types";

import adminsAndUser from "./access/adminsAndUser";
import { ensureFirstUserIsAdmin } from "./hooks/ensureFirstUserIsAdmin";
import { checkRole } from "./checkRole";

import { admins } from "../../access/admins";
import { anyone } from "../../access/access";
import payload from "payload";

const Users: CollectionConfig = {
  slug: "users",
  auth: {
    useAPIKey: true,
    forgotPassword: {
      generateEmailHTML: ({
        req,
        token,
        user,
      }: {
        req: PayloadRequest;
        token: string;
        user: { name: string };
      }) => {
        // Use the token provided to allow your user to reset their password
        const resetPasswordURL = `${process.env.FE_URL}/login/reset?token=${token}`;

        return `
          <!doctype html>
          <html>
            <body>
              <p>Hello, ${user.name}!</p>
              <p>Click below to reset your password.</p>
              <p>
                <a href="${resetPasswordURL}">${resetPasswordURL}</a>
              </p>
            </body>
          </html>
        `;
      },
    },
  },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["name", "email"],
  },
  access: {
    read: adminsAndUser,
    create: anyone,
    update: adminsAndUser,
    delete: admins,
    admin: ({ req: { user } }) => checkRole(["admin"], user),
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "roles",
      type: "select",
      hasMany: true,
      defaultValue: ["user"],
      options: [
        {
          label: "admin",
          value: "admin",
        },
        {
          label: "user",
          value: "user",
        },
      ],
      hooks: {
        beforeChange: [ensureFirstUserIsAdmin],
        afterChange: [
          async (args) => {
            const uid = args.originalDoc.id;
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

            if (footprint.totalDocs === 0) {
              await payload.create({
                collection: "footprint",
                data: {
                  user: uid,
                },
              });
            }
          },
        ],
      },
      access: {
        read: admins,
        create: admins,
        update: admins,
      },
    },
  ],
};

export default Users;
