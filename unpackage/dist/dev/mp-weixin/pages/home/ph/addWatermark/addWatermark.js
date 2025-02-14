"use strict";
const common_vendor = require("../../../../common/vendor.js");
const pages_home_ph_addWatermark_hooks_useImageHandler = require("./hooks/useImageHandler.js");
const pages_home_ph_addWatermark_hooks_useWatermark = require("./hooks/useWatermark.js");
const pages_home_ph_addWatermark_hooks_useWatermarkForm = require("./hooks/useWatermarkForm.js");
const pages_home_ph_addWatermark_components_watermarkConfig = require("./components/watermarkConfig.js");
if (!Array) {
  const _easycom_u_image2 = common_vendor.resolveComponent("u-image");
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_popup2 = common_vendor.resolveComponent("u-popup");
  (_easycom_u_image2 + _easycom_u_icon2 + _easycom_u_popup2)();
}
const _easycom_u_image = () => "../../../../uni_modules/uview-plus/components/u-image/u-image.js";
const _easycom_u_icon = () => "../../../../uni_modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_popup = () => "../../../../uni_modules/uview-plus/components/u-popup/u-popup.js";
if (!Math) {
  (_easycom_u_image + _easycom_u_icon + WatermarkTypeSelector + WatermarkForm + _easycom_u_popup + page)();
}
const page = () => "../../../../components/pages/page.js";
const WatermarkTypeSelector = () => "./components/WatermarkTypeSelector.js";
const WatermarkForm = () => "./components/WatermarkForm.js";
const _sfc_main = {
  __name: "addWatermark",
  setup(__props) {
    const watermarkType = common_vendor.ref(1);
    const currentStyle = common_vendor.ref(pages_home_ph_addWatermark_components_watermarkConfig.WATERMARK_TYPES[0].style);
    const { imageInfo, isProcessing, handleImageSelect } = pages_home_ph_addWatermark_hooks_useImageHandler.useImageHandler();
    const { addWatermark } = pages_home_ph_addWatermark_hooks_useWatermark.useWatermark("watermark");
    const { formData, getFormFields, validateForm, resetForm } = pages_home_ph_addWatermark_hooks_useWatermarkForm.useWatermarkForm();
    common_vendor.onMounted(async () => {
      try {
        const containerRect = await new Promise((resolve, reject) => {
          const query = common_vendor.index.createSelectorQuery();
          query.select(".preview-wrapper").boundingClientRect((data) => {
            if (!data) {
              reject(new Error("未能获取容器尺寸"));
              return;
            }
            resolve(data);
          }).exec();
        });
        const setCanvasDimensions = (width, height) => {
          imageInfo.value.canvasWidth = width;
          imageInfo.value.canvasHeight = height;
        };
        setCanvasDimensions(containerRect.width, containerRect.height);
        common_vendor.index.__f__("log", "at pages/home/ph/addWatermark/addWatermark.vue:40", "容器初始化完成，尺寸：", containerRect);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/home/ph/addWatermark/addWatermark.vue:43", "容器初始化失败:", error);
        common_vendor.index.showToast({
          title: "初始化失败，请重试",
          icon: "none"
        });
      }
    });
    const handleTypeChange = (item) => {
      common_vendor.index.__f__("log", "at pages/home/ph/addWatermark/addWatermark.vue:53", "style", item);
      currentStyle.value = item.style;
      watermarkType.value = item.id;
      if (imageInfo.value) {
        updateWatermark();
      }
    };
    const updateWatermark = async () => {
      common_vendor.index.__f__("log", "at pages/home/ph/addWatermark/addWatermark.vue:62", "formData", formData.value);
      if (!imageInfo.value || !imageInfo.value.path || !currentStyle.value)
        return;
      try {
        const info = imageInfo.value;
        await addWatermark({
          image: info,
          style: currentStyle.value,
          info: formData.value
        });
        const OFFSET = 0.2;
        const SIZE_ADJUSTMENT = 0.5;
        const { x, y, drawWidth, drawHeight } = info;
        const { tempFilePath } = await common_vendor.index.canvasToTempFilePath({
          canvasId: "watermark",
          fileType: "png",
          // PNG 格式保证无损
          quality: 1,
          // 图片质量最高
          x: x + OFFSET,
          // 左上角 x 坐标偏移
          y: y + OFFSET,
          // 左上角 y 坐标偏移
          width: drawWidth - SIZE_ADJUSTMENT,
          // 宽度调整
          height: drawHeight - SIZE_ADJUSTMENT
          // 高度调整
        });
        common_vendor.index.__f__("log", "at pages/home/ph/addWatermark/addWatermark.vue:93", "生成图片成功", tempFilePath);
        info.url = tempFilePath;
        const canvasContext = common_vendor.index.createCanvasContext("watermark");
        canvasContext.clearRect(0, 0, info.canvasWidth, info.canvasHeight);
        canvasContext.draw();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/home/ph/addWatermark/addWatermark.vue:102", "更新水印出错", error);
        common_vendor.index.showToast({
          title: "更新水印出错",
          icon: "none"
        });
      }
    };
    const onImageSelect = async () => {
      if (isProcessing.value)
        return;
      const image = await handleImageSelect();
      if (image) {
        await updateWatermark();
      }
    };
    const generateImage = async () => {
      if (!imageInfo.value) {
        common_vendor.index.showToast({
          title: "请先选择图片",
          icon: "none"
        });
        return;
      }
      try {
        const { x, y, drawWidth, drawHeight } = imageInfo.value;
        common_vendor.index.__f__("log", "at pages/home/ph/addWatermark/addWatermark.vue:129", imageInfo.value.url);
        const tempFilePath = imageInfo.value.url;
        common_vendor.index.__f__("log", "at pages/home/ph/addWatermark/addWatermark.vue:141", "生成图片成功", tempFilePath);
        common_vendor.index.showToast({
          title: "生成图片成功",
          icon: "success"
        });
        common_vendor.index.previewImage({
          urls: [tempFilePath],
          longPressActions: {
            itemList: ["保存图片"],
            success: function(data) {
              if (data.tapIndex === 0) {
                common_vendor.index.saveImageToPhotosAlbum({
                  filePath: tempFilePath,
                  success: function() {
                    common_vendor.index.showToast({
                      title: "保存成功",
                      icon: "success"
                    });
                  },
                  fail: function(err) {
                    common_vendor.index.__f__("error", "at pages/home/ph/addWatermark/addWatermark.vue:164", "保存失败", err);
                    common_vendor.index.showToast({
                      title: "保存失败",
                      icon: "none"
                    });
                  }
                });
              }
            },
            fail: function(err) {
              common_vendor.index.__f__("error", "at pages/home/ph/addWatermark/addWatermark.vue:174", "长按操作失败", err);
            }
          }
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/home/ph/addWatermark/addWatermark.vue:179", "生成图片出错", error);
        common_vendor.index.showToast({
          title: "生成图片出错",
          icon: "none"
        });
      }
    };
    const show = common_vendor.ref(false);
    function open() {
      show.value = true;
    }
    function closePopup() {
      show.value = false;
      updateWatermark();
    }
    return (_ctx, _cache) => {
      var _a, _b, _c, _d, _e, _f, _g;
      return common_vendor.e({
        a: (_a = common_vendor.unref(imageInfo)) == null ? void 0 : _a.url
      }, ((_b = common_vendor.unref(imageInfo)) == null ? void 0 : _b.url) ? {
        b: common_vendor.p({
          src: (_c = common_vendor.unref(imageInfo)) == null ? void 0 : _c.url,
          mode: "aspectFit",
          ["lazy-load"]: true,
          fade: true,
          ["show-menu-by-longpress"]: true,
          width: ((_d = common_vendor.unref(imageInfo)) == null ? void 0 : _d.canvasWidth) + "px",
          height: ((_e = common_vendor.unref(imageInfo)) == null ? void 0 : _e.canvasHeight) + "px"
        })
      } : {
        c: common_vendor.p({
          name: "camera-fill",
          size: "40",
          color: "#999"
        })
      }, {
        d: common_vendor.o(onImageSelect),
        e: ((_f = common_vendor.unref(imageInfo)) == null ? void 0 : _f.canvasWidth) + "px",
        f: ((_g = common_vendor.unref(imageInfo)) == null ? void 0 : _g.canvasHeight) + "px",
        g: common_vendor.o(handleTypeChange),
        h: common_vendor.o(($event) => watermarkType.value = $event),
        i: common_vendor.p({
          modelValue: watermarkType.value
        }),
        j: currentStyle.value
      }, currentStyle.value ? {
        k: common_vendor.o(($event) => common_vendor.isRef(formData) ? formData.value = $event : null),
        l: common_vendor.p({
          fields: common_vendor.unref(getFormFields)(currentStyle.value),
          disabled: common_vendor.unref(isProcessing),
          modelValue: common_vendor.unref(formData)
        })
      } : {}, {
        m: common_vendor.o(closePopup),
        n: common_vendor.o(open),
        o: common_vendor.p({
          show: show.value,
          mode: "bottom",
          closeable: true,
          overlay: true,
          safeAreaInsetBottom: true,
          round: 10
        }),
        p: common_vendor.o(generateImage),
        q: common_vendor.o(($event) => show.value = true),
        r: common_vendor.p({
          title: "添加水印",
          rButton: "生成图片",
          lButton: "编辑",
          rButtonDisabled: common_vendor.unref(isProcessing)
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-5bd6fc7f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/pages/home/ph/addWatermark/addWatermark.js.map
