<script setup>
import { ref, computed, nextTick } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import page from '@/components/pages/page.vue'
import { buildPalette, getColorKey, sortColorsByHue, COLOR_SYSTEM_OPTIONS } from './utils/colorData'
import { findClosestColor, calculateColorStats } from './utils/pixelation'
import { drawPatternOnCanvas, calculateDrawSize } from './utils/exportUtils'

// ===== 图纸数据 =====
const patternGrid = ref(null)
const colorPalette = ref([])
const colorCounts = ref({})
const totalBeadCount = ref(0)
const selectedBrand = ref('MARD')
const imageInfo = ref(null)

// ===== 编辑工具 =====
const editTool = ref('move')
const editColor = ref('#FF0000')
const showColorPicker = ref(false)
const showStatsDrawer = ref(false)
const showLayerPanel = ref(false)

// ===== 画布显示 =====
const showGrid = ref(true)
const showCode = ref(true)
const showCoordinates = ref(true)
const gridInterval = ref(10)
const highlightColor = ref('')
const showCellPopup = ref(false)
const selectedCell = ref(null)
const gridZoom = ref(1)
const gridOffset = ref({ x: 0, y: 0 })
let gridTouch = { type: null, startX: 0, startY: 0, startOffsetX: 0, startOffsetY: 0, moved: false, startDist: 0, startZoom: 1, focalX: 0, focalY: 0, lastCell: null }
const containerW = ref(375)
const containerH = ref(500)
const BASE_CELL = 18

// ===== Canvas 尺寸 =====
const canvasW = ref(0)
const canvasH = ref(0)
const renderAxisW = ref(0)
const renderCellSize = ref(18)

// ===== 撤销/重做（diff 模式） =====
const historyStack = ref([])
const historyIndex = ref(-1)
const MAX_HISTORY = 50

// ===== 图层 =====
const layers = ref([
  { id: 'pattern', name: '图纸', visible: true, locked: false },
  { id: 'annotation', name: '标注', visible: true, locked: false }
])
const activeLayer = ref('pattern')
const annotationMarks = ref({})

// ===== 原图对比 =====
const showOriginalOverlay = ref(false)

// ===== 发布 =====
const showPublishDialog = ref(false)
const publishTitle = ref('')
const isPublishing = ref(false)

// ===== 当前色板 =====
const currentPalette = computed(() => buildPalette(selectedBrand.value))

// ===== 按色相分组的色板 =====
const groupedPalette = computed(() => {
  const palette = currentPalette.value
  if (!palette.length) return []
  const groups = [
    { name: '红色', min: 0, max: 15, colors: [] },
    { name: '橙色', min: 15, max: 45, colors: [] },
    { name: '黄色', min: 45, max: 70, colors: [] },
    { name: '绿色', min: 70, max: 160, colors: [] },
    { name: '青色', min: 160, max: 200, colors: [] },
    { name: '蓝色', min: 200, max: 260, colors: [] },
    { name: '紫色', min: 260, max: 310, colors: [] },
    { name: '粉色', min: 310, max: 345, colors: [] },
    { name: '黑白灰', min: -1, max: -1, colors: [] }
  ]
  for (const color of palette) {
    const hex = color.hex.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16) / 255
    const g = parseInt(hex.substring(2, 4), 16) / 255
    const b = parseInt(hex.substring(4, 6), 16) / 255
    const max = Math.max(r, g, b), min = Math.min(r, g, b), diff = max - min
    let h = 0
    if (diff !== 0) {
      switch (max) {
        case r: h = ((g - b) / diff + (g < b ? 6 : 0)) / 6; break
        case g: h = ((b - r) / diff + 2) / 6; break
        case b: h = ((r - g) / diff + 4) / 6; break
      }
      h *= 360
    }
    const s = diff === 0 ? 0 : (max + min) / 2 > 0.5 ? diff / (2 - max - min) : diff / (max + min)
    const l = (max + min) / 2
    if (s < 0.12 || l < 0.08 || l > 0.95) {
      groups[8].colors.push(color)
    } else {
      const group = groups.find(g => g.min >= 0 && h >= g.min && h < g.max)
      if (group) group.colors.push(color)
      else groups[8].colors.push(color)
    }
  }
  return groups.filter(g => g.colors.length > 0)
})

// ===== 页面加载 =====
onLoad(() => {
  const data = getApp().globalData?.patternData
  if (!data) {
    uni.showToast({ title: '无图纸数据', icon: 'none' })
    setTimeout(() => uni.navigateBack(), 1500)
    return
  }
  patternGrid.value = { grid: data.grid, N: data.N, M: data.M }
  colorCounts.value = data.colorCounts
  totalBeadCount.value = data.totalBeadCount
  colorPalette.value = data.colorPalette
  selectedBrand.value = data.selectedBrand || 'MARD'
  imageInfo.value = data.imageInfo || null
  pushHistory()
  nextTick(() => {
    const query = uni.createSelectorQuery()
    query.select('.grid-scroll').boundingClientRect((rect) => {
      if (rect) {
        containerRect.left = rect.left
        containerRect.top = rect.top
        containerRect.width = rect.width
        containerRect.height = rect.height
      }
      initCanvasSize()
      drawPatternCanvas()
      drawGridCanvas()
    }).exec()
  })
})

function onPageBack(e) {
  e.preventDefault()
  uni.navigateBack()
}

// ===== Canvas 尺寸初始化 =====
function initCanvasSize() {
  if (!patternGrid.value) return
  const { N, M } = patternGrid.value
  const axisW = showCoordinates.value ? 24 : 0
  const cellSize = BASE_CELL
  renderAxisW.value = axisW
  renderCellSize.value = cellSize
  canvasW.value = N * cellSize + axisW * 2
  canvasH.value = M * cellSize + axisW * 2
  nextTick(() => { fitAll() })
}

