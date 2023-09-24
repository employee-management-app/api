"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCompanyIdOrToken = void 0;
const company_1 = require("../models/company");
const verifyToken_1 = require("./verifyToken");
const verifyCompanyIdOrToken = (req, res, next) => {
    var _a;
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.replace('Token ', '');
    const { companyId } = req.body;
    if (!token && !companyId) {
        return res.status(403).send({ message: 'No token or company id provided!' });
    }
    if (token) {
        return (0, verifyToken_1.verifyToken)(req, res, next);
    }
    company_1.Company.findById(companyId)
        .then((company) => {
        if (!company) {
            return res.status(404).send({ message: 'Company with provided id doesn\'t exist' });
        }
        res.locals.companyId = companyId;
        next();
    })
        .catch((error) => {
        res.status(500).send(error);
    });
};
exports.verifyCompanyIdOrToken = verifyCompanyIdOrToken;
