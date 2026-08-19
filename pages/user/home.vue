<script setup>
import { ref } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { getLoginFn } from "@/utils/index.js";
import { editUserInfo } from "@/api/apis/user";
import useUserStore from "@/store/user.js";
import tabbar from "@/components/tabbar/tabbar.vue";

const useStore = useUserStore();

const formData = ref({
	userAvatar: "",
	userName: "",
});

// 自定义背景
const bgImage = ref("");

// Mock 统计数据
const stats = ref({
	patternCount: 12,
	totalLikes: 1286,
	totalBeads: 28560,
	favorites: 8,
});

// Mock 我的图纸
const myPatterns = ref([
	{ id: 1, title: '可爱猫咪拼豆', likes: 128, date: '2026-08-15', color: '#FF6B6B' },
	{ id: 2, title: '星空拼豆图案', likes: 256, date: '2026-08-12', color: '#4ECDC4' },
	{ id: 3, title: '像素风景画', likes: 89, date: '2026-08-10', color: '#45B7D1' },
]);

const isLoggedIn = ref(false);

// 登录
const login = () => {
	// #ifdef MP-WEIXIN
	getLoginFn().then(() => {
		loadUserInfo();
	});
	// #endif
};

// 加载用户信息
const loadUserInfo = () => {
	const info = uni.getStorageSync("userInfo");
	if (info && info.userNickname) {
		formData.value.userAvatar = info.userProfilePhoto || "";
		formData.value.userName = info.userNickname || "";
		isLoggedIn.value = true;
	} else {
		isLoggedIn.value = false;
	}
};

// 修改头像
const getUserProfile = (e) => {
	const { avatarUrl = "" } = e.detail;
	if (avatarUrl) {
		formData.value.userAvatar = avatarUrl;
		saveUserInfo();
	}
};

// 修改昵称
const onNicknameBlur = (e) => {
	if (e.detail.value) {
		formData.value.userName = e.detail.value;
		saveUserInfo();
	}
};

// 更换背景图
const changeBg = () => {
	uni.chooseImage({
		count: 1,
		sizeType: ['compressed'],
		sourceType: ['album', 'camera'],
		success: (res) => {
			bgImage.value = res.tempFilePaths[0];
			uni.setStorageSync('userBgImage', bgImage.value);
		}
	});
};

// 保存用户信息
const saveUserInfo = async () => {
	try {
		let data = await editUserInfo({
			userProfilePhoto: formData.value.userAvatar,
			userNickname: formData.value.userName
		});
		const res = data.data;
		if (res.code == 0) {
			let result = uni.getStorageSync("userInfo") || {};
			result = {
				...result,
				userProfilePhoto: formData.value.userAvatar,
				userNickname: formData.value.userName
			};
			uni.setStorageSync("userInfo", result);
			uni.showToast({ title: '修改成功', icon: 'success' });
		}
	} catch (err) {
		console.error('保存失败:', err);
	}
};

// 跳转编辑资料
const goEditProfile = () => {
	uni.navigateTo({ url: '/pages/user/editUserInfo' });
};

// 查看图纸详情
const viewPattern = (item) => {
	uni.navigateTo({ url: `/pages/home/square/patternDetail?id=${item.id}` });
};

// 菜单项
const menuItems = [
	{ icon: 'icon-shoucang', label: '我的收藏', color: '#FF6B6B', action: 'favorites' },
	{ icon: 'icon-xiazai', label: '导出记录', color: '#487AFA', action: 'exports' },
	{ icon: 'icon-shezhi', label: '设置', color: '#999', action: 'settings' },
	{ icon: 'icon-guanyu', label: '关于我们', color: '#67C23A', action: 'about' },
];

const handleMenuClick = (item) => {
	if (item.action === 'settings') {
		uni.navigateTo({ url: '/pages/user/settings' });
		return;
	}
	uni.showToast({ title: item.label, icon: 'none' });
};

onLoad(() => {
	loadUserInfo();
	bgImage.value = uni.getStorageSync('userBgImage') || '';
});

onShow(() => {
	useStore.setActive(2);
});
</script>

