<script setup>
import page from "@/components/pages/page.vue";
import { ref,onMounted } from 'vue'
import { useImageHandler } from '../addWatermark/hooks/useImageHandler'
import { useWatermark } from '../addWatermark/hooks/useWatermark'
import { useWatermarkForm } from '../addWatermark/hooks/useWatermarkForm'
import { CUSTOMIZE_FORM_LIST } from './components/customizeConfig.js'
import WatermarkForm from '../addWatermark/components/WatermarkForm.vue'

const watermarkType = ref(1)

const { imageInfo, isProcessing, handleImageSelect ,drawImage} = useImageHandler('customize')
const { addWatermark } = useWatermark('customize')
const { formData, getFormFields, validateForm, resetForm } = useWatermarkForm()
// 创建响应式数据  
const show = ref(false);  

onMounted(async () => {
  try {
    // 获取容器尺寸（带错误处理）
    const containerRect = await new Promise((resolve, reject) => {
      const query = uni.createSelectorQuery()
      query.select('.preview-wrapper')
        .boundingClientRect(data => {
          if (!data) {
            reject(new Error('未能获取容器尺寸'))
            return
          }
          resolve(data)
        }).exec()
    })

    // 设置画布尺寸（封装为独立函数）
    const setCanvasDimensions = (width, height) => {
      imageInfo.value.canvasWidth = width
      imageInfo.value.canvasHeight = height
    }
    
    setCanvasDimensions(containerRect.width, containerRect.height)
    console.log('容器初始化完成，尺寸：', containerRect)

  } catch (error) {
    console.error('容器初始化失败:', error)
    uni.showToast({
      title: '初始化失败，请重试',
      icon: 'none'
    })
  }

})

// 更新水印
const updateWatermark = async () => {
  console.log('formData', formData.value);
  
  if (!imageInfo.value || !imageInfo.value.path) return;
 
  try {
    // 缓存 image 信息
    const info = imageInfo.value;

    console.log('生成图片成功', tempFilePath);
    info.url = tempFilePath;

    // 清空画布：先获取画布上下文，然后清空画布（可选：调用 draw() 来立即更新显示）
    const canvasContext = uni.createCanvasContext('customize');
    canvasContext.clearRect(0, 0, info.canvasWidth, info.canvasHeight);
    canvasContext.draw();

  } catch (error) {
    console.error('修改图片失败', error);
    uni.showToast({
      title: '修改图片失败',
      icon: 'none'
    });
  }
};

// 处理图片选择
const onImageSelect = async () => {
  if (isProcessing.value) return
  const image = await handleImageSelect()
  console.log('image', image)
  imageInfo.value.url = image.path
  
}

// 生成最终图片
const generateImage = async () => {
  if (!imageInfo.value) {
    uni.showToast({
      title: '请先选择图片',
      icon: 'none'
    })
    return
  }
  try {
    const { x, y, drawWidth, drawHeight } = imageInfo.value;
    console.log(imageInfo.value.url)
    const tempFilePath = imageInfo.value.url

    console.log('生成图片成功', tempFilePath);
    uni.showToast({
      title: '生成图片成功',
      icon: 'success'
    });

    // 预览图片
    uni.previewImage({
      urls: [tempFilePath],
      longPressActions: {
        itemList: ['保存图片'],
        success: function (data) {
          if (data.tapIndex === 0) {
            // 保存图片到相册
            uni.saveImageToPhotosAlbum({
              filePath: tempFilePath,
              success: function () {
                uni.showToast({
                  title: '保存成功',
                  icon: 'success'
                });
              },
              fail: function (err) {
                console.error('保存失败', err);
                uni.showToast({
                  title: '保存失败',
                  icon: 'none'
                });
              }
            });
          }
        },
        fail: function (err) {
          console.error('长按操作失败', err);
        }
      }
    });
  } catch (error) {
    console.error('生成图片出错', error);
    uni.showToast({
      title: '生成图片出错',
      icon: 'none'
    });
  }
};


  
// 定义方法  
function open() {  
  // 打开逻辑，比如设置 show 为 true  
  show.value = true;  
  // console.log('open');  
}  
  
function closePopup() {  
  show.value = false;
  editImage();  // 关闭弹窗时执行编辑
}  

