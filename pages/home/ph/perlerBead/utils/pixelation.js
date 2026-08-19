/**
 * 拼豆图纸核心算法模块
 * - Oklab 感知色距
 * - 主导色提取
 * - 像素网格计算
 * - 杂色清理
 */

// ========== 颜色空间转换 ==========

/** sRGB 通道转线性 */
function srgbToLinear(channel) {
  const normalized = channel / 255
  return normalized <= 0.04045
    ? normalized / 12.92
    : Math.pow((normalized + 0.055) / 1.055, 2.4)
}

/** sRGB 转 Oklab */
function rgbToOklab(rgb) {
  const r = srgbToLinear(rgb.r)
  const g = srgbToLinear(rgb.g)
  const b = srgbToLinear(rgb.b)

  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b

  const lRoot = Math.cbrt(l)
  const mRoot = Math.cbrt(m)
  const sRoot = Math.cbrt(s)

  return {
    l: 0.2104542553 * lRoot + 0.7936177850 * mRoot - 0.0040720468 * sRoot,
    a: 1.9779984951 * lRoot - 2.4285922050 * mRoot + 0.4505937099 * sRoot,
    b: 0.0259040371 * lRoot + 0.7827717662 * mRoot - 0.8086757660 * sRoot
  }
}

// Oklab 缓存
const oklabCache = new Map()

function getOklab(rgb) {
  const key = `${rgb.r},${rgb.g},${rgb.b}`
  if (oklabCache.has(key)) return oklabCache.get(key)
  const oklab = rgbToOklab(rgb)
  oklabCache.set(key, oklab)
  return oklab
}

/**
 * Oklab 感知色距（×100 保持与阈值兼容）
 */
export function colorDistance(rgb1, rgb2) {
  const ok1 = getOklab(rgb1)
  const ok2 = getOklab(rgb2)
  const dl = ok1.l - ok2.l
  const da = ok1.a - ok2.a
  const db = ok1.b - ok2.b
  return Math.sqrt(dl * dl + da * da + db * db) * 100
}

/**
 * 在色板中查找最接近的颜色
 */
export function findClosestColor(targetRgb, palette) {
  let minDist = Infinity
  let closest = palette[0]
  for (const color of palette) {
    const dist = colorDistance(targetRgb, color.rgb)
    if (dist < minDist) {
      minDist = dist
      closest = color
      if (dist === 0) break
    }
  }
  return closest
}

// ========== 主导色提取 ==========

/**
 * 计算区域内主导色（出现频率最高的颜色）
 * 相比均值池化，能消除色块边界的灰色毛边
 */
function calculateDominantColor(data, imgWidth, startX, startY, cellW, cellH) {
  const colorCounts = {}
  let maxCount = 0
  let dominant = null
  let pixelCount = 0

  const endX = startX + cellW
  const endY = startY + cellH

  for (let y = startY; y < endY; y++) {
    for (let x = startX; x < endX; x++) {
      const idx = (y * imgWidth + x) * 4
      // 忽略透明像素
      if (data[idx + 3] < 128) continue
      pixelCount++

      const key = `${data[idx]},${data[idx + 1]},${data[idx + 2]}`
      colorCounts[key] = (colorCounts[key] || 0) + 1
      if (colorCounts[key] > maxCount) {
        maxCount = colorCounts[key]
        const parts = key.split(',')
        dominant = { r: +parts[0], g: +parts[1], b: +parts[2] }
      }
    }
  }

  return pixelCount === 0 ? null : dominant
}

/**
 * 计算区域内平均色
 */
function calculateAverageColor(data, imgWidth, startX, startY, cellW, cellH) {
  let rSum = 0, gSum = 0, bSum = 0, count = 0
  const endX = startX + cellW
  const endY = startY + cellH

  for (let y = startY; y < endY; y++) {
    for (let x = startX; x < endX; x++) {
      const idx = (y * imgWidth + x) * 4
      if (data[idx + 3] < 128) continue
      count++
      rSum += data[idx]
      gSum += data[idx + 1]
      bSum += data[idx + 2]
    }
  }

  if (count === 0) return null
  return {
    r: Math.round(rSum / count),
    g: Math.round(gSum / count),
    b: Math.round(bSum / count)
  }
}

// ========== 核心像素化 ==========