// ===== Canvas 绘制：图案层 =====
function drawPatternCanvas() {
  if (!patternGrid.value) return
  const { grid, N, M } = patternGrid.value
  const ctx = uni.createCanvasContext('patternCanvas')
  const cell = renderCellSize.value
  const axisW = renderAxisW.value
  const w = canvasW.value
  const h = canvasH.value

  ctx.clearRect(0, 0, w, h)
  ctx.setFillStyle('#FFFFFF')
  ctx.fillRect(0, 0, w, h)

  // 坐标轴背景
  if (showCoordinates.value && axisW > 0) {
    ctx.setFillStyle('#F0F0F0')
    ctx.fillRect(axisW, 0, N * cell, axisW)           // 上
    ctx.fillRect(0, axisW, axisW, M * cell)           // 左
    ctx.fillRect(axisW, axisW + M * cell, N * cell, axisW)  // 下
    ctx.fillRect(axisW + N * cell, axisW, axisW, M * cell)  // 右
  }

  // 格子颜色
  for (let row = 0; row < M; row++) {
    for (let col = 0; col < N; col++) {
      const c = grid[row][col]
      const x = axisW + col * cell
      const y = axisW + row * cell
      const hex = (highlightColor.value && c && c.hex !== highlightColor.value) ? '#CCCCCC' : (c ? c.hex : '#FFFFFF')
      ctx.setFillStyle(hex)
      ctx.fillRect(x, y, cell, cell)
    }
  }

  // 色号文字
  if (showCode.value && cell >= 5) {
    const fontSize = Math.max(5, Math.floor(cell * 0.45))
    ctx.setFontSize(fontSize)
    ctx.setTextAlign('center')
    ctx.setTextBaseline('middle')
    for (let row = 0; row < M; row++) {
      for (let col = 0; col < N; col++) {
        const c = grid[row][col]
        if (!c) continue
        const x = axisW + col * cell
        const y = axisW + row * cell
        ctx.setFillStyle(getContrastColor(c.hex))
        ctx.fillText(getColorKey(c.hex, selectedBrand.value), x + cell / 2, y + cell / 2)
      }
    }
  }

  // 坐标标注
  if (showCoordinates.value && axisW > 0) {
    const fontSize = Math.max(4, Math.floor(cell * 0.45))
    ctx.setFillStyle('#333333')
    ctx.setFontSize(fontSize)
    // 上方列号
    ctx.setTextAlign('center')
    ctx.setTextBaseline('middle')
    for (let col = 0; col < N; col++) {
      ctx.fillText(String(col + 1), axisW + col * cell + cell / 2, axisW / 2)
    }
    // 下方列号
    for (let col = 0; col < N; col++) {
      ctx.fillText(String(col + 1), axisW + col * cell + cell / 2, axisW + M * cell + axisW / 2)
    }
    // 左侧行号
    ctx.setTextAlign('right')
    for (let row = 0; row < M; row++) {
      ctx.fillText(String(row + 1), axisW / 2, axisW + row * cell + cell / 2)
    }
    // 右侧行号
    ctx.setTextAlign('left')
    for (let row = 0; row < M; row++) {
      ctx.fillText(String(row + 1), axisW + N * cell + 2, axisW + row * cell + cell / 2)
    }
  }

  ctx.draw()
}

// ===== Canvas 绘制：网格层 =====
function drawGridCanvas() {
  if (!patternGrid.value) return
  const { N, M } = patternGrid.value
  const ctx = uni.createCanvasContext('gridCanvas')
  const cell = renderCellSize.value
  const axisW = renderAxisW.value
  const w = canvasW.value
  const h = canvasH.value
  const interval = gridInterval.value

  ctx.clearRect(0, 0, w, h)

  // 普通网格线（fillRect 画 1px 线，比 strokeRect 更清晰）
  ctx.setFillStyle('rgba(0,0,0,0.18)')
  for (let col = 1; col < N; col++) {
    ctx.fillRect(axisW + col * cell, axisW, 1, M * cell)
  }
  for (let row = 1; row < M; row++) {
    ctx.fillRect(axisW, axisW + row * cell, N * cell, 1)
  }

  // 加粗间隔线
  ctx.setFillStyle('rgba(0,0,0,0.45)')
  for (let col = interval; col < N; col += interval) {
    ctx.fillRect(axisW + col * cell - 1, axisW, 3, M * cell)
  }
  for (let row = interval; row < M; row += interval) {
    ctx.fillRect(axisW, axisW + row * cell - 1, N * cell, 3)
  }

  // 边框
  ctx.setFillStyle('rgba(0,0,0,0.55)')
  ctx.fillRect(axisW, axisW, N * cell, 2)
  ctx.fillRect(axisW, axisW + M * cell - 2, N * cell, 2)
  ctx.fillRect(axisW, axisW, 2, M * cell)
  ctx.fillRect(axisW + N * cell - 2, axisW, 2, M * cell)

  ctx.draw()
}

// ===== 单格局部重绘 =====
function redrawCell(row, col) {
  if (!patternGrid.value) return
  const { grid, N, M } = patternGrid.value
  const ctx = uni.createCanvasContext('patternCanvas')
  const cell = renderCellSize.value
  const axisW = renderAxisW.value
  const x = axisW + col * cell
  const y = axisW + row * cell
  const c = grid[row][col]

  // 清除格子区域
  ctx.setFillStyle('#FFFFFF')
  ctx.fillRect(x, y, cell, cell)

  // 绘制格子颜色
  const hex = (highlightColor.value && c && c.hex !== highlightColor.value) ? '#CCCCCC' : (c ? c.hex : '#FFFFFF')
  ctx.setFillStyle(hex)
  ctx.fillRect(x, y, cell, cell)

  // 色号文字
  if (showCode.value && cell >= 5 && c) {
    const fontSize = Math.max(5, Math.floor(cell * 0.45))
    ctx.setFontSize(fontSize)
    ctx.setTextAlign('center')
    ctx.setTextBaseline('middle')
    ctx.setFillStyle(getContrastColor(c.hex))
    ctx.fillText(getColorKey(c.hex, selectedBrand.value), x + cell / 2, y + cell / 2)
  }

  ctx.draw(true)
}

// ===== 缩放平移 =====
function fitAll() {
  if (!canvasW.value || !canvasH.value) return
  const availW = (containerRect.width || 375) - 20
  const availH = (containerRect.height || 600) - 20
  const zoom = Math.min(availW / canvasW.value, availH / canvasH.value)
  gridZoom.value = Math.max(0.05, Math.min(5, zoom))
  gridOffset.value = { x: 0, y: 0 }
}

