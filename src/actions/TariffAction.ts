import { sentenceCase } from "change-case";
import { BaseService } from "../utils/APIService";
import Bot from "../utils/Bot";
import { SERVICES, STEPS } from "../utils/constants";
import { tariffMessagesDB } from "../utils/store";

const tariffMessages = {}

const documentsOptions = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: "Document", callback_data: "DOCUMENT" },
        { text: "Non Document", callback_data: "NON-DOCUMENT" },
      ],
    ],
  },
};

const documentWeightOptions = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: "0-100g", callback_data: "DOCUMENT_WEIGHT_100" },
        { text: "100-250g", callback_data: "DOCUMENT_WEIGHT_250" },
      ],
      [
        { text: "250-500g", callback_data: "DOCUMENT_WEIGHT_500" },
        { text: "500g-1kg", callback_data: "DOCUMENT_WEIGHT_1000" },
      ],
      [
        { text: "1kg-1.5kg", callback_data: "DOCUMENT_WEIGHT_1500" },
        { text: "1.5kg-2kg", callback_data: "DOCUMENT_WEIGHT_2000" },
      ],
      [
        { text: "2kg-2.5kg", callback_data: "DOCUMENT_WEIGHT_2500" },
        { text: "2.5kg-3kg", callback_data: "DOCUMENT_WEIGHT_3000" },
      ],
    ],
  },
};
const centimetreOptions = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: "10", callback_data: "10" },
        { text: "50", callback_data: "50" },
        { text: "100", callback_data: "100" },
      ],
    ],
  },
};

const getConsignmentTariff = async (state) => {
  const { chatId, text, id } = state;
  const tariffMessage = tariffMessages[chatId];

  try {
    const { payload } = tariffMessage;
    const { data } = await BaseService.post(
      SERVICES.GET_PRICE_AND_TAT,
      payload
    );

    const volumetricWeight =
      payload.courierType === "NON-DOCUMENT"
        ? (payload.length * payload.height * payload.breadth) / 5000
        : 0;
    const volumetricWeightString =
      payload.courierType === "NON-DOCUMENT"
        ? `
*Volumetric Weight:* ${volumetricWeight.toFixed(2)} KG
${payload.length} x ${payload.breadth} x ${payload.height
        } / 5000 = ${volumetricWeight.toFixed(2)} KG      `
        : ``;
    const payloadMessage = `Consignment Details:
*Pickup Pincode:* ${payload.pickupPincode}
*Delivery Pincode:* ${payload.deliveryPincode}
*Type:* ${payload.courierType}
*Weight:* ${payload.weight / 1000} KG
${volumetricWeightString}
  `;

    const priceOptions = {
      reply_markup: {
        inline_keyboard: data
          .sort((a, b) => (Number(a?.price) > Number(b?.price) ? -1 : 1))
          .map((item) => [
            {
              text: `${item.serviceType} (${item.period}) \n ₹${item.price} `,
              callback_data: item.serviceType,
            },
          ]),
      },
    };

    Bot.sendMessage(chatId, payloadMessage, {
      parse_mode: "Markdown",
    });
    setTimeout(() => {
      Bot.sendMessage(
        chatId,
        "- - - - - - - - - - - - - Price Details - - - - - - - - - - - - -",
        priceOptions
      );
    }, 100);
  } catch (err) {
    console.log(err);
    Bot.sendMessage(chatId, "Error: " + err.toString());
  }
};

