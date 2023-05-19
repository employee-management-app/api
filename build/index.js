"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const models_1 = require("./models");
const routes_1 = require("./routes");
models_1.mongoose.connect(process.env.MONGODB_URL, (error) => {
    console.log(error || 'Successfully connected to MongoDB.');
});
const app = (0, express_1.default)();
const router = express_1.default.Router();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, routes_1.getRoutes)(router));
app.listen(process.env.PORT || 3001, () => {
    console.log('Server is running');
});
exports.default = app;
