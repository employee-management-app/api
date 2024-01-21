"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../controllers/auth");
const verifyToken_1 = require("../middlewares/verifyToken");
exports.default = (router) => {
    router.post('/auth/signin', auth_1.signIn);
    router.post('/auth/invitation', auth_1.acceptInvitation);
    router.get('/auth/user', [verifyToken_1.verifyToken], auth_1.getCurrentUser);
    router.post('/auth/reset-password', auth_1.resetPassword);
    router.post('/auth/change-password', auth_1.changePassword);
};
