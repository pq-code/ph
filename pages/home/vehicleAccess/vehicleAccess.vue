<script setup >
import { ref, reactive, onMounted } from 'vue';
import dayjs from 'dayjs';
import page from "@/components/pages/page.vue";
// 停车场状态
const parkingStatus = reactive({
  totalSpaces: 200,
  availableSpaces: 78,
  occupancyRate: 61
});

// 闸机状态
const entranceGateOpen = ref(false);
const exitGateOpen = ref(false);
const emergencyMode = ref(false);

// 搜索关键词
const searchKeyword = ref('');

// 最近通行记录
const recentRecords = ref([
  { 
    id: '1', 
    plateNumber: '浙A12345', 
    time: dayjs().subtract(5, 'minute').format('YYYY-MM-DD HH:mm:ss'), 
    type: 'entry' 
  },
  { 
    id: '2', 
    plateNumber: '浙B54321', 
    time: dayjs().subtract(15, 'minute').format('YYYY-MM-DD HH:mm:ss'), 
    type: 'exit' 
  },
  { 
    id: '3', 
    plateNumber: '浙C98765', 
    time: dayjs().subtract(30, 'minute').format('YYYY-MM-DD HH:mm:ss'), 
    type: 'entry' 
  },
  { 
    id: '4', 
    plateNumber: '浙D56789', 
    time: dayjs().subtract(45, 'minute').format('YYYY-MM-DD HH:mm:ss'), 
    type: 'exit' 
  },
  { 
    id: '5', 
    plateNumber: '浙D56789', 
    time: dayjs().subtract(45, 'minute').format('YYYY-MM-DD HH:mm:ss'), 
    type: 'exit' 
  },{ 
    id: '6', 
    plateNumber: '浙D56789', 
    time: dayjs().subtract(45, 'minute').format('YYYY-MM-DD HH:mm:ss'), 
    type: 'exit' 
  },
]);

// 告警信息
const alarms = ref([
  {
    id: '1',
    title: '车牌识别异常',
    time: dayjs().subtract(10, 'minute').format('YYYY-MM-DD HH:mm:ss'),
    location: '入口闸机',
    description: '无法识别车牌号码，请检查摄像头是否正常工作。'
  },
  {
    id: '2',
    title: '闸机故障',
    time: dayjs().subtract(2, 'hour').format('YYYY-MM-DD HH:mm:ss'),
    location: '出口闸机',
    description: '闸机无法正常关闭，可能需要维修或重启系统。'
  }
]);

// 弹窗控制
const showAlarmDetails = ref(false);
const selectedAlarm = ref(null);

// 控制闸机
const controlGate = (gate, open) => {
  uni.showLoading({
    title: `${open ? '开启' : '关闭'}中...`
  });
  
  // 模拟API调用
  setTimeout(() => {
    if (gate === 'entrance') {
      entranceGateOpen.value = open;
    } else if (gate === 'exit') {
      exitGateOpen.value = open;
    }
    
    uni.hideLoading();
    uni.showToast({
      title: `${gate === 'entrance' ? '入口' : '出口'}闸机${open ? '开启' : '关闭'}成功`,
      icon: 'success'
    });
  }, 1000);
};

// 切换紧急模式
const toggleEmergencyMode = () => {
  uni.showLoading({
    title: `${emergencyMode.value ? '关闭' : '开启'}紧急模式中...`
  });
  
  // 模拟API调用
  setTimeout(() => {
    emergencyMode.value = !emergencyMode.value;
    
    // 紧急模式下自动打开所有闸机
    if (emergencyMode.value) {
      entranceGateOpen.value = true;
      exitGateOpen.value = true;
    }
    
    uni.hideLoading();
    uni.showToast({
      title: `紧急模式${emergencyMode.value ? '开启' : '关闭'}成功`,
      icon: 'success'
    });
  }, 1500);
};

