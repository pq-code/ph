// 水印类型配置
export const WATERMARK_TYPES = [
  {
    id: 1,
    name: '现场拍照',
    description: '包含完整位置信息',
    preview: '/static/assets/images/watermark/xcpz.jpg',
    style: {
      showLocation: true,
      showTime: true,
      showNotes: true,
      textStyle: {
        color: '#FFFFFF',
        strokeColor: '#000000',
        fontSize: 0.04,
        opacity: 1
      }
    }
  },
  {
    id: 2,
    name: '标准水印',
    description: '仅显示位置信息',
    preview: '/static/watermark/type2.png',
    style: {
      showLocation: true,
      showTime: false,
      showNotes: false,
      textStyle: {
        color: '#FFFFFF',
        strokeColor: '#000000',
        fontSize: 0.03,
        opacity: 0.8
      }
    }
  },
  {
    id: 3,
    name: '时间水印',
    description: '突出显示时间信息',
    preview: '/static/watermark/type3.png',
    style: {
      showLocation: false,
      showTime: true,
      showNotes: true,
      textStyle: {
        color: '#FFFFFF',
        strokeColor: '#000000',
        fontSize: 0.03,
        opacity: 0.9
      }
    }
  }
]

// 表单字段配置
export const FORM_FIELDS = {
  location: [
    {
      field: 'longitude',
      label: '经度',
      type: 'input',
      required: false,
      placeholder: '请输入经度'
    },
    {
      field: 'latitude',
      label: '纬度',
      type: 'input',
      required: false,
      placeholder: '请输入纬度'
    },
    {
      field: 'address',
      label: '地址',
      type: 'input',
      required: false,
      placeholder: '请输入地址'
    }
  ],
  time: [
    {
      field: 'time',
      label: '时间',
      type: 'datetime',
      required: false,
      placeholder: '请选择时间'
    }
  ],
  notes: [
    {
      field: 'notes',
      label: '备注',
      type: 'textarea',
      required: false,
      placeholder: '请输入备注信息',
      maxlength: 100
    }
  ]
} 
