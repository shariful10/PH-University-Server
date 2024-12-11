import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { StudentControllers } from "./student.controller";
import { StudentValidations } from "./student.validation";

const router = express.Router();

router.get("/", StudentControllers.getAllStudents);

router.get("/:id", StudentControllers.getSingleStudent);

router.delete("/:id", StudentControllers.deleteStudent);

router.patch(
  "/:id",
  validateRequest(StudentValidations.updateStudentValidationSchema),
  StudentControllers.updateStudent,
);

export const StudentRoutes = router;
