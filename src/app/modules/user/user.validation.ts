import { z } from "zod";

const createUserValidationSchema = z.object({
  password: z
    .string({
      invalid_type_error: "Password must be a string",
    })
    .max(20, "Password can not be more than 20 characters")
    .optional(),
});

export const UserValidations = {
  createUserValidationSchema,
};
