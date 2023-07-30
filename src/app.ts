import HelpAction from "./actions/HelpAction";
import { GetTariffAction, handleTariffMessages } from "./actions/TariffAction";
import { pincodeCommand, pincodeCommandMessages } from "./actions/pincode";
import {
  watchCommand,
  watchCommandMessages,
  watchCommandOptions,
} from "./utils/functions";
import Bot from "./utils/Bot";
import { COMMANDS } from "./utils/constants";
import { DRSCommand } from "./actions/drs";
import { trackCommand, trackCommandMessages } from "./actions/track";
import {
  tariffCommand,
  tariffCommandMessages,
  tariffCommandOptions,
} from "./actions/tariff";
const express = require("express");

const commands = [
  { command: COMMANDS.TARIFF, description: "Tariff" },
  { command: COMMANDS.PINCODE, description: "Search Pincode" },
  { command: COMMANDS.TRACK, description: "Track Consignment" },
  { command: COMMANDS.DRS, description: "DRS" },
  { command: COMMANDS.HELP, description: "Help" },
];

Bot.setMyCommands(commands);

Bot.on("polling_error", (error) => {
  console.error("Polling error:", error.message);
});

Bot.on("message", watchCommand(COMMANDS.TARIFF, GetTariffAction));
Bot.on("message", watchCommandMessages(COMMANDS.TARIFF, handleTariffMessages));
Bot.on(
  "callback_query",
  watchCommandOptions(COMMANDS.TARIFF, handleTariffMessages)
);

Bot.on("message", watchCommand(COMMANDS.PINCODE, pincodeCommand));
Bot.on(
  "message",
  watchCommandMessages(COMMANDS.PINCODE, pincodeCommandMessages)
);

Bot.on("message", watchCommand(COMMANDS.TRACK, trackCommand));
Bot.on("message", watchCommandMessages(COMMANDS.TRACK, trackCommandMessages));

Bot.on("message", watchCommand(COMMANDS.DRS, DRSCommand));

Bot.on("message", watchCommand(COMMANDS.HELP, HelpAction));

const app = express();

app.get("/", (req, res) => {
  res.send("Hello Bot!");
});

app.listen(3000, () => {
  console.log("Telegram bot server running on port 3000!");
});
