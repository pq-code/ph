<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { drawPatternOnCanvas, calculateDrawSize } from '../ph/perlerBead/utils/exportUtils'
import { getColorKey, sortColorsByHue, COLOR_SYSTEM_OPTIONS, buildPalette } from '../ph/perlerBead/utils/colorData'
import { calculateColorStats } from '../ph/perlerBead/utils/pixelation'

// ===== 图案数据 =====
const pattern = ref(null)
const gridImage = ref('')
const gridImageW = ref(0)
const gridImageH = ref(0)
const selectedBrand = ref('MARD')

// ===== 缩放平移 =====
const gridZoom = ref(1)
const gridOffset = ref({ x: 0, y: 0 })
let gridTouch = { type: null, startX: 0, startY: 0, startOffsetX: 0, startOffsetY: 0, moved: false, startDist: 0, startZoom: 1, focalX: 0, focalY: 0 }
let containerRect = { width: 0, height: 0 }

// ===== Mock 数据 =====
function generateMockPattern(id) {
  const mockItems = [
    { id: 1, title: '可爱猫咪拼豆', author: '小明', likes: 128 },
    { id: 2, title: '星空拼豆图案', author: '小红', likes: 256 },
    { id: 3, title: '像素风景画', author: '小刚', likes: 89 },
    { id: 4, title: '卡通人物拼豆', author: '小美', likes: 312 },
    { id: 5, title: '花卉图案设计', author: '小李', likes: 167 },
    { id: 6, title: '动漫角色拼豆', author: '小王', likes: 198 },
    { id: 7, title: '海洋生物图案', author: '小张', likes: 145 },
    { id: 8, title: '节日主题拼豆', author: '小刘', likes: 223 },
    { id: 9, title: '几何图形设计', author: '小陈', likes: 178 },
    { id: 10, title: '复古像素艺术', author: '小赵', likes: 201 },
    { id: 11, title: '游戏角色拼豆', author: '小孙', likes: 267 },
    { id: 12, title: '自然风光图案', author: '小周', likes: 156 },
  ]
  const meta = mockItems.find(m => m.id === id) || mockItems[0]

  const palette = buildPalette('MARD')
  const N = 32, M = 32
  const grid = []
  const usedColors = palette.slice(0, 6)

  for (let r = 0; r < M; r++) {
    const row = []
    for (let c = 0; c < N; c++) {
      const cx = N / 2, cy = M / 2
      const dx = Math.abs(c - cx), dy = Math.abs(r - cy)
      const dist = Math.sqrt(dx * dx + dy * dy)
      const angle = Math.atan2(r - cy, c - cx)
      let idx
      if (dist < 5) idx = 0
      else if (dist < 10) idx = 1
      else if (dist < 14) idx = angle > 0 ? 2 : 3
      else if (dist < 18) idx = angle > 0.5 ? 4 : angle < -0.5 ? 5 : 0
      else idx = (r + c) % 6
      row.push(usedColors[idx])
    }
    grid.push(row)
  }

  const stats = calculateColorStats(grid)
  return {
    ...meta,
    N, M, grid,
    colorCounts: stats.colorCounts,
    totalBeadCount: stats.totalCount,
    colorPalette: sortColorsByHue(Object.values(stats.colorCounts).map(item => item.color))
  }
}

// ===== 渲染图案 =====
function renderPattern() {
  if (!pattern.value) return
  const { grid, N, M } = pattern.value
  const ctx = uni.createCanvasContext('detailCanvas')
  const dpr = 1
  const showCoordinates = true
  const axisW = showCoordinates ? 24 : 0
  const cellSize = Math.max(8, Math.min(20, Math.floor((800 - axisW * 2) / N)))
  const maxH = 1200
  const realCell = Math.round(cellSize * dpr)
  const w = Math.min(800, N * realCell + axisW * 2)
  const h = Math.min(maxH, M * realCell + axisW * 2)
  gridImageW.value = w
  gridImageH.value = h

  drawPatternOnCanvas(ctx, grid, N, M, cellSize, {
    showGrid: true,
    showCode: true,
    gridInterval: 10,
    showCoordinates,
    brand: selectedBrand.value,
    dpr
  }, () => {
    setTimeout(() => {
      uni.canvasToTempFilePath({
        canvasId: 'detailCanvas',
        x: 0, y: 0, width: w, height: h,
        destWidth: w, destHeight: h,
        success: (res) => {
          gridImage.value = res.tempFilePath
          nextTick(() => fitAll())
        },
        fail: (err) => { console.error('渲染失败:', err) }
      })
    }, 100)
  })
}

