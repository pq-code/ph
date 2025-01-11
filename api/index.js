import { wxService } from './service/wxService'
import { getSetting, getLoginFn, showToast,wxUserlLogin } from "@/utils/index.js";
import { errTips } from '@/api/error/errTips';

export const http = {
    get: (url, config) => {
        return requset(url, config, 'get');
    },
    post: (url, config) => {
        return requset(url, config, 'post');
    },
	patch: (url, config) => {
	    return requset(url, config, 'patch');
	},
}

const wxRequset = async(url, config, method) => {
	let SERVICE ="login"
	if (url.startsWith('users')) {
		SERVICE ="login"
	} else {
		SERVICE ="koa-0jh8"
	}

	return new Promise(async(resolve, reject) => {
		let data =  await wx.cloud.callContainer({
		  "config": {
			"env": "prod-8gqm1nbtf8eae76e"
		  },
		  "path": url,
		  "header": {
			"X-WX-SERVICE": SERVICE,
			"authorization": uni.getStorageSync("token")
		  },
		  "method": method,
		  "data": config
		})
		const res = data.data
		if (res.code == 0) {
		    resolve(res)
		} else if (res.error == '10101') {
			showToast('token已过期重新登录');
		    wxUserlLogin().then((res) => {
				console.log("res", res);
				resolve(res)
		    },rej => {
				reject(rej)
			})
		} else {
		    showToast(errTips[res.error] || res.message || '未知错误');
			reject(res)
		}
	})
}
export default async function requset(url, config = {}, method) {
  const systemInfo = uni.getSystemInfoSync();

  if (config && !config.hideLoading) {
      uni.showLoading({
          title: '加载中...'
      });
  }

  try {
      let res;
      if (true) {
		// 微信云托管接口
		return wxRequset(url, config, method);
      } else {
        return wxService(url, config, method);
      }
  } catch (err) {
      console.error(err);
      return Promise.reject(err); // 返回一个被拒绝的 Promise
  } finally {
      if (config && !config.hideLoading) {
          uni.hideLoading();
      }
  }
}



