"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = exports.updateOrder = exports.removeFile = exports.getOrder = exports.deleteOrder = exports.createOrder = void 0;
const cloudinary_1 = require("cloudinary");
// eslint-disable-next-line unicorn/prefer-node-protocol
const promises_1 = require("fs/promises");
const lodash_1 = require("lodash");
const models_1 = require("../models");
const getOrder = (req, res) => {
    models_1.Order.findById(req.params.id).populate('assignedEmployee').exec((error, order) => {
        if (error) {
            return res.status(500).send(error);
        }
        if (!order) {
            return res.status(404).send({ message: 'Order not found' });
        }
        res.send(order);
    });
};
exports.getOrder = getOrder;
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = new models_1.Order(req.body);
    order.save((error, order) => {
        if (error) {
            return res.status(500).send(error);
        }
        order.populate('assignedEmployee', () => {
            res.send(order);
        });
    });
});
exports.createOrder = createOrder;
const updateOrder = (req, res) => {
    models_1.Order.findById(req.params.id).exec((error, order) => __awaiter(void 0, void 0, void 0, function* () {
        if (error) {
            return res.status(500).send(error);
        }
        if (!order) {
            return res.status(404).send({ message: 'Order not found' });
        }
        if (order.status !== 'completed' && req.body.status === 'completed') {
            order.completedDate = new Date();
        }
        (0, lodash_1.merge)(order, req.body);
        order.save((error, order) => {
            if (error) {
                return res.status(400).send(error);
            }
            order.populate('assignedEmployee', () => {
                res.send(order);
            });
        });
    }));
};
exports.updateOrder = updateOrder;
// TODO: do not delete the order, but change the status to 'deleted' and respect it in getters
const deleteOrder = (req, res) => {
    models_1.Order.findByIdAndDelete(req.params.id).exec((error) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.send({ message: 'The order was successfully deleted!' });
    });
};
exports.deleteOrder = deleteOrder;
const uploadFile = (req, res) => {
    models_1.Order.findById(req.params.id).exec((error, order) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (error) {
            return res.status(500).send(error);
        }
        if (!order) {
            return res.status(404).send({ message: 'Order not found' });
        }
        const path = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
        if (!path) {
            return res.status(400).send({ message: 'File was not provided!' });
        }
        cloudinary_1.v2.uploader.upload(path, { use_filename: true, quality: 'auto:eco' })
            .then((data) => {
            const file = {
                id: data.public_id,
                format: data.format,
                width: data.width,
                height: data.height,
                url: data.secure_url,
                creationDate: data.created_at,
            };
            order.files.push(file);
            order.save((error) => {
                if (error) {
                    return res.status(500).send(error);
                }
                res.send(file);
            });
        })
            .catch((error) => {
            res.status(500).send(error);
        })
            .finally(() => {
            (0, promises_1.unlink)(path);
        });
    }));
};
exports.uploadFile = uploadFile;
const removeFile = (req, res) => {
    models_1.Order.findById(req.params.id).exec((error, order) => __awaiter(void 0, void 0, void 0, function* () {
        if (error) {
            return res.status(500).send(error);
        }
        if (!order) {
            return res.status(404).send({ message: 'Order not found' });
        }
        cloudinary_1.v2.uploader.destroy(req.params.fileId, {}, (error) => {
            if (error) {
                return res.status(500).send(error);
            }
            order.files = order.files.filter((file) => file.id !== req.params.fileId);
            order.save((error) => {
                if (error) {
                    return res.status(500).send(error);
                }
                res.send({ message: 'File was removed.' });
            });
        });
    }));
};
exports.removeFile = removeFile;
