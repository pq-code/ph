import { armorTransformation ,loginTg } from "../api/apis/user"
import { host } from "@/config/index";

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
export const getLoginFn = () => {
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
			    desc: '获取你的昵称、头像,用于个性化展示',
			    lang: 'zh_CN',
			    timeout: 3000,
			    success(res) {
					debugger
			        resolve(res);
			    },
			    fail: (err) => {
			        reject(err);
			    },
			});
        });
    };
    return Promise.all([login(), getUserInfo()])
        .then(async (res) => {
            if (res[0].code) {
                // 连接本地后端接口
                try {
					let data = {}
					if(true) { // 小程序使用微信云托管
						data = await armorTransformation({
						   code: res[0].code,
						   userInfo: res[1]
						})
					} else {
					}
					if(data.code == 0) {
						showToast('登录成功');
						const {  token, userId, userName, userPassword, userSource, userSourceID, userNickname, userInfo, userProfilePhoto, sessionKey } = data.result
						console.log('data.result',data.result)
						uni.setStorageSync('token', token);
						uni.setStorageSync('userInfo', { userId,userName, userPassword, userSource, userSourceID, userNickname, userInfo, userProfilePhoto, sessionKey });
                        return data.result
					} else {
                        console.error('登录失败:', err);
					}
				} catch (err) {
                    console.error('登录失败:', err);
                }
            }
        })
}
