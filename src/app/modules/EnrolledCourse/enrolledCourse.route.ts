import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLE } from "../user/user.const";
import { EnrolledCourseControllers } from "./enrolledCourse.controller";
import { EnrolledCourseValidations } from "./enrolledCourse.validation";

const router = express.Router();

router.post(
  "/create-enrolled-course",
  auth(USER_ROLE.student),
  validateRequest(
    EnrolledCourseValidations.createEnrolledCourseValidationZodSchema,
  ),
  EnrolledCourseControllers.createEnrolledCourse,
);

router.get(
  "/my-enrolled-courses",
  auth(USER_ROLE.student),
  EnrolledCourseControllers.getMyEnrolledCourses,
);

router.patch(
  "/update-enrolled-course-marks",
  auth(USER_ROLE.faculty),
  validateRequest(
    EnrolledCourseValidations.updateEnrolledCourseMarksValidationZodSchema,
  ),
  EnrolledCourseControllers.updateEnrolledCourse,
);

export const EnrolledCourseRoutes = router;
