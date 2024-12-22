import AppError from "../errors/AppError";
import { User } from "../modules/user/user.model";
import { httpStatusCode } from "./httpStatusCode";

export const validateUser = async (userId: string) => {
  const user = await User.isUserExistsByCustomId(userId);

  // Checking if the user exists
  if (!user) {
    throw new AppError(httpStatusCode.NOT_FOUND, "User not found!");
  }

  // Checking if the user is already deleted
  if (user.isDeleted) {
    throw new AppError(
      httpStatusCode.FORBIDDEN,
      "This user is already deleted!",
    );
  }

  // Checking if the user is blocked
  if (user.status === "blocked") {
    throw new AppError(httpStatusCode.FORBIDDEN, "This user is blocked!");
  }

  return user;
};
