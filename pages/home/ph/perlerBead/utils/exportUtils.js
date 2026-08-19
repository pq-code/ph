/**
 * 拼豆图纸导出工具
 * - 绘制带坐标轴的图纸
 * - 生成带统计信息的完整导出图
 */

import { getColorKey } from './colorData'
import QRCode from 'qrcode-generator'

/**
 * 裁切网格四周空白区域
 */
export function cropGrid(grid, N, M) {
  let top = 0, bottom = M - 1, left = 0, right = N - 1
  while (top <= bottom && grid[top].every(c => !c)) top++
  while (bottom >= top && grid[bottom].every(c => !c)) bottom++
  while (left <= right && grid.every(row => !row[left])) left++
  while (right >= left && grid.every(row => !row[right])) right++
  if (top > bottom || left > right) return { grid, N, M }
  const cropped = []
  for (let r = top; r <= bottom; r++) cropped.push(grid[r].slice(left, right + 1))
  return { grid: cropped, N: right - left + 1, M: bottom - top + 1 }
}

/**
 * 在 canvas 上绘制二维码
 */
function drawQRCode(ctx, text, x, y, size, dpr) {
  const qr = QRCode(0, 'M')
  qr.addData(text)
  qr.make()
  const modules = qr.getModuleCount()
  const cellPx = size / modules

  ctx.setFillStyle('#FFFFFF')
  ctx.fillRect(x, y, size, size)

  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      if (qr.isDark(r, c)) {
        ctx.setFillStyle('#000000')
        ctx.fillRect(x + c * cellPx, y + r * cellPx, Math.ceil(cellPx), Math.ceil(cellPx))
      }
    }
  }
}

/** 根据背景色计算对比文字色 */
function getContrastColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luma = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
  return luma > 0.5 ? '#000000' : '#FFFFFF'
}

/**
 * 绘制一批行的格子（内部辅助）
 */
function drawRows(ctx, grid, N, M, cellSize, options, startRow, endRow) {
  const {
    showGrid = true,
    showCode = true,
    gridInterval = 10,
    brand = 'MARD',
    dpr = 1,
    highlightColor = ''
  } = options

  const axisSize = options.showCoordinates ? Math.round(24 * dpr) : 0
  const offsetX = axisSize
  const offsetY = axisSize
  const realCell = Math.round(cellSize * dpr)
  const gridLineWidth = Math.max(1, Math.round(0.5 * dpr))
  const showCodeNow = showCode && cellSize >= 5
  const fontSize = showCodeNow ? Math.max(Math.round(5 * dpr), Math.floor(realCell * 0.45)) : 0

  for (let row = startRow; row < endRow && row < M; row++) {
    for (let col = 0; col < N; col++) {
      const cell = grid[row][col]
      const x = offsetX + col * realCell
      const y = offsetY + row * realCell

      ctx.setFillStyle(cell ? cell.hex : '#FFFFFF')
      ctx.fillRect(x, y, realCell, realCell)

      if (showGrid) {
        ctx.setStrokeStyle('#CCCCCC')
        ctx.setLineWidth(gridLineWidth)
        ctx.strokeRect(x, y, realCell, realCell)
      }

      if (showCodeNow && cell) {
        const code = getColorKey(cell.hex, brand)
        ctx.setFillStyle(getContrastColor(cell.hex))
        ctx.setFontSize(fontSize)
        ctx.setTextAlign('center')
        ctx.setTextBaseline('middle')
        ctx.fillText(code, x + realCell / 2, y + realCell / 2)
      }

      if (highlightColor && cell && cell.hex !== highlightColor) {
        ctx.setFillStyle('rgba(0,0,0,0.55)')
        ctx.fillRect(x, y, realCell, realCell)
      }
    }
  }
}

/**
 * 绘制分隔线
 */
