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
      fail(err) {
        console.log(err);
        reject(err);
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
        fail: (err) => {
          reject(err);
        }
      });
    });
  };
  const getUserInfo = () => {
    return new Promise((resolve, reject) => {
      common_vendor.index.getUserInfo({
        provider: "weixin",
        desc: "获取你的昵称、头像、地区及性别",
        lang: "zh_CN",
        timeout: 3e3,
        success(res) {
          resolve(res);
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  };
  return Promise.all([login(), getUserInfo()]).then(async (res) => {
    if (res[0].code) {
      try {
        const data = await api_apis_user.armorTransformation({
          authInfo: {
            code: res[0].code,
            userInfo: res[1]
          }
        });
        debugger;
        showToast("登录成功");
        const { is_admins, token, user_id, user_nickname, user_profile_photo, user_info } = data.result;
        console.log("data.result", data.result);
        common_vendor.index.setStorageSync("token", token);
        common_vendor.index.setStorageSync("userInfo", { is_admins, user_id, user_nickname, user_profile_photo, user_info });
      } catch (err) {
        console.log(err);
      }
    }
  });
};
exports.getLoginFn = getLoginFn;
exports.getSetting = getSetting;
exports.showToast = showToast;