// ===== 缩放平移 =====
function fitAll() {
  if (!gridImageW.value || !gridImageH.value) return
  const availW = (containerRect.width || 375) - 20
  const availH = (containerRect.height || 500) - 20
  const zoom = Math.min(availW / gridImageW.value, availH / gridImageH.value)
  gridZoom.value = Math.max(0.3, Math.min(5, zoom))
  gridOffset.value = { x: 0, y: 0 }
}

function zoomIn() { zoomAtCenter(1.3) }
function zoomOut() { zoomAtCenter(1 / 1.3) }
function zoomAtCenter(factor) {
  const oldZoom = gridZoom.value
  const newZoom = Math.max(0.3, Math.min(5, oldZoom * factor))
  if (newZoom === oldZoom) return
  const ratio = newZoom / oldZoom
  gridOffset.value = { x: gridOffset.value.x * ratio, y: gridOffset.value.y * ratio }
  gridZoom.value = newZoom
}

function getTouchXY(e, idx) {
  const t = e.touches[idx]
  return { x: t.x !== undefined ? t.x : t.clientX, y: t.y !== undefined ? t.y : t.clientY }
}

function onTouchStart(e) {
  if (e.touches.length >= 2) {
    const t0 = getTouchXY(e, 0), t1 = getTouchXY(e, 1)
    gridTouch.type = 'pinch'
    gridTouch.startDist = Math.sqrt((t0.x - t1.x) ** 2 + (t0.y - t1.y) ** 2)
    gridTouch.startZoom = gridZoom.value
    gridTouch.startOffsetX = gridOffset.value.x
    gridTouch.startOffsetY = gridOffset.value.y
    gridTouch.focalX = (t0.x + t1.x) / 2
    gridTouch.focalY = (t0.y + t1.y) / 2
    gridTouch.moved = false
  } else if (e.touches.length === 1) {
    const t = getTouchXY(e, 0)
    gridTouch.type = 'pan'
    gridTouch.startX = t.x
    gridTouch.startY = t.y
    gridTouch.startOffsetX = gridOffset.value.x
    gridTouch.startOffsetY = gridOffset.value.y
    gridTouch.moved = false
  }
}

function onTouchMove(e) {
  if (e.touches.length >= 2) {
    if (gridTouch.type !== 'pinch') {
      const t0 = getTouchXY(e, 0), t1 = getTouchXY(e, 1)
      gridTouch.type = 'pinch'
      gridTouch.startDist = Math.sqrt((t0.x - t1.x) ** 2 + (t0.y - t1.y) ** 2)
      gridTouch.startZoom = gridZoom.value
      gridTouch.startOffsetX = gridOffset.value.x
      gridTouch.startOffsetY = gridOffset.value.y
      gridTouch.focalX = (t0.x + t1.x) / 2
      gridTouch.focalY = (t0.y + t1.y) / 2
      gridTouch.moved = true
    }
    const t0 = getTouchXY(e, 0), t1 = getTouchXY(e, 1)
    const dist = Math.sqrt((t0.x - t1.x) ** 2 + (t0.y - t1.y) ** 2)
    const newZoom = Math.max(0.3, Math.min(5, gridTouch.startZoom * (dist / gridTouch.startDist)))
    const containerCX = containerRect.width / 2
    const containerCY = containerRect.height / 2
    const focalDX = gridTouch.focalX - containerCX
    const focalDY = gridTouch.focalY - containerCY
    const ratio = newZoom / gridTouch.startZoom
    gridOffset.value = {
      x: focalDX - (focalDX - gridTouch.startOffsetX) * ratio,
      y: focalDY - (focalDY - gridTouch.startOffsetY) * ratio
    }
    gridZoom.value = newZoom
    gridTouch.moved = true
  } else if (gridTouch.type === 'pan' && e.touches.length === 1) {
    const t = getTouchXY(e, 0)
    const dx = t.x - gridTouch.startX
    const dy = t.y - gridTouch.startY
    if (gridTouch.moved || Math.abs(dx) > 8 || Math.abs(dy) > 8) {
      gridOffset.value = {
        x: gridTouch.startOffsetX + dx,
        y: gridTouch.startOffsetY + dy
      }
      gridTouch.moved = true
    }
  }
}

