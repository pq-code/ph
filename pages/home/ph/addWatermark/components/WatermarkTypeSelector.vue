<template>
  <view class="watermark-selector">
    <scroll-view scroll-x class="type-list">
      <view 
        v-for="item in WATERMARK_TYPES"
        :key="item.id"
        class="type-item"
        :class="{ active: modelValue === item.id }"
        @click="onImageSelect(item)"
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
import { WATERMARK_TYPES } from './watermarkConfig'
const emits = defineEmits(['update:modelValue','handleTypeChange'])
const onImageSelect = (item) => {
  emits('handleTypeChange', item)
}

defineProps({
  modelValue: {
    type: Number,
    default: 1
  }
})

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
