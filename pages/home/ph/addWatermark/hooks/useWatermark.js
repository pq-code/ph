import { ref } from 'vue'
import dayjs from 'dayjs'

export const useWatermark = (canvasId) => {
  // 绘制中间大水印
  const drawCenterWatermark = (ctx, imageRect) => {
    const { x: imageX, y: imageY, drawWidth: imageWidth, drawHeight: imageHeight } = imageRect
    
    ctx.save()
    
    // 计算中心点和字体大小
    const centerX = imageX + imageWidth / 2
    const centerY = imageY + imageHeight / 2
    const centerFontSize = Math.min(imageWidth, imageHeight) * 0.08
    
    // 移动到中心点
    ctx.translate(centerX, centerY)
    
    // 设置文字样式
    ctx.setTextAlign('center')
    ctx.setTextBaseline('middle')
    ctx.setFontSize(centerFontSize)
    ctx.font = `bold ${centerFontSize}px sans-serif`
    
    const centerText = "现场拍照"
    
    // 绘制白色描边
    ctx.setGlobalAlpha(0.5)
    ctx.setLineWidth(2)
    ctx.setStrokeStyle('#FFFFFF')
    ctx.strokeText(centerText, 0, 0)
    
    // 绘制主体文字
    ctx.setGlobalAlpha(0.5)
    ctx.setFillStyle('#666666')
    ctx.fillText(centerText, 0, 0)
    
    ctx.restore()
  }
  
  // 绘制底部信息水印
  const drawBottomWatermark = (ctx, imageRect, info) => {
    const { x: imageX, y: imageY, drawWidth: imageWidth, drawHeight: imageHeight } = imageRect
    
    // 设置文字样式
    const fontSize = 14
    ctx.setFontSize(fontSize)
    ctx.setTextAlign('left')
    ctx.setTextBaseline('top')
    
    // 准备水印文字内容
    const watermarkLines = [
      `经度：${info.longitude || '121.0126'}`,
      `纬度：${info.latitude || '31.288511'}`,
      `坐标：WGS84坐标系`,
      `地址：${info.address || ''}`,
      `时间：${dayjs().format('YYYY-MM-DD HH:mm:ss')}`,
      `备注：${info.remark || '编辑备注'}`
    ]
    
    // 调整行间距，设置较宽的行高，比如 fontSize * 1.5
    const padding = 10
    const lineHeight = fontSize * 1.5
    const totalHeight = watermarkLines.length * lineHeight
    let currentY = imageY + imageHeight - totalHeight - padding
    
    // 绘制文字
    ctx.setGlobalAlpha(1)
    ctx.setFillStyle('#FFFFFF')
    
    watermarkLines.forEach(line => {
      ctx.fillText(line, imageX + padding * 1, currentY)
      currentY += lineHeight
    })
  }

  const addWatermark = async ({ image, style, info }) => {
    if (!image?.path) {
      console.error('无效的图片路径')
      return
    }

    try {
      const ctx = uni.createCanvasContext(canvasId)
      
      // 清空画布
      ctx.clearRect(0, 0, image.canvasWidth, image.canvasHeight)
      
      // 绘制原图
      ctx.drawImage(
        image.path,
        image.x,
        image.y,
        image.drawWidth,
        image.drawHeight
      )
      
      const imageRect = {
        x: image.x,
        y: image.y,
        drawWidth: image.drawWidth,
        drawHeight: image.drawHeight
      }
      
      // 绘制中间水印
      drawCenterWatermark(ctx, imageRect)
      
      // 绘制底部信息水印
      drawBottomWatermark(ctx, imageRect, info)
      
      // 应用绘制
      await new Promise(resolve => ctx.draw(false, resolve))
      
    } catch (error) {
      console.error('绘制失败:', error)
      uni.showToast({
        title: '绘制失败',
        icon: 'none'
      })
    }
  }

  return {
    addWatermark
  }
}

