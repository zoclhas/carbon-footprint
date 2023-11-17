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
    read: ({ req: { user } }) => {
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
          type: "number",
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
            beforeValidate: [
              (args) => {
                const { siblingData } = args;
                const classValue = Number(siblingData["class"]);
                const levels = {
                  senior: {
                    l: 9,
                    h: 12,
                  },
                  middle: {
                    l: 6,
                    h: 8,
                  },
                  primary: {
                    l: 1,
                    h: 5,
                  },
                };

                if (
                  levels.senior.l <= classValue &&
                  levels.senior.h >= classValue
                ) {
                  return "senior";
                } else if (
                  levels.middle.l <= classValue &&
                  levels.middle.h >= classValue
                ) {
                  return "middle";
                } else if (
                  levels.primary.l <= classValue &&
                  levels.primary.h >= classValue
                ) {
                  return "primary";
                }
              },
            ],
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
