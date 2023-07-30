import Bot from "../../utils/Bot";
import { STEPS } from "../../utils/constants";
import { tariffMessagesDB } from "../../utils/store";
import { getDeliveryPincode, getDocumentType } from "./steps";

const handleSteps = (state) => {
  const { userData } = state;
  if (userData.step === STEPS.DELIVERY_PINCODE_SELECTION) {
    getDeliveryPincode(state);
  }
  if (userData.step === STEPS.DOCUMENT_TYPE_SELECTION) {
    getDocumentType(state);
  }
};

export const tariffCommand = (query) => {
  const chatId = query.chat.id;
  const text = query.text;
  const id = query.id;

  const data = {
    step: STEPS.DELIVERY_PINCODE_SELECTION,
    lastMessageId: null,
    payload: {
      pickupPincode: "636008",
      deliveryPincode: null,
      weight: null,
      length: null,
      courierType: null,
      id: "efrDom",
    },
  };

  tariffMessagesDB.set(chatId, { chatId, ...data }).write();

  Bot.sendMessage(chatId, "Please enter delivery pincode");
};

export const tariffCommandMessages = (query) => {
  const chatId = query.chat.id;
  const text = query.text;
  const id = query.id;

  const userData = tariffMessagesDB.get(chatId).value();

  const state = {
    chatId,
    text,
    id,
    userData,
  };

  handleSteps(state);
};

export const tariffCommandOptions = (query) => {
  const chatId = query.message.chat.id;
  const text = query.data;
  const id = query.id;
  const userData = tariffMessagesDB.get(chatId).value();

  const state = {
    chatId,
    text,
    id,
    userData,
  };

  handleSteps(state);
};
