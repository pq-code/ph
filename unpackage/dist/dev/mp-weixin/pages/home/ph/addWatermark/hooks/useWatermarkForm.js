"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const useWatermarkForm = () => {
  const formData = common_vendor.ref({
    text: "",
    datetime: "",
    remark: ""
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
  return {
    formData,
    validateForm
  };
};
exports.useWatermarkForm = useWatermarkForm;
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/pages/home/ph/addWatermark/hooks/useWatermarkForm.js.map
