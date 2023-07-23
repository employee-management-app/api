"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOnly = void 0;
const adminOnly = (req, res, next) => {
    const { user } = res.locals;
    if (user.role !== 'admin') {
        return res.status(403).send({ message: 'You do not have permissions to perform this action' });
    }
    next();
};
exports.adminOnly = adminOnly;
