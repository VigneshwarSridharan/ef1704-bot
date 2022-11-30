import GetTariffAction from "./actions/TariffAction";
import Bot from "./utils/Bot";
const express = require("express");

const commands = [
  { command: "/tariff", description: "Get tariff details of consignment" },
  { command: "/help", description: "Help" },
];
Bot.setMyCommands(commands);

Bot.on("message", GetTariffAction);
Bot.on("callback_query", GetTariffAction);

// Start an Express server to keep Vercel happy
const app = express();
app.listen(3000, () => {
  console.log("Telegram bot server running on port 3000!");
});
