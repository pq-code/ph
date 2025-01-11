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
  },
  patch: (url, config) => {
    return requset(url, config, "patch");
  }
};
const wxRequset = async (url, config, method) => {
  let SERVICE = "login";
  if (url.startsWith("users")) {
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
        "X-WX-SERVICE": SERVICE,
        "authorization": common_vendor.index.getStorageSync("token")
      },
      "method": method,
      "data": config
    });
    const res = data.data;
    if (res.code == 0) {
      resolve(res);
    } else if (res.error == "10101") {
      utils_index.showToast("token已过期重新登录");
      utils_index.wxUserlLogin().then((res2) => {
        common_vendor.index.__f__("log", "at api/index.js:44", "res", res2);
        resolve(res2);
      }, (rej) => {
        reject(rej);
      });
    } else {
      utils_index.showToast(api_error_errTips.errTips[res.error] || res.message || "未知错误");
      reject(res);
    }
  });
};
async function requset(url, config = {}, method) {
  common_vendor.index.getSystemInfoSync();
  if (config && !config.hideLoading) {
    common_vendor.index.showLoading({
      title: "加载中..."
    });
  }
  try {
    let res;
    if (true) {
      return wxRequset(url, config, method);
    }
  } catch (err) {
    common_vendor.index.__f__("error", "at api/index.js:73", err);
    return Promise.reject(err);
  } finally {
    if (config && !config.hideLoading) {
      common_vendor.index.hideLoading();
    }
  }
}
exports.http = http;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/index.js.map
