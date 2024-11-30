"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidations = void 0;
const zod_1 = require("zod");
const createUserValidationSchema = zod_1.z.object({
    password: zod_1.z
        .string({
        invalid_type_error: "Password must be a string",
    })
        .max(20, "Password can not be more than 20 characters")
        .optional(),
});
exports.UserValidations = {
    createUserValidationSchema,
};
