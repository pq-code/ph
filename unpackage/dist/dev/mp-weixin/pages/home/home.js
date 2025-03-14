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
const WEATHER_API_KEY = "bf108d402c7e471b90e9f0323364ee3a";
const WEATHER_STORAGE_KEY = "weather";
const _sfc_main = {
  __name: "home",
  setup(__props) {
    const WEATHER_ICONS = {
      "晴": "https://a.hecdn.net/img/common/icon/202106d/100.png",
      "多云": "icon-tianqi-duoyun",
      "下雨": "icon-tianqi-xiayu"
    };
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
    common_vendor.ref([
      {
        id: 1,
        name: "拼图",
        icon: "grid",
        path: "ph/jigsawPuzzle/jigsawPuzzle",
        description: "创建照片拼图"
      },
      {
        id: 2,
        name: "添加水印",
        icon: "edit-pen",
        path: "ph/addWatermark/addWatermark",
        description: "为照片添加水印"
      },
      {
        id: 3,
        name: "自定义修改",
        icon: "setting",
        path: "ph/customize/customize",
        description: "自定义照片编辑"
      }
    ]);
    const sizeTypeList = common_vendor.ref([
      // 可以在这里添加尺寸类型
      { name: "车辆通行", tips: "车匝", router: "vehicleAccess/vehicleAccess" }
    ]);
    const fetchWeather = async () => {
      const cachedWeather = common_vendor.index.getStorageSync(WEATHER_STORAGE_KEY);
      if (cachedWeather) {
        updateWeatherDisplay(cachedWeather.data);
        return;
      }
      try {
        const res = await common_vendor.index.request({
          url: `https://devapi.qweather.com/v7/weather/now?location=101210101&key=${WEATHER_API_KEY}`,
          method: "GET"
        });
        if (res.data.code === 200) {
          common_vendor.index.setStorageSync(WEATHER_STORAGE_KEY, res);
          updateWeatherDisplay(res.data);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/home/home.vue:100", "获取天气信息失败:", error);
      }
    };
    const updateWeatherDisplay = (data) => {
      const { now } = data;
      weather.value = {
        title: `${now.text} ${now.temp}° ${now.windDir}`,
        icon: WEATHER_ICONS[now.text] || ""
      };
    };
    const init = () => {
      var _a;
      common_vendor.index.getProvider({
        service: "oauth",
        success: function(res) {
          common_vendor.index.__f__("log", "at pages/home/home.vue:117", "provider", res.provider);
        }
      });
      uerInfo.value = common_vendor.index.getStorageSync("userInfo");
      userProfilePhoto.value = (_a = uerInfo.value) == null ? void 0 : _a.userProfilePhoto;
      fetchWeather();
    };
    common_vendor.onPullDownRefresh(() => {
      common_vendor.index.__f__("log", "at pages/home/home.vue:128", "下拉刷新");
      init();
      setTimeout(() => {
        common_vendor.index.stopPullDownRefresh();
      }, 1e3);
    });
    common_vendor.onLoad(() => {
      init();
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
          width: "30px",
          height: "30px",
          src: userProfilePhoto.value,
          mode: "aspectFill",
          shape: "circle"
        }),
        b: common_vendor.o(handleTabbarItemClick),
        c: common_vendor.t(uerInfo.value.userNickname),
        d: common_vendor.t(weather.value.title || ""),
        e: common_vendor.o(($event) => pageJump("ph/jigsawPuzzle/jigsawPuzzle")),
        f: common_vendor.o(($event) => pageJump("ph/addWatermark/addWatermark")),
        g: common_vendor.o(($event) => pageJump("ph/customize/customize")),
        h: common_vendor.f(sizeTypeList.value, (item, k0, i0) => {
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
