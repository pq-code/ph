import { wxService } from './service/wxService'
import { getSetting, getLoginFn, showToast } from "@/utils/index.js";
import { errTips } from '@/api/error/errTips';

export const http = {
    get: (url, config) => {
        return requset(url, config, 'get');
    },
    post: (url, config) => {
        return requset(url, config, 'post');
    },
}

const wxRequset = async(url, config, method) => {
	let SERVICE ="login"
	if (url.startsWith('wx/users')) {
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
			"X-WX-SERVICE": SERVICE
		  },
		  "method": method,
		  "data": config
		})
		const res = data.data
		if (res.code == 0) {
		    resolve(res)
		} else if (res.error == '10101') {
		    showToast('token已过期重新登录');
		    getSetting("scope.record").then((res) => {
		        getLoginFn().then((res) => {
		            console.log("res", res);
		        });
		    });
		} else {
		    showToast(errTips[res.code] || res.message || '未知错误');
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
      if (systemInfo.platform === 'tt' || systemInfo.platform === 'devtools') {
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



