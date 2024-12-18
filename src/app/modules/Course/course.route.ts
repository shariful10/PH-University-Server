import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { CourseControllers } from "./course.controller";
import { CourseValidations } from "./course.validation";

const router = express.Router();

router.post(
  "/create-course",
  auth("admin"),
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseControllers.createCourse,
);

router.get(
  "/",
  auth("admin", "faculty", "student"),
  CourseControllers.getAllCourses,
);

router.get(
  "/:id",
  auth("admin", "faculty", "student"),
  CourseControllers.getSingleCourse,
);

router.delete("/:id", auth("admin"), CourseControllers.deleteCourse);

router.patch("/:id", auth("admin"), CourseControllers.updateCourse);

router.put(
  "/:courseId/assign-faculties",
  auth("admin"),
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.assignFacultiesWithCourse,
);

router.delete(
  "/:courseId/remove-faculties",
  auth("admin"),
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.removeFacultiesFromCourse,
);

export const CourseRoutes = router;
