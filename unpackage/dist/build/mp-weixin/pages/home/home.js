"use strict";const e=require("../../common/vendor.js");if(require("../../api/service/wxService.js"),!Array){(e.resolveComponent("u-image")+e.resolveComponent("tabbar"))()}Math||((()=>"../../uni_modules/uview-plus/components/u-image/u-image.js")+(()=>"../../components/tabbar/tabbar.js"))();const t={__name:"home",setup(t){e.ref(0),e.ref("");const o=e.ref({title:"",icon:""}),a=e.ref({userNickname:""}),r=e.ref("");e.ref(),e.ref("loadmore"),e.ref("flower"),e.ref("暂无数据点击加载更多"),e.ref([]);let n=[];const i=()=>{var t;e.index.getProvider({service:"oauth",success:function(e){console.log("provider",e.provider)}}),a.value=e.index.getStorageSync("userInfo"),r.value=null==(t=a.value)?void 0:t.userProfilePhoto,(()=>{let t={"晴":"https://a.hecdn.net/img/common/icon/202106d/100.png","多云":"icon-tianqi-duoyun","下雨":"icon-tianqi-xiayu"};if(e.index.getStorageSync("weather")){let a=e.index.getStorageSync("weather");const{now:r}=a.data;o.value={title:`${r.text} ${r.temp} ${r.windDir}`,icon:t[r.tex]}}else e.index.request({url:"https://devapi.qweather.com/v7/weather/now?location=101210101&key=bf108d402c7e471b90e9f0323364ee3a",method:"GET",success:a=>{if(200==a.data.code){const{now:r}=a.data;o.value={title:`${r.text} ${r.temp} ${r.windDir}`,icon:t[r.tex]},e.index.setStorageSync("weather",a),console.log("天气信息",o.value)}},fail:()=>{},complete:()=>{}})})()};e.onPullDownRefresh((()=>{console.log("下拉刷新")})),e.onLoad((()=>{i()}));const s=t=>{e.index.navigateTo({url:t})},c=()=>{e.index.switchTab({url:"/pages/user/home"})};return(t,i)=>({a:e.p({width:"30px",height:"30px",src:r.value,mode:"aspectFill",shape:"circle"}),b:e.o(c),c:e.t(a.value.userNickname),d:e.t(o.value.title||""),e:e.o((e=>s("ph/jigsawPuzzle/jigsawPuzzle"))),f:e.o((e=>s("ph/addWatermark/addWatermark"))),g:e.o((e=>s(""))),h:e.f(e.unref(n),((t,o,a)=>({a:e.t(t.name),b:e.t(t.tips),c:t.name,d:e.o((e=>s(t.router)),t.name)})))})}},o=e._export_sfc(t,[["__scopeId","data-v-e2f6739d"]]);t.__runtimeHooks=1,wx.createPage(o);
