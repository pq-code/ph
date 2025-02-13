"use strict";
const common_vendor = require("../../../../../common/vendor.js");
if (!Array) {
  const _easycom_u_input2 = common_vendor.resolveComponent("u-input");
  const _easycom_u_datetime_picker2 = common_vendor.resolveComponent("u-datetime-picker");
  const _easycom_u_textarea2 = common_vendor.resolveComponent("u-textarea");
  const _easycom_u_form_item2 = common_vendor.resolveComponent("u-form-item");
  const _easycom_u_form2 = common_vendor.resolveComponent("u-form");
  (_easycom_u_input2 + _easycom_u_datetime_picker2 + _easycom_u_textarea2 + _easycom_u_form_item2 + _easycom_u_form2)();
}
const _easycom_u_input = () => "../../../../../uni_modules/uview-plus/components/u-input/u-input.js";
const _easycom_u_datetime_picker = () => "../../../../../uni_modules/uview-plus/components/u-datetime-picker/u-datetime-picker.js";
const _easycom_u_textarea = () => "../../../../../uni_modules/uview-plus/components/u-textarea/u-textarea.js";
const _easycom_u_form_item = () => "../../../../../uni_modules/uview-plus/components/u-form-item/u-form-item.js";
const _easycom_u_form = () => "../../../../../uni_modules/uview-plus/components/u-form/u-form.js";
if (!Math) {
  (_easycom_u_input + _easycom_u_datetime_picker + _easycom_u_textarea + _easycom_u_form_item + _easycom_u_form)();
}
const _sfc_main = {
  __name: "WatermarkForm",
  props: {
    modelValue: {
      type: Object,
      required: true
    },
    fields: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(__props.fields, (field, k0, i0) => {
          return common_vendor.e({
            a: field.type === "input"
          }, field.type === "input" ? {
            b: "8883b4bf-2-" + i0 + "," + ("8883b4bf-1-" + i0),
            c: common_vendor.o(($event) => __props.modelValue[field.field] = $event, field.field),
            d: common_vendor.p({
              placeholder: field.placeholder,
              modelValue: __props.modelValue[field.field]
            })
          } : field.type === "datetime" ? {
            f: "8883b4bf-3-" + i0 + "," + ("8883b4bf-1-" + i0),
            g: common_vendor.o(($event) => __props.modelValue[field.field] = $event, field.field),
            h: common_vendor.p({
              placeholder: field.placeholder,
              modelValue: __props.modelValue[field.field]
            })
          } : field.type === "textarea" ? {
            j: "8883b4bf-4-" + i0 + "," + ("8883b4bf-1-" + i0),
            k: common_vendor.o(($event) => __props.modelValue[field.field] = $event, field.field),
            l: common_vendor.p({
              placeholder: field.placeholder,
              maxlength: field.maxlength,
              modelValue: __props.modelValue[field.field]
            })
          } : {}, {
            e: field.type === "datetime",
            i: field.type === "textarea",
            m: field.field,
            n: "8883b4bf-1-" + i0 + ",8883b4bf-0",
            o: common_vendor.p({
              label: field.label,
              required: field.required
            })
          });
        }),
        b: common_vendor.sr("form1", "8883b4bf-0"),
        c: common_vendor.p({
          labelWidth: "100",
          labelPosition: "left",
          labelAlign: "left",
          model: __props.modelValue,
          disabled: __props.disabled
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-8883b4bf"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/pages/home/ph/addWatermark/components/WatermarkForm.js.map
