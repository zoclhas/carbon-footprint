import path from "path";
import { CollectionConfig } from "payload/types";

export const Media: CollectionConfig = {
  slug: "media",
  upload: {
    staticDir: path.resolve(__dirname, "../../media"),
    imageSizes: [
      {
        name: "card",
        width: 640,
        height: 480,
      },
      {
        name: "feature",
        width: 1024,
        height: 576,
      },
    ],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
    },
  ],
};

export default Media;
