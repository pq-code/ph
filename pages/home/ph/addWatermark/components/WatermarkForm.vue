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
          <u-input 
            style="width: 100%;"
            v-model="modelValue[field.field]"
            :placeholder="field.placeholder"
            @focus="showPicker = true"
            :clearable="false"
            right-icon="calendar"
          />
          <u-datetime-picker
            :show="showPicker"
            v-model="tempDate"
            mode="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            :defaultValue="dayjs().valueOf()"
            @confirm="(value) => {
              handleDateConfirm(value,field.field)
            }"
            @cancel="showPicker = false"
            :closeOnClickOverlay="false"
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
    <MapDisplay 
      :latitude="latitude"
      :longitude="longitude"
      :markers="covers"
    />
  </view>
</template>

<script setup>
import { ref, watch } from 'vue';
import dayjs from 'dayjs'
import MapDisplay from './MapDisplay.vue'

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

const emit = defineEmits(['dataChanged', 'update:modelValue']); // 添加缺失的事件声明

const showPicker = ref(false)
const tempDate = ref(dayjs().valueOf())

// 保留 covers 的定义（如果需要在父组件操作标记点）
const covers = ref([{
  latitude: 39.90923,
  longitude: 116.397428,
  title: '当前位置'
}])

const handleDateConfirm = (value, field) => {
  const formattedDate = dayjs(value.value).format('YYYY-MM-DD HH:mm:ss');
  const newModelValue = { 
    ...props.modelValue, 
    [field] : formattedDate 
  };
  tempDate.value = formattedDate
  emit('update:modelValue', newModelValue);
  showPicker.value = false;
};

const onInputChange = () => {
  console.log('modelValue',props.modelValue)
  emit('update:modelValue', props.modelValue);
};

</script>

<style lang="less" scoped>
.watermark-form {
  background: #ffffff;
  border-radius: 8px;
  padding: 15px;
}
.u-form-item__body__right__content__slot {
  .u-popup {
    flex: 0;
  }
}

</style> 
