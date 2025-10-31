import express from "express";
import { pool } from "../db.js";

export const studentRouter = express.Router();

// GET — список всех курсов
studentRouter.get("/courses", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, title, description FROM courses ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка получения списка курсов" });
  }
});

// POST — записаться на курс
studentRouter.post("/enroll/:courseId", async (req, res) => {
  const { courseId } = req.params;
  const studentId = 1; // временно фиксируем студента (например, ID=1)

  try {
    const result = await pool.query(
      "INSERT INTO enrollments (student_id, course_id) VALUES ($1, $2) RETURNING *",
      [studentId, courseId]
    );
    res.json({ message: "Студент успешно записан", enrollment: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка при записи на курс" });
  }
});

// GET — мои курсы
studentRouter.get("/my-courses", async (req, res) => {
  const studentId = 1;
  try {
    const result = await pool.query(
      `SELECT c.id, c.title, c.description, e.progress
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       WHERE e.student_id = $1`,
      [studentId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка получения курсов студента" });
  }
});

// PATCH — обновить прогресс
studentRouter.patch("/progress/:courseId", async (req, res) => {
  const { courseId } = req.params;
  const { progress } = req.body;
  const studentId = 1;

  try {
    const result = await pool.query(
      "UPDATE enrollments SET progress = $1 WHERE student_id = $2 AND course_id = $3 RETURNING *",
      [progress, studentId, courseId]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ error: "Запись о зачислении не найдена" });

    res.json({ message: "Прогресс обновлён", enrollment: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка обновления прогресса" });
  }
});
