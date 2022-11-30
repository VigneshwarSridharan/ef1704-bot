import axios from "axios";
import { EBOOKING_BACKEND_BASE_URL } from "./constants";

const APIService = axios.create({
  baseURL: EBOOKING_BACKEND_BASE_URL,
});

const headers = {
  Authorization:
    "YmFDMvpFW2Zgy1RsL1kIHALayDA9JGK-IlNam4Lmo3iD6Xb97OIZNHaeaLcgTwEO EF1704",
  "Content-Type": "application/json",
};

export const BaseService = {
  get: (url, params) =>
    APIService.request({
      method: "get",
      url,
      headers,
      params,
    }).then((res) => res.data),
  post: (url, data) =>
    APIService.request({
      method: "post",
      // //   maxBodyLength: Infinity,
      url,
      headers,

      data: JSON.stringify(data),
    }).then((res) => res.data),
};

// data: { status: 0, desc: 'Not Authorized' }
