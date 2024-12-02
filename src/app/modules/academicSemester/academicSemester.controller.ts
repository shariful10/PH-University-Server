import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AcademicSemesterServices } from "./academicSemester.service";

const createAcademicSemester = catchAsync(async (req, res) => {
  const result = await AcademicSemesterServices.createAcademicSemesterIntoDB(
    req.body,
  );

  sendResponse(res, {
    message: "Academic Semester created successfully",
    data: result,
  });
});

const getAllAcademicSemesters = catchAsync(async (req, res) => {
  const result = await AcademicSemesterServices.getAllAcademicSemestersFromDB();

  sendResponse(res, {
    message: "Academic Semesters retrieved successfully!",
    data: result,
  });
});

const getSingleAcademicSemester = catchAsync(async (req, res) => {
  const { academicSemesterId } = req.params;

  const result =
    await AcademicSemesterServices.getSingleAcademicSemesterFromDB(
      academicSemesterId,
    );

  sendResponse(res, {
    message: "Academic Semester retrieved successfully!",
    data: result,
  });
});

const updateAcademicSemester = catchAsync(async (req, res) => {
  const { academicSemesterId } = req.params;

  const result = await AcademicSemesterServices.updateAcademicSemesterFromDB(
    academicSemesterId,
    req.body,
  );

  sendResponse(res, {
    message: "Academic Semester updated successfully!",
    data: result,
  });
});

export const AcademicSemesterControllers = {
  createAcademicSemester,
  getAllAcademicSemesters,
  getSingleAcademicSemester,
  updateAcademicSemester,
};
