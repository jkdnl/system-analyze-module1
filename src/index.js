import express from "express";
import bodyParser from "body-parser";
import { studentRouter } from "./routes/studentRoutes.js";
import { teacherRouter } from "./routes/teacherRoutes.js";

const app = express();
app.use(bodyParser.json());

app.use("/api/student", studentRouter);
app.use("/api/teacher", teacherRouter);

app.get("/", (req, res) =>
    res.json({ status: "Learning Platform API is running" })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import { pool } from "./db.js";

app.get("/init-db", async (req, res) => {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        role TEXT CHECK (role IN ('student', 'teacher')) NOT NULL
      );
      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        teacher_id INT REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS enrollments (
        id SERIAL PRIMARY KEY,
        student_id INT REFERENCES users(id) ON DELETE CASCADE,
        course_id INT REFERENCES courses(id) ON DELETE CASCADE,
        progress INT DEFAULT 0
      );
    `);
        res.send("✅ Таблицы успешно созданы");
    } catch (err) {
        console.error(err);
        res.status(500).send("❌ Ошибка при создании таблиц");
    }
});

app.get("/reset-db", async (req, res) => {
    try {
        await pool.query(`
      DROP TABLE IF EXISTS enrollments CASCADE;
      DROP TABLE IF EXISTS courses CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);
        res.send("🗑️ Все таблицы удалены успешно");
    } catch (err) {
        console.error(err);
        res.status(500).send("❌ Ошибка при удалении таблиц");
    }
});
