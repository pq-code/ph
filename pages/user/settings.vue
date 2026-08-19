<script setup>
import { ref } from "vue";

const showLogoutConfirm = ref(false);
const showDeleteConfirm = ref(false);
const showPasswordPopup = ref(false);

// 修改密码表单
const passwordForm = ref({
	oldPassword: "",
	newPassword: "",
	confirmPassword: "",
});

// 退出登录
const logout = () => {
	showLogoutConfirm.value = true;
};
const confirmLogout = () => {
	uni.removeStorageSync("userInfo");
	showLogoutConfirm.value = false;
	uni.showToast({ title: '已退出登录', icon: 'success' });
	setTimeout(() => {
		uni.navigateBack();
	}, 1000);
};

// 注销账号
const deleteAccount = () => {
	showDeleteConfirm.value = true;
};
const confirmDelete = () => {
	uni.removeStorageSync("userInfo");
	showDeleteConfirm.value = false;
	uni.showToast({ title: '账号已注销', icon: 'success' });
	setTimeout(() => {
		uni.navigateBack();
	}, 1000);
};

// 修改密码
const changePassword = () => {
	passwordForm.value = { oldPassword: "", newPassword: "", confirmPassword: "" };
	showPasswordPopup.value = true;
};
const submitPassword = () => {
	const { oldPassword, newPassword, confirmPassword } = passwordForm.value;
	if (!oldPassword || !newPassword || !confirmPassword) {
		uni.showToast({ title: '请填写完整', icon: 'none' });
		return;
	}
	if (newPassword !== confirmPassword) {
		uni.showToast({ title: '两次密码不一致', icon: 'none' });
		return;
	}
	if (newPassword.length < 6) {
		uni.showToast({ title: '密码至少6位', icon: 'none' });
		return;
	}
	// TODO: 调用修改密码接口
	showPasswordPopup.value = false;
	uni.showToast({ title: '修改成功', icon: 'success' });
};

// 清除缓存
const clearCache = () => {
	uni.showModal({
		title: '提示',
		content: '确定清除缓存吗？',
		success: (res) => {
			if (res.confirm) {
				uni.showToast({ title: '缓存已清除', icon: 'success' });
			}
		}
	});
};
</script>

<template>
	<view class="settings-page">
		<!-- 导航栏 -->
		<view class="navbar">
			<view class="navbar-content">
				<view class="navbar-back" @click="uni.navigateBack()">
					<text class="iconfont icon-jiantouzuo" style="font-size:18px;color:#333"></text>
				</view>
				<text class="navbar-title">设置</text>
				<view class="navbar-right"></view>
			</view>
		</view>

		<scroll-view scroll-y class="settings-scroll">
			<!-- 账号安全 -->
			<view class="section">
				<text class="section-title">账号安全</text>
				<view class="menu-list">
					<view class="menu-item" @click="changePassword">
						<view class="menu-icon" style="background:#487AFA15">
							<text class="iconfont icon-mimasuo" style="font-size:18px;color:#487AFA"></text>
						</view>
						<text class="menu-label">修改密码</text>
						<text class="iconfont icon-jiantouyou" style="font-size:14px;color:#ccc"></text>
					</view>
				</view>
			</view>

			<!-- 通用设置 -->
			<view class="section">
				<text class="section-title">通用</text>
				<view class="menu-list">
					<view class="menu-item" @click="clearCache">
						<view class="menu-icon" style="background:#67C23A15">
							<text class="iconfont icon-lajitong" style="font-size:18px;color:#67C23A"></text>
						</view>
						<text class="menu-label">清除缓存</text>
						<text class="iconfont icon-jiantouyou" style="font-size:14px;color:#ccc"></text>
					</view>
				</view>
			</view>

			<!-- 退出/注销 -->
			<view class="section action-section">
				<view class="action-btn logout-btn" @click="logout">
					<text>退出登录</text>
				</view>
				<view class="action-btn delete-btn" @click="deleteAccount">
					<text>注销账号</text>
				</view>
			</view>

			<view style="height: 40px;"></view>
		</scroll-view>

		<!-- 修改密码弹窗 -->
		<view v-if="showPasswordPopup" class="popup-mask" @click="showPasswordPopup = false">
			<view class="popup-panel" @click.stop>
				<view class="popup-body">
					<text class="popup-title">修改密码</text>
					<view class="form-group">
						<input class="form-input" type="text" password v-model="passwordForm.oldPassword" placeholder="请输入旧密码" />
					</view>
					<view class="form-group">
						<input class="form-input" type="text" password v-model="passwordForm.newPassword" placeholder="请输入新密码" />
					</view>
					<view class="form-group">
						<input class="form-input" type="text" password v-model="passwordForm.confirmPassword" placeholder="请确认新密码" />
					</view>
				</view>
				<view class="popup-actions">
					<view class="popup-btn cancel" @click="showPasswordPopup = false"><text>取消</text></view>
					<view class="popup-btn confirm" @click="submitPassword"><text>确认修改</text></view>
				</view>
			</view>
		</view>

		<!-- 退出确认弹窗 -->
		<view v-if="showLogoutConfirm" class="popup-mask" @click="showLogoutConfirm = false">
			<view class="popup-panel" @click.stop>
				<view class="popup-body">
					<text class="popup-icon iconfont icon-zhuyishixiang" style="font-size:40px;color:#E6A23C"></text>
					<text class="popup-title">确认退出登录？</text>
					<text class="popup-desc">退出后需要重新登录</text>
				</view>
				<view class="popup-actions">
					<view class="popup-btn cancel" @click="showLogoutConfirm = false"><text>取消</text></view>
					<view class="popup-btn confirm" @click="confirmLogout"><text>确认退出</text></view>
				</view>
			</view>
		</view>

		<!-- 注销确认弹窗 -->
		<view v-if="showDeleteConfirm" class="popup-mask" @click="showDeleteConfirm = false">
			<view class="popup-panel" @click.stop>
				<view class="popup-body">
					<text class="popup-icon iconfont icon-zhuyishixiang" style="font-size:40px;color:#F56C6C"></text>
					<text class="popup-title">确认注销账号？</text>
					<text class="popup-desc">注销后数据将无法恢复，请谨慎操作</text>
				</view>
				<view class="popup-actions">
					<view class="popup-btn cancel" @click="showDeleteConfirm = false"><text>取消</text></view>
					<view class="popup-btn danger" @click="confirmDelete"><text>确认注销</text></view>
				</view>
			</view>
		</view>
	</view>
