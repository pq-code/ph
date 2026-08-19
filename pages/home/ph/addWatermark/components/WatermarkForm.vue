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
       <!-- 定位输入框 -->
        <template v-if="field.type === 'dinwei'">
        <u-input
          v-model="modelValue[field.field]"
          :placeholder="field.placeholder"
          @input="onInputChange"
          :suffixIcon="field.suffixIcon"
          :suffixIconStyle="field.suffixIconStyle"
           :customStyle="{zIndex: '0'}"
        >
          <template #suffix>
            <view style="color: #007AFF;" @click.stop="getLocation">
              定位
            </view>
          </template>
        </u-input>
        </template>

        <!-- 开关 -->
        <template v-if="field.type === 'switch'">
          <u-switch v-model="modelValue[field.field]" @change="onInputChange"></u-switch>
        </template>
      
        <!-- 滑块 -->
        <template v-if="field.type === 'slider'">
          <view style="display: flex; align-items: center">
            <view style="width: 83%">
              <u-slider 
                v-model="modelValue[field.field]" 
                :min="field.min" 
                :max="field.max"
                :step="field.step || 1"
                activeColor="#007AFF"
                @changing="(e)=>spacingSize(e,field.field)"
              ></u-slider>
            </view>
            <view>
              {{ `${modelValue[field.field] || 0}${field.unit}` }}
            </view>
          </view>
        </template>

        <!-- 输入框 -->
        <template v-if="field.type === 'input'">
          <u-input 
            v-model="modelValue[field.field]"
            :placeholder="field.placeholder"
            @input="onInputChange"
            :customStyle="{zIndex: '0'}"
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
             :customStyle="{zIndex: '0'}"
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

         <!-- 按钮 -->
         <template v-if="field.type === 'button'">
          <u-button
            :placeholder="field.placeholder"
            @click="onInputChange"
          />
        </template>

        <!-- 选择器 -->
        <template v-if="field.type === 'select'">
          <u-picker
            :show="showPickerMap[field.field] || false"
            :columns="[field.options || []]"
            keyName="label"
            @confirm="(e) => handleSelectConfirm(e, field.field)"
            @cancel="showPickerMap[field.field] = false"
            :closeOnClickOverlay="true"
          />
          <u-input
            :value="getSelectDisplayValue(field)"
            :placeholder="field.placeholder || '请选择'"
            @click="showPickerMap[field.field] = true"
            :clearable="false"
            right-icon="arrow-down"
            :customStyle="{zIndex: '0'}"
            readonly
          />
        </template>
      </u-form-item>
    </u-form>

    <MapDisplay
      v-if="showMap"
      :latitude="latitude"
      :longitude="longitude"
      :markers="covers"
      @closeMap="closeMap"
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
console.log('props=====', props)

const showMap = ref(false)
const emit = defineEmits(['dataChanged', 'update:modelValue']); // 添加缺失的事件声明

const showPicker = ref(false)
const tempDate = ref(dayjs().valueOf())
const showPickerMap = ref({}) // 用于管理多个picker的显示状态

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

const closeMap = (item) => {
  showMap.value = false
  emit('update:modelValue',{
    ...props.modelValue,
    longitude : Number(item.longitude).toFixed(6),
    latitude : Number(item.latitude).toFixed(6),
    address : item.address
  });
}

const spacingSize = (value,field) => {
  emit('update:modelValue',{
    ...props.modelValue,
    [field] : value
  });
}

// 获取经纬度
const getLocation = () => {
  uni.chooseLocation({
    success: (res) => {
      console.log('chooseLocation', res)
       emit('update:modelValue',{
        ...props.modelValue,
        longitude : Number(res.longitude).toFixed(6),
        latitude : Number(res.latitude).toFixed(6),
        address : res.address
      });
    }
  })
}

// 获取选择器的显示值
const getSelectDisplayValue = (field) => {
  const currentValue = props.modelValue[field.field]
  if (!currentValue) return ''
  const option = field.options?.find(opt => opt.value === currentValue || opt.label === currentValue)
  return option?.label || currentValue
}

// 处理选择器确认
const handleSelectConfirm = (e, field) => {
  const selectedItem = e.value[0]
  const selectedValue = selectedItem?.value || selectedItem?.label
  emit('update:modelValue', {
    ...props.modelValue,
    [field]: selectedValue
  })
  showPickerMap.value[field] = false
  onInputChange()
}
</script>

<style lang="less" scoped>
.watermark-form {
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
}

.u-form-item__body__right__content__slot {
  .u-popup {
    flex: 0;
  }
}

.slider-value {
  text-align: right;
  color: #666;
  font-size: 14px;
  margin-top: 8px;
}
</style>
