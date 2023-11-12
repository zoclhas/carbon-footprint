import { CollectionConfig } from "payload/types";

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
        beforeValidate: [
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
