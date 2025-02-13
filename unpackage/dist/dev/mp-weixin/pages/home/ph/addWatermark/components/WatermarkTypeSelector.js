"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const _sfc_main = {
  __name: "WatermarkTypeSelector",
  props: {
    modelValue: {
      type: Number,
      default: 1
    }
  },
  emits: ["update:modelValue"],
  setup(__props) {
    const WATERMARK_TYPES = [
      {
        id: 1,
        name: "标准水印",
        preview: "/static/watermark/preview1.png",
        style: {
          centerText: "现场拍照",
          fontSize: 0.05,
          color: "#666666",
          strokeColor: "#FFFFFF"
        }
      },
      {
        id: 2,
        name: "现场水印",
        preview: "/static/watermark/preview2.png",
        style: {
          centerText: "现场拍照",
          fontSize: 0.04,
          color: "#FFFFFF",
          strokeColor: "#000000"
        }
      },
      {
        id: 3,
        name: "时间水印",
        preview: "/static/watermark/preview3.png",
        style: {
          centerText: "",
          // 不显示中心文字
          fontSize: 0.04,
          color: "#FFFFFF",
          strokeColor: "#000000"
        }
      }
    ];
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(WATERMARK_TYPES, (item, k0, i0) => {
          return {
            a: item.preview,
            b: common_vendor.t(item.name),
            c: item.id,
            d: __props.modelValue === item.id ? 1 : "",
            e: common_vendor.o(($event) => _ctx.$emit("update:modelValue", item.id), item.id)
          };
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d87ad2f0"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/pages/home/ph/addWatermark/components/WatermarkTypeSelector.js.map
