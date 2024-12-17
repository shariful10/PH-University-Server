import { z } from "zod";
import { SemesterRegistrationStatus } from "./semesterRegistration.constant";

const createSemesterRegistrationValidationSchema = z.object({
  body: z.object({
    academicSemester: z.string({
      required_error: "Academic Semester is required",
    }),
    status: z.enum([...(SemesterRegistrationStatus as [string, ...string[]])]),
    startDate: z
      .string({
        required_error: "Start date is required",
        invalid_type_error: "Start date must be in a date formate",
      })
      .datetime(),
    endDate: z
      .string({
        required_error: "End date is required",
        invalid_type_error: "End date must be in a date formate",
      })
      .datetime(),
    minCredit: z.number({ invalid_type_error: "Min credit must be a number" }),
    maxCredit: z.number({ invalid_type_error: "Max credit must be a number" }),
  }),
});

const updateSemesterRegistrationValidationSchema = z.object({
  body: z.object({
    academicSemester: z.string().optional(),
    status: z
      .enum([...(SemesterRegistrationStatus as [string, ...string[]])])
      .optional(),
    startDate: z
      .string({
        invalid_type_error: "Start date must be in a date formate",
      })
      .datetime()
      .optional(),
    endDate: z
      .string({
        invalid_type_error: "End date must be in a date formate",
      })
      .datetime()
      .optional(),
    minCredit: z
      .number({ invalid_type_error: "Min credit must be a number" })
      .optional(),
    maxCredit: z
      .number({ invalid_type_error: "Max credit must be a number" })
      .optional(),
  }),
});

export const SemesterRegistrationValidations = {
  createSemesterRegistrationValidationSchema,
  updateSemesterRegistrationValidationSchema,
};
