"use strict";const i=require("../../../../common/vendor.js"),r=require("./props.js"),o=require("../../libs/mixin/mpMixin.js"),e=require("../../libs/mixin/mixin.js"),t={name:"u-image",mixins:[o.mpMixin,e.mixin,r.props],data(){return{isError:!1,loading:!0,opacity:1,durationTime:this.duration,backgroundStyle:{},show:!1}},watch:{src:{immediate:!0,handler(i){i?(this.isError=!1,this.loading=!0):this.isError=!0}}},computed:{wrapStyle(){let r={};return r.width=this.$u.addUnit(this.width),r.height=this.$u.addUnit(this.height),r.borderRadius="circle"==this.shape?"10000px":i.index.$u.addUnit(this.radius),r.overflow=this.radius>0?"hidden":"visible",i.index.$u.deepMerge(r,i.index.$u.addStyle(this.customStyle))}},mounted(){this.show=!0},emits:["click","error","load"],methods:{onClick(){this.$emit("click")},onErrorHandler(i){this.loading=!1,this.isError=!0,this.$emit("error",i)},onLoadHandler(i){this.loading=!1,this.isError=!1,this.$emit("load",i),this.removeBgColor()},removeBgColor(){this.backgroundStyle={backgroundColor:"transparent"}}}};if(!Array){(i.resolveComponent("u-icon")+i.resolveComponent("u-transition"))()}Math||((()=>"../u-icon/u-icon.js")+(()=>"../u-transition/u-transition.js"))();const d=i._export_sfc(t,[["render",function(r,o,e,t,d,n){return i.e({a:!d.isError},d.isError?{}:{b:r.src,c:r.mode,d:i.o(((...i)=>n.onErrorHandler&&n.onErrorHandler(...i))),e:i.o(((...i)=>n.onLoadHandler&&n.onLoadHandler(...i))),f:r.showMenuByLongpress,g:r.lazyLoad,h:"circle"==r.shape?"10000px":r.$u.addUnit(r.radius),i:r.$u.addUnit(r.width),j:r.$u.addUnit(r.height)},{k:r.showLoading&&d.loading},r.showLoading&&d.loading?{l:i.p({name:r.loadingIcon,width:r.width,height:r.height}),m:"circle"==r.shape?"50%":r.$u.addUnit(r.radius),n:this.bgColor,o:r.$u.addUnit(r.width),p:r.$u.addUnit(r.height)}:{},{q:r.showError&&d.isError&&!d.loading},r.showError&&d.isError&&!d.loading?{r:i.p({name:r.errorIcon,width:r.width,height:r.height}),s:"circle"==r.shape?"50%":r.$u.addUnit(r.radius),t:r.$u.addUnit(r.width),v:r.$u.addUnit(r.height)}:{},{w:i.o(((...i)=>n.onClick&&n.onClick(...i))),x:i.s(n.wrapStyle),y:i.s(d.backgroundStyle),z:i.p({mode:"fade",show:d.show,duration:r.fade?1e3:0})})}],["__scopeId","data-v-f54b76b2"]]);wx.createComponent(d);
