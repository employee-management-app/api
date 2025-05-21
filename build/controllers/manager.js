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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateManager = exports.inviteManager = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendEmail_1 = require("../helpers/sendEmail");
const models_1 = require("../models");
const inviteManager = (req, res) => {
    var _a;
    const _b = req.body, { isOwner = false } = _b, body = __rest(_b, ["isOwner"]);
    const companyId = (_a = body.companyId) !== null && _a !== void 0 ? _a : res.locals.companyId;
    models_1.User.create(Object.assign(Object.assign({}, body), { companyId, role: isOwner ? 'owner' : 'manager' }))
        .then((data) => __awaiter(void 0, void 0, void 0, function* () {
        const token = jsonwebtoken_1.default.sign({ id: data._id, companyId }, process.env.JWT_SECRET, { expiresIn: '24h' });
        yield (0, sendEmail_1.sendEmail)({
            to: body.email,
            subject: 'Potwierdzenie założenia konta w aplikacji Technik w Terenie',
            html: `
          <p>Dzień dobry,</p>
          <p>założono dla Ciebie konto w aplikacji Technik w Terenie. Aby dokończyć proces rejestracji i ustalić hasło do Twojego konta kliknij w poniższy link: <br/>
            <a href="${process.env.CLIENT_URL}/invitation/${token}">${process.env.CLIENT_URL}/invitation/${token}</a>
          </p>
        `
        });
        res.send(data);
    }))
        .catch((error) => {
        if (error.code === 11000) {
            return res.status(400).send({ message: 'The user already exists' });
        }
        return res.status(500).send(error);
    });
};
exports.inviteManager = inviteManager;
const updateManager = (req, res) => {
    const _a = req.body, { isOwner } = _a, body = __rest(_a, ["isOwner"]);
    models_1.User.findByIdAndUpdate(req.params.id, Object.assign(Object.assign({}, body), { role: isOwner ? 'owner' : 'manager' }), { new: true }).exec((error, user) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.send(user);
    });
};
exports.updateManager = updateManager;
