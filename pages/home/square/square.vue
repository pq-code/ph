<script setup>
import { ref } from "vue";
import { onLoad, onShow, onReachBottom } from "@dcloudio/uni-app";
import useUserStore from "@/store/user.js";
import tabbar from "@/components/tabbar/tabbar.vue";

const useStore = useUserStore();

// Mock数据 - 更多图纸
const galleryList = ref([
	{ id: 1, title: '可爱猫咪拼豆', author: '小明', likes: 128, color: '#FF6B6B', height: 200 },
	{ id: 2, title: '星空拼豆图案', author: '小红', likes: 256, color: '#4ECDC4', height: 260 },
	{ id: 3, title: '像素风景画', author: '小刚', likes: 89, color: '#45B7D1', height: 180 },
	{ id: 4, title: '卡通人物拼豆', author: '小美', likes: 312, color: '#96CEB4', height: 240 },
	{ id: 5, title: '花卉图案设计', author: '小李', likes: 167, color: '#FFEAA7', height: 220 },
	{ id: 6, title: '动漫角色拼豆', author: '小王', likes: 198, color: '#DDA0DD', height: 190 },
	{ id: 7, title: '海洋生物图案', author: '小张', likes: 145, color: '#87CEEB', height: 230 },
	{ id: 8, title: '节日主题拼豆', author: '小刘', likes: 223, color: '#FFB6C1', height: 210 },
	{ id: 9, title: '几何图形设计', author: '小陈', likes: 178, color: '#98D8C8', height: 250 },
	{ id: 10, title: '复古像素艺术', author: '小赵', likes: 201, color: '#F7DC6F', height: 185 },
	{ id: 11, title: '游戏角色拼豆', author: '小孙', likes: 267, color: '#BB8FCE', height: 270 },
	{ id: 12, title: '自然风光图案', author: '小周', likes: 156, color: '#82E0AA', height: 200 },
]);

const loading = ref(false);

function openDetail(item) {
	uni.navigateTo({ url: `/pages/home/square/patternDetail?id=${item.id}` })
}

onLoad(() => {
	// 初始化加载
});

onShow(() => {
	useStore.setActive(1);
});

onReachBottom(() => {
	// 模拟加载更多
	if (loading.value) return;
	loading.value = true;
	setTimeout(() => {
		const newItems = galleryList.value.map((item, index) => ({
			...item,
			id: item.id + galleryList.value.length,
			likes: Math.floor(Math.random() * 300) + 50,
		}));
		galleryList.value.push(...newItems);
		loading.value = false;
	}, 1000);
});
</script>

<template>
	<view class="square-page">
		<!-- 自定义导航栏 -->
		<view class="navbar">
			<view class="navbar-content">
				<text class="navbar-title">图纸广场</text>
			</view>
		</view>

		<!-- 瀑布流内容 -->
		<view class="gallery">
			<view class="waterfall">
				<view class="waterfall-column">
					<view
						v-for="item in galleryList.filter((_, i) => i % 2 === 0)"
						:key="item.id"
						class="waterfall-card"
						@click="openDetail(item)"
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
						@click="openDetail(item)"
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

			<!-- 加载状态 -->
			<view class="loading-status" v-if="loading">
				<u-loading-icon size="20"></u-loading-icon>
				<text>加载中...</text>
			</view>
		</view>

		<tabbar></tabbar>
	</view>
</template>

<style scoped lang="less">
	.square-page {
		min-height: 100vh;
		background: #f5f7fa;

		// 导航栏
		.navbar {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			z-index: 100;
			background: #ffffff;
			padding-top: 44px;

			.navbar-content {
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 0 16px;
				height: 44px;

				.navbar-title {
					font-size: 17px;
					font-weight: 600;
					color: #333;
				}
			}
		}

		// 图库内容
		.gallery {
			padding: 100px 12px 70px;

			.waterfall {
				display: flex;
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

			.loading-status {
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 20px 0;

				text {
					font-size: 13px;
					color: #999;
					margin-left: 8px;
				}
			}
		}
	}
</style>
