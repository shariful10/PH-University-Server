import config from "../../config";
import { TStudent } from "../student/student.interface";
import { Student } from "../student/student.model";
import { TUser } from "./user.interface";
import { User } from "./user.model";

const createStudentIntoDB = async (password: string, studentData: TStudent) => {
  // Create a user object
  const userData: Partial<TUser> = {};

  // If password is not provided use the default password
  userData.password = password || (config.defaultPassword as string);

  // Set user role
  userData.role = "student";

  // Set manually generated id
  userData.id = "2024100001";

  // Create a user
  const newUser = await User.create(userData);

  // Create a student
  if (Object.keys(newUser).length) {
    // Set id, _id as user
    studentData.id = newUser.id;
    studentData.user = newUser._id;

    const newStudent = Student.create(studentData);
    return newStudent;
  }
};

export const UserServices = {
  createStudentIntoDB,
};
