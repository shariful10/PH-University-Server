import Joi from "joi";

const userNameSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .required()
    .custom((value, helpers) => {
      const capitalized = value.charAt(0).toUpperCase() + value.slice(1);
      if (value !== capitalized) {
        return helpers.error("any.custom", {
          message: "First name must be capitalized",
        });
      }
      return value;
    }),
  middleName: Joi.string().trim().optional(),
  lastName: Joi.string()
    .trim()
    .required()
    .pattern(/^[A-Za-z]+$/)
    .message("Last name must contain only alphabetic characters"),
});

const localGuardianSchema = Joi.object({
  name: Joi.string().trim().required(),
  occupation: Joi.string().trim().required(),
  contactNo: Joi.string()
    .trim()
    .pattern(/^\d+$/)
    .message("Contact number must be numeric")
    .required(),
  address: Joi.string().trim().required(),
});

const guardianSchema = Joi.object({
  fatherName: Joi.string().trim().required(),
  fatherContactNo: Joi.string()
    .trim()
    .pattern(/^\d+$/)
    .message("Father's contact number must be numeric")
    .required(),
  fatherOccupation: Joi.string().trim().required(),
  motherName: Joi.string().trim().required(),
  motherContactNo: Joi.string()
    .trim()
    .pattern(/^\d+$/)
    .message("Mother's contact number must be numeric")
    .required(),
  motherOccupation: Joi.string().trim().required(),
});

const studentValidationSchema = Joi.object({
  id: Joi.string().trim().required(),
  name: userNameSchema.required(),
  email: Joi.string().email().required(),
  profileImg: Joi.string().uri().optional(),
  gender: Joi.string().valid("male", "female", "other").required(),
  dateOfBirth: Joi.string().isoDate().optional(),
  contactNo: Joi.string()
    .trim()
    .pattern(/^\d+$/)
    .message("Contact number must be numeric")
    .required(),
  emergencyContactNo: Joi.string()
    .trim()
    .pattern(/^\d+$/)
    .message("Emergency contact number must be numeric")
    .required(),
  presentAddress: Joi.string().trim().required(),
  permanentAddress: Joi.string().trim().required(),
  guardian: guardianSchema.required(),
  localGuardian: localGuardianSchema.required(),
  bloodGroup: Joi.string()
    .valid("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-")
    .required(),
  isActive: Joi.string().valid("active", "blocked").default("active"),
});

export default studentValidationSchema;
