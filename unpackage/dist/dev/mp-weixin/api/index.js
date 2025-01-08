"use strict";
const common_vendor = require("../common/vendor.js");
const api_service_wxService = require("./service/wxService.js");
const utils_index = require("../utils/index.js");
const api_error_errTips = require("./error/errTips.js");
const http = {
  get: (url, config) => {
    return requset(url, config, "get");
  },
  post: (url, config) => {
    return requset(url, config, "post");
  }
};
const wxRequset = async (url, config, method) => {
  let SERVICE = "login";
  if (url.startsWith("wx/users")) {
    SERVICE = "login";
  } else {
    SERVICE = "koa-0jh8";
  }
  return new Promise(async (resolve, reject) => {
    let data = await common_vendor.wx$1.cloud.callContainer({
      "config": {
        "env": "prod-8gqm1nbtf8eae76e"
      },
      "path": url,
      "header": {
        "X-WX-SERVICE": SERVICE
      },
      "method": method,
      "data": config
    });
    const res = data.data;
    if (res.code == 0) {
      resolve(res);
    } else if (res.error == "10101") {
      utils_index.showToast("token已过期重新登录");
      utils_index.getSetting("scope.record").then((res2) => {
        utils_index.getLoginFn().then((res3) => {
          console.log("res", res3);
        });
      });
    } else {
      utils_index.showToast(api_error_errTips.errTips[res.code] || res.message || "未知错误");
    }
  });
};
async function requset(url, config = {}, method) {
  const systemInfo = common_vendor.index.getSystemInfoSync();
  if (config && !config.hideLoading) {
    common_vendor.index.showLoading({
      title: "加载中..."
    });
  }
  try {
    let res;
    if (systemInfo.platform === "tt" || systemInfo.platform === "devtools") {
      return wxRequset(url, config, method);
    } else {
      return api_service_wxService.wxService(url, config, method);
    }
  } catch (err) {
    console.error(err);
    return Promise.reject(err);
  } finally {
    if (config && !config.hideLoading) {
      common_vendor.index.hideLoading();
    }
  }
}
exports.http = http;
