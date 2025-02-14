"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const pages_home_ph_addWatermark_components_watermarkConfig = require("./watermarkConfig.js");
if (!Array) {
  const _component_up_image = common_vendor.resolveComponent("up-image");
  _component_up_image();
}
const _sfc_main = {
  __name: "WatermarkTypeSelector",
  props: {
    modelValue: {
      type: Number,
      default: 1
    }
  },
  emits: ["update:modelValue", "handleTypeChange"],
  setup(__props, { emit: __emit }) {
    const emits = __emit;
    const onImageSelect = (item) => {
      emits("handleTypeChange", item);
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(common_vendor.unref(pages_home_ph_addWatermark_components_watermarkConfig.WATERMARK_TYPES), (item, k0, i0) => {
          return {
            a: "d87ad2f0-0-" + i0,
            b: common_vendor.p({
              ["show-loading"]: true,
              src: item.preview,
              mode: "aspectFit"
            }),
            c: common_vendor.t(item.name),
            d: item.id,
            e: __props.modelValue === item.id ? 1 : "",
            f: common_vendor.o(($event) => onImageSelect(item), item.id)
          };
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d87ad2f0"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/pages/home/ph/addWatermark/components/WatermarkTypeSelector.js.map
