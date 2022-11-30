import TelegramBot from "node-telegram-bot-api";
import { BOT_TOKEN } from "./constants";

const Bot = new TelegramBot(BOT_TOKEN, { polling: true });

export default Bot;
