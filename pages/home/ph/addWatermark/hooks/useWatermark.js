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
      `时间：${info.datetime  || dayjs().format('YYYY-MM-DD HH:mm:ss')}`,
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
  // 绘制标准水印
  const drawStandardWatermark = (ctx, imageRect, info) => {
    const { x: imageX, y: imageY, drawWidth: imageWidth, drawHeight: imageHeight } = imageRect
    
    // 设置文字样式（比底部水印稍大的字体）
    const fontSize = 18
    ctx.save()  // 增加保存绘图状态
    ctx.setFontSize(fontSize)
    ctx.setTextAlign('center')  // 修改对齐方式为居中
    ctx.setTextBaseline('middle')
    ctx.font = `bold ${fontSize}px sans-serif`
    
    // 新增斜体重复水印实现
    ctx.translate(imageX + imageWidth/2, imageY + imageHeight/2)
    ctx.rotate(-15 * Math.PI / 180)
    ctx.setGlobalAlpha(0.3)  // 提高透明度值
    
    // 创建重复水印图案
    const watermarkText = info.company || '保密'
    const spacing = 100  // 增大水印间距
    const repeatX = Math.ceil(imageWidth / spacing) + 2  // 根据图片尺寸动态计算重复次数
    const repeatY = Math.ceil(imageHeight / spacing) + 2
    
    // 设置文字描边
    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = 2
    
    // 平铺绘制水印
    for(let x = -repeatX; x <= repeatX; x++) {
      for(let y = -repeatY; y <= repeatY; y++) {
        ctx.strokeText(watermarkText, x * spacing, y * spacing)  // 先描边
        ctx.fillText(watermarkText, x * spacing, y * spacing)     // 再填充
      }
    }
    
    ctx.restore()
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
	  
      if (style.id === 1) {
        // 绘制中间水印
        if (info.isOnSitePhotography) {
          drawCenterWatermark(ctx, imageRect)
        }
        // 绘制底部信息水印
        drawBottomWatermark(ctx, imageRect, info)
      } else if (style.id === 2) {
        // 基础水印
        drawStandardWatermark(ctx, imageRect, info)
      }
      
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

