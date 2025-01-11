"use strict";
const api_index = require("../index.js");
const armorTransformation = (params) => {
  return api_index.http.post("wx/users/xcx/login", params);
};
const editUserInfo = (params) => {
  return api_index.http.patch("users/editUserInfo", params);
};
const getUerInfo = (params) => {
  return api_index.http.post("users/getUerInfo", params);
};
exports.armorTransformation = armorTransformation;
exports.editUserInfo = editUserInfo;
exports.getUerInfo = getUerInfo;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/api/apis/user.js.map
