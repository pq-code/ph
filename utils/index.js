import { armorTransformation } from "../api/apis/user"
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
                desc: '获取你的昵称、头像、地区及性别',
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
    return Promise.all([login(), getUserInfo()])
        .then(async (res) => {
            if (res[0].code) {
                // 连接本地后端接口
                try {
                    const data = await armorTransformation({
                        authInfo: {
                            code: res[0].code,
                            userInfo: res[1]
                        }
                    })
					debugger
                    //登录成功
                    showToast('登录成功');
                    const { is_admins, token, user_id, user_nickname, user_profile_photo, user_info } = data.result
					console.log('data.result',data.result)
                    uni.setStorageSync('token', token);
                    uni.setStorageSync('userInfo', { is_admins, user_id, user_nickname, user_profile_photo, user_info });
                } catch (err) {
                    console.log(err);
                }
            }
        })
}
