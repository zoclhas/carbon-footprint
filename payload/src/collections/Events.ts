import { CollectionConfig } from "payload/types";

const Events: CollectionConfig = {
  slug: "events",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title"],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "duration",
      type: "group",
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "starts",
              label: "Starts At",
              type: "date",
              required: true,
              admin: {
                date: {
                  pickerAppearance: "dayAndTime",
                },
                width: "50%",
              },
            },
            {
              name: "starts",
              label: "Starts At",
              type: "date",
              required: true,
              admin: {
                date: {
                  pickerAppearance: "dayAndTime",
                },
                width: "50%",
              },
            },
          ],
        },
      ],
    },
    {
      name: "description",
      type: "richText",
      required: true,
    },
  ],
};

export default Events;
