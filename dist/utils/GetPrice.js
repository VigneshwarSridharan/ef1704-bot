const axios = require("axios");
let data = JSON.stringify({
    deliveryPincode: "638008",
    pickupPincode: "636008",
    weight: "100",
    courierType: "DOCUMENT",
    id: "efrDom",
});
let config = {
    method: "post",
    //   maxBodyLength: Infinity,
    url: "https://ebookingbackend.shipsy.in/getPriceAndTATPudo",
    headers: {
        Authorization: "YmFDMvpFW2Zgy1RsL1kIHALayDA9JGK-IlNam4Lmo3iD6Xb97OIZNHaeaLcgTwEO EF1704",
        "Content-Type": "application/json",
    },
    data: data,
};
axios
    .request(config)
    .then((response) => {
    console.log(JSON.stringify(response.data));
})
    .catch((error) => {
    console.log(error);
});
//# sourceMappingURL=GetPrice.js.map