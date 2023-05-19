"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSlots = exports.getOrders = void 0;
const date_fns_1 = require("date-fns");
const sortNotCompletedOrders_1 = require("../helpers/sortNotCompletedOrders");
const stringToDate_1 = require("../helpers/stringToDate");
const models_1 = require("../models");
const DAY = 60 * 60 * 24 * 1000;
const getOrders = (req, res) => {
    var _a, _b;
    const { search, status, unscheduled, unassigned } = req.query;
    const startDate = (0, stringToDate_1.stringToDate)(req.query.startDate);
    const endDate = (0, stringToDate_1.stringToDate)(req.query.endDate);
    const employee = req.query.employee ? [req.query.employee].flat() : null;
    const stage = req.query.stage ? [req.query.stage].flat() : null;
    const priority = req.query.priority ? [req.query.priority].flat() : null;
    const type = req.query.type ? [req.query.type].flat() : null;
    const returnUnassigned = unassigned ? unassigned === 'true' : false;
    const returnUnscheduled = unscheduled ? unscheduled === 'true' : false;
    const defaultQuery = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (!returnUnassigned && { assignedEmployee: { $ne: null } })), (employee && { assignedEmployee: employee })), (employee && returnUnassigned && { assignedEmployee: { $in: [...employee, null] } })), (!returnUnscheduled && { startDate: { $ne: null } })), (startDate && !returnUnscheduled && { startDate: { $gte: startDate, $lt: new Date((endDate !== null && endDate !== void 0 ? endDate : startDate).getTime() + DAY) } })), (stage && { stage })), (priority && { priority })), (type && { type })), (status ? { status } : { status: { $ne: 'completed' } })), (search && {
        $text: {
            $search: search,
        },
    }));
    const query = Object.assign(Object.assign({}, defaultQuery), ((startDate && returnUnscheduled) && {
        $or: [
            { startDate: { $gte: startDate, $lt: new Date((endDate !== null && endDate !== void 0 ? endDate : startDate).getTime() + DAY) } },
            { startDate: null },
        ],
    }));
    const sort = status === 'completed'
        ? { completedDate: -1, _id: -1 }
        : undefined;
    const limit = Number((_a = req.query.limit) !== null && _a !== void 0 ? _a : Number.POSITIVE_INFINITY);
    const offset = Number((_b = req.query.offset) !== null && _b !== void 0 ? _b : 0);
    models_1.Order.find(query).sort(sort).limit(limit).skip(offset).populate('assignedEmployee').exec((error, orders) => {
        if (error) {
            return res.status(500).send(error);
        }
        models_1.Order.count(query, (_, total) => {
            if (status) {
                return res.send({ orders, total });
            }
            res.send({
                orders: [...orders].sort(sortNotCompletedOrders_1.sortNotCompletedOrders),
                total,
            });
        });
    });
};
exports.getOrders = getOrders;
const getSlots = (req, res) => {
    const startDate = (0, stringToDate_1.stringToDate)(req.query.startDate) || new Date();
    const endDate = (0, stringToDate_1.stringToDate)(req.query.endDate) || '';
    const query = Object.assign({}, (req.query.startDate && {
        startDate: {
            $gte: (0, date_fns_1.startOfDay)(startDate),
            $lte: (0, date_fns_1.endOfDay)(endDate || startDate),
        },
    }));
    models_1.Order.find(query).populate('assignedEmployee').exec((error, orders) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.send(orders.map(({ _id, startDate, endDate, address, priority, assignedEmployee }) => ({
            _id,
            assignedEmployee,
            startDate,
            endDate,
            address,
            priority,
        })));
    });
};
exports.getSlots = getSlots;
