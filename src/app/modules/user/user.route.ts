import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AdminValidations } from "../Admin/admin.validation";
import { facultyValidations } from "../Faculty/faculty.validation";
import { StudentValidations } from "../student/student.validation";
import { UserControllers } from "./user.controller";

const router = express.Router();

router.post(
  "/create-student",
  validateRequest(StudentValidations.createStudentValidationSchema),
  UserControllers.createUser,
);

router.post(
  "/create-faculty",
  validateRequest(facultyValidations.createFacultyValidationSchema),
  UserControllers.createFaculty,
);

router.post(
  "/create-admin",
  validateRequest(AdminValidations.createAdminValidationSchema),
  UserControllers.createAdmin,
);

export const UserRoutes = router;
