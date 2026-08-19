"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const useWatermarkForm = () => {
  const formData = common_vendor.ref({
    // 现场拍照水印字段
    isOnSitePhotography: true,
    longitude: "",
    latitude: "",
    address: "",
    datetime: common_vendor.dayjs().format("YYYY-MM-DD HH:mm:ss"),
    remark: "",
    // 标准水印字段
    watermarkContent: "保密",
    fontSize: 18,
    angle: 15,
    opacity: 30,
    // 自定义修改字段
    scale: 100,
    quality: 80,
    presetSize: "custom"
  });
  const validateForm = (fields) => {
    const requiredFields = fields.filter((f) => f.required);
    for (const field of requiredFields) {
      if (!formData.value[field.field]) {
        common_vendor.index.showToast({
          title: `请${field.placeholder}`,
          icon: "none"
        });
        return false;
      }
    }
    return true;
  };
  const resetForm = () => {
    formData.value = {
      isOnSitePhotography: true,
      longitude: "",
      latitude: "",
      address: "",
      datetime: common_vendor.dayjs().format("YYYY-MM-DD HH:mm:ss"),
      remark: "",
      watermarkContent: "保密",
      fontSize: 18,
      angle: 15,
      opacity: 30,
      scale: 100,
      quality: 80,
      presetSize: "custom"
    };
  };
  return {
    formData,
    validateForm,
    resetForm
  };
};
exports.useWatermarkForm = useWatermarkForm;
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/pages/home/ph/addWatermark/hooks/useWatermarkForm.js.map
