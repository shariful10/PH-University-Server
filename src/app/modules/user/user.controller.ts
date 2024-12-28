import { TUploadedFile } from "../../interface/file";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";

const createStudent = catchAsync(async (req, res) => {
  const { password, student: studentData } = req.body;

  const result = await UserServices.createStudentIntoDB(
    req.file as TUploadedFile,
    password,
    studentData,
  );

  sendResponse(res, {
    message: "Student is created successfully",
    data: result,
  });
});

const createFaculty = catchAsync(async (req, res) => {
  const { password, faculty: facultyData } = req.body;

  const result = await UserServices.createFacultyIntoDB(
    req.file as TUploadedFile,
    password,
    facultyData,
  );

  sendResponse(res, {
    message: "Faculty is created successfully",
    data: result,
  });
});

const createAdmin = catchAsync(async (req, res) => {
  const { password, admin: adminData } = req.body;

  const result = await UserServices.createAdminIntoDB(
    req.file as TUploadedFile,
    password,
    adminData,
  );

  sendResponse(res, {
    message: "Admin is created successfully",
    data: result,
  });
});

const changeStatus = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await UserServices.changeStatusIntoDB(id, req.body);

  sendResponse(res, {
    message: "User status changed successfully!",
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const { userId, role } = req.user;

  const result = await UserServices.getMeFromDB(userId, role);

  sendResponse(res, {
    message: "User is retrieved successfully",
    data: result,
  });
});

export const UserControllers = {
  createStudent,
  createFaculty,
  createAdmin,
  changeStatus,
  getMe,
};
