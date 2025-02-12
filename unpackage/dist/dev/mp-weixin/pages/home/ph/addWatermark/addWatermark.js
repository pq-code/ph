"use strict";
const common_vendor = require("../../../../common/vendor.js");
if (!Array) {
  const _easycom_u_picker2 = common_vendor.resolveComponent("u-picker");
  const _easycom_u_input2 = common_vendor.resolveComponent("u-input");
  const _easycom_u_form_item2 = common_vendor.resolveComponent("u-form-item");
  const _easycom_u_form2 = common_vendor.resolveComponent("u-form");
  (_easycom_u_picker2 + _easycom_u_input2 + _easycom_u_form_item2 + _easycom_u_form2)();
}
const _easycom_u_picker = () => "../../../../uni_modules/uview-plus/components/u-picker/u-picker.js";
const _easycom_u_input = () => "../../../../uni_modules/uview-plus/components/u-input/u-input.js";
const _easycom_u_form_item = () => "../../../../uni_modules/uview-plus/components/u-form-item/u-form-item.js";
const _easycom_u_form = () => "../../../../uni_modules/uview-plus/components/u-form/u-form.js";
if (!Math) {
  (_easycom_u_picker + _easycom_u_input + _easycom_u_form_item + _easycom_u_form + page)();
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
    const originalImage = common_vendor.ref({
      url: "",
      status: "success",
      message: 0
    });
    const formData = common_vendor.ref({
      longitude: "",
      //经度
      latitude: "",
      // 纬度
      address: "",
      // 地址
      notes: "",
      // 备注
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
          common_vendor.index.__f__("log", "at pages/home/ph/addWatermark/addWatermark.vue:76", "元素的宽：" + data.width);
          common_vendor.index.__f__("log", "at pages/home/ph/addWatermark/addWatermark.vue:77", "元素的高：" + data.height);
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
            common_vendor.index.__f__("log", "at pages/home/ph/addWatermark/addWatermark.vue:95", err.errMsg);
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
      return new Promise((resolve, reject) => {
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
            originalImage.value.url = {
              url: imageInfo.path,
              width: imageW,
              height: imageH,
              status: "success",
              message: 0
            };
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
            resolve();
          },
          fail: function(err) {
            common_vendor.index.__f__("log", "at pages/home/ph/addWatermark/addWatermark.vue:181", err.errMsg);
            common_vendor.index.showToast({
              title: "选择图片失败",
              icon: "none"
            });
            reject();
          }
        });
      });
    };
    const addWatermark = async () => {
      const { width: imageWidth, height: imageHeight, x: imageX, y: imageY, url } = imageurl.value;
      const ctx = common_vendor.index.createCanvasContext("watermark");
      clearCanvas();
      await ctx.drawImage(url, imageX, imageY, imageWidth, imageHeight);
      ctx.save();
      const centerText = "现场拍照";
      const centerFontSize = Math.min(imageWidth, imageHeight) * 0.15;
      ctx.setFontSize(centerFontSize);
      ctx.setTextAlign("center");
      ctx.setTextBaseline("middle");
      const centerX = imageX + imageWidth / 2;
      const centerY = imageY + imageHeight / 2;
      ctx.translate(centerX, centerY);
      ctx.setGlobalAlpha(0.2);
      ctx.setLineWidth(3);
      ctx.setStrokeStyle("#FFFFFF");
      ctx.strokeText(centerText, 0, 0);
      ctx.setGlobalAlpha(0.2);
      ctx.setFillStyle("#666666");
      ctx.font = `bold ${centerFontSize}px sans-serif`;
      ctx.fillText(centerText, 0, 0);
      ctx.restore();
      const fontSize = 14;
      ctx.setFontSize(fontSize);
      ctx.setTextAlign("left");
      ctx.setTextBaseline("top");
      ctx.setGlobalAlpha(0.5);
      ctx.setFillStyle("#666666");
      const timestamp = common_vendor.dayjs().format("YYYY-MM-DD HH:mm:ss");
      const watermarkLines = [
        `经度：${formData.value.longitude}`,
        `纬度：${formData.value.latitude}`,
        `坐标：WGS84坐标系`,
        `地址：${formData.value.address}`,
        `时间：${timestamp}`,
        `备注：${formData.value.notes}`
      ];
      const padding = 20;
      const lineHeight = fontSize + 4;
      let currentY = imageHeight - watermarkLines.length * lineHeight - padding + imageY;
      watermarkLines.forEach((line, index) => {
        ctx.setGlobalAlpha(1);
        ctx.setFillStyle("#FFFFFF");
        ctx.fillText(line, padding + imageX, currentY);
        currentY += lineHeight;
      });
      ctx.restore();
      ctx.draw(true);
    };
    const editeImage = common_vendor.ref(false);
    const iamgeColumns = common_vendor.reactive([
      [
        {
          label: "添加图片/编辑图片",
          value: 1
        },
        {
          label: "拍照",
          value: 2
        },
        {
          label: "预览图片",
          value: 3
        }
      ]
    ]);
    const editImagePicker = async (item) => {
      if (item.value[0].value == 1) {
        await chooseImage();
        addWatermark();
      } else if (item.value[0].value == 2) {
        common_vendor.index.getSetting({
          success: (res) => {
            if (res.authSetting["scope.camera"]) {
              takePictures();
            } else {
              common_vendor.index.authorize({
                scope: "scope.camera",
                success() {
                  takePictures();
                },
                fail() {
                  _this.openSetting("camera").then((res2) => {
                    takePictures();
                  });
                }
              });
            }
          },
          fail: (res) => {
            common_vendor.index.__f__("log", "at pages/home/ph/addWatermark/addWatermark.vue:314", "获取用户授权信息失败");
          }
        });
      } else {
        previewImage(imageurl.value.url);
      }
    };
    const takePictures = () => {
      common_vendor.index.chooseImage({
        count: 1,
        // 只能拍一张
        sourceType: ["camera"],
        // 只允许拍照
        success: (res) => {
          this.imagePath = res.tempFilePaths[0];
          common_vendor.index.__f__("log", "at pages/home/ph/addWatermark/addWatermark.vue:328", "拍照成功，图片路径：", this.imagePath);
          this.uploadImage(this.imagePath);
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/home/ph/addWatermark/addWatermark.vue:334", "拍照失败：", err);
          common_vendor.index.showToast({
            title: "拍照失败，请重试",
            icon: "none"
          });
        }
      });
    };
    const generateImages = () => {
      const { width: imageWidth, height: imageHeight, x: imageX, y: imageY } = imageurl.value;
      common_vendor.index.canvasToTempFilePath({
        canvasId: "watermark",
        x: imageX,
        // 裁剪起点x坐标
        y: imageY,
        // 裁剪起点y坐标
        width: imageWidth,
        // 裁剪宽度
        height: imageHeight,
        // 裁剪高度
        destWidth: imageWidth,
        // 输出图片宽度
        destHeight: imageHeight,
        // 输出图片高度
        success: (res) => {
          const tempFilePath = res.tempFilePath;
          common_vendor.index.previewImage({
            current: tempFilePath,
            urls: [tempFilePath],
            success: () => {
              common_vendor.index.showToast({
                title: "图片生成成功",
                icon: "success"
              });
            },
            fail: () => {
              common_vendor.index.showToast({
                title: "预览失败",
                icon: "none"
              });
            }
          });
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/home/ph/addWatermark/addWatermark.vue:379", "生成图片失败:", err);
          common_vendor.index.showToast({
            title: "生成图片失败",
            icon: "none"
          });
        }
      });
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
        g: common_vendor.o(addWatermark),
        h: common_vendor.o(($event) => formData.value.longitude = $event),
        i: common_vendor.p({
          placeholder: "请输入",
          border: "none",
          modelValue: formData.value.longitude
        }),
        j: common_vendor.sr("text", "5bd6fc7f-3,5bd6fc7f-2"),
        k: common_vendor.p({
          label: "经度",
          prop: "longitude",
          borderBottom: true
        }),
        l: common_vendor.o(addWatermark),
        m: common_vendor.o(($event) => formData.value.latitude = $event),
        n: common_vendor.p({
          placeholder: "请输入",
          border: "none",
          modelValue: formData.value.latitude
        }),
        o: common_vendor.sr("text", "5bd6fc7f-5,5bd6fc7f-2"),
        p: common_vendor.p({
          label: "纬度",
          prop: "latitude",
          borderBottom: true
        }),
        q: common_vendor.o(addWatermark),
        r: common_vendor.o(($event) => formData.value.address = $event),
        s: common_vendor.p({
          placeholder: "请输入",
          border: "none",
          modelValue: formData.value.address
        }),
        t: common_vendor.sr("text", "5bd6fc7f-7,5bd6fc7f-2"),
        v: common_vendor.p({
          label: "地址",
          prop: "address",
          borderBottom: true
        }),
        w: common_vendor.o(addWatermark),
        x: common_vendor.o(($event) => formData.value.notes = $event),
        y: common_vendor.p({
          placeholder: "请输入",
          border: "none",
          modelValue: formData.value.notes
        }),
        z: common_vendor.sr("text", "5bd6fc7f-9,5bd6fc7f-2"),
        A: common_vendor.p({
          label: "备注",
          prop: "notes",
          borderBottom: true
        }),
        B: common_vendor.sr("form1", "5bd6fc7f-2,5bd6fc7f-1"),
        C: common_vendor.p({
          labelWidth: "100px",
          labelPosition: "left",
          labelAlign: "left",
          model: formData.value
        }),
        D: common_vendor.o(generateImages),
        E: common_vendor.p({
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
