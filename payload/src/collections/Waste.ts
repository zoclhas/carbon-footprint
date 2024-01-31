import { CollectionConfig } from "payload/types";

const Waste: CollectionConfig = {
  slug: "waste",
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
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
      name: "type",
      type: "select",
      options: [
        {
          label: "E-Waste",
          value: "ewaste",
        },
        {
          label: "Plastic",
          value: "plastic",
        },
        {
          label: "Paper",
          value: "paper",
        },
        {
          label: "Glass",
          value: "glass",
        },
        {
          label: "Cans",
          value: "cans",
        },
      ],
      required: true,
    },
    {
      name: "num",
      label: "Number of waste",
      type: "number",
      required: true,
    },
  ],
};

export default Waste;
