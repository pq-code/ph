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
      <u-image 
        width="120px"
        height="80px"
        :show-loading="true" 
        :src="item.preview"
        mode="aspectFit"
        class="preview-image">
      </u-image>
        <!-- <image
          :src="item.preview"
          mode="aspectFit"
          class="preview-image"
        /> -->
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
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  .type-list {
    white-space: nowrap;

    .type-item {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      margin-right: 16px;

      &:last-child {
        margin-right: 0;
      }

      .preview-image {
        width: 100px;
        height: 68px;
        border-radius: 8px;
        border: 2px solid transparent;
        margin-bottom: 8px;
        overflow: hidden;
      }

      .type-name {
        font-size: 13px;
        color: #666;
      }

      &.active {
        .preview-image {
          border-color: #487AFA;
        }

        .type-name {
          color: #487AFA;
          font-weight: 600;
        }
      }
    }
  }
}
</style>
