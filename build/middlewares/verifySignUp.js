"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySignUp = void 0;
const models_1 = require("../models");
const verifySignUp = (req, res, next) => {
    models_1.User.findOne({ email: req.body.email }).exec((error, user) => {
        if (error) {
            return res.status(500).send(error);
        }
        if (user) {
            return res.status(400).send({ message: 'User with provided email already exists' });
        }
        next();
    });
};
exports.verifySignUp = verifySignUp;