function onTouchEnd() {
  gridTouch.type = null
}

// ===== 开始使用 =====
function startUse() {
  const data = {
    grid: pattern.value.grid,
    N: pattern.value.N,
    M: pattern.value.M,
    colorCounts: pattern.value.colorCounts,
    totalBeadCount: pattern.value.totalBeadCount,
    colorPalette: pattern.value.colorPalette,
    selectedBrand: selectedBrand.value,
    imageInfo: null
  }
  const app = getApp()
  app.globalData = app.globalData || {}
  app.globalData.patternData = data
  uni.navigateTo({ url: '/pages/home/ph/perlerBead/patternEditor' })
}

// ===== 页面加载 =====
onLoad((options) => {
  const id = parseInt(options?.id) || 1
  pattern.value = generateMockPattern(id)
  nextTick(() => {
    const query = uni.createSelectorQuery()
    query.select('.pattern-display').boundingClientRect((rect) => {
      if (rect) {
        containerRect.width = rect.width
        containerRect.height = rect.height
      }
      renderPattern()
    }).exec()
  })
})
</script>

<template>
  <view class="detail-page">
    <!-- 导航栏 -->
    <view class="navbar">
      <view class="navbar-content">
        <view class="navbar-back" @click="uni.navigateBack()">
          <text class="iconfont icon-jiantouzuo" style="font-size:18px;color:#333"></text>
        </view>
        <text class="navbar-title">图纸详情</text>
        <view class="navbar-right"></view>
      </view>
    </view>

    <scroll-view scroll-y class="detail-scroll">
      <!-- 图案展示区 -->
      <view class="pattern-display">
        <image
          v-if="gridImage"
          :src="gridImage"
          class="pattern-image"
          :style="{
            width: gridImageW + 'px',
            height: gridImageH + 'px',
            transform: `scale(${gridZoom}) translate(${gridOffset.x / gridZoom}px, ${gridOffset.y / gridZoom}px)`,
            transformOrigin: 'center center'
          }"
          mode="widthFix"
          @touchstart="onTouchStart"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd"
        />
      </view>

      <!-- 缩放控制 -->
      <view class="zoom-controls">
        <view class="zoom-btn" @click="zoomOut">
          <text class="iconfont icon-jianshao" style="font-size:16px;color:#333"></text>
        </view>
        <view class="zoom-btn" @click="fitAll">
          <text class="iconfont icon-quanping" style="font-size:16px;color:#333"></text>
        </view>
        <view class="zoom-btn" @click="zoomIn">
          <text class="iconfont icon-tianjia" style="font-size:16px;color:#333"></text>
        </view>
      </view>

      <!-- 图案信息 -->
      <view class="pattern-info" v-if="pattern">
        <text class="pattern-title">{{ pattern.title }}</text>
        <view class="pattern-meta">
          <text class="meta-author">作者: {{ pattern.author }}</text>
          <view class="meta-likes">
            <text class="iconfont icon-shoucang" style="font-size:14px;color:#ff6b6b"></text>
            <text>{{ pattern.likes }}</text>
          </view>
        </view>
        <view class="pattern-stats">
          <view class="stat-item">
            <text class="stat-value">{{ pattern.N }}×{{ pattern.M }}</text>
            <text class="stat-label">格子</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ pattern.colorPalette?.length || 0 }}</text>
            <text class="stat-label">颜色</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ pattern.totalBeadCount }}</text>
            <text class="stat-label">颗数</text>
          </view>
        </view>
      </view>

      <!-- 色号列表 -->
      <view class="color-section" v-if="pattern">
        <text class="section-title">用到的色号</text>
        <view class="color-grid">
          <view
            v-for="color in pattern.colorPalette"
            :key="color.hex"
            class="color-item"
          >
            <view class="color-swatch" :style="{ background: color.hex }">
              <text class="color-code">{{ getColorKey(color.hex, selectedBrand) }}</text>
            </view>
            <text class="color-count">×{{ pattern.colorCounts[color.hex.toUpperCase()]?.count || 0 }}</text>
          </view>
        </view>
      </view>

      <!-- 底部留白 -->
      <view style="height: 100px;"></view>
    </scroll-view>

    <!-- 底部按钮 -->
    <view class="bottom-bar">
      <view class="start-btn" @click="startUse">
        <text class="iconfont icon-kaishi" style="font-size:18px;color:#fff"></text>
        <text class="start-btn-text">开始使用该图纸</text>
      </view>
    </view>

    <!-- 隐藏 canvas -->
    <canvas canvas-id="detailCanvas" class="hidden-canvas" />
  </view>
