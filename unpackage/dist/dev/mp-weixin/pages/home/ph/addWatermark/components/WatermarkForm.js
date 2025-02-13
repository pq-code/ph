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
  emits: ["dataChanged"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const onInputChange = () => {
      common_vendor.index.__f__("log", "at pages/home/ph/addWatermark/components/WatermarkForm.vue:72", "modelValue", props.modelValue);
      emit("dataChanged", props.modelValue);
    };
    common_vendor.watch(() => props.modelValue, (newValue) => {
      common_vendor.index.__f__("log", "at pages/home/ph/addWatermark/components/WatermarkForm.vue:78", "modelValue----", props.modelValue);
      emit("dataChanged", newValue);
    }, { deep: true });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(__props.fields, (field, k0, i0) => {
          return common_vendor.e({
            a: field.type === "input"
          }, field.type === "input" ? {
            b: common_vendor.o(onInputChange, field.field),
            c: "8883b4bf-2-" + i0 + "," + ("8883b4bf-1-" + i0),
            d: common_vendor.o(($event) => __props.modelValue[field.field] = $event, field.field),
            e: common_vendor.p({
              placeholder: field.placeholder,
              modelValue: __props.modelValue[field.field]
            })
          } : field.type === "datetime" ? {
            g: common_vendor.o(onInputChange, field.field),
            h: "8883b4bf-3-" + i0 + "," + ("8883b4bf-1-" + i0),
            i: common_vendor.o(($event) => __props.modelValue[field.field] = $event, field.field),
            j: common_vendor.p({
              placeholder: field.placeholder,
              modelValue: __props.modelValue[field.field]
            })
          } : field.type === "textarea" ? {
            l: common_vendor.o(onInputChange, field.field),
            m: "8883b4bf-4-" + i0 + "," + ("8883b4bf-1-" + i0),
            n: common_vendor.o(($event) => __props.modelValue[field.field] = $event, field.field),
            o: common_vendor.p({
              placeholder: field.placeholder,
              maxlength: field.maxlength,
              modelValue: __props.modelValue[field.field]
            })
          } : {}, {
            f: field.type === "datetime",
            k: field.type === "textarea",
            p: field.field,
            q: "8883b4bf-1-" + i0 + ",8883b4bf-0",
            r: common_vendor.p({
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
