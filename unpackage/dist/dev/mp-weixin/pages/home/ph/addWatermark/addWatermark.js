"use strict";
const common_vendor = require("../../../../common/vendor.js");
if (!Array) {
  const _easycom_u_picker2 = common_vendor.resolveComponent("u-picker");
  const _easycom_u_input2 = common_vendor.resolveComponent("u-input");
  const _easycom_u_form_item2 = common_vendor.resolveComponent("u-form-item");
  const _easycom_u_image2 = common_vendor.resolveComponent("u-image");
  const _easycom_u_slider2 = common_vendor.resolveComponent("u-slider");
  const _easycom_u_form2 = common_vendor.resolveComponent("u-form");
  (_easycom_u_picker2 + _easycom_u_input2 + _easycom_u_form_item2 + _easycom_u_image2 + _easycom_u_slider2 + _easycom_u_form2)();
}
const _easycom_u_picker = () => "../../../../uni_modules/uview-plus/components/u-picker/u-picker.js";
const _easycom_u_input = () => "../../../../uni_modules/uview-plus/components/u-input/u-input.js";
const _easycom_u_form_item = () => "../../../../uni_modules/uview-plus/components/u-form-item/u-form-item.js";
const _easycom_u_image = () => "../../../../uni_modules/uview-plus/components/u-image/u-image.js";
const _easycom_u_slider = () => "../../../../uni_modules/uview-plus/components/u-slider/u-slider.js";
const _easycom_u_form = () => "../../../../uni_modules/uview-plus/components/u-form/u-form.js";
if (!Math) {
  (_easycom_u_picker + _easycom_u_input + _easycom_u_form_item + _easycom_u_image + _easycom_u_slider + _easycom_u_form + page)();
}
const page = () => "../../../../components/pages/page.js";
const _sfc_main = {
  __name: "addWatermark",
  setup(__props) {
    const instance = common_vendor.getCurrentInstance();
    const imageurl = common_vendor.ref({
      url: "",
      status: "success",
      message: 0
    });
    const formData = common_vendor.ref({
      test: "",
      image: "",
      opacity: "",
      angle: -45,
      // 角度
      density: ""
      // 密度
    });
    const previewMain = common_vendor.ref({
      width: "",
      height: ""
    });
    const clearCanvas = () => {
      const ctx = common_vendor.index.createCanvasContext("watermark");
      ctx.clearRect(0, 0, previewMain.value.width, previewMain.value.height);
      ctx.draw();
    };
    common_vendor.onLoad(() => {
      editeImage.value = true;
      common_vendor.nextTick$1(() => {
        editeImage.value = false;
      });
    });
    common_vendor.onMounted(() => {
      const query = common_vendor.index.createSelectorQuery().in(instance.proxy);
      query.select("#contentMain").boundingClientRect((data) => {
        if (data) {
          common_vendor.index.__f__("log", "at pages/home/ph/addWatermark/addWatermark.vue:64", "元素的宽：" + data.width);
          common_vendor.index.__f__("log", "at pages/home/ph/addWatermark/addWatermark.vue:65", "元素的高：" + data.height);
          previewMain.value = {
            width: data.width,
            height: data.height
          };
        }
      }).exec();
    });
    const previewImage = (urls) => {
      common_vendor.index.previewImage({
        urls: [urls],
        current: 1,
        longPressActions: {
          itemList: ["发送给朋友", "保存图片", "收藏"],
          success: function(data) {
          },
          fail: function(err) {
            common_vendor.index.__f__("log", "at pages/home/ph/addWatermark/addWatermark.vue:83", err.errMsg);
            common_vendor.index.showToast({
              title: "预览失败",
              icon: "none"
            });
          }
        }
      });
    };
    const getImageInfo = (src) => {
      return new Promise((resolve, reject) => {
        common_vendor.index.getImageInfo({
          src,
          success: resolve,
          fail: reject
        });
      });
    };
    const chooseImage = () => {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"],
        sourceType: ["album"],
        success: async function(res) {
          clearCanvas();
          const width = previewMain.value.width;
          const height = previewMain.value.height;
          const imageInfo = await getImageInfo(res.tempFilePaths[0]);
          let imageW = imageInfo.width;
          let imageH = imageInfo.height;
          let scale = 1;
          if (imageW > imageH) {
            scale = imageW / width;
          } else {
            scale = imageH / height;
          }
          imageW /= scale;
          imageH /= scale;
          let drawX = (width - imageW) / 2;
          let drawY = (height - imageH) / 2;
          const ctx = common_vendor.index.createCanvasContext("watermark");
          ctx.imageSmoothingEnabled = false;
          await ctx.drawImage(imageInfo.path, drawX, drawY, imageW, imageH);
          await ctx.draw(true);
          imageurl.value = {
            url: imageInfo.path,
            width: imageW,
            height: imageH,
            x: drawX,
            y: drawY,
            status: "success",
            message: 0
          };
          editeImage.value = false;
        },
        fail: function(err) {
          common_vendor.index.__f__("log", "at pages/home/ph/addWatermark/addWatermark.vue:158", err.errMsg);
          common_vendor.index.showToast({
            title: "选择图片失败",
            icon: "none"
          });
        }
      });
    };
    const addWatermark = async () => {
      const imageWidth = imageurl.value.width || 100;
      const imageHeight = imageurl.value.height || 100;
      const imageX = imageurl.value.x || 0;
      const imageY = imageurl.value.y || 0;
      const ctx = common_vendor.index.createCanvasContext("watermark");
      clearCanvas();
      await ctx.drawImage(imageurl.value.url, imageX, imageY, imageWidth, imageHeight);
      common_vendor.index.__f__("log", "at pages/home/ph/addWatermark/addWatermark.vue:175", "imageInfo", imageurl.value.url, imageX, imageY, imageWidth, imageHeight);
      if (formData.value.text) {
        let fontSize = formData.value.fontSize || 20;
        const angle = formData.value.angle * Math.PI / 180;
        ctx.textAlign = "center";
        ctx.font = `${fontSize}px Arial`;
        ctx.fillStyle = `rgba(50, 50, 50, ${formData.value.opacity || 0.3})`;
        for (let i = 0; i < 15; i++) {
          ctx.save();
          const x = i % 5 * (imageWidth / 2);
          const y = Math.floor(i / 5) * (imageHeight / 2);
          ctx.translate(x + imageWidth / 2, y + imageHeight / 2);
          ctx.rotate(angle);
          ctx.fillText(formData.value.text, 0, 0);
          ctx.restore();
        }
        ctx.restore();
      } else {
        ctx.drawImage(formData.value.image.url, 0, 0, 10, formData.value.image.height * formData.value.image.width / 10);
      }
      ctx.draw(true, () => {
      });
    };
    const editeImage = common_vendor.ref(false);
    const iamgeColumns = common_vendor.reactive([
      [
        {
          label: "添加图片/编辑图片",
          value: 1
        },
        {
          label: "预览图片",
          value: 2
        }
      ]
    ]);
    const editImagePicker = (item) => {
      if (item.value[0].value == 1) {
        chooseImage();
      } else {
        previewImage(imageurl.value.url);
      }
    };
    const generateImages = () => {
      common_vendor.index.canvasToTempFilePath({
        canvasId: "watermark",
        success: (res) => {
          const tempFilePath = res.tempFilePath;
          common_vendor.index.previewImage({
            current: tempFilePath,
            // 当前显示的图片链接
            urls: [tempFilePath],
            // 需要预览的图片链接列表
            success: () => {
            },
            fail: () => {
            }
          });
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/home/ph/addWatermark/addWatermark.vue:278", "合并图片失败:", err);
          common_vendor.index.showToast({
            title: "合并图片失败",
            icon: "none"
          });
        }
      });
    };
    const selsectImageFn = () => {
      if (formData.value.image) {
        common_vendor.index.previewImage({
          urls: [formData.value.image],
          current: 0,
          longPressActions: {
            itemList: ["发送给朋友", "保存图片", "收藏"],
            success: function(data) {
            },
            fail: function(err) {
              common_vendor.index.__f__("log", "at pages/home/ph/addWatermark/addWatermark.vue:297", err.errMsg);
            }
          }
        });
      } else {
        common_vendor.index.chooseImage({
          count: 1,
          //默认9
          sizeType: ["original"],
          //可以指定是原图还是压缩图，默认二者都有
          sourceType: ["album"],
          //从相册选择
          success: async function(res) {
            const hw = await getImageInfo(res.tempFilePaths[0]);
            formData.value.image = {
              url: res.tempFilePaths[0],
              width: hw.width,
              height: hw.height,
              status: "success"
            };
            addWatermark();
          }
        });
      }
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => editeImage.value = false),
        b: common_vendor.o(editImagePicker),
        c: common_vendor.p({
          show: editeImage.value,
          columns: iamgeColumns,
          keyName: "label",
          closeOnClickOverlay: true
        }),
        d: previewMain.value.width + "px",
        e: previewMain.value.height + "px",
        f: common_vendor.o(($event) => editeImage.value = true),
        g: previewMain.value.width + "px",
        h: previewMain.value.height + "px",
        i: common_vendor.o(addWatermark),
        j: common_vendor.o(($event) => formData.value.text = $event),
        k: common_vendor.p({
          border: "none",
          modelValue: formData.value.text
        }),
        l: common_vendor.sr("text", "5bd6fc7f-3,5bd6fc7f-2"),
        m: common_vendor.p({
          label: "水印文字",
          prop: "text",
          borderBottom: true
        }),
        n: common_vendor.o(($event) => selsectImageFn(_ctx.item)),
        o: common_vendor.p({
          width: "40",
          height: "40",
          src: formData.value.image
        }),
        p: common_vendor.sr("text", "5bd6fc7f-5,5bd6fc7f-2"),
        q: common_vendor.p({
          label: "水印图片",
          prop: "image",
          borderBottom: true
        }),
        r: common_vendor.o((e) => formData.value.opacity = e),
        s: common_vendor.o(($event) => formData.value.opacity = $event),
        t: common_vendor.p({
          min: "1",
          max: "100",
          modelValue: formData.value.opacity
        }),
        v: common_vendor.t(`${formData.value.opacity} %`),
        w: common_vendor.sr("text", "5bd6fc7f-7,5bd6fc7f-2"),
        x: common_vendor.p({
          label: "水印透明度",
          prop: "opacity",
          borderBottom: true
        }),
        y: common_vendor.o((e) => formData.value.angle = e),
        z: common_vendor.o(($event) => formData.value.angle = $event),
        A: common_vendor.p({
          min: "1",
          max: "100",
          modelValue: formData.value.angle
        }),
        B: common_vendor.t(`${formData.value.angle} C`),
        C: common_vendor.sr("text", "5bd6fc7f-9,5bd6fc7f-2"),
        D: common_vendor.p({
          label: "水印旋转",
          prop: "angle",
          borderBottom: true
        }),
        E: common_vendor.o((e) => formData.value.density = e),
        F: common_vendor.o(($event) => formData.value.density = $event),
        G: common_vendor.p({
          min: "1",
          max: "100",
          modelValue: formData.value.density
        }),
        H: common_vendor.t(`${formData.value.density} %`),
        I: common_vendor.sr("text", "5bd6fc7f-11,5bd6fc7f-2"),
        J: common_vendor.p({
          label: "水印密度",
          prop: "density",
          borderBottom: true
        }),
        K: common_vendor.sr("form1", "5bd6fc7f-2,5bd6fc7f-1"),
        L: common_vendor.p({
          labelWidth: "100px",
          labelPosition: "left",
          labelAlign: "left",
          model: formData.value
        }),
        M: common_vendor.o(generateImages),
        N: common_vendor.p({
          title: "添加水印",
          rButton: "生成图片"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-5bd6fc7f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/pages/home/ph/addWatermark/addWatermark.js.map
