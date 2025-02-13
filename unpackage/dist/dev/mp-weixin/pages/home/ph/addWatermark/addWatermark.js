"use strict";
const common_vendor = require("../../../../common/vendor.js");
const pages_home_ph_addWatermark_hooks_useImageHandler = require("./hooks/useImageHandler.js");
const pages_home_ph_addWatermark_hooks_useWatermark = require("./hooks/useWatermark.js");
const pages_home_ph_addWatermark_hooks_useWatermarkForm = require("./hooks/useWatermarkForm.js");
const pages_home_ph_addWatermark_components_watermarkConfig = require("./components/watermarkConfig.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  _easycom_u_icon2();
}
const _easycom_u_icon = () => "../../../../uni_modules/uview-plus/components/u-icon/u-icon.js";
if (!Math) {
  (_easycom_u_icon + WatermarkTypeSelector + WatermarkForm + page)();
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
    const handleTypeChange = (item) => {
      common_vendor.index.__f__("log", "at pages/home/ph/addWatermark/addWatermark.vue:20", "style", item);
      currentStyle.value = item.style;
      watermarkType.value = item.id;
      if (imageInfo.value) {
        updateWatermark();
      }
    };
    const updateWatermark = async () => {
      common_vendor.index.__f__("log", "at pages/home/ph/addWatermark/addWatermark.vue:30", "formData", formData.value);
      if (!imageInfo.value || !currentStyle.value)
        return;
      await addWatermark({
        image: imageInfo.value,
        style: currentStyle.value,
        info: formData.value
      });
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
        const { canvasWidth, canvasHeight } = imageInfo.value;
        const { tempFilePath } = await common_vendor.index.canvasToTempFilePath({
          canvasId: "watermark",
          fileType: "png",
          // 使用 PNG 格式以保证无损
          quality: 1,
          // 设置图片质量为最高
          x: 0,
          // 截取区域的左上角 x 坐标
          y: 0,
          // 截取区域的左上角 y 坐标
          width: canvasWidth,
          // 截取区域的宽度
          height: canvasHeight
          // 截取区域的高度
        });
        common_vendor.index.__f__("log", "at pages/home/ph/addWatermark/addWatermark.vue:70", "生成图片成功", tempFilePath);
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
                    common_vendor.index.__f__("error", "at pages/home/ph/addWatermark/addWatermark.vue:93", "保存失败", err);
                    common_vendor.index.showToast({
                      title: "保存失败",
                      icon: "none"
                    });
                  }
                });
              }
            },
            fail: function(err) {
              common_vendor.index.__f__("error", "at pages/home/ph/addWatermark/addWatermark.vue:103", "长按操作失败", err);
            }
          }
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/home/ph/addWatermark/addWatermark.vue:108", "生成图片出错", error);
        common_vendor.index.showToast({
          title: "生成图片出错",
          icon: "none"
        });
      }
    };
    return (_ctx, _cache) => {
      var _a, _b;
      return common_vendor.e({
        a: ((_a = common_vendor.unref(imageInfo)) == null ? void 0 : _a.canvasWidth) + "px",
        b: ((_b = common_vendor.unref(imageInfo)) == null ? void 0 : _b.canvasHeight) + "px",
        c: !common_vendor.unref(imageInfo)
      }, !common_vendor.unref(imageInfo) ? {
        d: common_vendor.p({
          name: "camera-fill",
          size: "40",
          color: "#999"
        })
      } : {}, {
        e: common_vendor.o(onImageSelect),
        f: common_vendor.o(handleTypeChange),
        g: common_vendor.o(($event) => watermarkType.value = $event),
        h: common_vendor.p({
          modelValue: watermarkType.value
        }),
        i: currentStyle.value
      }, currentStyle.value ? {
        j: common_vendor.o(updateWatermark),
        k: common_vendor.o(($event) => common_vendor.isRef(formData) ? formData.value = $event : null),
        l: common_vendor.p({
          fields: common_vendor.unref(getFormFields)(currentStyle.value),
          disabled: common_vendor.unref(isProcessing),
          modelValue: common_vendor.unref(formData)
        })
      } : {}, {
        m: common_vendor.o(generateImage),
        n: common_vendor.p({
          title: "添加水印",
          rButton: "生成图片",
          rButtonDisabled: common_vendor.unref(isProcessing)
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-5bd6fc7f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/pages/home/ph/addWatermark/addWatermark.js.map