// 新增图片编辑方法
async function editImage() {
  if (!imageInfo.value?.url) return;
  
  try {
    // 获取画布上下文并清空
    const ctx = uni.createCanvasContext('customize');
    
    // 获取原始图片信息
    const { width: originWidth, height: originHeight } = imageInfo.value;
    let targetWidth = originWidth;
    let targetHeight = originHeight;

    // 尺寸处理逻辑（精确计算）
    if (formData.value.selectedSize) {
      const dpi = 300; // 标准300dpi
      const mmToInch = 0.0393701;
      const sizePresets = {
        '1inch': { 
          width: Math.round(25 * mmToInch * dpi),  // 25mm → 295px
          height: Math.round(35 * mmToInch * dpi) // 35mm → 413px
        },
        '2inch': {
          width: Math.round(35 * mmToInch * dpi),  // 35mm → 413px
          height: Math.round(49 * mmToInch * dpi)  // 49mm → 578px
        }
      };
      const preset = sizePresets[formData.value.selectedSize];
      if (preset) {
        targetWidth = preset.width;
        targetHeight = preset.height;
      }
    } else if (formData.value.scale) {
      const scale = Math.min(Math.max(formData.value.scale, 1), 100) / 100; // 强制限制1-100%
      targetWidth = originWidth * scale;
      targetHeight = originHeight * scale;
    }

    // 设置实际画布尺寸（关键修复）
    const systemInfo = uni.getSystemInfoSync();
    const pixelRatio = systemInfo.pixelRatio || 1;
    ctx.canvas.width = targetWidth * pixelRatio;
    ctx.canvas.height = targetHeight * pixelRatio;
    ctx.scale(pixelRatio, pixelRatio);

    // 清空并绘制图片
    ctx.clearRect(0, 0, targetWidth, targetHeight);
    ctx.drawImage(imageInfo.value.url, 0, 0, targetWidth, targetHeight);

    // 压缩参数处理
    const quality = formData.value.quality 
      ? Math.min(Math.max(formData.value.quality, 10), 100) / 100
      : 0.8;

    // 生成新图片（使用destWidth/destHeight）
    const { tempFilePath } = await new Promise((resolve, reject) => {
      ctx.draw(false, () => {
        uni.canvasToTempFilePath({
          canvasId: 'customize',
          destWidth: targetWidth * pixelRatio, // 适配高清屏
          destHeight: targetHeight * pixelRatio,
          quality,
          fileType: 'jpg',
          success: resolve,
          fail: reject
        }, this);
      });
    });

    // 更新图片信息（保持显示尺寸为逻辑像素）
    imageInfo.value.url = tempFilePath;
    imageInfo.value.width = targetWidth;
    imageInfo.value.height = targetHeight;
    
  } catch (err) {
    console.error('图片编辑失败', err);
    uni.showToast({ title: '编辑失败：' + err.message, icon: 'none' });
  }
}

</script>

<template>
  <page
    title="自定义修改图片"
    rButton="生成图片"
    lButton="编辑" 
    :rButtonDisabled="isProcessing"
    @rButton="generateImage"
    @lButton="show = true"
  >
    <view class="content">
      <!-- 预览区域：用于展示生成的图片或占位提示 -->
      <view class="preview-wrapper" @click="onImageSelect">
        <!-- 移动信息框到预览容器内部 -->
        <view class="info-box" v-if="imageInfo.url">
          <text class="info-text">尺寸: {{ imageInfo.width }} × {{ imageInfo.height }}px</text>
          <text v-if="imageInfo.fileSize" class="info-text" >文件大小: {{ imageInfo.fileSize }}kb</text>
        </view>
        
        <u-image 
          v-if="imageInfo?.url" 
          class="preview-image"
          :src="imageInfo?.url" 
          mode="aspectFit"
          :lazy-load="true" 
          :fade="true" 
          :show-menu-by-longpress="true"
          :width= "imageInfo?.canvasWidth + 'px'"
          :height= "imageInfo?.canvasHeight + 'px'"
        >
        </u-image>
        <view v-else class="placeholder">
          <u-icon name="camera-fill" size="40" color="#999"></u-icon>
          <text class="placeholder-text">点击选择图片</text>
        </view>
      </view>
      <!-- 隐藏的 canvas：仅用于生成图片 -->
      <canvas
        class="hidden-canvas"
        canvas-id="customize"
        :style="{
          width: imageInfo?.canvasWidth + 'px',
          height: imageInfo?.canvasHeight + 'px'
        }"
      />
    </view>

    <u-popup
      :show="show"
      mode="bottom"
      @close="closePopup"
      @open="open"
      :closeable="false"
      :overlay="true"
      :safeAreaInsetBottom="true"
      :round="7">
      <view class="popup-content">
        <u-button @click="closePopup">确定</u-button>
        <!-- 表单区域 -->
        <WatermarkForm
          v-model="formData"
          :fields="CUSTOMIZE_FORM_LIST"
        />
     </view>
    </u-popup>
  </page>

</template>

<style lang="less" scoped>
.content {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 10px;
  background: #e6e6e6;
  height: 100%;
  overflow-y: hidden;
}

/* 预览区域样式 */
.preview-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 450px;  // 降低最小高度
  // max-height: 70vh;   // 根据视口高度限制
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;  // 隐藏溢出部分
  box-shadow: 0 2px 8px rgba(0,0,0,0.1); // 添加投影
}
/* 隐藏 canvas */
.hidden-canvas {
  position: absolute;
  top: -700px;
  left: 10px;
  width: 100%;
  height: 100%;
  // background: #904b4b;
  pointer-events: none;
  // display: none;
}

/* 预览图片样式 */
.preview-image {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  transition: transform 0.3s ease; // 添加缩放动画
  object-fit: contain;
  flex-shrink: 0;
}

/* 占位提示样式 */
.placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.placeholder-text {
  font-size: 14px;
  color: #999;
}

.popup-content {
  padding-top: 30px;
}

.info-box {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.7);
  padding: 6px 10px;
  border-radius: 4px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.info-text {
  color: #fff;
  font-size: 11px;
  line-height: 1.2;
}

</style>
