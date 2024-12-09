import AppError from "../../errors/AppError";
import { academicSemesterNameCodeMapper } from "./academicSemester.const";
import { TAcademicSemester } from "./academicSemester.interface";
import { AcademicSemester } from "./academicSemester.model";

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  if (
    payload.name &&
    academicSemesterNameCodeMapper[payload.name] !== payload.code
  ) {
    throw new AppError(400, "Invalid Semester code!");
  }

  const result = AcademicSemester.create(payload);
  return result;
};

const getAllAcademicSemestersFromDB = async () => {
  const result = AcademicSemester.find();
  return result;
};

const getSingleAcademicSemesterFromDB = async (id: string) => {
  const result = AcademicSemester.findById(id);

  if (!result) {
    throw new AppError(404, "Academic semester not found!");
  }

  return result;
};

const updateAcademicSemesterFromDB = async (
  id: string,
  payload: Partial<TAcademicSemester>,
) => {
  if (
    payload.name &&
    payload.code &&
    academicSemesterNameCodeMapper[payload.name] !== payload.code
  ) {
    throw new AppError(404, "Invalid Semester code!");
  }

  const result = await AcademicSemester.findByIdAndUpdate(id, payload, {
    new: true,
  });

  if (!result) {
    throw new AppError(404, "Academic semester not found!");
  }

  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllAcademicSemestersFromDB,
  getSingleAcademicSemesterFromDB,
  updateAcademicSemesterFromDB,
};
