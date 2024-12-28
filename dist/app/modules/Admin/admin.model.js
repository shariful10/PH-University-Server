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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const mongoose_1 = require("mongoose");
const admin_constant_1 = require("./admin.constant");
const userNameSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    middleName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
        required: true,
    },
});
const adminSchema = new mongoose_1.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: "User",
    },
    designation: {
        type: String,
        required: true,
    },
    name: {
        type: userNameSchema,
        required: true,
    },
    gender: {
        type: String,
        enum: {
            values: admin_constant_1.Gender,
            message: "{VALUE} is not a valid gender",
        },
        required: true,
    },
    dateOfBirth: { type: Date },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    contactNo: { type: String, required: [true, "Contact number is required"] },
    emergencyContactNo: {
        type: String,
        required: true,
    },
    bloodGroup: {
        type: String,
        enum: {
            values: admin_constant_1.BloodGroup,
            message: "{VALUE} is not a valid blood group",
        },
    },
    presentAddress: {
        type: String,
        required: true,
    },
    permanentAddress: {
        type: String,
        required: true,
    },
    profileImg: { type: String, default: "" },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    toJSON: {
        virtuals: true,
    },
});
// Generating full name
adminSchema.virtual("fullName").get(function () {
    var _a, _b, _c;
    return `${(_a = this === null || this === void 0 ? void 0 : this.name) === null || _a === void 0 ? void 0 : _a.firstName} ${(_b = this === null || this === void 0 ? void 0 : this.name) === null || _b === void 0 ? void 0 : _b.middleName} ${(_c = this === null || this === void 0 ? void 0 : this.name) === null || _c === void 0 ? void 0 : _c.lastName}`;
});
// Filter out deleted documents
adminSchema.pre("find", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
adminSchema.pre("findOne", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
adminSchema.pre("aggregate", function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});
// Checking if user is already exist!
adminSchema.statics.isUserExists = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingUser = yield exports.Admin.findOne({ id });
        return existingUser;
    });
};
exports.Admin = (0, mongoose_1.model)("Admin", adminSchema);
