<script setup>
import { ref } from 'vue'
import page from '@/components/pages/page.vue'

// 输入参数
const prompt = ref('')
const negativePrompt = ref('')
const selectedStyle = ref('realistic')
const imageCount = ref(1)

// 生成结果
const generatedImages = ref([])
const isGenerating = ref(false)
const generationProgress = ref(0)

// 风格选项
const styleOptions = [
  { value: 'realistic', label: '写实风格', icon: 'photo', desc: '真实照片效果' },
  { value: 'anime', label: '动漫风格', icon: 'star', desc: '日系动漫画风' },
  { value: 'oil-painting', label: '油画风格', icon: 'heart', desc: '经典油画效果' },
  { value: 'watercolor', label: '水彩风格', icon: 'thumb-up', desc: '水彩画效果' },
  { value: 'sketch', label: '素描风格', icon: 'edit-pen', desc: '铅笔素描效果' },
  { value: 'pixel', label: '像素风格', icon: 'grid', desc: '复古像素艺术' }
]

// 预设提示词
const presetPrompts = [
  '一只可爱的橘猫坐在窗台上晒太阳',
  '赛博朋克风格的未来城市夜景',
  '中国风水墨画，山水之间',
  '梵高风格的星空下的小镇',
  '日系动漫少女，樱花树下',
  '蒸汽朋克风格的机械城堡'
]

// 选择风格
const selectStyle = (style) => {
  selectedStyle.value = style.value
}

// 使用预设提示词
const usePreset = (text) => {
  prompt.value = text
}

// 生成图片
const generateImage = async () => {
  if (!prompt.value.trim()) {
    uni.showToast({ title: '请输入描述内容', icon: 'none' })
    return
  }

  isGenerating.value = true
  generationProgress.value = 0
  generatedImages.value = []

  // 模拟生成过程 (实际使用时替换为真实API调用)
  const progressInterval = setInterval(() => {
    generationProgress.value += Math.random() * 15
    if (generationProgress.value >= 100) {
      generationProgress.value = 100
      clearInterval(progressInterval)
    }
  }, 300)

  try {
    // TODO: 替换为真实API调用
    // 示例: 调用AI图像生成API
    // const result = await callAIImageAPI({
    //   prompt: prompt.value,
    //   negativePrompt: negativePrompt.value,
    //   style: selectedStyle.value,
    //   count: imageCount.value
    // })

    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 3000))

    // 模拟生成结果
    generatedImages.value = [
      { id: 1, url: '', status: 'success' }
    ]

    uni.showToast({ title: '功能开发中', icon: 'none' })
  } catch (err) {
    console.error('生成失败:', err)
    uni.showToast({ title: '生成失败', icon: 'none' })
  } finally {
    isGenerating.value = false
    clearInterval(progressInterval)
    generationProgress.value = 0
  }
}

// 预览图片
const previewImage = (url) => {
  uni.previewImage({
    urls: [url],
    longPressActions: {
      itemList: ['保存图片'],
      success: function (data) {
        if (data.tapIndex === 0) {
          uni.saveImageToPhotosAlbum({
            filePath: url,
            success: () => {
              uni.showToast({ title: '保存成功', icon: 'success' })
            },
            fail: () => {
              uni.showToast({ title: '保存失败', icon: 'none' })
            }
          })
        }
      }
    }
  })
}
</script>

