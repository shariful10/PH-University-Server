import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import AppError from "../errors/AppError";
import { TUserRole } from "../modules/user/user.interface";
import catchAsync from "../utils/catchAsync";

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req, _res, next) => {
    const token = req.headers.authorization;

    // If the token send from the client
    if (!token) {
      throw new AppError(401, "You are not authorized");
    }

    // Check if the token is valid
    jwt.verify(
      token,
      config.jwtAccessSecret as string,
      function (err, decoded) {
        if (err) {
          throw new AppError(401, "You are not authorized");
        }

        const role = (decoded as JwtPayload)?.role;

        if (requiredRoles && !requiredRoles.includes(role)) {
          throw new AppError(401, "You are not authorized");
        }

        req.user = decoded as JwtPayload;

        next();
      },
    );
  });
};

export default auth;