/**
 * 计算像素网格
 * @param {ImageData} imageData - 图片像素数据
 * @param {number} imgWidth - 图片宽度
 * @param {number} imgHeight - 图片高度
 * @param {number} N - 横向格子数
 * @param {number} M - 纵向格子数
 * @param {Array} palette - 色板
 * @param {string} mode - 'dominant' | 'average'
 * @returns {Array<Array<{hex: string, key: string, rgb: Object}>>}
 */
export function calculatePixelGrid(imageData, imgWidth, imgHeight, N, M, palette, mode = 'dominant') {
  const data = imageData.data
  const cellW = imgWidth / N
  const cellH = imgHeight / M
  const grid = []

  for (let row = 0; row < M; row++) {
    const rowData = []
    for (let col = 0; col < N; col++) {
      const startX = Math.floor(col * cellW)
      const startY = Math.floor(row * cellH)
      const endX = Math.min(imgWidth, Math.ceil((col + 1) * cellW))
      const endY = Math.min(imgHeight, Math.ceil((row + 1) * cellH))
      const w = Math.max(1, endX - startX)
      const h = Math.max(1, endY - startY)

      const representative = mode === 'dominant'
        ? calculateDominantColor(data, imgWidth, startX, startY, w, h)
        : calculateAverageColor(data, imgWidth, startX, startY, w, h)

      if (representative) {
        const closest = findClosestColor(representative, palette)
        rowData.push(closest)
      } else {
        rowData.push({ hex: '#FFFFFF', key: '#FFFFFF', rgb: { r: 255, g: 255, b: 255 } })
      }
    }
    grid.push(rowData)
  }

  return grid
}

// ========== 杂色清理 ==========

/**
 * 合并相似颜色（杂色清理）
 * 按颜色频率排序，将低频相似色合并到高频色
 * @param {Array} grid - 像素网格
 * @param {number} N - 横向格子数
 * @param {number} M - 纵向格子数
 * @param {number} threshold - Oklab 距离阈值（默认 30）
 * @returns {Array} 处理后的网格
 */
export function mergeSimilarColors(grid, N, M, threshold = 30) {
  if (threshold <= 0) return grid

  // 1. 统计颜色频率
  const colorCounts = {}
  for (let row = 0; row < M; row++) {
    for (let col = 0; col < N; col++) {
      const cell = grid[row][col]
      if (cell && cell.hex) {
        const key = cell.hex.toUpperCase()
        colorCounts[key] = (colorCounts[key] || 0) + 1
      }
    }
  }

  // 2. 按频率降序排列
  const colorsByFreq = Object.entries(colorCounts)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0])

  // 3. 建立 hex -> color data 映射
  const hexToColor = new Map()
  for (let row = 0; row < M; row++) {
    for (let col = 0; col < N; col++) {
      const cell = grid[row][col]
      if (cell) hexToColor.set(cell.hex.toUpperCase(), cell)
    }
  }

  // 4. 合并相似色
  const replaced = new Set()
  const replaceMap = new Map()

  for (let i = 0; i < colorsByFreq.length; i++) {
    const currentHex = colorsByFreq[i]
    if (replaced.has(currentHex)) continue

    const currentColor = hexToColor.get(currentHex)
    if (!currentColor) continue

    for (let j = i + 1; j < colorsByFreq.length; j++) {
      const lowerHex = colorsByFreq[j]
      if (replaced.has(lowerHex)) continue

      const lowerColor = hexToColor.get(lowerHex)
      if (!lowerColor) continue

      const dist = colorDistance(currentColor.rgb, lowerColor.rgb)
      if (dist < threshold) {
        replaced.add(lowerHex)
        replaceMap.set(lowerHex, currentHex)
      }
    }
  }

  // 5. 应用替换
  if (replaceMap.size === 0) return grid

  const newGrid = grid.map(row =>
    row.map(cell => {
      const key = cell.hex.toUpperCase()
      if (replaceMap.has(key)) {
        return hexToColor.get(replaceMap.get(key)) || cell
      }
      return cell
    })
  )

  return newGrid
}

// ========== 颜色统计 ==========

/**
 * 统计各颜色用量
 * @param {Array} grid - 像素网格
 * @returns {{ colorCounts: Object, totalCount: number }}
 */
export function calculateColorStats(grid) {
  const colorCounts = {}
  let totalCount = 0

  for (const row of grid) {
    for (const cell of row) {
      if (cell && cell.hex) {
        const key = cell.hex.toUpperCase()
        if (!colorCounts[key]) {
          colorCounts[key] = { count: 0, color: cell }
        }
        colorCounts[key].count++
        totalCount++
      }
    }
  }

  return { colorCounts, totalCount }
}
