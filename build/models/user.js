"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.User = mongoose_1.default.model('User', new mongoose_1.default.Schema({
    name: {
        type: String,
        maxLength: 75,
        required: true,
    },
    surname: {
        type: String,
        maxLength: 75,
        required: true,
    },
    phone: {
        type: String,
        maxLength: 20,
        required: true,
    },
    email: {
        type: String,
        maxLength: 125,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        enum: ['employee', 'manager', 'owner', 'admin'],
        default: 'employee',
        required: true,
    },
    registrationDate: {
        type: Date,
        default: Date.now,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
        required: true,
    },
    color: {
        type: String,
        default: '#FF0000',
        required: true,
    },
    companyId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        default: null,
        ref: 'Company',
    },
}));
