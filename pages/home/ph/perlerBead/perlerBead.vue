<script setup>
import { ref, computed, nextTick, watch } from 'vue'
import page from '@/components/pages/page.vue'
import { useImageHandler } from '../addWatermark/hooks/useImageHandler'
import { buildPalette, getColorKey, sortColorsByHue, COLOR_SYSTEM_OPTIONS } from './utils/colorData'
import { calculatePixelGrid, mergeSimilarColors, calculateColorStats } from './utils/pixelation'

const { imageInfo, isProcessing, handleImageSelect } = useImageHandler()

// ===== 配置参数 =====
const gridSize = ref(32)
const selectedBrand = ref('MARD')
const pixelationMode = ref('dominant')
const noiseThreshold = ref(8)
const gridInterval = ref(10)

// ===== Board Coordinate System =====
const imgNaturalW = ref(0)
const imgNaturalH = ref(0)
const imgOffsetBoard = ref({ x: 0, y: 0 })
const imgScaleBoard = ref(1)
const boardW = ref(0)
const boardH = ref(0)
let previewTouch = { type: null, startX: 0, startY: 0, startOffsetX: 0, startOffsetY: 0, moved: false, startDist: 0, startScale: 1, focalX: 0, focalY: 0 }

// ===== 生成状态 =====
const isGenerating = ref(false)

// ===== 板子布局 =====
const boardM = computed(() => {
  if (!imgNaturalW.value || !imgNaturalH.value) return gridSize.value
  return Math.max(1, Math.round(gridSize.value * (imgNaturalH.value / imgNaturalW.value)))
})
const boardComputedH = computed(() => {
  if (!boardW.value || !boardM.value || !gridSize.value) return 0
  return Math.round(Math.round(boardW.value) * boardM.value / gridSize.value)
})
const boardWRound = computed(() => Math.round(boardW.value))
const previewScale = computed(() => {
  const N = gridSize.value
  if (!N || !boardWRound.value) return 1
  return boardWRound.value / N
})
const imgDisplayW = computed(() => imgNaturalW.value * imgScaleBoard.value * previewScale.value)
const imgDisplayH = computed(() => imgNaturalH.value * imgScaleBoard.value * previewScale.value)
const imgScreenX = computed(() => imgOffsetBoard.value.x * previewScale.value)
const imgScreenY = computed(() => imgOffsetBoard.value.y * previewScale.value)

function fitImageToBoard() {
  const N = gridSize.value
  const M = boardM.value
  if (!N || !M || !imgNaturalW.value || !imgNaturalH.value) return
  const scaleX = N / imgNaturalW.value
  const scaleY = M / imgNaturalH.value
  imgScaleBoard.value = Math.min(scaleX, scaleY)
  const imgW = imgNaturalW.value * imgScaleBoard.value
  const imgH = imgNaturalH.value * imgScaleBoard.value
  imgOffsetBoard.value = { x: (N - imgW) / 2, y: (M - imgH) / 2 }
  boardH.value = boardComputedH.value
  drawBoardGrid()
}