<template>
	<view class="user-page">
		<!-- 顶部背景 + 用户信息 -->
		<view class="user-header">
			<image v-if="bgImage" :src="bgImage" class="header-bg-img" mode="aspectFill" />
			<view v-else class="header-bg"></view>
			<!-- 更换背景按钮 -->
			<view class="change-bg-btn" @click="changeBg">
				<text class="iconfont icon-xiangji" style="font-size:14px;color:#fff"></text>
			</view>
			<view class="user-info">
				<!-- 头像 -->
				<view class="avatar-wrapper">
					<button v-if="!isLoggedIn" class="avatar-btn" open-type="chooseAvatar" @chooseavatar="getUserProfile">
						<view class="avatar-placeholder">
							<text class="iconfont icon-yonghu" style="font-size:36px;color:#fff"></text>
						</view>
					</button>
					<button v-else class="avatar-btn" open-type="chooseAvatar" @chooseavatar="getUserProfile">
						<image v-if="formData.userAvatar" :src="formData.userAvatar" class="avatar-img" mode="aspectFill" />
						<view v-else class="avatar-placeholder">
							<text class="iconfont icon-yonghu" style="font-size:36px;color:#fff"></text>
						</view>
					</button>
				</view>

				<!-- 昵称 -->
				<view class="nickname-row">
					<input v-if="isLoggedIn" type="nickname" class="nickname-input" :value="formData.userName" placeholder="请输入昵称" @blur="onNicknameBlur" />
					<text v-else class="login-text" @click="login">点击登录</text>
				</view>

				<!-- 用户ID -->
				<text v-if="isLoggedIn" class="user-id">ID: 100001</text>
			</view>
		</view>

		<!-- 数据统计 -->
		<view class="stats-card">
			<view class="stat-item">
				<text class="stat-value">{{ stats.patternCount }}</text>
				<text class="stat-label">我的图纸</text>
			</view>
			<view class="stat-divider"></view>
			<view class="stat-item">
				<text class="stat-value">{{ stats.totalLikes }}</text>
				<text class="stat-label">获赞</text>
			</view>
			<view class="stat-divider"></view>
			<view class="stat-item">
				<text class="stat-value">{{ (stats.totalBeads / 1000).toFixed(1) }}k</text>
				<text class="stat-label">总颗数</text>
			</view>
			<view class="stat-divider"></view>
			<view class="stat-item">
				<text class="stat-value">{{ stats.favorites }}</text>
				<text class="stat-label">收藏</text>
			</view>
		</view>

		<scroll-view scroll-y class="user-scroll">
			<!-- 我的图纸 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">我的图纸</text>
					<view class="section-more">
						<text>查看全部</text>
						<text class="iconfont icon-jiantouyou" style="font-size:12px;color:#999"></text>
					</view>
				</view>
				<view class="pattern-list">
					<view v-for="item in myPatterns" :key="item.id" class="pattern-item" @click="viewPattern(item)">
						<view class="pattern-thumb" :style="{ background: item.color }">
							<text class="iconfont icon-tupian" style="font-size:20px;color:rgba(255,255,255,0.6)"></text>
						</view>
						<view class="pattern-info">
							<text class="pattern-name">{{ item.title }}</text>
							<view class="pattern-meta">
								<text class="pattern-date">{{ item.date }}</text>
								<view class="pattern-likes">
									<text class="iconfont icon-shoucang" style="font-size:12px;color:#ff6b6b"></text>
									<text class="likes-count">{{ item.likes }}</text>
								</view>
							</view>
						</view>
						<text class="iconfont icon-jiantouyou" style="font-size:14px;color:#ccc"></text>
					</view>
				</view>
			</view>

			<!-- 功能菜单 -->
			<view class="section">
				<view class="menu-list">
					<view v-for="item in menuItems" :key="item.label" class="menu-item" @click="handleMenuClick(item)">
						<view class="menu-icon" :style="{ background: item.color + '15' }">
							<text class="iconfont" :class="item.icon" :style="{ fontSize: '18px', color: item.color }"></text>
						</view>
						<text class="menu-label">{{ item.label }}</text>
						<text class="iconfont icon-jiantouyou" style="font-size:14px;color:#ccc"></text>
					</view>
				</view>
			</view>

			<!-- 底部留白 -->
			<view style="height: 80px;"></view>
		</scroll-view>

		<tabbar></tabbar>
	</view>
</template>

<style scoped lang="less">
.user-page {
	min-height: 100vh;
	background: #f5f7fa;
	display: flex;
	flex-direction: column;
}