</template>

<style scoped lang="less">
.detail-page {
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  flex-direction: column;
}

// 导航栏
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: #ffffff;
  padding-top: 44px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);

  .navbar-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    height: 44px;

    .navbar-back {
      width: 40px;
      height: 44px;
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    .navbar-title {
      font-size: 17px;
      font-weight: 600;
      color: #333;
    }

    .navbar-right {
      width: 40px;
    }
  }
}

.detail-scroll {
  flex: 1;
  padding-top: 88px;
}

// 图案展示区
.pattern-display {
  width: 100%;
  height: 400px;
  background: #e8eaed;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  .pattern-image {
    touch-action: none;
    flex-shrink: 0;
  }
}

// 缩放控制
.zoom-controls {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
  background: #fff;

  .zoom-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f7fa;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    cursor: pointer;
  }
}

// 图案信息
.pattern-info {
  background: #fff;
  padding: 16px;
  margin-top: 8px;

  .pattern-title {
    font-size: 20px;
    font-weight: 700;
    color: #333;
    display: block;
    margin-bottom: 8px;
  }

  .pattern-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;

    .meta-author {
      font-size: 13px;
      color: #999;
    }

    .meta-likes {
      display: flex;
      align-items: center;
      gap: 4px;

      text {
        font-size: 13px;
        color: #999;
      }
    }
  }

  .pattern-stats {
    display: flex;
    gap: 0;
    background: #f5f7fa;
    border-radius: 10px;
    padding: 12px 0;

    .stat-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      border-right: 1px solid #e8e8e8;

      &:last-child {
        border-right: none;
      }

      .stat-value {
        font-size: 18px;
        font-weight: 700;
        color: #333;
      }

      .stat-label {
        font-size: 11px;
        color: #999;
      }
    }
  }
}

// 色号列表
.color-section {
  background: #fff;
  padding: 16px;
  margin-top: 8px;

  .section-title {
    font-size: 15px;
    font-weight: 600;
    color: #333;
    display: block;
    margin-bottom: 12px;
  }

  .color-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;

    .color-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;

      .color-swatch {
        width: 44px;
        height: 44px;
        border-radius: 8px;
        border: 1px solid #e0e0e0;
        display: flex;
        align-items: center;
        justify-content: center;

        .color-code {
          font-size: 8px;
          font-weight: 700;
          color: #fff;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        }
      }

      .color-count {
        font-size: 10px;
        color: #999;
      }
    }
  }
}

// 底部按钮
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  background: #fff;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
  z-index: 50;

  .start-btn {
    width: 100%;
    height: 48px;
    background: linear-gradient(135deg, #487AFA, #6C5CE7);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;

    &:active {
      opacity: 0.9;
    }

    .start-btn-text {
      font-size: 16px;
      font-weight: 600;
      color: #fff;
    }
  }
}

// 隐藏 canvas
.hidden-canvas {
  position: fixed;
  top: -9999px;
  left: -9999px;
  width: 800px;
  height: 1200px;
  pointer-events: none;
  opacity: 0;
}
</style>
