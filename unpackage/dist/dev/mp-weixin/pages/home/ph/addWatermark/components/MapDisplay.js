"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const libs_qqmapWxJssdk = require("../../../../../libs/qqmap-wx-jssdk.js");
if (!Array) {
  const _easycom_u_input2 = common_vendor.resolveComponent("u-input");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  (_easycom_u_input2 + _easycom_u_button2)();
}
const _easycom_u_input = () => "../../../../../uni_modules/uview-plus/components/u-input/u-input.js";
const _easycom_u_button = () => "../../../../../uni_modules/uview-plus/components/u-button/u-button.js";
if (!Math) {
  (_easycom_u_input + _easycom_u_button)();
}
const key = "TINBZ-DRE6I-H7XGE-UG7XQ-UGPHH-4ZBR6";
const _sfc_main = {
  __name: "MapDisplay",
  emits: ["closeMap"],
  setup(__props, { emit: __emit }) {
    const emits = __emit;
    const location = common_vendor.ref({});
    const latitude = common_vendor.ref(30.254515);
    const longitude = common_vendor.ref(120.11);
    const scale = common_vendor.ref(13);
    const mapInstance = common_vendor.ref(null);
    let qqmapsdk = null;
    const searchKeyword = common_vendor.ref("");
    const results = common_vendor.ref([]);
    const selectedAddress = common_vendor.ref("");
    common_vendor.ref(null);
    const marker = common_vendor.ref([]);
    const closeMap = (item) => {
      emits("closeMap", item || location.value);
    };
    common_vendor.onMounted(() => {
      qqmapsdk = new libs_qqmapWxJssdk.QQMapWX({
        key
        //申请的key
      });
      getLocation();
    });
    common_vendor.onBeforeUnmount(() => {
      if (mapInstance.value) {
        mapInstance.value.destroy();
      }
      delete window.mapInit;
    });
    const handleSearch = async () => {
      if (!searchKeyword.value)
        return;
      try {
        qqmapsdk.search({
          keyword: searchKeyword.value,
          region: "全国",
          page_size: 20,
          keyword_auto_complete: 1,
          address_format: "short",
          filter: "category=地址",
          success: function(res) {
            common_vendor.index.__f__("log", "at pages/home/ph/addWatermark/components/MapDisplay.vue:101", "res", res);
            if (res.status === 0 && res.data) {
              const uniqueResults = /* @__PURE__ */ new Map();
              results.value = res.data.filter((item) => {
                const key2 = `${item.location.lat},${item.location.lng}`;
                return !uniqueResults.has(key2) && uniqueResults.set(key2, true);
              }).map((item) => ({
                title: item.title.replace(/<[^>]+>/g, ""),
                lat: item.location.lat,
                lng: item.location.lng
              }));
              if (results.value.length === 0) {
                common_vendor.index.showToast({
                  title: res.message === "query params error" ? "请输入更详细的关键词" : "未找到相关地址",
                  icon: "none"
                });
              }
            }
          }
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/home/ph/addWatermark/components/MapDisplay.vue:124", "搜索失败:", error);
        common_vendor.index.showToast({ title: "搜索失败：" + error.message, icon: "none" });
      }
    };
    const getLocation = () => {
      common_vendor.index.authorize({
        scope: "scope.userLocation",
        success() {
          let location2 = {
            longitude: longitude.value,
            latitude: latitude.value,
            province: "",
            city: "",
            area: "",
            street: "",
            address: ""
          };
          common_vendor.index.getLocation({
            type: "gcj02",
            geocode: true,
            success: function(res) {
              common_vendor.index.setStorageSync("location", {
                latitude: latitude.value,
                longitude: longitude.value
              });
              longitude.value = res.longitude;
              latitude.value = res.latitude;
              location2.longitude = res.longitude;
              location2.latitude = res.latitude;
              qqmapsdk.reverseGeocoder({
                location: location2,
                success: function(res2) {
                  let info = res2.result;
                  location2.province = info.address_component.province;
                  location2.city = info.address_component.city;
                  location2.area = info.address_component.district;
                  location2.street = info.address_component.street;
                  location2.address = info.address;
                  location2.value = location2;
                }
              });
            },
            fail: function(err) {
              common_vendor.index.__f__("log", "at pages/home/ph/addWatermark/components/MapDisplay.vue:170", err, "err");
              qqmapsdk.geocoder({
                geocoder: 1,
                // 1表示IP定位
                success: (res) => {
                  const location3 = res.result.location;
                  longitude.value = location3.lng;
                  latitude.value = location3.lat;
                  qqmapsdk.reverseGeocoder({
                    location: location3,
                    success: function(res2) {
                      res2.result;
                      common_vendor.index.setStorageSync("location", {
                        latitude: location3.lat,
                        longitude: location3.lng
                      });
                      common_vendor.index.showToast({
                        title: "已使用IP定位",
                        icon: "none"
                      });
                    }
                  });
                },
                fail: (err2) => {
                  common_vendor.index.showToast({
                    title: "定位失败，请手动选择位置",
                    icon: "none"
                  });
                }
              });
            }
          });
        },
        fail() {
          common_vendor.index.showToast({
            title: "需要位置权限才能使用该功能",
            icon: "none"
          });
        }
      });
    };
    const updateMarker = (lat, lng) => {
      marker.value = [{
        id: 1,
        latitude: lat,
        longitude: lng,
        iconPath: "/static/location.png",
        // 需要准备标记图标
        width: 30,
        height: 30
      }];
    };
    const selectLocation = (item) => {
      latitude.value = item.lat;
      longitude.value = item.lng;
      common_vendor.index.__f__("log", "at pages/home/ph/addWatermark/components/MapDisplay.vue:230", "item", item);
      updateMarker(item.lat, item.lng);
      qqmapsdk.reverseGeocoder({
        location: { latitude: item.lat, longitude: item.lng },
        success: function(res) {
          const info = res.result;
          selectedAddress.value = info.address;
          location.value = {
            longitude: item.lng,
            latitude: item.lat,
            province: info.address_component.province,
            city: info.address_component.city,
            area: info.address_component.district,
            street: info.address_component.street,
            address: info.address
          };
        }
      });
      results.value = [];
      searchKeyword.value = "";
    };
    const handleMapTap = (e) => {
      const { latitude: latitude2, longitude: longitude2 } = e.detail;
      location.value = {
        longitude: longitude2,
        latitude: latitude2,
        province: "",
        city: "",
        area: "",
        street: "",
        address: ""
      };
      qqmapsdk.reverseGeocoder({
        location: { latitude: latitude2, longitude: longitude2 },
        success: function(res) {
          const info = res.result;
          selectedAddress.value = info.address;
          location.value = {
            ...location.value,
            province: info.address_component.province,
            city: info.address_component.city,
            area: info.address_component.district,
            street: info.address_component.street,
            address: info.address
          };
          common_vendor.index.showModal({
            title: "确认位置",
            content: `是否选择当前位置：${info.address}`,
            success: function(res2) {
              if (res2.confirm) {
                closeMap(location.value);
              }
            }
          });
        },
        fail: function(err) {
          common_vendor.index.__f__("error", "at pages/home/ph/addWatermark/components/MapDisplay.vue:295", "逆地理编码失败:", err);
        }
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(handleSearch),
        b: common_vendor.o(($event) => searchKeyword.value = $event),
        c: common_vendor.p({
          placeholder: "输入地址进行搜索",
          modelValue: searchKeyword.value
        }),
        d: common_vendor.o(handleSearch),
        e: common_vendor.o(closeMap),
        f: selectedAddress.value
      }, selectedAddress.value ? {
        g: common_vendor.t(selectedAddress.value)
      } : {}, {
        h: results.value.length > 0
      }, results.value.length > 0 ? {
        i: common_vendor.f(results.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.title),
            b: index,
            c: common_vendor.o(($event) => selectLocation(item), index)
          };
        })
      } : {}, {
        j: latitude.value,
        k: longitude.value,
        l: scale.value,
        m: common_vendor.o(handleMapTap),
        n: marker.value,
        o: common_vendor.o(($event) => _ctx.toMap())
      });
    };
  }
};
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/pages/home/ph/addWatermark/components/MapDisplay.js.map
