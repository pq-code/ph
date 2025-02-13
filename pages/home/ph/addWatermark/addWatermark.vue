<script setup>
import page from "@/components/pages/page.vue";
import { ref } from 'vue'
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
  console.log('formData',formData.value)
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
    const { x,y,drawWidth, drawHeight  } = imageInfo.value;
    const { tempFilePath } = await uni.canvasToTempFilePath({
      canvasId: 'watermark',
      fileType: 'png', // 使用 PNG 格式以保证无损
      quality: 1, // 设置图片质量为最高
      x: x + 0.1, // 截取区域的左上角 x 坐标
      y: y + 0.1, // 截取区域的左上角 y 坐标
      width: drawWidth - 0.5, // 截取区域的宽度，使用图片实际绘制的宽度
      height: drawHeight - 0.5 // 截取区域的高度，使用图片实际绘制的高度
    });

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



</script>

<template>
  <page
    title="添加水印"
    rButton="生成图片"
    :rButtonDisabled="isProcessing"
    @rButton="generateImage"
  >
    <view class="content">
     
      <!-- 画布区域 -->
      <view 
        id="contentMain" 
        class="content-main"
        @click="onImageSelect"
      >
        <canvas 
          canvas-id="watermark"
          class="watermark-canvas"
          :style="{
            width: imageInfo?.canvasWidth + 'px',
            height: imageInfo?.canvasHeight + 'px'
          }"
        />
        <view v-if="!imageInfo" class="placeholder">
          <u-icon name="camera-fill" size="40" color="#999"/>
          <text class="placeholder-text">点击选择图片</text>
        </view>
      </view>
      
			 <!-- 水印类型选择器 -->
			 <WatermarkTypeSelector
        v-model="watermarkType"
        @handleTypeChange="handleTypeChange"
      />
      
      <!-- 表单区域 -->
      <WatermarkForm
        v-if="currentStyle"
        v-model="formData"
        :fields="getFormFields(currentStyle)"
        :disabled="isProcessing"
        @dataChanged="updateWatermark"
      />
    </view>
  </page>
</template>

<style lang="less" scoped>
.content {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 10px;
  background: #e6e6e6;

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
