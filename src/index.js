import express from "express";
import bodyParser from "body-parser";
import { studentRouter } from "./routes/studentRoutes.js";
import { teacherRouter } from "./routes/teacherRoutes.js";

const app = express();
app.use(bodyParser.json());

app.use("/api/student", studentRouter);
app.use("/api/teacher", teacherRouter);

app.get("/", (req, res) => res.json({ status: "Learning Platform API is running" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
