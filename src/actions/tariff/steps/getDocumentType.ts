import Bot from "../../../utils/Bot";
import { STEPS } from "../../../utils/constants";
import { tariffMessagesDB } from "../../../utils/store";
import { documentWeightOptions } from "../options";

const getDocumentType = async (state) => {
  const { chatId, text, userData } = state;
  const tariffMessage = userData;

  tariffMessagesDB.get(chatId).set("payload.courierType", text);
  if (text === "DOCUMENT") {
    tariffMessagesDB.get(chatId).set("step", STEPS.DOCUMENT_WEIGHT_SELECTION);
    Bot.sendMessage(chatId, "Select Document Weight", documentWeightOptions);
  }
  if (text === "NON-DOCUMENT") {
    tariffMessagesDB
      .get(chatId)
      .set("step", STEPS.NON_DOCUMENT_WEIGHT_SELECTION);
    tariffMessagesDB.get(chatId).set("payload.declaredPrice", "1000");

    tariffMessage.payload.declaredPrice = "1000";
    Bot.sendMessage(chatId, "Enter Non Document Weight in KG (eg: 1.5)");
  }
  tariffMessagesDB.write();
};
export default getDocumentType;
