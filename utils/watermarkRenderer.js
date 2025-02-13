import dayjs from 'dayjs'

export class WatermarkRenderer {
  constructor(ctx) {
    this.ctx = ctx
  }

  /**
   * 渲染水印
   */
  async render(options) {
    const { image, text, info } = options
    
    // 清除画布并绘制原图
    await this.drawImage(image)
    
    // 绘制中心水印文字
    this.drawCenterText(text, image)
    
    // 绘制信息水印
    this.drawInfoText(info, image)
    
    // 完成绘制
    this.ctx.draw(true)
  }

  /**
   * 绘制原始图片
   */
  async drawImage(image) {
    const { url, x, y, width, height } = image
    this.ctx.clearRect(0, 0, width, height)
    await this.ctx.drawImage(url, x, y, width, height)
  }

  /**
   * 绘制中心水印文字
   */
  drawCenterText(text, image) {
    const { width, height, x, y } = image
    
    this.ctx.save()
    
    // 计算字体大小和位置
    const fontSize = Math.min(width, height) * 0.05
    const centerX = x + width / 2
    const centerY = y + height / 2
    
    // 设置文字样式
    this.ctx.setFontSize(fontSize)
    this.ctx.setTextAlign('center')
    this.ctx.setTextBaseline('middle')
    this.ctx.translate(centerX, centerY)
    
    // 绘制白色描边
    this.ctx.setGlobalAlpha(1)
    this.ctx.setLineWidth(2)
    this.ctx.setStrokeStyle('#FFFFFF')
    this.ctx.strokeText(text, 0, 0)
    
    // 绘制主体文字
    this.ctx.setGlobalAlpha(1)
    this.ctx.setFillStyle('#666666')
    this.ctx.font = `normal ${fontSize}px sans-serif`
    this.ctx.fillText(text, 0, 0)
    
    this.ctx.restore()
  }

  /**
   * 绘制信息水印
   */
  drawInfoText(info, image) {
    const { width, height, x, y } = image
    
    this.ctx.save()
    
    // 设置文字样式
    const fontSize = 12
    this.ctx.setFontSize(fontSize)
    this.ctx.setTextAlign('left')
    this.ctx.setTextBaseline('top')
    this.ctx.setGlobalAlpha(1)
    this.ctx.setFillStyle('#FFFFFF')
    
    // 准备水印文本
    const lines = this.getWatermarkLines(info)
    
    // 计算位置并绘制
    const padding = 15
    const lineHeight = fontSize + 2
    let currentY = height - (lines.length * lineHeight) - padding + y
    
    lines.forEach(line => {
      this.ctx.setShadow(1, 1, 2, 'rgba(0, 0, 0, 0.5)')
      this.ctx.fillText(line, padding + x, currentY)
      currentY += lineHeight
    })
    
    this.ctx.restore()
  }

  /**
   * 获取水印文本行
   */
  getWatermarkLines(info) {
    const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss')
    return [
      `经度：${info.longitude}`,
      `纬度：${info.latitude}`,
      `坐标：WGS84坐标系`,
      `地址：${info.address}`,
      `时间：${timestamp}`,
      `备注：${info.notes || ''}`
    ]
  }
} 
