import express from "express";
import { pool } from "../db.js";

export const teacherRouter = express.Router();

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
            return res
                .status(404)
                .json({
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

// POST — загрузить материалы (заглушка)
teacherRouter.post("/materials/:courseId", async (req, res) => {
    const { courseId } = req.params;
    res.json({
        message: `Материалы для курса ${courseId} успешно загружены (заглушка)`,
    });
});
