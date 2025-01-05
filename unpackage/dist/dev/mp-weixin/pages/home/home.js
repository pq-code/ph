"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../api/service/wxService.js");
const _sfc_main = {
  __name: "home",
  setup(__props) {
    common_vendor.ref(0);
    common_vendor.ref("");
    common_vendor.ref([]);
    common_vendor.ref([]);
    common_vendor.ref();
    common_vendor.ref();
    common_vendor.ref("loadmore");
    common_vendor.ref("flower");
    common_vendor.ref("暂无数据点击加载更多");
    common_vendor.ref([]);
    common_vendor.onPullDownRefresh(() => {
      console.log("下拉刷新");
    });
    common_vendor.onShow(() => {
    });
    const pageJump = (url) => {
      common_vendor.index.navigateTo({
        url
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => pageJump("ph/jigsawPuzzle/jigsawPuzzle")),
        b: common_vendor.o(($event) => pageJump("ph/addWatermark/addWatermark"))
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-07e72d3c"]]);
_sfc_main.__runtimeHooks = 1;
wx.createPage(MiniProgramPage);
