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
exports.changePassword = exports.resetPassword = exports.getCurrentUser = exports.acceptInvitation = exports.signIn = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendEmail_1 = require("../helpers/sendEmail");
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
const resetPassword = (req, res) => {
    const { email } = req.body;
    models_1.User.findOne({ email })
        .then((user) => {
        if (!user) {
            return res.status(404).send({ message: 'User not found, check the entered data again!' });
        }
        if (!user.isActive) {
            return res.status(403).send({ message: 'Your account has been deactivated!' });
        }
        if (!user.isVerified) {
            return res.status(403).send({ message: 'Your account is inactive, confirm your email!' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: 86400 });
        const link = `${process.env.CLIENT_URL}/change-password?token=${token}`;
        (0, sendEmail_1.sendEmail)({
            to: email,
            subject: 'Reset hasła w aplikacji Technik w Terenie',
            html: `
          <p>Dzień dobry,</p>
          <p>otrzymaliśmy prośbę o zresetowanie Twojego hasła w aplikacji Technik w Terenie.</p>
          <p>Wszystkie hasła w naszej bazie przetrzymywane są w postaci zaszyfrowanej dlatego poniżej przesyłamy Ci link umożliwiający jego zmianę:<br/>
            <a href="${link}">${link}</a>
          </p>
        `,
        })
            .then(() => {
            res.send({ message: 'Check your email to reset the password' });
        })
            .catch((error) => {
            res.status(500).send(error);
        });
    })
        .catch((error) => {
        res.status(500).send(error);
    });
};
exports.resetPassword = resetPassword;
const changePassword = (req, res) => {
    const { token, password } = req.body;
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (error, payload) => {
        if (error) {
            return res.status(400).send({ message: 'The activation link is invalid or expired' });
        }
        models_1.User.findById(payload.id)
            .then((user) => __awaiter(void 0, void 0, void 0, function* () {
            if (!user) {
                return res.status(404).send({ message: 'Account with this email is not found' });
            }
            user.set('password', bcryptjs_1.default.hashSync(password, 8));
            yield user.save();
            (0, sendEmail_1.sendEmail)({
                to: user.email,
                subject: 'Hasło zostało zmienione w aplikacji Technik w Terenie',
                html: '<p>Twoje hasło zostało zmienione. Możesz się zalogować za pomocą nowego hasła.</p>',
            })
                .then(() => {
                res.send(user.toJSON());
            })
                .catch((error) => {
                res.status(500).send(error);
            });
        }))
            .catch((error) => {
            res.status(500).send(error);
        });
    });
};
exports.changePassword = changePassword;
