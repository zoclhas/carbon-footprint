import { CollectionConfig } from "payload/types";
import { Message } from "../payload-types";
import payload from "payload";

export const Messages: CollectionConfig = {
  slug: "messages",
  fields: [
    {
      name: "from",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "to",
      type: "relationship",
      relationTo: "users",
      required: true,
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
    beforeValidate: [
      async ({ originalDoc }) => {
        const { id, from, to, message }: Message = originalDoc;

        const fromUser = await payload.findByID({
          id: from,
          collection: "users",
        });
        const toUser = await payload.findByID({
          id: to,
          collection: "users",
        });

        if (fromUser !== toUser) {
          const { name: fromName } = fromUser;
          const { name: toName, email: toEmail } = toUser;

          payload.sendEmail({
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
        }
      },
    ],
  },
};

export default Messages;
