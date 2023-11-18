import { AdapterArguments } from "@payloadcms/richtext-slate";

export const slateOptions: AdapterArguments = {
  admin: {
    elements: [
      "h1",
      "h2",
      "h3",
      "textAlign",
      "upload",
      "ol",
      "ul",
      "link",
      "relationship",
      "blockquote",
      "indent",
    ],
    link: {
      fields: [
        {
          name: "rel",
          label: "Rel Attribute",
          type: "select",
          hasMany: true,
          options: ["noopener", "noreferrer", "nofollow"],
        },
        {
          name: "target",
          label: "Target",
          type: "checkbox",
          defaultValue: false,
        },
      ],
    },
  },
};
