import express from "express";
import { pool } from "../db.js";

export const teacherRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Teacher
 *   description: Методы для преподавателей
 */

/**
 * @swagger
 * /api/teacher/courses:
 *   post:
 *     summary: Создать новый курс
 *     tags: [Teacher]
 *     parameters:
 *       - in: header
 *         name: x-user-id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID преподавателя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Курс успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       400:
 *         description: Не указан x-user-id
 *       500:
 *         description: Ошибка при создании курса
 */
teacherRouter.post("/courses", async (req, res) => {
  const { title, description } = req.body;
  const teacherId = req.headers["x-user-id"];

  if (!teacherId)
    return res.status(400).json({ error: "Не указан x-user-id (teacher ID)" });

  try {
    const result = await pool.query(
      "INSERT INTO courses (title, description, teacher_id) VALUES ($1, $2, $3) RETURNING *",
      [title, description, teacherId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка при создании курса" });
  }
});

/**
 * @swagger
 * /api/teacher/my-courses:
 *   get:
 *     summary: Получить список курсов преподавателя
 *     tags: [Teacher]
 *     parameters:
 *       - in: header
 *         name: x-user-id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID преподавателя
 *     responses:
 *       200:
 *         description: Список курсов преподавателя
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 *       400:
 *         description: Не указан x-user-id
 *       500:
 *         description: Ошибка сервера
 */
teacherRouter.get("/my-courses", async (req, res) => {
  const teacherId = req.headers["x-user-id"];
  if (!teacherId)
    return res.status(400).json({ error: "Не указан x-user-id (teacher ID)" });

  try {
    const result = await pool.query(
      "SELECT * FROM courses WHERE teacher_id = $1 ORDER BY id",
      [teacherId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка получения курсов преподавателя" });
  }
});

/**
 * @swagger
 * /api/teacher/courses/{courseId}:
 *   patch:
 *     summary: Обновить описание курса
 *     tags: [Teacher]
 *     parameters:
 *       - in: header
 *         name: x-user-id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID преподавателя
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID курса
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Курс успешно обновлён
 *       400:
 *         description: Не указан x-user-id
 *       404:
 *         description: Курс не найден
 *       500:
 *         description: Ошибка при обновлении
 */
teacherRouter.patch("/courses/:courseId", async (req, res) => {
  const { courseId } = req.params;
  const { description } = req.body;
  const teacherId = req.headers["x-user-id"];

  if (!teacherId)
    return res.status(400).json({ error: "Не указан x-user-id (teacher ID)" });

  try {
    const result = await pool.query(
      "UPDATE courses SET description = $1 WHERE id = $2 AND teacher_id = $3 RETURNING *",
      [description, courseId, teacherId]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ error: "Курс не найден или не принадлежит преподавателю" });

    res.json({ message: "Курс обновлён", course: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка при обновлении курса" });
  }
});

/**
 * @swagger
 * /api/teacher/materials/{courseId}:
 *   post:
 *     summary: Добавить материалы курса (заглушка)
 *     tags: [Teacher]
 *     parameters:
 *       - in: header
 *         name: x-user-id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID преподавателя
 *       - in: path
 *         name: courseId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID курса
 *     responses:
 *       200:
 *         description: Материалы успешно загружены (заглушка)
 *       400:
 *         description: Не указан x-user-id
 *       404:
 *         description: Курс не найден
 */
teacherRouter.post("/materials/:courseId", async (req, res) => {
  const { courseId } = req.params;
  const teacherId = req.headers["x-user-id"];

  if (!teacherId)
    return res.status(400).json({ error: "Не указан x-user-id (teacher ID)" });

  try {
    const check = await pool.query(
      "SELECT id FROM courses WHERE id = $1 AND teacher_id = $2",
      [courseId, teacherId]
    );

    if (check.rowCount === 0)
      return res.status(404).json({ error: "Курс не найден или принадлежит другому преподавателю" });

    res.json({ message: "Материалы добавлены (заглушка)" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка добавления материалов" });
  }
});
