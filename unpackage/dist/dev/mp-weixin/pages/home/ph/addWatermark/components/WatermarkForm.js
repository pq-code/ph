"use strict";
const common_vendor = require("../../../../../common/vendor.js");
if (!Array) {
  const _easycom_u_input2 = common_vendor.resolveComponent("u-input");
  const _easycom_u_switch2 = common_vendor.resolveComponent("u-switch");
  const _easycom_u_slider2 = common_vendor.resolveComponent("u-slider");
  const _easycom_u_datetime_picker2 = common_vendor.resolveComponent("u-datetime-picker");
  const _easycom_u_textarea2 = common_vendor.resolveComponent("u-textarea");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _easycom_u_form_item2 = common_vendor.resolveComponent("u-form-item");
  const _easycom_u_form2 = common_vendor.resolveComponent("u-form");
  (_easycom_u_input2 + _easycom_u_switch2 + _easycom_u_slider2 + _easycom_u_datetime_picker2 + _easycom_u_textarea2 + _easycom_u_button2 + _easycom_u_form_item2 + _easycom_u_form2)();
}
const _easycom_u_input = () => "../../../../../uni_modules/uview-plus/components/u-input/u-input.js";
const _easycom_u_switch = () => "../../../../../uni_modules/uview-plus/components/u-switch/u-switch.js";
const _easycom_u_slider = () => "../../../../../uni_modules/uview-plus/components/u-slider/u-slider.js";
const _easycom_u_datetime_picker = () => "../../../../../uni_modules/uview-plus/components/u-datetime-picker/u-datetime-picker.js";
const _easycom_u_textarea = () => "../../../../../uni_modules/uview-plus/components/u-textarea/u-textarea.js";
const _easycom_u_button = () => "../../../../../uni_modules/uview-plus/components/u-button/u-button.js";
const _easycom_u_form_item = () => "../../../../../uni_modules/uview-plus/components/u-form-item/u-form-item.js";
const _easycom_u_form = () => "../../../../../uni_modules/uview-plus/components/u-form/u-form.js";
if (!Math) {
  (_easycom_u_input + _easycom_u_switch + _easycom_u_slider + _easycom_u_datetime_picker + _easycom_u_textarea + _easycom_u_button + _easycom_u_form_item + _easycom_u_form + MapDisplay)();
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
    common_vendor.index.__f__("log", "at pages/home/ph/addWatermark/components/WatermarkForm.vue:144", "props=====", props);
    const showMap = common_vendor.ref(false);
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
      common_vendor.index.__f__("log", "at pages/home/ph/addWatermark/components/WatermarkForm.vue:171", "modelValue", props.modelValue);
      emit("update:modelValue", props.modelValue);
    };
    const closeMap = (item) => {
      showMap.value = false;
      emit("update:modelValue", {
        ...props.modelValue,
        longitude: Number(item.longitude).toFixed(6),
        latitude: Number(item.latitude).toFixed(6),
        address: item.address
      });
    };
    const spacingSize = (value, field) => {
      emit("update:modelValue", {
        ...props.modelValue,
        [field]: value
      });
    };
    const getLocation = () => {
      common_vendor.index.chooseLocation({
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/home/ph/addWatermark/components/WatermarkForm.vue:196", "chooseLocation", res);
          emit("update:modelValue", {
            ...props.modelValue,
            longitude: Number(res.longitude).toFixed(6),
            latitude: Number(res.latitude).toFixed(6),
            address: res.address
          });
        }
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(__props.fields, (field, k0, i0) => {
          return common_vendor.e({
            a: field.type === "dinwei"
          }, field.type === "dinwei" ? {
            b: common_vendor.o(getLocation, field.field),
            c: common_vendor.o(onInputChange, field.field),
            d: "8883b4bf-2-" + i0 + "," + ("8883b4bf-1-" + i0),
            e: common_vendor.o(($event) => __props.modelValue[field.field] = $event, field.field),
            f: common_vendor.p({
              placeholder: field.placeholder,
              suffixIcon: field.suffixIcon,
              suffixIconStyle: field.suffixIconStyle,
              customStyle: {
                zIndex: "0"
              },
              modelValue: __props.modelValue[field.field]
            })
          } : {}, {
            g: field.type === "switch"
          }, field.type === "switch" ? {
            h: common_vendor.o(onInputChange, field.field),
            i: "8883b4bf-3-" + i0 + "," + ("8883b4bf-1-" + i0),
            j: common_vendor.o(($event) => __props.modelValue[field.field] = $event, field.field),
            k: common_vendor.p({
              modelValue: __props.modelValue[field.field]
            })
          } : {}, {
            l: field.type === "slider"
          }, field.type === "slider" ? {
            m: common_vendor.o((e) => spacingSize(e, field.field), field.field),
            n: "8883b4bf-4-" + i0 + "," + ("8883b4bf-1-" + i0),
            o: common_vendor.o(($event) => __props.modelValue[field.field] = $event, field.field),
            p: common_vendor.p({
              min: field.min,
              max: field.max,
              step: field.step || 1,
              activeColor: "#007AFF",
              modelValue: __props.modelValue[field.field]
            }),
            q: common_vendor.t(`${__props.modelValue[field.field] || 0}${field.unit}`)
          } : {}, {
            r: field.type === "input"
          }, field.type === "input" ? {
            s: common_vendor.o(onInputChange, field.field),
            t: "8883b4bf-5-" + i0 + "," + ("8883b4bf-1-" + i0),
            v: common_vendor.o(($event) => __props.modelValue[field.field] = $event, field.field),
            w: common_vendor.p({
              placeholder: field.placeholder,
              customStyle: {
                zIndex: "0"
              },
              modelValue: __props.modelValue[field.field]
            })
          } : field.type === "datetime" ? {
            y: common_vendor.o(($event) => showPicker.value = true, field.field),
            z: "8883b4bf-6-" + i0 + "," + ("8883b4bf-1-" + i0),
            A: common_vendor.o(($event) => __props.modelValue[field.field] = $event, field.field),
            B: common_vendor.p({
              placeholder: field.placeholder,
              clearable: false,
              ["right-icon"]: "calendar",
              customStyle: {
                zIndex: "0"
              },
              modelValue: __props.modelValue[field.field]
            }),
            C: common_vendor.o((value) => {
              handleDateConfirm(value, field.field);
            }, field.field),
            D: common_vendor.o(($event) => showPicker.value = false, field.field),
            E: "8883b4bf-7-" + i0 + "," + ("8883b4bf-1-" + i0),
            F: common_vendor.o(($event) => tempDate.value = $event, field.field),
            G: common_vendor.p({
              show: showPicker.value,
              mode: "datetime",
              format: "YYYY-MM-DD HH:mm:ss",
              defaultValue: common_vendor.unref(common_vendor.dayjs)().valueOf(),
              closeOnClickOverlay: false,
              modelValue: tempDate.value
            })
          } : field.type === "textarea" ? {
            I: common_vendor.o(onInputChange, field.field),
            J: "8883b4bf-8-" + i0 + "," + ("8883b4bf-1-" + i0),
            K: common_vendor.o(($event) => __props.modelValue[field.field] = $event, field.field),
            L: common_vendor.p({
              placeholder: field.placeholder,
              maxlength: field.maxlength,
              modelValue: __props.modelValue[field.field]
            })
          } : {}, {
            x: field.type === "datetime",
            H: field.type === "textarea",
            M: field.type === "button"
          }, field.type === "button" ? {
            N: common_vendor.o(onInputChange, field.field),
            O: "8883b4bf-9-" + i0 + "," + ("8883b4bf-1-" + i0),
            P: common_vendor.p({
              placeholder: field.placeholder
            })
          } : {}, {
            Q: field.field,
            R: "8883b4bf-1-" + i0 + ",8883b4bf-0",
            S: common_vendor.p({
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
        d: showMap.value
      }, showMap.value ? {
        e: common_vendor.o(closeMap),
        f: common_vendor.p({
          latitude: _ctx.latitude,
          longitude: _ctx.longitude,
          markers: covers.value
        })
      } : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-8883b4bf"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/pages/home/ph/addWatermark/components/WatermarkForm.js.map
