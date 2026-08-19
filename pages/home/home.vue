<script setup>
import { ref, onMounted } from "vue";
import { onLoad, onPullDownRefresh, onShow } from "@dcloudio/uni-app";
import { getSetting, getLoginFn } from "@/utils/index.js";
import useUserStore from "@/store/user.js";

const useStore = useUserStore();

const uerInfo = ref({
	userNickname: ''
});
const userProfilePhoto = ref('');

// 功能入口列表（合并为一行5个）
const toolList = ref([
	{
		id: 1,
		name: '拼图',
		icon: 'grid',
		path: 'ph/jigsawPuzzle/jigsawPuzzle',
		color: '#487AFA'
	},
	{
		id: 2,
		name: '添加水印',
		icon: 'edit-pen',
		path: 'ph/addWatermark/addWatermark',
		color: '#487AFA'
	},
	{
		id: 3,
		name: '自定义',
		icon: 'setting',
		path: 'ph/customize/customize',
		color: '#487AFA'
	},
	{
		id: 4,
		name: '拼豆图纸',
		icon: 'grid',
		path: 'ph/perlerBead/perlerBead',
		color: '#0aa671'
	},
	{
		id: 5,
		name: 'AI生成',
		icon: 'star',
		path: 'ph/aiGenerate/aiGenerate',
		color: '#0aa671'
	}
]);

// 图纸广场Mock数据
const galleryList = ref([
	{ id: 1, title: '可爱猫咪拼豆', author: '小明', likes: 128, color: '#FF6B6B', height: 200 },
	{ id: 2, title: '星空拼豆图案', author: '小红', likes: 256, color: '#4ECDC4', height: 260 },
	{ id: 3, title: '像素风景画', author: '小刚', likes: 89, color: '#45B7D1', height: 180 },
	{ id: 4, title: '卡通人物拼豆', author: '小美', likes: 312, color: '#96CEB4', height: 240 },
	{ id: 5, title: '花卉图案设计', author: '小李', likes: 167, color: '#FFEAA7', height: 220 },
	{ id: 6, title: '动漫角色拼豆', author: '小王', likes: 198, color: '#DDA0DD', height: 190 },
]);

const init = () => {
	uni.getProvider({
		service: 'oauth',
		success: function (res) {
			console.log('provider', res.provider)
		}
	});
	uerInfo.value = uni.getStorageSync("userInfo");
	userProfilePhoto.value = uerInfo.value?.userProfilePhoto;
};

onPullDownRefresh(() => {
	console.log("下拉刷新");
	init();
	setTimeout(() => {
		uni.stopPullDownRefresh();
	}, 1000);
});

onLoad(() => {
	init()
});

onShow(() => {
	useStore.setActive(0);
});

// 页面跳转
const pageJump = (url) => {
	uni.navigateTo({
		url: url,
	});
};

// 跳转到图纸广场
const goSquare = () => {
	uni.switchTab({
		url: '/pages/home/square/square',
	});
};

// 跳转到图纸详情
const goPatternDetail = (item) => {
	uni.navigateTo({
		url: `/pages/home/square/patternDetail?id=${item.id}`,
	});
};
</script>

