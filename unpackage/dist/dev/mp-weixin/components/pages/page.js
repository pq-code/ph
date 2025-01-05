"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_u_navbar2 = common_vendor.resolveComponent("u-navbar");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  (_easycom_u_navbar2 + _easycom_u_button2)();
}
const _easycom_u_navbar = () => "../../uni_modules/uview-plus/components/u-navbar/u-navbar.js";
const _easycom_u_button = () => "../../uni_modules/uview-plus/components/u-button/u-button.js";
if (!Math) {
  (_easycom_u_navbar + _easycom_u_button)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "page",
  props: {
    title: {
      type: String,
      default() {
        return "主页";
      }
    },
    backUrl: {
      type: String,
      default() {
        return "";
      }
    },
    lButton: {
      type: String,
      default() {
        return "";
      }
    },
    rButton: {
      type: String,
      default() {
        return "";
      }
    }
  },
  emits: ["lButton", "rButton"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const leftClick = () => {
      console.log(props.backUrl);
      if (props.backUrl == "") {
        common_vendor.index.navigateBack({});
      } else {
        console.log(props.backUrl);
        common_vendor.index.navigateTo({
          url: props.backUrl
        });
      }
    };
    const bottomBUtton = (type) => {
      if (type == 1)
        emits("lButton");
      if (type == 2)
        emits("rButton");
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(leftClick),
        b: common_vendor.p({
          title: __props.title,
          height: "50",
          fixed: false,
          placeholder: true,
          autoBack: false
        }),
        c: __props.lButton || __props.rButton
      }, __props.lButton || __props.rButton ? common_vendor.e({
        d: __props.lButton
      }, __props.lButton ? {
        e: common_vendor.o(($event) => bottomBUtton(1)),
        f: common_vendor.p({
          type: "primary",
          shape: "circle"
        })
      } : {}, {
        g: __props.rButton
      }, __props.rButton ? {
        h: common_vendor.o(($event) => bottomBUtton(2)),
        i: common_vendor.p({
          type: "success",
          shape: "circle"
        })
      } : {}) : {});
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e4f1132a"]]);
wx.createComponent(Component);
