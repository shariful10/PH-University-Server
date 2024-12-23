import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLE } from "../user/user.const";
import { StudentControllers } from "./student.controller";
import { StudentValidations } from "./student.validation";

const router = express.Router();

router.get("/", StudentControllers.getAllStudents);

router.get(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.faculty),
  StudentControllers.getSingleStudent,
);

router.delete("/:id", StudentControllers.deleteStudent);

router.patch(
  "/:id",
  validateRequest(StudentValidations.updateStudentValidationSchema),
  StudentControllers.updateStudent,
);

export const StudentRoutes = router;
