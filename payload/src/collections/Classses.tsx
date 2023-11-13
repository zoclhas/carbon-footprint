import { CollectionConfig } from "payload/types";
import { checkRole } from "./Users/checkRole";

const ClassSections: CollectionConfig = {
  slug: "classes",
  labels: {
    plural: "Classes",
    singular: "Class",
  },
  admin: {
    useAsTitle: "combined_class_section",
    defaultColumns: ["combined_class_section", "class_teacher"],
  },
  access: {
    read: ({ req: { user, query }, data, id }) => {
      if (checkRole(["admin", "teacher", "principal"], user)) {
        return true;
      }
    },
    admin: ({ req: { user } }) => checkRole(["admin"], user),
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "class",
          type: "text",
          required: true,
          admin: { width: "33%" },
        },
        {
          name: "section",
          type: "text",
          required: true,
          admin: { width: "33%" },
        },
        {
          name: "level",
          type: "select",
          options: [
            {
              label: "Senior",
              value: "senior",
            },
            {
              label: "Middle",
              value: "middle",
            },
            {
              label: "Primary",
              value: "primary",
            },
          ],
          hasMany: false,
          admin: { width: "33%" },
          hooks: {
            beforeValidate: [(args) => {}],
          },
        },
      ],
    },

    {
      name: "class_teacher",
      label: "Class Teacher",
      type: "relationship",
      relationTo: "users",
      required: true,
    },

    {
      name: "students",
      label: "Students",
      type: "relationship",
      relationTo: "users",
      hasMany: true,
      required: true,
    },

    {
      name: "combined_class_section",
      label: "Class-Section",
      type: "text",
      hooks: {
        beforeValidate: [
          (args) => {
            const { siblingData } = args;
            const classValue = siblingData["class"];
            const { section } = siblingData;

            return String(classValue) + String(section);
          },
        ],
      },
      admin: {
        style: {
          display: "none",
        },
      },
    },
  ],
};

export default ClassSections;
