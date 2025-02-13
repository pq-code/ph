"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const useWatermark = (canvasId) => {
  const addWatermark = async ({ image, style, info }) => {
    if (!(image == null ? void 0 : image.path)) {
      common_vendor.index.__f__("error", "at pages/home/ph/addWatermark/hooks/useWatermark.js:7", "无效的图片路径");
      return;
    }
    try {
      const ctx = common_vendor.index.createCanvasContext(canvasId);
      ctx.clearRect(0, 0, image.canvasWidth, image.canvasHeight);
      ctx.drawImage(
        image.path,
        image.x,
        image.y,
        image.drawWidth,
        image.drawHeight
      );
      await new Promise((resolve) => ctx.draw(false, resolve));
    } catch (error) {
      common_vendor.index.__f__("error", "at pages/home/ph/addWatermark/hooks/useWatermark.js:30", "绘制失败:", error);
      common_vendor.index.showToast({
        title: "绘制失败",
        icon: "none"
      });
    }
  };
  return {
    addWatermark
  };
};
exports.useWatermark = useWatermark;
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/pages/home/ph/addWatermark/hooks/useWatermark.js.map
