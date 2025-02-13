<template>
  <view class="watermark-selector">
    <scroll-view scroll-x class="type-list">
      <view 
        v-for="item in WATERMARK_TYPES"
        :key="item.id"
        class="type-item"
        :class="{ active: modelValue === item.id }"
        @click="$emit('update:modelValue', item.id)"
      >
        <image
          :src="item.preview"
          mode="aspectFit"
          class="preview-image"
        />
        <text class="type-name">{{ item.name }}</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
// import { WATERMARK_TYPES } from '../constants/watermarkTypes'
const WATERMARK_TYPES = [
  {
    id: 1,
    name: '标准水印',
    preview: '/static/watermark/preview1.png',
    style: {
      centerText: '现场拍照',
      fontSize: 0.05,
      color: '#666666',
      strokeColor: '#FFFFFF'
    }
  },
  {
    id: 2,
    name: '现场水印',
    preview: '/static/watermark/preview2.png',
    style: {
      centerText: '现场拍照',
      fontSize: 0.04,
      color: '#FFFFFF',
      strokeColor: '#000000'
    }
  },
  {
    id: 3,
    name: '时间水印',
    preview: '/static/watermark/preview3.png',
    style: {
      centerText: '',  // 不显示中心文字
      fontSize: 0.04,
      color: '#FFFFFF',
      strokeColor: '#000000'
    }
  }
]

// 处理图片选择
const onImageSelect = async () => {
  if (isProcessing.value) return
  
  const image = await handleImageSelect(canvasSize.value)
  if (image) {
    const style = getCurrentWatermarkStyle()
    await addWatermark({
      image,
      text: style.centerText,
      style,
      info: formData.value
    })
  }
}

defineProps({
  modelValue: {
    type: Number,
    default: 1
  }
})

defineEmits(['update:modelValue'])
</script>

<style lang="less" scoped>
.watermark-selector {
  background: #ffffff;
  border-radius: 8px;
  padding: 15px;
  
  .type-list {
    white-space: nowrap;
    
    .type-item {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      margin-right: 20px;
      
      &:last-child {
        margin-right: 0;
      }
      
      .preview-image {
        width: 120px;
        height: 80px;
        border-radius: 4px;
        border: 2px solid transparent;
        margin-bottom: 8px;
      }
      
      .type-name {
        font-size: 14px;
        color: #666;
      }
      
      &.active {
        .preview-image {
          border-color: #2979ff;
        }
        
        .type-name {
          color: #2979ff;
        }
      }
    }
  }
}
</style>
