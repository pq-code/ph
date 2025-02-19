import { ref } from 'vue'

export const useWatermarkForm = () => {
  const formData = ref({
    text: '',
    datetime: '',
    remark: ''
  })
  

  const validateForm = (fields) => {
    const requiredFields = fields.filter(f => f.required)
    for (const field of requiredFields) {
      if (!formData.value[field.field]) {
        uni.showToast({
          title: `请${field.placeholder}`,
          icon: 'none'
        })
        return false
      }
    }
    return true
  }

  return {
    formData,
    validateForm
  }
} 
