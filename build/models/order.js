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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const date_fns_1 = require("date-fns");
const mongoose_1 = __importDefault(require("mongoose"));
const OrderSchema = new mongoose_1.default.Schema({
    creationDate: {
        type: Date,
        default: Date.now,
        required: true,
    },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        default: null,
        ref: 'User',
    },
    type: {
        type: String,
        maxLength: 125,
        required: true,
    },
    stage: {
        type: String,
        maxLength: 125,
        required: true,
    },
    address: {
        type: {
            fullAddress: {
                type: String,
                maxLength: 300,
                required: true,
            },
            city: {
                type: String,
                maxLength: 125,
                required: true,
            },
            code: {
                type: String,
                maxLength: 10,
                required: true,
            },
            street: {
                type: String,
                maxLength: 125,
            },
            house: {
                type: String,
                maxLength: 10,
                required: true,
            },
            flat: {
                type: String,
                default: '',
                maxLength: 10,
            },
            lat: {
                type: Number,
                required: true,
            },
            lng: {
                type: Number,
                required: true,
            },
        },
        required: true,
    },
    email: {
        type: String,
        maxLength: 125,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address'],
    },
    name: {
        type: String,
        maxLength: 75,
    },
    surname: {
        type: String,
        maxLength: 75,
    },
    phone: {
        type: String,
        maxLength: 20,
        required: true,
    },
    message: {
        type: String,
        default: '',
        maxLength: 1000,
    },
    employeeMessage: {
        type: String,
        default: '',
        maxLength: 1000,
    },
    managerMessage: {
        type: String,
        default: '',
        maxLength: 1000,
    },
    employeeNotes: {
        type: String,
        default: '',
        maxLength: 1000,
    },
    priority: {
        type: Number,
        min: 0,
        max: 3,
        default: 1,
        required: true,
    },
    status: {
        type: String,
        enum: ['inbox', 'inProgress', 'completed', 'cancelled', 'deleted'],
        default: 'inbox',
        required: true,
    },
    startDate: {
        type: Date,
        default: null,
    },
    endDate: {
        type: Date,
        default: null,
    },
    completedDate: {
        type: Date,
        default: null,
    },
    assignedEmployee: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        default: null,
        ref: 'User',
    },
    files: {
        type: [{
                id: {
                    type: String,
                    required: true,
                },
                format: {
                    type: String,
                    required: true,
                },
                width: {
                    type: Number,
                    required: true,
                },
                height: {
                    type: Number,
                    required: true,
                },
                url: {
                    type: String,
                    required: true,
                },
                creationDate: {
                    type: Date,
                },
            }],
    },
    companyId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        default: null,
        ref: 'Company',
    },
});
OrderSchema.index({
    type: 'text',
    stage: 'text',
    name: 'text',
    email: 'text',
    surname: 'text',
    phone: 'text',
    employeeMessage: 'text',
    managerMessage: 'text',
    status: 'text',
    message: 'text',
    'address.city': 'text',
    'address.street': 'text',
    'address.fullAddress': 'text',
    'address.code': 'text',
});
OrderSchema.post('validate', (order, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!order.assignedEmployee || !order.startDate) {
        return next();
    }
    const query = {
        _id: { $ne: order._id },
        assignedEmployee: order.assignedEmployee,
        startDate: {
            $gte: (0, date_fns_1.startOfDay)(order.startDate),
            $lte: (0, date_fns_1.endOfDay)(order.startDate),
        },
    };
    const orders = yield exports.Order.find(query).populate('assignedEmployee');
    const overlappedOrder = orders.find(({ startDate, endDate }) => {
        if (!startDate || !endDate || !order.startDate || !order.endDate) {
            return false;
        }
        return (0, date_fns_1.areIntervalsOverlapping)({ start: startDate, end: endDate, }, { start: order.startDate, end: order.endDate, });
    });
    if (overlappedOrder) {
        return next(new mongoose_1.default.Error.ValidatorError({
            message: 'Order\'s time overlaps with another order',
            value: {
                order,
                orders: orders,
            },
        }));
    }
    next();
}));
OrderSchema.post('validate', (order, next) => {
    const canEdit = order.status === 'inbox' || order.status === 'inProgress';
    if (canEdit) {
        order.set('status', (order.startDate && order.assignedEmployee) ? 'inProgress' : 'inbox');
    }
    next();
});
exports.Order = mongoose_1.default.model('Order', OrderSchema);
