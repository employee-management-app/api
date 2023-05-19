"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmployees = void 0;
const models_1 = require("../models");
const getEmployees = (req, res) => {
    models_1.User.find(Object.assign({ role: 'employee' }, req.query)).exec((error, employees) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.send(employees);
    });
};
exports.getEmployees = getEmployees;
