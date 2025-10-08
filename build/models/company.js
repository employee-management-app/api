"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Company = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.Company = mongoose_1.default.model('Company', new mongoose_1.default.Schema({
    name: {
        type: String,
        maxLength: 75,
        required: true,
    },
    logo: {
        type: String,
        required: false,
    },
    canAddImages: {
        type: Boolean,
        default: true,
    },
    requiredFields: {
        type: [String],
        default: ['type', 'stage', 'address', 'phone'],
    },
}));
