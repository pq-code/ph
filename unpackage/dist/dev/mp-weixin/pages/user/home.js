"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_index = require("../../utils/index.js");
const api_apis_user = require("../../api/apis/user.js");
const store_user = require("../../store/user.js");
if (!Math) {
  tabbar();
}
const tabbar = () => "../../components/tabbar/tabbar.js";
const _sfc_main = {
  __name: "home",
  setup(__props) {
    const useStore = store_user.useUserStore();
    const formData = common_vendor.ref({
      userAvatar: "",
      userName: ""
    });
    const bgImage = common_vendor.ref("");
    const stats = common_vendor.ref({
      patternCount: 12,
      totalLikes: 1286,
      totalBeads: 28560,
      favorites: 8
    });
    const myPatterns = common_vendor.ref([
      { id: 1, title: "可爱猫咪拼豆", likes: 128, date: "2026-08-15", color: "#FF6B6B" },
      { id: 2, title: "星空拼豆图案", likes: 256, date: "2026-08-12", color: "#4ECDC4" },
      { id: 3, title: "像素风景画", likes: 89, date: "2026-08-10", color: "#45B7D1" }
    ]);
    const isLoggedIn = common_vendor.ref(false);
    const login = () => {
      utils_index.getLoginFn().then(() => {
        loadUserInfo();
      });
    };
    const loadUserInfo = () => {
      const info = common_vendor.index.getStorageSync("userInfo");
      if (info && info.userNickname) {
        formData.value.userAvatar = info.userProfilePhoto || "";
        formData.value.userName = info.userNickname || "";
        isLoggedIn.value = true;
      } else {
        isLoggedIn.value = false;
      }
    };
    const getUserProfile = (e) => {
      const { avatarUrl = "" } = e.detail;
      if (avatarUrl) {
        formData.value.userAvatar = avatarUrl;
        saveUserInfo();
      }
    };
    const onNicknameBlur = (e) => {
      if (e.detail.value) {
        formData.value.userName = e.detail.value;
        saveUserInfo();
      }
    };
    const changeBg = () => {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          bgImage.value = res.tempFilePaths[0];
          common_vendor.index.setStorageSync("userBgImage", bgImage.value);
        }
      });
    };
    const saveUserInfo = async () => {
      try {
        let data = await api_apis_user.editUserInfo({
          userProfilePhoto: formData.value.userAvatar,
          userNickname: formData.value.userName
        });
        const res = data.data;
        if (res.code == 0) {
          let result = common_vendor.index.getStorageSync("userInfo") || {};
          result = {
            ...result,
            userProfilePhoto: formData.value.userAvatar,
            userNickname: formData.value.userName
          };
          common_vendor.index.setStorageSync("userInfo", result);
          common_vendor.index.showToast({ title: "修改成功", icon: "success" });
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/user/home.vue:106", "保存失败:", err);
      }
    };
    const viewPattern = (item) => {
      common_vendor.index.navigateTo({ url: `/pages/home/square/patternDetail?id=${item.id}` });
    };
    const menuItems = [
      { icon: "icon-shoucang", label: "我的收藏", color: "#FF6B6B", action: "favorites" },
      { icon: "icon-xiazai", label: "导出记录", color: "#487AFA", action: "exports" },
      { icon: "icon-shezhi", label: "设置", color: "#999", action: "settings" },
      { icon: "icon-guanyu", label: "关于我们", color: "#67C23A", action: "about" }
    ];
    const handleMenuClick = (item) => {
      if (item.action === "settings") {
        common_vendor.index.navigateTo({ url: "/pages/user/settings" });
        return;
      }
      common_vendor.index.showToast({ title: item.label, icon: "none" });
    };
    common_vendor.onLoad(() => {
      loadUserInfo();
      bgImage.value = common_vendor.index.getStorageSync("userBgImage") || "";
    });
    common_vendor.onShow(() => {
      useStore.setActive(2);
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: bgImage.value
      }, bgImage.value ? {
        b: bgImage.value
      } : {}, {
        c: common_vendor.o(changeBg),
        d: !isLoggedIn.value
      }, !isLoggedIn.value ? {
        e: common_vendor.o(getUserProfile)
      } : common_vendor.e({
        f: formData.value.userAvatar
      }, formData.value.userAvatar ? {
        g: formData.value.userAvatar
      } : {}, {
        h: common_vendor.o(getUserProfile)
      }), {
        i: isLoggedIn.value
      }, isLoggedIn.value ? {
        j: formData.value.userName,
        k: common_vendor.o(onNicknameBlur)
      } : {
        l: common_vendor.o(login)
      }, {
        m: isLoggedIn.value
      }, isLoggedIn.value ? {} : {}, {
        n: common_vendor.t(stats.value.patternCount),
        o: common_vendor.t(stats.value.totalLikes),
        p: common_vendor.t((stats.value.totalBeads / 1e3).toFixed(1)),
        q: common_vendor.t(stats.value.favorites),
        r: common_vendor.f(myPatterns.value, (item, k0, i0) => {
          return {
            a: item.color,
            b: common_vendor.t(item.title),
            c: common_vendor.t(item.date),
            d: common_vendor.t(item.likes),
            e: item.id,
            f: common_vendor.o(($event) => viewPattern(item), item.id)
          };
        }),
        s: common_vendor.f(menuItems, (item, k0, i0) => {
          return {
            a: common_vendor.n(item.icon),
            b: item.color,
            c: item.color + "15",
            d: common_vendor.t(item.label),
            e: item.label,
            f: common_vendor.o(($event) => handleMenuClick(item), item.label)
          };
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f834fd70"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/home.js.map
