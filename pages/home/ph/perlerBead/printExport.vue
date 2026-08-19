<script setup>
import { ref, watch, nextTick } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { drawPatternWithBranding, calculateDrawSize, calculateExportSize, cropGrid } from './utils/exportUtils'
import { getColorKey } from './utils/colorData'

// ===== 图纸数据 =====
const patternGrid = ref(null)
const brand = ref('MARD')
const colorPalette = ref([])
const totalBeadCount = ref(0)

// ===== 设置 =====
const showGrid = ref(true)
const showCode = ref(true)
const showCoordinates = ref(true)
const gridInterval = ref(10)
const showColorStats = ref(true)

const gridIntervalOptions = ['5', '10', '15', '20']
const gridIntervalIndex = ref(1)

// ===== Canvas =====
const previewW = ref(300)
const previewH = ref(300)
const previewScale = ref(1)
const containerW = ref(350)
const isExporting = ref(false)
const exportCanvasW = ref(1200)
const exportCanvasH = ref(2000)

// ===== 裁切 =====
function getGridData() {
  if (!patternGrid.value) return null
  const { grid: rawGrid, N: rawN, M: rawM } = patternGrid.value
  const cropped = cropGrid(rawGrid, rawN, rawM)
  return { grid: cropped.grid, N: cropped.N, M: cropped.M }
}

// ===== 预览 =====
function drawPreview() {
  const data = getGridData()
  if (!data) return
  const { grid, N, M } = data
  const ctx = uni.createCanvasContext('previewCanvas')
  const opts = {
    showGrid: showGrid.value,
    showCode: showCode.value,
    gridInterval: gridInterval.value,
    showCoordinates: showCoordinates.value,
    brand: brand.value,
    dpr: 1,
    colorCount: colorPalette.value.length,
    totalBeads: totalBeadCount.value
  }
  const { cellSize, width, height } = calculateDrawSize(N, M, opts)
  previewW.value = width
  previewH.value = height
  const maxW = containerW.value - 48
  previewScale.value = width > maxW ? maxW / width : 1

  const userInfo = uni.getStorageSync('userInfo') || {}
  drawPatternWithBranding(ctx, grid, N, M, cellSize, opts, { userName: userInfo.userNickname || '' }, () => {})
}

watch([showGrid, showCode, showCoordinates, gridInterval], () => nextTick(() => drawPreview()))

// ===== 权限 =====
function ensureAlbumPermission() {
  return new Promise((resolve) => {
    uni.authorize({
      scope: 'scope.writePhotosAlbum',
      success: () => resolve(true),
      fail: () => {
        uni.showModal({
          title: '需要相册权限',
          content: '保存图片需要访问您的相册，请在设置中开启',
          confirmText: '去设置',
          success: (res) => {
            if (res.confirm) {
              uni.openSetting({ success: (s) => resolve(!!s.authSetting['scope.writePhotosAlbum']) })
            } else { resolve(false) }
          }
        })
      }
    })
  })
}

function saveToAlbum(tempFilePath) {
  uni.saveImageToPhotosAlbum({
    filePath: tempFilePath,
    success: () => uni.showToast({ title: '已保存到相册', icon: 'success' }),
    fail: (err) => { console.error('保存失败', err); uni.showToast({ title: '保存失败', icon: 'none' }) }
  })
}

// ===== 导出 =====
async function handleExport() {
  const data = getGridData()
  if (!data || isExporting.value) return
  isExporting.value = true

  try {
    const { grid, N, M } = data
    const opts = {
      showGrid: showGrid.value,
      showCode: showCode.value,
      gridInterval: gridInterval.value,
      showCoordinates: showCoordinates.value,
      brand: brand.value,
      dpr: 1,
      targetCell: 30,
      colorCount: colorPalette.value.length,
      totalBeads: totalBeadCount.value
    }
    const exportSize = calculateExportSize(N, M, opts)
    exportCanvasW.value = exportSize.width
    exportCanvasH.value = exportSize.height + 300 // 预留底部信息栏空间

    await nextTick()
    setTimeout(async () => {
      const ctx = uni.createCanvasContext('exportCanvas')
      const userInfo = uni.getStorageSync('userInfo') || {}
      drawPatternWithBranding(ctx, grid, N, M, exportSize.cellSize, opts, { userName: userInfo.userNickname || '' }, (result) => {
        setTimeout(async () => {
          try {
            const { tempFilePath } = await uni.canvasToTempFilePath({
              canvasId: 'exportCanvas', fileType: 'png', quality: 1,
              x: 0, y: 0, width: result.width, height: result.height
            })
            const ok = await ensureAlbumPermission()
            if (ok) saveToAlbum(tempFilePath)
          } catch (err) {
            console.error('导出失败:', err)
            uni.showToast({ title: '导出失败', icon: 'none' })
          } finally {
            isExporting.value = false
          }
        }, 300)
      })
    }, 100)
  } catch (err) {
    console.error('导出失败:', err)
    uni.showToast({ title: '导出失败', icon: 'none' })
    isExporting.value = false
  }
}

function goBack() { uni.navigateBack() }

