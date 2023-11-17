import { CollectionConfig } from "payload/types";
import payload from "payload";
import { checkRole } from "./Users/checkRole";

export const Messages: CollectionConfig = {
  slug: "messages",
  access: {
    create: ({ req: { user } }) =>
      checkRole(["admin", "teacher", "principal"], user),
  },
  fields: [
    {
      name: "from",
      type: "relationship",
      relationTo: "users",
      required: true,
      hooks: {
        beforeValidate: [
          async ({ value }) => {
            return value;
          },
        ],
      },
    },
    {
      name: "to",
      type: "relationship",
      relationTo: "users",
      required: true,
      hooks: {
        beforeValidate: [
          async ({ value }) => {
            return value;
          },
        ],
      },
    },
    {
      name: "message",
      type: "textarea",
      required: true,
    },
    {
      name: "is_read",
      label: "Is read",
      type: "checkbox",
      defaultValue: false,
    },
  ],
  hooks: {
    afterChange: [
      async (args) => {
        const { id, from, to, message } = args.doc;

        const fromUser = await payload.findByID({
          id: from,
          collection: "users",
        });
        const toUser = await payload.findByID({
          id: to,
          collection: "users",
        });

        const { name: fromName } = fromUser;
        const { name: toName, email: toEmail } = toUser;

        const mail = await payload.sendEmail({
          from: `${process.env.FROM_NAME} <${process.env.FROM_ADDRESS}>`,
          to: toEmail,
          subject: `${fromName} has sent you a message!`,
          html: `
            Hello <b>${toName}</b>,
            <br />
            <br />
            <b>${fromName}</b> has sent you a message:
            <br />
            ${message}
            <br />
            <br />
            View it here: ${process.env.FE_URL}/messages/${id}
          `,
        });
        console.log("sent");
      },
    ],
  },
};

export default Messages;
