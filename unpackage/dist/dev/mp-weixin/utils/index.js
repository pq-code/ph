"use strict";
const common_vendor = require("../common/vendor.js");
const api_apis_user = require("../api/apis/user.js");
const showToast = (e) => {
  common_vendor.index.showToast({
    icon: "none",
    position: "center",
    title: e
  });
};
const getLoginFn = async () => {
  try {
    let user = await api_apis_user.getUerInfo();
    if (user.code == 0) {
      return new Promise((resolve, reject) => {
        resolve(user);
      });
    }
  } catch (err2) {
    return wxUserlLogin();
  }
};
const wxUserlLogin = async () => {
  const login = () => {
    return new Promise((resolve, reject) => {
      common_vendor.index.login({
        provider: "weixin",
        searchFn: true,
        onlyAuthorize: true,
        success(res) {
          resolve(res);
        },
        fail: (err2) => {
          reject(err2);
        }
      });
    });
  };
  return new Promise(async (resolve, reject) => {
    let res = await Promise.all([login()]);
    common_vendor.index.__f__("log", "at utils/index.js:94", res);
    let data = {};
    if (res[0].code) {
      try {
        data = await api_apis_user.armorTransformation({
          code: res[0].code,
          userInfo: res[1] || {}
        });
        if (data.code == 0) {
          const {
            token,
            userId,
            userName,
            userPassword,
            userSource,
            userSourceID,
            userNickname,
            userInfo,
            userProfilePhoto,
            sessionKey
          } = data.result;
          common_vendor.index.setStorageSync("token", token);
          common_vendor.index.setStorageSync("userInfo", {
            userId,
            userName,
            userPassword,
            userSource,
            userSourceID,
            userNickname,
            userInfo,
            userProfilePhoto,
            sessionKey
          });
          common_vendor.index.hideLoading();
          resolve(data);
        } else {
          common_vendor.index.__f__("error", "at utils/index.js:133", "登录失败:", err);
          common_vendor.index.hideLoading();
          reject(data);
        }
      } catch (err2) {
        common_vendor.index.__f__("error", "at utils/index.js:138", "登录失败:", err2);
        common_vendor.index.hideLoading();
        reject(data);
      }
    }
  });
};
exports.getLoginFn = getLoginFn;
exports.showToast = showToast;
exports.wxUserlLogin = wxUserlLogin;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/index.js.map
