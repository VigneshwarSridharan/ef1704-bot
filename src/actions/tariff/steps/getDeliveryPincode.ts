import { sentenceCase } from "change-case";
import { EBookingService } from "../../../utils/APIService";
import Bot from "../../../utils/Bot";
import { EBOOKING_SERVICES, STEPS } from "../../../utils/constants";
import { tariffMessagesDB } from "../../../utils/store";
import { documentsOptions } from "../options";

const getDeliveryPincode = async (state) => {
  const { chatId, text, userData } = state;
  const tariffMessage = userData;

  if (!/^[0-9]{6}$/.test(text)) {
    Bot.sendMessage(chatId, "Invalid delivery pincode");
  }

  try {
    const { data } = await EBookingService.get(
      EBOOKING_SERVICES.GET_USER_SEARCH,
      {
        phone: "",
        id: "efrbooking",
        searchString: text,
        flag: "delivery",
      }
    );

    if (data.serviceablePincode.value) {
      const { destinationPincodeCity, state } = data.serviceablePincode;
      tariffMessage.payload.deliveryPincode = text;
      tariffMessage.step = STEPS.DOCUMENT_TYPE_SELECTION;
      tariffMessagesDB.get(chatId).set("payload.deliveryPincode", text);
      tariffMessagesDB
        .get(chatId)
        .set("payload.step", STEPS.DOCUMENT_TYPE_SELECTION);
      tariffMessagesDB.write();

      Bot.sendMessage(
        chatId,
        `Area ${sentenceCase(destinationPincodeCity)}, ${sentenceCase(
          state
        )} is serviceable 👍`
      );
      setTimeout(() => {
        Bot.sendMessage(chatId, `Select Document Type`, documentsOptions);
      }, 500);
      return true;
    } else {
      Bot.sendMessage(chatId, "Area not serviceable 😞");
    }
  } catch (err) {
    console.log(err);
    Bot.sendMessage(chatId, "Error: " + err.toString());
  }
};

export default getDeliveryPincode;
