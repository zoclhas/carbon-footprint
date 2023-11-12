import { CollectionConfig } from "payload/types";
import { anyone } from "../access/access";

const Footprint: CollectionConfig = {
  slug: "footprint",
  access: {
    read: anyone,
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
                      hooks: {
                        beforeValidate: [
                          (args) => {
                            const { originalDoc } = args;
                            const logs: {
                              timestamp: string;
                              emission: number;
                            }[] = originalDoc.logs;

                            const today = new Date()
                              .toISOString()
                              .split("T")[0];
                            const todayLogs = logs.filter(
                              (log) => log.timestamp.split("T")[0] === today
                            );

                            if (todayLogs.length === 0) {
                              return 0;
                            }

                            const totalEmission = todayLogs.reduce(
                              (total, log) => total + log.emission,
                              0
                            );
                            const avgEmission =
                              totalEmission / todayLogs.length;

                            return Number(avgEmission.toFixed(2));
                          },
                        ],
                      },
                    },
                    {
                      name: "month",
                      type: "number",
                      admin: {
                        width: "50%",
                      },
                      hooks: {
                        beforeValidate: [
                          (args) => {
                            const { originalDoc } = args;
                            const logs: {
                              timestamp: string;
                              emission: number;
                            }[] = originalDoc.logs;

                            const month = new Date().getMonth() + 1;
                            const monthLogs = logs.filter(
                              (log) =>
                                log.timestamp.split("-")[1] === String(month)
                            );

                            if (monthLogs.length === 0) {
                              return 0;
                            }

                            const totalEmission = monthLogs.reduce(
                              (total, log) => total + log.emission,
                              0
                            );
                            const avgEmission =
                              totalEmission / monthLogs.length;

                            return Number(avgEmission.toFixed(2));
                          },
                        ],
                      },
                    },
                  ],
                },
                {
                  name: "year",
                  type: "number",
                  hooks: {
                    beforeValidate: [
                      (args) => {
                        const { originalDoc } = args;
                        const logs: { timestamp: string; emission: number }[] =
                          originalDoc.logs;

                        const year = new Date().getFullYear();
                        const yearLogs = logs.filter(
                          (log) => log.timestamp.split("-")[0] === String(year)
                        );

                        if (yearLogs.length === 0) {
                          return 0;
                        }

                        const totalEmission = yearLogs.reduce(
                          (total, log) => total + log.emission,
                          0
                        );
                        const avgEmission = totalEmission / yearLogs.length;

                        return Number(avgEmission.toFixed(2));
                      },
                    ],
                  },
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
                      hooks: {
                        beforeValidate: [
                          (args) => {
                            const { originalDoc } = args;
                            const logs: {
                              timestamp: string;
                              emission: number;
                            }[] = originalDoc.logs;

                            const today = new Date()
                              .toISOString()
                              .split("T")[0];
                            const todayLogs = logs.filter(
                              (log) => log.timestamp.split("T")[0] === today
                            );
                            const totalEmission = todayLogs.reduce(
                              (total, log) => total + log.emission,
                              0
                            );

                            return Number(totalEmission.toFixed(2));
                          },
                        ],
                      },
                    },
                    {
                      name: "month",
                      type: "number",
                      admin: {
                        width: "50%",
                      },
                      hooks: {
                        beforeValidate: [
                          (args) => {
                            const { originalDoc } = args;
                            const logs: {
                              timestamp: string;
                              emission: number;
                            }[] = originalDoc.logs;

                            const month = new Date().getMonth() + 1;
                            const monthLogs = logs.filter(
                              (log) =>
                                log.timestamp.split("-")[1] === String(month)
                            );
                            const totalEmission = monthLogs.reduce(
                              (total, log) => total + log.emission,
                              0
                            );

                            return Number(totalEmission.toFixed(2));
                          },
                        ],
                      },
                    },
                  ],
                },
                {
                  name: "year",
                  type: "number",
                  hooks: {
                    beforeValidate: [
                      (args) => {
                        const { originalDoc } = args;
                        const logs: { timestamp: string; emission: number }[] =
                          originalDoc.logs;

                        const year = new Date().getFullYear();
                        const yearLogs = logs.filter(
                          (log) => log.timestamp.split("-")[0] === String(year)
                        );
                        const totalEmission = yearLogs.reduce(
                          (total, log) => total + log.emission,
                          0
                        );

                        return Number(totalEmission.toFixed(2));
                      },
                    ],
                  },
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
