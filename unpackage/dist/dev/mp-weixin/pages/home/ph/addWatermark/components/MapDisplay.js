"use strict";
const _sfc_main = {
  __name: "MapDisplay",
  props: {
    latitude: {
      type: Number,
      default: 39.90923
    },
    longitude: {
      type: Number,
      default: 116.397428
    },
    markers: {
      type: Array,
      default: () => [{
        latitude: 39.90923,
        longitude: 116.397428,
        title: "当前位置"
      }]
    }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return {
        a: __props.latitude,
        b: __props.longitude,
        c: __props.markers
      };
    };
  }
};
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/pages/home/ph/addWatermark/components/MapDisplay.js.map
