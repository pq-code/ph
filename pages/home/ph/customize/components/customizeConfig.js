
export const CUSTOMIZE_FORM_LIST = [
  {
    field: 'scale',
    label: '图片尺寸',
    type: 'slider',
    required: false,
    max: 200,
    min: 10,
    step: 1,
    unit: '%',
    placeholder: '缩放比例（10%-200%）'
  },
  {
    field: 'quality',
    label: '图片质量',
    type: 'slider',
    required: false,
    max: 100,
    min: 10,
    step: 1,
    unit: '%',
    placeholder: '压缩质量（10%-100%，数值越小文件越小）'
  },
  {
    field: 'presetSize',
    label: '预设尺寸',
    type: 'select',
    required: false,
    options: [
      { label: '自定义', value: 'custom' },
      { label: '微信头像 (640×640)', value: '640x640' },
      { label: '朋友圈 (1080×1080)', value: '1080x1080' },
      { label: '朋友圈横图 (1080×566)', value: '1080x566' },
      { label: '朋友圈竖图 (566×1080)', value: '566x1080' },
      { label: '小红书 (1080×1440)', value: '1080x1440' },
      { label: '抖音 (1080×1920)', value: '1080x1920' },
      { label: '微博 (1200×675)', value: '1200x675' }
    ]
  }
]