<template>
	<view class="content">
		<scroll-view scroll-y="true" class="page-scroll">
			<!-- 顶部背景图（纯展示，不参与布局） -->
			<view class="banner">
				<image class="banner-img" src="/static/home-bg.jpg" mode="widthFix" />
			</view>

			<!-- 功能入口卡片 -->
			<view class="tool-grid-wrapper">
				<view class="tool-grid">
					<view
						v-for="item in toolList"
						:key="item.id"
						class="tool-item"
						@click="pageJump(item.path)"
					>
						<view class="tool-icon">
							<u-icon :name="item.icon" size="22" :color="item.color"></u-icon>
						</view>
						<text class="tool-name">{{ item.name }}</text>
					</view>
				</view>
			</view>

			<!-- 图纸广场 -->
			<view class="section">
				<view class="section-header">
					<view class="section-title">
						<view class="title-dot"></view>
						<text>图纸广场</text>
					</view>
					<view class="section-more" @click="goSquare">
						<text>查看更多</text>
						<u-icon name="arrow-right" size="14" color="#999"></u-icon>
					</view>
				</view>
				<view class="waterfall">
					<view class="waterfall-column">
						<view
							v-for="item in galleryList.filter((_, i) => i % 2 === 0)"
							:key="item.id"
							class="waterfall-card"
							@click="goPatternDetail(item)"
						>
							<view class="card-image" :style="{ height: item.height + 'px', background: item.color }">
								<view class="card-image-placeholder">
									<u-icon name="photo" size="32" color="rgba(255,255,255,0.6)"></u-icon>
								</view>
							</view>
							<view class="card-info">
								<text class="card-title">{{ item.title }}</text>
								<view class="card-meta">
									<text class="card-author">{{ item.author }}</text>
									<view class="card-likes">
										<u-icon name="thumb-up" size="12" color="#999"></u-icon>
										<text>{{ item.likes }}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="waterfall-column">
						<view
							v-for="item in galleryList.filter((_, i) => i % 2 === 1)"
							:key="item.id"
							class="waterfall-card"
							@click="goPatternDetail(item)"
						>
							<view class="card-image" :style="{ height: item.height + 'px', background: item.color }">
								<view class="card-image-placeholder">
									<u-icon name="photo" size="32" color="rgba(255,255,255,0.6)"></u-icon>
								</view>
							</view>
							<view class="card-info">
								<text class="card-title">{{ item.title }}</text>
								<view class="card-meta">
									<text class="card-author">{{ item.author }}</text>
									<view class="card-likes">
										<u-icon name="thumb-up" size="12" color="#999"></u-icon>
										<text>{{ item.likes }}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<tabbar></tabbar>
	</view>
</template>

<style scoped lang="less">
	.content {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background: linear-gradient(180deg, #d5cec6 0%, #f7dbe9ad 25%, #e7ebff 50%, #ffffff 100%);

		.page-scroll {
			flex: 1;
			height: 0;
		}

		// 背景图区域
		.banner {
			width: 100%;
			overflow: hidden;

			.banner-img {
				width: 100%;
				display: block;
			}
		}

		// 功能入口卡片（上移覆盖背景图底部）
		.tool-grid-wrapper {
			padding: 0 16px;
			margin-top: -10px;
			position: relative;
			z-index: 2;

			.tool-grid {
				display: flex;
				justify-content: space-between;
				background: #ffffff;
				border-radius: 16px;
				padding: 16px 12px;
				box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

				.tool-item {
					flex: 1;
					display: flex;
					flex-direction: column;
					align-items: center;

					.tool-icon {
						width: 48px;
						height: 48px;
						border-radius: 14px;
						background: #f5f7fa;
						display: flex;
						align-items: center;
						justify-content: center;
						margin-bottom: 8px;
					}

					.tool-name {
						font-size: 12px;
						color: #333;
						font-weight: 500;
					}
				}
			}
		}

		// 图纸广场
		.section {
			padding: 20px 0 16px;

			.section-header {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0 20px;
				margin-bottom: 14px;

				.section-title {
					display: flex;
					align-items: center;

					.title-dot {
						width: 6px;
						height: 18px;
						border-radius: 3px;
						margin-right: 8px;
						background: #764ba2;
					}

					text {
						font-size: 17px;
						font-weight: 600;
						color: #333;
					}
				}

				.section-more {
					display: flex;
					align-items: center;

					text {
						font-size: 13px;
						color: #999;
						margin-right: 2px;
					}
				}
			}

			// 瀑布流
			.waterfall {
				display: flex;
				padding: 0 12px;
				gap: 10px;

				.waterfall-column {
					flex: 1;
					display: flex;
					flex-direction: column;
					gap: 10px;

					.waterfall-card {
						background: #ffffff;
						border-radius: 12px;
						overflow: hidden;
						box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

						&:active {
							transform: scale(0.98);
						}

						.card-image {
							width: 100%;
							display: flex;
							align-items: center;
							justify-content: center;

							.card-image-placeholder {
								opacity: 0.6;
							}
						}

						.card-info {
							padding: 10px 12px;

							.card-title {
								font-size: 14px;
								font-weight: 600;
								color: #333;
								display: block;
								margin-bottom: 6px;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
							}

							.card-meta {
								display: flex;
								align-items: center;
								justify-content: space-between;

								.card-author {
									font-size: 12px;
									color: #999;
								}

								.card-likes {
									display: flex;
									align-items: center;

									text {
										font-size: 12px;
										color: #999;
										margin-left: 4px;
									}
								}
							}
						}
					}
				}
			}
		}
	}
</style>
