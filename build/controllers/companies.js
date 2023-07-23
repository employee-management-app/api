"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompanies = void 0;
const company_1 = require("../models/company");
const getCompanies = (req, res) => {
    company_1.Company.find({}).exec((error, companies) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.send(companies);
    });
};
exports.getCompanies = getCompanies;
