/**
 * 图片处理工具类
 */
export class ImageUtils {
  /**
   * 获取图片信息
   */
  static getImageInfo(src) {
    return new Promise((resolve, reject) => {
      uni.getImageInfo({
        src,
        success: resolve,
        fail: reject
      })
    })
  }

  /**
   * 计算图片适配参数
   * @param {Object} imageInfo - 原始图片信息
   * @param {Object} canvasInfo - 画布信息
   * @returns {Object} 计算后的绘制参数
   */
  static calculateFitSize(imageInfo, canvasInfo) {
    const { width: imgWidth, height: imgHeight } = imageInfo
    const { width: canvasWidth, height: canvasHeight } = canvasInfo

    // 计算最佳缩放比例
    const scaleWidth = canvasWidth / imgWidth
    const scaleHeight = canvasHeight / imgHeight
    const scale = Math.min(scaleWidth, scaleHeight)

    // 计算缩放后的尺寸
    const displayWidth = Math.floor(imgWidth * scale)
    const displayHeight = Math.floor(imgHeight * scale)

    // 计算居中位置
    const x = Math.floor((canvasWidth - displayWidth) / 2)
    const y = Math.floor((canvasHeight - displayHeight) / 2)

    return {
      x,
      y,
      width: displayWidth,
      height: displayHeight,
      scale,
      originalWidth: imgWidth,
      originalHeight: imgHeight
    }
  }
}
