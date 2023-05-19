"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../controllers/auth");
const verifySignUp_1 = require("../middlewares/verifySignUp");
exports.default = (router) => {
    router.post('/auth/signup', [verifySignUp_1.verifySignUp], auth_1.signUp);
    router.post('/auth/signin', auth_1.signIn);
    router.post('/auth/invitation', auth_1.acceptInvitation);
};