const getDeliveryPincode = async (state) => {
  const { chatId, text } = state;
  const tariffMessage = tariffMessages[chatId];

  if (tariffMessage.step === STEPS.DELIVERY_PINCODE_SELECTION) {
    if (!/^[0-9]{6}$/.test(text)) {
      Bot.sendMessage(chatId, "Invalid delivery pincode");
      return;
    }

    try {
      const { data } = await BaseService.get(SERVICES.GET_USER_SEARCH, {
        phone: "",
        id: "efrbooking",
        searchString: text,
        flag: "delivery",
      });

      if (data.serviceablePincode.value) {
        const { destinationPincodeCity, state } = data.serviceablePincode;
        tariffMessage.payload.deliveryPincode = text;
        tariffMessage.step = STEPS.DOCUMENT_TYPE_SELECTION;

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
  }
};

const getDocumentType = async (state) => {
  const { chatId, text } = state;
  const tariffMessage = tariffMessages[chatId];
  if (tariffMessage.step === STEPS.DOCUMENT_TYPE_SELECTION) {
    tariffMessage.payload.courierType = text;
    tariffMessage.step = STEPS.DOCUMENT_WEIGHT_SELECTION;
    if (text === "DOCUMENT") {
      Bot.sendMessage(chatId, "Select Document Weight", documentWeightOptions);
    }
    if (text === "NON-DOCUMENT") {
      tariffMessage.step = STEPS.NON_DOCUMENT_WEIGHT_SELECTION;
      tariffMessage.payload.declaredPrice = "1000";
      Bot.sendMessage(chatId, "Enter Non Document Weight in KG (eg: 1.5)");
    }
    return true;
  }
};

const getDocumentWeight = async (state) => {
  const { chatId, text, id } = state;
  const tariffMessage = tariffMessages[chatId];

  if (tariffMessage.step == STEPS.DOCUMENT_WEIGHT_SELECTION) {
    const weight = text.replace("DOCUMENT_WEIGHT_", "");
    tariffMessage.payload.weight = weight;

    await getConsignmentTariff(state);

    return true;
  }
};

const getNonDocumentWeight = async (state) => {
  const { chatId, text, id } = state;
  const tariffMessage = tariffMessages[chatId];

  if (tariffMessage.step === STEPS.NON_DOCUMENT_WEIGHT_SELECTION) {
    const weight = Number(text);
    tariffMessage.payload.weight = (weight * 1000).toString();
    tariffMessage.step = STEPS.NON_DOCUMENT_LENGTH_SELECTION;
    Bot.sendMessage(
      chatId,
      "Enter Non Document Length in CM (eg: 10)",
      centimetreOptions
    );
    return true;
  }
};

const getNonDocumentLength = async (state) => {
  const { chatId, text, id } = state;
  const tariffMessage = tariffMessages[chatId];

  if (tariffMessage.step === STEPS.NON_DOCUMENT_LENGTH_SELECTION) {
    tariffMessage.payload["length"] = text;
    tariffMessage.step = STEPS.NON_DOCUMENT_BREADTH_SELECTION;
    Bot.sendMessage(
      chatId,
      "Enter Non Document Breadth in CM (eg: 10)",
      centimetreOptions
    );
    return true;
  }
};

const getNonDocumentBreadth = async (state) => {
  const { chatId, text, id } = state;
  const tariffMessage = tariffMessages[chatId];

  if (tariffMessage.step === STEPS.NON_DOCUMENT_BREADTH_SELECTION) {
    tariffMessage.payload.breadth = text;
    tariffMessage.step = STEPS.NON_DOCUMENT_HEIGHT_SELECTION;
    Bot.sendMessage(
      chatId,
      "Enter Non Document Height in CM (eg: 10)",
      centimetreOptions
    );
    return true;
  }
};

const getNonDocumentHeight = async (state) => {
  const { chatId, text, id } = state;
  const tariffMessage = tariffMessages[chatId];

  if (tariffMessage.step === STEPS.NON_DOCUMENT_HEIGHT_SELECTION) {
    tariffMessage.payload.height = text;

    await getConsignmentTariff(state);
    return true;
  }
};

const handleSteps = async (state) => {
  const { chatId, text } = state;
  const tariffMessage = tariffMessages[chatId];

  Bot.sendChatAction(chatId, "typing");

  if (await getDeliveryPincode(state)) return;

  if (await getDocumentType(state)) return;

  if (await getDocumentWeight(state)) return;

  if (await getNonDocumentWeight(state)) return;

  if (await getNonDocumentLength(state)) return;

  if (await getNonDocumentBreadth(state)) return;

  if (await getNonDocumentHeight(state)) return;
};

export const GetTariffAction = (query) => {
  const chatId = !!query.chat_instance ? query.message.chat.id : query.chat.id;
  const text = !!query.chat_instance ? query.data : query.text;
  const id = query.id;
  const state = {
    chatId,
    text,
    id,
  };

  if (text === "/tariff") {
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
    tariffMessages[chatId] = data


    tariffMessagesDB.set(chatId, { chatId, ...data, }).write();


    Bot.sendMessage(chatId, "Please enter delivery pincode");
    return;
  }
};



export const handleTariffMessages = query => {
  const chatId = !!query.chat_instance ? query.message.chat.id : query.chat.id;
  const text = !!query.chat_instance ? query.data : query.text;
  const id = query.id;
  const state = {
    chatId,
    text,
    id,
  };

  console.log("step => ", tariffMessages[chatId]?.step);

  if (!!tariffMessages[chatId]) {
    handleSteps(state);
  }
}
