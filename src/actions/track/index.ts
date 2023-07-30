import { DashboardService } from "../../utils/APIService";
import Bot from "../../utils/Bot";
import { DASHBOARD_SERVICES } from "../../utils/constants";
import { resetUserCommand } from "../../utils/functions";

const getTrackDetails = async (state) => {
  const { chatId, text } = state;

  try {
    console.log("text => ", text);
    const response = await DashboardService.get(
      DASHBOARD_SERVICES.TRANCK_CONSIGNMENT,
      {
        params: { referenceNumber: text },
      }
    );
    if (text.length < 8) {
      Bot.sendMessage(chatId, "❌ Invalid consignment Number");
      return false;
    }
    if (Array.isArray(response) && response.length) {
      const [consignmentDetails] = response;

      const str = (consignmentDetails.events || []).reduce(
        (final, item, inx) =>
          final.concat(`${inx ? "\n | \n" : ""}[•] ${item.event_string}`),
        ""
      );
      Bot.sendMessage(chatId, `<pre>${str}</pre>`, {
        parse_mode: "HTML",
      });
      return true;
    } else {
      Bot.sendMessage(chatId, "🤷🏻‍♂️ Not Available");
      return false;
    }
  } catch (err) {
    Bot.sendMessage(chatId, "Error: " + err.toString());
    return false;
  }

  return;
};

export const trackCommand = (query) => {
  const chatId = query.chat.id;
  const text = query.text;
  const id = query.id;

  Bot.sendMessage(chatId, "Please enter consignment number");
};

export const trackCommandMessages = async (query) => {
  const chatId = query.chat.id;
  const text = query.text;
  const id = query.id;

  const state = {
    chatId,
    text: text.trim(),
  };
  Bot.sendChatAction(chatId, "typing");

  const status = await getTrackDetails(state);
  if (status) {
    resetUserCommand(state);
  }
};
