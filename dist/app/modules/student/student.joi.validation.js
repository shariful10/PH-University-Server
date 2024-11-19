"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const userNameSchema = joi_1.default.object({
    firstName: joi_1.default.string()
        .trim()
        .required()
        .custom((value, helpers) => {
        const capitalized = value.charAt(0).toUpperCase() + value.slice(1);
        if (value !== capitalized) {
            return helpers.error("any.custom", {
                message: "First name must be capitalized",
            });
        }
        return value;
    }),
    middleName: joi_1.default.string().trim().optional(),
    lastName: joi_1.default.string()
        .trim()
        .required()
        .pattern(/^[A-Za-z]+$/)
        .message("Last name must contain only alphabetic characters"),
});
const localGuardianSchema = joi_1.default.object({
    name: joi_1.default.string().trim().required(),
    occupation: joi_1.default.string().trim().required(),
    contactNo: joi_1.default.string()
        .trim()
        .pattern(/^\d+$/)
        .message("Contact number must be numeric")
        .required(),
    address: joi_1.default.string().trim().required(),
});
const guardianSchema = joi_1.default.object({
    fatherName: joi_1.default.string().trim().required(),
    fatherContactNo: joi_1.default.string()
        .trim()
        .pattern(/^\d+$/)
        .message("Father's contact number must be numeric")
        .required(),
    fatherOccupation: joi_1.default.string().trim().required(),
    motherName: joi_1.default.string().trim().required(),
    motherContactNo: joi_1.default.string()
        .trim()
        .pattern(/^\d+$/)
        .message("Mother's contact number must be numeric")
        .required(),
    motherOccupation: joi_1.default.string().trim().required(),
});
const studentValidationSchema = joi_1.default.object({
    id: joi_1.default.string().trim().required(),
    name: userNameSchema.required(),
    email: joi_1.default.string().email().required(),
    profileImg: joi_1.default.string().uri().optional(),
    gender: joi_1.default.string().valid("male", "female", "other").required(),
    dateOfBirth: joi_1.default.string().isoDate().optional(),
    contactNo: joi_1.default.string()
        .trim()
        .pattern(/^\d+$/)
        .message("Contact number must be numeric")
        .required(),
    emergencyContactNo: joi_1.default.string()
        .trim()
        .pattern(/^\d+$/)
        .message("Emergency contact number must be numeric")
        .required(),
    presentAddress: joi_1.default.string().trim().required(),
    permanentAddress: joi_1.default.string().trim().required(),
    guardian: guardianSchema.required(),
    localGuardian: localGuardianSchema.required(),
    bloodGroup: joi_1.default.string()
        .valid("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-")
        .required(),
    isActive: joi_1.default.string().valid("active", "blocked").default("active"),
});
exports.default = studentValidationSchema;
