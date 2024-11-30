"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicSemesterValidation = void 0;
const zod_1 = require("zod");
const academicSemester_const_1 = require("./academicSemester.const");
const createAcademicSemesterValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.enum([...academicSemester_const_1.AcademicSemesterName]),
        code: zod_1.z.enum([...academicSemester_const_1.AcademicSemesterCode]),
        year: zod_1.z.date(),
        startMonth: zod_1.z.enum([...academicSemester_const_1.Months]),
        endMonth: zod_1.z.enum([...academicSemester_const_1.Months]),
    }),
});
exports.AcademicSemesterValidation = {
    createAcademicSemesterValidationSchema,
};
