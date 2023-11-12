import express from "express";
import payload from "payload";
import cors from "cors";
var corsOptions = {
  origin: "*",
  credentials: true,
  optionsSuccessStatus: 200,
};

require("dotenv").config();
const app = express();
app.use(cors(corsOptions));

// Redirect root to Admin panel
app.get("/", (_, res) => {
  res.redirect("/admin");
});

const start = async () => {
  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
    email: {
      fromName: process.env.FROM_NAME,
      fromAddress: process.env.FROM_ADDRESS,
      transportOptions: {
        host: process.env.STMP_HOST,
        auth: {
          user: process.env.STMP_USER,
          pass: process.env.STMP_PASS,
        },
        port: 465,
        secure: true,
        tls: {
          rejectUnauthorized: false,
        },
      },
    },
  });

  // Add your own express routes here

  app.listen(process.env.PORT || 3001);
};

start();
