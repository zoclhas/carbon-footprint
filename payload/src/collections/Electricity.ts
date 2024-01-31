import { CollectionConfig } from "payload/types";

const Electricity: CollectionConfig = {
  slug: "electricity",
  fields: [
    {
      name: "timestamp",
      type: "date",
      defaultValue: new Date().toISOString(),
      required: true,
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
    },
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "consumption",
      type: "number",
      required: true,
    },
  ],
};

export default Electricity;
