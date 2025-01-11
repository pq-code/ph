"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../api/service/wxService.js");
if (!Array) {
  const _easycom_u_image2 = common_vendor.resolveComponent("u-image");
  const _easycom_tabbar2 = common_vendor.resolveComponent("tabbar");
  (_easycom_u_image2 + _easycom_tabbar2)();
}
const _easycom_u_image = () => "../../uni_modules/uview-plus/components/u-image/u-image.js";
const _easycom_tabbar = () => "../../components/tabbar/tabbar.js";
if (!Math) {
  (_easycom_u_image + _easycom_tabbar)();
}
const _sfc_main = {
  __name: "home",
  setup(__props) {
    common_vendor.ref(0);
    common_vendor.ref("");
    const weather = common_vendor.ref({
      title: "",
      icon: ""
    });
    const uerInfo = common_vendor.ref({
      userNickname: ""
    });
    const userProfilePhoto = common_vendor.ref("");
    common_vendor.ref();
    common_vendor.ref("loadmore");
    common_vendor.ref("flower");
    common_vendor.ref("暂无数据点击加载更多");
    common_vendor.ref([]);
    let sizeType = [
      // {name: '二寸',tips:'35*49mm | 413*579px', router: ''},
      // {name: '小一寸',tips:'22*32mm | 260*378px', router: ''},
      // {name: '国考（小二寸）',tips:'35*45mm | 413*531px', router: ''},
      // {name: '国家公务员（小二寸）',tips:'35*45mm | 413*531px', router: ''},
      // {name: '全国计算机等级考试',tips:'33*48mm | 390*567px', router: ''},
      { name: "测试1123", tips: "35*49mm | 413*579px", router: "" },
      { name: "测试1123", tips: "22*32mm | 260*378px", router: "" },
      { name: "测试1123", tips: "35*45mm | 413*531px", router: "" }
    ];
    common_vendor.onPullDownRefresh(() => {
      common_vendor.index.__f__("log", "at pages/home/home.vue:109", "下拉刷新");
    });
    common_vendor.onLoad(() => {
    });
    const pageJump = (url) => {
      common_vendor.index.navigateTo({
        url
      });
    };
    const handleTabbarItemClick = () => {
      common_vendor.index.switchTab({
        url: "/pages/user/home"
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          width: "40px",
          height: "40px",
          src: userProfilePhoto.value,
          mode: "aspectFill",
          shape: "circle"
        }),
        b: common_vendor.o(handleTabbarItemClick),
        c: common_vendor.t(uerInfo.value.userNickname),
        d: common_vendor.t(weather.value.title || ""),
        e: common_vendor.o(($event) => pageJump("ph/jigsawPuzzle/jigsawPuzzle")),
        f: common_vendor.o(($event) => pageJump("ph/addWatermark/addWatermark")),
        g: common_vendor.o(($event) => pageJump("")),
        h: common_vendor.f(common_vendor.unref(sizeType), (item, k0, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: common_vendor.t(item.tips),
            c: item.name,
            d: common_vendor.o(($event) => pageJump(item.router), item.name)
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-07e72d3c"]]);
_sfc_main.__runtimeHooks = 1;
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/home/home.js.map
