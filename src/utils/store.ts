import { existsSync, mkdirSync } from "fs";
import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";

if (!existsSync("./data")) {
  mkdirSync("./data");
}

const adapter = new FileSync("./data/db.json");
export const chat = new low(adapter);

const tariffMessagesAdapter = new FileSync("./data/tariff-messages.json");
export const tariffMessagesDB = new low(tariffMessagesAdapter, {});

const botStoreAdapter = new FileSync("./data/bot-store.json");
export const botStore = new low(botStoreAdapter, {});
