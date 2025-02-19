import { ref } from 'vue'

export const useImageHandler = (canvasId) => {
  const imageInfo = ref({
    canvasWidth: 0,
    canvasHeight: 0,
    url: ''
  })
  const originalImage = ref(null)
  const isProcessing = ref(false)
  // 计算图片在容器中的绘制尺寸
  const calculateDrawSize = (containerWidth, containerHeight, imageWidth, imageHeight) => {
    const containerRatio = containerWidth / containerHeight
    const imageRatio = imageWidth / imageHeight
    let drawWidth, drawHeight, x, y

    if (imageRatio > containerRatio) {
      // 图片较宽，以容器宽度为准
      drawWidth = containerWidth
      drawHeight = containerWidth / imageRatio
      x = 0
      y = (containerHeight - drawHeight) / 2
    } else {
      // 图片较高，以容器高度为准
      drawHeight = containerHeight
      drawWidth = containerHeight * imageRatio
      x = (containerWidth - drawWidth) / 2
      y = 0
    }

    return { drawWidth, drawHeight, x, y }
  }

  const handleImageSelect = async () => {
    try {
      isProcessing.value = true
      
      // 选择图片
      const { tempFiles } = await uni.chooseImage({
        count: 1,
        sizeType: ["original"],
        sourceType: ["album"],
      })

      const tempFile = tempFiles[0]
      
      // 获取容器尺寸
      const container = await new Promise(resolve => {
        const query = uni.createSelectorQuery()
        query.select('.preview-wrapper')
          .boundingClientRect(data => {
            resolve(data)
          }).exec()
      })

      // 获取图片信息
      const imgInfo = await new Promise((resolve, reject) => {
        uni.getImageInfo({
          src: tempFile.path,
          success: resolve,
          fail: reject
        })
      })

      // 计算绘制尺寸
      const { drawWidth, drawHeight, x, y } = calculateDrawSize(
        container.width,
        container.height,
        imgInfo.width,
        imgInfo.height
      )

      // 保存图片信息
      originalImage.value = tempFile
      imageInfo.value = {
        path: tempFile.path,          // 图片临时文件路径
        width: imgInfo.width,         // 图片原始宽度（单位：px）
        height: imgInfo.height,       // 图片原始高度（单位：px）
        fileSize: (tempFile.size / 1024).toFixed(0),  // 文件体积（单位：KB，四舍五入取整）
        x,                            // 图片在画布中的水平起始位置（单位：px）
        y,                            // 图片在画布中的垂直起始位置（单位：px）
        drawWidth,                    // 图片在画布中的绘制宽度（适配容器后的尺寸）
        drawHeight,                   // 图片在画布中的绘制高度（适配容器后的尺寸）
        canvasWidth: container.width,  // 画布容器实际宽度（预览区域宽度）
        canvasHeight: container.height // 画布容器实际高度（预览区域高度）
      }

      console.log('图片信息:', imageInfo.value)
      return imageInfo.value
      
    } catch (error) {
      console.error('选择图片失败:', error)
      uni.showToast({
        title: '选择图片失败',
        icon: 'none'
      })
    } finally {
      isProcessing.value = false
    }
  }


  //绘制图片
  const drawImage = async () => {
    try {
      const ctx = uni.createCanvasContext(canvasId)
      // 清空画布
      ctx.clearRect(0, 0, imageInfo.canvasWidth, imageInfo.canvasHeight)
      
      // 绘制原图
      ctx.drawImage(
        imageInfo.path,
        imageInfo.x,
        imageInfo.y,
        imageInfo.drawWidth,
        imageInfo.drawHeight
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
    imageInfo,
    isProcessing,
    handleImageSelect,
    drawImage
  }
}