function canvasZoomIn() { zoomAtCenter(1.3) }
function canvasZoomOut() { zoomAtCenter(1 / 1.3) }
function zoomAtCenter(factor) {
  const oldZoom = gridZoom.value
  const newZoom = Math.max(0.05, Math.min(5, oldZoom * factor))
  if (newZoom === oldZoom) return
  const ratio = newZoom / oldZoom
  gridOffset.value = { x: gridOffset.value.x * ratio, y: gridOffset.value.y * ratio }
  gridZoom.value = newZoom
}

// ===== 网格触摸 =====
function getTouchXY(e, idx) {
  const t = e.touches[idx]
  return { x: t.x !== undefined ? t.x : t.clientX, y: t.y !== undefined ? t.y : t.clientY }
}

function refreshContainerRect() {
  const query = uni.createSelectorQuery()
  query.select('.grid-scroll').boundingClientRect((rect) => {
    if (rect) {
      containerRect.left = rect.left
      containerRect.top = rect.top
      containerRect.width = rect.width
      containerRect.height = rect.height
    }
  }).exec()
}

function findCellFromTouch(touchX, touchY) {
  if (!patternGrid.value || !containerRect.width) return null
  const zoom = gridZoom.value
  const off = gridOffset.value
  const cw = canvasW.value
  const ch = canvasH.value
  const imgVisualX = containerRect.left + containerRect.width / 2 + off.x - (cw * zoom) / 2
  const imgVisualY = containerRect.top + containerRect.height / 2 + off.y - (ch * zoom) / 2
  const localX = (touchX - imgVisualX) / zoom
  const localY = (touchY - imgVisualY) / zoom
  const axisW = renderAxisW.value
  const cell = renderCellSize.value
  const col = Math.floor((localX - axisW) / cell)
  const row = Math.floor((localY - axisW) / cell)
  const { N, M } = patternGrid.value
  if (col >= 0 && col < N && row >= 0 && row < M) return { row, col }
  return null
}

function isDrawingTool(tool) {
  return tool === 'pen' || tool === 'eraser'
}

function applyToolAtCell(row, col) {
  const { grid } = patternGrid.value
  if (editTool.value === 'pen') {
    const targetRgb = hexToRgb(editColor.value)
    const closest = findClosestColor(targetRgb, currentPalette.value)
    recordChange(row, col, closest)
    grid[row][col] = closest
  } else if (editTool.value === 'eraser') {
    const empty = { hex: '#FFFFFF', key: '#FFFFFF', rgb: { r: 255, g: 255, b: 255 } }
    recordChange(row, col, empty)
    grid[row][col] = empty
  }
}

function onGridTouchStart(e) {
  refreshContainerRect()
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
    if (isDrawingTool(editTool.value)) {
      gridTouch.type = 'draw'
      gridTouch.startX = t.x
      gridTouch.startY = t.y
      gridTouch.lastCell = null
      const cell = findCellFromTouch(t.x, t.y)
      if (cell) {
        startDrawAction()
        applyToolAtCell(cell.row, cell.col)
        gridTouch.lastCell = cell
        refreshStats()
        redrawCell(cell.row, cell.col)
      }
    } else if (editTool.value === 'fill') {
      gridTouch.type = 'fill'
      gridTouch.startX = t.x
      gridTouch.startY = t.y
      gridTouch.moved = false
    } else {
      gridTouch.type = 'pan'
      gridTouch.startX = t.x
      gridTouch.startY = t.y
      gridTouch.startOffsetX = gridOffset.value.x
      gridTouch.startOffsetY = gridOffset.value.y
      gridTouch.moved = false
    }
  }
}

function onGridTouchMove(e) {
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
    const newZoom = Math.max(0.05, Math.min(5, gridTouch.startZoom * (dist / gridTouch.startDist)))
    const containerCX = containerRect.left + containerRect.width / 2
    const containerCY = containerRect.top + containerRect.height / 2
    const focalDX = gridTouch.focalX - containerCX
    const focalDY = gridTouch.focalY - containerCY
    const ratio = newZoom / gridTouch.startZoom
    gridOffset.value = {
      x: focalDX - (focalDX - gridTouch.startOffsetX) * ratio,
      y: focalDY - (focalDY - gridTouch.startOffsetY) * ratio
    }
    gridZoom.value = newZoom
    gridTouch.moved = true
  } else if (gridTouch.type === 'draw' && e.touches.length === 1) {
    const t = getTouchXY(e, 0)
    const cell = findCellFromTouch(t.x, t.y)
    if (cell) {
      const last = gridTouch.lastCell
      if (!last || last.row !== cell.row || last.col !== cell.col) {
        applyToolAtCell(cell.row, cell.col)
        gridTouch.lastCell = cell
        refreshStats()
        redrawCell(cell.row, cell.col)
      }
    }
  } else if (gridTouch.type === 'fill' && e.touches.length === 1) {
    const t = getTouchXY(e, 0)
    const dx = t.x - gridTouch.startX
    const dy = t.y - gridTouch.startY
    if (Math.abs(dx) > 8 || Math.abs(dy) > 8) gridTouch.moved = true
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

function onGridTouchEnd(e) {
  if (gridTouch.type === 'draw') {
    commitDrawAction()
    refreshStats()
  } else if (gridTouch.type === 'fill' && !gridTouch.moved) {
    const cell = findCellFromTouch(gridTouch.startX, gridTouch.startY)
    if (cell) {
      fillArea(cell.row, cell.col)
      refreshStats()
      drawPatternCanvas()
    }
  } else if (gridTouch.type === 'pan' && !gridTouch.moved && patternGrid.value) {
    const cell = findCellFromTouch(gridTouch.startX, gridTouch.startY)
    if (cell) onCellClick(cell.row, cell.col)
  }
  gridTouch.type = null
}

// ===== 格子点击 =====
function onCellClick(row, col) {
  if (!patternGrid.value) return
  const { grid } = patternGrid.value
  if (editTool.value === 'pen') {
    const targetRgb = hexToRgb(editColor.value)
    const closest = findClosestColor(targetRgb, currentPalette.value)
    startDrawAction()
    grid[row][col] = closest
    commitDrawAction()
    refreshStats()
    redrawCell(row, col)
  } else if (editTool.value === 'eraser') {
    startDrawAction()
    grid[row][col] = { hex: '#FFFFFF', key: '#FFFFFF', rgb: { r: 255, g: 255, b: 255 } }
    commitDrawAction()
    refreshStats()
    redrawCell(row, col)
  } else if (editTool.value === 'fill') {
    fillArea(row, col)
    refreshStats()
    drawPatternCanvas()
  } else {
    selectedCell.value = { row, col }
    showCellPopup.value = true
  }
}

function getContrastColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luma = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
  return luma > 0.5 ? '#000000' : '#FFFFFF'
}

