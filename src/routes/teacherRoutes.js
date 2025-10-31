import express from "express";
import { pool } from "../db.js";
/**
 * @swagger
 * tags:
 *   name: Teacher
 *   description: Методы для преподавателя (создание и управление курсами)
 */
export const teacherRouter = express.Router();
/**
 * @swagger
 * /api/teacher/courses:
 *   post:
 *     summary: Создать новый курс
 *     tags: [Teacher]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Курс успешно создан
 *       500:
 *         description: Ошибка при создании курса
 */
// POST — создать новый курс
teacherRouter.post("/courses", async (req, res) => {
    const { title, description } = req.body;
    const teacherId = 2; // временно фиксируем преподавателя (например, ID=2)

    try {
        const result = await pool.query(
            "INSERT INTO courses (title, description, teacher_id) VALUES ($1, $2, $3) RETURNING *",
            [title, description, teacherId]
        );
        res.json({ message: "Курс успешно создан", course: result.rows[0] });
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
 *     responses:
 *       200:
 *         description: Список курсов преподавателя
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
// GET — мои курсы
teacherRouter.get("/my-courses", async (req, res) => {
    const teacherId = 2;

    try {
        const result = await pool.query(
            "SELECT id, title, description, created_at FROM courses WHERE teacher_id = $1 ORDER BY id",
            [teacherId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Ошибка получения курсов преподавателя",
        });
    }
});
/**
 * @swagger
 * /api/teacher/courses/{courseId}:
 *   patch:
 *     summary: Обновить описание курса
 *     tags: [Teacher]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
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
 *       404:
 *         description: Курс не найден
 */
// PATCH — обновить курс
teacherRouter.patch("/courses/:courseId", async (req, res) => {
    const { courseId } = req.params;
    const { description } = req.body;
    const teacherId = 2;

    try {
        const result = await pool.query(
            "UPDATE courses SET description = $1 WHERE id = $2 AND teacher_id = $3 RETURNING *",
            [description, courseId, teacherId]
        );

        if (result.rowCount === 0)
            return res.status(404).json({
                error: "Курс не найден или не принадлежит преподавателю",
            });

        res.json({
            message: "Описание курса обновлено",
            course: result.rows[0],
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Ошибка при обновлении курса" });
    }
});
/**
 * @swagger
 * /api/teacher/materials/{courseId}:
 *   post:
 *     summary: Загрузить учебный материал (заглушка)
 *     tags: [Teacher]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID курса
 *     responses:
 *       200:
 *         description: Материалы успешно загружены
 */
// POST — загрузить материалы (заглушка)
teacherRouter.post("/materials/:courseId", async (req, res) => {
    const { courseId } = req.params;
    res.json({
        message: `Материалы для курса ${courseId} успешно загружены (заглушка)`,
    });
});
