"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getManagers = void 0;
const models_1 = require("../models");
const getManagers = (req, res) => {
    const { companyId } = res.locals;
    models_1.User.find(Object.assign(Object.assign({}, req.query), { companyId, role: { $in: ['manager', 'owner'] } })).exec((error, employees) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.send(employees);
    });
};
exports.getManagers = getManagers;