function drawSeparators(ctx, N, M, cellSize, options) {
  const { gridInterval = 10, dpr = 1 } = options
  if (gridInterval <= 0) return

  const axisSize = options.showCoordinates ? Math.round(24 * dpr) : 0
  const offsetX = axisSize
  const offsetY = axisSize
  const realCell = Math.round(cellSize * dpr)
  const separatorWidth = Math.max(1.5, Math.round(1.5 * dpr))

  ctx.setStrokeStyle('#888888')
  ctx.setLineWidth(separatorWidth)

  for (let col = gridInterval; col < N; col += gridInterval) {
    const x = offsetX + col * realCell
    ctx.beginPath()
    ctx.moveTo(x, offsetY)
    ctx.lineTo(x, offsetY + M * realCell)
    ctx.stroke()
  }

  for (let row = gridInterval; row < M; row += gridInterval) {
    const y = offsetY + row * realCell
    ctx.beginPath()
    ctx.moveTo(offsetX, y)
    ctx.lineTo(offsetX + N * realCell, y)
    ctx.stroke()
  }
}

/**
 * 在 uni-app canvas 上绘制图纸（分批绘制，避免超出小程序 canvas 操作上限）
 * @param {Object} ctx - uni.createCanvasContext 返回的上下文
 * @param {Array} grid - 像素网格
 * @param {number} N - 横向格子数
 * @param {number} M - 纵向格子数
 * @param {number} cellSize - 每格像素大小
 * @param {Object} options - { showGrid, showCode, gridInterval, showCoordinates, brand, dpr, highlightColor }
 * @param {Function} callback - 绘制完成回调
 * @param {number} batchSize - 每批绘制的行数（默认 20）
 */
export function drawPatternOnCanvas(ctx, grid, N, M, cellSize, options = {}, callback, batchSize = 20) {
  const dpr = options.dpr || 1
  const axisSize = options.showCoordinates ? Math.round(24 * dpr) : 0
  const realCell = Math.round(cellSize * dpr)
  const borderW = Math.max(1.5, Math.round(1.5 * dpr))

  const totalW = N * realCell + axisSize * 2
  const totalH = M * realCell + axisSize * 2

  // 清空 + 白色背景
  ctx.clearRect(0, 0, totalW, totalH)
  ctx.setFillStyle('#FFFFFF')
  ctx.fillRect(0, 0, totalW, totalH)

  // 坐标轴
  if (options.showCoordinates) {
    ctx.setFillStyle('#F0F0F0')
    ctx.fillRect(axisSize, 0, N * realCell, axisSize)                 // 上
    ctx.fillRect(0, axisSize, axisSize, M * realCell)                 // 左
    ctx.fillRect(axisSize, axisSize + M * realCell, N * realCell, axisSize)  // 下
    ctx.fillRect(axisSize + N * realCell, axisSize, axisSize, M * realCell)  // 右

    const fontSize = Math.max(Math.round(4 * dpr), Math.floor(realCell * 0.45))
    ctx.setFillStyle('#333333')
    ctx.setFontSize(fontSize)
    // 上方列号
    ctx.setTextAlign('center')
    ctx.setTextBaseline('middle')
    for (let col = 0; col < N; col++) {
      ctx.fillText(String(col + 1), axisSize + col * realCell + realCell / 2, axisSize / 2)
    }
    // 下方列号
    for (let col = 0; col < N; col++) {
      ctx.fillText(String(col + 1), axisSize + col * realCell + realCell / 2, axisSize + M * realCell + axisSize / 2)
    }
    // 左侧行号
    ctx.setTextAlign('right')
    for (let row = 0; row < M; row++) {
      ctx.fillText(String(row + 1), axisSize / 2, axisSize + row * realCell + realCell / 2)
    }
    // 右侧行号
    ctx.setTextAlign('left')
    for (let row = 0; row < M; row++) {
      ctx.fillText(String(row + 1), axisSize + N * realCell + 2 * dpr, axisSize + row * realCell + realCell / 2)
    }
  }

  // 分批绘制格子 + 分隔线 + 边框
  let startRow = 0
  const isLastBatch = (end) => end >= M

  function drawBatch() {
    const endRow = Math.min(startRow + batchSize, M)
    drawRows(ctx, grid, N, M, cellSize, options, startRow, endRow)

    if (isLastBatch(endRow)) {
      // 最后一批：绘制分隔线（仅在显示网格时）和边框
      if (options.showGrid !== false) drawSeparators(ctx, N, M, cellSize, options)
      ctx.setStrokeStyle('#000000')
      ctx.setLineWidth(borderW)
      ctx.strokeRect(axisSize, axisSize, N * realCell, M * realCell)
      ctx.draw(true, () => {
        if (callback) callback()
      })
    } else {
      ctx.draw(true, () => {
        startRow = endRow
        drawBatch()
      })
    }
  }

  drawBatch()
}

