import { CollectionConfig } from "payload/types";

const Supervisor: CollectionConfig = {
  slug: "supervisor",
  fields: [
    {
      name: "supervisor",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "section",
      type: "select",
      options: [
        {
          label: "Primary",
          value: "primary",
        },
        {
          label: "Middle",
          value: "middle",
        },

        {
          label: "Senior",
          value: "senior",
        },
      ],
      required: true,
    },
    {
      name: "classes",
      type: "relationship",
      relationTo: "classes",
      hasMany: true,
      required: true,
    },
  ],
};

export default Supervisor;
