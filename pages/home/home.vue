<script setup>
	import {
		ref
	} from "vue";
	import {
		onLoad,
		onPullDownRefresh,
		onShow
	} from "@dcloudio/uni-app";
	import {
		getSetting,
		getLoginFn
	} from "@/utils/index.js";
	import {
		getUsedCarList
	} from "@/api/apis/usedCar.js";
	import dayjs from "dayjs";

	const value1 = ref(0);
	const keyword = ref("");
	const datalist1 = ref([]);
	const datalist2 = ref([]);

	const userAvatar = ref(); // 用户头像
	const navbarHeight = ref();

	const status = ref("loadmore");
	const iconType = ref("flower");
	const loadText = ref("暂无数据点击加载更多");

	const imageList = ref([]);

	let sizeType = [
		// {name: '二寸',tips:'35*49mm | 413*579px', router: ''},
		// {name: '小一寸',tips:'22*32mm | 260*378px', router: ''},
		// {name: '国考（小二寸）',tips:'35*45mm | 413*531px', router: ''},
		// {name: '国家公务员（小二寸）',tips:'35*45mm | 413*531px', router: ''},
		// {name: '全国计算机等级考试',tips:'33*48mm | 390*567px', router: ''}
	];

	// 获取天气
	// const getWeather = () => {
	//   uni.request({
	//     url: "https://devapi.qweather.com/v7/weather/now?location=101010100&key=bf108d402c7e471b90e9f0323364ee3a",
	//     method: "GET",
	//     success: (res) => {
	//       const { now } = res.data;
	//       weather.value = {
	//         title: `${now.text} ${now.windDir}`,
	//         icon: now.icon,
	//       };
	//       uni.setStorageSync("weather", weather.value);
	//     },
	//     fail: () => {
	//       this.openmsg("警告", "天气接口获取失败");
	//     },
	//     complete: () => {},
	//   });
	// };

	const init = () => {};

	// const onpen = (item) => {
	//   uni.navigateTo({
	//     url: `listDetails?projectId${item.projectId}`,
	//   });
	// };

	onPullDownRefresh(() => {
		console.log("下拉刷新");
	});

	onLoad(() => {
		if (!uni.getStorageSync("token")) {
		  console.log("当前登录已经失效重新登录");
		  // #ifdef MP-WEIXIN
		  getSetting("scope.record").then((res) => {
		    getLoginFn().then((res) => {
		    });
		  });
		  // #endif
		  const { user_profile_photo } = uni.getStorageSync("userInfo");
		  userAvatar.value = user_profile_photo;
		} else {
		}
	});

	const onPageScroll = (e) => {};
	const tabsClick = (item) => {
		console.log("item", item);
	};

	// 加载前值为loadmore，加载中为loading，没有数据为nomore
	const onReachBottom = () => {
		status.value = "loading";
	};

	// 页面跳转
	const pageJump = (url) => {
		uni.navigateTo({
			url: url,
		});
	};
</script>

<template>
	<view class="content">
		<view class="content-heard">
			<view>工具箱</view>
		</view>

		<view class="content-main">
			<view class="content-main-heard">
				<view class="content-main-heard-title"> 图片编辑 </view>
				<view class="content-main-heard-top">
					<view class="content-main-heard-left" @click="pageJump('ph/jigsawPuzzle/jigsawPuzzle')">
						拼图
					</view>
					<view class="content-main-heard-right" @click="pageJump('ph/addWatermark/addWatermark')">
						添加水印
					</view>
				</view>

				<view class="content-main-customize" @click="pageJump('')">
					自定义修改
				</view>
			</view>

			<view class="content-main-center">
			</view>

			<!-- <view
        v-for="item of sizeType"
        :key="item.name"
        class="content-sizeType"
        @click="pageJump(item.router)"
      >
        <view> {{ item.name }}</view>
        <view class="content-sizeType-tips"> {{ item.tips }}</view>
      </view> -->
		</view>
		<!-- <tabbar></tabbar> -->
	</view>
</template>

<style scoped lang="less">
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100vh;
		flex-wrap: nowrap;
		// background: #e8e8e8;
		background: linear-gradient(to bottom, #82b9ff, #ddeafb, #dfe8f3);

		.content-heard {
			width: 100%;
			height: 60px;
			// background: linear-gradient(to bottom, #93c3ff, #98bcea);
			padding-top: 40px;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 20px;
			font-weight: 600;
		}

		.content-main {
			width: calc(100% - 20px);
			height: 100%;
			padding: 10px;
			// border-radius: 6px;
			display: flex;
			flex-direction: column;

			// background: linear-gradient(to bottom, #98bcea, #efefef);
			// background: #faf6c8;
			.content-main-heard {
				display: flex;
				flex-direction: column;

				.content-main-heard-title {
					font-size: 18px;
					padding: 10px;
					margin-bottom: 10px;
					text-align: 10px;
					line-height: 10px;
					border-left: 4px solid #56a2e4;
				}

				.content-main-heard-top {
					height: 100px;
					display: flex;
					justify-content: space-between;

					.content-main-heard-left {
						width: calc(50% - 2.5px);
						height: 100%;
						border-radius: 10px;
						background: #ffffff;
						display: flex;
						flex-direction: row;
						align-items: center;
						justify-content: center;
					}

					.content-main-heard-right {
						width: calc(50% - 2.5px);
						height: 100%;
						border-radius: 10px;
						background: #ffffff;
						display: flex;
						flex-direction: row;
						align-items: center;
						justify-content: center;
					}
				}

				.content-main-customize {
					margin-top: 10px;
					padding: 10px;
					height: 40px;
					border-radius: 6px;
					background: #ffffff;
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}

			.content-main-center {
				flex: 1;
				border-radius: 6px;
				background: #ffffff;
				margin-top: 10px;
			}

			.content-sizeType {
				border-radius: 10px;
				width: calc(100% - 60px);
				height: 60px;
				margin: 10px auto;
				background: #ffffff;
				padding: 10px 20px;
				display: flex;
				flex-direction: column;
				justify-content: center;

				.content-sizeType-tips {
					color: #949292;
					font-size: 12px;
				}
			}
		}
	}
</style>