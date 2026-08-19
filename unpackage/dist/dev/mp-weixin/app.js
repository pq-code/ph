"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/home/home.js";
  "./pages/home/ph/jigsawPuzzle/jigsawPuzzle.js";
  "./pages/home/ph/customize/customize.js";
  "./pages/home/ph/perlerBead/perlerBead.js";
  "./pages/home/ph/perlerBead/patternEditor.js";
  "./pages/home/ph/perlerBead/exportSettings.js";
  "./pages/home/ph/aiGenerate/aiGenerate.js";
  "./pages/home/ph/addWatermark/addWatermark.js";
  "./pages/home/square/square.js";
  "./pages/home/square/patternDetail.js";
  "./pages/home/components/imageCropper/imageCropper.js";
  "./pages/user/home.js";
  "./pages/user/settings.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:4", "App Launch");
    if (common_vendor.wx$1.cloud) {
      common_vendor.wx$1.cloud.init({
        env: "prod-8gqm1nbtf8eae76e",
        traceUser: true
      });
    }
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:15", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:18", "App Hide");
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
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