/**
 * 绘制带品牌信息的图纸（打印版）
 * 布局：图纸 + 颜色图例 + 底部信息栏
 */
export function drawPatternWithBranding(ctx, grid, N, M, cellSize, options = {}, userInfo = {}, callback, batchSize = 20) {
  const dpr = options.dpr || 1
  const axisSize = options.showCoordinates ? Math.round(24 * dpr) : 0
  const realCell = Math.round(cellSize * dpr)
  const borderW = Math.max(1.5, Math.round(1.5 * dpr))
  const brand = options.brand || 'MARD'

  const patternW = N * realCell + axisSize * 2
  const patternH = M * realCell + axisSize * 2

  // 统计每种颜色的用量
  const colorMap = {}
  for (let r = 0; r < M; r++) {
    for (let c = 0; c < N; c++) {
      const cell = grid[r][c]
      if (!cell) continue
      const hex = cell.hex.toUpperCase()
      if (!colorMap[hex]) {
        colorMap[hex] = { hex, count: 0, code: getColorKey(hex, brand) }
      }
      colorMap[hex].count++
    }
  }
  const colorList = Object.values(colorMap).sort((a, b) => b.count - a.count)
  const colorCount = colorList.length

  // 图例区域布局
  const padding = Math.round(16 * dpr)
  const legendSwatch = Math.round(16 * dpr)
  const legendFontSize = Math.round(11 * dpr)
  const legendLineH = Math.round(22 * dpr)
  const legendCols = Math.max(1, Math.floor((patternW - padding * 2) / Math.round(140 * dpr)))
  const legendColW = Math.floor((patternW - padding * 2) / legendCols)
  const legendRows = Math.ceil(colorCount / legendCols)
  const legendH = Math.round(28 * dpr) + legendRows * legendLineH + Math.round(8 * dpr)

  // 底部信息栏
  const barH = Math.round(56 * dpr)
  const totalW = patternW
  const totalH = patternH + legendH + barH

  // 先绘制图纸部分
  drawPatternOnCanvas(ctx, grid, N, M, cellSize, options, () => {

    // ========== 颜色图例 ==========
    const legendY = patternH
    ctx.setFillStyle('#FFFFFF')
    ctx.fillRect(0, legendY, totalW, legendH)

    // 图例标题
    ctx.setFillStyle('#333333')
    ctx.setFontSize(Math.round(13 * dpr))
    ctx.setTextAlign('left')
    ctx.setTextBaseline('top')
    ctx.fillText(`颜色图例（共 ${colorCount} 色）`, padding, legendY + Math.round(6 * dpr))

    // 每个颜色条目
    const listStartY = legendY + Math.round(28 * dpr)
    colorList.forEach((item, i) => {
      const col = i % legendCols
      const row = Math.floor(i / legendCols)
      const x = padding + col * legendColW
      const y = listStartY + row * legendLineH

      // 色块
      ctx.setFillStyle(item.hex)
      ctx.fillRect(x, y + Math.round(3 * dpr), legendSwatch, legendSwatch)
      ctx.setStrokeStyle('#CCCCCC')
      ctx.setLineWidth(Math.max(1, Math.round(0.5 * dpr)))
      ctx.strokeRect(x, y + Math.round(3 * dpr), legendSwatch, legendSwatch)

      // 色号 + 数量
      ctx.setFillStyle('#333333')
      ctx.setFontSize(legendFontSize)
      ctx.setTextAlign('left')
      ctx.setTextBaseline('top')
      ctx.fillText(`${item.code}  ×${item.count}`, x + legendSwatch + Math.round(6 * dpr), y + Math.round(5 * dpr))
    })

    // 分隔线
    ctx.setFillStyle('#E0E0E0')
    ctx.fillRect(0, legendY + legendH - Math.max(1, Math.round(1 * dpr)), totalW, Math.max(1, Math.round(1 * dpr)))

    // ========== 底部信息栏 ==========
    const barY = patternH + legendH
    ctx.setFillStyle('#FFFFFF')
    ctx.fillRect(0, barY, totalW, barH)

    // 用户名
    const userName = userInfo.userName || '拼豆爱好者'
    ctx.setFillStyle('#333333')
    ctx.setFontSize(Math.round(14 * dpr))
    ctx.setTextAlign('left')
    ctx.setTextBaseline('top')
    ctx.fillText(userName, padding, barY + Math.round(10 * dpr))

    // 统计信息
    const totalBeads = options.totalBeads || 0
    const statsText = `${N}×${M}  ${colorCount}色  ${totalBeads}颗`
    ctx.setFillStyle('#999999')
    ctx.setFontSize(Math.round(11 * dpr))
    ctx.fillText(statsText, padding, barY + Math.round(30 * dpr))

    // 来源水印（右侧）
    ctx.setFillStyle('#CCCCCC')
    ctx.setFontSize(Math.round(10 * dpr))
    ctx.setTextAlign('right')
    ctx.fillText('PH拼豆图纸编辑器', totalW - padding, barY + Math.round(10 * dpr))

    ctx.draw(true, () => {
      if (callback) callback({ width: totalW, height: totalH })
    })
  }, batchSize)
}

