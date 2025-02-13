"use strict";
const common_vendor = require("../common/vendor.js");
const utils_watermarkRenderer = require("../utils/watermarkRenderer.js");
function useWatermark(canvasId) {
  const renderer = common_vendor.ref(null);
  const initRenderer = () => {
    const ctx = common_vendor.index.createCanvasContext(canvasId);
    renderer.value = new utils_watermarkRenderer.WatermarkRenderer(ctx);
  };
  const addWatermark = async (options) => {
    try {
      if (!renderer.value) {
        initRenderer();
      }
      await renderer.value.render(options);
      return true;
    } catch (error) {
      common_vendor.index.__f__("error", "at hooks/useWatermark.js:27", "水印添加失败:", error);
      common_vendor.index.showToast({
        title: "水印添加失败",
        icon: "none"
      });
      return false;
    }
  };
  return {
    addWatermark
  };
}
exports.useWatermark = useWatermark;
//# sourceMappingURL=../../.sourcemap/mp-weixin/hooks/useWatermark.js.map
