import express from "express";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import { studentRouter } from "./routes/studentRoutes.js";
import { teacherRouter } from "./routes/teacherRoutes.js";

const app = express();
app.use(bodyParser.json());

app.use("/api/student", studentRouter);
app.use("/api/teacher", teacherRouter);

app.get("/", (req, res) => {
  res.json({ status: "Learning Platform API is running" });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Learning Platform API",
      version: "1.0.0",
      description: "Документация API для онлайн-платформы обучения",
    },
    servers: [
      {
        url: "https://system-analyze-module1-production.up.railway.app",
        description: "Production",
      },
      {
        url: "http://localhost:3000",
        description: "Local development",
      },
    ],
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            email: { type: "string" },
            role: { type: "string", enum: ["student", "teacher"] },
          },
        },
        Course: {
          type: "object",
          properties: {
            id: { type: "integer" },
            title: { type: "string" },
            description: { type: "string" },
            teacher_id: { type: "integer" },
            created_at: { type: "string", format: "date-time" },
          },
        },
        Enrollment: {
          type: "object",
          properties: {
            id: { type: "integer" },
            student_id: { type: "integer" },
            course_id: { type: "integer" },
            progress: { type: "integer" },
          },
        },
      },
    },
  },
  apis: [path.join(__dirname, "routes", "*.js")],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
  })
);

app.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
