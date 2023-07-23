"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const manager_1 = require("../controllers/manager");
const verifyToken_1 = require("../middlewares/verifyToken");
exports.default = (router) => {
    router.post('/manager', [verifyToken_1.verifyToken], manager_1.inviteManager);
};
