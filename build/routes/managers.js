"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const managers_1 = require("../controllers/managers");
const verifyToken_1 = require("../middlewares/verifyToken");
exports.default = (router) => {
    router.get('/managers', [verifyToken_1.verifyToken], managers_1.getManagers);
};
