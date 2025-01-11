"use strict";
const common_vendor = require("../../../../common/vendor.js");
const block0 = (Component2) => {
  if (!Component2.wxsCallMethods) {
    Component2.wxsCallMethods = [];
  }
  Component2.wxsCallMethods.push("dataChange");
};
const AREA_SIZE = 75;
const IMG_SIZE = 300;
const _sfc_main = {
  name: "qf-image-cropper",
  options: {
    // 表示启用样式隔离，在自定义组件内外，使用 class 指定的样式将不会相互影响
    styleIsolation: "isolated"
  },
  props: {
    /** 图片资源地址 */
    src: {
      type: String,
      default: ""
    },
    /** 裁剪宽度，有些平台或设备对于canvas的尺寸有限制，过大可能会导致无法正常绘制 */
    width: {
      type: Number,
      default: IMG_SIZE
    },
    /** 裁剪高度，有些平台或设备对于canvas的尺寸有限制，过大可能会导致无法正常绘制 */
    height: {
      type: Number,
      default: IMG_SIZE
    },
    /** 是否绘制裁剪区域边框 */
    showBorder: {
      type: Boolean,
      default: true
    },
    /** 是否绘制裁剪区域网格参考线 */
    showGrid: {
      type: Boolean,
      default: true
    },
    /** 是否展示四个支持伸缩的角 */
    showAngle: {
      type: Boolean,
      default: true
    },
    /** 裁剪区域最小缩放倍数 */
    areaScale: {
      type: Number,
      default: 0.3
    },
    /** 图片最小缩放倍数 */
    minScale: {
      type: Number,
      default: 1
    },
    /** 图片最大缩放倍数 */
    maxScale: {
      type: Number,
      default: 5
    },
    /** 检查图片位置是否超出裁剪边界，如果超出则会矫正位置 */
    checkRange: {
      type: Boolean,
      default: true
    },
    /** 生成图片背景色：如果裁剪区域没有完全包含在图片中时，不设置该属性生成图片存在一定的透明块 */
    backgroundColor: {
      type: String
    },
    /** 是否有回弹效果：当 checkRange 为 true 时有效，拖动时可以拖出边界，释放时会弹回边界 */
    bounce: {
      type: Boolean,
      default: true
    },
    /** 是否支持翻转 */
    rotatable: {
      type: Boolean,
      default: true
    },
    /** 是否支持逆向翻转 */
    reverseRotatable: {
      type: Boolean,
      default: false
    },
    /** 是否支持从本地选择素材 */
    choosable: {
      type: Boolean,
      default: true
    },
    /** 是否开启硬件加速，图片缩放过程中如果出现元素的“留影”或“重影”效果，可通过该方式解决或减轻这一问题 */
    gpu: {
      type: Boolean,
      default: false
    },
    /** 四个角尺寸，单位px */
    angleSize: {
      type: Number,
      default: 20
    },
    /** 四个角边框宽度，单位px */
    angleBorderWidth: {
      type: Number,
      default: 2
    },
    zIndex: {
      type: [Number, String]
    },
    /** 裁剪图片圆角半径，单位px */
    radius: {
      type: Number,
      default: 0
    },
    /** 生成文件的类型，只支持 'jpg' 或 'png'。默认为 'png' */
    fileType: {
      type: String,
      default: "png"
    },
    /**
     * 图片从绘制到生成所需时间，单位ms
     * 微信小程序平台使用 `Canvas 2D` 绘制时有效
     * 如绘制大图或出现裁剪图片空白等情况应适当调大该值，因 `Canvas 2d` 采用同步绘制，需自己把控绘制完成时间
     */
    delay: {
      type: Number,
      default: 1e3
    }
  },
  emits: ["crop"],
  data() {
    return {
      // 用不同 id 使 v-for key 不重复
      maskList: [
        { id: "crop-mask-block-1" },
        { id: "crop-mask-block-2" },
        { id: "crop-mask-block-3" },
        { id: "crop-mask-block-4" }
      ],
      gridList: [
        { id: "crop-grid-1" },
        { id: "crop-grid-2" },
        { id: "crop-grid-3" },
        { id: "crop-grid-4" }
      ],
      angleList: [
        { id: "crop-angle-1" },
        { id: "crop-angle-2" },
        { id: "crop-angle-3" },
        { id: "crop-angle-4" }
      ],
      /** 本地缓存的图片路径 */
      imgSrc: "",
      /** 图片的裁剪宽度 */
      imgWidth: IMG_SIZE,
      /** 图片的裁剪高度 */
      imgHeight: IMG_SIZE,
      /** 裁剪区域最大宽度所占屏幕宽度百分比 */
      widthPercent: AREA_SIZE,
      /** 裁剪区域最大高度所占屏幕宽度百分比 */
      heightPercent: AREA_SIZE,
      /** 裁剪区域布局信息 */
      area: {},
      /** 未被缩放过的图片宽 */
      oldWidth: 0,
      /** 未被缩放过的图片高 */
      oldHeight: 0,
      /** 系统信息 */
      sys: common_vendor.index.getSystemInfoSync(),
      scaleWidth: 0,
      scaleHeight: 0,
      rotate: 0,
      offsetX: 0,
      offsetY: 0,
      use2d: false,
      canvansWidth: 0,
      canvansHeight: 0
      // imageStyles: {},
      // maskStylesList: [{}, {}, {}, {}],
      // borderStyles: {},
      // gridStylesList: [{}, {}, {}, {}],
      // angleStylesList: [{}, {}, {}, {}],
      // circleBoxStyles: {},
      // circleStyles: {},
    };
  },
  computed: {
    initData() {
      return {
        timestamp: (/* @__PURE__ */ new Date()).getTime(),
        area: {
          ...this.area,
          bounce: this.bounce,
          showBorder: this.showBorder,
          showGrid: this.showGrid,
          showAngle: this.showAngle,
          angleSize: this.angleSize,
          angleBorderWidth: this.angleBorderWidth,
          minScale: this.areaScale,
          widthPercent: this.widthPercent,
          heightPercent: this.heightPercent,
          radius: this.radius,
          checkRange: this.checkRange,
          zIndex: +this.zIndex || 0
        },
        sys: this.sys,
        img: {
          minScale: this.minScale,
          maxScale: this.maxScale,
          src: this.imgSrc,
          width: this.oldWidth,
          height: this.oldHeight,
          oldWidth: this.oldWidth,
          oldHeight: this.oldHeight,
          gpu: this.gpu
        }
      };
    },
    imgProps() {
      return {
        width: this.width,
        height: this.height,
        src: this.src
      };
    }
  },
  watch: {
    imgProps: {
      handler(val, oldVal) {
        this.imgWidth = Number(val.width) || IMG_SIZE;
        this.imgHeight = Number(val.height) || IMG_SIZE;
        let use2d = true;
        let canvansWidth = this.imgWidth;
        let canvansHeight = this.imgHeight;
        let size = Math.max(canvansWidth, canvansHeight);
        let scalc = 1;
        if (size > 1365) {
          scalc = 1365 / size;
        }
        this.canvansWidth = canvansWidth * scalc;
        this.canvansHeight = canvansHeight * scalc;
        this.use2d = use2d;
        this.initArea();
        const src = val.src || this.imgSrc;
        src && this.initImage(src, oldVal === void 0);
      },
      immediate: true
    }
  },
  methods: {
    /** 提供给wxs调用，用来接收图片变更数据 */
    dataChange(e) {
      this.scaleWidth = e.width;
      this.scaleHeight = e.height;
      this.rotate = e.rotate;
      this.offsetX = e.x;
      this.offsetY = e.y;
    },
    /** 初始化裁剪区域布局信息 */
    initArea() {
      this.sys.offsetBottom = common_vendor.index.upx2px(100) + this.sys.safeAreaInsets.bottom;
      this.sys.windowTop = 0;
      this.sys.navigation = true;
      let wp = this.widthPercent;
      let hp = this.heightPercent;
      if (this.imgWidth > this.imgHeight) {
        hp = hp * this.imgHeight / this.imgWidth;
      } else if (this.imgWidth < this.imgHeight) {
        wp = wp * this.imgWidth / this.imgHeight;
      }
      const size = this.sys.windowWidth > this.sys.windowHeight ? this.sys.windowHeight : this.sys.windowWidth;
      const width = size * wp / 100;
      const height = size * hp / 100;
      const left = (this.sys.windowWidth - width) / 2;
      const right = left + width;
      const top = (this.sys.windowHeight + this.sys.windowTop - this.sys.offsetBottom - height) / 2;
      const bottom = this.sys.windowHeight + this.sys.windowTop - this.sys.offsetBottom - top;
      this.area = { width, height, left, right, top, bottom };
      this.scaleWidth = width;
      this.scaleHeight = height;
    },
    /** 从本地选取图片 */
    chooseImage(options) {
      if (common_vendor.index.chooseMedia) {
        common_vendor.index.chooseMedia({
          ...options,
          count: 1,
          mediaType: ["image"],
          success: (res) => {
            this.resetData();
            this.initImage(res.tempFiles[0].tempFilePath);
          }
        });
        return;
      }
      common_vendor.index.chooseImage({
        ...options,
        count: 1,
        success: (res) => {
          this.resetData();
          this.initImage(res.tempFiles[0].path);
        }
      });
    },
    /** 重置数据 */
    resetData() {
      this.imgSrc = "";
      this.rotate = 0;
      this.offsetX = 0;
      this.offsetY = 0;
      this.initArea();
    },
    /**
     * 初始化图片信息
     * @param {String} url 图片链接
     */
    initImage(url, isFirst) {
      common_vendor.index.getImageInfo({
        src: url,
        success: async (res) => {
          if (isFirst && this.src === url)
            await new Promise((resolve) => setTimeout(resolve, 50));
          this.imgSrc = res.path;
          let scale = res.width / res.height;
          let areaScale = this.area.width / this.area.height;
          if (scale > 1) {
            if (scale >= areaScale) {
              this.scaleWidth = this.scaleHeight / res.height * this.scaleWidth * (res.width / this.scaleWidth);
            } else {
              this.scaleHeight = res.height * this.scaleWidth / res.width;
            }
          } else {
            if (scale <= areaScale) {
              this.scaleHeight = this.scaleWidth / res.width * this.scaleHeight / (this.scaleHeight / res.height);
            } else {
              this.scaleWidth = res.width * this.scaleHeight / res.height;
            }
          }
          this.oldWidth = +this.scaleWidth.toFixed(2);
          this.oldHeight = +this.scaleHeight.toFixed(2);
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at uni_modules/qf-image-cropper/components/qf-image-cropper/qf-image-cropper.vue:437", err);
        }
      });
    },
    /**
     * 剪切图片圆角
     * @param {Object} ctx canvas 的绘图上下文对象
     * @param {Number} radius 圆角半径
     * @param {Number} scale 生成图片的实际尺寸与截取区域比
     * @param {Function} drawImage 执行剪切时所调用的绘图方法，入参为是否执行了剪切
     */
    drawClipImage(ctx, radius, scale, drawImage) {
      if (radius > 0) {
        ctx.save();
        ctx.beginPath();
        const w = this.canvansWidth;
        const h = this.canvansHeight;
        if (w === h && radius >= w / 2) {
          ctx.arc(w / 2, h / 2, w / 2, 0, 2 * Math.PI);
        } else {
          if (w !== h) {
            radius = Math.min(w / 2, h / 2, radius);
          }
          ctx.moveTo(radius, 0);
          ctx.arcTo(w, 0, w, h, radius);
          ctx.arcTo(w, h, 0, h, radius);
          ctx.arcTo(0, h, 0, 0, radius);
          ctx.arcTo(0, 0, w, 0, radius);
          ctx.closePath();
        }
        ctx.clip();
        drawImage && drawImage(true);
        ctx.restore();
      } else {
        drawImage && drawImage(false);
      }
    },
    /**
     * 旋转图片
     * @param {Object} ctx canvas 的绘图上下文对象
     * @param {Number} rotate 旋转角度
     * @param {Number} scale 生成图片的实际尺寸与截取区域比
     */
    drawRotateImage(ctx, rotate, scale) {
      if (rotate !== 0) {
        const x = this.scaleWidth * scale / 2;
        const y = this.scaleHeight * scale / 2;
        ctx.translate(x, y);
        ctx.rotate(rotate * Math.PI / 180);
        ctx.translate(-x, -y);
      }
    },
    drawImage(ctx, image, callback) {
      const scale = this.canvansWidth / this.area.width;
      if (this.backgroundColor) {
        if (ctx.setFillStyle)
          ctx.setFillStyle(this.backgroundColor);
        else
          ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(0, 0, this.canvansWidth, this.canvansHeight);
      }
      this.drawClipImage(ctx, this.radius, scale, () => {
        this.drawRotateImage(ctx, this.rotate, scale);
        const r = this.rotate / 90;
        ctx.drawImage(
          image,
          [
            this.offsetX - this.area.left,
            this.offsetY - this.area.top,
            -(this.offsetX - this.area.left),
            -(this.offsetY - this.area.top)
          ][r] * scale,
          [
            this.offsetY - this.area.top,
            -(this.offsetX - this.area.left),
            -(this.offsetY - this.area.top),
            this.offsetX - this.area.left
          ][r] * scale,
          this.scaleWidth * scale,
          this.scaleHeight * scale
        );
      });
    },
    /**
     * 绘图
     * @param {Object} canvas 
     * @param {Object} ctx canvas 的绘图上下文对象
     * @param {String} src 图片路径
     * @param {Function} callback 开始绘制时回调
     */
    draw2DImage(canvas, ctx, src, callback) {
      if (canvas) {
        const image = canvas.createImage();
        image.onload = () => {
          this.drawImage(ctx, image);
          callback && setTimeout(callback, this.delay);
        };
        image.onerror = (err) => {
          common_vendor.index.__f__("error", "at uni_modules/qf-image-cropper/components/qf-image-cropper/qf-image-cropper.vue:540", err);
          common_vendor.index.hideLoading();
        };
        image.src = src;
      } else {
        this.drawImage(ctx, src);
        setTimeout(() => {
          ctx.draw(false, callback);
        }, 200);
      }
    },
    /**
     * 画布转图片到本地缓存
     * @param {Object} canvas 
     * @param {String} canvasId 
     */
    canvasToTempFilePath(canvas, canvasId) {
      common_vendor.index.canvasToTempFilePath({
        canvas,
        canvasId,
        x: 0,
        y: 0,
        width: this.canvansWidth,
        height: this.canvansHeight,
        destWidth: this.imgWidth,
        // 必要，保证生成图片宽度不受设备分辨率影响
        destHeight: this.imgHeight,
        // 必要，保证生成图片高度不受设备分辨率影响
        fileType: this.fileType,
        // 目标文件的类型，默认png
        success: (res) => {
          this.handleImage(res.tempFilePath);
        },
        fail: (err) => {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({ title: "裁剪失败，生成图片异常！", icon: "none" });
        }
      }, this);
    },
    /** 确认裁剪 */
    cropClick() {
      common_vendor.index.showLoading({ title: "裁剪中...", mask: true });
      if (!this.use2d) {
        const ctx = common_vendor.index.createCanvasContext("imgCanvas", this);
        ctx.clearRect(0, 0, this.canvansWidth, this.canvansHeight);
        this.draw2DImage(null, ctx, this.imgSrc, () => {
          this.canvasToTempFilePath(null, "imgCanvas");
        });
        return;
      }
      const query = common_vendor.index.createSelectorQuery().in(this);
      query.select("#imgCanvas").fields({ node: true, size: true }).exec((res) => {
        const canvas = res[0].node;
        const dpr = common_vendor.index.getSystemInfoSync().pixelRatio;
        canvas.width = res[0].width * dpr;
        canvas.height = res[0].height * dpr;
        const ctx = canvas.getContext("2d");
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, this.canvansWidth, this.canvansHeight);
        this.draw2DImage(canvas, ctx, this.imgSrc, () => {
          this.canvasToTempFilePath(canvas);
        });
      });
    },
    handleImage(tempFilePath) {
      common_vendor.index.hideLoading();
      this.$emit("crop", { tempFilePath });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.use2d
  }, $data.use2d ? {
    b: `${$data.canvansWidth}px`,
    c: `${$data.canvansHeight}px`
  } : {
    d: `${$data.canvansWidth}px`,
    e: `${$data.canvansHeight}px`
  }, {
    f: $data.imgSrc
  }, $data.imgSrc ? {
    g: $data.imgSrc
  } : {}, {
    h: common_vendor.f($data.maskList, (item, index, i0) => {
      return {
        a: item.id,
        b: item.id
      };
    }),
    i: $props.showBorder
  }, $props.showBorder ? {} : {}, {
    j: $props.radius > 0
  }, $props.radius > 0 ? {} : {}, {
    k: $props.showGrid
  }, $props.showGrid ? {
    l: common_vendor.f($data.gridList, (item, index, i0) => {
      return {
        a: item.id,
        b: item.id
      };
    })
  } : {}, {
    m: $props.showAngle
  }, $props.showAngle ? {
    n: common_vendor.f($data.angleList, (item, index, i0) => {
      return {
        a: item.id,
        b: item.id
      };
    }),
    o: common_vendor.s({
      width: `${$props.angleSize}px`,
      height: `${$props.angleSize}px`
    })
  } : {}, {
    p: $options.initData,
    q: ($props.rotatable || $props.reverseRotatable) && !!$data.imgSrc
  }, ($props.rotatable || $props.reverseRotatable) && !!$data.imgSrc ? common_vendor.e({
    r: $props.reverseRotatable
  }, $props.reverseRotatable ? {} : {}, {
    s: $props.rotatable
  }, $props.rotatable ? {} : {}) : {}, {
    t: !$props.choosable
  }, !$props.choosable ? {
    v: common_vendor.o((...args) => $options.cropClick && $options.cropClick(...args))
  } : !!$data.imgSrc ? {
    x: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args)),
    y: common_vendor.o((...args) => $options.cropClick && $options.cropClick(...args))
  } : {
    z: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args))
  }, {
    w: !!$data.imgSrc,
    A: $options.initData.area.zIndex + 99,
    B: $props.zIndex
  });
}
if (typeof block0 === "function")
  block0(_sfc_main);
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7129956f"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/qf-image-cropper/components/qf-image-cropper/qf-image-cropper.js.map
