import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import AppError from "../errors/AppError";
import catchAsync from "../utils/catchAsync";

const auth = () => {
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

        req.user = decoded as JwtPayload;

        next();
      },
    );
  });
};

export default auth;
