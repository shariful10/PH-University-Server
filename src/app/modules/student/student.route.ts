import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { updateStudent } from "./student.controller";
import { StudentControllers } from "./student.controllers";
import { StudentValidations } from "./student.validation";

const router = express.Router();

router.get("/", StudentControllers.getAllStudents);

router.get("/:studentId", StudentControllers.getSingleStudent);

router.delete("/:studentId", StudentControllers.deleteStudent);

router.patch(
  "/:studentId",
  validateRequest(StudentValidations.updateStudentValidationSchema),
  updateStudent,
);

export const StudentRoutes = router;