/**
 * 绘制图纸 + 底部颜色图例 + 二维码
 * 普通导出使用：图纸下方显示颜色统计和小程序码
 */
export function drawPatternWithLegend(ctx, grid, N, M, cellSize, options = {}, colorStats = [], callback, batchSize = 20) {
  const dpr = options.dpr || 1
  const axisSize = options.showCoordinates ? Math.round(24 * dpr) : 0
  const realCell = Math.round(cellSize * dpr)
  const brand = options.brand || 'MARD'

  const patternW = N * realCell + axisSize * 2
  const patternH = M * realCell + axisSize * 2
  const padding = Math.round(16 * dpr)

  // 底部图例区域
  const legendFontSize = Math.round(11 * dpr)
  const legendLineH = Math.round(22 * dpr)
  const legendCols = Math.max(1, Math.floor((patternW - padding * 2 - Math.round(70 * dpr)) / Math.round(130 * dpr)))
  const legendColW = Math.floor((patternW - padding * 2 - Math.round(70 * dpr)) / legendCols)
  const legendRows = Math.ceil(colorStats.length / legendCols)
  const legendH = colorStats.length > 0 ? Math.round(28 * dpr) + legendRows * legendLineH + Math.round(8 * dpr) : 0

  // 二维码区域
  const qrSize = Math.round(60 * dpr)

  const barH = Math.max(legendH, qrSize + Math.round(16 * dpr))
  const totalW = patternW
  const totalH = patternH + barH

  drawPatternOnCanvas(ctx, grid, N, M, cellSize, options, () => {
    const barY = patternH

    // 白色背景
    ctx.setFillStyle('#FFFFFF')
    ctx.fillRect(0, barY, totalW, barH)

    // 分隔线
    ctx.setFillStyle('#E0E0E0')
    ctx.fillRect(0, barY, totalW, Math.max(1, Math.round(1 * dpr)))

    // 颜色图例
    if (colorStats.length > 0) {
      ctx.setFillStyle('#333333')
      ctx.setFontSize(Math.round(13 * dpr))
      ctx.setTextAlign('left')
      ctx.setTextBaseline('top')
      ctx.fillText(`颜色统计（共 ${colorStats.length} 色）`, padding, barY + Math.round(6 * dpr))

      const listStartY = barY + Math.round(28 * dpr)
      colorStats.forEach((item, i) => {
        const col = i % legendCols
        const row = Math.floor(i / legendCols)
        const x = padding + col * legendColW
        const y = listStartY + row * legendLineH

        // 色块
        ctx.setFillStyle(item.hex)
        const swatch = Math.round(14 * dpr)
        ctx.fillRect(x, y + Math.round(4 * dpr), swatch, swatch)
        ctx.setStrokeStyle('#CCCCCC')
        ctx.setLineWidth(Math.max(1, Math.round(0.5 * dpr)))
        ctx.strokeRect(x, y + Math.round(4 * dpr), swatch, swatch)

        // 色号 ×数量
        ctx.setFillStyle('#333333')
        ctx.setFontSize(legendFontSize)
        ctx.setTextAlign('left')
        ctx.setTextBaseline('top')
        ctx.fillText(`${item.code} ×${item.count}`, x + swatch + Math.round(6 * dpr), y + Math.round(5 * dpr))
      })
    }

    // 二维码（右侧）
    const qrX = totalW - padding - qrSize
    const qrY = barY + (barH - qrSize) / 2
    try {
      drawQRCode(ctx, 'https://mp.weixin.qq.com/wxamp/devprofile/get_profile', qrX, qrY, qrSize, dpr)
    } catch (e) {
      ctx.setFillStyle('#F0F0F0')
      ctx.fillRect(qrX, qrY, qrSize, qrSize)
      ctx.setFillStyle('#999999')
      ctx.setFontSize(Math.round(9 * dpr))
      ctx.setTextAlign('center')
      ctx.setTextBaseline('middle')
      ctx.fillText('小程序码', qrX + qrSize / 2, qrY + qrSize / 2)
    }

    ctx.draw(true, () => {
      if (callback) callback({ width: totalW, height: totalH })
    })
  }, batchSize)
}

