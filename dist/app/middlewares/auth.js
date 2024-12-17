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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.default)((req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.headers.authorization;
        // If the token send from the client
        if (!token) {
            throw new AppError_1.default(401, "You are not authorized");
        }
        // Check if the token is valid
        jsonwebtoken_1.default.verify(token, config_1.default.jwtAccessSecret, function (err, decoded) {
            if (err) {
                throw new AppError_1.default(401, "You are not authorized");
            }
            const role = decoded === null || decoded === void 0 ? void 0 : decoded.role;
            if (requiredRoles && !requiredRoles.includes(role)) {
                throw new AppError_1.default(401, "You are not authorized");
            }
            req.user = decoded;
            next();
        });
    }));
};
exports.default = auth;
