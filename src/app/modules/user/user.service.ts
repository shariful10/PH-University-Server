import mongoose from "mongoose";
import config from "../../config";
import AppError from "../../errors/AppError";
import { AcademicSemester } from "../academicSemester/academicSemester.model";
import { TStudent } from "../student/student.interface";
import { Student } from "../student/student.model";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import { generateStudentId } from "./user.utils";

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  // Create a user object
  const userData: Partial<TUser> = {};

  // If password is not provided use the default password
  userData.password = password || (config.defaultPassword as string);

  // Set user role
  userData.role = "student";

  // Find academic semester info
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  if (!admissionSemester) {
    throw new AppError(400, "Admission semester not found");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    // Set generated id
    userData.id = await generateStudentId(admissionSemester);

    // Create a user
    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(400, "Failed to create user!");
    }

    // Create a student
    if (newUser.length) {
      // Set id, _id as user
      payload.id = newUser[0].id;
      payload.user = newUser[0]._id;

      const newStudent = await Student.create([payload], { session });

      if (!newStudent.length) {
        throw new AppError(400, "Failed to create student!");
      }

      await session.commitTransaction();
      await session.endSession();

      return newStudent;
    }
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      500,
      err instanceof Error ? err.message : "Something went wrong!",
    );
  }
};

export const UserServices = {
  createStudentIntoDB,
};
