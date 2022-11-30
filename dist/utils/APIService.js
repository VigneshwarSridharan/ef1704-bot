"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("./constants");
const APIService = axios_1.default.create({
    baseURL: constants_1.EBOOKING_BACKEND_BASE_URL,
});
const headers = {
    Authorization: "YmFDMvpFW2Zgy1RsL1kIHALayDA9JGK-IlNam4Lmo3iD6Xb97OIZNHaeaLcgTwEO EF1704",
    "Content-Type": "application/json",
};
exports.BaseService = {
    get: (url, params) => APIService.request({
        method: "get",
        url,
        headers,
        params,
    }).then((res) => res.data),
    post: (url, data) => APIService.request({
        method: "post",
        // //   maxBodyLength: Infinity,
        url,
        headers,
        data: JSON.stringify(data),
    }).then((res) => res.data),
};
// data: { status: 0, desc: 'Not Authorized' }
//# sourceMappingURL=APIService.js.map