import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import AppError from "../../errors/AppError";
import { httpStatusCode } from "../../utils/httpStatusCode";
import { sendEmail } from "../../utils/sendEmail";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import { createToken } from "./auth.utils";

const loginUser = async (payload: TLoginUser) => {
  const user = await User.isUserExistsByCustomId(payload?.id);

  // Checking if the user is exist
  if (!user) {
    throw new AppError(httpStatusCode.NOT_FOUND, "User not found!");
  }

  // Checking if the user already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(
      httpStatusCode.FORBIDDEN,
      "This user is already deleted!",
    );
  }

  // Checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === "blocked") {
    throw new AppError(httpStatusCode.FORBIDDEN, "This user is blocked!");
  }

  // Checking if the password is correct
  if (!(await User.isPasswordMatched(payload?.password, user.password))) {
    // Access granted: Send Access token & Refresh token
    throw new AppError(httpStatusCode.FORBIDDEN, "Password is incorrect!");
  }

  // Create token and send it to the client
  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwtAccessSecret as string,
    config.jwtAccessExpiresIn as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwtRefreshSecret as string,
    config.jwtRefreshExpiresIn as string,
  );

  return {
    accessToken,
    refreshToken,
    needsChangePassword: user?.needsChangePassword,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  // checking if the user is exist
  const user = await User.isUserExistsByCustomId(userData.userId);

  if (!user) {
    throw new AppError(httpStatusCode.NOT_FOUND, "This user is not found !");
  }
  // checking if the user is already deleted

  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatusCode.FORBIDDEN, "This user is deleted !");
  }

  // checking if the user is blocked

  const userStatus = user?.status;

  if (userStatus === "blocked") {
    throw new AppError(httpStatusCode.FORBIDDEN, "This user is blocked!");
  }

  //checking if the password is correct

  if (!(await User.isPasswordMatched(payload.oldPassword, user?.password)))
    throw new AppError(httpStatusCode.FORBIDDEN, "Password do not matched");

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcryptSaltRounds),
  );

  await User.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      needsChangePassword: false,
      passwordChangedAt: new Date(),
    },
  );

  return null;
};

const refreshToken = async (token: string) => {
  // Check if the token is valid
  const decoded = jwt.verify(
    token,
    config.jwtRefreshSecret as string,
  ) as JwtPayload;

  const { userId, iat } = decoded;

  const user = await User.isUserExistsByCustomId(userId);

  // Checking if the user is exist
  if (!user) {
    throw new AppError(httpStatusCode.NOT_FOUND, "User not found!");
  }

  // Checking if the user already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(
      httpStatusCode.FORBIDDEN,
      "This user is already deleted!",
    );
  }

  // Checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === "blocked") {
    throw new AppError(httpStatusCode.FORBIDDEN, "This user is blocked!");
  }

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(httpStatusCode.UNAUTHORIZE, "You are not authorized");
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwtAccessSecret as string,
    config.jwtAccessExpiresIn as string,
  );

  return {
    accessToken,
  };
};

const forgetPassword = async (userId: string) => {
  const user = await User.isUserExistsByCustomId(userId);

  // Checking if the user is exist
  if (!user) {
    throw new AppError(httpStatusCode.NOT_FOUND, "User not found!");
  }

  // Checking if the user already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(
      httpStatusCode.FORBIDDEN,
      "This user is already deleted!",
    );
  }

  // Checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === "blocked") {
    throw new AppError(httpStatusCode.FORBIDDEN, "This user is blocked!");
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwtAccessSecret as string,
    "10m",
  );

  const resetUILink = `${config.resetPassUILink}?id=${user.id}&token=${resetToken}`;

  sendEmail(user.email, resetUILink);
};

export const AuthServices = {
  loginUser,
  refreshToken,
  changePassword,
  forgetPassword,
};
