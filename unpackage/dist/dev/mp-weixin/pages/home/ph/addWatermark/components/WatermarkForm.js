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
  (_easycom_u_input + _easycom_u_datetime_picker + _easycom_u_textarea + _easycom_u_form_item + _easycom_u_form + MapDisplay)();
}
const MapDisplay = () => "./MapDisplay.js";
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
  emits: ["dataChanged", "update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const showPicker = common_vendor.ref(false);
    const tempDate = common_vendor.ref(common_vendor.dayjs().valueOf());
    const covers = common_vendor.ref([{
      latitude: 39.90923,
      longitude: 116.397428,
      title: "当前位置"
    }]);
    const handleDateConfirm = (value, field) => {
      const formattedDate = common_vendor.dayjs(value.value).format("YYYY-MM-DD HH:mm:ss");
      const newModelValue = {
        ...props.modelValue,
        [field]: formattedDate
      };
      tempDate.value = formattedDate;
      emit("update:modelValue", newModelValue);
      showPicker.value = false;
    };
    const onInputChange = () => {
      common_vendor.index.__f__("log", "at pages/home/ph/addWatermark/components/WatermarkForm.vue:115", "modelValue", props.modelValue);
      emit("update:modelValue", props.modelValue);
    };
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
            g: common_vendor.o(($event) => showPicker.value = true, field.field),
            h: "8883b4bf-3-" + i0 + "," + ("8883b4bf-1-" + i0),
            i: common_vendor.o(($event) => __props.modelValue[field.field] = $event, field.field),
            j: common_vendor.p({
              placeholder: field.placeholder,
              clearable: false,
              ["right-icon"]: "calendar",
              modelValue: __props.modelValue[field.field]
            }),
            k: common_vendor.o((value) => {
              handleDateConfirm(value, field.field);
            }, field.field),
            l: common_vendor.o(($event) => showPicker.value = false, field.field),
            m: "8883b4bf-4-" + i0 + "," + ("8883b4bf-1-" + i0),
            n: common_vendor.o(($event) => tempDate.value = $event, field.field),
            o: common_vendor.p({
              show: showPicker.value,
              mode: "datetime",
              format: "YYYY-MM-DD HH:mm:ss",
              defaultValue: common_vendor.unref(common_vendor.dayjs)().valueOf(),
              closeOnClickOverlay: false,
              modelValue: tempDate.value
            })
          } : field.type === "textarea" ? {
            q: common_vendor.o(onInputChange, field.field),
            r: "8883b4bf-5-" + i0 + "," + ("8883b4bf-1-" + i0),
            s: common_vendor.o(($event) => __props.modelValue[field.field] = $event, field.field),
            t: common_vendor.p({
              placeholder: field.placeholder,
              maxlength: field.maxlength,
              modelValue: __props.modelValue[field.field]
            })
          } : {}, {
            f: field.type === "datetime",
            p: field.type === "textarea",
            v: field.field,
            w: "8883b4bf-1-" + i0 + ",8883b4bf-0",
            x: common_vendor.p({
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
        }),
        d: common_vendor.p({
          latitude: _ctx.latitude,
          longitude: _ctx.longitude,
          markers: covers.value
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-8883b4bf"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/pages/home/ph/addWatermark/components/WatermarkForm.js.map
