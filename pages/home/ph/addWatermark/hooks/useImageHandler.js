import { ref } from 'vue'

export const useImageHandler = () => {
  const imageInfo = ref(null)
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
        query.select('.content-main')
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
        path: tempFile.path,
        width: imgInfo.width,
        height: imgInfo.height,
        x,
        y,
        drawWidth,
        drawHeight,
        canvasWidth: container.width,
        canvasHeight: container.height
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

  return {
    imageInfo,
    isProcessing,
    handleImageSelect
  }
}
