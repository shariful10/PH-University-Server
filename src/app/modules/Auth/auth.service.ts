import bcrypt from "bcrypt";
import { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import AppError from "../../errors/AppError";
import { httpStatusCode } from "../../utils/httpStatusCode";
import { sendEmail } from "../../utils/sendEmail";
import { validateUser } from "../../utils/validateUser";
import { User } from "../user/user.model";
import { TLoginUser, TResetPassword } from "./auth.interface";
import { createToken, verifyToken } from "./auth.utils";

const loginUser = async (payload: TLoginUser) => {
  const user = await validateUser(payload?.id);

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

  // Hash new password
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
  const decoded = verifyToken(token, config.jwtRefreshSecret as string);

  const { userId, iat } = decoded;

  const user = await validateUser(userId);

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
  const user = await validateUser(userId);

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

const resetPassword = async (payload: TResetPassword, token: string) => {
  const user = await validateUser(payload.id);

  // Check if the token is valid
  const decoded = verifyToken(token, config.jwtAccessSecret as string);

  if (user.id !== decoded.userId) {
    throw new AppError(httpStatusCode.FORBIDDEN, "You are not forbidden!");
  }

  // Hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcryptSaltRounds),
  );

  await User.findOneAndUpdate(
    {
      id: decoded.userId,
      role: decoded.role,
    },
    {
      password: newHashedPassword,
      needsChangePassword: false,
      passwordChangedAt: new Date(),
    },
  );
};

export const AuthServices = {
  loginUser,
  refreshToken,
  changePassword,
  forgetPassword,
  resetPassword,
};
