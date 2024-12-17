import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";

const loginUser = async (payload: TLoginUser) => {
  // Checking if the user is exist
  const isUserExist = await User.findOne({ id: payload?.id });

  if (!isUserExist) {
    throw new AppError(404, "User not found!");
  }

  // Checking if the user already deleted
  const isDeleted = isUserExist?.isDeleted;

  if (isDeleted) {
    throw new AppError(403, "This user is already deleted!");
  }

  // Checking if the user is blocked
  const userStatus = isUserExist?.status;

  if (userStatus === "blocked") {
    throw new AppError(403, "This user is blocked!");
  }

  // Access granted: Send Access token & Refresh token

  return {};
};

export const AuthServices = {
  loginUser,
};
