"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
const verifyToken = (req, res, next) => {
    var _a;
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.replace('Token ', '');
    if (!token) {
        return res.status(403).send({ message: 'No token provided!' });
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (error, payload) => {
        if (error) {
            return res.status(401).send({ message: 'Unathorized!' });
        }
        const { id: userId, companyId } = payload;
        models_1.User.findById(userId).exec((error, user) => {
            if (error) {
                return res.status(500).send(error);
            }
            if (!(user === null || user === void 0 ? void 0 : user.isActive) || !user.isVerified) {
                return res.status(403).send({ message: 'Your account is inactive' });
            }
            res.locals.user = user;
            res.locals.companyId = companyId;
            next();
        });
    });
};
exports.verifyToken = verifyToken;
