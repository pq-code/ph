"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const useWatermark = (canvasId) => {
  const drawCenterWatermark = (ctx, imageRect) => {
    const { x: imageX, y: imageY, drawWidth: imageWidth, drawHeight: imageHeight } = imageRect;
    ctx.save();
    const centerX = imageX + imageWidth / 2;
    const centerY = imageY + imageHeight / 2;
    const centerFontSize = Math.min(imageWidth, imageHeight) * 0.08;
    ctx.translate(centerX, centerY);
    ctx.setTextAlign("center");
    ctx.setTextBaseline("middle");
    ctx.setFontSize(centerFontSize);
    ctx.font = `bold ${centerFontSize}px sans-serif`;
    const centerText = "现场拍照";
    ctx.setGlobalAlpha(0.5);
    ctx.setLineWidth(2);
    ctx.setStrokeStyle("#FFFFFF");
    ctx.strokeText(centerText, 0, 0);
    ctx.setGlobalAlpha(0.5);
    ctx.setFillStyle("#666666");
    ctx.fillText(centerText, 0, 0);
    ctx.restore();
  };
  const drawBottomWatermark = (ctx, imageRect, info) => {
    const { x: imageX, y: imageY, drawWidth: imageWidth, drawHeight: imageHeight } = imageRect;
    const fontSize = 14;
    ctx.setFontSize(fontSize);
    ctx.setTextAlign("left");
    ctx.setTextBaseline("top");
    const watermarkLines = [
      `经度：${info.longitude || "121.0126"}`,
      `纬度：${info.latitude || "31.288511"}`,
      `坐标：WGS84坐标系`,
      `地址：${info.address || ""}`,
      `时间：${info.datetime || common_vendor.dayjs().format("YYYY-MM-DD HH:mm:ss")}`,
      `备注：${info.remark || "编辑备注"}`
    ];
    const padding = 10;
    const lineHeight = fontSize * 1.5;
    const totalHeight = watermarkLines.length * lineHeight;
    let currentY = imageY + imageHeight - totalHeight - padding;
    ctx.setGlobalAlpha(1);
    ctx.setFillStyle("#FFFFFF");
    watermarkLines.forEach((line) => {
      ctx.fillText(line, imageX + padding * 1, currentY);
      currentY += lineHeight;
    });
  };
  const drawStandardWatermark = (ctx, imageRect, info) => {
    const { x: imageX, y: imageY, drawWidth: imageWidth, drawHeight: imageHeight } = imageRect;
    const fontSize = info.fontSize || 18;
    ctx.save();
    ctx.setFontSize(fontSize);
    ctx.setTextAlign("center");
    ctx.setTextBaseline("middle");
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.translate(imageX + imageWidth / 2, imageY + imageHeight / 2);
    ctx.rotate((info.angle || -15) * Math.PI / 180);
    ctx.setGlobalAlpha((info.opacity ?? 30) / 100);
    const watermarkText = info.watermarkContent || "保密";
    const spacing = info.density || 100;
    const repeatX = Math.ceil(imageWidth / spacing) + 2;
    const repeatY = Math.ceil(imageHeight / spacing) + 2;
    ctx.strokeStyle = info.strokeColor || "#FFFFFF";
    ctx.lineWidth = info.strokeWidth || 2;
    ctx.setFillStyle(info.fillColor || "#666666");
    for (let x = -repeatX; x <= repeatX; x++) {
      for (let y = -repeatY; y <= repeatY; y++) {
        ctx.strokeText(watermarkText, x * spacing, y * spacing);
        ctx.fillText(watermarkText, x * spacing, y * spacing);
      }
    }
    ctx.restore();
  };
  const addWatermark = async ({ image, style, info }) => {
    if (!(image == null ? void 0 : image.path)) {
      common_vendor.index.__f__("error", "at pages/home/ph/addWatermark/hooks/useWatermark.js:118", "无效的图片路径");
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
      const imageRect = {
        x: image.x,
        y: image.y,
        drawWidth: image.drawWidth,
        drawHeight: image.drawHeight
      };
      if (style.id === 1) {
        if (info.isOnSitePhotography) {
          drawCenterWatermark(ctx, imageRect);
        }
        drawBottomWatermark(ctx, imageRect, info);
      } else if (style.id === 2) {
        drawStandardWatermark(ctx, imageRect, info);
      }
      await new Promise((resolve) => ctx.draw(false, resolve));
    } catch (error) {
      common_vendor.index.__f__("error", "at pages/home/ph/addWatermark/hooks/useWatermark.js:160", "绘制失败:", error);
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
