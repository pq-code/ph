"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const useWatermarkForm = () => {
  const formData = common_vendor.ref({
    text: "",
    datetime: "",
    remark: ""
  });
  const getFormFields = (style) => {
    return [
      {
        field: "longitude",
        label: "经度",
        type: "input",
        required: false,
        placeholder: "请输入经度"
      },
      {
        field: "latitude",
        label: "纬度",
        type: "input",
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
        type: "input",
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
    ];
  };
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
    getFormFields,
    validateForm
  };
};
exports.useWatermarkForm = useWatermarkForm;
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/pages/home/ph/addWatermark/hooks/useWatermarkForm.js.map