</template>

<style scoped lang="less">
.settings-page {
	min-height: 100vh;
	background: #f5f7fa;
}

// 导航栏
.navbar {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 100;
	background: #ffffff;
	padding-top: 44px;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);

	.navbar-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 16px;
		height: 44px;

		.navbar-back {
			width: 40px;
			height: 44px;
			display: flex;
			align-items: center;
			cursor: pointer;
		}

		.navbar-title {
			font-size: 17px;
			font-weight: 600;
			color: #333;
		}

		.navbar-right {
			width: 40px;
		}
	}
}

.settings-scroll {
	flex: 1;
	padding-top: 88px;
}

// 段落
.section {
	margin: 0 16px 16px;

	.section-title {
		font-size: 13px;
		color: #999;
		margin-bottom: 8px;
		padding-left: 4px;
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

// 退出/注销按钮
.action-section {
	padding: 0;
	display: flex;
	flex-direction: column;
	gap: 10px;
	margin-top: 8px;

	.action-btn {
		width: 100%;
		height: 44px;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;

		text {
			font-size: 14px;
			font-weight: 500;
		}

		&.logout-btn {
			background: #fff;
			text { color: #333; }
			&:active { background: #f5f5f5; }
		}

		&.delete-btn {
			background: #fff;
			text { color: #F56C6C; }
			&:active { background: #fef0f0; }
		}
	}
}

// 弹窗
.popup-mask {
	position: fixed;
	top: 0; left: 0; right: 0; bottom: 0;
	background: rgba(0, 0, 0, 0.45);
	z-index: 200;
	display: flex;
	align-items: center;
	justify-content: center;
}

.popup-panel {
	width: 80%;
	background: #fff;
	border-radius: 16px;
	overflow: hidden;

	.popup-body {
		padding: 30px 20px 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;

		.popup-title {
			font-size: 17px;
			font-weight: 600;
			color: #333;
		}

		.popup-desc {
			font-size: 13px;
			color: #999;
		}

		.form-group {
			width: 100%;
			margin-top: 8px;

			.form-input {
				width: 100%;
				height: 44px;
				background: #f5f7fa;
				border-radius: 10px;
				padding: 0 14px;
				font-size: 14px;
				color: #333;
				box-sizing: border-box;
			}
		}
	}

	.popup-actions {
		display: flex;
		border-top: 1px solid #f0f0f0;

		.popup-btn {
			flex: 1;
			height: 48px;
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;

			text {
				font-size: 15px;
			}

			&.cancel {
				border-right: 1px solid #f0f0f0;
				text { color: #999; }
			}

			&.confirm {
				text { color: #487AFA; font-weight: 600; }
			}

			&.danger {
				text { color: #F56C6C; font-weight: 600; }
			}

			&:active { background: #f9f9f9; }
		}
	}
}
</style>
