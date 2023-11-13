import { CollectionConfig } from "payload/types";
import { anyone } from "../access/access";

const Footprint: CollectionConfig = {
  slug: "footprint",
  access: {
    read: anyone,
    update: (args) => {
      const req = args.req;
      const user = req.user;

      if (user.roles && user.roles.some((role) => role === "admin")) {
        return true;
      }

      return user.id === req.query.uid;
    },
  },
  admin: {
    defaultColumns: ["user", "logs", "updatedAt"],
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      hasMany: false,
      required: true,
    },

    {
      name: "logs",
      type: "array",
      admin: {
        initCollapsed: true,
      },
      fields: [
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
          name: "activity",
          type: "select",
          options: [
            {
              label: "Car",
              value: "car",
            },
            {
              label: "Bus",
              value: "bus",
            },
            {
              label: "Metro",
              value: "metro",
            },
            {
              label: "Cycle",
              value: "cycle",
            },
            {
              label: "Walk",
              value: "walk",
            },
            {
              label: "Plane",
              value: "plane",
            },
          ],
          defaultValue: "car",
          required: true,
        },
        {
          name: "distance",
          type: "number",
          required: true,
        },
        {
          name: "people",
          type: "number",
          min: 1,
          defaultValue: 1,
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
                  car: 0.17,
                  bus: 0.096,
                  metro: 0.035,
                  cycle: 0.008,
                  walk: 0.001,
                  plane: 0.249,
                };
                const { activity, distance, people } = siblingData;
                const emissionFromActivity = emissionValues[activity];

                const emission = (
                  emissionFromActivity *
                  distance *
                  people
                ).toFixed(2);

                return emission;
              },
            ],
          },
        },
      ],
    },

    {
      name: "emission_stats",
      label: "Emission Stats",
      type: "group",
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "average_emission",
              label: "Average Emission",
              type: "group",
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "today",
                      type: "number",
                      admin: {
                        width: "50%",
                      },
                    },
                    {
                      name: "month",
                      type: "number",
                      admin: {
                        width: "50%",
                      },
                    },
                  ],
                },
                {
                  name: "year",
                  type: "number",
                },
              ],
              admin: {
                width: "50%",
                style: {
                  border: "none",
                  background: "#1a1a1a",
                  paddingTop: "12.5px",
                  paddingBottom: "12.5px",
                },
              },
            },

            {
              name: "total_emission",
              label: "Total Emission",
              type: "group",
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "today",
                      type: "number",
                      admin: {
                        width: "50%",
                      },
                    },
                    {
                      name: "month",
                      type: "number",
                      admin: {
                        width: "50%",
                      },
                    },
                  ],
                },
                {
                  name: "year",
                  type: "number",
                },
              ],
              admin: {
                width: "50%",
                style: {
                  border: "none",
                  background: "#1a1a1a",
                  paddingTop: "12.5px",
                  paddingBottom: "12.5px",
                },
              },
            },
          ],
        },
      ],
    },
  ],
};

export default Footprint;
