"use strict";
const api_index = require("../index.js");
const armorTransformation = (params) => {
  return api_index.http.post("wx/users/xcx/login", params);
};
exports.armorTransformation = armorTransformation;