/**
 * 计算绘制尺寸（屏幕预览用，限制在 1200×2000 内）
 */
export function calculateDrawSize(N, M, options = {}) {
  const { showCoordinates = true, dpr = 1 } = options
  const axisSize = showCoordinates ? Math.round(24 * dpr) : 0
  const maxCanvasWidth = 1200
  const targetCell = 18
  let cellSize = Math.max(8, Math.floor(maxCanvasWidth / N))
  if (cellSize > targetCell) cellSize = targetCell
  const maxH = 2000
  if (M * cellSize + axisSize * 2 > maxH) {
    cellSize = Math.max(8, Math.floor((maxH - axisSize * 2) / M))
  }
  const realCell = Math.round(cellSize * dpr)
  return {
    cellSize,
    width: N * realCell + axisSize * 2,
    height: M * realCell + axisSize * 2,
    dpr
  }
}

/**
 * 计算导出尺寸（不限画布大小，保证每个格子足够大以显示清晰色号）
 * @param {number} targetCell - 目标格子像素大小（默认 30）
 */
export function calculateExportSize(N, M, options = {}) {
  const { showCoordinates = true, dpr = 1, targetCell = 30 } = options
  const axisSize = showCoordinates ? Math.round(24 * dpr) : 0
  const cellSize = targetCell
  const realCell = Math.round(cellSize * dpr)
  return {
    cellSize,
    width: N * realCell + axisSize * 2,
    height: M * realCell + axisSize * 2,
    dpr
  }
}
