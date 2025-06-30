"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const company_1 = require("../controllers/company");
const adminOnly_1 = require("../middlewares/adminOnly");
const verifyToken_1 = require("../middlewares/verifyToken");
const upload = (0, multer_1.default)({ dest: '/tmp' });
exports.default = (router) => {
    router.post('/company', [verifyToken_1.verifyToken, adminOnly_1.adminOnly, upload.single('logo')], company_1.createCompany);
    router.put('/company/:id', [verifyToken_1.verifyToken, adminOnly_1.adminOnly], company_1.updateCompany);
    router.get('/company', [verifyToken_1.verifyToken], company_1.getCurrentUserCompany);
    router.get('/company/:id/employees', [verifyToken_1.verifyToken, adminOnly_1.adminOnly], company_1.getCompanyEmployees);
    router.get('/company/:id/managers', [verifyToken_1.verifyToken, adminOnly_1.adminOnly], company_1.getCompanyManagers);
};