<template>
  <page title="AI 内容生成" rButton="生成" :rButtonDisabled="isGenerating" @rButton="generateImage">
    <view class="content">
      <!-- 提示词输入 -->
      <view class="input-section">
        <view class="input-header">
          <text class="input-label">描述你想要的内容</text>
          <text class="input-count">{{ prompt.length }}/500</text>
        </view>
        <u-textarea
          v-model="prompt"
          placeholder="例如：一只可爱的橘猫坐在窗台上晒太阳，阳光透过窗户洒在猫身上..."
          maxlength="500"
          height="100"
          :disabled="isGenerating"
          :customStyle="{ background: '#f8f9fa', borderRadius: '8px' }"
        ></u-textarea>

        <!-- 预设提示词 -->
        <view class="preset-section">
          <text class="preset-label">快速灵感</text>
          <scroll-view scroll-x class="preset-scroll">
            <view class="preset-list">
              <view
                v-for="(item, index) in presetPrompts"
                :key="index"
                class="preset-item"
                @click="usePreset(item)"
              >
                <text>{{ item }}</text>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>

      <!-- 风格选择 -->
      <view class="style-section">
        <text class="section-title">选择风格</text>
        <view class="style-grid">
          <view
            v-for="style in styleOptions"
            :key="style.value"
            class="style-card"
            :class="{ active: selectedStyle === style.value }"
            @click="selectStyle(style)"
          >
            <u-icon :name="style.icon" size="24" :color="selectedStyle === style.value ? '#487AFA' : '#666'"></u-icon>
            <text class="style-name">{{ style.label }}</text>
            <text class="style-desc">{{ style.desc }}</text>
          </view>
        </view>
      </view>

      <!-- 负面提示词 -->
      <view class="negative-section">
        <text class="section-title">排除内容 <text class="optional">(可选)</text></text>
        <u-input
          v-model="negativePrompt"
          placeholder="不希望出现的元素，如：模糊、变形、低质量"
          :disabled="isGenerating"
          :customStyle="{ background: '#f8f9fa', padding: '10px', borderRadius: '8px' }"
        ></u-input>
      </view>

      <!-- 生成进度 -->
      <view v-if="isGenerating" class="progress-section">
        <view class="progress-info">
          <text class="progress-text">正在生成中...</text>
          <text class="progress-percent">{{ Math.round(generationProgress) }}%</text>
        </view>
        <u-line-progress :percentage="generationProgress" activeColor="#487AFA" height="8"></u-line-progress>
        <text class="progress-tip">AI 正在根据您的描述创作图片，请稍候</text>
      </view>

      <!-- 生成结果 -->
      <view v-if="generatedImages.length > 0" class="result-section">
        <text class="section-title">生成结果</text>
        <view class="result-grid">
          <view
            v-for="img in generatedImages"
            :key="img.id"
            class="result-item"
            @click="previewImage(img.url)"
          >
            <u-image
              v-if="img.url"
              :src="img.url"
              mode="aspectFill"
              width="100%"
              height="200px"
              radius="8"
            ></u-image>
            <view v-else class="result-placeholder">
              <u-icon name="image" size="40" color="#ccc"></u-icon>
              <text>功能开发中</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 使用说明 -->
      <view class="tips-section">
        <text class="section-title">使用技巧</text>
        <view class="tips-list">
          <view class="tip-item">
            <text class="tip-num">1</text>
            <text class="tip-text">描述越详细，生成效果越好</text>
          </view>
          <view class="tip-item">
            <text class="tip-num">2</text>
            <text class="tip-text">可以指定风格、光线、构图等</text>
          </view>
          <view class="tip-item">
            <text class="tip-num">3</text>
            <text class="tip-text">使用负面提示词排除不想要的元素</text>
          </view>
        </view>
      </view>
    </view>
  </page>
</template>

<style scoped lang="less">
.content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: #f0f2f5;
  height: 100%;
  overflow-y: auto;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  display: block;

  .optional {
    font-weight: 400;
    font-size: 12px;
    color: #999;
  }
}

.input-section {
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  .input-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    .input-label {
      font-size: 15px;
      font-weight: 600;
      color: #333;
    }

    .input-count {
      font-size: 12px;
      color: #999;
    }
  }

  .preset-section {
    margin-top: 12px;

    .preset-label {
      font-size: 13px;
      color: #666;
      margin-bottom: 8px;
      display: block;
    }

    .preset-scroll {
      white-space: nowrap;

      .preset-list {
        display: inline-flex;
        gap: 8px;

        .preset-item {
          padding: 6px 12px;
          background: #f5f7fa;
          border-radius: 16px;
          border: 1px solid #e8e8e8;

          text {
            font-size: 12px;
            color: #666;
          }

          &:active {
            background: #e8f0fe;
            border-color: #487AFA;

            text {
              color: #487AFA;
            }
          }
        }
      }
    }
  }
}

.style-section {
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  .style-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;

    .style-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 14px 8px;
      background: #f8f9fa;
      border-radius: 10px;
      border: 2px solid transparent;
      transition: all 0.2s;

      .style-name {
        font-size: 13px;
        font-weight: 600;
        color: #333;
      }

      .style-desc {
        font-size: 10px;
        color: #999;
      }

      &.active {
        background: #e8f0fe;
        border-color: #487AFA;

        .style-name {
          color: #487AFA;
        }
      }

      &:active {
        transform: scale(0.98);
      }
    }
  }
}

.negative-section {
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.progress-section {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  .progress-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    .progress-text {
      font-size: 14px;
      color: #333;
    }

    .progress-percent {
      font-size: 14px;
      font-weight: 600;
      color: #487AFA;
    }
  }

  .progress-tip {
    font-size: 12px;
    color: #999;
    margin-top: 8px;
    display: block;
  }
}

.result-section {
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  .result-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;

    .result-item {
      border-radius: 8px;
      overflow: hidden;
      background: #f8f9fa;

      .result-placeholder {
        height: 200px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;

        text {
          font-size: 12px;
          color: #999;
        }
      }
    }
  }
}

.tips-section {
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  .tips-list {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .tip-item {
      display: flex;
      align-items: center;
      gap: 10px;

      .tip-num {
        width: 24px;
        height: 24px;
        background: #487AFA;
        color: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 600;
        flex-shrink: 0;
      }

      .tip-text {
        font-size: 13px;
        color: #666;
      }
    }
  }
}
</style>
