import { z } from "zod";

const preRequisiteCoursesSchema = z.object({
  course: z.string({
    required_error: "Course is required",
    invalid_type_error: "Course must be a string",
  }),
  isDeleted: z.boolean().optional().default(false),
});

export const createCourseValidationSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title must be a string",
    })
    .min(1, "Title cannot be empty"),
  prefix: z.string({
    required_error: "Prefix is required",
    invalid_type_error: "Prefix must be a string",
  }),
  code: z
    .number({
      required_error: "Code is required",
      invalid_type_error: "Code must be a number",
    })
    .int("Code must be an integer")
    .nonnegative("Code must be non-negative"),
  credits: z
    .number({
      required_error: "Credits is required",
      invalid_type_error: "Credits must be a number",
    })
    .int("Credits must be an integer")
    .positive("Credits must be a positive value"),
  preRequisiteCourses: z.array(preRequisiteCoursesSchema, {
    required_error: "Pre-requisite courses is required",
    invalid_type_error: "Pre-requisite courses must be an array",
  }),
});

export const CourseValidations = {
  createCourseValidationSchema,
};
