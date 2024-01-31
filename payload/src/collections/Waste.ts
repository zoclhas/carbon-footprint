import { CollectionConfig } from "payload/types";

const Waste: CollectionConfig = {
  slug: "waste",
  access: { create: () => true },
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
      name: "waste",
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
          label: "Can",
          value: "can",
        },
      ],
      required: true,
    },
    {
      name: "quantity",
      type: "number",
      required: true,
    },
    {
      name: "emission",
      type: "number",
      hooks: {
        beforeValidate: [
          (args) => {
            const { siblingData } = args;

            const emissionValues = {
              ewaste: 110.3,
              plastic: 0.1,
              paper: 0.8,
              glass: 0.025,
              can: 0.025,
            };
            const { waste, quantity } = siblingData;
            const emissionFromActivity = emissionValues[waste];

            const emission = (emissionFromActivity * quantity).toFixed(2);

            return emission;
          },
        ],
      },
    },
  ],
};

export default Waste;
