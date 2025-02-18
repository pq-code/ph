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
    preview: "/static/images/sy.png",
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
const WATERMARK_FORM_LIST = {
  1: [
    {
      field: "isOnSitePhotography",
      label: "是否有现场拍照",
      type: "switch",
      required: false,
      placeholder: "请选择是否有现场拍照"
    },
    {
      field: "longitude",
      label: "经度",
      type: "dinwei",
      required: false,
      placeholder: "请输入经度"
    },
    {
      field: "latitude",
      label: "纬度",
      type: "dinwei",
      required: false,
      placeholder: "请输入纬度"
    },
    {
      field: "address",
      label: "地址",
      type: "input",
      required: false,
      placeholder: "请输入地址"
    },
    {
      field: "datetime",
      label: "时间",
      type: "datetime",
      required: false,
      placeholder: "请输入时间"
    },
    {
      field: "remark",
      label: "备注",
      type: "textarea",
      required: false,
      placeholder: "请输入备注信息",
      maxlength: 100
    }
  ],
  2: [
    {
      field: "watermarkContent",
      label: "水印文字",
      type: "input",
      required: false,
      placeholder: "请输入水印文字"
    },
    {
      field: "fontSize",
      label: "文字大小",
      type: "input",
      required: false,
      unit: "px",
      placeholder: "例如：1"
      // 修改提示语
    },
    {
      field: "angle",
      label: "旋转角度",
      // 补充标签名称
      type: "slider",
      // 修改控件类型
      required: false,
      max: 360,
      min: 0,
      unit: "度",
      placeholder: "0-360度范围"
    },
    {
      field: "opacity",
      label: "透明度",
      max: 100,
      min: 1,
      type: "slider",
      // 修改控件类型
      required: false,
      unit: "%",
      placeholder: "0-1之间"
    }
    // {
    //   field: 'strokeColor',
    //   label: '描边颜色',
    //   type: 'textarea',
    //   required: false,
    //   placeholder: '描边颜色',
    //   maxlength: 100
    // }
  ]
};
exports.WATERMARK_FORM_LIST = WATERMARK_FORM_LIST;
exports.WATERMARK_TYPES = WATERMARK_TYPES;
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/pages/home/ph/addWatermark/components/watermarkConfig.js.map
