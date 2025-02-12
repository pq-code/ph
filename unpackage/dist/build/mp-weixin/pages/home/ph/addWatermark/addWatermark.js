"use strict";const e=require("../../../../common/vendor.js");if(!Array){(e.resolveComponent("u-picker")+e.resolveComponent("u-input")+e.resolveComponent("u-form-item")+e.resolveComponent("u-form"))()}Math||((()=>"../../../../uni_modules/uview-plus/components/u-picker/u-picker.js")+(()=>"../../../../uni_modules/uview-plus/components/u-input/u-input.js")+(()=>"../../../../uni_modules/uview-plus/components/u-form-item/u-form-item.js")+(()=>"../../../../uni_modules/uview-plus/components/u-form/u-form.js")+t)();const t=()=>"../../../../components/pages/page.js",o={__name:"addWatermark",setup(t){const o=e.getCurrentInstance(),s=e.ref({url:"",status:"success",message:0}),a=e.ref({url:"",status:"success",message:0}),l=e.ref({longitude:"",latitude:"",address:"",notes:"",test:"",image:"",opacity:"",angle:-45,density:""}),n=e.ref({width:"",height:""}),i=()=>{const t=e.index.createCanvasContext("watermark");t.clearRect(0,0,n.value.width,n.value.height),t.draw()};e.onLoad((()=>{u.value=!0,e.nextTick$1((()=>{u.value=!1}))})),e.onMounted((()=>{e.index.createSelectorQuery().in(o.proxy).select("#contentMain").boundingClientRect((e=>{e&&(console.log("元素的宽："+e.width),console.log("元素的高："+e.height),n.value={width:e.width,height:e.height})})).exec()}));const r=()=>new Promise(((t,o)=>{e.index.chooseImage({count:1,sizeType:["original","compressed"],sourceType:["album"],success:async function(o){i();const l=n.value.width,r=n.value.height,c=await(d=o.tempFilePaths[0],new Promise(((t,o)=>{e.index.getImageInfo({src:d,success:t,fail:o})})));var d;let h=c.width,m=c.height;a.value.url={url:c.path,width:h,height:m,status:"success",message:0};let p=1;p=h>m?h/l:m/r,h/=p,m/=p;let g=(l-h)/2,v=(r-m)/2;const f=e.index.createCanvasContext("watermark");f.imageSmoothingEnabled=!1,await f.drawImage(c.path,g,v,h,m),await f.draw(!0),s.value={url:c.path,width:h,height:m,x:g,y:v,status:"success",message:0},u.value=!1,t()},fail:function(t){console.log(t.errMsg),e.index.showToast({title:"选择图片失败",icon:"none"}),o()}})})),c=async()=>{const{width:t,height:o,x:a,y:n,url:r}=s.value,c=e.index.createCanvasContext("watermark");i(),await c.drawImage(r,a,n,t,o),c.save();const u="现场拍照",d=.15*Math.min(t,o);c.setFontSize(d),c.setTextAlign("center"),c.setTextBaseline("middle");const h=a+t/2,m=n+o/2;c.translate(h,m),c.setGlobalAlpha(.2),c.setLineWidth(3),c.setStrokeStyle("#FFFFFF"),c.strokeText(u,0,0),c.setGlobalAlpha(.2),c.setFillStyle("#666666"),c.font=`bold ${d}px sans-serif`,c.fillText(u,0,0),c.restore();c.setFontSize(14),c.setTextAlign("left"),c.setTextBaseline("top"),c.setGlobalAlpha(.5),c.setFillStyle("#666666");const p=e.dayjs().format("YYYY-MM-DD HH:mm:ss"),g=[`经度：${l.value.longitude}`,`纬度：${l.value.latitude}`,"坐标：WGS84坐标系",`地址：${l.value.address}`,`时间：${p}`,`备注：${l.value.notes}`];let v=o-18*g.length-20+n;g.forEach(((e,t)=>{c.setGlobalAlpha(1),c.setFillStyle("#FFFFFF"),c.fillText(e,20+a,v),v+=18})),c.restore(),c.draw(!0)},u=e.ref(!1),d=e.reactive([[{label:"添加图片/编辑图片",value:1},{label:"拍照",value:2},{label:"预览图片",value:3}]]),h=async t=>{var o;1==t.value[0].value?(await r(),c()):2==t.value[0].value?e.index.getSetting({success:t=>{t.authSetting["scope.camera"]?m():e.index.authorize({scope:"scope.camera",success(){m()},fail(){_this.openSetting("camera").then((e=>{m()}))}})},fail:e=>{console.log("获取用户授权信息失败")}}):(o=s.value.url,e.index.previewImage({urls:[o],current:1,longPressActions:{itemList:["发送给朋友","保存图片","收藏"],success:function(e){},fail:function(t){console.log(t.errMsg),e.index.showToast({title:"预览失败",icon:"none"})}}}))},m=()=>{e.index.chooseImage({count:1,sourceType:["camera"],success:e=>{this.imagePath=e.tempFilePaths[0],console.log("拍照成功，图片路径：",this.imagePath),this.uploadImage(this.imagePath)},fail:t=>{console.error("拍照失败：",t),e.index.showToast({title:"拍照失败，请重试",icon:"none"})}})},p=()=>{const{width:t,height:o,x:a,y:l}=s.value;e.index.canvasToTempFilePath({canvasId:"watermark",x:a,y:l,width:t,height:o,destWidth:t,destHeight:o,success:t=>{const o=t.tempFilePath;e.index.previewImage({current:o,urls:[o],success:()=>{e.index.showToast({title:"图片生成成功",icon:"success"})},fail:()=>{e.index.showToast({title:"预览失败",icon:"none"})}})},fail:t=>{console.error("生成图片失败:",t),e.index.showToast({title:"生成图片失败",icon:"none"})}})};return(t,o)=>({a:e.o((e=>u.value=!1)),b:e.o(h),c:e.p({show:u.value,columns:d,keyName:"label",closeOnClickOverlay:!0}),d:n.value.width+"px",e:n.value.height+"px",f:e.o((e=>u.value=!0)),g:e.o(c),h:e.o((e=>l.value.longitude=e)),i:e.p({placeholder:"请输入",border:"none",modelValue:l.value.longitude}),j:e.sr("text","e3cbc6f0-3,e3cbc6f0-2"),k:e.p({label:"经度",prop:"longitude",borderBottom:!0}),l:e.o(c),m:e.o((e=>l.value.latitude=e)),n:e.p({placeholder:"请输入",border:"none",modelValue:l.value.latitude}),o:e.sr("text","e3cbc6f0-5,e3cbc6f0-2"),p:e.p({label:"纬度",prop:"latitude",borderBottom:!0}),q:e.o(c),r:e.o((e=>l.value.address=e)),s:e.p({placeholder:"请输入",border:"none",modelValue:l.value.address}),t:e.sr("text","e3cbc6f0-7,e3cbc6f0-2"),v:e.p({label:"地址",prop:"address",borderBottom:!0}),w:e.o(c),x:e.o((e=>l.value.notes=e)),y:e.p({placeholder:"请输入",border:"none",modelValue:l.value.notes}),z:e.sr("text","e3cbc6f0-9,e3cbc6f0-2"),A:e.p({label:"备注",prop:"notes",borderBottom:!0}),B:e.sr("form1","e3cbc6f0-2,e3cbc6f0-1"),C:e.p({labelWidth:"100px",labelPosition:"left",labelAlign:"left",model:l.value}),D:e.o(p),E:e.p({title:"添加水印",rButton:"生成图片"})})}},s=e._export_sfc(o,[["__scopeId","data-v-e3cbc6f0"]]);wx.createPage(s);
