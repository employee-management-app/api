"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const order_1 = require("../controllers/order");
const verifyToken_1 = require("../middlewares/verifyToken");
const upload = (0, multer_1.default)({ dest: '/tmp' });
exports.default = (router) => {
    router.get('/order/:id', [verifyToken_1.verifyToken], order_1.getOrder);
    router.post('/order', [verifyToken_1.verifyToken], order_1.createOrder);
    router.patch('/order/:id', [verifyToken_1.verifyToken], order_1.updateOrder);
    router.delete('/order/:id', [verifyToken_1.verifyToken], order_1.deleteOrder);
    router.post('/order/:id/file', [verifyToken_1.verifyToken, upload.single('file')], order_1.uploadFile);
    router.delete('/order/:id/file/:fileId', [verifyToken_1.verifyToken], order_1.removeFile);
};
