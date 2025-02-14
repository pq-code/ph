"use strict";
const WATERMARK_TYPES = [
  {
    id: 1,
    name: "现场拍照",
    description: "包含完整位置信息",
    preview: "/static/images/xcpz.jpg",
    style: {
      showLocation: true,
      showTime: true,
      showNotes: true,
      textStyle: {
        color: "#FFFFFF",
        strokeColor: "#000000",
        fontSize: 0.04,
        opacity: 1
      }
    }
  },
  {
    id: 2,
    name: "标准水印",
    description: "仅显示位置信息",
    preview: "/static/watermark/type2.png",
    style: {
      showLocation: true,
      showTime: false,
      showNotes: false,
      textStyle: {
        color: "#FFFFFF",
        strokeColor: "#000000",
        fontSize: 0.03,
        opacity: 0.8
      }
    }
  },
  {
    id: 3,
    name: "时间水印",
    description: "突出显示时间信息",
    preview: "/static/watermark/type3.png",
    style: {
      showLocation: false,
      showTime: true,
      showNotes: true,
      textStyle: {
        color: "#FFFFFF",
        strokeColor: "#000000",
        fontSize: 0.03,
        opacity: 0.9
      }
    }
  }
];
exports.WATERMARK_TYPES = WATERMARK_TYPES;
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/pages/home/ph/addWatermark/components/watermarkConfig.js.map
