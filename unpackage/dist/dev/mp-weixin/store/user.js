"use strict";
const common_vendor = require("../common/vendor.js");
const useUserStore = common_vendor.defineStore("User", {
  state: () => {
    return {
      activeTab: 0
      // 默认选中的索引
    };
  },
  actions: {
    //设置active的值
    setActive(active) {
      this.activeTab = active;
    }
  }
});
exports.useUserStore = useUserStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/store/user.js.map
