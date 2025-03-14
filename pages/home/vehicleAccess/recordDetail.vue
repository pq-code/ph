<script setup>
import { ref, reactive, onMounted } from 'vue';
import dayjs from 'dayjs';
import page from "@/components/pages/page.vue";

// 记录ID
const recordId = ref('');

// 车辆通行详情信息
const recordDetail = reactive({
  id: '',
  plateNumber: '',
  entryTime: '',
  exitTime: '',
  status: '', // 'in'表示在场内，'out'表示已出场
  parkingDuration: '',
  fee: 0,
  parkingLocation: '',
  vehicleType: '',
  memberType: '',
  paymentStatus: ''
});

// 计费规则
const feeRules = reactive({
  hourlyRate: 5, // 每小时收费（元）
  maxDailyFee: 50, // 每天最高收费（元）
  firstHourFree: true, // 首小时免费
  memberDiscount: 0.8 // 会员折扣
});

// 获取记录详情
const fetchRecordDetail = () => {
  // 实际应用中应该从服务器获取数据
  // 这里模拟API调用
  uni.showLoading({
    title: '加载中...'
  });
  
  setTimeout(() => {
    // 模拟数据
    const now = dayjs();
    const entryTime = dayjs().subtract(3, 'hour');
    const isExited = Math.random() > 0.5;
    const exitTime = isExited ? dayjs().subtract(20, 'minute') : null;
    
    recordDetail.id = recordId.value;
    recordDetail.plateNumber = '浙A12345';
    recordDetail.entryTime = entryTime.format('YYYY-MM-DD HH:mm:ss');
    recordDetail.exitTime = exitTime ? exitTime.format('YYYY-MM-DD HH:mm:ss') : '';
    recordDetail.status = isExited ? 'out' : 'in';
    
    // 计算停车时长
    const duration = isExited 
      ? exitTime.diff(entryTime, 'minute') 
      : now.diff(entryTime, 'minute');
    
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    recordDetail.parkingDuration = `${hours}小时${minutes}分钟`;
    
    // 计算费用
    let fee = calculateFee(duration);
    recordDetail.fee = fee;
    
    // 其他信息
    recordDetail.parkingLocation = 'A区-12号';
    recordDetail.vehicleType = '小型轿车';
    recordDetail.memberType = Math.random() > 0.3 ? '普通会员' : '非会员';
    recordDetail.paymentStatus = isExited ? '已支付' : '未支付';
    
    uni.hideLoading();
  }, 1000);
};

// 计算停车费用
const calculateFee = (durationMinutes) => {
  // 将分钟转换为小时，向上取整
  let hours = Math.ceil(durationMinutes / 60);
  
  // 应用首小时免费规则
  if (feeRules.firstHourFree && hours > 0) {
    hours -= 1;
  }
  
  // 计算基本费用
  let fee = hours * feeRules.hourlyRate;
  
  // 应用每日最高收费限制
  fee = Math.min(fee, feeRules.maxDailyFee);
  
  // 应用会员折扣
  if (recordDetail.memberType && recordDetail.memberType !== '非会员') {
    fee = fee * feeRules.memberDiscount;
  }
  
  // 四舍五入到两位小数
  return Math.round(fee * 100) / 100;
};

// 手动开闸放行
const manualOpenGate = () => {
  if (recordDetail.status !== 'in') {
    uni.showToast({
      title: '车辆已不在场内',
      icon: 'none'
    });
    return;
  }
  
  uni.showModal({
    title: '确认操作',
    content: '确定要手动开闸放行该车辆吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showLoading({
          title: '处理中...'
        });
        
        // 模拟API调用
        setTimeout(() => {
          recordDetail.status = 'out';
          recordDetail.exitTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
          
          // 重新计算停车时长和费用
          const entryTime = dayjs(recordDetail.entryTime);
          const exitTime = dayjs(recordDetail.exitTime);
          const duration = exitTime.diff(entryTime, 'minute');
          
          const hours = Math.floor(duration / 60);
          const minutes = duration % 60;
          recordDetail.parkingDuration = `${hours}小时${minutes}分钟`;
          
          recordDetail.fee = calculateFee(duration);
          recordDetail.paymentStatus = '已支付';
          
          uni.hideLoading();
          uni.showToast({
            title: '已成功放行',
            icon: 'success'
          });
        }, 1500);
      }
    }
  });
};

// 修改车牌信息
const editPlateNumber = () => {
  uni.showModal({
    title: '修改车牌号',
    editable: true,
    placeholderText: recordDetail.plateNumber,
    success: (res) => {
      if (res.confirm && res.content) {
        recordDetail.plateNumber = res.content;
        uni.showToast({
          title: '车牌号已更新',
          icon: 'success'
        });
      }
    }
  });
};

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};

// 生命周期钩子
onMounted(() => {
  // 获取路由参数
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const options = currentPage.$page?.options;
  
  if (options && options.id) {
    recordId.value = options.id;
    fetchRecordDetail();
  } else {
    // uni.showToast({
    //   title: '记录ID不存在',
    //   icon: 'none'
    // });
    // setTimeout(() => {
    //   goBack();
    // }, 1500);
  }
});
</script>

