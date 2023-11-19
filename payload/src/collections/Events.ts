import { CollectionConfig } from "payload/types";
import { slateToHtml } from "@slate-serializers/html";
import payload from "payload";

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
      admin: {
        position: "sidebar",
      },
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
              name: "ends",
              label: "Ends At",
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
    {
      name: "send_mail",
      label: "Send Mail",
      type: "checkbox",
      required: true,
      admin: {
        position: "sidebar",
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc }) => {
        try {
          if (doc.send_mail) {
            const { id, description, title } = doc;
            const html = slateToHtml(description);

            const users = await payload.find({
              collection: "users",
            });

            users.docs.forEach(
              async (user) =>
                await payload.sendEmail({
                  from: `${process.env.FROM_NAME} <${process.env.FROM_ADDRESS}>`,
                  to: user.email,
                  subject: `New Event: ${title}`,
                  html:
                    html +
                    `<br /><br/><b>View it here: </b><a href="${process.env.FE_URL}/events/${id}">${title}</b>`,
                })
            );
          }
        } catch (err) {
          console.error(err);
        }
      },
    ],
  },
};

export default Events;
