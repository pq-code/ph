"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_index = require("../../utils/index.js");
require("../../api/service/wxService.js");
if (!Array) {
  const _easycom_u_image2 = common_vendor.resolveComponent("u-image");
  _easycom_u_image2();
}
const _easycom_u_image = () => "../../uni_modules/uview-plus/components/u-image/u-image.js";
if (!Math) {
  _easycom_u_image();
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
    const uerInfo = common_vendor.ref();
    const userProfilePhoto = common_vendor.ref("https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEa");
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
      // {name: '全国计算机等级考试',tips:'33*48mm | 390*567px', router: ''}
      { name: "测试1123", tips: "35*49mm | 413*579px", router: "" },
      { name: "测试1123", tips: "22*32mm | 260*378px", router: "" },
      { name: "测试1123", tips: "35*45mm | 413*531px", router: "" },
      { name: "测试1123", tips: "35*45mm | 413*531px", router: "" },
      { name: "测试1123", tips: "33*48mm | 390*567px", router: "" },
      { name: "测试1123", tips: "35*49mm | 413*579px", router: "" },
      { name: "测试1123", tips: "22*32mm | 260*378px", router: "" },
      { name: "测试1123", tips: "35*45mm | 413*531px", router: "" },
      { name: "测试1123", tips: "35*45mm | 413*531px", router: "" },
      { name: "测试1123", tips: "33*48mm | 390*567px", router: "" }
    ];
    const getWeather = () => {
      let weatherS = {
        "晴": "icon-tianqi-qingtian",
        "多云": "icon-tianqi-duoyun",
        "下雨": "icon-tianqi-xiayu"
      };
      if (!common_vendor.index.getStorageSync("weather")) {
        common_vendor.index.request({
          url: "https://devapi.qweather.com/v7/weather/now?location=101010100&key=bf108d402c7e471b90e9f0323364ee3a",
          method: "GET",
          success: (res) => {
            const { now } = res.data;
            weather.value = {
              title: `${now.text} ${now.windDir}`,
              icon: weatherS[now.tex]
            };
            common_vendor.index.setStorageSync("weather", res);
            console.log("天气信息", weather.value);
          },
          fail: () => {
          },
          complete: () => {
          }
        });
      } else {
        let res = common_vendor.index.getStorageSync("weather");
        const { now } = res.data;
        weather.value = {
          title: `${now.text} ${now.windDir}`,
          icon: weatherS[now.tex]
        };
      }
    };
    const init = () => {
      var _a;
      uerInfo.value = common_vendor.index.getStorageSync("userInfo");
      userProfilePhoto.value = (_a = uerInfo.value) == null ? void 0 : _a.userProfilePhoto;
      getWeather();
    };
    common_vendor.onPullDownRefresh(() => {
      console.log("下拉刷新");
    });
    common_vendor.onLoad(() => {
      init();
    });
    const getUserInfo = () => {
      var _a;
      if (!common_vendor.index.getStorageSync("token")) {
        console.log("当前登录已经失效重新登录");
        utils_index.getSetting("scope.record").then((res) => {
          utils_index.getLoginFn().then((res2) => {
            console.log("登录成功", res2);
          });
        });
      }
      uerInfo.value = common_vendor.index.getStorageSync("userInfo");
      userProfilePhoto.value = (_a = uerInfo.value) == null ? void 0 : _a.userProfilePhoto;
      console.log(userProfilePhoto.value);
      getWeather();
    };
    const pageJump = (url) => {
      common_vendor.index.navigateTo({
        url
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
        b: common_vendor.o(getUserInfo),
        c: common_vendor.t(weather.value.title || ""),
        d: common_vendor.n(weather.value.icon),
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
