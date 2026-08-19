<script setup>
import page from "@/components/pages/page.vue";
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useImageHandler } from '../addWatermark/hooks/useImageHandler'
import { useWatermarkForm } from '../addWatermark/hooks/useWatermarkForm'
import { CUSTOMIZE_FORM_LIST } from './components/customizeConfig.js'
import WatermarkForm from '../addWatermark/components/WatermarkForm.vue'
// 移除不需要的导入，专注于尺寸和质量调整

const { imageInfo, isProcessing, handleImageSelect } = useImageHandler('customize')
const { formData } = useWatermarkForm()
// 创建响应式数据  
const show = ref(false);
const originalImagePath = ref('') // 保存原始图片路径  

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
    
    // 初始化表单数据
    resetFormData()

  } catch (error) {
    console.error('容器初始化失败:', error)
    uni.showToast({
      title: '初始化失败，请重试',
      icon: 'none'
    })
  }

})

// 监听表单数据变化，实时预览
watch(() => formData.value, () => {
  if (imageInfo.value?.url && originalImagePath.value) {
    // 延迟执行，避免频繁触发
    clearTimeout(updateTimer.value)
    updateTimer.value = setTimeout(() => {
      editImage()
    }, 300)
  }
}, { deep: true })

const updateTimer = ref(null)

// 组件卸载前清理定时器
onBeforeUnmount(() => {
  if (updateTimer.value) {
    clearTimeout(updateTimer.value)
    updateTimer.value = null
  }
})

// 处理图片选择
const onImageSelect = async () => {
  if (isProcessing.value) return
  const image = await handleImageSelect()
  console.log('image', image)
  imageInfo.value.url = image.path
  originalImagePath.value = image.path // 保存原始路径
  
  // 重置表单数据
  resetFormData()
}

// 重置表单数据
const resetFormData = () => {
  Object.assign(formData.value, {
    scale: 100,
    quality: 80,
    presetSize: 'custom'
  })
}

