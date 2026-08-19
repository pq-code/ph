"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
require("../../api/service/wxService.js");
const store_user = require("../../store/user.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_tabbar2 = common_vendor.resolveComponent("tabbar");
  (_easycom_u_icon2 + _easycom_tabbar2)();
}
const _easycom_u_icon = () => "../../uni_modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_tabbar = () => "../../components/tabbar/tabbar.js";
if (!Math) {
  (_easycom_u_icon + _easycom_tabbar)();
}
const _sfc_main = {
  __name: "home",
  setup(__props) {
    const useStore = store_user.useUserStore();
    const uerInfo = common_vendor.ref({
      userNickname: ""
    });
    const userProfilePhoto = common_vendor.ref("");
    const toolList = common_vendor.ref([
      {
        id: 1,
        name: "拼图",
        icon: "grid",
        path: "ph/jigsawPuzzle/jigsawPuzzle",
        color: "#487AFA"
      },
      {
        id: 2,
        name: "添加水印",
        icon: "edit-pen",
        path: "ph/addWatermark/addWatermark",
        color: "#487AFA"
      },
      {
        id: 3,
        name: "自定义",
        icon: "setting",
        path: "ph/customize/customize",
        color: "#487AFA"
      },
      {
        id: 4,
        name: "拼豆图纸",
        icon: "grid",
        path: "ph/perlerBead/perlerBead",
        color: "#0aa671"
      },
      {
        id: 5,
        name: "AI生成",
        icon: "star",
        path: "ph/aiGenerate/aiGenerate",
        color: "#0aa671"
      }
    ]);
    const galleryList = common_vendor.ref([
      { id: 1, title: "可爱猫咪拼豆", author: "小明", likes: 128, color: "#FF6B6B", height: 200 },
      { id: 2, title: "星空拼豆图案", author: "小红", likes: 256, color: "#4ECDC4", height: 260 },
      { id: 3, title: "像素风景画", author: "小刚", likes: 89, color: "#45B7D1", height: 180 },
      { id: 4, title: "卡通人物拼豆", author: "小美", likes: 312, color: "#96CEB4", height: 240 },
      { id: 5, title: "花卉图案设计", author: "小李", likes: 167, color: "#FFEAA7", height: 220 },
      { id: 6, title: "动漫角色拼豆", author: "小王", likes: 198, color: "#DDA0DD", height: 190 }
    ]);
    const init = () => {
      var _a;
      common_vendor.index.getProvider({
        service: "oauth",
        success: function(res) {
          common_vendor.index.__f__("log", "at pages/home/home.vue:67", "provider", res.provider);
        }
      });
      uerInfo.value = common_vendor.index.getStorageSync("userInfo");
      userProfilePhoto.value = (_a = uerInfo.value) == null ? void 0 : _a.userProfilePhoto;
    };
    common_vendor.onPullDownRefresh(() => {
      common_vendor.index.__f__("log", "at pages/home/home.vue:75", "下拉刷新");
      init();
      setTimeout(() => {
        common_vendor.index.stopPullDownRefresh();
      }, 1e3);
    });
    common_vendor.onLoad(() => {
      init();
    });
    common_vendor.onShow(() => {
      useStore.setActive(0);
    });
    const pageJump = (url) => {
      common_vendor.index.navigateTo({
        url
      });
    };
    const goSquare = () => {
      common_vendor.index.switchTab({
        url: "/pages/home/square/square"
      });
    };
    const goPatternDetail = (item) => {
      common_vendor.index.navigateTo({
        url: `/pages/home/square/patternDetail?id=${item.id}`
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0,
        b: common_vendor.f(toolList.value, (item, k0, i0) => {
          return {
            a: "07e72d3c-0-" + i0,
            b: common_vendor.p({
              name: item.icon,
              size: "22",
              color: item.color
            }),
            c: common_vendor.t(item.name),
            d: item.id,
            e: common_vendor.o(($event) => pageJump(item.path), item.id)
          };
        }),
        c: common_vendor.p({
          name: "arrow-right",
          size: "14",
          color: "#999"
        }),
        d: common_vendor.o(goSquare),
        e: common_vendor.f(galleryList.value.filter((_, i) => i % 2 === 0), (item, k0, i0) => {
          return {
            a: "07e72d3c-2-" + i0,
            b: item.height + "px",
            c: item.color,
            d: common_vendor.t(item.title),
            e: common_vendor.t(item.author),
            f: "07e72d3c-3-" + i0,
            g: common_vendor.t(item.likes),
            h: item.id,
            i: common_vendor.o(($event) => goPatternDetail(item), item.id)
          };
        }),
        f: common_vendor.p({
          name: "photo",
          size: "32",
          color: "rgba(255,255,255,0.6)"
        }),
        g: common_vendor.p({
          name: "thumb-up",
          size: "12",
          color: "#999"
        }),
        h: common_vendor.f(galleryList.value.filter((_, i) => i % 2 === 1), (item, k0, i0) => {
          return {
            a: "07e72d3c-4-" + i0,
            b: item.height + "px",
            c: item.color,
            d: common_vendor.t(item.title),
            e: common_vendor.t(item.author),
            f: "07e72d3c-5-" + i0,
            g: common_vendor.t(item.likes),
            h: item.id,
            i: common_vendor.o(($event) => goPatternDetail(item), item.id)
          };
        }),
        i: common_vendor.p({
          name: "photo",
          size: "32",
          color: "rgba(255,255,255,0.6)"
        }),
        j: common_vendor.p({
          name: "thumb-up",
          size: "12",
          color: "#999"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-07e72d3c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/home/home.js.map
