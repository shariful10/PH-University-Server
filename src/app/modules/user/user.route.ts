import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { AdminValidations } from "../Admin/admin.validation";
import { facultyValidations } from "../Faculty/faculty.validation";
import { StudentValidations } from "../student/student.validation";
import { USER_ROLE } from "./user.const";
import { UserControllers } from "./user.controller";

const router = express.Router();

router.post(
  "/create-student",
  auth(USER_ROLE.admin),
  validateRequest(StudentValidations.createStudentValidationSchema),
  UserControllers.createUser,
);

router.post(
  "/create-faculty",
  auth(USER_ROLE.admin),
  validateRequest(facultyValidations.createFacultyValidationSchema),
  UserControllers.createFaculty,
);

router.post(
  "/create-admin",
  // auth(USER_ROLE.admin),
  validateRequest(AdminValidations.createAdminValidationSchema),
  UserControllers.createAdmin,
);

export const UserRoutes = router;
