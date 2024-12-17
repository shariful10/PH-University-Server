import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";

const loginUser = async (payload: TLoginUser) => {
  const user = await User.isUserExistsByCustomId(payload?.id);

  // Checking if the user is exist
  if (!user) {
    throw new AppError(404, "User not found!");
  }

  // Checking if the user already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(403, "This user is already deleted!");
  }

  // Checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === "blocked") {
    throw new AppError(403, "This user is blocked!");
  }

  // Checking if the password is correct
  if (!(await User.isPasswordMatched(payload?.password, user.password))) {
    throw new AppError(403, "Password is incorrect!");
  }

  // Access granted: Send Access token & Refresh token

  return {};
};

export const AuthServices = {
  loginUser,
};
