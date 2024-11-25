import express from "express";
import { StudentControllers } from "./student.controllers";

const router = express.Router();

router.get("/", StudentControllers.getAllStudents);
router.get("/:studentId", StudentControllers.getSingleStudent);
router.delete("/:studentId", StudentControllers.deleteStudent);

export const StudentRoutes = router;
