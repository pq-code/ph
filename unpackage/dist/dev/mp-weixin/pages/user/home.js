"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_index = require("../../utils/index.js");
const api_apis_user = require("../../api/apis/user.js");
if (!Array) {
  const _component_viiew = common_vendor.resolveComponent("viiew");
  const _easycom_u_image2 = common_vendor.resolveComponent("u-image");
  const _component_vie = common_vendor.resolveComponent("vie");
  const _easycom_tabbar2 = common_vendor.resolveComponent("tabbar");
  (_component_viiew + _easycom_u_image2 + _component_vie + _easycom_tabbar2)();
}
const _easycom_u_image = () => "../../uni_modules/uview-plus/components/u-image/u-image.js";
const _easycom_tabbar = () => "../../components/tabbar/tabbar.js";
if (!Math) {
  (_easycom_u_image + _easycom_tabbar)();
}
const _sfc_main = {
  __name: "home",
  setup(__props) {
    const formData = common_vendor.ref({
      userAvatar: "",
      userName: "",
      province: "",
      sex: ""
    });
    const login = () => {
      common_vendor.index.__f__("log", "at pages/user/home.vue:31", "当前登录已经失效重新登录");
      utils_index.getLoginFn().then((data) => {
        debugger;
        const {
          userProfilePhoto,
          userNickname
        } = common_vendor.index.getStorageSync("userInfo");
        formData.value.userAvatar = userProfilePhoto;
        formData.value.userName = userNickname;
      });
    };
    const editUserInfoFn = async () => {
      let data = await api_apis_user.editUserInfo({
        userProfilePhoto: formData.value.userAvatar,
        userNickname: formData.value.userName
      });
      const res = data.data;
      if (res.code == 0) {
        showToast("修改成功");
        let result = common_vendor.index.getStorageSync("userInfo");
        result = {
          ...result,
          userProfilePhoto: formData.value.userAvatar,
          userNickname: formData.value.userName
        };
        common_vendor.index.setStorageSync("userInfo", result);
      } else if (res.error = "10101") {
        login();
      }
    };
    const getUserProfile = (e) => {
      const { avatarUrl = "" } = e.detail;
      if (avatarUrl) {
        formData.value.userAvatar = e.detail.avatarUrl;
        editUserInfoFn();
      }
    };
    const bindinput = (e) => {
      common_vendor.index.__f__("log", "at pages/user/home.vue:75", "nickName", e);
      if (e.detail.value) {
        formData.value.userName = e.detail.value;
        editUserInfoFn();
      }
    };
    common_vendor.onLoad(() => {
      const {
        userProfilePhoto,
        userNickname
      } = common_vendor.index.getStorageSync("userInfo");
      formData.value.userAvatar = userProfilePhoto;
      formData.value.userName = userNickname;
      common_vendor.index.__f__("log", "at pages/user/home.vue:90", formData.value);
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(getUserProfile),
        b: common_vendor.p({
          ["open-type"]: "chooseAvatar",
          showLoading: true,
          src: formData.value.userAvatar,
          width: "80px",
          height: "80px",
          shape: "circle"
        }),
        c: common_vendor.t(formData.value.userName || "点击登录"),
        d: common_vendor.o(login),
        e: common_vendor.o(getUserProfile),
        f: common_vendor.p({
          ["open-type"]: "chooseAvatar",
          showLoading: true,
          src: formData.value.userAvatar,
          width: "30px",
          height: "30px",
          shape: "circle"
        }),
        g: common_vendor.o(getUserProfile),
        h: common_vendor.o(bindinput),
        i: formData.value.userName,
        j: common_vendor.o(($event) => formData.value.userName = $event.detail.value)
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/home.js.map