function drawBoardGrid() {
  const N = gridSize.value
  const M = boardM.value
  const rawW = boardW.value
  const rawH = boardComputedH.value
  if (!rawW || !rawH || !N || !M) return
  const canvasId = 'boardGridCanvas'
  const ctx = uni.createCanvasContext(canvasId)
  const interval = gridInterval.value
  const w = Math.round(rawW)
  const h = Math.round(rawH)
  const fontSize = Math.max(8, Math.min(12, Math.floor(w / N * 0.8)))

  // 每个格子的精确像素边界（整数），最后一格自动吃掉余数
  const xBoundaries = [0]
  for (let col = 1; col <= N; col++) xBoundaries.push(Math.round(col * w / N))
  const yBoundaries = [0]
  for (let row = 1; row <= M; row++) yBoundaries.push(Math.round(row * h / M))

  // 检查 canvas 实际尺寸
  const query = uni.createSelectorQuery()
  query.select('.board-grid-canvas').boundingClientRect((rect) => {
    console.log('canvas CSS rect:', rect ? { w: rect.width, h: rect.height } : 'null')
  }).exec()
  // 检查 canvas node 尺寸（bitmap）
  const query2 = uni.createSelectorQuery()
  query2.select('.board-grid-canvas').fields({ size: true }, (res) => {
    console.log('canvas node size:', res)
  }).exec()

  ctx.clearRect(0, 0, w, h)

  // 普通网格线
  ctx.setStrokeStyle('rgba(0,0,0,0.15)')
  ctx.setLineWidth(0.5)
  for (let col = 1; col < N; col++) {
    ctx.beginPath(); ctx.moveTo(xBoundaries[col], 0); ctx.lineTo(xBoundaries[col], h); ctx.stroke()
  }
  for (let row = 1; row < M; row++) {
    ctx.beginPath(); ctx.moveTo(0, yBoundaries[row]); ctx.lineTo(w, yBoundaries[row]); ctx.stroke()
  }

  // 加粗间隔线
  ctx.setStrokeStyle('rgba(0,0,0,0.4)')
  ctx.setLineWidth(1.5)
  for (let col = interval; col < N; col += interval) {
    ctx.beginPath(); ctx.moveTo(xBoundaries[col], 0); ctx.lineTo(xBoundaries[col], h); ctx.stroke()
  }
  for (let row = interval; row < M; row += interval) {
    ctx.beginPath(); ctx.moveTo(0, yBoundaries[row]); ctx.lineTo(w, yBoundaries[row]); ctx.stroke()
  }

  // 边框
  ctx.setStrokeStyle('rgba(0,0,0,0.5)')
  ctx.setLineWidth(2)
  ctx.strokeRect(0, 0, w, h)

  // 坐标标注
  ctx.setFillStyle('#666666')
  ctx.setFontSize(fontSize)
  ctx.setTextAlign('center')
  ctx.setTextBaseline('bottom')
  const colMarks = new Set([0, N - 1])
  for (let c = interval; c < N; c += interval) colMarks.add(c)
  for (const c of colMarks) {
    const cx = (xBoundaries[c] + xBoundaries[c + 1]) / 2
    ctx.fillText(String(c + 1), cx, h - 2)
  }
  ctx.setTextAlign('right')
  ctx.setTextBaseline('middle')
  const rowMarks = new Set([0, M - 1])
  for (let r = interval; r < M; r += interval) rowMarks.add(r)
  for (const r of rowMarks) {
    const cy = (yBoundaries[r] + yBoundaries[r + 1]) / 2
    ctx.fillText(String(r + 1), w - 4, cy)
  }

  ctx.draw()
}

function boardZoomIn() { imgScaleBoard.value = Math.min(5, imgScaleBoard.value * 1.25) }
function boardZoomOut() { imgScaleBoard.value = Math.max(0.2, imgScaleBoard.value / 1.25) }

// ===== 板子触摸 =====
function getTouchXY(e, idx) {
  const t = e.touches[idx]
  return { x: t.x !== undefined ? t.x : t.clientX, y: t.y !== undefined ? t.y : t.clientY }
}

function onBoardTouchStart(e) {
  const ps = previewScale.value || 1
  if (e.touches.length >= 2) {
    const t0 = getTouchXY(e, 0), t1 = getTouchXY(e, 1)
    previewTouch.type = 'pinch'
    previewTouch.startDist = Math.sqrt((t0.x - t1.x) ** 2 + (t0.y - t1.y) ** 2)
    previewTouch.startScale = imgScaleBoard.value
    previewTouch.startOffsetX = imgOffsetBoard.value.x
    previewTouch.startOffsetY = imgOffsetBoard.value.y
    previewTouch.focalX = ((t0.x + t1.x) / 2) / ps
    previewTouch.focalY = ((t0.y + t1.y) / 2) / ps
    previewTouch.moved = false
  } else if (e.touches.length === 1) {
    const t = getTouchXY(e, 0)
    previewTouch.type = 'pan'
    previewTouch.startX = t.x
    previewTouch.startY = t.y
    previewTouch.startOffsetX = imgOffsetBoard.value.x
    previewTouch.startOffsetY = imgOffsetBoard.value.y
    previewTouch.moved = false
  }
}

