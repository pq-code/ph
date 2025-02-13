"use strict";
const common_vendor = require("../common/vendor.js");
class WatermarkRenderer {
  constructor(ctx) {
    this.ctx = ctx;
  }
  /**
   * 渲染水印
   */
  async render(options) {
    const { image, text, info } = options;
    await this.drawImage(image);
    this.drawCenterText(text, image);
    this.drawInfoText(info, image);
    this.ctx.draw(true);
  }
  /**
   * 绘制原始图片
   */
  async drawImage(image) {
    const { url, x, y, width, height } = image;
    this.ctx.clearRect(0, 0, width, height);
    await this.ctx.drawImage(url, x, y, width, height);
  }
  /**
   * 绘制中心水印文字
   */
  drawCenterText(text, image) {
    const { width, height, x, y } = image;
    this.ctx.save();
    const fontSize = Math.min(width, height) * 0.05;
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    this.ctx.setFontSize(fontSize);
    this.ctx.setTextAlign("center");
    this.ctx.setTextBaseline("middle");
    this.ctx.translate(centerX, centerY);
    this.ctx.setGlobalAlpha(1);
    this.ctx.setLineWidth(2);
    this.ctx.setStrokeStyle("#FFFFFF");
    this.ctx.strokeText(text, 0, 0);
    this.ctx.setGlobalAlpha(1);
    this.ctx.setFillStyle("#666666");
    this.ctx.font = `normal ${fontSize}px sans-serif`;
    this.ctx.fillText(text, 0, 0);
    this.ctx.restore();
  }
  /**
   * 绘制信息水印
   */
  drawInfoText(info, image) {
    const { width, height, x, y } = image;
    this.ctx.save();
    const fontSize = 12;
    this.ctx.setFontSize(fontSize);
    this.ctx.setTextAlign("left");
    this.ctx.setTextBaseline("top");
    this.ctx.setGlobalAlpha(1);
    this.ctx.setFillStyle("#FFFFFF");
    const lines = this.getWatermarkLines(info);
    const padding = 15;
    const lineHeight = fontSize + 2;
    let currentY = height - lines.length * lineHeight - padding + y;
    lines.forEach((line) => {
      this.ctx.setShadow(1, 1, 2, "rgba(0, 0, 0, 0.5)");
      this.ctx.fillText(line, padding + x, currentY);
      currentY += lineHeight;
    });
    this.ctx.restore();
  }
  /**
   * 获取水印文本行
   */
  getWatermarkLines(info) {
    const timestamp = common_vendor.dayjs().format("YYYY-MM-DD HH:mm:ss");
    return [
      `经度：${info.longitude}`,
      `纬度：${info.latitude}`,
      `坐标：WGS84坐标系`,
      `地址：${info.address}`,
      `时间：${timestamp}`,
      `备注：${info.notes || ""}`
    ];
  }
}
exports.WatermarkRenderer = WatermarkRenderer;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/watermarkRenderer.js.map
