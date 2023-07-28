import axios from "axios";
import {
  DASHBOARD_BACKEND_BASE_URL,
  DASHBOARD_SERVICES,
  EBOOKING_BACKEND_BASE_URL,
} from "./constants";
import { botStore } from "./store";
import moment from "moment";
import { get } from "lodash";

const EBookingAPIService = axios.create({
  baseURL: EBOOKING_BACKEND_BASE_URL,
});

const eBookingheaders = {
  Authorization:
    "YmFDMvpFW2Zgy1RsL1kIHALayDA9JGK-IlNam4Lmo3iD6Xb97OIZNHaeaLcgTwEO EF1704",
  "Content-Type": "application/json",
};

export const EBookingService = {
  get: (url, params) =>
    EBookingAPIService.request({
      method: "get",
      url,
      headers: eBookingheaders,
      params,
    }).then((res) => res.data),
  post: (url, data) =>
    EBookingAPIService.request({
      method: "post",
      // //   maxBodyLength: Infinity,
      url,
      headers: eBookingheaders,

      data: JSON.stringify(data),
    }).then((res) => res.data),
};

const DashboardAPIService = axios.create({
  baseURL: DASHBOARD_BACKEND_BASE_URL,
});

const withAuth = async (config) => {
  const accessToken =
    botStore.get("dashboardService.accessToken").value() || {};
  let { id, expiry_at } = accessToken || {};
  if (!moment().isBefore(moment(expiry_at))) {
    let headersList = {
      "Organisation-Pretty-Name": "dtdcdashboard",
      "Content-Type": "application/json",
    };

    let bodyContent = JSON.stringify({
      username: "EF1704_DEFAULT",
      password: "password_EF1704",
    });

    let reqOptions = {
      url: DASHBOARD_SERVICES.LOGIN,
      method: "POST",
      headers: headersList,
      data: bodyContent,
    };

    let response = await DashboardAPIService.request(reqOptions).then(
      (res) => res.data
    );
    const access_token = get(response, "data.access_token") || {};
    id = access_token.id;
    botStore.set("dashboardService.accessToken", access_token).write();
  }
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
    "Access-Token": id,
    "User-Id": "1680963761063593208",
    "Organisation-Id": "1",
  };
  return DashboardAPIService.request({
    headers,
    ...config,
  }).then((res) => res.data);
};

export const DashboardService = {
  get: (url, config = {}) => withAuth({ method: "get", url, ...config }),
  post: (url, data, config = {}) =>
    withAuth({
      method: "post",
      url,
      data: JSON.stringify(data),
      ...config,
    }),
};

// data: { status: 0, desc: 'Not Authorized' }
