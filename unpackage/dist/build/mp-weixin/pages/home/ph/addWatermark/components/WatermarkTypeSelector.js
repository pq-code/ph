"use strict";const e=require("../../../../../common/vendor.js"),a=require("./watermarkConfig.js");if(!Array){e.resolveComponent("up-image")()}const o={__name:"WatermarkTypeSelector",props:{modelValue:{type:Number,default:1}},emits:["update:modelValue","handleTypeChange"],setup(o,{emit:r}){const t=r;return(r,d)=>({a:e.f(e.unref(a.WATERMARK_TYPES),((a,r,d)=>({a:"dda16d67-0-"+d,b:e.p({"show-loading":!0,src:a.preview,mode:"aspectFit"}),c:e.t(a.name),d:a.id,e:o.modelValue===a.id?1:"",f:e.o((e=>(e=>{t("handleTypeChange",e)})(a)),a.id)})))})}},r=e._export_sfc(o,[["__scopeId","data-v-dda16d67"]]);wx.createComponent(r);