function onBoardTouchMove(e) {
  const ps = previewScale.value || 1
  if (e.touches.length >= 2) {
    if (previewTouch.type !== 'pinch') {
      const t0 = getTouchXY(e, 0), t1 = getTouchXY(e, 1)
      previewTouch.type = 'pinch'
      previewTouch.startDist = Math.sqrt((t0.x - t1.x) ** 2 + (t0.y - t1.y) ** 2)
      previewTouch.startScale = imgScaleBoard.value
      previewTouch.startOffsetX = imgOffsetBoard.value.x
      previewTouch.startOffsetY = imgOffsetBoard.value.y
      previewTouch.focalX = ((t0.x + t1.x) / 2) / ps
      previewTouch.focalY = ((t0.y + t1.y) / 2) / ps
      previewTouch.moved = true
    }
    const t0 = getTouchXY(e, 0), t1 = getTouchXY(e, 1)
    const dist = Math.sqrt((t0.x - t1.x) ** 2 + (t0.y - t1.y) ** 2)
    const newScale = Math.max(0.2, Math.min(5, previewTouch.startScale * (dist / previewTouch.startDist)))
    const ratio = newScale / previewTouch.startScale
    imgOffsetBoard.value = {
      x: previewTouch.focalX - (previewTouch.focalX - previewTouch.startOffsetX) * ratio,
      y: previewTouch.focalY - (previewTouch.focalY - previewTouch.startOffsetY) * ratio
    }
    imgScaleBoard.value = newScale
    previewTouch.moved = true
  } else if (previewTouch.type === 'pan' && e.touches.length === 1) {
    const t = getTouchXY(e, 0)
    const dx = (t.x - previewTouch.startX) / ps
    const dy = (t.y - previewTouch.startY) / ps
    if (previewTouch.moved || Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
      imgOffsetBoard.value = {
        x: previewTouch.startOffsetX + dx,
        y: previewTouch.startOffsetY + dy
      }
      previewTouch.moved = true
    }
  }
}

function onBoardTouchEnd() { previewTouch.type = null }

// ===== 当前色板 =====
const currentPalette = computed(() => buildPalette(selectedBrand.value))

// ===== 选项 =====
const gridSizeOptions = [
  { label: '16', value: 16 }, { label: '29', value: 29 }, { label: '32', value: 32 },
  { label: '48', value: 48 }, { label: '58', value: 58 }, { label: '64', value: 64 },
  { label: '80', value: 80 }, { label: '100', value: 100 }, { label: '104', value: 104 },
  { label: '自定义', value: 'custom' }
]
const showCustomGridSize = ref(false)
const customGridSizeInput = ref('')

function onGridSizeSelect(item) {
  if (item.value === 'custom') { customGridSizeInput.value = String(gridSize.value); showCustomGridSize.value = true }
  else gridSize.value = item.value
}
function confirmCustomGridSize() {
  const val = parseInt(customGridSizeInput.value)
  if (!val || val < 4 || val > 200) { uni.showToast({ title: '请输入4-200之间的数字', icon: 'none' }); return }
  gridSize.value = val
  showCustomGridSize.value = false
}
const isCustomGridSize = computed(() => !gridSizeOptions.some(o => o.value === gridSize.value))

watch(gridSize, () => {
  if (imageInfo.value?.path && boardW.value) nextTick(() => fitImageToBoard())
})
watch(gridInterval, () => {
  if (boardW.value && boardH.value) drawBoardGrid()
})
const gridIntervalOptions = [5, 10, 15, 20]

