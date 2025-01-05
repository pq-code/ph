import { wxService } from './service/wxService'

export const http = {
    get: (url, config) => {
        return requset(url, config, 'get');
    },
    post: (url, config) => {
        return requset(url, config, 'post');
    },
}

export default function requset(url, config = {}, method) {
    // const { hideLoading } = config
    //加载圈
    if (config && !config.hideLoading) {
        uni.showLoading({
            title: '加载中...'
        });
    }

    if (true) {
        return wxService(url, config, method)
    }
}
