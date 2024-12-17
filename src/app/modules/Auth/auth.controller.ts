import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);
  // const { refreshToken, accessToken, needsPasswordChange } = result;

  // res.cookie("refreshToken", refreshToken, {
  //   secure: config.NODE_ENV === "production",
  //   httpOnly: true,
  // });

  sendResponse(res, {
    message: "User is logged in successfully!",
    data: {
      // accessToken,
      // needsPasswordChange,
      result,
    },
  });
});

export const AuthControllers = {
  loginUser,
};
