import App from './App'
import uviewPlus from 'uview-plus'

import * as Pinia from 'pinia';
import '@/assets/iconfont/iconfont.css'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp () {
    const app = createSSRApp(App)
	app.use(Pinia.createPinia());
    app.use(uviewPlus);
    return {
        app,
		Pinia
    }
}
// #endif
