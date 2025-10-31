import express from "express";
export const studentRouter = express.Router();

// GET — список курсов
studentRouter.get("/courses", (req, res) => {
  res.json([
    { id: 1, name: "Frontend Development", credits: 4 },
    { id: 2, name: "UX Research", credits: 3 },
  ]);
});

// POST — записаться на курс
studentRouter.post("/enroll/:courseId", (req, res) => {
  const { courseId } = req.params;
  res.json({ message: `Студент успешно записан на курс ${courseId}` });
});

// GET — мои курсы
studentRouter.get("/my-courses", (req, res) => {
  res.json([{ id: 1, name: "Frontend Development", progress: 60 }]);
});

// PATCH — обновить прогресс
studentRouter.patch("/progress/:courseId", (req, res) => {
  const { courseId } = req.params;
  const { progress } = req.body;
  res.json({ message: `Прогресс по курсу ${courseId} обновлён до ${progress}%` });
});