<template>
  <page title="通行记录详情">
    <view class="record-detail">
      <!-- 顶部车辆信息卡片 -->
      <view class="vehicle-card">
        <view class="plate-number">
          <text>{{ recordDetail.plateNumber }}</text>
          <view class="edit-icon" @click="editPlateNumber">
            <u-icon name="edit-pen" size="18" color="#3c9cff"></u-icon>
          </view>
        </view>
        <view class="status-tag" :class="{'status-in': recordDetail.status === 'in', 'status-out': recordDetail.status === 'out'}">
          {{ recordDetail.status === 'in' ? '在场内' : '已出场' }}
        </view>
      </view>
      
      <!-- 详细信息列表 -->
      <view class="detail-section">
        <view class="section-title">
          <u-icon name="info-circle" size="18" color="#3c9cff"></u-icon>
          <text>基本信息</text>
        </view>
        
        <view class="info-list">
          <view class="info-item">
            <text class="info-label">入场时间</text>
            <text class="info-value">{{ recordDetail.entryTime }}</text>
          </view>
          
          <view class="info-item" v-if="recordDetail.exitTime">
            <text class="info-label">出场时间</text>
            <text class="info-value">{{ recordDetail.exitTime }}</text>
          </view>
          
          <view class="info-item">
            <text class="info-label">停车时长</text>
            <text class="info-value">{{ recordDetail.parkingDuration }}</text>
          </view>
          
          <view class="info-item">
            <text class="info-label">停车位置</text>
            <text class="info-value">{{ recordDetail.parkingLocation }}</text>
          </view>
          
          <view class="info-item">
            <text class="info-label">车辆类型</text>
            <text class="info-value">{{ recordDetail.vehicleType }}</text>
          </view>
          
          <view class="info-item">
            <text class="info-label">会员类型</text>
            <text class="info-value">{{ recordDetail.memberType }}</text>
          </view>
        </view>
      </view>
      
      <!-- 计费信息 -->
      <view class="detail-section">
        <view class="section-title">
          <u-icon name="rmb-circle" size="18" color="#3c9cff"></u-icon>
          <text>计费信息</text>
        </view>
        
        <view class="fee-card">
          <view class="fee-amount">
            <text class="fee-currency">¥</text>
            <text class="fee-number">{{ recordDetail.fee.toFixed(2) }}</text>
          </view>
          
          <view class="fee-status" :class="{'fee-paid': recordDetail.paymentStatus === '已支付', 'fee-unpaid': recordDetail.paymentStatus !== '已支付'}">
            {{ recordDetail.paymentStatus }}
          </view>
        </view>
        
        <view class="fee-rules">
          <view class="rule-item">
            <text class="rule-label">计费规则</text>
            <text class="rule-value">{{ feeRules.hourlyRate }}元/小时，每日最高{{ feeRules.maxDailyFee }}元</text>
          </view>
          
          <view class="rule-item" v-if="feeRules.firstHourFree">
            <text class="rule-label">优惠政策</text>
            <text class="rule-value">首小时免费</text>
          </view>
          
          <view class="rule-item" v-if="recordDetail.memberType !== '非会员'">
            <text class="rule-label">会员折扣</text>
            <text class="rule-value">{{ (feeRules.memberDiscount * 10).toFixed(1) }}折</text>
          </view>
        </view>
      </view>
      
      <!-- 操作按钮 -->
      <view class="action-buttons">
        <u-button type="primary" @click="goBack">返回列表</u-button>
        <u-button 
          type="warning" 
          :disabled="recordDetail.status !== 'in'"
          @click="manualOpenGate"
        >
          手动放行
        </u-button>
      </view>
    </view>
  </page>
</template>

<style lang="less" scoped>
.record-detail {
  padding: 15px;
  background-color: #f5f7fa;
  min-height: 100%;
}

.vehicle-card {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
  
  .plate-number {
    display: flex;
    align-items: center;
    
    text {
      font-size: 24px;
      font-weight: bold;
      color: #303133;
    }
    
    .edit-icon {
      margin-left: 10px;
      padding: 5px;
      
      &:active {
        opacity: 0.7;
      }
    }
  }
  
  .status-tag {
    padding: 4px 12px;
    border-radius: 15px;
    font-size: 14px;
    
    &.status-in {
      background-color: rgba(25, 190, 107, 0.1);
      color: #19be6b;
    }
    
    &.status-out {
      background-color: rgba(144, 147, 153, 0.1);
      color: #909399;
    }
  }
}

.detail-section {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
  
  .section-title {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    
    text {
      font-size: 16px;
      font-weight: bold;
      margin-left: 8px;
    }
  }
}

.info-list {
  .info-item {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.03);
    
    &:last-child {
      border-bottom: none;
    }
    
    .info-label {
      color: #909399;
      font-size: 14px;
    }
    
    .info-value {
      color: #303133;
      font-size: 14px;
      font-weight: 500;
    }
  }
}

.fee-card {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  
  .fee-amount {
    display: flex;
    align-items: baseline;
    
    .fee-currency {
      font-size: 16px;
      color: #fa3534;
      margin-right: 2px;
    }
    
    .fee-number {
      font-size: 28px;
      font-weight: bold;
      color: #fa3534;
    }
  }
  
  .fee-status {
    padding: 4px 12px;
    border-radius: 15px;
    font-size: 14px;
    
    &.fee-paid {
      background-color: rgba(25, 190, 107, 0.1);
      color: #19be6b;
    }
    
    &.fee-unpaid {
      background-color: rgba(250, 53, 52, 0.1);
      color: #fa3534;
    }
  }
}

.fee-rules {
  .rule-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    
    .rule-label {
      color: #909399;
      font-size: 14px;
    }
    
    .rule-value {
      color: #606266;
      font-size: 14px;
    }
  }
}

.action-buttons {
  display: flex;
  gap: 15px;
  margin-top: 20px;
  
  :deep(.u-button) {
    flex: 1;
  }
}
</style>