// 生成最终图片
const generateImage = async () => {
  if (!imageInfo.value?.url) {
    uni.showToast({
      title: '请先选择图片',
      icon: 'none'
    })
    return
  }
  
  try {
    // 先执行一次完整的编辑，确保图片是最新的
    await editImage()
    
    // 等待一下确保图片已生成
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const tempFilePath = imageInfo.value.url

    if (!tempFilePath) {
      throw new Error('图片生成失败')
    }

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
      title: '生成图片出错: ' + (error.message || '未知错误'),
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
  // 关闭弹窗时执行编辑（延迟一下确保表单数据已更新）
  if (updateTimer.value) {
    clearTimeout(updateTimer.value)
  }
  updateTimer.value = setTimeout(() => {
    editImage()
    updateTimer.value = null
  }, 100)
}  

// 预设尺寸配置
const PRESET_SIZES = {
  '640x640': { width: 640, height: 640 },
  '1080x1080': { width: 1080, height: 1080 },
  '1080x566': { width: 1080, height: 566 },
  '566x1080': { width: 566, height: 1080 },
  '1080x1440': { width: 1080, height: 1440 },
  '1080x1920': { width: 1080, height: 1920 },
  '1200x675': { width: 1200, height: 675 }
}

// 新增图片编辑方法 - 专注于尺寸和质量调整
async function editImage() {
  if (!imageInfo.value?.path && !originalImagePath.value) {
    return
  }
  
  try {
    // 使用原始图片路径或当前路径
    const sourceImagePath = originalImagePath.value || imageInfo.value.path
    
    // 获取原始图片信息
    const imgInfo = await new Promise((resolve, reject) => {
      uni.getImageInfo({
        src: sourceImagePath,
        success: resolve,
        fail: reject
      })
    })
    
    const originWidth = imgInfo.width
    const originHeight = imgInfo.height
    const originRatio = originWidth / originHeight
    
    let targetWidth, targetHeight
    let drawX = 0
    let drawY = 0
    let drawWidth, drawHeight
    
    // 处理预设尺寸
    if (formData.value.presetSize && formData.value.presetSize !== 'custom') {
      const preset = PRESET_SIZES[formData.value.presetSize]
      if (preset) {
        // 画布使用预设尺寸
        targetWidth = preset.width
        targetHeight = preset.height
        
        // 计算图片在预设尺寸中的显示尺寸（保持原图比例）
        const presetRatio = preset.width / preset.height
        if (originRatio > presetRatio) {
          // 原图更宽，以宽度为准，高度自适应
          drawWidth = preset.width
          drawHeight = Math.round(preset.width / originRatio)
          drawY = Math.round((preset.height - drawHeight) / 2)
        } else {
          // 原图更高，以高度为准，宽度自适应
          drawHeight = preset.height
          drawWidth = Math.round(preset.height * originRatio)
          drawX = Math.round((preset.width - drawWidth) / 2)
        }
      } else {
        // 如果预设不存在，使用缩放
        const scale = formData.value.scale 
          ? Math.min(Math.max(formData.value.scale, 10), 200) / 100 
          : 1
        targetWidth = Math.round(originWidth * scale)
        targetHeight = Math.round(originHeight * scale)
        drawWidth = targetWidth
        drawHeight = targetHeight
      }
    } else {
      // 使用自定义缩放
      const scale = formData.value.scale 
        ? Math.min(Math.max(formData.value.scale, 10), 200) / 100 
        : 1
      targetWidth = Math.round(originWidth * scale)
      targetHeight = Math.round(originHeight * scale)
      drawWidth = targetWidth
      drawHeight = targetHeight
    }

    // 获取画布上下文
    const ctx = uni.createCanvasContext('customize')
    
    // 设置画布尺寸
    const systemInfo = uni.getSystemInfoSync()
    const pixelRatio = systemInfo.pixelRatio || 1
    
    // 清空画布
    ctx.clearRect(0, 0, targetWidth, targetHeight)
    
    // 绘制白色背景（如果是预设尺寸）
    if (formData.value.presetSize && formData.value.presetSize !== 'custom') {
      ctx.setFillStyle('#ffffff')
      ctx.fillRect(0, 0, targetWidth, targetHeight)
    }
    
    // 绘制图片（居中显示）
    ctx.drawImage(
      sourceImagePath,
      drawX,
      drawY,
      drawWidth,
      drawHeight
    )
    
    // 压缩参数处理
    const quality = formData.value.quality 
      ? Math.min(Math.max(formData.value.quality, 10), 100) / 100
      : 0.8

    // 生成新图片
    const { tempFilePath } = await new Promise((resolve, reject) => {
      ctx.draw(false, () => {
        setTimeout(() => {
          uni.canvasToTempFilePath({
            canvasId: 'customize',
            destWidth: targetWidth * pixelRatio,
            destHeight: targetHeight * pixelRatio,
            quality,
            fileType: 'jpg',
            success: resolve,
            fail: reject
          })
        }, 100)
      })
    })

    // 获取生成后的文件大小
    const fileInfo = await new Promise((resolve, reject) => {
      uni.getFileInfo({
        filePath: tempFilePath,
        success: resolve,
        fail: reject
      })
    }).catch(() => ({ size: 0 }))

    // 更新图片信息
    imageInfo.value.url = tempFilePath
    imageInfo.value.width = targetWidth
    imageInfo.value.height = targetHeight
    imageInfo.value.fileSize = Math.round(fileInfo.size / 1024) // 转换为KB
    
  } catch (err) {
    console.error('图片编辑失败', err)
    uni.showToast({ 
      title: '编辑失败：' + (err.message || '未知错误'), 
      icon: 'none',
      duration: 2000
    })
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
          <text v-if="imageInfo.fileSize" class="info-text">文件大小: {{ imageInfo.fileSize }}KB</text>
          <text v-if="formData.scale" class="info-text">缩放: {{ formData.scale }}%</text>
          <text v-if="formData.quality" class="info-text">质量: {{ formData.quality }}%</text>
        </view>
        
        <u-image 
          v-if="imageInfo?.url" 
          class="preview-image"
          :src="imageInfo?.url" 
          mode="aspectFit"
          :lazy-load="true" 
          :fade="true" 
          :show-menu-by-longpress="true"
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
        <view class="popup-header">
          <text class="popup-title">图片编辑</text>
          <u-button 
            type="primary" 
            size="small"
            @click="closePopup"
            :customStyle="{ marginRight: '10px' }"
          >
            确定
          </u-button>
        </view>
        <view class="popup-body">
          <!-- 表单区域 -->
          <WatermarkForm
            v-model="formData"
            :fields="CUSTOMIZE_FORM_LIST"
          />
        </view>
     </view>
    </u-popup>
  </page>

</template>

<style lang="less" scoped>
.content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  background: #f0f2f5;
  height: 100%;
  overflow-y: hidden;
}

/* 预览区域样式 */
.preview-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 400px;
  background: #fff;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

/* 隐藏 canvas */
.hidden-canvas {
  position: absolute;
  top: -700px;
  left: 10px;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* 预览图片样式 */
.preview-image {
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  transition: opacity 0.3s ease;
  object-fit: contain;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  :deep(image) {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    display: block;
    margin: auto;
  }
}

/* 占位提示样式 */
.placeholder {
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
  padding: 20px;
  max-height: 70vh;
  overflow-y: auto;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
  margin-bottom: 15px;
}

.popup-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.popup-body {
  padding-top: 10px;
}

.info-box {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.65);
  padding: 8px 12px;
  border-radius: 8px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-text {
  color: #fff;
  font-size: 11px;
  line-height: 1.4;
}
</style>
