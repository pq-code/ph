"use strict";
const common_vendor = require("../../../../common/vendor.js");
if (!Array) {
  const _easycom_u_picker2 = common_vendor.resolveComponent("u-picker");
  const _easycom_u_image2 = common_vendor.resolveComponent("u-image");
  const _easycom_u_input2 = common_vendor.resolveComponent("u-input");
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_form_item2 = common_vendor.resolveComponent("u-form-item");
  const _easycom_u_slider2 = common_vendor.resolveComponent("u-slider");
  const _easycom_u_form2 = common_vendor.resolveComponent("u-form");
  (_easycom_u_picker2 + _easycom_u_image2 + _easycom_u_input2 + _easycom_u_icon2 + _easycom_u_form_item2 + _easycom_u_slider2 + _easycom_u_form2)();
}
const _easycom_u_picker = () => "../../../../uni_modules/uview-plus/components/u-picker/u-picker.js";
const _easycom_u_image = () => "../../../../uni_modules/uview-plus/components/u-image/u-image.js";
const _easycom_u_input = () => "../../../../uni_modules/uview-plus/components/u-input/u-input.js";
const _easycom_u_icon = () => "../../../../uni_modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_form_item = () => "../../../../uni_modules/uview-plus/components/u-form-item/u-form-item.js";
const _easycom_u_slider = () => "../../../../uni_modules/uview-plus/components/u-slider/u-slider.js";
const _easycom_u_form = () => "../../../../uni_modules/uview-plus/components/u-form/u-form.js";
if (!Math) {
  (imageCropper + _easycom_u_picker + _easycom_u_image + _easycom_u_input + _easycom_u_icon + _easycom_u_form_item + _easycom_u_slider + _easycom_u_form + page)();
}
const imageCropper = () => "../../components/imageCropper/imageCropper2.js";
const page = () => "../../../../components/pages/page.js";
const _sfc_main = {
  __name: "jigsawPuzzle",
  setup(__props) {
    const instance = common_vendor.getCurrentInstance();
    const previewMain = common_vendor.ref({
      width: 0,
      height: 0
    });
    const spacing = common_vendor.ref(5);
    const cropImage = common_vendor.ref();
    const seletIndex = common_vendor.ref();
    const isOpenCropper = common_vendor.ref(false);
    common_vendor.ref(1);
    const formData = common_vendor.reactive({
      imageTypeText: "九宫格",
      imageType: 1,
      scale: 1
    });
    const editeImage = common_vendor.ref(false);
    const fileListBackups = common_vendor.ref([]);
    const fileList = common_vendor.ref([]);
    common_vendor.onLoad(() => {
      editeImage.value = true;
      showImageType.value = true;
      common_vendor.nextTick$1(() => {
        showImageType.value = false;
        editeImage.value = false;
      });
    });
    common_vendor.onMounted(() => {
      const query = common_vendor.index.createSelectorQuery().in(instance.proxy);
      query.select("#contentMain").boundingClientRect((data) => {
        if (data) {
          common_vendor.index.__f__("log", "at pages/home/ph/jigsawPuzzle/jigsawPuzzle.vue:58", "元素的宽：" + data.width);
          common_vendor.index.__f__("log", "at pages/home/ph/jigsawPuzzle/jigsawPuzzle.vue:59", "元素的高：" + data.height);
          previewMain.value = {
            width: data.width,
            height: data.height
          };
        }
        nineSquareGrid();
      }).exec();
    });
    const l3r2 = () => {
      const widthL3R2L = (previewMain.value.width - spacing.value) * 0.3;
      const heightL3R2L = (previewMain.value.height - spacing.value * 2) / 3;
      const widthL3R2R = (previewMain.value.width - spacing.value) * 0.7;
      const heightL3R2R = (previewMain.value.height - spacing.value) / 2;
      fileListBackups.value = new Array(5).fill({}).map((item, index) => {
        if (index < 3) {
          return {
            width: widthL3R2L,
            height: heightL3R2L,
            x: 0,
            y: index * (heightL3R2L + spacing.value),
            url: ""
          };
        } else {
          return {
            width: widthL3R2R,
            height: heightL3R2R,
            x: widthL3R2L + spacing.value,
            y: (index - 3) * (heightL3R2R + spacing.value),
            url: ""
          };
        }
      });
      fileList.value = JSON.parse(JSON.stringify(fileListBackups.value));
    };
    const l2r3 = () => {
      const widthL3R2R = (previewMain.value.width - spacing.value) * 0.3;
      const heightL3R2R = (previewMain.value.height - spacing.value * 2) / 3;
      const widthL3R2L = (previewMain.value.width - spacing.value) * 0.7;
      const heightL3R2L = (previewMain.value.height - spacing.value) / 2;
      fileListBackups.value = new Array(5).fill({}).map((item, index) => {
        if (index < 2) {
          return {
            width: widthL3R2L,
            height: heightL3R2L,
            x: 0,
            y: index * (heightL3R2L + spacing.value),
            url: ""
          };
        } else {
          return {
            width: widthL3R2R,
            height: heightL3R2R,
            x: widthL3R2L + spacing.value,
            y: (index - 2) * (heightL3R2R + spacing.value),
            url: ""
          };
        }
      });
      fileList.value = JSON.parse(JSON.stringify(fileListBackups.value));
    };
    const nineSquareGrid = () => {
      const width = (previewMain.value.width - spacing.value * 2) / 3;
      const height = (previewMain.value.height - spacing.value * 2) / 3;
      let list = new Array(9).fill({}).map((item, index) => {
        var _a;
        let row = Math.floor(index / 3);
        let col = index % 3;
        let x = col * (width + spacing.value);
        let y = row * (height + spacing.value);
        return {
          width,
          height,
          x,
          y,
          url: fileListBackups.value[index] ? (_a = fileListBackups.value[index]) == null ? void 0 : _a.url : ""
        };
      });
      fileListBackups.value = JSON.parse(JSON.stringify(list));
      fileList.value = JSON.parse(JSON.stringify(fileListBackups.value));
    };
    const lrSymmetry = () => {
      const width = (previewMain.value.width - spacing.value) / 2;
      const height = previewMain.value.height;
      let list = new Array(2).fill({}).map((item, index) => {
        var _a;
        let col = index % 2;
        let x = col * (width + spacing.value);
        let y = 0;
        return {
          width,
          height,
          x,
          y,
          url: fileListBackups.value[index] ? (_a = fileListBackups.value[index]) == null ? void 0 : _a.url : ""
        };
      });
      fileListBackups.value = JSON.parse(JSON.stringify(list));
      fileList.value = JSON.parse(JSON.stringify(fileListBackups.value));
    };
    const tbSymmetry = () => {
      const width = previewMain.value.width;
      const height = (previewMain.value.height - spacing.value) / 2;
      fileListBackups.value = new Array(2).fill({}).map((item, index) => {
        let col = index % 2;
        let x = 0;
        let y = col * (height + spacing.value);
        return {
          width,
          height,
          x,
          y,
          url: ""
        };
      });
      fileList.value = JSON.parse(JSON.stringify(fileListBackups.value));
    };
    const showImageType = common_vendor.ref();
    const columns = common_vendor.reactive([
      [
        {
          label: "九宫格",
          value: 1,
          url: "@/assets/images/jgg.png"
        },
        {
          label: "九宫格(中间放大)",
          value: 2,
          url: "@/assets/images/jgg.png"
        },
        {
          label: "左右对称",
          value: 3,
          url: "@/assets/images/lr.png"
        },
        {
          label: "上下对称",
          value: 4,
          url: ""
        },
        {
          label: "左三右二",
          value: 5,
          url: ""
        },
        {
          label: "左二右三",
          value: 6,
          url: ""
        }
      ]
    ]);
    const iamgeColumns = common_vendor.reactive([
      [
        {
          label: "添加图片",
          value: 1
        },
        {
          label: "编辑图片",
          value: 2
        },
        {
          label: "预览图片",
          value: 3
        },
        {
          label: "删除图片",
          value: 4
        }
      ]
    ]);
    common_vendor.onPullDownRefresh(() => {
      common_vendor.index.__f__("log", "at pages/home/ph/jigsawPuzzle/jigsawPuzzle.vue:241", "下拉刷新");
    });
    common_vendor.onShow(() => {
    });
    const editPicture = (item, index) => {
      editeImage.value = true;
      seletIndex.value = index;
      cropImage.value = fileListBackups.value[index].url;
    };
    const editImagePicker = (item) => {
      editeImage.value = false;
      if (item.value[0].value == 1) {
        common_vendor.index.chooseImage({
          count: 1,
          //默认9
          sizeType: ["original"],
          //可以指定是原图还是压缩图，默认二者都有
          sourceType: ["album"],
          //从相册选择
          success: function(res) {
            cropImage.value = res.tempFilePaths[0];
            isOpenCropper.value = true;
            fileListBackups.value[seletIndex.value] = {
              ...fileListBackups.value[seletIndex.value],
              url: res.tempFilePaths[0],
              status: "success",
              message: `${seletIndex.value}`
            };
          }
        });
      }
      if (item.value[0].value == 2) {
        cropImage.value = fileListBackups.value[seletIndex.value];
        isOpenCropper.value = true;
      }
      if (item.value[0].value == 3) {
        common_vendor.index.previewImage({
          urls: fileList.value.map((val) => val.url),
          current: seletIndex.value,
          longPressActions: {
            itemList: ["发送给朋友", "保存图片", "收藏"],
            success: function(data) {
              common_vendor.index.__f__(
                "log",
                "at pages/home/ph/jigsawPuzzle/jigsawPuzzle.vue:286",
                "选中了第" + (data.tapIndex + 1) + "个按钮,第" + (data.index + 1) + "张图片"
              );
            },
            fail: function(err) {
              common_vendor.index.__f__("log", "at pages/home/ph/jigsawPuzzle/jigsawPuzzle.vue:295", err.errMsg);
            }
          }
        });
      }
      if (item.value[0].value == 4) {
        fileList.value[seletIndex.value] = {
          ...fileList.value[seletIndex.value],
          url: "",
          status: "success",
          message: `${seletIndex.value}`
        };
        fileListBackups.value[seletIndex.value] = {
          ...fileListBackups.value[seletIndex.value],
          url: "",
          status: "success",
          message: `${seletIndex.value}`
        };
      }
    };
    const handleCrop = (url) => {
      isOpenCropper.value = false;
      fileList.value[seletIndex.value] = {
        ...fileList.value[seletIndex.value],
        url,
        status: "success",
        message: `${seletIndex.value}`
      };
    };
    const drawItem = (ctx, item) => {
      if (item.url) {
        ctx.drawImage(item.url, item.x, item.y, item.width, item.height);
      } else {
        ctx.setFillStyle("white");
        ctx.fillRect(item.x, item.y, item.width, item.height);
      }
    };
    const getCanvasSize = async () => {
      const width = previewMain.value.width;
      const height = previewMain.value.height;
      const ctx = common_vendor.index.createCanvasContext("myCanvas");
      ctx.setFillStyle("#e8e8e8");
      ctx.fillRect(0, 0, width, height);
      let ruse = JSON.parse(JSON.stringify(fileList.value));
      ruse.sort((a, b) => (a.zIndex || 1) - (b.zIndex || 1));
      ruse.forEach((item, index) => {
        drawItem(ctx, item);
      });
      ctx.draw(true, () => {
        common_vendor.index.canvasToTempFilePath({
          canvasId: "myCanvas",
          success: (res) => {
            const tempFilePath = res.tempFilePath;
            common_vendor.index.previewImage({
              current: tempFilePath,
              // 当前显示的图片链接
              urls: [tempFilePath],
              // 需要预览的图片链接列表
              success: () => {
                clearCanvas();
              },
              fail: () => {
                clearCanvas();
              }
            });
          },
          fail: (err) => {
            common_vendor.index.__f__("error", "at pages/home/ph/jigsawPuzzle/jigsawPuzzle.vue:378", "合并图片失败:", err);
            common_vendor.index.showToast({
              title: "合并图片失败",
              icon: "none"
            });
          }
        });
      });
    };
    const clearCanvas = () => {
      const ctx = common_vendor.index.createCanvasContext("myCanvas");
      ctx.clearRect(0, 0, previewMain.value.width, previewMain.value.height);
      ctx.draw();
    };
    const batchInput = () => {
      const count = fileListBackups.value.length;
      common_vendor.index.chooseImage({
        count,
        // 数量控制
        sizeType: ["original"],
        // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album"],
        // 从相册选择
        success: async function(res) {
          for (let index = 0; index < res.tempFilePaths.length; index++) {
            try {
              const ctx = common_vendor.index.createCanvasContext("myCanvas");
              const { width, height } = fileList.value[index];
              const proportion = width / height;
              fileListBackups.value[index] = {
                ...fileListBackups.value[index],
                url: res.tempFilePaths[index],
                // 原图
                status: "success",
                message: `${index}`
              };
              const imageInfo = await getImageInfo(res.tempFilePaths[index]);
              let imageW = imageInfo.width;
              let imageH = imageInfo.height;
              let drawX = 0;
              let drawY = 0;
              if (imageW / imageH > proportion) {
                imageW = imageH * proportion;
                drawX = (imageInfo.width - imageW) / 2;
              } else {
                imageH = imageW / proportion;
                drawY = (imageInfo.height - imageH) / 2;
              }
              ctx.imageSmoothingEnabled = false;
              await ctx.drawImage(
                res.tempFilePaths[index],
                drawX,
                drawY,
                imageW,
                imageH,
                0,
                0,
                previewMain.value.width,
                previewMain.value.height
              );
              await ctx.draw(true);
              const cropImage2 = (await common_vendor.index.canvasToTempFilePath({
                canvasId: "myCanvas"
              })).tempFilePath;
              await ctx.clearRect(0, 0, previewMain.value.width, previewMain.value.height);
              await ctx.draw();
              common_vendor.index.__f__("log", "at pages/home/ph/jigsawPuzzle/jigsawPuzzle.vue:452", "cropImage", cropImage2);
              fileList.value[index] = {
                ...fileList.value[index],
                url: cropImage2,
                status: "success",
                message: `${index}`
              };
            } catch (error) {
              common_vendor.index.__f__("error", "at pages/home/ph/jigsawPuzzle/jigsawPuzzle.vue:462", "处理图片失败: ", error);
              fileListBackups.value[index] = {
                ...fileListBackups.value[index],
                status: "error",
                message: error.message
              };
            }
          }
        },
        fail: function(error) {
          common_vendor.index.__f__("error", "at pages/home/ph/jigsawPuzzle/jigsawPuzzle.vue:472", "选择图片失败: ", error);
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
    const typeConfirm = (item) => {
      item = item.value[0];
      formData.imageType = item.value;
      formData.imageTypeText = item.label;
      showImageType.value = false;
      formData.scale = 1;
      const typeFunctions = {
        1: nineSquareGrid,
        2: nineSquareGrid,
        3: lrSymmetry,
        4: tbSymmetry,
        5: l3r2,
        6: l2r3
      };
      const selectedFunction = typeFunctions[formData.imageType];
      if (selectedFunction) {
        selectedFunction();
      }
    };
    const formDataScale = (e) => {
      formData.scale = e;
      let result = {
        x: fileList.value[3].x + fileList.value[3].width + spacing.value,
        y: fileList.value[3].y + fileList.value[3].height + spacing.value,
        width: 0,
        height: 0
      };
      const originalWidth = fileList.value[3].width;
      const originalHeight = fileList.value[3].height;
      const scaleRatio = e / 100 + 1;
      result.width = originalWidth * scaleRatio;
      result.height = originalHeight * scaleRatio;
      const originalX = result.x - (result.width - originalWidth) / 2;
      const originalY = result.y - (result.height - originalHeight) / 2;
      result.x = originalX;
      result.y = originalY;
      fileList.value[4] = {
        ...fileList.value[4],
        x: result.x,
        y: result.x,
        width: result.width,
        height: result.height,
        zIndex: 700
      };
    };
    const spacingSize = (e) => {
      spacing.value = e;
      const typeFunctions = {
        1: nineSquareGrid,
        3: lrSymmetry,
        4: tbSymmetry,
        5: l3r2,
        6: l2r3
      };
      const selectedFunction = typeFunctions[formData.imageType];
      if (selectedFunction) {
        selectedFunction();
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: isOpenCropper.value,
        b: common_vendor.o(handleCrop),
        c: common_vendor.p({
          cropImage: cropImage.value
        }),
        d: common_vendor.o(($event) => showImageType.value = false),
        e: common_vendor.o(typeConfirm),
        f: common_vendor.p({
          show: showImageType.value,
          columns,
          keyName: "label",
          closeOnClickOverlay: true
        }),
        g: common_vendor.o(($event) => editeImage.value = false),
        h: common_vendor.o(editImagePicker),
        i: common_vendor.p({
          show: editeImage.value,
          columns: iamgeColumns,
          keyName: "label",
          closeOnClickOverlay: true
        }),
        j: common_vendor.f(fileList.value, (item, index, i0) => {
          return {
            a: "e8e9eaac-4-" + i0 + ",e8e9eaac-0",
            b: common_vendor.p({
              height: `${item.height}px`,
              width: `${item.width}px`,
              mode: "aspectFill",
              src: item.url
            }),
            c: item.url || index,
            d: `${item.width}px`,
            e: `${item.height}px`,
            f: `${item.y}px`,
            g: `${item.x}px`,
            h: `${item.zIndex || 666}`,
            i: common_vendor.o(($event) => editPicture(item, index), item.url || index)
          };
        }),
        k: previewMain.value.width + "px",
        l: previewMain.value.height + "px",
        m: common_vendor.o(($event) => formData.imageTypeText = $event),
        n: common_vendor.p({
          disabled: true,
          disabledColor: "#ffffff",
          placeholder: "请选择",
          border: "none",
          modelValue: formData.imageTypeText
        }),
        o: common_vendor.p({
          name: "arrow-right"
        }),
        p: common_vendor.sr("imageType", "e8e9eaac-6,e8e9eaac-5"),
        q: common_vendor.o(($event) => showImageType.value = true),
        r: common_vendor.p({
          label: "选择拼图类型",
          prop: "imageType",
          borderBottom: true,
          border: "none",
          placeholder: "请选择"
        }),
        s: common_vendor.o(spacingSize),
        t: common_vendor.o(($event) => spacing.value = $event),
        v: common_vendor.p({
          min: "0",
          max: "10",
          modelValue: spacing.value
        }),
        w: common_vendor.t(`${spacing.value} %`),
        x: common_vendor.sr("text", "e8e9eaac-9,e8e9eaac-5"),
        y: common_vendor.p({
          label: "间距",
          prop: "opacity",
          borderBottom: true
        }),
        z: formData.imageType == 2
      }, formData.imageType == 2 ? {
        A: common_vendor.o(formDataScale),
        B: common_vendor.o(($event) => formData.scale = $event),
        C: common_vendor.p({
          min: "1",
          max: "100",
          modelValue: formData.scale
        }),
        D: common_vendor.t(`${formData.scale} %`),
        E: common_vendor.sr("text", "e8e9eaac-11,e8e9eaac-5"),
        F: common_vendor.p({
          label: "中间图片大小",
          prop: "opacity",
          borderBottom: true
        })
      } : {}, {
        G: common_vendor.sr("form1", "e8e9eaac-5,e8e9eaac-0"),
        H: common_vendor.p({
          labelWidth: "100px",
          labelPosition: "left",
          labelAlign: "left",
          model: formData
        }),
        I: common_vendor.o(batchInput),
        J: common_vendor.o(getCanvasSize),
        K: common_vendor.p({
          title: "拼图",
          lButton: "批量录入",
          rButton: "生成照片"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e8e9eaac"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/pages/home/ph/jigsawPuzzle/jigsawPuzzle.js.map