// ===== 选择图片 =====
const onImageSelect = async () => {
  if (isProcessing.value) return
  const image = await handleImageSelect()
  if (image) {
    uni.getImageInfo({
      src: imageInfo.value.path,
      success: (info) => {
        imgNaturalW.value = info.width
        imgNaturalH.value = info.height
        nextTick(() => {
          const query = uni.createSelectorQuery()
          query.select('.board').boundingClientRect((rect) => {
            if (rect) boardW.value = rect.width
            fitImageToBoard()
          }).exec()
        })
      }
    })
  }
}

// ===== 生成拼豆图纸 =====
const generatePattern = async () => {
  if (!imageInfo.value?.path) {
    uni.showToast({ title: '请先选择图片', icon: 'none' })
    return
  }
  isGenerating.value = true
  try {
    const canvasId = 'perlerBeadSource'
    const ctx = uni.createCanvasContext(canvasId)
    const N = gridSize.value
    const M = boardM.value
    const off = imgOffsetBoard.value
    const scale = imgScaleBoard.value || 1
    const maxCanvas = 500
    const canvasW = Math.min(maxCanvas, N)
    const canvasH = Math.min(maxCanvas, M)
    const canvasScale = canvasW / N

    ctx.clearRect(0, 0, canvasW, canvasH)
    ctx.setFillStyle('#FFFFFF')
    ctx.fillRect(0, 0, canvasW, canvasH)
    ctx.save()
    ctx.scale(canvasScale, canvasScale)
    ctx.translate(off.x, off.y)
    ctx.scale(scale, scale)
    ctx.drawImage(imageInfo.value.path, 0, 0)
    ctx.restore()

    ctx.draw(false, () => {
      // 第一步：等 canvas 渲染完成，获取像素数据
      setTimeout(async () => {
        try {
          const imageData = await new Promise((resolve, reject) => {
            uni.canvasGetImageData({ canvasId, x: 0, y: 0, width: canvasW, height: canvasH, success: resolve, fail: reject })
          })
          // 第二步：让出主线程，让 loading 动画渲染
          setTimeout(() => {
            try {
              const palette = currentPalette.value
              let grid = calculatePixelGrid(imageData, canvasW, canvasH, N, M, palette, pixelationMode.value)
              grid = mergeSimilarColors(grid, N, M, noiseThreshold.value)
              const stats = calculateColorStats(grid)

              const patternData = {
                grid, N, M,
                colorCounts: stats.colorCounts,
                totalBeadCount: stats.totalCount,
                colorPalette: sortColorsByHue(Object.values(stats.colorCounts).map(item => item.color)),
                selectedBrand: selectedBrand.value,
                imageInfo: { path: imageInfo.value.path }
              }
              const app = getApp()
              app.globalData = app.globalData || {}
              app.globalData.patternData = patternData
              try { uni.setStorageSync('lastPatternData', patternData) } catch (e) {}
              uni.navigateTo({ url: '/pages/home/ph/perlerBead/patternEditor' })
              uni.showToast({ title: '生成成功', icon: 'success' })
            } catch (err) {
              console.error('像素化处理失败:', err)
              uni.showToast({ title: '生成失败', icon: 'none' })
            } finally {
              isGenerating.value = false
            }
          }, 50)
        } catch (err) {
          console.error('获取像素数据失败:', err)
          uni.showToast({ title: '生成失败', icon: 'none' })
          isGenerating.value = false
        }
      }, 300)
    })
  } catch (err) {
    console.error('生成失败:', err)
    uni.showToast({ title: '生成失败', icon: 'none' })
    isGenerating.value = false
  }
}
</script>