// 获取最近通行记录
const fetchRecentRecords = () => {
  // 模拟API调用
  // 实际应用中应该从服务器获取数据
  console.log('获取最近通行记录');
};

// 搜索车辆
const searchVehicle = () => {
  if (!searchKeyword.value) {
    fetchRecentRecords();
    return;
  }
  
  const keyword = searchKeyword.value.toLowerCase();
  const filteredRecords = recentRecords.value.filter(record => 
    record.plateNumber.toLowerCase().includes(keyword)
  );
  
  recentRecords.value = filteredRecords;
};

// 处理告警
const handleAlarm = (alarm) => {
  selectedAlarm.value = alarm;
  showAlarmDetails.value = true;
};

// 解决告警
const resolveAlarm = () => {
  if (!selectedAlarm.value) return;
  
  const index = alarms.value.findIndex(item => item.id === selectedAlarm.value.id);
  if (index !== -1) {
    alarms.value.splice(index, 1);
  }
  
  showAlarmDetails.value = false;
  selectedAlarm.value = null;
  
  uni.showToast({
    title: '告警已处理',
    icon: 'success'
  });
};

// 清除所有告警
const clearAllAlarms = () => {
  uni.showModal({
    title: '确认操作',
    content: '确定要清除所有告警信息吗？',
    success: (res) => {
      if (res.confirm) {
        alarms.value = [];
        uni.showToast({
          title: '已清除所有告警',
          icon: 'success'
        });
      }
    }
  });
};

// 页面导航函数
// 跳转到车辆通行记录页面
const navigateToRecords = () => {
  uni.navigateTo({
    url: '/pages/home/vehicleAccess/records'
  });
};

// 跳转到车辆统计分析页面
const navigateToStatistics = () => {
  uni.navigateTo({
    url: '/pages/home/vehicleAccess/statistics'
  });
};

// 跳转到车辆管理页面
const navigateToVehicleManagement = () => {
  uni.navigateTo({
    url: '/pages/home/vehicleAccess/management'
  });
};

// 跳转到系统设置页面
const navigateToSettings = () => {
  uni.navigateTo({
    url: '/pages/home/vehicleAccess/settings'
  });
};
// 跳转到车辆通行记录详情页面
const navigateToRecordDetail = (record) => {
  uni.navigateTo({
    url: `/pages/home/vehicleAccess/recordDetail?id=${record.id}`
  });
};

// 生命周期钩子
onMounted(() => {
  // 模拟实时数据更新
  setInterval(() => {
    // 随机更新可用车位数量
    parkingStatus.availableSpaces = Math.floor(Math.random() * 20) + 70;
    parkingStatus.occupancyRate = Math.floor((parkingStatus.totalSpaces - parkingStatus.availableSpaces) / parkingStatus.totalSpaces * 100);
  }, 30000);
});

const recordsExpanded = ref(true);
const alarmsExpanded = ref(true);
const recordsListHeight = ref(300);
const alarmsListHeight = ref(200);

const toggleSection = (section) => {
  console.log('Toggle section:', section);
  if (section === 'records') {
    recordsExpanded.value = !recordsExpanded.value;
  } else if (section === 'alarms') {
    alarmsExpanded.value = !alarmsExpanded.value;
  }
};

const calculateListHeight = () => {
  const recordCount = recentRecords.value.length || 1;
  const alarmCount = alarms.value.length || 1;
  
  recordsListHeight.value = Math.min(350, Math.max(150, recordCount * 70));
  alarmsListHeight.value = Math.min(350, Math.max(150, alarmCount * 70));
};

onMounted(() => {
  calculateListHeight();
});


</script>


