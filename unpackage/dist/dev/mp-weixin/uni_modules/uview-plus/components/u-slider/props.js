"use strict";
const uni_modules_uviewPlus_libs_config_props = require("../../libs/config/props.js");
const props = {
  props: {
    // 最小可选值
    min: {
      type: [Number, String],
      default: uni_modules_uviewPlus_libs_config_props.defprops.slider.min
    },
    // 最大可选值
    max: {
      type: [Number, String],
      default: uni_modules_uviewPlus_libs_config_props.defprops.slider.max
    },
    // 步长，取值必须大于 0，并且可被(max - min)整除
    step: {
      type: [Number, String],
      default: uni_modules_uviewPlus_libs_config_props.defprops.slider.step
    },
    // 当前取值
    value: {
      type: [Number, String],
      default: uni_modules_uviewPlus_libs_config_props.defprops.slider.value
    },
    // 滑块右侧已选择部分的背景色
    activeColor: {
      type: String,
      default: uni_modules_uviewPlus_libs_config_props.defprops.slider.activeColor
    },
    // 滑块左侧未选择部分的背景色
    inactiveColor: {
      type: String,
      default: uni_modules_uviewPlus_libs_config_props.defprops.slider.inactiveColor
    },
    // 滑块的大小，取值范围为 12 - 28
    blockSize: {
      type: [Number, String],
      default: uni_modules_uviewPlus_libs_config_props.defprops.slider.blockSize
    },
    // 滑块的颜色
    blockColor: {
      type: String,
      default: uni_modules_uviewPlus_libs_config_props.defprops.slider.blockColor
    },
    // 禁用状态
    disabled: {
      type: Boolean,
      default: uni_modules_uviewPlus_libs_config_props.defprops.slider.disabled
    },
    // 是否显示当前的选择值
    showValue: {
      type: Boolean,
      default: uni_modules_uviewPlus_libs_config_props.defprops.slider.showValue
    }
  }
};
exports.props = props;
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/uview-plus/components/u-slider/props.js.map
