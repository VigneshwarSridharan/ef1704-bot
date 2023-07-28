export const BOT_TOKEN = "6037269520:AAH9_hKA2LRaMLwX3lYjWum2NZPgmvAeHpY";

export const EBOOKING_BACKEND_BASE_URL = "https://ebookingbackend.shipsy.in";
export const DASHBOARD_BACKEND_BASE_URL = "https://dtdcapi.shipsy.io/api";

export const EFR_BOOKING_URL =
  "https://ebookingbackend.shipsy.in/getPriceAndTATPudo";

export const EBOOKING_SERVICES = {
  GET_PRICE_AND_TAT: `${EBOOKING_BACKEND_BASE_URL}/getPriceAndTATPudo`,
  GET_USER_SEARCH: `${EBOOKING_BACKEND_BASE_URL}/getUserSearchPudo`,
};

export const DASHBOARD_SERVICES = {
  DRS_DOWNLOAD: `/Dashboard/Mediums/1681618003457737948/printDRS`,
  LOGIN: `/dashboard/login`,
};

export const STEPS = {
  DELIVERY_PINCODE_SELECTION: "DELIVERY_PINCODE_SELECTION",
  DOCUMENT_TYPE_SELECTION: "DOCUMENT_TYPE_SELECTION",
  DOCUMENT_WEIGHT_SELECTION: "DOCUMENT_WEIGHT_SELECTION",
  NON_DOCUMENT_WEIGHT_SELECTION: "NON_DOCUMENT_WEIGHT_SELECTION",
  NON_DOCUMENT_LENGTH_SELECTION: "NON_DOCUMENT_LENGTH_SELECTION",
  NON_DOCUMENT_BREADTH_SELECTION: "NON_DOCUMENT_BREADTH_SELECTION",
  NON_DOCUMENT_HEIGHT_SELECTION: "NON_DOCUMENT_HEIGHT_SELECTION",
};

export const COMMANDS = {
  TARIFF: "/tariff",
  PINCODE: "/pincode",
  DRS: "/drs",
  HELP: "/help",
};
