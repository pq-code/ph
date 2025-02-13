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
            @input="onInputChange"
          />
        </template>
        
        <!-- 时间选择器 -->
        <template v-else-if="field.type === 'datetime'">
          <u-datetime-picker
            v-model="modelValue[field.field]"
            :placeholder="field.placeholder"
            @change="onInputChange"
          />
        </template>
        
        <!-- 文本域 -->
        <template v-else-if="field.type === 'textarea'">
          <u-textarea
            v-model="modelValue[field.field]"
            :placeholder="field.placeholder"
            :maxlength="field.maxlength"
            @input="onInputChange"
          />
        </template>
      </u-form-item>
    </u-form>
  </view>
</template>

<script setup>
import { ref, watch } from 'vue';
const props = defineProps({
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


const emit = defineEmits(['dataChanged']);

const onInputChange = () => {
  console.log('modelValue',props.modelValue)
  emit('dataChanged', props.modelValue);
};

// 也可以使用 watch 监听 modelValue 的变化
watch(() => props.modelValue, (newValue) => {
  console.log('modelValue----',props.modelValue)
  emit('dataChanged', newValue);
  
}, { deep: true });

</script>

<style lang="less" scoped>
.watermark-form {
  background: #ffffff;
  border-radius: 8px;
  padding: 15px;
}
</style> 
