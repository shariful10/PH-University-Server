import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import AppError from "../errors/AppError";
import { TUserRole } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import catchAsync from "../utils/catchAsync";
import { httpStatusCode } from "../utils/httpStatusCode";

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req, _res, next) => {
    const token = req.headers.authorization;

    // If the token send from the client
    if (!token) {
      throw new AppError(httpStatusCode.UNAUTHORIZE, "You are not authorized");
    }

    // Check if the token is valid
    const decoded = jwt.verify(
      token,
      config.jwtAccessSecret as string,
    ) as JwtPayload;

    const { role, userId, iat } = decoded;

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
      User.isJWTIssuedBeforePasswordChanged(
        user.passwordChangedAt,
        iat as number,
      )
    ) {
      throw new AppError(httpStatusCode.UNAUTHORIZE, "You are not authorized");
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatusCode.UNAUTHORIZE, "You are not authorized");
    }

    req.user = decoded as JwtPayload;

    next();
  });
};

export default auth;
