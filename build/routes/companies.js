"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const companies_1 = require("../controllers/companies");
const adminOnly_1 = require("../middlewares/adminOnly");
const verifyToken_1 = require("../middlewares/verifyToken");
exports.default = (router) => {
    router.get('/companies', [verifyToken_1.verifyToken, adminOnly_1.adminOnly], companies_1.getCompanies);
};
