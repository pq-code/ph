<template>
  <view class="watermark-form">
    <u-form 
      ref="form1"
      labelWidth="100" 
      labelPosition="left" 
      labelAlign="left"  
      :model="modelValue" 
      :disabled="disabled"
    >

      <u-form-item 
        v-for="field in fields" 
        :key="field.field"
        :label="field.label"
        :required="field.required"
        
      >
        <!-- 输入框 -->
        <template v-if="field.type === 'input'">
          <u-input 
            v-model="modelValue[field.field]"
            :placeholder="field.placeholder"
          />
        </template>
        
        <!-- 时间选择器 -->
        <template v-else-if="field.type === 'datetime'">
          <u-datetime-picker
            v-model="modelValue[field.field]"
            :placeholder="field.placeholder"
          />
        </template>
        
        <!-- 文本域 -->
        <template v-else-if="field.type === 'textarea'">
          <u-textarea
            v-model="modelValue[field.field]"
            :placeholder="field.placeholder"
            :maxlength="field.maxlength"
          />
        </template>
      </u-form-item>
    </u-form>
  </view>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  fields: {
    type: Array,
    default: () => []
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang="less" scoped>
.watermark-form {
  background: #ffffff;
  border-radius: 8px;
  padding: 15px;
}
</style> 
