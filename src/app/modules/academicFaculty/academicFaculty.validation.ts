import { z } from "zod";

const createFacultyValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Faculty name is required",
      invalid_type_error: "Faculty name must be a string",
    }),
  }),
});

const updateFacultyValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Faculty name is required",
      invalid_type_error: "Faculty name must be a string",
    }),
  }),
});

export const AcademicFacultyValidation = {
  createFacultyValidationSchema,
  updateFacultyValidationSchema,
};
