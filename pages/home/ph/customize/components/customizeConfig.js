
export const CUSTOMIZE_FORM_LIST = [
  {
    field: 'quality',
    label: '压缩大小',
    type: 'slider',
    required: false,
    max: 100,
    min: 1,
    unit: '%',
    placeholder: '请输入压缩率'
  },
  {
    field: 'scale',
    label: '图片尺寸',
    type: 'slider',
    required: false,
    max: 100,
    min: 1,
    unit: '%',
    placeholder: '缩放'
  },
  {
    field: 'width',
    label: '宽',
    type: 'input',
    required: false,

    unit: 'px',
    placeholder: '请输入宽'
  },
  {
    field: 'height',
    label: '高',
    type: 'input',
    required: false,
    unit: 'px',
    placeholder: '请输入高'
  },
]
