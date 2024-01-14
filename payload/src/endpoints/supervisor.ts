import payload from "payload";
import { Endpoint } from "payload/config";
import { Class, User } from "payload/generated-types";
import { calculateActivity, calculateStudentsEmissionStats } from ".";

export const supervisorEndpoints: Endpoint[] = [
  {
    path: "/my-sections",
    method: "post",
    handler: async (req, res, next) => {
      try {
        if (!req.user) {
          res.status(402).json({
            message: "Unauthenticated",
          });
          return;
        }

        const user: User = req.user;
        const uid = user.id;

        if (!user.roles.includes("supervisor")) {
          res.status(403).json({
            message: "Unauthorised.",
          });
          return;
        }

        const mySectionDocs = await payload.find({
          collection: "supervisor",
          where: {
            and: [
              {
                supervisor: {
                  equals: uid,
                },
              },
              {
                id: {
                  equals: String(req.body.section_id),
                },
              },
            ],
          },
        });
        if (mySectionDocs.totalDocs === 0) {
          res.status(403).json({
            message: "Unauthorised.",
          });
          return;
        }

        const mySection = mySectionDocs.docs[0];
        // @ts-ignore
        mySection.classes = await Promise.all(
          // @ts-ignore
          getAllClassesData(mySection.classes)
        );
        mySection.classes = mySection.classes
          .sort((a, b) =>
            // @ts-ignore
            a.combined_class_section.localeCompare(b.combined_class_section)
          )
          .reverse();
        const emissionStats = mySection.classes.reduce(
          // @ts-ignore
          (total, c: ClassDataProps) => {
            const activties = ["car", "bus", "metro", "cycle", "walk", "plane"];

            ["today", "month", "year"].forEach((timePeriod) => {
              const emissions = c.emissions_stats[`${timePeriod}s_emission`];
              total[timePeriod].total += emissions.total;
              total[timePeriod].avg += emissions.avg;

              activties.forEach((activity) => {
                total[timePeriod].activties[activity] +=
                  emissions.activties[activity];
              });
            });

            return total;
          },
          {
            today: {
              total: 0,
              avg: 0,
              activties: {
                car: 0,
                bus: 0,
                metro: 0,
                cycle: 0,
                walk: 0,
                plane: 0,
              },
            },
            month: {
              total: 0,
              avg: 0,
              activties: {
                car: 0,
                bus: 0,
                metro: 0,
                cycle: 0,
                walk: 0,
                plane: 0,
              },
            },
            year: {
              total: 0,
              avg: 0,
              activties: {
                car: 0,
                bus: 0,
                metro: 0,
                cycle: 0,
                walk: 0,
                plane: 0,
              },
            },
          }
        );

        res.status(200).json({
          my_section: mySection,
          emissions_stats: emissionStats,
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({
          message: "Failed to fetch data.",
        });
      }
    },
  },
];

export function getAllClassesData(classes: Class[]) {
  return classes.map(async (c) => {
    // @ts-ignore
    const { id, combined_class_section, class_teacher, students } = c;

    const todaysEmission = { total: 0, count: 0 };
    const studentEmissions: { emission: number; student: User }[] = [];
    const monthsEmission = { total: 0, count: 0 };
    const yearsEmission = { total: 0, count: 0 };

    const activities = ["car", "bus", "metro", "cycle", "walk", "plane"];
    let todaysActivitiesEmission = Object.fromEntries(
      activities.map((activity) => [activity, 0])
    );
    let monthsActivitiesEmission = Object.fromEntries(
      activities.map((activity) => [activity, 0])
    );
    let yearsActivitiesEmission = Object.fromEntries(
      activities.map((activity) => [activity, 0])
    );

    for (const student of students) {
      const studentData = await payload.find({
        collection: "footprint",
        where: {
          and: [
            {
              "user.id": {
                // @ts-ignore
                equals: student.id,
              },
            },
          ],
        },
      });
      const studentLogs = studentData.docs[0].logs;
      let {
        todayLogs,
        monthLogs,
        yearLogs,
        studentTodaysEmission,
        studentMonthsEmission,
        studentYearsEmission,
        todaysActivitiesEmission: todaysAE,
        monthsActivitiesEmission: monthsAE,
        yearsActivitiesEmission: yearsAE,
      } = calculateStudentsEmissionStats(studentLogs);

      todaysEmission.total += studentTodaysEmission;
      todaysEmission.count += todayLogs.length;
      studentEmissions.push({
        emission: studentTodaysEmission,
        // @ts-ignore
        student: student,
      });
      monthsEmission.total += studentMonthsEmission;
      monthsEmission.count += monthLogs.length;
      yearsEmission.total += studentYearsEmission;

      yearsEmission.count += yearLogs.length;
      todaysActivitiesEmission = calculateActivity(
        todaysActivitiesEmission,
        todaysAE
      );
      monthsActivitiesEmission = calculateActivity(
        monthsActivitiesEmission,
        monthsAE
      );
      yearsActivitiesEmission = calculateActivity(
        yearsActivitiesEmission,
        yearsAE
      );
    }

    const studentWithHighestEmission = studentEmissions.reduce(
      (prev, current) => {
        return prev.emission > current.emission ? prev : current;
      }
    );

    const returnData = {
      id,
      combined_class_section,
      class_teacher: {
        // @ts-ignore
        id: class_teacher.id,
        // @ts-ignore
        name: class_teacher.name,
      },
      student_with_highest_emission: studentWithHighestEmission,
      emissions_stats: {
        todays_emission: {
          total: todaysEmission.total,
          avg:
            todaysEmission.count !== 0
              ? +(todaysEmission.total / todaysEmission.count).toFixed(2)
              : 0,
          activties: todaysActivitiesEmission,
        },
        months_emission: {
          total: monthsEmission.total,
          avg:
            monthsEmission.count !== 0
              ? +(monthsEmission.total / monthsEmission.count).toFixed(2)
              : 0,
          activties: monthsActivitiesEmission,
        },
        years_emission: {
          total: yearsEmission.total,
          avg:
            yearsEmission.count !== 0
              ? +(yearsEmission.total / yearsEmission.count).toFixed(2)
              : 0,
          activties: yearsActivitiesEmission,
        },
      },
    };
    return returnData;
  });
}

export interface ClassDataProps {
  id: string;
  combined_class_section: string;
  classTeacher: User;
  studentWithHighestEmission: {
    emission: number;
    student: User;
  };
  emissions_stats: EmissionStats;
}
interface EmissionStats {
  todays_emission: Emission;
  months_emission: Emission;
  years_emission: Emission;
}
interface Emission {
  total: number;
  avg: number;
  activties: Activties;
}
export interface Activties {
  car: number;
  bus: number;
  metro: number;
  cycle: number;
  walk: number;
  plane: number;
}