<template>
    <page title="车辆管理">
        <view class="vehicle-access">
            <!-- 头部状态栏和快捷功能 -->
            <view class="header">
                <!-- 停车场状态 -->
                <view class="status-info">
                    <view class="status-item" :class="{'status-good': parkingStatus.availableSpaces > 30, 'status-warning': parkingStatus.availableSpaces <= 30 && parkingStatus.availableSpaces > 10, 'status-danger': parkingStatus.availableSpaces <= 10}">
                        <text class="status-value">{{parkingStatus.availableSpaces}}</text>
                        <text class="status-label">可用车位</text>
                    </view>
                    <view class="status-item">
                        <text class="status-value">{{parkingStatus.occupancyRate}}%</text>
                        <text class="status-label">占用率</text>
                    </view>
                </view>
                
                <!-- 快捷功能 -->
                <view class="quick-actions">
                    <view class="action-item" @click="navigateToRecords">
                        <u-icon name="list" size="20" color="#3c9cff"></u-icon>
                        <text>记录</text>
                    </view>
                    <view class="action-item" @click="navigateToStatistics">
                        <u-icon name="chart" size="20" color="#3c9cff"></u-icon>
                        <text>统计</text>
                    </view>
                    <view class="action-item" @click="navigateToVehicleManagement">
                        <u-icon name="car" size="20" color="#3c9cff"></u-icon>
                        <text>管理</text>
                    </view>
                    <view class="action-item" @click="navigateToSettings">
                        <u-icon name="setting" size="20" color="#3c9cff"></u-icon>
                        <text>设置</text>
                    </view>
                </view>
            </view>

            <!-- 闸机控制区域 - 固定在顶部 -->
            <scroll-view scroll-x class="gate-control-scroll">
                <view class="gate-control">
                    <!-- 紧急模式按钮 -->
                    <view class="emergency-button" @click="toggleEmergencyMode" :class="{'active': emergencyMode}">
                        <u-icon name="error-circle" size="24" :color="emergencyMode ? '#ffffff' : '#fa3534'"></u-icon>
                        <text>{{emergencyMode ? '关闭紧急模式' : '紧急模式'}}</text>
                    </view>
                    
                    <!-- 入口闸机 -->
                    <view class="gate-card">
                        <view class="gate-header">
                            <text class="gate-title">入口闸机</text>
                            <view class="gate-status" :class="{'status-open': entranceGateOpen, 'status-closed': !entranceGateOpen}">
                                {{entranceGateOpen ? '已开启' : '已关闭'}}
                            </view>
                        </view>
                        <view class="gate-actions">
                            <view 
                                class="gate-button" 
                                :class="{'disabled': entranceGateOpen, 'active': !entranceGateOpen}" 
                                @click="controlGate('entrance', true)"
                            >
                                <u-icon name="arrow-upward" size="20" :color="entranceGateOpen ? '#c0c4cc' : '#ffffff'"></u-icon>
                                <text>开启</text>
                            </view>
                            <view 
                                class="gate-button" 
                                :class="{'disabled': !entranceGateOpen, 'active': entranceGateOpen}" 
                                @click="controlGate('entrance', false)"
                            >
                                <u-icon name="arrow-downward" size="20" :color="!entranceGateOpen ? '#c0c4cc' : '#ffffff'"></u-icon>
                                <text>关闭</text>
                            </view>
                        </view>
                    </view>
                    
                    <!-- 出口闸机 -->
                    <view class="gate-card">
                        <view class="gate-header">
                            <text class="gate-title">出口闸机</text>
                            <view class="gate-status" :class="{'status-open': exitGateOpen, 'status-closed': !exitGateOpen}">
                                {{exitGateOpen ? '已开启' : '已关闭'}}
                            </view>
                        </view>
                        <view class="gate-actions">
                            <view 
                                class="gate-button" 
                                :class="{'disabled': exitGateOpen, 'active': !exitGateOpen}" 
                                @click="controlGate('exit', true)"
                            >
                                <u-icon name="arrow-upward" size="20" :color="exitGateOpen ? '#c0c4cc' : '#ffffff'"></u-icon>
                                <text>开启</text>
                            </view>
                            <view 
                                class="gate-button" 
                                :class="{'disabled': !exitGateOpen, 'active': exitGateOpen}" 
                                @click="controlGate('exit', false)"
                            >
                                <u-icon name="arrow-downward" size="20" :color="!exitGateOpen ? '#c0c4cc' : '#ffffff'"></u-icon>
                                <text>关闭</text>
                            </view>
                        </view>
                    </view>
                </view>
            </scroll-view>

            <!-- 主要内容区域 - 可折叠列表 -->
            <view class="collapsible-content">
                <!-- 最近通行记录 -->
                <view class="collapsible-section">
                    <view class="collapsible-header" @click="toggleSection('records')">
                        <view class="header-left">
                            <u-icon name="list" size="20" color="#3c9cff" class="header-icon"></u-icon>
                            <text class="section-title">最近通行记录</text>
                        </view>
                        <view class="header-right">
                            <view @click.stop>
                                <u-button type="primary" size="mini" style="width: 80px;" @click="navigateToRecords">更多</u-button>
                            </view>
                            <view class="arrow-container" @click.stop="toggleSection('records')">
                                <u-icon :name="recordsExpanded ? 'arrow-up' : 'arrow-down'" size="20" color="#909399" class="arrow-icon"></u-icon>
                            </view>
                        </view>
                    </view>
                    
                    <view class="collapsible-body" v-show="recordsExpanded" :style="{height: recordsExpanded ? 'auto' : '0'}">
                        <view class="search-bar">
                            <u-search
                                v-model="searchKeyword"
                                placeholder="搜索车牌号"
                                @search="searchVehicle"
                                @clear="fetchRecentRecords"
                            ></u-search>
                        </view>
                        
                        <scroll-view scroll-y class="scrollable-list" :style="{height: recordsListHeight + 'px'}">
                            <view class="record-list">
                                <view 
                                    v-for="record in recentRecords" 
                                    :key="record.id" 
                                    class="record-item"
                                    :class="{'record-entry': record.type === 'entry', 'record-exit': record.type === 'exit'}"
                                    @click="navigateToRecordDetail(record)"
                                >
                                    <view class="record-icon">
                                        <u-icon :name="record.type === 'entry' ? 'arrow-down' : 'arrow-up'" :color="record.type === 'entry' ? '#19be6b' : '#fa3534'" size="24"></u-icon>
                                    </view>
                                    <view class="record-info">
                                        <view class="record-plate">{{record.plateNumber}}</view>
                                        <view class="record-time">{{record.time}}</view>
                                    </view>
                                    <view class="record-type">
                                        <u-tag :text="record.type === 'entry' ? '入场' : '出场'" :type="record.type === 'entry' ? 'success' : 'error'" size="mini"></u-tag>
                                    </view>
                                </view>
                                
                                <view v-if="recentRecords.length === 0" class="empty-list">
                                    <u-icon name="car" size="40" color="#c0c4cc"></u-icon>
                                    <text>暂无通行记录</text>
                                </view>
                            </view>
                        </scroll-view>
                    </view>
                </view>

                <!-- 告警信息 -->
                <view class="collapsible-section">
                    <view class="collapsible-header" @click="toggleSection('alarms')">
                        <view class="header-left">
                            <u-icon name="error-circle" size="20" color="#fa3534" class="header-icon"></u-icon>
                            <text class="section-title">告警信息</text>
                        </view>
                        <view class="header-right">
                            <view @click.stop>
                                <u-button type="warning" size="mini" style="width: 80px;" @click="clearAllAlarms" :disabled="alarms.length === 0">清除</u-button>
                            </view>
                            <view class="arrow-container" @click.stop="toggleSection('alarms')">
                                <u-icon :name="alarmsExpanded ? 'arrow-up' : 'arrow-down'" size="20" color="#909399" class="arrow-icon"></u-icon>
                            </view>
                        </view>
                    </view>
                    
                    <view class="collapsible-body" v-show="alarmsExpanded" :style="{height: alarmsExpanded ? 'auto' : '0'}">
                        <scroll-view scroll-y class="scrollable-list" :style="{height: alarmsListHeight + 'px'}">
                            <view class="alarm-list">
                                <view 
                                    v-for="alarm in alarms" 
                                    :key="alarm.id" 
                                    class="alarm-item"
                                    @click="handleAlarm(alarm)"
                                >
                                    <view class="alarm-icon">
                                        <u-icon name="error-circle" color="#fa3534" size="24"></u-icon>
                                    </view>
                                    <view class="alarm-info">
                                        <view class="alarm-title">{{alarm.title}}</view>
                                        <view class="alarm-time">{{alarm.time}}</view>
                                    </view>
                                    <view class="alarm-action">
                                        <u-icon name="arrow-right" size="16" color="#909399"></u-icon>
                                    </view>
                                </view>
                                
                                <view v-if="alarms.length === 0" class="empty-list">
                                    <u-icon name="checkmark-circle" size="40" color="#19be6b"></u-icon>
                                    <text>暂无告警信息</text>
                                </view>
                            </view>
                        </scroll-view>
                    </view>
                </view>
            </view>

            <!-- 告警详情弹窗 -->
            <u-popup :show="showAlarmDetails" mode="center" @close="showAlarmDetails = false" round="10">
                <view class="alarm-popup">
                    <view class="popup-header">
                        <text class="popup-title">告警详情</text>
                        <u-icon name="close" size="20" @click="showAlarmDetails = false"></u-icon>
                    </view>
                    <view class="popup-content" v-if="selectedAlarm">
                        <view class="detail-item">
                            <text class="detail-label">告警类型:</text>
                            <text class="detail-value">{{selectedAlarm.title}}</text>
                        </view>
                        <view class="detail-item">
                            <text class="detail-label">告警时间:</text>
                            <text class="detail-value">{{selectedAlarm.time}}</text>
                        </view>
                        <view class="detail-item">
                            <text class="detail-label">告警位置:</text>
                            <text class="detail-value">{{selectedAlarm.location}}</text>
                        </view>
                        <view class="detail-item">
                            <text class="detail-label">详细信息:</text>
                            <text class="detail-value">{{selectedAlarm.description}}</text>
                        </view>
                    </view>
                    <view class="popup-footer">
                        <u-button type="primary" @click="resolveAlarm">确认处理</u-button>
                    </view>
                </view>
            </u-popup>
        </view>
    </page>
