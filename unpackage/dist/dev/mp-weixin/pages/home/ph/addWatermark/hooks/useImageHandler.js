"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const useImageHandler = () => {
  const imageInfo = common_vendor.ref(null);
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
        query.select(".content-main").boundingClientRect((data) => {
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
        width: imgInfo.width,
        height: imgInfo.height,
        x,
        y,
        drawWidth,
        drawHeight,
        canvasWidth: container.width,
        canvasHeight: container.height
      };
      common_vendor.index.__f__("log", "at pages/home/ph/addWatermark/hooks/useImageHandler.js:84", "图片信息:", imageInfo.value);
      return imageInfo.value;
    } catch (error) {
      common_vendor.index.__f__("error", "at pages/home/ph/addWatermark/hooks/useImageHandler.js:88", "选择图片失败:", error);
      common_vendor.index.showToast({
        title: "选择图片失败",
        icon: "none"
      });
    } finally {
      isProcessing.value = false;
    }
  };
  return {
    imageInfo,
    isProcessing,
    handleImageSelect
  };
};
exports.useImageHandler = useImageHandler;
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/pages/home/ph/addWatermark/hooks/useImageHandler.js.map
