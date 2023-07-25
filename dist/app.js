"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TariffAction_1 = __importDefault(require("./actions/TariffAction"));
const Bot_1 = __importDefault(require("./utils/Bot"));
const express = require("express");
const commands = [
    { command: "/tariff", description: "Get tariff details of consignment" },
    { command: "/help", description: "Help" },
];
Bot_1.default.setMyCommands(commands);
Bot_1.default.on("message", TariffAction_1.default);
Bot_1.default.on("callback_query", TariffAction_1.default);
// Start an Express server to keep Vercel happy
const app = express();
app.get("/", (req, res) => {
    res.send("Hello Bot!");
});
app.listen(3000, () => {
    console.log("Telegram bot server running on port 3000!");
});
//# sourceMappingURL=app.js.map