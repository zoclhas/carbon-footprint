import { CollectionConfig } from "payload/types";

const Donation: CollectionConfig = {
  slug: "donation",
  access: {
    create: () => true,
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "donation_type",
      type: "radio",
      options: [
        {
          label: "Money",
          value: "money",
        },
        {
          label: "Plant",
          value: "plant",
        },
      ],
      required: true,
    },
    {
      name: "qty",
      type: "number",
      min: 1,
      required: true,
    },
    {
      name: "fulfilled",
      type: "checkbox",
    },
  ],
};

export default Donation;
