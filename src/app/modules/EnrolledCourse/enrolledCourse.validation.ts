import { z } from "zod";

const createEnrolledCourseValidationZodSchema = z.object({
  body: z.object({
    offeredCourse: z.string({
      required_error: "Offered Course is required",
      invalid_type_error: "Offered Course must be a string",
    }),
  }),
});

const updateEnrolledCourseMarksValidationZodSchema = z.object({
  body: z.object({
    semesterRegistration: z.string({
      invalid_type_error: "Semester Registration must be a string",
    }),
    offeredCourse: z.string({
      invalid_type_error: "Offered Course must be a string",
    }),
    student: z.string(),
    courseMarks: z.object({
      classTest1: z.number().optional(),
      midTerm: z.number().optional(),
      classTest2: z.number().optional(),
      finalTerm: z.number().optional(),
    }),
  }),
});

export const EnrolledCourseValidations = {
  createEnrolledCourseValidationZodSchema,
  updateEnrolledCourseMarksValidationZodSchema,
};
