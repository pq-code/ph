<template>
  <view>
    <u-tabbar
      :active="useStore.activeTab"
      :fixed="true"
      :placeholder="true"
      zIndex="100"
      :safeAreaInsetBottom="true"
      activeColor="#00d01f"
      inactiveColor="#192031"
    >
      <u-tabbar-item
        v-for="(item, index) in tabbarItems"
        :key="`${item}_${index}`"
        :icon="getTabbarIcon(item, index)"
        :text="item.text"
        @click="handleTabbarItemClick(item, index)"
      ></u-tabbar-item>
    </u-tabbar>
  </view>
</template>

<script setup>
//引入pinia仓库
import useUserStore from "@/store/user.js";
let useStore = useUserStore();

const tabbarItems = [
	{
	  pagePath: "/pages/home/home",
	  text: "首页",
	  iconPath: "/static/tab_icons/home.png",
	  // selectedIconPath: '/static/tab_icons/home-active.png'
	  selectedIconPath: "/static/tab_icons/home.png",
	},
	{
	  pagePath: "/pages/user/home",
	  text: "我的",
	  iconPath: "/static/tab_icons/user.png",
	  selectedIconPath: "/static/tab_icons/user.png",
	},
];

//点击tabbar按钮
const handleTabbarItemClick = (item, index) => {
	const path = item.pagePath;
	uni.switchTab({
	  url: path,
	});
  // if (useStore.activeTab !== index) {
  //   //如果点击的是扫描按钮
  //   if (index === 1) {
  //     useStore.setActive(index);
  //     const path = item.pagePath;
  //     uni.switchTab({
  //       url: path,
  //     });
  //   } else {
  //     useStore.setActive(index);
  //     const path = item.pagePath;
  //     uni.switchTab({
  //       url: path,
  //     });
  //   }
  // }
};

//图标的切换
const getTabbarIcon = (item, index) => {
  return useStore.activeTab === index ? item.selectedIconPath : item.iconPath;
};
</script>