// 顶部背景 + 用户信息
.user-header {
	position: relative;
	padding-bottom: 40px;

	.header-bg {
		height: 180px;
		background: linear-gradient(135deg, #487AFA, #6C5CE7);
		border-radius: 0 0 24px 24px;
	}

	.header-bg-img {
		width: 100%;
		height: 180px;
		border-radius: 0 0 24px 24px;
	}

	.change-bg-btn {
		position: absolute;
		top: 54px;
		right: 16px;
		width: 32px;
		height: 32px;
		background: rgba(0, 0, 0, 0.3);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		z-index: 10;

		&:active {
			background: rgba(0, 0, 0, 0.5);
		}
	}

	.user-info {
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;

		.avatar-wrapper {
			.avatar-btn {
				padding: 0;
				margin: 0;
				background: transparent;
				border: none;
				border-radius: 50%;
				line-height: normal;
				width: 80px;
				height: 80px;
				overflow: hidden;
				&::after { display: none; }
			}

			.avatar-img {
				width: 80px;
				height: 80px;
				border-radius: 50%;
				border: 3px solid #fff;
				box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
			}

			.avatar-placeholder {
				width: 80px;
				height: 80px;
				border-radius: 50%;
				background: linear-gradient(135deg, #487AFA, #6C5CE7);
				border: 3px solid #fff;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}

		.nickname-row {
			margin-top: 10px;

			.nickname-input {
				font-size: 20px;
				font-weight: 700;
				color: #333;
				text-align: center;
				width: 200px;
			}

			.login-text {
				font-size: 18px;
				font-weight: 600;
				color: #fff;
				background: #487AFA;
				padding: 6px 24px;
				border-radius: 20px;
			}
		}

		.user-id {
			font-size: 12px;
			color: #999;
			margin-top: 4px;
		}
	}
}

// 数据统计
.stats-card {
	margin: 0 16px;
	background: #fff;
	border-radius: 14px;
	padding: 16px 0;
	display: flex;
	align-items: center;
	box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
	position: relative;
	z-index: 1;

	.stat-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;

		.stat-value {
			font-size: 20px;
			font-weight: 700;
			color: #333;
		}

		.stat-label {
			font-size: 11px;
			color: #999;
		}
	}

	.stat-divider {
		width: 1px;
		height: 30px;
		background: #f0f0f0;
	}
}

.user-scroll {
	flex: 1;
	padding: 12px 0;
}

// 段落
.section {
	margin: 0 16px 12px;

	.section-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 10px;

		.section-title {
			font-size: 16px;
			font-weight: 600;
			color: #333;
		}

		.section-more {
			display: flex;
			align-items: center;
			gap: 2px;
			text {
				font-size: 12px;
				color: #999;
			}
		}
	}
}

// 图纸列表
.pattern-list {
	background: #fff;
	border-radius: 12px;
	overflow: hidden;

	.pattern-item {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 16px;
		border-bottom: 1px solid #f5f5f5;
		cursor: pointer;

		&:last-child { border-bottom: none; }
		&:active { background: #f9f9f9; }

		.pattern-thumb {
			width: 48px;
			height: 48px;
			border-radius: 8px;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-shrink: 0;
		}

		.pattern-info {
			flex: 1;
			min-width: 0;
			display: flex;
			flex-direction: column;
			gap: 4px;

			.pattern-name {
				font-size: 14px;
				font-weight: 600;
				color: #333;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.pattern-meta {
				display: flex;
				align-items: center;
				gap: 12px;

				.pattern-date {
					font-size: 11px;
					color: #ccc;
				}

				.pattern-likes {
					display: flex;
					align-items: center;
					gap: 3px;

					.likes-count {
						font-size: 12px;
						color: #999;
					}
				}
			}
		}
	}
}

// 菜单列表
.menu-list {
	background: #fff;
	border-radius: 12px;
	overflow: hidden;

	.menu-item {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 14px 16px;
		border-bottom: 1px solid #f5f5f5;
		cursor: pointer;

		&:last-child { border-bottom: none; }
		&:active { background: #f9f9f9; }

		.menu-icon {
			width: 36px;
			height: 36px;
			border-radius: 10px;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-shrink: 0;
		}

		.menu-label {
			flex: 1;
			font-size: 14px;
			color: #333;
		}
	}
}
</style>
