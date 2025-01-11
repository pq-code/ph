<script setup>
	import {
		ref,
		computed
	} from "vue";
	import {
		onLoad
	} from "@dcloudio/uni-app";
	import dayjs from "dayjs";
	import {
		getSetting,
		getLoginFn
	} from "@/utils/index.js";
	
	import { editUserInfo } from "@/api/apis/user";
	
	const formData = ref({
		userAvatar: "",
		userName: "",
		province: "",
		sex: "",
	});

	const editUser = () => {
		uni.navigateTo({
			url: "editUserInfo",
		});
	};

	const login = () => {
		console.log("当前登录已经失效重新登录");
		// #ifdef MP-WEIXIN
		getLoginFn().then((data) => {
			debugger
			const {
				userProfilePhoto,
				userNickname
			} =
			uni.getStorageSync("userInfo");
			formData.value.userAvatar = userProfilePhoto;
			formData.value.userName = userNickname;
		});
		// #endif
	};
	
	const editUserInfoFn = async() => {
		let data = await editUserInfo({
			userProfilePhoto : formData.value.userAvatar,
			userNickname: formData.value.userName
		})
		const res = data.data
		if (res.code == 0) {
			showToast('修改成功');
			let result = uni.getStorageSync("userInfo");
			result = {
				...result,
				userProfilePhoto : formData.value.userAvatar,
				userNickname: formData.value.userName
			}
			uni.setStorageSync("userInfo",result);
		} else if(res.error = "10101") {
			login()
		}
	};
	
	const getUserProfile = (e) => {
		const { avatarUrl = ""} = e.detail
		if(avatarUrl) {
			formData.value.userAvatar = e.detail.avatarUrl
			editUserInfoFn();
		}
	}
	
	const bindinput = (e) =>{
		 console.log('nickName', e)
		 if(e.detail.value) {
			 formData.value.userName = e.detail.value;
			 editUserInfoFn();
		 }
	 }
	 
	onLoad(() => {
		const {
			userProfilePhoto,
			userNickname
		} =
		uni.getStorageSync("userInfo");
		formData.value.userAvatar = userProfilePhoto;
		formData.value.userName = userNickname;
		console.log(formData.value);
	});
	
</script>

<template>
	<view class="content">
		<view class="content-heard">
			<viiew class="content-heard-back">
				<!-- <u-image :showLoading="true" src="" width="100vw" height="250px"></u-image> -->
			</viiew>
			<view class="content-heard-userAvatar" @click="login">
				<u-image open-type="chooseAvatar" @click="getUserProfile" :showLoading="true" :src="formData.userAvatar" width="80px" height="80px"
					shape="circle"></u-image>
				<view class="user-name">
				{{ formData.userName || "点击登录" }}
				</view>
			</view>
		</view>
		
		<view class="content-main-center">
			<vie class="content-main-center-form">
				<view class="content-main-center-form-item">
					<view> 头像</view>
					<view>
						<button style="width: 60px;"  open-type="chooseAvatar" @chooseavatar="getUserProfile">
							<u-image open-type="chooseAvatar" @click="getUserProfile" :showLoading="true" :src="formData.userAvatar" width="30px" height="30px"
								shape="circle"></u-image>
						</button>
					</view>
				</view>
				<view class="content-main-center-form-item">
					<view> 名称</view>
					<view style="width: calc(100% - 70px);">
						<input type="nickname" style="text-align: right;" v-model="formData.userName" border="none"  placeholder="请输入昵称"
						@blur="bindinput"></input>
					</view>
				</view>
			</vie>
		</view>
		
		<tabbar></tabbar>
	</view>
</template>

<style lang="less">
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100vw;
		height: 100vh;
		flex-wrap: nowrap;
		background: linear-gradient(to bottom, #82b9ff, #ddeafb, #dfe8f3);
		.content-heard {
			display: flex;
			align-items: center;
			align-content: center;
			flex-direction: column;
			height: 220px;
			width: 100vw;
			.content-heard-back {
				width: 100vw;
				height: 220px;
				position: relative;
			}
			.content-heard-userAvatar {
				display: flex;
				justify-content: center;
				flex-direction: column;
				align-items: center;
				width: 100%;
				// position: relative;
				// background: linear-gradient(#ffffff00 5%,#ffffffa6 25%, #ffffff 50%, #ffffff 100%);
				.user-name {
					margin-top: 10px;
					font-size: 20px;
					font-weight: 600;
					color: rgb(28, 28, 28);
				}
			}
		}

		.content-main-center {
			flex: 1;
			width: calc(100vw - 40px);
			border-radius: 6px;
			background: #ffffff;
			margin: 10px;
			padding: 10px;
			.content-main-center-form {
				width: calc(100vw - 40px);
				display: flex;
				flex-direction: column;
				.content-main-center-form-item {
					// width: 100%;
					height: 45px;
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					padding: 10px;
				}
			}
		}
	}
</style>