import { chat } from "./store";

export const watchCommand = (command, action) => (query) => {
  const text = query.text;
  const chatId = query.chat.id;
  if (text === command) {
    chat.set(`${chatId}.command`, command).write();
    action(query);
  }
};

export const watchCommandMessages = (command, handler) => (query) => {
  const text = query.text;
  const chatId = query.chat.id;
  if (
    !text.startsWith("/") &&
    chat.get(`${chatId}.command`).value() === command
  ) {
    handler(query);
  }
};

export const watchCommandOptions = (command, handler) => (query) => {
  const chatId = query.message.chat.id;
  const text = query.data;
  const id = query.id;

  if (text !== command && chat.get(`${chatId}.command`).value() === command) {
    handler(query);
  }
};

export const resetUserCommand = (state) => {
  const { chatId } = state;
  chat.set(`${chatId}.command`, null).write();
};
