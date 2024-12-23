import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AcademicFacultyControllers } from "./academicFaculty.controller";
import { AcademicFacultyValidation } from "./academicFaculty.validation";

const router = express.Router();

router.post(
  "/create-academic-faculty",
  validateRequest(AcademicFacultyValidation.createFacultyValidationSchema),
  AcademicFacultyControllers.createAcademicFaculty,
);

router.get("/", AcademicFacultyControllers.getAllAcademicFaculties);

router.get("/:facultyId", AcademicFacultyControllers.getSingleAcademicFaculty);

router.patch(
  "/:facultyId",
  validateRequest(AcademicFacultyValidation.updateFacultyValidationSchema),
  AcademicFacultyControllers.updateAcademicFaculty,
);

export const AcademicFacultyRoutes = router;
