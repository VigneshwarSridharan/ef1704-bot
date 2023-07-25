"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const change_case_1 = require("change-case");
const APIService_1 = require("../utils/APIService");
const Bot_1 = __importDefault(require("../utils/Bot"));
const constants_1 = require("../utils/constants");
const tariffMessages = {};
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
const getConsignmentTariff = (state) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId, text, id } = state;
    const tariffMessage = tariffMessages[chatId];
    try {
        const { payload } = tariffMessage;
        const { data } = yield APIService_1.BaseService.post(constants_1.SERVICES.GET_PRICE_AND_TAT, payload);
        const volumetricWeight = payload.courierType === "NON-DOCUMENT"
            ? (payload.length * payload.height * payload.breadth) / 5000
            : 0;
        const volumetricWeightString = payload.courierType === "NON-DOCUMENT"
            ? `
*Volumetric Weight:* ${volumetricWeight.toFixed(2)} KG
${payload.length} x ${payload.breadth} x ${payload.height} / 5000 = ${volumetricWeight.toFixed(2)} KG      `
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
                    .sort((a, b) => (Number(a === null || a === void 0 ? void 0 : a.price) > Number(b === null || b === void 0 ? void 0 : b.price) ? -1 : 1))
                    .map((item) => [
                    {
                        text: `${item.serviceType} (${item.period}) \n ₹${item.price} `,
                        callback_data: item.serviceType,
                    },
                ]),
            },
        };
        Bot_1.default.sendMessage(chatId, payloadMessage, {
            parse_mode: "Markdown",
        });
        setTimeout(() => {
            Bot_1.default.sendMessage(chatId, "- - - - - - - - - - - - - Price Details - - - - - - - - - - - - -", priceOptions);
        }, 100);
    }
    catch (err) {
        console.log(err);
        Bot_1.default.sendMessage(chatId, "Error: " + err.toString());
    }
});
const getDeliveryPincode = (state) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId, text } = state;
    const tariffMessage = tariffMessages[chatId];
    if (tariffMessage.step === constants_1.STEPS.DELIVERY_PINCODE_SELECTION) {
        if (!/^[0-9]{6}$/.test(text)) {
            Bot_1.default.sendMessage(chatId, "Invalid delivery pincode");
            return;
        }
        try {
            const { data } = yield APIService_1.BaseService.get(constants_1.SERVICES.GET_USER_SEARCH, {
                phone: "",
                id: "efrbooking",
                searchString: text,
                flag: "delivery",
            });
            if (data.serviceablePincode.value) {
                const { destinationPincodeCity, state } = data.serviceablePincode;
                tariffMessage.payload.deliveryPincode = text;
                tariffMessage.step = constants_1.STEPS.DOCUMENT_TYPE_SELECTION;
                Bot_1.default.sendMessage(chatId, `Area ${(0, change_case_1.sentenceCase)(destinationPincodeCity)}, ${(0, change_case_1.sentenceCase)(state)} is serviceable 👍`);
                setTimeout(() => {
                    Bot_1.default.sendMessage(chatId, `Select Document Type`, documentsOptions);
                }, 500);
                return true;
            }
            else {
                Bot_1.default.sendMessage(chatId, "Area not serviceable 😞");
            }
        }
        catch (err) {
            console.log(err);
            Bot_1.default.sendMessage(chatId, "Error: " + err.toString());
        }
    }
});
const getDocumentType = (state) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId, text } = state;
    const tariffMessage = tariffMessages[chatId];
    if (tariffMessage.step === constants_1.STEPS.DOCUMENT_TYPE_SELECTION) {
        tariffMessage.payload.courierType = text;
        tariffMessage.step = constants_1.STEPS.DOCUMENT_WEIGHT_SELECTION;
        if (text === "DOCUMENT") {
            Bot_1.default.sendMessage(chatId, "Select Document Weight", documentWeightOptions);
        }
        if (text === "NON-DOCUMENT") {
            tariffMessage.step = constants_1.STEPS.NON_DOCUMENT_WEIGHT_SELECTION;
            tariffMessage.payload.declaredPrice = "1000";
            Bot_1.default.sendMessage(chatId, "Enter Non Document Weight in KG (eg: 1.5)");
        }
        return true;
    }
});
const getDocumentWeight = (state) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId, text, id } = state;
    const tariffMessage = tariffMessages[chatId];
    if (tariffMessage.step == constants_1.STEPS.DOCUMENT_WEIGHT_SELECTION) {
        const weight = text.replace("DOCUMENT_WEIGHT_", "");
        tariffMessage.payload.weight = weight;
        yield getConsignmentTariff(state);
        return true;
    }
});
const getNonDocumentWeight = (state) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId, text, id } = state;
    const tariffMessage = tariffMessages[chatId];
    if (tariffMessage.step === constants_1.STEPS.NON_DOCUMENT_WEIGHT_SELECTION) {
        const weight = Number(text);
        tariffMessage.payload.weight = (weight * 1000).toString();
        tariffMessage.step = constants_1.STEPS.NON_DOCUMENT_LENGTH_SELECTION;
        Bot_1.default.sendMessage(chatId, "Enter Non Document Length in CM (eg: 10)", centimetreOptions);
        return true;
    }
});
const getNonDocumentLength = (state) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId, text, id } = state;
    const tariffMessage = tariffMessages[chatId];
    if (tariffMessage.step === constants_1.STEPS.NON_DOCUMENT_LENGTH_SELECTION) {
        tariffMessage.payload["length"] = text;
        tariffMessage.step = constants_1.STEPS.NON_DOCUMENT_BREADTH_SELECTION;
        Bot_1.default.sendMessage(chatId, "Enter Non Document Breadth in CM (eg: 10)", centimetreOptions);
        return true;
    }
});
const getNonDocumentBreadth = (state) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId, text, id } = state;
    const tariffMessage = tariffMessages[chatId];
    if (tariffMessage.step === constants_1.STEPS.NON_DOCUMENT_BREADTH_SELECTION) {
        tariffMessage.payload.breadth = text;
        tariffMessage.step = constants_1.STEPS.NON_DOCUMENT_HEIGHT_SELECTION;
        Bot_1.default.sendMessage(chatId, "Enter Non Document Height in CM (eg: 10)", centimetreOptions);
        return true;
    }
});
const getNonDocumentHeight = (state) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId, text, id } = state;
    const tariffMessage = tariffMessages[chatId];
    if (tariffMessage.step === constants_1.STEPS.NON_DOCUMENT_HEIGHT_SELECTION) {
        tariffMessage.payload.height = text;
        yield getConsignmentTariff(state);
        return true;
    }
});
const handleSteps = (state) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId, text } = state;
    const tariffMessage = tariffMessages[chatId];
    Bot_1.default.sendChatAction(chatId, "typing");
    if (yield getDeliveryPincode(state))
        return;
    if (yield getDocumentType(state))
        return;
    if (yield getDocumentWeight(state))
        return;
    if (yield getNonDocumentWeight(state))
        return;
    if (yield getNonDocumentLength(state))
        return;
    if (yield getNonDocumentBreadth(state))
        return;
    if (yield getNonDocumentHeight(state))
        return;
});
const GetTariffAction = (query) => {
    var _a;
    const chatId = !!query.chat_instance ? query.message.chat.id : query.chat.id;
    const text = !!query.chat_instance ? query.data : query.text;
    const id = query.id;
    const state = {
        chatId,
        text,
        id,
    };
    if (text === "/tariff") {
        tariffMessages[chatId] = {
            step: constants_1.STEPS.DELIVERY_PINCODE_SELECTION,
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
        Bot_1.default.sendMessage(chatId, "Please enter delivery pincode");
        return;
    }
    console.log("step => ", (_a = tariffMessages[chatId]) === null || _a === void 0 ? void 0 : _a.step);
    if (!!tariffMessages[chatId]) {
        handleSteps(state);
    }
};
exports.default = GetTariffAction;
//# sourceMappingURL=TariffAction.js.map