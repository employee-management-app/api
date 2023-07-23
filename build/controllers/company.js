"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompanyManagers = exports.getCompanyEmployees = exports.getCurrentUserCompany = exports.createCompany = void 0;
const cloudinary_1 = require("cloudinary");
// eslint-disable-next-line unicorn/prefer-node-protocol
const promises_1 = require("fs/promises");
const models_1 = require("../models");
const company_1 = require("../models/company");
const createCompany = (req, res) => {
    var _a;
    const { name } = req.body;
    const path = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
    if (!path) {
        company_1.Company.create({ name })
            .then((company) => {
            res.status(200).send(company);
        })
            .catch((error) => {
            res.status(500).send(error);
        });
    }
    else {
        cloudinary_1.v2.uploader.upload(path, { use_filename: true })
            .then((data) => {
            company_1.Company.create({ name, logo: data.secure_url })
                .then((company) => {
                res.status(200).send(company);
            })
                .catch((error) => {
                res.status(500).send(error);
            });
        })
            .catch((error) => {
            res.status(500).send(error);
        })
            .finally(() => {
            (0, promises_1.unlink)(path);
        });
    }
};
exports.createCompany = createCompany;
const getCurrentUserCompany = (req, res) => {
    const { companyId } = res.locals;
    company_1.Company.findById(companyId)
        .then((company) => {
        if (!company) {
            return res.status(404).send({ message: 'Company was not found' });
        }
        res.send(company);
    })
        .catch((error) => {
        res.status(500).send(error);
    });
};
exports.getCurrentUserCompany = getCurrentUserCompany;
const getCompanyEmployees = (req, res) => {
    const { id: companyId } = req.params;
    models_1.User.find({ companyId, role: 'employee' }).exec((error, employees) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.send(employees);
    });
};
exports.getCompanyEmployees = getCompanyEmployees;
const getCompanyManagers = (req, res) => {
    const { id: companyId } = req.params;
    models_1.User.find({ companyId, role: 'manager' }).exec((error, managers) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.send(managers);
    });
};
exports.getCompanyManagers = getCompanyManagers;
