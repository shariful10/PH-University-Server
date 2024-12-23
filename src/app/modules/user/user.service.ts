import mongoose from "mongoose";
import config from "../../config";
import AppError from "../../errors/AppError";
import { TUploadedFile } from "../../interface/file";
import { httpStatusCode } from "../../utils/httpStatusCode";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";
import { AcademicSemester } from "../academicSemester/academicSemester.model";
import { Admin } from "../Admin/admin.model";
import { TFaculty } from "../Faculty/faculty.interface";
import { Faculty } from "../Faculty/faculty.model";
import { TStudent } from "../student/student.interface";
import { Student } from "../student/student.model";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from "./user.utils";

const createStudentIntoDB = async (
  file: TUploadedFile,
  password: string,
  payload: TStudent,
) => {
  // Create a user object
  const userData: Partial<TUser> = {};

  // If password is not provided use the default password
  userData.password = password || (config.defaultPassword as string);

  // Set Student role & email
  userData.role = "student";
  userData.email = payload.email;

  // Find academic semester info
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  if (!admissionSemester) {
    throw new AppError(
      httpStatusCode.BAD_REQUEST,
      "Admission semester not found",
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    // Set generated id
    userData.id = await generateStudentId(admissionSemester);

    // Send image to Cloudinary
    const imageName = `${userData?.id}${payload?.name?.firstName}`;
    const path = file?.path;

    const { secure_url } = (await sendImageToCloudinary(imageName, path)) as {
      secure_url: string;
    };

    // Create a user
    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatusCode.BAD_REQUEST, "Failed to create user!");
    }

    // Create a student
    if (newUser.length) {
      // Set id, _id as user
      payload.id = newUser[0].id;
      payload.user = newUser[0]._id;
      payload.profileImg = secure_url;

      const newStudent = await Student.create([payload], { session });

      if (!newStudent.length) {
        throw new AppError(
          httpStatusCode.BAD_REQUEST,
          "Failed to create student!",
        );
      }

      await session.commitTransaction();
      await session.endSession();

      return newStudent;
    }
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatusCode.INTERNAL_SERVER_ERROR,
      err instanceof Error ? err.message : "Something went wrong!",
    );
  }
};

const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
  // Create a user object
  const userData: Partial<TUser> = {};

  // If password is not given , use default password
  userData.password = password || (config.defaultPassword as string);

  // Set faculty role & email
  userData.role = "faculty";
  userData.email = payload.email;

  // Find academic department info
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  );

  if (!academicDepartment) {
    throw new AppError(
      httpStatusCode.BAD_REQUEST,
      "Academic department not found",
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    // Set generated id
    userData.id = await generateFacultyId();

    // Create a user (transaction-1)
    const newUser = await User.create([userData], { session }); // array

    //create a faculty
    if (!newUser.length) {
      throw new AppError(httpStatusCode.BAD_REQUEST, "Failed to create user");
    }
    // Set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // Create a faculty (transaction-2)

    const newFaculty = await Faculty.create([payload], { session });

    if (!newFaculty.length) {
      throw new AppError(
        httpStatusCode.BAD_REQUEST,
        "Failed to create faculty",
      );
    }

    await session.commitTransaction();
    await session.endSession();

    return newFaculty;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatusCode.INTERNAL_SERVER_ERROR,
      err instanceof Error ? err.message : "Something went wrong!",
    );
  }
};

const createAdminIntoDB = async (password: string, payload: TFaculty) => {
  // Create a user object
  const userData: Partial<TUser> = {};

  // If password is not given , use default password
  userData.password = password || (config.defaultPassword as string);

  // Set admin role & email
  userData.role = "admin";
  userData.email = payload.email;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateAdminId();

    // Create a user (transaction-1)
    const newUser = await User.create([userData], { session });

    // Create a admin
    if (!newUser.length) {
      throw new AppError(httpStatusCode.BAD_REQUEST, "Failed to create admin");
    }
    // Set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; // Reference _id

    // Create a admin (transaction-2)
    const newAdmin = await Admin.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError(httpStatusCode.BAD_REQUEST, "Failed to create admin");
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatusCode.INTERNAL_SERVER_ERROR,
      err instanceof Error ? err.message : "Something went wrong!",
    );
  }
};

const changeStatusIntoDB = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, { new: true });

  return result;
};

const getMeFromDB = async (userId: string, role: string) => {
  let result = null;

  if (role === "student") {
    result = await Student.findOne({ id: userId }).populate("user");
  }

  if (role === "faculty") {
    result = await Faculty.findOne({ id: userId }).populate("user");
  }

  if (role === "admin") {
    result = await Admin.findOne({ id: userId }).populate("user");
  }

  return result;
};

export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
  changeStatusIntoDB,
  getMeFromDB,
};
