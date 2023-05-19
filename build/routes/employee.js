"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const employee_1 = require("../controllers/employee");
const verifyToken_1 = require("../middlewares/verifyToken");
exports.default = (router) => {
    router.get('/employee/:id/orders', [verifyToken_1.verifyToken], employee_1.getEmployeeOrders);
    router.get('/employee/:id/slots', [verifyToken_1.verifyToken], employee_1.getEmployeeSlots);
    router.post('/employee', [verifyToken_1.verifyToken], employee_1.inviteEmployee);
    router.patch('/employee/:id', [verifyToken_1.verifyToken], employee_1.updateEmployee);
};
