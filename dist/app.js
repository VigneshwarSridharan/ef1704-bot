"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TariffAction_1 = __importDefault(require("./actions/TariffAction"));
const Bot_1 = __importDefault(require("./utils/Bot"));
const commands = [
    { command: "/tariff", description: "Get tariff details of consignment" },
    { command: "/help", description: "Help" },
];
Bot_1.default.setMyCommands(commands);
Bot_1.default.on("message", TariffAction_1.default);
Bot_1.default.on("callback_query", TariffAction_1.default);
//# sourceMappingURL=app.js.map