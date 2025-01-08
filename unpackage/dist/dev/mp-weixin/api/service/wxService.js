"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_index = require("../../utils/index.js");
const api_error_errTips = require("../error/errTips.js");
let baseURL = "https://pqartstation.cn/";
let token = common_vendor.index.getStorageSync("token");
const wxService = (urls, config, method) => {
  let url = baseURL + urls;
  let data = {
    provider: "weixin",
    // 微信登录标识
    ...config
  };
  let header;
  if (method == "POST") {
    header = {
      "content-type": "application/x-www-form-urlencoded"
    };
  } else {
    header = {
      "content-type": "application/json"
    };
  }
  if (token) {
    header.Authorization = token;
  }
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url,
      method,
      header: Object.assign({}, header),
      data,
      dataType: "json",
      timeout: 1e3 * 60 * 1,
      success: (data2) => {
        const res = data2.data;
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
      },
      fail: (err) => {
        let message = "";
        switch (err) {
          case 401:
            message = "token 失效，请重新登录";
            utils_index.getSetting("scope.record").then((res) => {
              utils_index.getLoginFn().then((res2) => {
                console.log("res", res2);
              });
            });
            break;
          case 403:
            message = "拒绝访问";
            break;
          case 404:
            message = "请求地址错误";
            break;
          case 500:
            message = "服务器故障";
            break;
          default:
            message = "网络连接故障";
        }
        utils_index.showToast(message);
        reject(err);
      },
      complete: () => {
        common_vendor.index.hideLoading();
      }
    });
  });
};
exports.wxService = wxService;
