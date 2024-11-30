import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { studentValidations } from "../student/student.validation";
import { UserControllers } from "./user.controllers";

const router = express.Router();

router.post(
  "/create-student",
  validateRequest(studentValidations.createStudentValidationSchema),
  UserControllers.createUser,
);

export const UserRoutes = router;
