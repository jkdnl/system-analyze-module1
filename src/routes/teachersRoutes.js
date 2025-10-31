import express from "express";
export const teacherRouter = express.Router();

// POST — создать курс
teacherRouter.post("/courses", (req, res) => {
  const { title, description } = req.body;
  res.json({ id: Date.now(), title, description, message: "Курс успешно создан" });
});

// POST — загрузить материалы (заглушка)
teacherRouter.post("/materials/:courseId", (req, res) => {
  const { courseId } = req.params;
  res.json({ message: `Материалы для курса ${courseId} успешно загружены (заглушка)` });
});

// GET — мои курсы
teacherRouter.get("/my-courses", (req, res) => {
  res.json([{ id: 101, title: "UX Design Fundamentals" }]);
});

// PATCH — обновить описание курса
teacherRouter.patch("/courses/:courseId", (req, res) => {
  const { courseId } = req.params;
  const { description } = req.body;
  res.json({ message: `Описание курса ${courseId} обновлено`, newDescription: description });
});
