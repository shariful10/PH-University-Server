"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("../user/user.model");
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Checking if the user is exist
    const isUserExist = yield user_model_1.User.findOne({ id: payload === null || payload === void 0 ? void 0 : payload.id });
    if (!isUserExist) {
        throw new AppError_1.default(404, "User not found!");
    }
    // Checking if the user already deleted
    const isDeleted = isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.isDeleted;
    if (isDeleted) {
        throw new AppError_1.default(403, "This user is already deleted!");
    }
    // Checking if the user is blocked
    const userStatus = isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.status;
    if (userStatus === "blocked") {
        throw new AppError_1.default(403, "This user is blocked!");
    }
    // Access granted: Send Access token & Refresh token
    return {};
});
exports.AuthServices = {
    loginUser,
};
