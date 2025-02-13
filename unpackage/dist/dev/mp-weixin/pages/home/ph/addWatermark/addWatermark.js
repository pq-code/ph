"use strict";
const common_vendor = require("../../../../common/vendor.js");
const pages_home_ph_addWatermark_hooks_useImageHandler = require("./hooks/useImageHandler.js");
const pages_home_ph_addWatermark_hooks_useWatermark = require("./hooks/useWatermark.js");
const pages_home_ph_addWatermark_hooks_useWatermarkForm = require("./hooks/useWatermarkForm.js");
const pages_home_ph_addWatermark_constants_watermarkConfig = require("./constants/watermarkConfig.js");
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
    const currentStyle = common_vendor.ref(pages_home_ph_addWatermark_constants_watermarkConfig.WATERMARK_TYPES[0].style);
    const { imageInfo, isProcessing, handleImageSelect } = pages_home_ph_addWatermark_hooks_useImageHandler.useImageHandler();
    const { addWatermark } = pages_home_ph_addWatermark_hooks_useWatermark.useWatermark("watermark");
    const { formData, getFormFields, validateForm, resetForm } = pages_home_ph_addWatermark_hooks_useWatermarkForm.useWatermarkForm();
    const handleTypeChange = (style) => {
      currentStyle.value = style;
      if (imageInfo.value) {
        updateWatermark();
      }
    };
    const updateWatermark = async () => {
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
