import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AcademicSemesterControllers } from "./academicSemester.controller";
import { AcademicSemesterValidation } from "./academicSemester.validation";

const router = express.Router();

router.post(
  "/create-academic-semester",
  validateRequest(
    AcademicSemesterValidation.createAcademicSemesterValidationSchema,
  ),
  AcademicSemesterControllers.createAcademicSemester,
);

router.get("/", AcademicSemesterControllers.getAllAcademicSemesters);

router.get(
  "/:facultyId",
  AcademicSemesterControllers.getSingleAcademicSemester,
);

router.patch(
  "/:facultyId",
  validateRequest(
    AcademicSemesterValidation.updateAcademicSemesterValidationSchema,
  ),
  AcademicSemesterControllers.updateAcademicSemester,
);

export const AcademicSemesterRoutes = router;
