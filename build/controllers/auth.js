"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.acceptInvitation = exports.signIn = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
const company_1 = require("../models/company");
const signIn = (req, res) => {
    models_1.User.findOne({ email: req.body.email }).exec((error, user) => {
        if (error) {
            return res.status(500).send(error);
        }
        if (!user) {
            return res.status(404).send({ message: 'User not found, check the entered data again!' });
        }
        if (!user.isActive) {
            return res.status(403).send({ message: 'Your account has been deactivated!' });
        }
        if (!user.isVerified) {
            return res.status(403).send({ message: 'Your account is inactive, confirm your email!' });
        }
        const isPasswordValid = bcryptjs_1.default.compareSync(req.body.password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send({ message: 'Provided password is not correct!' });
        }
        res.status(200).send({ user, token: jsonwebtoken_1.default.sign({ id: user._id, companyId: user.companyId }, process.env.JWT_SECRET) });
    });
};
exports.signIn = signIn;
const acceptInvitation = (req, res) => {
    jsonwebtoken_1.default.verify(req.body.token, process.env.JWT_SECRET, (error, payload) => {
        if (error) {
            return res.status(403).send({ message: 'Your invitation link has expired, please contact your manager.' });
        }
        models_1.User.findById(payload.id).exec((error, user) => {
            if (error || !user) {
                return res.status(500).send(error);
            }
            if (!user.isActive) {
                return res.status(403).send({ message: 'Your account has been deactivated!' });
            }
            user.set('isVerified', true);
            user.set('password', bcryptjs_1.default.hashSync(req.body.password, 8));
            user.save((error) => {
                if (error) {
                    return res.status(500).send(error);
                }
                res.send({ message: 'User has been verified' });
            });
        });
    });
};
exports.acceptInvitation = acceptInvitation;
const getCurrentUser = (req, res) => {
    const { user, companyId } = res.locals;
    company_1.Company.findById(companyId)
        .then((company) => {
        res.send({ company, user });
    })
        .catch((error) => {
        res.status(500).send(error);
    });
};
exports.getCurrentUser = getCurrentUser;
