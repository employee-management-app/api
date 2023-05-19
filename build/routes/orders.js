"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const orders_1 = require("../controllers/orders");
const verifyToken_1 = require("../middlewares/verifyToken");
exports.default = (router) => {
    router.get('/orders', [verifyToken_1.verifyToken], orders_1.getOrders);
    router.get('/slots', [verifyToken_1.verifyToken], orders_1.getSlots);
};