// ===== 撤销/重做（diff 模式） =====
let diffMap = new Map() // key: "row,col" → { row, col, old, _new }

function startDrawAction() {
  diffMap = new Map()
}

function recordChange(row, col, newVal) {
  const key = `${row},${col}`
  if (diffMap.has(key)) {
    diffMap.get(key)._new = newVal ? { ...newVal, rgb: { ...newVal.rgb } } : null
  } else {
    const old = patternGrid.value.grid[row][col]
    diffMap.set(key, {
      row, col,
      old: old ? { ...old, rgb: { ...old.rgb } } : null,
      _new: newVal ? { ...newVal, rgb: { ...newVal.rgb } } : null
    })
  }
}

function commitDrawAction() {
  if (diffMap.size === 0) return
  const diffs = Array.from(diffMap.values())
  historyStack.value = historyStack.value.slice(0, historyIndex.value + 1)
  historyStack.value.push(diffs)
  if (historyStack.value.length > MAX_HISTORY) historyStack.value.shift()
  historyIndex.value = historyStack.value.length - 1
  diffMap = new Map()
}

function pushHistory() {
  if (!patternGrid.value) return
  historyStack.value = historyStack.value.slice(0, historyIndex.value + 1)
  historyStack.value.push([])
  if (historyStack.value.length > MAX_HISTORY) historyStack.value.shift()
  historyIndex.value = historyStack.value.length - 1
}

function applyDiffs(diffs, field) {
  if (!patternGrid.value) return
  const { grid } = patternGrid.value
  const empty = { hex: '#FFFFFF', key: '#FFFFFF', rgb: { r: 255, g: 255, b: 255 } }
  for (const d of diffs) {
    const val = d[field]
    grid[d.row][d.col] = val ? { ...val, rgb: { ...val.rgb } } : empty
  }
}

function undo() {
  if (historyIndex.value <= 0) return
  applyDiffs(historyStack.value[historyIndex.value], 'old')
  historyIndex.value--
  refreshStats()
  drawPatternCanvas()
}

function redo() {
  if (historyIndex.value >= historyStack.value.length - 1) return
  historyIndex.value++
  applyDiffs(historyStack.value[historyIndex.value], '_new')
  refreshStats()
  drawPatternCanvas()
}

// ===== 编辑操作 =====
function hexToRgb(hex) {
  return { r: parseInt(hex.slice(1, 3), 16), g: parseInt(hex.slice(3, 5), 16), b: parseInt(hex.slice(5, 7), 16) }
}

function eraseCell(row, col) {
  if (!patternGrid.value) return
  startDrawAction()
  const empty = { hex: '#FFFFFF', key: '#FFFFFF', rgb: { r: 255, g: 255, b: 255 } }
  recordChange(row, col, empty)
  patternGrid.value.grid[row][col] = empty
  commitDrawAction()
  refreshStats()
  showCellPopup.value = false
  redrawCell(row, col)
}

function highlightSameColor(hex) {
  highlightColor.value = highlightColor.value === hex ? '' : hex
  showCellPopup.value = false
  drawPatternCanvas()
}

function replaceCellColor(row, col) {
  showCellPopup.value = false
  editTool.value = 'pen'
  editCellDirect(row, col)
}

function editCellDirect(row, col) {
  if (!patternGrid.value) return
  const targetRgb = hexToRgb(editColor.value)
  const closest = findClosestColor(targetRgb, currentPalette.value)
  startDrawAction()
  recordChange(row, col, closest)
  patternGrid.value.grid[row][col] = closest
  commitDrawAction()
  refreshStats()
  redrawCell(row, col)
}

function fillArea(startRow, startCol) {
  if (!patternGrid.value) return
  const { grid, N, M } = patternGrid.value
  const targetCell = grid[startRow][startCol]
  if (!targetCell) return
  const targetHex = targetCell.hex.toUpperCase()
  const targetRgb = hexToRgb(editColor.value)
  const newColor = findClosestColor(targetRgb, currentPalette.value)
  if (targetHex === newColor.hex.toUpperCase()) return
  startDrawAction()
  const visited = new Set()
  const queue = [[startRow, startCol]]
  const key = (r, c) => `${r},${c}`
  while (queue.length > 0) {
    const [r, c] = queue.shift()
    const k = key(r, c)
    if (visited.has(k) || r < 0 || r >= M || c < 0 || c >= N) continue
    const cell = grid[r][c]
    if (!cell || cell.hex.toUpperCase() !== targetHex) continue
    visited.add(k)
    recordChange(r, c, newColor)
    grid[r][c] = newColor
    queue.push([r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1])
  }
  commitDrawAction()
}

function refreshStats() {
  if (!patternGrid.value) return
  const stats = calculateColorStats(patternGrid.value.grid)
  colorCounts.value = stats.colorCounts
  totalBeadCount.value = stats.totalCount
  colorPalette.value = sortColorsByHue(Object.values(stats.colorCounts).map(item => item.color))
}

// ===== 统计/图层 =====
function toggleStatsDrawer() {
  showStatsDrawer.value = !showStatsDrawer.value
  if (showStatsDrawer.value) showLayerPanel.value = false
}
function toggleLayerVisible(id) { const l = layers.value.find(i => i.id === id); if (l) l.visible = !l.visible }
function toggleLayerLock(id) { const l = layers.value.find(i => i.id === id); if (l) l.locked = !l.locked }
let layerIdCounter = 1
function addLayer() {
  layerIdCounter++
  layers.value.push({ id: `layer_${layerIdCounter}`, name: `图层 ${layers.value.length + 1}`, visible: true, locked: false })
}
function removeLayer() {
  if (layers.value.length <= 1) { uni.showToast({ title: '至少保留一个图层', icon: 'none' }); return }
  const idx = layers.value.findIndex(l => l.id === activeLayer.value)
  if (idx < 0) return
  layers.value.splice(idx, 1)
  activeLayer.value = layers.value[Math.max(0, idx - 1)].id
}
function mergeDownLayer() {
  const idx = layers.value.findIndex(l => l.id === activeLayer.value)
  if (idx <= 0) { uni.showToast({ title: '已经是底层图层', icon: 'none' }); return }
  layers.value[idx - 1].name += ' + ' + layers.value[idx].name
  layers.value.splice(idx, 1)
  activeLayer.value = layers.value[idx - 1].id
  uni.showToast({ title: '已合并', icon: 'success' })
}

