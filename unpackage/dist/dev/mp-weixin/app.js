"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/home/home.js";
  "./pages/home/ph/jigsawPuzzle/jigsawPuzzle.js";
  "./pages/home/ph/addWatermark/addWatermark.js";
  "./pages/home/components/imageCropper/imageCropper.js";
}
const _sfc_main = {
  onLaunch: function() {
    console.log("App Launch");
    const systemInfo = common_vendor.index.getSystemInfoSync();
    if (systemInfo.platform == "tt" || systemInfo.platform == "devtools") {
      common_vendor.wx$1.cloud.init({
        "env": "prod-8gqm1nbtf8eae76e",
        // 云环境id
        traceUser: true
      });
    }
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.use(common_vendor.createPinia());
  app.use(common_vendor.uviewPlus);
  return {
    app,
    Pinia: common_vendor.Pinia
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
