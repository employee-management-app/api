"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const order_1 = require("../controllers/order");
const verifyCompanyIdOrToken_1 = require("../middlewares/verifyCompanyIdOrToken");
const verifyToken_1 = require("../middlewares/verifyToken");
exports.default = (router) => {
    router.get('/order/:id', [verifyToken_1.verifyToken], order_1.getOrder);
    router.post('/order', [verifyCompanyIdOrToken_1.verifyCompanyIdOrToken], order_1.createOrder);
    router.patch('/order/:id', [verifyToken_1.verifyToken], order_1.updateOrder);
    router.delete('/order/:id', [verifyToken_1.verifyToken], order_1.deleteOrder);
    router.post('/order/:id/file', [verifyToken_1.verifyToken], order_1.uploadFile);
    router.delete('/order/:id/file/:fileId', [verifyToken_1.verifyToken], order_1.removeFile);
};
