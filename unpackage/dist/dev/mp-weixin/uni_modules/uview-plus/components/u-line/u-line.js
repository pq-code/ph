"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uviewPlus_components_uLine_props = require("./props.js");
const uni_modules_uviewPlus_libs_mixin_mpMixin = require("../../libs/mixin/mpMixin.js");
const uni_modules_uviewPlus_libs_mixin_mixin = require("../../libs/mixin/mixin.js");
const _sfc_main = {
  name: "u-line",
  mixins: [uni_modules_uviewPlus_libs_mixin_mpMixin.mpMixin, uni_modules_uviewPlus_libs_mixin_mixin.mixin, uni_modules_uviewPlus_components_uLine_props.props],
  computed: {
    lineStyle() {
      const style = {};
      style.margin = this.margin;
      if (this.direction === "row") {
        style.borderBottomWidth = "1px";
        style.borderBottomStyle = this.dashed ? "dashed" : "solid";
        style.width = common_vendor.index.$u.addUnit(this.length);
        if (this.hairline)
          style.transform = "scaleY(0.5)";
      } else {
        style.borderLeftWidth = "1px";
        style.borderLeftStyle = this.dashed ? "dashed" : "solid";
        style.height = common_vendor.index.$u.addUnit(this.length);
        if (this.hairline)
          style.transform = "scaleX(0.5)";
      }
      style.borderColor = this.color;
      return common_vendor.index.$u.deepMerge(style, common_vendor.index.$u.addStyle(this.customStyle));
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.s($options.lineStyle)
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-72791e59"]]);
wx.createComponent(Component);
