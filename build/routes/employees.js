"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const employees_1 = require("../controllers/employees");
const verifyToken_1 = require("../middlewares/verifyToken");
exports.default = (router) => {
    router.get('/employees', [verifyToken_1.verifyToken], employees_1.getEmployees);
};
