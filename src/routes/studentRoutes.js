import express from "express";
import { pool } from "../db.js";

export const studentRouter = express.Router();
/**
 * @swagger
 * tags:
 *   name: Student
 *   description: Методы для работы студента
 */
// GET — список всех курсов

/**
 * @swagger
 * /api/student/courses:
 *   get:
 *     summary: Получить список всех доступных курсов
 *     tags: [Student]
 *     responses:
 *       200:
 *         description: Успешное получение списка курсов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 */
studentRouter.get("/courses", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id, title, description FROM courses ORDER BY id"
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Ошибка получения списка курсов" });
    }
});
/**
 * @swagger
 * /api/student/enroll/{courseId}:
 *   post:
 *     summary: Записаться на курс
 *     tags: [Student]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID курса
 *     responses:
 *       200:
 *         description: Успешная запись на курс
 *       500:
 *         description: Ошибка при записи
 */
// POST — записаться на курс
studentRouter.post("/enroll/:courseId", async (req, res) => {
    const { courseId } = req.params;
    const studentId = 1; // временно фиксируем студента (например, ID=1)

    try {
        const result = await pool.query(
            "INSERT INTO enrollments (student_id, course_id) VALUES ($1, $2) RETURNING *",
            [studentId, courseId]
        );
        res.json({
            message: "Студент успешно записан",
            enrollment: result.rows[0],
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Ошибка при записи на курс" });
    }
});
/**
 * @swagger
 * /api/student/my-courses:
 *   get:
 *     summary: Получить список курсов, на которые записан студент
 *     tags: [Student]
 *     responses:
 *       200:
 *         description: Список курсов студента
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   progress:
 *                     type: integer
 */
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
/**
 * @swagger
 * /api/student/progress/{courseId}:
 *   patch:
 *     summary: Обновить прогресс по конкретному курсу
 *     tags: [Student]
 *     parameters:
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
 *               progress:
 *                 type: integer
 *                 description: Новый процент прогресса
 *     responses:
 *       200:
 *         description: Прогресс успешно обновлён
 *       404:
 *         description: Запись не найдена
 *       500:
 *         description: Ошибка сервера
 */
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
            return res
                .status(404)
                .json({ error: "Запись о зачислении не найдена" });

        res.json({ message: "Прогресс обновлён", enrollment: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Ошибка обновления прогресса" });
    }
});
