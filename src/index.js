import express from "express";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import { studentRouter } from "./routes/studentRoutes.js";
import { teacherRouter } from "./routes/teacherRoutes.js";
import { pool } from "./db.js";

const app = express();
app.use(bodyParser.json());

// --- ROUTES ---
app.use("/api/student", studentRouter);
app.use("/api/teacher", teacherRouter);

app.get("/", (req, res) => {
    res.json({ status: "Learning Platform API is running" });
});

// --- Swagger Setup ---
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
                description: "Local dev",
            },
        ],
    },
    apis: [path.join(__dirname, "routes", "*.js")],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger UI (интерфейс)
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
        explorer: true,
        customCss: ".swagger-ui .topbar { display: none }",
    })
);

// JSON спецификация (для проверки)
app.get("/swagger.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
});

// --- Server start ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
