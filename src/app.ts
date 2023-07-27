import HelpAction from "./actions/HelpAction";
import { GetTariffAction, handleTariffMessages } from "./actions/TariffAction";
import { watchCommand, watchCommandMessages, watchCommandOptions } from "./functions";
import Bot from "./utils/Bot";
import { COMMANDS } from "./utils/constants";
const express = require("express");

const commands = [
  { command: COMMANDS.TARIFF, description: "Get tariff details of consignment" },
  { command: COMMANDS.HELP, description: "Help" },
];

Bot.setMyCommands(commands);

Bot.on('polling_error', (error) => {
  console.error('Polling error:', error.message);
});

Bot.on("message", watchCommand(COMMANDS.TARIFF, GetTariffAction));
Bot.on("message", watchCommandMessages(COMMANDS.TARIFF, handleTariffMessages));
Bot.on("callback_query", watchCommandOptions(COMMANDS.TARIFF, handleTariffMessages));


Bot.on("message", watchCommand(COMMANDS.HELP, HelpAction));

const app = express();

app.get("/", (req, res) => {
  res.send("Hello Bot!");
});

app.listen(3000, () => {
  console.log("Telegram bot server running on port 3000!");
});
