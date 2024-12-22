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
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const academicDepartment_model_1 = require("../academicDepartment/academicDepartment.model");
const academicSemester_model_1 = require("../academicSemester/academicSemester.model");
const admin_model_1 = require("../Admin/admin.model");
const faculty_model_1 = require("../Faculty/faculty.model");
const student_model_1 = require("../student/student.model");
const user_model_1 = require("./user.model");
const user_utils_1 = require("./user.utils");
const httpStatusCode_1 = require("../../utils/httpStatusCode");
const createStudentIntoDB = (password, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Create a user object
    const userData = {};
    // If password is not provided use the default password
    userData.password = password || config_1.default.defaultPassword;
    // Set Student role & email
    userData.role = "student";
    userData.email = payload.email;
    // Find academic semester info
    const admissionSemester = yield academicSemester_model_1.AcademicSemester.findById(payload.admissionSemester);
    if (!admissionSemester) {
        throw new AppError_1.default(httpStatusCode_1.httpStatusCode.BAD_REQUEST, "Admission semester not found");
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // Set generated id
        userData.id = yield (0, user_utils_1.generateStudentId)(admissionSemester);
        // Create a user
        const newUser = yield user_model_1.User.create([userData], { session });
        if (!newUser.length) {
            throw new AppError_1.default(httpStatusCode_1.httpStatusCode.BAD_REQUEST, "Failed to create user!");
        }
        // Create a student
        if (newUser.length) {
            // Set id, _id as user
            payload.id = newUser[0].id;
            payload.user = newUser[0]._id;
            const newStudent = yield student_model_1.Student.create([payload], { session });
            if (!newStudent.length) {
                throw new AppError_1.default(httpStatusCode_1.httpStatusCode.BAD_REQUEST, "Failed to create student!");
            }
            yield session.commitTransaction();
            yield session.endSession();
            return newStudent;
        }
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new AppError_1.default(httpStatusCode_1.httpStatusCode.INTERNAL_SERVER_ERROR, err instanceof Error ? err.message : "Something went wrong!");
    }
});
const createFacultyIntoDB = (password, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Create a user object
    const userData = {};
    // If password is not given , use default password
    userData.password = password || config_1.default.defaultPassword;
    // Set faculty role & email
    userData.role = "faculty";
    userData.email = payload.email;
    // Find academic department info
    const academicDepartment = yield academicDepartment_model_1.AcademicDepartment.findById(payload.academicDepartment);
    if (!academicDepartment) {
        throw new AppError_1.default(httpStatusCode_1.httpStatusCode.BAD_REQUEST, "Academic department not found");
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // Set generated id
        userData.id = yield (0, user_utils_1.generateFacultyId)();
        // Create a user (transaction-1)
        const newUser = yield user_model_1.User.create([userData], { session }); // array
        //create a faculty
        if (!newUser.length) {
            throw new AppError_1.default(httpStatusCode_1.httpStatusCode.BAD_REQUEST, "Failed to create user");
        }
        // Set id , _id as user
        payload.id = newUser[0].id;
        payload.user = newUser[0]._id; //reference _id
        // Create a faculty (transaction-2)
        const newFaculty = yield faculty_model_1.Faculty.create([payload], { session });
        if (!newFaculty.length) {
            throw new AppError_1.default(httpStatusCode_1.httpStatusCode.BAD_REQUEST, "Failed to create faculty");
        }
        yield session.commitTransaction();
        yield session.endSession();
        return newFaculty;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new AppError_1.default(httpStatusCode_1.httpStatusCode.INTERNAL_SERVER_ERROR, err instanceof Error ? err.message : "Something went wrong!");
    }
});
const createAdminIntoDB = (password, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Create a user object
    const userData = {};
    // If password is not given , use default password
    userData.password = password || config_1.default.defaultPassword;
    // Set admin role & email
    userData.role = "admin";
    userData.email = payload.email;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        //set  generated id
        userData.id = yield (0, user_utils_1.generateAdminId)();
        // Create a user (transaction-1)
        const newUser = yield user_model_1.User.create([userData], { session });
        // Create a admin
        if (!newUser.length) {
            throw new AppError_1.default(httpStatusCode_1.httpStatusCode.BAD_REQUEST, "Failed to create admin");
        }
        // Set id , _id as user
        payload.id = newUser[0].id;
        payload.user = newUser[0]._id; // Reference _id
        // Create a admin (transaction-2)
        const newAdmin = yield admin_model_1.Admin.create([payload], { session });
        if (!newAdmin.length) {
            throw new AppError_1.default(httpStatusCode_1.httpStatusCode.BAD_REQUEST, "Failed to create admin");
        }
        yield session.commitTransaction();
        yield session.endSession();
        return newAdmin;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new AppError_1.default(httpStatusCode_1.httpStatusCode.INTERNAL_SERVER_ERROR, err instanceof Error ? err.message : "Something went wrong!");
    }
});
exports.UserServices = {
    createStudentIntoDB,
    createFacultyIntoDB,
    createAdminIntoDB,
};
