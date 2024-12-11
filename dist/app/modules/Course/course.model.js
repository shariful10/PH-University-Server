"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course = void 0;
const mongoose_1 = require("mongoose");
const preRequisiteCourses = new mongoose_1.Schema({
    course: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Course",
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
});
const courseSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    prefix: {
        type: String,
        trim: true,
        required: true,
    },
    code: {
        type: Number,
        trim: true,
        required: true,
    },
    credits: {
        type: Number,
        trim: true,
        required: true,
    },
    preRequisiteCourses: [preRequisiteCourses],
}, { timestamps: true });
exports.Course = (0, mongoose_1.model)("Course", courseSchema);
