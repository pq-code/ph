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
const getSetting = (scope) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.authorize({
      scope,
      success(data) {
        resolve(data);
      },
      fail(err2) {
        console.log(err2);
        reject(err2);
      }
    });
  });
};
const getLoginFn = () => {
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
  const getUserInfo = () => {
    return new Promise((resolve, reject) => {
      common_vendor.index.getUserInfo({
        provider: "weixin",
        desc: "获取你的昵称、头像,用于个性化展示",
        lang: "zh_CN",
        timeout: 3e3,
        success(res) {
          debugger;
          resolve(res);
        },
        fail: (err2) => {
          reject(err2);
        }
      });
    });
  };
  return Promise.all([login(), getUserInfo()]).then(async (res) => {
    if (res[0].code) {
      try {
        let data = {};
        if (true) {
          data = await api_apis_user.armorTransformation({
            code: res[0].code,
            userInfo: res[1]
          });
        }
        if (data.code == 0) {
          showToast("登录成功");
          const { token, userId, userName, userPassword, userSource, userSourceID, userNickname, userInfo, userProfilePhoto, sessionKey } = data.result;
          console.log("data.result", data.result);
          common_vendor.index.setStorageSync("token", token);
          common_vendor.index.setStorageSync("userInfo", { userId, userName, userPassword, userSource, userSourceID, userNickname, userInfo, userProfilePhoto, sessionKey });
          return data.result;
        } else {
          console.error("登录失败:", err);
        }
      } catch (err2) {
        console.error("登录失败:", err2);
      }
    }
  });
};
exports.getLoginFn = getLoginFn;
exports.getSetting = getSetting;
exports.showToast = showToast;
