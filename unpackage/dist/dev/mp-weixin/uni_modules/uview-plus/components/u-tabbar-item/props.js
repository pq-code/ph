"use strict";
const uni_modules_uviewPlus_libs_config_props = require("../../libs/config/props.js");
const props = {
  props: {
    // item标签的名称，作为与u-tabbar的value参数匹配的标识符
    name: {
      type: [String, Number, null],
      default: uni_modules_uviewPlus_libs_config_props.defprops.tabbarItem.name
    },
    // uView内置图标或者绝对路径的图片
    icon: {
      icon: String,
      default: uni_modules_uviewPlus_libs_config_props.defprops.tabbarItem.icon
    },
    // 右上角的角标提示信息
    badge: {
      type: [String, Number, null],
      default: uni_modules_uviewPlus_libs_config_props.defprops.tabbarItem.badge
    },
    // 是否显示圆点，将会覆盖badge参数
    dot: {
      type: Boolean,
      default: uni_modules_uviewPlus_libs_config_props.defprops.tabbarItem.dot
    },
    // 描述文本
    text: {
      type: String,
      default: uni_modules_uviewPlus_libs_config_props.defprops.tabbarItem.text
    },
    // 控制徽标的位置，对象或者字符串形式，可以设置top和right属性
    badgeStyle: {
      type: [Object, String],
      default: uni_modules_uviewPlus_libs_config_props.defprops.tabbarItem.badgeStyle
    }
  }
};
exports.props = props;
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/uview-plus/components/u-tabbar-item/props.js.map
