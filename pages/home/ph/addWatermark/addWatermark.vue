<script setup>
import page from "@/components/pages/page.vue";
import { ref,onMounted } from 'vue'
import { useImageHandler } from './hooks/useImageHandler'
import { useWatermark } from './hooks/useWatermark'
import { useWatermarkForm } from './hooks/useWatermarkForm'
import { WATERMARK_TYPES } from './components/watermarkConfig'
import WatermarkTypeSelector from './components/WatermarkTypeSelector.vue'
import WatermarkForm from './components/WatermarkForm.vue'

const watermarkType = ref(1)
const currentStyle = ref(WATERMARK_TYPES[0].style)

const { imageInfo, isProcessing, handleImageSelect } = useImageHandler()
const { addWatermark } = useWatermark('watermark')
const { formData, getFormFields, validateForm, resetForm } = useWatermarkForm()

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

// 处理水印类型变化
const handleTypeChange = (item) => {
	console.log('style',item)
	currentStyle.value = item.style
	watermarkType.value = item.id
  if (imageInfo.value) {
    updateWatermark()
  }
}
// 更新水印
const updateWatermark = async () => {
  console.log('formData', formData.value);
  
  if (!imageInfo.value || !imageInfo.value.path || !currentStyle.value) return;

  try {
    // 缓存 image 信息
    const info = imageInfo.value;

    // 添加水印
    await addWatermark({
      image: info,
      style: currentStyle.value,
      info: formData.value
    });

    // 定义常量，用于调整截取区域的偏移和尺寸
    const OFFSET = 0.2;
    const SIZE_ADJUSTMENT = 0.5;
    const { x, y, drawWidth, drawHeight } = info;

    // 生成图片供预览
    const { tempFilePath } = await uni.canvasToTempFilePath({
      canvasId: 'watermark',
      fileType: 'png', // PNG 格式保证无损
      quality: 1,      // 图片质量最高
      x: x + OFFSET,   // 左上角 x 坐标偏移
      y: y + OFFSET,   // 左上角 y 坐标偏移
      width: drawWidth - SIZE_ADJUSTMENT, // 宽度调整
      height: drawHeight - SIZE_ADJUSTMENT // 高度调整
    });

    console.log('生成图片成功', tempFilePath);
    info.url = tempFilePath;

    // 清空画布：先获取画布上下文，然后清空画布（可选：调用 draw() 来立即更新显示）
    const canvasContext = uni.createCanvasContext('watermark');
    canvasContext.clearRect(0, 0, info.canvasWidth, info.canvasHeight);
    canvasContext.draw();

  } catch (error) {
    console.error('更新水印出错', error);
    uni.showToast({
      title: '更新水印出错',
      icon: 'none'
    });
  }
};
// 处理图片选择
const onImageSelect = async () => {
  if (isProcessing.value) return
  const image = await handleImageSelect()
  if (image) {
    await updateWatermark() // 更新水印
  }
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
    // const { tempFilePath } = await uni.canvasToTempFilePath({
    //   canvasId: 'watermark',
    //   fileType: 'png', // 使用 PNG 格式以保证无损
    //   quality: 1, // 设置图片质量为最高
    //   x: x + 0.1, // 截取区域的左上角 x 坐标
    //   y: y + 0.1, // 截取区域的左上角 y 坐标
    //   width: drawWidth - 0.5, // 截取区域的宽度，使用图片实际绘制的宽度
    //   height: drawHeight - 0.5 // 截取区域的高度，使用图片实际绘制的高度
    // });

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

// 创建响应式数据  
const show = ref(false);  
  
// 定义方法  
function open() {  
  // 打开逻辑，比如设置 show 为 true  
  show.value = true;  
  // console.log('open');  
}  
  
function closePopup() {  
  // 关闭逻辑，设置 show 为 false  
  show.value = false;  
  updateWatermark() // 更新水印
  // console.log('close');  
}  

</script>

<template>
  <page
    title="添加水印"
    rButton="生成图片"
    lButton="编辑" 
    :rButtonDisabled="isProcessing"
    @rButton="generateImage"
    @lButton="show = true"
  >
    <view class="content">
      <!-- 预览区域：用于展示生成的图片或占位提示 -->
      <view class="preview-wrapper" @click="onImageSelect">
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
        ></u-image>
        <view v-else class="placeholder">
          <u-icon name="camera-fill" size="40" color="#999"></u-icon>
          <text class="placeholder-text">点击选择图片</text>
        </view>
      </view>
      
      <!-- 隐藏的 canvas：仅用于生成图片 -->
      <canvas 
        class="hidden-canvas"
        canvas-id="watermark"
        :style="{
          width: imageInfo?.canvasWidth + 'px',
          height: imageInfo?.canvasHeight + 'px'
        }"
      />
      
      <!-- 水印类型选择器 -->
      <WatermarkTypeSelector
        v-model="watermarkType"
        @handleTypeChange="handleTypeChange"
      />
      
    </view>

    <u-popup 
      :show="show" 
      mode="bottom"  
      @close="closePopup"
      @open="open"
      :closeable="true"
      :overlay="true"
      :safeAreaInsetBottom="true"
      :round="10">
      <view class="popup-content">
        <!-- 表单区域 -->
        <WatermarkForm
          v-if="currentStyle"
          v-model="formData"
          :fields="getFormFields(currentStyle)"
          :disabled="isProcessing"
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
  max-height: 70vh;   // 根据视口高度限制
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

</style>
