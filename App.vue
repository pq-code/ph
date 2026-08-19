<script>
export default {
  onLaunch: function () {
    console.log("App Launch");
    // #ifdef MP-WEIXIN
    if (wx.cloud) {
      wx.cloud.init({
        env: 'prod-8gqm1nbtf8eae76e',
        traceUser: true
      });
    }
    // #endif
  },
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
};
</script>

<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import "uview-plus/index.scss";
</style>