</template>

<style lang="less" scoped>
.vehicle-access {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f5f7fa;
  overflow: hidden;
}

.header {
  padding: 12px 15px;
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
  
  .status-info {
    display: flex;
    gap: 15px;
    
    .status-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .status-value {
        font-size: 18px;
        font-weight: bold;
        
        &.status-good {
          color: #19be6b;
        }
        
        &.status-warning {
          color: #ff9900;
        }
        
        &.status-danger {
          color: #fa3534;
        }
      }
      
      .status-label {
        font-size: 12px;
        color: #909399;
      }
    }
  }
  
  .quick-actions {
    display: flex;
    gap: 15px;
    
    .action-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      
      text {
        font-size: 12px;
        color: #606266;
      }
    }
  }
}

.gate-control-scroll {
  background-color: #ffffff;
  padding: 12px 0;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
  white-space: nowrap;
  
  .gate-control {
    display: inline-flex;
    padding: 0 15px;
    gap: 15px;
    
    .emergency-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 5px;
      background-color: rgba(250, 53, 52, 0.1);
      border-radius: 10px;
      padding: 10px;
      min-width: 90px;
      height: 100px;
      border: 1px solid #fa3534;
      
      text {
        font-size: 12px;
        color: #fa3534;
        text-align: center;
      }
      
      &.active {
        background-color: #fa3534;
        
        text {
          color: #ffffff;
        }
      }
    }
    
    .gate-card {
      background-color: #f8f9fa;
      border-radius: 10px;
      padding: 15px;
      min-width: 150px;
      height: 100px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      
      .gate-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .gate-title {
          font-size: 16px;
          font-weight: bold;
        }
        
        .gate-status {
          font-size: 12px;
          padding: 2px 8px;
          border-radius: 10px;
          
          &.status-open {
            background-color: rgba(25, 190, 107, 0.1);
            color: #19be6b;
          }
          
          &.status-closed {
            background-color: rgba(144, 147, 153, 0.1);
            color: #909399;
          }
        }
      }
      
      .gate-actions {
        display: flex;
        gap: 10px;
        
        .gate-button {
          flex: 1;
          height: 70px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          border-radius: 6px;
          background-color: #f0f0f0;
          padding: 0px;
          text {
            font-size: 12px;
            color: #606266;
          }
          
          &.active {
            background-color: #3c9cff;
            
            text {
              color: #ffffff;
            }
          }
          
          &.disabled {
            opacity: 0.6;
          }
        }
      }
    }
  }
}

