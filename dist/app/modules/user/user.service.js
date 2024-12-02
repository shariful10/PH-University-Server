"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const config_1 = __importDefault(require("../../config"));
const academicSemester_model_1 = require("../academicSemester/academicSemester.model");
const student_model_1 = require("../student/student.model");
const user_model_1 = require("./user.model");
const user_utils_1 = require("./user.utils");
const createStudentIntoDB = (password, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Create a user object
    const userData = {};
    // If password is not provided use the default password
    userData.password = password || config_1.default.defaultPassword;
    // Set user role
    userData.role = "student";
    // Find academic semester info
    const admissionSemester = yield academicSemester_model_1.AcademicSemester.findById(payload.admissionSemester);
    // Set generated id
    userData.id = yield (0, user_utils_1.generateStudentId)(admissionSemester);
    // Create a user
    const newUser = yield user_model_1.User.create(userData);
    // Create a student
    if (Object.keys(newUser).length) {
        // Set id, _id as user
        payload.id = newUser.id;
        payload.user = newUser._id;
        const newStudent = student_model_1.Student.create(payload);
        return newStudent;
    }
});
exports.UserServices = {
    createStudentIntoDB,
};
