import { ref } from 'vue'

export const useWatermark = (canvasId) => {
  // 绘制图片
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

