"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const o=require("./common/vendor.js");Math;const n={onLaunch:function(){console.log("App Launch"),console.log(o.index.$u.config.v)},onShow:function(){console.log("App Show")},onHide:function(){console.log("App Hide")}};function e(){const e=o.createSSRApp(n);return e.use(o.createPinia()),e.use(o.uviewPlus),{app:e,Pinia:o.Pinia}}e().app.mount("#app"),exports.createApp=e;
