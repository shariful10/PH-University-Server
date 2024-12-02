import { z } from "zod";

const UserNameValidationSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(20, "First name can not be more than 20 characters")
    .trim(),
  middleName: z
    .string()
    .max(20, "Middle name can not be more than 20 characters")
    .trim()
    .optional(),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(20, "Last name can not be more than 20 characters")
    .trim(),
});

const LocalGuardianValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  occupation: z.string().min(1, "Occupation is required"),
  contactNo: z.string().min(1, "Contact number is required"),
  address: z.string().min(1, "Address is required"),
});

const GuardianValidationSchema = z.object({
  fatherName: z.string().min(1, "Father's name is required"),
  fatherContactNo: z.string().min(1, "Father's contact number is required"),
  fatherOccupation: z.string().min(1, "Father's occupation is required"),
  motherName: z.string().min(1, "Mother's name is required"),
  motherContactNo: z.string().min(1, "Mother's contact number is required"),
  motherOccupation: z.string().min(1, "Mother's occupation is required"),
});

const createStudentValidationSchema = z.object({
  body: z.object({
    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 characters long")
      .max(20, "Password can not be more than 20 characters"),
    student: z.object({
      name: UserNameValidationSchema,
      email: z.string().email("Invalid email address"),
      profileImg: z.string().optional(),
      gender: z.enum(["male", "female", "other"]),
      dateOfBirth: z.string().optional(),
      contactNo: z.string().min(1, "Contact number is required"),
      emergencyContactNo: z
        .string()
        .min(1, "Emergency contact number is required"),
      presentAddress: z.string().min(1, "Present address is required"),
      permanentAddress: z.string().min(1, "Permanent address is required"),
      guardian: GuardianValidationSchema,
      localGuardian: LocalGuardianValidationSchema,
      bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
      admissionSemester: z.string(),
    }),
  }),
});

export const StudentValidations = {
  createStudentValidationSchema,
};
