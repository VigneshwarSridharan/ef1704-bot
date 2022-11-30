"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const constants_1 = require("./utils/constants");
const TariffAction_1 = __importDefault(require("./actions/TariffAction"));
// Create a bot that uses 'polling' to fetch new updates
const bot = new node_telegram_bot_api_1.default(constants_1.BOT_TOKEN, { polling: true });
const tariffMessages = {};
// Set bot commands
const commands = [
    { command: "/tariff", description: "Get tariff details of consignment" },
];
bot.setMyCommands(commands);
bot.on("message", TariffAction_1.default);
bot.on("callback_query", TariffAction_1.default);
//# sourceMappingURL=bot.js.map