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

const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body;

  await AuthServices.changePassword(req.user, passwordData);

  sendResponse(res, {
    message: "Password is updated successfully!",
    data: null,
  });
});

export const AuthControllers = {
  loginUser,
  changePassword,
};
