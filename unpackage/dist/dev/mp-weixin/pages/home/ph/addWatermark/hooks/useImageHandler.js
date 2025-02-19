"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const useImageHandler = (canvasId) => {
  const imageInfo = common_vendor.ref({
    canvasWidth: 0,
    canvasHeight: 0,
    url: ""
  });
  const originalImage = common_vendor.ref(null);
  const isProcessing = common_vendor.ref(false);
  const calculateDrawSize = (containerWidth, containerHeight, imageWidth, imageHeight) => {
    const containerRatio = containerWidth / containerHeight;
    const imageRatio = imageWidth / imageHeight;
    let drawWidth, drawHeight, x, y;
    if (imageRatio > containerRatio) {
      drawWidth = containerWidth;
      drawHeight = containerWidth / imageRatio;
      x = 0;
      y = (containerHeight - drawHeight) / 2;
    } else {
      drawHeight = containerHeight;
      drawWidth = containerHeight * imageRatio;
      x = (containerWidth - drawWidth) / 2;
      y = 0;
    }
    return { drawWidth, drawHeight, x, y };
  };
  const handleImageSelect = async () => {
    try {
      isProcessing.value = true;
      const { tempFiles } = await common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["original"],
        sourceType: ["album"]
      });
      const tempFile = tempFiles[0];
      const container = await new Promise((resolve) => {
        const query = common_vendor.index.createSelectorQuery();
        query.select(".preview-wrapper").boundingClientRect((data) => {
          resolve(data);
        }).exec();
      });
      const imgInfo = await new Promise((resolve, reject) => {
        common_vendor.index.getImageInfo({
          src: tempFile.path,
          success: resolve,
          fail: reject
        });
      });
      const { drawWidth, drawHeight, x, y } = calculateDrawSize(
        container.width,
        container.height,
        imgInfo.width,
        imgInfo.height
      );
      originalImage.value = tempFile;
      imageInfo.value = {
        path: tempFile.path,
        // 图片临时文件路径
        width: imgInfo.width,
        // 图片原始宽度（单位：px）
        height: imgInfo.height,
        // 图片原始高度（单位：px）
        fileSize: (tempFile.size / 1024).toFixed(0),
        // 文件体积（单位：KB，四舍五入取整）
        x,
        // 图片在画布中的水平起始位置（单位：px）
        y,
        // 图片在画布中的垂直起始位置（单位：px）
        drawWidth,
        // 图片在画布中的绘制宽度（适配容器后的尺寸）
        drawHeight,
        // 图片在画布中的绘制高度（适配容器后的尺寸）
        canvasWidth: container.width,
        // 画布容器实际宽度（预览区域宽度）
        canvasHeight: container.height
        // 画布容器实际高度（预览区域高度）
      };
      common_vendor.index.__f__("log", "at pages/home/ph/addWatermark/hooks/useImageHandler.js:88", "图片信息:", imageInfo.value);
      return imageInfo.value;
    } catch (error) {
      common_vendor.index.__f__("error", "at pages/home/ph/addWatermark/hooks/useImageHandler.js:92", "选择图片失败:", error);
      common_vendor.index.showToast({
        title: "选择图片失败",
        icon: "none"
      });
    } finally {
      isProcessing.value = false;
    }
  };
  const drawImage = async () => {
    try {
      const ctx = common_vendor.index.createCanvasContext(canvasId);
      ctx.clearRect(0, 0, imageInfo.canvasWidth, imageInfo.canvasHeight);
      ctx.drawImage(
        imageInfo.path,
        imageInfo.x,
        imageInfo.y,
        imageInfo.drawWidth,
        imageInfo.drawHeight
      );
      await new Promise((resolve) => ctx.draw(false, resolve));
    } catch (error) {
      common_vendor.index.__f__("error", "at pages/home/ph/addWatermark/hooks/useImageHandler.js:123", "绘制失败:", error);
      common_vendor.index.showToast({
        title: "绘制失败",
        icon: "none"
      });
    }
  };
  return {
    imageInfo,
    isProcessing,
    handleImageSelect,
    drawImage
  };
};
exports.useImageHandler = useImageHandler;
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/pages/home/ph/addWatermark/hooks/useImageHandler.js.map
