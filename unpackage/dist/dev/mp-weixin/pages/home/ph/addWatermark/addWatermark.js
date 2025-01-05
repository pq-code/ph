"use strict";
const common_vendor = require("../../../../common/vendor.js");
if (!Array) {
  const _easycom_u_image2 = common_vendor.resolveComponent("u-image");
  const _easycom_u_input2 = common_vendor.resolveComponent("u-input");
  const _easycom_u_form_item2 = common_vendor.resolveComponent("u-form-item");
  const _easycom_u_form2 = common_vendor.resolveComponent("u-form");
  (_easycom_u_image2 + _easycom_u_input2 + _easycom_u_form_item2 + _easycom_u_form2)();
}
const _easycom_u_image = () => "../../../../uni_modules/uview-plus/components/u-image/u-image.js";
const _easycom_u_input = () => "../../../../uni_modules/uview-plus/components/u-input/u-input.js";
const _easycom_u_form_item = () => "../../../../uni_modules/uview-plus/components/u-form-item/u-form-item.js";
const _easycom_u_form = () => "../../../../uni_modules/uview-plus/components/u-form/u-form.js";
if (!Math) {
  (imageCropper + _easycom_u_image + _easycom_u_input + _easycom_u_form_item + _easycom_u_form + page)();
}
const imageCropper = () => "../../components/imageCropper/imageCropper2.js";
const page = () => "../../../../components/pages/page.js";
const _sfc_main = {
  __name: "addWatermark",
  setup(__props) {
    const imageurl = common_vendor.ref({
      url: "",
      status: "success",
      message: 0
    });
    const cropImage = common_vendor.ref();
    const formData = common_vendor.ref({
      test: "",
      iamge: "",
      opacity: "",
      angle: 45,
      // 角度
      density: ""
      // 密度
    });
    const selectImageFn = (item) => {
      if (item) {
        previewImage(item.url);
      } else {
        chooseImage();
      }
    };
    const previewImage = (urls) => {
      common_vendor.index.previewImage({
        urls,
        current: 1,
        longPressActions: {
          itemList: ["发送给朋友", "保存图片", "收藏"],
          success: function(data) {
          },
          fail: function(err) {
            console.log(err.errMsg);
            common_vendor.index.showToast({
              title: "预览失败",
              icon: "none"
            });
          }
        }
      });
    };
    const chooseImage = () => {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"],
        sourceType: ["album"],
        success: function(res) {
          debugger;
          cropImage.value = res.tempFilePaths[0];
          imageurl.value = {
            url: res.tempFilePaths[0],
            status: "success",
            message: 0
          };
        },
        fail: function(err) {
          console.log(err.errMsg);
          common_vendor.index.showToast({
            title: "选择图片失败",
            icon: "none"
          });
        }
      });
    };
    const watermarkStyle = (watermark) => {
      return {
        transform: `rotate(-${formData.angle}deg) translate(${watermark.x}%, ${watermark.y}%)`,
        width: `${watermark.width}px`,
        height: "50px"
      };
    };
    const watermarks = common_vendor.computed(() => {
      const watermarks2 = [];
      for (let i = 0; i < 9; i++) {
        watermarks2.push({
          x: Math.floor(Math.random() * 130) + 70,
          // 随机x位置
          y: Math.floor(Math.random() * 190) + 20,
          // 随机y位置
          width: Math.floor(Math.random() * 120) + 70
          // 随机宽度
        });
      }
      return watermarks2;
    });
    return (_ctx, _cache) => {
      return {
        a: _ctx.isOpenCropper,
        b: common_vendor.o(_ctx.handleCrop),
        c: common_vendor.p({
          cropImage: cropImage.value
        }),
        d: common_vendor.o(($event) => selectImageFn(_ctx.item)),
        e: common_vendor.p({
          mode: "aspectFit",
          width: "350",
          height: "350",
          src: imageurl.value.url
        }),
        f: common_vendor.f(watermarks.value, (item, k0, i0) => {
          return {
            a: common_vendor.s(watermarkStyle(item))
          };
        }),
        g: common_vendor.t(formData.value.text),
        h: common_vendor.o(($event) => formData.value.text = $event),
        i: common_vendor.p({
          border: "none",
          modelValue: formData.value.text
        }),
        j: common_vendor.sr("text", "5bd6fc7f-4,5bd6fc7f-3"),
        k: common_vendor.p({
          label: "水印文字",
          prop: "text",
          borderBottom: true
        }),
        l: common_vendor.sr("form1", "5bd6fc7f-3,5bd6fc7f-1"),
        m: common_vendor.p({
          labelWidth: "100px",
          labelPosition: "left",
          labelAlign: "left",
          model: formData.value
        }),
        n: common_vendor.p({
          title: "添加水印",
          rButton: "生成图片"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-5bd6fc7f"]]);
wx.createPage(MiniProgramPage);
