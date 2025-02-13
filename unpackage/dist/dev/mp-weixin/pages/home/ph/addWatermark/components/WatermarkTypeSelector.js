"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const pages_home_ph_addWatermark_components_watermarkConfig = require("./watermarkConfig.js");
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
            a: item.preview,
            b: common_vendor.t(item.name),
            c: item.id,
            d: __props.modelValue === item.id ? 1 : "",
            e: common_vendor.o(($event) => onImageSelect(item), item.id)
          };
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d87ad2f0"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/pages/home/ph/addWatermark/components/WatermarkTypeSelector.js.map
