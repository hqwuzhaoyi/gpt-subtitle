"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.request = exports.staticPath = exports.baseURL = void 0;
const axios_1 = __importDefault(require("axios"));
exports.baseURL = process.env.API_URL || `http://localhost:${process.env.SERVER_PORT}`;
exports.staticPath = `baseURL/${process.env.STATIC_PATH}`;
exports.request = axios_1.default.create({
    // .. congigure axios baseURL
    baseURL: `${exports.baseURL}`,
});
