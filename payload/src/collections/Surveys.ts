import type { CollectionConfig } from "payload/types";

const Surverys: CollectionConfig = {
  slug: "surverys",
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "cooking",
      type: "radio",
      options: [
        {
          label: "Non Clean",
          value: "non_clean",
        },
        {
          label: "Clean",
          value: "clean",
        },
      ],
      required: true,
    },
    {
      name: "vehicle",
      type: "radio",
      options: [
        {
          label: "Non Electric",
          value: "non_electric",
        },
        {
          label: "Electric",
          value: "electric",
        },
      ],
      required: true,
    },
  ],
};

export default Surverys;
