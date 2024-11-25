import { RequestHandler } from "express";
import sendResponse from "../../utils/sendResponse";
import { StudentServices } from "./student.service";

const getAllStudents: RequestHandler = async (req, res, next) => {
  try {
    const result = await StudentServices.getAllStudentsFromDB();

    sendResponse(res, {
      message: "Students are retrieved successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getSingleStudent: RequestHandler = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const result = await StudentServices.getSingleStudentsFromDB(studentId);

    sendResponse(res, {
      message: "Student is retrieved successfully!",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const deleteStudent: RequestHandler = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const result = await StudentServices.deleteStudentsFromDB(studentId);

    sendResponse(res, {
      message: "Student is deleted successfully!",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const StudentControllers = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
};