.collapsible-content {
  padding: 10px;
  background-color: #f5f7fa;
//   flex: 1;
  overflow: auto;
}

.collapsible-section {
  background-color: #ffffff;
  border-radius: 10px;
  margin-bottom: 15px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.collapsible-header {
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  
  .header-left {
    display: flex;
    align-items: center;
    
    .header-icon {
      margin-right: 10px;
    }
    
    .section-title {
      margin-left: 10px;
      font-size: 16px;
      font-weight: bold;
      white-space: nowrap;
    }
  }
  
  .header-right {
    display: flex;
    align-items: center;
    
    .arrow-container {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 10px;
    }
    
    .arrow-icon {
      transition: transform 0.3s;
    }
  }
}

.collapsible-body {
  background-color: #ffffff;
  overflow: hidden;
  transition: height 0.3s ease;
}

.search-bar {
  padding: 10px 15px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.scrollable-list {
  padding: 10px 15px;
  width: auto;
}

.record-list, .alarm-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.record-item {
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
  
  &.record-entry {
    border-left: 3px solid #19be6b;
  }
  
  &.record-exit {
    border-left: 3px solid #fa3534;
  }
  
  &:active {
    background-color: #eaeaea;
  }
  
  .record-icon {
    margin-right: 10px;
    flex-shrink: 0;
  }
  
  .record-info {
    flex: 1;
    min-width: 0;
    
    .record-plate {
      font-size: 15px;
      font-weight: bold;
      margin-bottom: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .record-time {
      font-size: 12px;
      color: #909399;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  
  .record-type {
    margin-left: 10px;
    flex-shrink: 0;
  }
}

.alarm-item {
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
  border-left: 3px solid #fa3534;
  
  .alarm-icon {
    margin-right: 10px;
    flex-shrink: 0;
  }
  
  .alarm-info {
    flex: 1;
    min-width: 0;
    
    .alarm-title {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .alarm-time {
      font-size: 12px;
      color: #909399;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  
  .alarm-action {
    margin-left: 10px;
    flex-shrink: 0;
  }
}

.empty-list {
  padding: 30px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  
  text {
    font-size: 14px;
    color: #909399;
  }
}

.alarm-popup {
  width: 280px;
  padding: 20px;
  
  .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    
    .popup-title {
      font-size: 16px;
      font-weight: bold;
    }
  }
  
  .popup-content {
    .detail-item {
      margin-bottom: 12px;
      
      .detail-label {
        font-size: 14px;
        color: #909399;
        margin-bottom: 5px;
        display: block;
      }
      
      .detail-value {
        font-size: 14px;
        color: #303133;
        word-break: break-word;
      }
    }
  }
  
  .popup-footer {
    margin-top: 20px;
  }
}
</style>