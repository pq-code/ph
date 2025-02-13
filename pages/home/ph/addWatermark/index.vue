<script setup>
import { ref } from 'vue'
import { useImageHandler } from './hooks/useImageHandler'
import { useWatermark } from './hooks/useWatermark'
import { useWatermarkForm } from './hooks/useWatermarkForm'
import { WATERMARK_TYPES } from './constants/watermarkConfig'
import WatermarkTypeSelector from './components/WatermarkTypeSelector.vue'
import WatermarkForm from './components/WatermarkForm.vue'

const watermarkType = ref(1)
const currentStyle = ref(WATERMARK_TYPES[0].style)

const { imageInfo, isProcessing, handleImageSelect } = useImageHandler()
const { addWatermark } = useWatermark('watermark')
const { formData, getFormFields, validateForm, resetForm } = useWatermarkForm()

// 处理水印类型变化
const handleTypeChange = (style) => {
  currentStyle.value = style
  if (imageInfo.value) {
    updateWatermark()
  }
}

// 更新水印
const updateWatermark = async () => {
  if (!imageInfo.value || !currentStyle.value) return
  
  await addWatermark({
    image: imageInfo.value,
    style: currentStyle.value,
    info: formData.value
  })
}

// 处理图片选择
const onImageSelect = async () => {
  if (isProcessing.value) return
  
  const image = await handleImageSelect(canvasSize.value)
  if (image) {
    await updateWatermark()
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
  
  const fields = getFormFields(currentStyle.value)
  if (!validateForm(fields)) return
  
  try {
    const res = await uni.canvasToTempFilePath({
      canvasId: 'watermark'
    })
    
    await uni.previewImage({
      urls: [res.tempFilePath]
    })
  } catch (error) {
    uni.showToast({
      title: '生成图片失败',
      icon: 'none'
    })
  }
}
</script>

<template>
  <page 
    title="添加水印" 
    rButton="生成图片" 
    :rButtonDisabled="isProcessing"
    @rButton="generateImage"
  >
    <view class="content">
      <!-- 水印类型选择器 -->
      <WatermarkTypeSelector
        v-model="watermarkType"
        @change="handleTypeChange"
      />
      
      <!-- 画布区域 -->
      <view 
        id="contentMain" 
        class="content-main"
        @click="onImageSelect"
      >
        <canvas 
          canvas-id="watermark"
          class="watermark-canvas"
        />
        <view v-if="!imageInfo" class="placeholder">
          <u-icon name="camera-fill" size="40" color="#999"/>
          <text class="placeholder-text">点击选择图片</text>
        </view>
      </view>
      
      <!-- 表单区域 -->
      <WatermarkForm
        v-if="currentStyle"
        v-model="formData"
        :fields="getFormFields(currentStyle)"
        :disabled="isProcessing"
        @change="updateWatermark"
      />
    </view>
  </page>
</template>

<style lang="less" scoped>
.content {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 15px;
  
  .content-main {
    position: relative;
    width: 100%;
    height: 600px;
    background: #ffffff;
    border-radius: 8px;
    overflow: hidden;
    
    .watermark-canvas {
      width: 100%;
      height: 100%;
    }
    
    .placeholder {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      
      .placeholder-text {
        font-size: 14px;
        color: #999;
      }
    }
  }
}
</style> 
