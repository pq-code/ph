import {
	armorTransformation,
	loginTg,
	getUerInfo
} from "../api/apis/user"
import {
	host
} from "@/config/index";

// 获取图片
export const imageUrl = (e) => {
	return host + "/image" + e;
}

export const showToast = (e) => {
	uni.showToast({
		icon: 'none',
		position: 'center',
		title: e,
	});
};

export const uploadImgs = (uploadUrl, filePath, successCallback, errorCallback) => {

}

export const getSetting = (scope) => {
	return new Promise((resolve, reject) => {
		uni.authorize({
			scope,
			success(data) {
				resolve(data);
			},
			fail(err) {
				console.log(err);
				reject(err);
			},
		});
	})
}

// 登录
export const getLoginFn = async () => {
	try {
		let user = await getUerInfo() // 判断token是否过期没有过期不需要重新登录
		if (user.code == 0) {
			return new Promise((resolve, reject) => {
				resolve(user)
			});
		}
	} catch (err) {
		return wxUserlLogin()
	}
}


// 登录
export const wxUserlLogin = async () => {
	const login = () => {
		return new Promise((resolve, reject) => {
			//获取code
			uni.login({
				provider: 'weixin',
				searchFn: true,
				onlyAuthorize: true,
				success(res) {
					resolve(res);
				},
				fail: (err) => {
					reject(err);
				},
			});
		});
	};
	const getUserInfo = () => {
		return new Promise((resolve, reject) => {
			//获取用户信息
			uni.getUserInfo({
				provider: 'weixin',
				desc: '昵称、头像,用于个性化展示',
				lang: 'zh_CN',
				timeout: 3000,
				success(res) {
					resolve(res);
				},
				fail: (err) => {
					reject(err);
				},
			});
		});
	};
	return new Promise(async(resolve, reject) => {
		let res = await Promise.all([login()])
		console.log(res)
		// 连接本地后端接口
		let data = {}
		if (res[0].code) {
			try {
				// 登录
				data = await armorTransformation({
					code: res[0].code,
					userInfo: res[1] || {}
				})
				if (data.code == 0) {
					// showToast('登录成功');
					const {
						token,
						userId,
						userName,
						userPassword,
						userSource,
						userSourceID,
						userNickname,
						userInfo,
						userProfilePhoto,
						sessionKey
					} = data.result
					uni.setStorageSync('token', token);
					uni.setStorageSync('userInfo', {
						userId,
						userName,
						userPassword,
						userSource,
						userSourceID,
						userNickname,
						userInfo,
						userProfilePhoto,
						sessionKey
					});
					uni.hideLoading();
					resolve(data)
				} else {
					console.error('登录失败:', err);
					uni.hideLoading();
					reject(data)
				}
			} catch (err) {
				console.error('登录失败:', err);
				uni.hideLoading();
				reject(data)
			}
		}
	})
}