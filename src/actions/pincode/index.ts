import { sentenceCase } from "change-case";
import { EBookingService } from "../../utils/APIService";
import Bot from "../../utils/Bot";
import { EBOOKING_SERVICES } from "../../utils/constants";
import { resetUserCommand } from "../../utils/functions";

const getDeliveryPincode = async (state) => {
  const { chatId, text } = state;

  if (!/^[0-9]{6}$/.test(text)) {
    Bot.sendMessage(chatId, "Invalid delivery pincode");
    return;
  }
  try {
    const { data } = await EBookingService.get(EBOOKING_SERVICES.GET_USER_SEARCH, {
      phone: "",
      id: "efrbooking",
      searchString: text,
      flag: "delivery",
    });

    if (data.serviceablePincode.value) {
      const { destinationPincodeCity, state } = data.serviceablePincode;
      Bot.sendMessage(
        chatId,
        `Area ${sentenceCase(destinationPincodeCity)}, ${sentenceCase(
          state
        )} is serviceable 👍`
      );
    } else {
      Bot.sendMessage(chatId, "Area not serviceable 😞👎");
    }
    return true;
  } catch (err) {
    console.log(err);
    Bot.sendMessage(chatId, "Error: " + err.toString());
  }
  return;
};

export const pincodeCommand = (query) => {
  const chatId = query.chat.id;
  const text = query.text;
  const id = query.id;

  Bot.sendMessage(chatId, "Please enter delivery pincode");
};

export const pincodeCommandMessages = async (query) => {
  const chatId = query.chat.id;
  const text = query.text;
  const id = query.id;

  const state = {
    chatId,
    text: text.trim(),
  };
  Bot.sendChatAction(chatId, "typing");

  const status = await getDeliveryPincode(state);
  if (status) {
    resetUserCommand(state);
  }
};