<template>
  <page title="拼豆图纸生成" rButton="生成图纸" :rButtonDisabled="isProcessing || isGenerating" @rButton="generatePattern">
    <view class="content">
      <!-- 选图区域 / 板子 -->
      <view class="preview-wrapper">
        <view v-if="!imageInfo?.path" class="empty-state" @click="onImageSelect">
          <view class="empty-icon">
            <text class="iconfont icon-tianjia" style="font-size:32px;color:#c0c4cc"></text>
          </view>
          <text class="empty-title">选择图片</text>
          <text class="empty-desc">从相册选取照片生成拼豆图纸</text>
        </view>
        <view v-else class="board-container">
          <view class="board" :style="{ height: boardH + 'px' }" @touchstart="onBoardTouchStart" @touchmove="onBoardTouchMove" @touchend="onBoardTouchEnd">
            <image :src="imageInfo.path" class="board-image" mode="widthFix" :style="{ width: imgDisplayW + 'px', height: imgDisplayH + 'px', left: imgScreenX + 'px', top: imgScreenY + 'px' }" />
            <canvas canvas-id="boardGridCanvas" class="board-grid-canvas" :canvas-id="'boardGridCanvas'" :style="{ width: Math.round(boardW) + 'px', height: boardH + 'px' }" />
            <view class="board-replace" @click="onImageSelect">
              <text class="iconfont icon-shuaxin" style="font-size:14px;color:#fff"></text>
              <text>更换</text>
            </view>
          </view>
          <view class="board-controls">
            <view class="board-ctrl-btn" @click="boardZoomOut"><text class="iconfont icon-jianshao" style="font-size:16px;color:#333"></text></view>
            <view class="board-ctrl-btn" @click="fitImageToBoard"><text class="iconfont icon-quanping" style="font-size:16px;color:#333"></text></view>
            <view class="board-ctrl-btn" @click="boardZoomIn"><text class="iconfont icon-tianjia" style="font-size:16px;color:#333"></text></view>
            <text class="board-info">{{ gridSize }}×{{ boardM }} 格</text>
          </view>
        </view>
      </view>

      <!-- 配置面板 -->
      <view class="config-panel">
        <view class="config-item">
          <text class="config-label">网格大小</text>
          <view class="config-options">
            <view v-for="item in gridSizeOptions" :key="item.value" class="option-btn" :class="{ active: item.value === 'custom' ? isCustomGridSize : gridSize === item.value }" @click="onGridSizeSelect(item)">
              <text>{{ item.value === 'custom' && isCustomGridSize ? gridSize : item.label }}</text>
            </view>
          </view>
        </view>
        <view class="config-item">
          <text class="config-label">品牌色板</text>
          <view class="config-options">
            <view v-for="item in COLOR_SYSTEM_OPTIONS" :key="item.key" class="option-btn" :class="{ active: selectedBrand === item.key }" @click="selectedBrand = item.key">
              <text>{{ item.name }}</text>
            </view>
          </view>
        </view>
        <view class="config-item">
          <text class="config-label">像素化模式</text>
          <view class="config-options">
            <view class="option-btn" :class="{ active: pixelationMode === 'dominant' }" @click="pixelationMode = 'dominant'"><text>主导色</text></view>
            <view class="option-btn" :class="{ active: pixelationMode === 'average' }" @click="pixelationMode = 'average'"><text>平均色</text></view>
          </view>
        </view>
        <view class="config-item">
          <view class="config-label-row">
            <text class="config-label">杂色清理</text>
            <text class="config-value">{{ noiseThreshold }}</text>
          </view>
          <slider :value="noiseThreshold" :min="0" :max="30" :step="1" activeColor="#487AFA" @change="e => noiseThreshold = e.detail.value" />
        </view>
        <view class="config-item">
          <text class="config-label">分割线间隔</text>
          <view class="config-options">
            <view v-for="val in gridIntervalOptions" :key="val" class="option-btn small" :class="{ active: gridInterval === val }" @click="gridInterval = val">
              <text>{{ val }}格</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 自定义网格大小弹窗 -->
    <view v-if="showCustomGridSize" class="popup-mask" @click="showCustomGridSize = false">
      <view class="popup-panel custom-grid-popup" @click.stop>
        <view class="popup-header">
          <text class="popup-title">自定义网格大小</text>
          <view @click="showCustomGridSize = false"><text class="iconfont icon-guanbi" style="font-size:20px;color:#999"></text></view>
        </view>
        <view class="custom-grid-body">
          <text class="custom-grid-hint">输入横向格子数（4-200），纵向自动按比例计算</text>
          <input type="number" v-model="customGridSizeInput" class="custom-grid-input" placeholder="请输入格子数" @confirm="confirmCustomGridSize" />
          <view class="custom-grid-btn" @click="confirmCustomGridSize"><text>确定</text></view>
        </view>
      </view>
    </view>

    <!-- 隐藏 canvas -->
    <canvas canvas-id="perlerBeadSource" class="hidden-canvas" />
  </page>
