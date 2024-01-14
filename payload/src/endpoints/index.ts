import { Endpoint } from "payload/config";
import path from "path";
import payload from "payload";
import { User } from "payload/generated-types";

export const endpoints: Endpoint[] = [
  {
    path: "/today",
    method: "get",
    handler: async (req, res, next) => {
      try {
        const user: User = req.user;

        if (!user) {
          res.status(403).json({ message: "You must be logged in" });
          return;
        }

        const uid = user.id;

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const data = await payload.find({
          collection: "footprint",
          where: {
            and: [
              {
                "user.id": {
                  equals: uid,
                },
              },
            ],
          },
        });

        if (data.totalDocs === 0) {
          res.status(403).json({
            message: "Log in to fetch your data",
          });
          return;
        }
        const logs = data.docs[0].logs;
        let emissionStats = data.docs[0].emission_stats;
        const {
          todayLogs,
          todaysActivitiesEmission,
          monthsActivitiesEmission,
          yearsActivitiesEmission,
          emission_stats,
        } = calculateEmissionStats(logs, emissionStats);

        const roles = user.roles;

        if (roles.includes("teacher")) {
          const classData = await payload.find({
            collection: "classes",
            where: {
              and: [
                {
                  "class_teacher.id": {
                    equals: uid,
                  },
                },
              ],
            },
            depth: 0,
          });

          if (classData.totalDocs === 0) {
            res.status(200).json({
              emission_stats: emission_stats,
              logs: todayLogs,
              activities: {
                today: todaysActivitiesEmission,
                month: monthsActivitiesEmission,
                year: yearsActivitiesEmission,
              },
              user: {
                is_class_teacher: false,
                is_principal: false,
                user: user.name,
                roles: roles,
              },
            });
            return;
          }

          res.status(200).json({
            emission_stats: emission_stats,
            logs: todayLogs,
            activities: {
              today: todaysActivitiesEmission,
              month: monthsActivitiesEmission,
              year: yearsActivitiesEmission,
            },
            user: {
              is_class_teacher: true,
              is_principal: false,
              name: user.name,
              roles: roles,
              my_class: {
                id: classData.docs[0].id,
                class_section: classData.docs[0].combined_class_section,
              },
            },
          });
          return;
        }

        if (roles.includes("supervisor")) {
          const mySectionDocs = await payload.find({
            collection: "supervisor",
            where: {
              supervisor: {
                equals: uid,
              },
            },
            depth: 0,
          });

          if (mySectionDocs.totalDocs !== 0) {
            const mySection = mySectionDocs.docs[0];

            res.status(200).json({
              emission_stats: emission_stats,
              logs: todayLogs,
              activities: {
                today: todaysActivitiesEmission,
                month: monthsActivitiesEmission,
                year: yearsActivitiesEmission,
              },
              user: {
                is_class_teacher: false,
                is_supervisor: true,
                is_principal: false,
                name: user.name,
                roles: roles,
                my_section: {
                  id: mySection.id,
                  section: mySection.section,
                },
              },
            });
            return;
          }
        }

        res.status(200).json({
          emission_stats: emission_stats,
          logs: todayLogs,
          activities: {
            today: todaysActivitiesEmission,
            month: monthsActivitiesEmission,
            year: yearsActivitiesEmission,
          },
          user: {
            is_class_teacher: false,
            is_principal: false,
            name: user.name,
            roles: roles,
          },
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({
          message: "Failed to fetch your data",
        });
      }
    },
  },

  {
    path: "/logs",
    method: "get",
    handler: async (req, res, next) => {
      try {
        const uid = req.query.uid ?? "get_a_life";
        const footprint = await payload.find({
          collection: "footprint",
          where: {
            and: [
              {
                "user.id": {
                  equals: uid,
                },
              },
            ],
          },
        });

        res.status(200).json({
          logs: footprint.docs[0].logs,
          id: footprint.docs[0].id,
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch all logs." });
      }
    },
  },

  {
    path: "/logs",
    method: "post",
    handler: async (req, res, next) => {
      try {
        const user = req.user;
        const log: { timestamp: string; emission: number } = req.body;

        const footprint = await payload.find({
          collection: "footprint",
          where: {
            and: [
              {
                "user.id": {
                  equals: user.id,
                },
              },
            ],
          },
        });
        const currentLogs = footprint.docs[0].logs;
        const newLogs = [...currentLogs, log];

        const date = new Date();

        const today = date.toISOString().split("T")[0];
        const todayLogs = newLogs.filter(
          (log) => log.timestamp.split("T")[0] === today
        );
        const todaysEmission = Number(
          todayLogs.reduce((total, log) => total + log.emission, 0).toFixed(2)
        );
        let avgTodaysEmission: number =
          Number(todaysEmission) / todayLogs.length;
        if (todayLogs.length === 0) {
          avgTodaysEmission = 0;
        }

        const month = date.getMonth() + 1;
        const monthLogs = newLogs.filter((log) =>
          log.timestamp.split("-")[1].includes(String(month))
        );
        const monthsEmission = Number(
          monthLogs.reduce((total, log) => total + log.emission, 0).toFixed(2)
        );
        let avgMonthsEmission = monthsEmission / monthLogs.length;
        if (monthLogs.length === 0) {
          avgMonthsEmission = 0;
        }

        const year = date.getFullYear();
        const yearLogs = newLogs.filter(
          (log) => log.timestamp.split("-")[0] === String(year)
        );
        const yearsEmission = Number(
          yearLogs.reduce((total, log) => total + log.emission, 0).toFixed(2)
        );
        let avgYearsEmission = yearsEmission / yearLogs.length;
        if (yearLogs.length === 0) {
          avgYearsEmission = 0;
        }

        const emission_stats = {
          average_emission: {
            today: Number(avgTodaysEmission.toFixed(2)),
            month: Number(avgMonthsEmission.toFixed(2)),
            year: Number(avgYearsEmission.toFixed(2)),
          },
          total_emission: {
            today: Number(todaysEmission.toFixed(2)),
            month: Number(monthsEmission.toFixed(2)),
            year: Number(yearsEmission.toFixed(2)),
          },
        };

        const updatedFootprint = await payload.update({
          collection: "footprint",
          user: req.user,
          where: {
            and: [
              {
                "user.id": {
                  equals: user.id,
                },
              },
            ],
          },
          data: {
            logs: newLogs,
            emission_stats: emission_stats,
          },
        });

        res.status(200).json(updatedFootprint.docs);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch all logs." });
      }
    },
  },

  {
    path: "/my-class",
    method: "post",
    handler: async (req, res, next) => {
      try {
        const user: User = req.user;
        const { class_id } = req.body;

        if (!user || !class_id) {
          res
            .status(403)
            .json({ message: "You need to be a teacher to access this." });
          return;
        }

        const uid = user.id;
        const roles = user.roles;

        let classData;
        if (roles.includes("principal") || roles.includes("supervisor")) {
          classData = await payload.find({
            collection: "classes",
            where: {
              and: [
                {
                  id: {
                    equals: class_id,
                  },
                },
              ],
            },
            depth: 3,
          });
        } else {
          classData = await payload.find({
            collection: "classes",

            where: {
              and: [
                {
                  id: {
                    equals: class_id,
                  },
                },
                {
                  "class_teacher.id": {
                    equals: uid,
                  },
                },
              ],
            },
            depth: 3,
          });
        }

        if (classData.totalDocs === 0) {
          res
            .status(401)
            .json({ message: "No class found under your account." });
          return;
        }

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

        // @ts-ignore
        const students: User[] = classData.docs[0].students;
        for (const student of students) {
          const studentData = await payload.find({
            collection: "footprint",
            where: {
              and: [
                {
                  "user.id": {
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

        res.status(200).json({
          class_section: classData.docs[0].combined_class_section,
          class_teacher: classData.docs[0].class_teacher,
          students: students,
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
          send_message: true,
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch your class data." });
      }
    },
  },

  {
    path: "/my-class/student",
    method: "post",
    handler: async (req, res, next) => {
      try {
        const user: User = req.user;
        const { class_id, student_id } = req.body;

        if (!user || !class_id || !student_id) {
          res.status(403).json({
            message: "You need to be logged in to view this.",
          });
          return;
        }

        const uid = user.id;
        const roles = user.roles;
        const access_roles = ["admin", "teacher", "principal", "supervisor"];

        if (!roles.some((element) => access_roles.includes(element))) {
          res.status(403).json({
            message: "You need to be a teacher to access this.",
          });
          return;
        }

        if (
          roles.includes("teacher") ||
          roles.includes("supervisor") ||
          roles.includes("principal")
        ) {
          if (roles.includes("supervisor") || roles.includes("principal")) {
            const checkIfTeacherIsClassTeacher = await payload.find({
              collection: "classes",
              where: {
                and: [
                  {
                    id: {
                      equals: class_id,
                    },
                  },
                ],
              },
            });

            if (checkIfTeacherIsClassTeacher.totalDocs === 0) {
              res.status(404).json({
                message: "Class doesn't exist.",
              });
              return;
            }
          } else {
            const checkIfTeacherIsClassTeacher = await payload.find({
              collection: "classes",
              where: {
                and: [
                  {
                    id: {
                      equals: class_id,
                    },
                  },
                  {
                    class_teacher: {
                      equals: uid,
                    },
                  },
                ],
              },
            });

            if (checkIfTeacherIsClassTeacher.totalDocs === 0) {
              res.status(403).json({
                message:
                  "You need to be a teacher of this class to access this.",
              });
              return;
            }
          }
        }

        const checkIfStudentInClass = await payload.find({
          collection: "classes",
          where: {
            and: [
              {
                id: {
                  equals: class_id,
                },
              },
              {
                "students.id": {
                  contains: student_id,
                },
              },
            ],
          },
        });

        if (checkIfStudentInClass.totalDocs === 0) {
          res.status(404).json({ message: "Student is not in this class." });
          return;
        }

        const data = await payload.find({
          collection: "footprint",
          where: {
            and: [
              {
                user: {
                  equals: student_id,
                },
              },
            ],
          },
        });

        const logs = data.docs[0].logs;
        let emissionStats = data.docs[0].emission_stats;

        const {
          todayLogs,
          todaysActivitiesEmission,
          monthsActivitiesEmission,
          yearsActivitiesEmission,
          emission_stats,
        } = calculateEmissionStats(logs, emissionStats);

        res.status(200).json({
          emission_stats,
          logs: todayLogs,
          activities: {
            today: todaysActivitiesEmission,
            month: monthsActivitiesEmission,
            year: yearsActivitiesEmission,
          },
          student: {
            name: data.docs[0].user["name"],
            class: checkIfStudentInClass.docs[0].combined_class_section,
          },
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: err });
      }
    },
  },

  {
    path: "/my-messages",
    method: "get",
    handler: async (req, res, next) => {
      try {
        const user: User = req.user;
        if (!user) {
          res.status(403).json({
            message: "You need to be logged in to view your messages.",
          });
          return;
        }

        const roles = user.roles;
        const access_roles = ["teacher", "principal", "supervisor"];
        const showSent = roles.some((element) =>
          access_roles.includes(element)
        );

        const readMessages = await payload.find({
          collection: "messages",
          where: {
            and: [
              {
                to: {
                  equals: user.id,
                },
              },
              {
                is_read: {
                  equals: true,
                },
              },
            ],
          },
          sort: "-createdAt",
          depth: 1,
        });
        const unreadMessages = await payload.find({
          collection: "messages",
          where: {
            and: [
              {
                to: {
                  equals: user.id,
                },
              },
              {
                is_read: {
                  equals: false,
                },
              },
            ],
          },
          sort: "-createdAt",
          depth: 1,
        });

        res.status(200).json({
          read: readMessages,
          unread: unreadMessages,
          show_sent: showSent,
        });
      } catch (err) {
        console.error(err);
        res.status(500).json(err);
      }
    },
  },

  {
    path: "/my-messages/sent",
    method: "get",
    handler: async (req, res, next) => {
      try {
        const user: User = req.user;
        if (!user) {
          res.status(403).json({
            message: "You need to be logged in to view your messages.",
          });
          return;
        }

        const roles = user.roles;
        const access_roles = ["teacher", "principal", "supervisor"];
        const showSent = roles.some((element) =>
          access_roles.includes(element)
        );

        if (!showSent) {
          res
            .status(403)
            .json({ message: "You arent authorised to view this." });
          return;
        }

        const readMessages = await payload.find({
          collection: "messages",
          where: {
            and: [
              {
                from: {
                  equals: user.id,
                },
              },
              {
                is_read: {
                  equals: true,
                },
              },
            ],
          },
          sort: "-createdAt",
          depth: 1,
        });
        const unreadMessages = await payload.find({
          collection: "messages",
          where: {
            and: [
              {
                from: {
                  equals: user.id,
                },
              },
              {
                is_read: {
                  equals: false,
                },
              },
            ],
          },
          sort: "-createdAt",
          depth: 1,
        });

        res.status(200).json({
          read: readMessages,
          unread: unreadMessages,
          show_sent: showSent,
        });
      } catch (err) {
        console.error(err);
        res.status(500).json(err);
      }
    },
  },

  {
    path: "/my-messages",
    method: "post",
    handler: async (req, res, next) => {
      try {
        const user: User = req.user;
        const body: { mid: string } = req.body;
        if (!user || !body || !body.mid) {
          res.status(403).json({
            message: "You need to be logged in to view your messages.",
          });
          return;
        }

        await payload.update({
          collection: "messages",
          where: {
            and: [
              { id: { equals: body.mid } },
              {
                to: {
                  equals: user.id,
                },
              },
            ],
          },
          data: {
            is_read: true,
          },
        });

        res.status(200).json({ success: true, message: "Updated" });
      } catch (err) {
        console.error(err);
        res.status(500).json(err);
      }
    },
  },

  {
    path: "/my-messages/:id",
    method: "get",
    handler: async (req, res, next) => {
      try {
        const user: User = req.user;
        const mid = req.params.id;

        if (!user || !mid) {
          res.status(403).json({
            message: "You need to be logged in to view your messages.",
          });
          return;
        }

        const message = await payload.find({
          collection: "messages",
          where: {
            and: [
              { id: { equals: mid } },
              {
                to: {
                  equals: user.id,
                },
              },
            ],
          },
        });

        if (message.totalDocs === 0) {
          res.status(404).json({ message: "No message found." });
          return;
        }

        res.status(200).json(message);
      } catch (err) {
        console.error(err);
        res.status(500).json(err);
      }
    },
  },

  {
    path: "/send-message",
    method: "post",
    handler: async (req, res, next) => {
      try {
        const user: User = req.user;
        const body: { stud_id: string; message: string } = req.body;

        if (!user || !body || !body.stud_id || !body.message) {
          res.status(403).json({
            message: "You need to be logged in to view your messages.",
          });
          return;
        }

        const roles = user.roles;
        const access_roles = ["teacher", "principal", "supervisor"];
        const sendMessageAccess = roles.some((element) =>
          access_roles.includes(element)
        );

        if (!sendMessageAccess) {
          res
            .status(403)
            .json({ message: "You arent authorised to send this." });
          return;
        }

        const toUser = await payload.findByID({
          collection: "users",
          id: body.stud_id,
        });

        const message = `New message from <b>${
          roles.includes("supervisor")
            ? "Supervisor"
            : roles.includes("principal")
            ? "Principal"
            : roles[0]
        }</b>:<br />${body.message}`;
        await payload.create({
          collection: "messages",
          data: {
            from: user.id,
            to: toUser.id,
            message: message,
          },
          user,
          depth: 0,
        });

        res.status(200).json({
          success: true,
        });
      } catch (err) {
        console.error(err);
        res.status(500).json(err);
      }
    },
  },
];

export function calculateEmissionStats(logs: Log[], emissionStats = null) {
  const date = new Date();
  const activities = ["car", "bus", "metro", "cycle", "walk", "plane"];

  const todaysActivitiesEmission = Object.fromEntries(
    activities.map((activity) => [activity, 0])
  );
  const monthsActivitiesEmission = Object.fromEntries(
    activities.map((activity) => [activity, 0])
  );
  const yearsActivitiesEmission = Object.fromEntries(
    activities.map((activity) => [activity, 0])
  );

  const todayStart = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const todayEnd = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + 1
  );

  const todayLogs = logs.filter((log) => {
    const timestamp = new Date(log.timestamp);
    return timestamp >= todayStart && timestamp <= todayEnd;
  });

  todayLogs.forEach(
    (log) => (todaysActivitiesEmission[log.activity] += log.emission)
  );

  const month = date.getMonth() + 1;
  const monthLogs = logs.filter((log) =>
    log.timestamp.split("-")[1].includes(String(month))
  );
  monthLogs.forEach(
    (log) => (monthsActivitiesEmission[log.activity] += log.emission)
  );

  const year = date.getFullYear();
  const yearLogs = logs.filter(
    (log) => log.timestamp.split("-")[0] === String(year)
  );
  yearLogs.forEach(
    (log) => (yearsActivitiesEmission[log.activity] += log.emission)
  );

  const result = {
    todayLogs,
    monthLogs,
    yearLogs,
    todaysActivitiesEmission,
    monthsActivitiesEmission,
    yearsActivitiesEmission,
    emission_stats: null,
  };

  if (emissionStats) {
    let emission_stats = emissionStats;
    if (todayLogs.length === 0) {
      emission_stats.total_emission.today = 0;
      emission_stats.average_emission.today = 0;
    }

    result.emission_stats = emissionStats;
  }

  return result;
}

export function calculateStudentsEmissionStats(
  logs: Log[],
  emissionStats = null
) {
  const date = new Date();
  const activities = ["car", "bus", "metro", "cycle", "walk", "plane"];

  const todaysActivitiesEmission = Object.fromEntries(
    activities.map((activity) => [activity, 0])
  );
  const monthsActivitiesEmission = Object.fromEntries(
    activities.map((activity) => [activity, 0])
  );
  const yearsActivitiesEmission = Object.fromEntries(
    activities.map((activity) => [activity, 0])
  );

  const todayStart = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const todayEnd = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + 1
  );

  const todayLogs = logs.filter((log) => {
    const timestamp = new Date(log.timestamp);
    return timestamp >= todayStart && timestamp <= todayEnd;
  });

  todayLogs.forEach(
    (log) => (todaysActivitiesEmission[log.activity] += log.emission)
  );

  const month = date.getMonth() + 1;
  const monthLogs = logs.filter((log) =>
    log.timestamp.split("-")[1].includes(String(month))
  );
  monthLogs.forEach(
    (log) => (monthsActivitiesEmission[log.activity] += log.emission)
  );

  const year = date.getFullYear();
  const yearLogs = logs.filter(
    (log) => log.timestamp.split("-")[0] === String(year)
  );
  yearLogs.forEach(
    (log) => (yearsActivitiesEmission[log.activity] += log.emission)
  );

  const studentTodaysEmission = Number(
    todayLogs.reduce((total, log) => total + log.emission, 0).toFixed(2)
  );
  todayLogs.forEach(
    (log) => (todaysActivitiesEmission[log.activity] += log.emission)
  );

  const studentMonthsEmission = Number(
    monthLogs.reduce((total, log) => total + log.emission, 0).toFixed(2)
  );
  monthLogs.forEach(
    (log) => (monthsActivitiesEmission[log.activity] += log.emission)
  );

  const studentYearsEmission = Number(
    yearLogs.reduce((total, log) => total + log.emission, 0).toFixed(2)
  );
  yearLogs.forEach(
    (log) => (yearsActivitiesEmission[log.activity] += log.emission)
  );

  const result = {
    todayLogs,
    monthLogs,
    yearLogs,
    todaysActivitiesEmission,
    monthsActivitiesEmission,
    yearsActivitiesEmission,
    studentTodaysEmission,
    studentMonthsEmission,
    studentYearsEmission,
    emission_stats: null,
  };

  if (emissionStats) {
    let emission_stats = emissionStats;
    if (todayLogs.length === 0) {
      emission_stats.total_emission.today = 0;
      emission_stats.average_emission.today = 0;
    }

    result.emission_stats = emissionStats;
  }

  return result;
}

export function calculateActivity(obj1, obj2) {
  let result = {};
  Object.keys(obj1).forEach((key) => {
    result[key] = (obj1[key] || 0) + (obj2[key] || 0);
  });
  return result;
}

export interface Log {
  timestamp: string;
  activity: "car" | "bus" | "metro" | "cycle" | "walk" | "plane";
  distance: number;
  people: number;
  emission?: number;
  id?: string;
}
