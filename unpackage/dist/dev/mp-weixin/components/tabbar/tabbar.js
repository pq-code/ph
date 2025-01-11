"use strict";
const common_vendor = require("../../common/vendor.js");
const store_user = require("../../store/user.js");
if (!Array) {
  const _easycom_u_tabbar_item2 = common_vendor.resolveComponent("u-tabbar-item");
  const _easycom_u_tabbar2 = common_vendor.resolveComponent("u-tabbar");
  (_easycom_u_tabbar_item2 + _easycom_u_tabbar2)();
}
const _easycom_u_tabbar_item = () => "../../uni_modules/uview-plus/components/u-tabbar-item/u-tabbar-item.js";
const _easycom_u_tabbar = () => "../../uni_modules/uview-plus/components/u-tabbar/u-tabbar.js";
if (!Math) {
  (_easycom_u_tabbar_item + _easycom_u_tabbar)();
}
const _sfc_main = {
  __name: "tabbar",
  setup(__props) {
    let useStore = store_user.useUserStore();
    const tabbarItems = [
      {
        pagePath: "/pages/home/home",
        text: "首页",
        iconPath: "/static/tab_icons/home.png",
        // selectedIconPath: '/static/tab_icons/home-active.png'
        selectedIconPath: "/static/tab_icons/home.png"
      },
      {
        pagePath: "/pages/user/home",
        text: "我的",
        iconPath: "/static/tab_icons/user.png",
        selectedIconPath: "/static/tab_icons/user.png"
      }
    ];
    const handleTabbarItemClick = (item, index) => {
      const path = item.pagePath;
      common_vendor.index.switchTab({
        url: path
      });
    };
    const getTabbarIcon = (item, index) => {
      return useStore.activeTab === index ? item.selectedIconPath : item.iconPath;
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(tabbarItems, (item, index, i0) => {
          return {
            a: `${item}_${index}`,
            b: common_vendor.o(($event) => handleTabbarItemClick(item), `${item}_${index}`),
            c: "336947f1-1-" + i0 + ",336947f1-0",
            d: common_vendor.p({
              icon: getTabbarIcon(item, index),
              text: item.text
            })
          };
        }),
        b: common_vendor.p({
          active: common_vendor.unref(useStore).activeTab,
          fixed: true,
          placeholder: true,
          zIndex: "100",
          safeAreaInsetBottom: true,
          activeColor: "#00d01f",
          inactiveColor: "#192031"
        })
      };
    };
  }
};
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/tabbar/tabbar.js.map
