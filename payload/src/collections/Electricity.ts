import { CollectionConfig } from "payload/types";

const Electricity: CollectionConfig = {
  slug: "electricity",
  fields: [
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