onLoad(() => {
  containerW.value = uni.getSystemInfoSync().windowWidth || 375
  const data = uni.getStorageSync('exportPatternData')
  if (!data) {
    uni.showToast({ title: '无图纸数据', icon: 'none' })
    setTimeout(() => uni.navigateBack(), 1500)
    return
  }
  patternGrid.value = { grid: data.grid, N: data.N, M: data.M }
  brand.value = data.brand || 'MARD'
  colorPalette.value = data.colorPalette || []
  totalBeadCount.value = data.totalBeadCount || 0
  nextTick(() => drawPreview())
})
</script>

<template>
  <view class="export-page">
    <view class="navbar">
      <view class="navbar-content">
        <view class="navbar-back" @click="goBack">
          <text class="iconfont icon-jiantouzuo" style="font-size:18px;color:#333"></text>
        </view>
        <text class="navbar-title">打印导出</text>
        <view style="width:36px"></view>
      </view>
    </view>

    <scroll-view scroll-y class="export-scroll">
      <!-- 预览 -->
      <view class="preview-section">
        <view class="preview-wrapper" :style="{ width: (previewW * previewScale + 24) + 'px' }">
          <view :style="{ width: previewW * previewScale + 'px', height: previewH * previewScale + 'px', overflow: 'hidden' }">
            <canvas canvas-id="previewCanvas" class="preview-canvas"
              :style="{ width: previewW + 'px', height: previewH + 'px', transform: `scale(${previewScale})`, transformOrigin: 'top left' }" />
          </view>
        </view>
      </view>

      <!-- 显示选项 -->
      <view class="setting-section">
        <text class="section-title">显示选项</text>
        <view class="setting-list">
          <view class="setting-item">
            <text class="setting-label">网格线</text>
            <switch :checked="showGrid" @change="showGrid = $event.detail.value" color="#487AFA" />
          </view>
          <view class="setting-item">
            <text class="setting-label">色号</text>
            <switch :checked="showCode" @change="showCode = $event.detail.value" color="#487AFA" />
          </view>
          <view class="setting-item">
            <text class="setting-label">坐标轴</text>
            <switch :checked="showCoordinates" @change="showCoordinates = $event.detail.value" color="#487AFA" />
          </view>
          <view class="setting-item">
            <text class="setting-label">网格间隔</text>
            <picker :value="gridIntervalIndex" :range="gridIntervalOptions" @change="gridIntervalIndex = $event.detail.value; gridInterval = Number(gridIntervalOptions[$event.detail.value])">
              <view class="picker-value">
                <text>{{ gridInterval }}</text>
                <text class="iconfont icon-jiantouyou" style="font-size:12px;color:#ccc;margin-left:4px"></text>
              </view>
            </picker>
          </view>
        </view>
      </view>

      <!-- 其他选项 -->
      <view class="setting-section">
        <text class="section-title">其他选项</text>
        <view class="setting-list">
          <view class="setting-item">
            <view class="label-group">
              <text class="setting-label">颜色统计</text>
              <text class="setting-desc">底部显示颜色图例和用量</text>
            </view>
            <switch :checked="showColorStats" @change="showColorStats = $event.detail.value" color="#487AFA" />
          </view>
        </view>
      </view>

      <view style="height: 100px;"></view>
    </scroll-view>

    <view class="bottom-bar">
      <view class="export-btn" :class="{ disabled: isExporting }" @click="handleExport">
        <text>{{ isExporting ? '导出中...' : '保存到相册' }}</text>
      </view>
    </view>

    <canvas canvas-id="exportCanvas" class="hidden-canvas"
      :style="{ width: exportCanvasW + 'px', height: exportCanvasH + 'px' }" />
  </view>
</template>

<style scoped lang="less">
.export-page { min-height: 100vh; background: #f5f7fa; display: flex; flex-direction: column; }
.navbar { background: #fff; padding-top: 44px; border-bottom: 1px solid #f0f0f0;
  .navbar-content { display: flex; align-items: center; justify-content: space-between; padding: 0 16px; height: 44px;
    .navbar-back { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; }
    .navbar-title { font-size: 17px; font-weight: 600; color: #333; }
  }
}
.export-scroll { flex: 1; }
.preview-section { padding: 16px;
  .preview-wrapper { background: #fff; border-radius: 12px; padding: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); overflow: hidden; margin: 0 auto;
    .preview-canvas { display: block; }
  }
}
.setting-section { margin: 0 16px 16px;
  .section-title { font-size: 14px; font-weight: 600; color: #333; margin-bottom: 10px; display: block; }
}
.setting-list { background: #fff; border-radius: 12px; overflow: hidden;
  .setting-item { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid #f5f5f5;
    &:last-child { border-bottom: none; }
    .label-group { display: flex; flex-direction: column; gap: 2px;
      .setting-label { font-size: 14px; color: #333; }
      .setting-desc { font-size: 11px; color: #999; }
    }
    .setting-label { font-size: 14px; color: #333; }
    .picker-value { display: flex; align-items: center; font-size: 14px; color: #666; }
  }
}
.bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; padding: 12px 16px; padding-bottom: calc(12px + env(safe-area-inset-bottom)); background: #fff; box-shadow: 0 -2px 12px rgba(0,0,0,0.06);
  .export-btn { height: 46px; background: #487AFA; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 600; color: #fff;
    &.disabled { opacity: 0.5; }
    &:active { opacity: 0.85; }
  }
}
.hidden-canvas { position: fixed; top: -9999px; left: -9999px; pointer-events: none; }
</style>
