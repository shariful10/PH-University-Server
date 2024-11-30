"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicSemester = void 0;
const mongoose_1 = require("mongoose");
const academicSemester_const_1 = require("./academicSemester.const");
const academicSemesterSchema = new mongoose_1.Schema({
    name: { type: String, enum: academicSemester_const_1.AcademicSemesterName, required: true },
    code: { type: String, enum: academicSemester_const_1.AcademicSemesterCode, required: true },
    year: { type: Date, required: true },
    startMonth: { type: String, enum: academicSemester_const_1.Months, required: true },
    endMonth: { type: String, enum: academicSemester_const_1.Months, required: true },
});
exports.AcademicSemester = (0, mongoose_1.model)("AcademicSemester", academicSemesterSchema);
