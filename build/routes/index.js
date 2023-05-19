"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoutes = void 0;
const auth_1 = __importDefault(require("./auth"));
const employee_1 = __importDefault(require("./employee"));
const employees_1 = __importDefault(require("./employees"));
const order_1 = __importDefault(require("./order"));
const orders_1 = __importDefault(require("./orders"));
const getRoutes = (router) => {
    (0, auth_1.default)(router);
    (0, order_1.default)(router);
    (0, orders_1.default)(router);
    (0, employee_1.default)(router);
    (0, employees_1.default)(router);
    return router;
};
exports.getRoutes = getRoutes;
