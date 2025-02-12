"use strict";
const common_vendor = require("./common/vendor.js");
if (!Array) {
  const _easycom_qf_image_cropper2 = common_vendor.resolveComponent("qf-image-cropper");
  _easycom_qf_image_cropper2();
}
const _easycom_qf_image_cropper = () => "./uni_modules/qf-image-cropper/components/qf-image-cropper/qf-image-cropper.js";
if (!Math) {
  _easycom_qf_image_cropper();
}
const _sfc_main = {
  __name: "imageCropper",
  props: {
    cropImage: {
      type: String,
      default: ""
    }
  },
  emits: ["handleCrop"],
  setup(__props, { emit: __emit }) {
    const emits = __emit;
    const props = __props;
    const handleCrop = (e) => {
      common_vendor.index.__f__("log", "at pages/home/components/imageCropper/imageCropper.vue:15", "232323", e.tempFilePath);
      emits("handleCrop", e.tempFilePath);
    };
    common_vendor.watch(props.cropImage, (n, o) => {
      common_vendor.index.__f__("log", "at pages/home/components/imageCropper/imageCropper.vue:20", n);
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(handleCrop),
        b: common_vendor.p({
          src: props.cropImage,
          showBorder: true,
          showAngle: true,
          showGrid: true,
          gpu: true,
          zIndex: 999
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-60af6d12"]]);
exports.MiniProgramPage = MiniProgramPage;
//# sourceMappingURL=../.sourcemap/mp-weixin/imageCropper.js.map