// ===== 原图对比 =====
const previewOriginal = () => {
  if (!imageInfo.value?.path || !patternGrid.value) return
  showOriginalOverlay.value = !showOriginalOverlay.value
}
const overlayImgStyle = computed(() => {
  if (!patternGrid.value || !canvasW.value) return { display: 'none' }
  const w = canvasW.value
  const h = canvasH.value
  return { width: w + 'px', height: h + 'px', left: `calc(50% - ${w / 2}px)`, top: `calc(50% - ${h / 2}px)` }
})

// ===== 导出 =====
function saveExportData() {
  uni.setStorageSync('exportPatternData', {
    grid: patternGrid.value.grid,
    N: patternGrid.value.N,
    M: patternGrid.value.M,
    brand: selectedBrand.value,
    colorPalette: colorPalette.value,
    colorCounts: colorCounts.value,
    totalBeadCount: totalBeadCount.value
  })
}

function showExportMenu() {
  if (!patternGrid.value) return
  uni.showActionSheet({
    itemList: ['导出图片', '打印导出'],
    success: (res) => {
      if (res.tapIndex === 0) {
        saveExportData()
        uni.navigateTo({ url: '/pages/home/ph/perlerBead/exportSettings' })
      } else if (res.tapIndex === 1) {
        saveExportData()
        uni.navigateTo({ url: '/pages/home/ph/perlerBead/printExport' })
      }
    }
  })
}

// ===== 发布到广场 =====
function openPublishDialog() {
  publishTitle.value = ''
  showPublishDialog.value = true
}

async function publishPattern() {
  if (!publishTitle.value.trim()) {
    uni.showToast({ title: '请输入标题', icon: 'none' })
    return
  }
  isPublishing.value = true
  try {
    // Mock 发布 - 后续接 API
    await new Promise(resolve => setTimeout(resolve, 800))
    showPublishDialog.value = false
    uni.showToast({ title: '发布成功', icon: 'success' })
  } catch (err) {
    console.error('发布失败:', err)
    uni.showToast({ title: '发布失败', icon: 'none' })
  } finally {
    isPublishing.value = false
  }
}

// ===== 切换网格显示 =====
function toggleGrid() {
  showGrid.value = !showGrid.value
}

// ===== 切换坐标显示 =====
function toggleCoordinates() {
  showCoordinates.value = !showCoordinates.value
  initCanvasSize()
  drawPatternCanvas()
  drawGridCanvas()
}

// ===== 切换色号显示 =====
function toggleCode() {
  showCode.value = !showCode.value
  drawPatternCanvas()
}

// ===== 容器位置缓存 =====
const containerRect = { left: 0, top: 0, width: 0, height: 0 }
</script>

