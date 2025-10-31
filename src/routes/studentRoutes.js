import express from "express";
import { pool } from "../db.js";

export const studentRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Student
 *   description: Методы для студентов
 */

/**
 * @swagger
 * /api/student/courses:
 *   get:
 *     summary: Получить список всех курсов
 *     tags: [Student]
 *     responses:
 *       200:
 *         description: Список курсов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 */
studentRouter.get("/courses", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM courses ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка получения курсов" });
  }
});

/**
 * @swagger
 * /api/student/enroll/{courseId}:
 *   post:
 *     summary: Записаться на курс
 *     tags: [Student]
 *     parameters:
 *       - in: header
 *         name: x-user-id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID студента
 *       - in: path
 *         name: courseId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID курса
 *     responses:
 *       200:
 *         description: Успешная запись на курс
 *       500:
 *         description: Ошибка сервера
 */
studentRouter.post("/enroll/:courseId", async (req, res) => {
  const { courseId } = req.params;
  const studentId = req.headers["x-user-id"];
  if (!studentId) return res.status(400).json({ error: "Не указан x-user-id" });

  try {
    const result = await pool.query(
      "INSERT INTO enrollments (student_id, course_id) VALUES ($1, $2) RETURNING *",
      [studentId, courseId]
    );
    res.json({ message: "Запись выполнена", enrollment: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка при записи на курс" });
  }
});

/**
 * @swagger
 * /api/student/my-courses:
 *   get:
 *     summary: Получить список курсов студента
 *     tags: [Student]
 *     parameters:
 *       - in: header
 *         name: x-user-id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID студента
 *     responses:
 *       200:
 *         description: Список курсов студента
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 */
studentRouter.get("/my-courses", async (req, res) => {
  const studentId = req.headers["x-user-id"];
  if (!studentId) return res.status(400).json({ error: "Не указан x-user-id" });

  try {
    const result = await pool.query(
      `SELECT c.*, e.progress
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       WHERE e.student_id = $1`,
      [studentId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка получения курсов" });
  }
});

/**
 * @swagger
 * /api/student/progress/{courseId}:
 *   patch:
 *     summary: Обновить прогресс по курсу
 *     tags: [Student]
 *     parameters:
 *       - in: header
 *         name: x-user-id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID студента
 *       - in: path
 *         name: courseId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID курса
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               progress:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Прогресс обновлён
 */
studentRouter.patch("/progress/:courseId", async (req, res) => {
  const { courseId } = req.params;
  const { progress } = req.body;
  const studentId = req.headers["x-user-id"];

  if (!studentId) return res.status(400).json({ error: "Не указан x-user-id" });

  try {
    const result = await pool.query(
      "UPDATE enrollments SET progress = $1 WHERE student_id = $2 AND course_id = $3 RETURNING *",
      [progress, studentId, courseId]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ error: "Запись не найдена" });
    res.json({ message: "Прогресс обновлён", enrollment: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка обновления прогресса" });
  }
});
