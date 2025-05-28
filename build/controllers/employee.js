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
exports.updateEmployee = exports.inviteEmployee = exports.getEmployeeSlots = exports.getEmployeeOrders = void 0;
const date_fns_1 = require("date-fns");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendEmail_1 = require("../helpers/sendEmail");
const stringToDate_1 = require("../helpers/stringToDate");
const models_1 = require("../models");
const DAY = 60 * 60 * 24 * 1000;
const getEmployeeOrders = (req, res) => {
    var _a, _b, _c;
    const sortBy = ((_a = req.query.sortBy) !== null && _a !== void 0 ? _a : 'creationDate');
    const orderBy = req.query.orderBy === 'asc' ? 1 : -1;
    const { search, status, scheduledOnly } = req.query;
    const startDate = (0, stringToDate_1.stringToDate)(req.query.startDate);
    const endDate = (0, stringToDate_1.stringToDate)(req.query.endDate);
    const stage = req.query.stage ? [req.query.stage].flat() : null;
    const priority = req.query.priority ? [req.query.priority].flat() : null;
    const type = req.query.type ? [req.query.type].flat() : null;
    const returnScheduledOnly = !!scheduledOnly;
    const query = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ assignedEmployee: req.params.id }, (status ? { status } : { status: { $ne: 'completed' } })), (returnScheduledOnly && { startDate: { $ne: null } })), (startDate && {
        startDate: {
            $gte: startDate,
            $lt: new Date((endDate !== null && endDate !== void 0 ? endDate : startDate).getTime() + DAY),
        },
    })), (stage && { stage: { $in: stage } })), (priority && { priority: { $in: priority } })), (type && { type: { $in: type } })), (search && {
        $text: {
            $search: search,
        },
    }));
    const sorting = {
        [sortBy]: orderBy,
    };
    const limit = Number((_b = req.query.limit) !== null && _b !== void 0 ? _b : Number.POSITIVE_INFINITY);
    const offset = Number((_c = req.query.offset) !== null && _c !== void 0 ? _c : 0);
    models_1.Order.find(query).sort(sorting).limit(limit).skip(offset).populate('assignedEmployee').exec((error, orders) => {
        if (error) {
            return res.status(500).send(error);
        }
        models_1.Order.count(query, (_, total) => {
            res.send({ orders, total });
        });
    });
};
exports.getEmployeeOrders = getEmployeeOrders;
const getEmployeeSlots = (req, res) => {
    const query = Object.assign({ assignedEmployee: req.params.id }, (req.query.startDate && {
        startDate: {
            $gte: (0, date_fns_1.startOfDay)(new Date(req.query.startDate)),
            $lte: (0, date_fns_1.endOfDay)(new Date((req.query.endDate || req.query.startDate))),
        },
    }));
    models_1.Order.find(query).exec((error, orders) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.send(orders.map(({ _id, startDate, endDate, address, priority, status }) => ({
            _id,
            startDate,
            status,
            endDate,
            address,
            priority,
        })));
    });
};
exports.getEmployeeSlots = getEmployeeSlots;
const inviteEmployee = (req, res) => {
    var _a;
    const companyId = (_a = req.body.companyId) !== null && _a !== void 0 ? _a : res.locals.companyId;
    models_1.User.create(Object.assign(Object.assign({}, req.body), { companyId }))
        .then((data) => __awaiter(void 0, void 0, void 0, function* () {
        const token = jsonwebtoken_1.default.sign({ id: data._id, companyId }, process.env.JWT_SECRET, { expiresIn: '24h' });
        yield (0, sendEmail_1.sendEmail)({
            to: req.body.email,
            subject: 'Potwierdzenie założenia konta w aplikacji Technik w Terenie',
            html: `
          <p>Dzień dobry,</p>
          <p>założono dla Ciebie konto w aplikacji Technik w Terenie. Aby dokończyć proces rejestracji i ustalić hasło do Twojego konta kliknij w poniższy link:<br/>
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
exports.inviteEmployee = inviteEmployee;
const updateEmployee = (req, res) => {
    models_1.User.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec((error, user) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.send(user);
    });
};
exports.updateEmployee = updateEmployee;