<template>
  <page title="图纸编辑" @back="onPageBack">
    <view class="editor-page">
      <!-- 顶部栏 -->
      <view class="canvas-topbar">
        <view class="topbar-btn topbar-left-btn" @click="toggleStatsDrawer">
          <text>{{ colorPalette.length }}色 {{ totalBeadCount }}颗</text>
          <text class="iconfont" :class="showStatsDrawer ? 'icon-jiantouzuo' : 'icon-jiantouyou'" style="font-size:12px;color:#666"></text>
        </view>
        <view class="topbar-btn topbar-right-btn" @click="showLayerPanel = !showLayerPanel">
          <text class="iconfont icon-Tab_huadanguanli" style="font-size:14px;color:#666"></text>
          <text>图层</text>
        </view>
      </view>

      <!-- 颜色统计抽屉 -->
      <view v-if="showStatsDrawer" class="stats-drawer" @click.stop>
        <scroll-view scroll-x class="stats-drawer-scroll" :show-scrollbar="false">
          <view class="stats-drawer-list">
            <view v-for="color in colorPalette" :key="color.hex" class="stats-drawer-item" :class="{ active: editColor.toUpperCase() === color.hex.toUpperCase() }" @click="editColor = color.hex; editTool = 'pen'">
              <view class="stats-drawer-swatch" :style="{ background: color.hex }">
                <text class="stats-drawer-code">{{ getColorKey(color.hex, selectedBrand) }}</text>
              </view>
              <text class="stats-drawer-count">×{{ colorCounts[color.hex.toUpperCase()]?.count || 0 }}</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 图层面板 -->
      <view v-if="showLayerPanel" class="layer-dropdown" @click.stop>
        <view class="layer-dropdown-header">
          <text class="layer-dropdown-title">图层</text>
          <view class="layer-dropdown-actions">
            <view class="layer-action-btn" @click="addLayer"><text class="iconfont icon-tianjia" style="font-size:14px;color:#487AFA"></text></view>
            <view class="layer-action-btn" @click="mergeDownLayer"><text class="iconfont icon-jiantouxia" style="font-size:14px;color:#E6A23C"></text></view>
            <view class="layer-action-btn" @click="removeLayer"><text class="iconfont icon-lajitong" style="font-size:14px;color:#F56C6C"></text></view>
          </view>
        </view>
        <scroll-view scroll-y class="layer-dropdown-list">
          <view v-for="layer in layers" :key="layer.id" class="layer-row" :class="{ active: activeLayer === layer.id }" @click="activeLayer = layer.id">
            <view class="layer-thumb" :style="{ background: layer.id === 'pattern' ? '#e8eaed' : '#fff' }">
              <view v-if="layer.id === 'pattern'" class="layer-thumb-grid">
                <view v-for="i in 4" :key="i" class="layer-thumb-row">
                  <view v-for="j in 4" :key="j" class="layer-thumb-cell" :style="{ background: patternGrid && patternGrid.grid[i-1] && patternGrid.grid[i-1][j-1] ? patternGrid.grid[i-1][j-1].hex : '#fff' }"></view>
                </view>
              </view>
              <text v-else class="iconfont icon-liebiaoshezhi" style="font-size:16px;color:#ccc"></text>
            </view>
            <view class="layer-info">
              <text class="layer-name">{{ layer.name }}</text>
              <text class="layer-size" v-if="layer.id === 'pattern' && patternGrid">{{ patternGrid.N }}×{{ patternGrid.M }}</text>
            </view>
            <view class="layer-controls">
              <view class="layer-ctrl-btn" @click.stop="toggleLayerVisible(layer.id)">
                <text class="iconfont" :class="layer.visible ? 'icon-yanjing' : 'icon-biyan'" style="font-size:16px" :style="{ color: layer.visible ? '#487AFA' : '#ccc' }"></text>
              </view>
              <view class="layer-ctrl-btn" @click.stop="toggleLayerLock(layer.id)">
                <text class="iconfont" :class="layer.locked ? 'icon-suo' : 'icon-suokaiqi'" style="font-size:14px" :style="{ color: layer.locked ? '#F56C6C' : '#ccc' }"></text>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 图纸显示区域：双层 Canvas -->
      <view class="grid-scroll">
        <view class="canvas-wrapper" :style="{ transform: `scale(${gridZoom}) translate(${gridOffset.x / gridZoom}px, ${gridOffset.y / gridZoom}px)`, transformOrigin: 'center center' }" @touchstart="onGridTouchStart" @touchmove="onGridTouchMove" @touchend="onGridTouchEnd">
          <canvas canvas-id="patternCanvas" class="display-canvas" :style="{ width: canvasW + 'px', height: canvasH + 'px' }" />
          <canvas v-show="showGrid" canvas-id="gridCanvas" class="display-canvas grid-layer" :style="{ width: canvasW + 'px', height: canvasH + 'px' }" />
        </view>
        <!-- 原图覆盖层 -->
        <image v-if="showOriginalOverlay && imageInfo?.path" :src="imageInfo.path" class="original-overlay" :style="{ ...overlayImgStyle, transform: `scale(${gridZoom}) translate(${gridOffset.x / gridZoom}px, ${gridOffset.y / gridZoom}px)` }" mode="widthFix" @click="showOriginalOverlay = false" />
      </view>

      <!-- 左侧工具栏 -->
      <view class="tool-sidebar">
        <view class="tool-btn" :class="{ active: editTool === 'move' }" @click="editTool = 'move'; highlightColor = ''; drawPatternCanvas()">
          <text class="iconfont icon-yidong tool-icon" :style="{ color: editTool === 'move' ? '#487AFA' : '#666' }"></text>
          <text class="tool-label">移动</text>
        </view>
        <view class="tool-btn" :class="{ active: editTool === 'pen' }" @click="editTool = 'pen'">
          <text class="iconfont icon-bianji tool-icon" :style="{ color: editTool === 'pen' ? '#487AFA' : '#666' }"></text>
          <text class="tool-label">画笔</text>
        </view>
        <view class="tool-btn" :class="{ active: editTool === 'eraser' }" @click="editTool = 'eraser'">
          <text class="iconfont icon-shanchuhou tool-icon" :style="{ color: editTool === 'eraser' ? '#487AFA' : '#666' }"></text>
          <text class="tool-label">擦除</text>
        </view>
        <!-- <view class="tool-btn" :class="{ active: editTool === 'fill' }" @click="editTool = 'fill'">
          <text class="iconfont icon-quan tool-icon" :style="{ color: editTool === 'fill' ? '#487AFA' : '#666' }"></text>
          <text class="tool-label">填充</text>
        </view> -->
        <view class="tool-divider"></view>
        <view class="tool-btn color-btn" @click="showColorPicker = true">
          <view class="color-preview" :style="{ background: editColor }"></view>
          <text class="tool-label">取色</text>
        </view>
      </view>

      <!-- 左下：原图（仅在有原图时显示） -->
      <view v-if="imageInfo?.path" class="fab-source" @click="previewOriginal">
        <image :src="imageInfo.path" mode="aspectFill" class="fab-source-img" />
        <text class="fab-source-label">原图</text>
      </view>

      <!-- 底部工具栏 -->
      <view class="fab-toolbar">
        <view class="fab-divider"></view>
        <view class="fab-btn" :class="{ disabled: historyIndex <= 0 }" @click="undo">
          <text class="iconfont icon-houtui fab-icon" :style="{ color: historyIndex > 0 ? '#333' : '#ccc' }"></text>
        </view>
        <view class="fab-btn" :class="{ disabled: historyIndex >= historyStack.length - 1 }" @click="redo">
          <text class="iconfont icon-jiantouqianjin fab-icon" :style="{ color: historyIndex < historyStack.length - 1 ? '#333' : '#ccc' }"></text>
        </view>
        <view class="fab-divider"></view>
        <view class="fab-btn" @click="canvasZoomOut"><text class="iconfont icon-jianshao fab-icon" style="color:#333"></text></view>
        <view class="fab-btn" @click="fitAll"><text class="iconfont icon-quanping fab-icon" style="color:#333"></text></view>
        <view class="fab-btn" @click="canvasZoomIn"><text class="iconfont icon-tianjia fab-icon" style="color:#333"></text></view>
        <view class="fab-divider"></view>
        <view class="fab-btn" @click="toggleGrid">
          <text class="iconfont icon-liebiaoshezhi fab-icon" :style="{ color: showGrid ? '#487AFA' : '#ccc' }"></text>
        </view>
        <view class="fab-btn primary" @click="showExportMenu">
          <text class="iconfont icon-xiazai fab-icon" style="color:#fff"></text>
        </view>
        <view class="fab-btn publish-btn" @click="openPublishDialog">
          <text class="fab-save-text">发布</text>
        </view>
      </view>

      <!-- 弹窗：格子操作 -->
      <view v-if="showCellPopup && selectedCell" class="popup-mask" @click="showCellPopup = false">
        <view class="popup-panel cell-popup" @click.stop>
          <view class="popup-header">
            <text class="popup-title">第{{ selectedCell.row + 1 }}行 第{{ selectedCell.col + 1 }}列</text>
            <view @click="showCellPopup = false"><text class="iconfont icon-guanbi" style="font-size:20px;color:#999"></text></view>
          </view>
          <view class="cell-popup-info">
            <view class="cell-popup-color" :style="{ background: patternGrid.grid[selectedCell.row][selectedCell.col]?.hex }"></view>
            <view class="cell-popup-detail">
              <text class="cell-popup-hex">{{ patternGrid.grid[selectedCell.row][selectedCell.col]?.hex }}</text>
              <text class="cell-popup-code">色号: {{ getColorKey(patternGrid.grid[selectedCell.row][selectedCell.col]?.hex, selectedBrand) }}</text>
            </view>
          </view>
          <view class="cell-popup-actions">
            <view class="cell-action-btn" @click="replaceCellColor(selectedCell.row, selectedCell.col)"><text class="iconfont icon-bianji" style="font-size:18px;color:#487AFA"></text><text>换色</text></view>
            <view class="cell-action-btn" @click="eraseCell(selectedCell.row, selectedCell.col)"><text class="iconfont icon-shanchuhou" style="font-size:18px;color:#F56C6C"></text><text>擦除</text></view>
            <view class="cell-action-btn" @click="editTool = 'fill'; showCellPopup = false; onCellClick(selectedCell.row, selectedCell.col)"><text class="iconfont icon-quan" style="font-size:18px;color:#67C23A"></text><text>填充同色</text></view>
            <view class="cell-action-btn" @click="highlightSameColor(patternGrid.grid[selectedCell.row][selectedCell.col]?.hex)"><text class="iconfont icon-yanjing" style="font-size:18px;color:#E6A23C"></text><text>{{ highlightColor === patternGrid.grid[selectedCell.row][selectedCell.col]?.hex ? '取消高亮' : '高亮同色号' }}</text></view>
          </view>
        </view>
      </view>

      <!-- 弹窗：色板选择 -->
      <view v-if="showColorPicker" class="popup-mask" @click="showColorPicker = false">
        <view class="popup-panel color-picker-panel" @click.stop>
          <view class="popup-header">
            <text class="popup-title">选择颜色</text>
            <view @click="showColorPicker = false"><text class="iconfont icon-guanbi" style="font-size:20px;color:#999"></text></view>
          </view>
          <view class="color-picker-current">
            <view class="current-color-block" :style="{ background: editColor }"></view>
            <text class="current-color-text">{{ editColor }}</text>
          </view>
          <scroll-view scroll-y class="color-picker-list">
            <view class="color-group" v-for="group in groupedPalette" :key="group.name">
              <text class="color-group-name">{{ group.name }}</text>
              <view class="color-grid">
                <view v-for="color in group.colors" :key="color.hex" class="color-cell" :class="{ selected: editColor.toUpperCase() === color.hex.toUpperCase() }" :style="{ background: color.hex }" @click="editColor = color.hex; showColorPicker = false">
                  <text class="color-cell-code">{{ getColorKey(color.hex, selectedBrand) }}</text>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>
    </view>

    <!-- 弹窗：发布到广场 -->
    <view v-if="showPublishDialog" class="popup-mask" @click="showPublishDialog = false">
      <view class="popup-panel publish-panel" @click.stop>
        <view class="popup-header">
          <text class="popup-title">发布到图纸广场</text>
          <view @click="showPublishDialog = false"><text class="iconfont icon-guanbi" style="font-size:20px;color:#999"></text></view>
        </view>
        <view class="publish-body">
          <text class="publish-label">标题</text>
          <input type="text" v-model="publishTitle" class="publish-input" placeholder="给你的图纸起个名字" maxlength="30" />
          <view class="publish-preview" v-if="patternGrid">
            <text class="publish-preview-info">{{ patternGrid.N }}×{{ patternGrid.M }} · {{ colorPalette.length }}色 · {{ totalBeadCount }}颗</text>
          </view>
          <view class="publish-btn-submit" :class="{ disabled: isPublishing }" @click="publishPattern">
            <text>{{ isPublishing ? '发布中...' : '确认发布' }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 隐藏 canvas（仅用于导出） -->
  </page>
</template>

<style scoped lang="less">
.editor-page {
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  background: #f0f2f5;
  overflow: hidden;
  position: relative;

  .canvas-topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 10px;
    flex-shrink: 0;
    z-index: 30;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;

    .topbar-btn {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 5px 10px;
      background: rgba(255, 255, 255, 0.85);
      border-radius: 6px;
      cursor: pointer;
      backdrop-filter: blur(6px);

      text { font-size: 12px; color: #333; }
    }
  }

  .stats-drawer {
    position: absolute;
    top: 40px;
    left: 0;
    right: 0;
    z-index: 25;
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid #e8e8e8;

    .stats-drawer-scroll { width: 100%; white-space: nowrap; }
    .stats-drawer-list { display: inline-flex; padding: 8px 10px; gap: 8px; }
    .stats-drawer-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      cursor: pointer;
      flex-shrink: 0;
      &.active .stats-drawer-swatch { box-shadow: 0 0 0 2px #487AFA; }
      .stats-drawer-swatch {
        width: 36px;
        height: 36px;
        border-radius: 6px;
        border: 1px solid #e0e0e0;
        display: flex;
        align-items: center;
        justify-content: center;
        .stats-drawer-code { font-size: 8px; font-weight: 700; color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,0.5); }
      }
      .stats-drawer-count { font-size: 9px; color: #999; }
    }
  }

  .layer-dropdown {
    position: absolute;
    top: 40px;
    right: 8px;
    width: 220px;
    max-height: 360px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    z-index: 25;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .layer-dropdown-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 12px;
      border-bottom: 1px solid #f0f0f0;
      flex-shrink: 0;
      .layer-dropdown-title { font-size: 13px; font-weight: 600; color: #333; }
      .layer-dropdown-actions { display: flex; gap: 6px;
        .layer-action-btn { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 6px; background: #f5f7fa; cursor: pointer; }
      }
    }
    .layer-dropdown-list { flex: 1; max-height: 300px; }
    .layer-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      cursor: pointer;
      border-bottom: 1px solid #f8f8f8;
      &.active { background: rgba(72,122,250,0.06); }
      .layer-thumb {
        width: 32px; height: 32px; border-radius: 4px; border: 1px solid #e0e0e0; overflow: hidden; flex-shrink: 0; display: flex; align-items: center; justify-content: center;
        .layer-thumb-grid { width: 100%; height: 100%; display: flex; flex-direction: column;
          .layer-thumb-row { display: flex; flex: 1;
            .layer-thumb-cell { flex: 1; border: 0.5px solid rgba(0,0,0,0.05); }
          }
        }
      }
      .layer-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px;
        .layer-name { font-size: 12px; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .layer-size { font-size: 10px; color: #999; }
      }
      .layer-controls { display: flex; gap: 4px; flex-shrink: 0;
        .layer-ctrl-btn { width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; border-radius: 4px; cursor: pointer; }
      }
    }
  }

  .grid-scroll {
    flex: 1;
    width: 100%;
    background: #e8eaed;
    overflow: hidden;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .canvas-wrapper {
    position: relative;
    flex-shrink: 0;
    touch-action: none;
    transform-origin: center center;
  }
  .display-canvas {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
  }
  .display-canvas:first-child {
    position: relative;
  }
  .grid-layer {
    z-index: 1;
  }
  .original-overlay {
    position: absolute;
    transform-origin: center center;
    touch-action: none;
    flex-shrink: 0;
    opacity: 0.7;
    z-index: 10;
  }

  .tool-sidebar {
    position: absolute;
    left: 8px;
    top: 25%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px 6px;
    background: rgba(255,255,255,0.95);
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.1);
    z-index: 20;

    .tool-btn {
      width: 44px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 6px 0;
      border-radius: 8px;
      cursor: pointer;
      gap: 2px;
      &.active { background: rgba(72,122,250,0.12); }
      .tool-icon { font-size: 18px; line-height: 1; }
      .tool-label { font-size: 9px; color: #666; line-height: 1; }
      &.active .tool-label { color: #487AFA; }
      &.color-btn .color-preview { width: 20px; height: 20px; border-radius: 5px; border: 2px solid #e0e0e0; }
    }
    .tool-divider { width: 28px; height: 1px; background: #e0e0e0; }
  }

  .fab-source {
    position: absolute;
    bottom: 68px;
    left: 8px;
    width: 48px;
    height: 48px;
    border-radius: 8px;
    overflow: hidden;
    border: 2px solid #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.12);
    z-index: 20;
    cursor: pointer;
    .fab-source-img {
      width: 100%;
      height: 100%;
    }
    .fab-source-label {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 1px 0;
      background: rgba(0,0,0,0.5);
      text-align: center;
      font-size: 8px;
      color: #fff;
    }
  }

  .fab-toolbar {
    position: absolute;
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 10px;
    background: rgba(255,255,255,0.95);
    border-radius: 14px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.1);
    z-index: 20;

    .fab-btn {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      cursor: pointer;
      .fab-icon { font-size: 18px; }
      &.primary { .fab-icon { color: #333 !important; } }
      &.publish-btn { min-width: 36px; width: auto; padding: 0 6px;
        .fab-save-text { font-size: 13px; color: #333; font-weight: 500; white-space: nowrap; }
      }
      &.disabled { opacity: 0.35; }
    }
    .fab-divider { width: 1px; height: 20px; background: #e0e0e0; margin: 0 2px; }
  }
}

// ===== 弹窗 =====
.popup-mask {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.45);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}
.popup-panel {
  width: 85%;
  max-height: 75%;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .popup-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    border-bottom: 1px solid #f0f0f0;
    flex-shrink: 0;
    .popup-title { font-size: 16px; font-weight: 600; color: #333; }
  }
}
.cell-popup {
  .cell-popup-info {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    border-bottom: 1px solid #f0f0f0;
    .cell-popup-color { width: 44px; height: 44px; border-radius: 8px; border: 1px solid #e0e0e0; }
    .cell-popup-detail { display: flex; flex-direction: column; gap: 4px;
      .cell-popup-hex { font-size: 14px; font-family: monospace; color: #333; }
      .cell-popup-code { font-size: 12px; color: #999; }
    }
  }
  .cell-popup-actions {
    display: flex;
    flex-wrap: wrap;
    padding: 12px 16px;
    gap: 10px;
    .cell-action-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 10px 16px;
      background: #f5f7fa;
      border-radius: 10px;
      cursor: pointer;
      text { font-size: 13px; color: #333; }
      &:active { background: #e8eaed; }
    }
  }
}
.color-picker-panel {
  max-height: 80%;
  height: 70vh;
  .color-picker-current {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;
    flex-shrink: 0;
    .current-color-block { width: 36px; height: 36px; border-radius: 8px; border: 1px solid #e0e0e0; }
    .current-color-text { font-size: 14px; color: #666; font-family: monospace; }
  }
  .color-picker-list {
    height: 0;
    flex: 1;
    padding: 8px 12px;
    .color-group {
      margin-bottom: 12px;
      .color-group-name { font-size: 12px; color: #999; margin-bottom: 8px; display: block; }
      .color-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        .color-cell {
          width: 42px; height: 42px; border-radius: 8px; border: 2px solid transparent; display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative;
          &.selected { border-color: #487AFA; box-shadow: 0 0 0 2px rgba(72,122,250,0.3); }
          .color-cell-code { font-size: 8px; font-weight: 600; color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,0.5); }
        }
      }
    }
  }
}
.publish-panel {
  width: 80%;
  .publish-body {
    padding: 16px;
    .publish-label { font-size: 13px; color: #666; margin-bottom: 8px; display: block; }
    .publish-input { width: 100%; height: 40px; border: 1px solid #dcdfe6; border-radius: 8px; padding: 0 12px; font-size: 14px; box-sizing: border-box; margin-bottom: 14px; }
    .publish-preview { margin-bottom: 16px;
      .publish-preview-info { font-size: 12px; color: #999; }
    }
    .publish-btn-submit { width: 100%; height: 42px; background: #67C23A; border-radius: 10px; display: flex; align-items: center; justify-content: center; cursor: pointer;
      text { font-size: 15px; color: #fff; font-weight: 600; }
      &.disabled { opacity: 0.6; }
      &:active { opacity: 0.9; }
    }
  }
}
</style>