</template>

<style scoped lang="less">
.content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  background: #f0f2f5;
  height: 100%;
  overflow-y: auto;
}
.preview-wrapper {
  width: 100%;
  background: #ffffff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  flex-shrink: 0;
  position: relative;

  .empty-state {
    width: 100%;
    height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    cursor: pointer;
    .empty-icon { width: 64px; height: 64px; border-radius: 16px; background: #f5f7fa; border: 2px dashed #dcdfe6; display: flex; align-items: center; justify-content: center; }
    .empty-title { font-size: 15px; font-weight: 600; color: #333; }
    .empty-desc { font-size: 12px; color: #999; }
  }

  .board-container {
    padding: 10px;
    padding-bottom: 4px;
    .board {
      width: 100%;
      position: relative;
      overflow: hidden;
      background: #f5f7fa;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      touch-action: none;
      .board-image { position: absolute; touch-action: none; }
      .board-grid-canvas { position: absolute; top: 0; left: 0; pointer-events: none; z-index: 1; }
      .board-replace {
        position: absolute; top: 6px; right: 6px; display: flex; align-items: center; gap: 4px; padding: 4px 10px; background: rgba(0,0,0,0.5); border-radius: 16px; z-index: 2; cursor: pointer;
        text { font-size: 11px; color: #fff; }
      }
    }
    .board-controls {
      display: flex; gap: 8px; align-items: center; justify-content: center; padding: 8px 0;
      .board-ctrl-btn { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: #f5f7fa; border-radius: 8px; border: 1px solid #e0e0e0; cursor: pointer; }
      .board-info { font-size: 12px; color: #999; margin-left: 4px; }
    }
  }
}
.config-panel {
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  .config-item {
    margin-bottom: 16px;
    &:last-child { margin-bottom: 0; }
    .config-label { font-size: 14px; font-weight: 600; color: #333; margin-bottom: 10px; display: block; }
    .config-label-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;
      .config-value { font-size: 13px; color: #487AFA; font-weight: 600; }
    }
    .config-options { display: flex; flex-wrap: wrap; gap: 8px;
      .option-btn {
        padding: 8px 14px; background: #f5f7fa; border-radius: 8px; border: 1px solid #e8e8e8; transition: all 0.2s;
        text { font-size: 13px; color: #666; }
        &.active { background: #487AFA; border-color: #487AFA; text { color: #fff; } }
        &.small { padding: 6px 12px; }
      }
    }
  }
}
.popup-mask {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.45); z-index: 100; display: flex; align-items: center; justify-content: center;
}
.popup-panel {
  width: 85%; max-height: 75%; background: #fff; border-radius: 16px; overflow: hidden; display: flex; flex-direction: column;
  .popup-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid #f0f0f0; flex-shrink: 0;
    .popup-title { font-size: 16px; font-weight: 600; color: #333; }
  }
}
.custom-grid-popup {
  width: 75%;
  .custom-grid-body {
    padding: 16px;
    .custom-grid-hint { font-size: 12px; color: #999; margin-bottom: 12px; display: block; }
    .custom-grid-input { width: 100%; height: 40px; border: 1px solid #dcdfe6; border-radius: 8px; padding: 0 12px; font-size: 14px; box-sizing: border-box; margin-bottom: 14px; }
    .custom-grid-btn { width: 100%; height: 40px; background: #487AFA; border-radius: 8px; display: flex; align-items: center; justify-content: center;
      text { font-size: 14px; color: #fff; font-weight: 600; }
    }
  }
}
.hidden-canvas {
  position: fixed; top: -9999px; left: -9999px; width: 1200px; height: 2000px; pointer-events: none; opacity: 0;
}
</style>
