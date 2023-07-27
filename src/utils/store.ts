
import lodash from "lodash";
import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";

const adapter = new FileSync("./data/db.json");
export const chat = new low(adapter);

const tariffMessagesAdapter = new FileSync("./data/tariff-messages.json");
export const tariffMessagesDB = new low(tariffMessagesAdapter, {});
