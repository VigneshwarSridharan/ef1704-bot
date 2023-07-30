export const documentsOptions = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: "Document", callback_data: "DOCUMENT" },
        { text: "Non Document", callback_data: "NON-DOCUMENT" },
      ],
    ],
  },
};

export const documentWeightOptions = {
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
