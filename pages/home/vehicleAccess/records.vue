<script setup>
import { ref, reactive, onMounted, computed, nextTick } from 'vue';
import dayjs from 'dayjs';
import page from "@/components/pages/page.vue";

// 搜索关键词
const searchKeyword = ref('');

// 日期筛选
const dateRange = reactive({
  start: dayjs().format('YYYY-MM-DD'),
  end: dayjs().format('YYYY-MM-DD'),
  mode: 'day' // 'day', 'week', 'month', 'year', 'custom'
});
const dateRangeStart = computed(() => {
  return dayjs(dateRange.start).format('YYYY-MM-DD');
});
const dateRangeEnd = computed(() => {
  return dayjs(dateRange.end).format('YYYY-MM-DD');
});
// 筛选条件
const filterOptions = reactive({
  type: '', // 通行类型：entry-入场, exit-出场, all-全部
  status: '', // 支付状态：paid-已支付, unpaid-未支付, all-全部
  vehicleType: '' // 车辆类型：car-小型车, truck-大型车, all-全部
});

// 分页信息
const pagination = reactive({
  current: 1,
  size: 20,
  total: 0
});

// 记录列表
const records = ref([]);

// 加载状态
const loading = ref(false);
const refreshing = ref(false);
const loadingMore = ref(false);

// 是否显示筛选面板
const showFilterPanel = ref(false);

// 是否显示自定义日期选择
const showCustomDatePicker = ref(false);

// 添加日期选择器控制变量
const showStartDatePicker = ref(false);
const showEndDatePicker = ref(false);

// 是否还有更多数据
const hasMore = computed(() => {
  return pagination.current * pagination.size < pagination.total;
});

// 添加列表高度计算
const listHeight = ref(500); // 默认高度

// 计算列表高度的函数
const calculateListHeight = () => {
  nextTick(() => {
    const query = uni.createSelectorQuery();
    query.select('.records-page').boundingClientRect();
    query.select('.search-header').boundingClientRect();
    query.exec(res => {
      if (res && res[0] && res[1]) {
        const pageHeight = res[0].height;
        const headerHeight = res[1].height;
        // 减去底部按钮的高度（约60px）和一些额外的padding
        listHeight.value = pageHeight - headerHeight - 70;
        console.log('计算的列表高度:', listHeight.value);
      }
    });
  });
};

// 监听窗口大小变化
const handleResize = () => {
  calculateListHeight();
};

// 设置日期范围
const setDateRange = (mode) => {
  dateRange.mode = mode;
  
  switch (mode) {
    case 'day':
      // 今天
      dateRange.start = dayjs().format('YYYY-MM-DD');
      dateRange.end = dayjs().format('YYYY-MM-DD');
      break;
    case 'week':
      // 本周
      dateRange.start = dayjs().startOf('week').format('YYYY-MM-DD');
      dateRange.end = dayjs().endOf('week').format('YYYY-MM-DD');
      break;
    case 'month':
      // 本月
      dateRange.start = dayjs().startOf('month').format('YYYY-MM-DD');
      dateRange.end = dayjs().endOf('month').format('YYYY-MM-DD');
      break;
    case 'year':
      // 今年
      dateRange.start = dayjs().startOf('year').format('YYYY-MM-DD');
      dateRange.end = dayjs().endOf('year').format('YYYY-MM-DD');
      break;
    case 'custom':
      // 自定义时间范围，显示日期选择器
      showCustomDatePicker.value = true;
      break;
  }
  
  // 如果不是自定义模式，立即应用筛选
  if (mode !== 'custom') {
    fetchRecords(true);
  }
};

// 应用自定义日期范围
const applyCustomDateRange = () => {
  showCustomDatePicker.value = false;
  fetchRecords(true);
};

// 获取记录列表
const fetchRecords = (reset = false) => {
  if (reset) {
    pagination.current = 1;
    records.value = [];
  }
  
  loading.value = true;
  
  // 模拟API调用
  setTimeout(() => {
    // 模拟数据
    const mockData = [];
    const startIndex = (pagination.current - 1) * pagination.size;
    const count = Math.min(pagination.size, 100 - startIndex);
    
    for (let i = 0; i < count; i++) {
      const id = startIndex + i + 1;
      const isEntry = Math.random() > 0.5;
      const entryTime = dayjs().subtract(Math.floor(Math.random() * 7), 'day')
                              .subtract(Math.floor(Math.random() * 24), 'hour')
                              .subtract(Math.floor(Math.random() * 60), 'minute');
      const exitTime = isEntry ? null : entryTime.add(Math.floor(Math.random() * 5) + 1, 'hour');
      const isPaid = !isEntry ? Math.random() > 0.3 : false;
      
      mockData.push({
        id: id.toString(),
        plateNumber: `浙${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 90000) + 10000}`,
        entryTime: entryTime.format('YYYY-MM-DD HH:mm:ss'),
        exitTime: exitTime ? exitTime.format('YYYY-MM-DD HH:mm:ss') : '',
        type: isEntry ? 'entry' : 'exit',
        status: isEntry ? 'in' : 'out',
        fee: isEntry ? 0 : Math.floor(Math.random() * 50) + 5,
        paymentStatus: isPaid ? 'paid' : 'unpaid',
        vehicleType: Math.random() > 0.8 ? 'truck' : 'car'
      });
    }
    
    // 应用筛选
    let filteredData = mockData;
    
    // 关键词筛选
    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase();
      filteredData = filteredData.filter(record => 
        record.plateNumber.toLowerCase().includes(keyword)
      );
    }
    
    // 日期筛选
    const startDate = dayjs(dateRange.start);
    const endDate = dayjs(dateRange.end).endOf('day');
    filteredData = filteredData.filter(record => {
      const recordDate = dayjs(record.entryTime);
      return recordDate.isAfter(startDate) && recordDate.isBefore(endDate);
    });
    
    // 类型筛选
    if (filterOptions.type && filterOptions.type !== 'all') {
      filteredData = filteredData.filter(record => record.type === filterOptions.type);
    }
    
    // 支付状态筛选
    if (filterOptions.status && filterOptions.status !== 'all') {
      filteredData = filteredData.filter(record => record.paymentStatus === filterOptions.status);
    }
    
    // 车辆类型筛选
    if (filterOptions.vehicleType && filterOptions.vehicleType !== 'all') {
      filteredData = filteredData.filter(record => record.vehicleType === filterOptions.vehicleType);
    }
    
    // 更新分页信息
    pagination.total = 100; // 模拟总数
    
    // 更新列表
    if (reset) {
      records.value = filteredData;
    } else {
      records.value = [...records.value, ...filteredData];
    }
    
    loading.value = false;
    refreshing.value = false;
    loadingMore.value = false;
  }, 1000);
};

// 搜索
const handleSearch = () => {
  fetchRecords(true);
};

// 清除搜索
const clearSearch = () => {
  searchKeyword.value = '';
  fetchRecords(true);
};

// 下拉刷新
const onRefresh = () => {
  if (refreshing.value) return;
  refreshing.value = true;
  fetchRecords(true);
};

// 上拉加载更多
const onLoadMore = () => {
  if (loadingMore.value || !hasMore.value) return;
  loadingMore.value = true;
  pagination.current++;
  fetchRecords(false);
};

// 重置筛选条件
const resetFilters = () => {
  filterOptions.type = '';
  filterOptions.status = '';
  filterOptions.vehicleType = '';
  setDateRange('day');
};

// 应用筛选条件
const applyFilters = () => {
  showFilterPanel.value = false;
  fetchRecords(true);
};

// 跳转到详情页
const navigateToDetail = (record) => {
  uni.navigateTo({
    url: `/pages/home/vehicleAccess/recordDetail?id=${record.id}`
  });
};

// 导出数据
const exportData = () => {
  uni.showToast({
    title: '导出功能开发中',
    icon: 'none'
  });
};

// 获取日期范围显示文本
const getDateRangeText = computed(() => {
  switch (dateRange.mode) {
    case 'day':
      return '今天';
    case 'week':
      return '本周';
    case 'month':
      return '本月';
    case 'year':
      return '今年';
    case 'custom':
      return `${dateRangeStart.value} 至 ${dateRangeEnd.value}`;
    default:
      return '选择时间';
  }
});

// 打开开始日期选择器
const openStartDatePicker = () => {
  showStartDatePicker.value = true;
};

// 打开结束日期选择器
const openEndDatePicker = () => {
  showEndDatePicker.value = true;
};

// 确认开始日期选择
const onStartDateConfirm = (value) => {
  dateRange.start = value;
  showStartDatePicker.value = false;
};

// 确认结束日期选择
const onEndDateConfirm = (value) => {
  dateRange.end = value;
  showEndDatePicker.value = false;
};

// 判断是否有活跃的筛选条件
const hasActiveFilters = computed(() => {
  return (
    searchKeyword.value ||
    filterOptions.type ||
    filterOptions.status ||
    filterOptions.vehicleType ||
    dateRange.mode !== 'day'
  );
});

// 获取通行类型文本
const getTypeText = computed(() => {
  switch (filterOptions.type) {
    case 'entry':
      return '入场';
    case 'exit':
      return '出场';
    default:
      return '全部';
  }
});

// 获取支付状态文本
const getStatusText = computed(() => {
  switch (filterOptions.status) {
    case 'paid':
      return '已支付';
    case 'unpaid':
      return '未支付';
    default:
      return '全部';
  }
});

// 获取车辆类型文本
const getVehicleTypeText = computed(() => {
  switch (filterOptions.vehicleType) {
    case 'car':
      return '小型车';
    case 'truck':
      return '大型车';
    default:
      return '全部';
  }
});

// 清除特定筛选条件
const clearFilter = (filterType) => {
  filterOptions[filterType] = '';
  fetchRecords(true);
};

// 生命周期钩子
onMounted(() => {
  setDateRange('day'); // 默认查询当天
  fetchRecords(true);
  
  // 添加高度计算
  calculateListHeight();
  
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize);
  
  // 延迟再次计算，确保UI完全渲染
  setTimeout(() => {
    calculateListHeight();
  }, 500);
});

// 在页面卸载时移除事件监听
const onUnmounted = () => {
  window.removeEventListener('resize', handleResize);
};
</script>

<template>
  <page title="车辆通行记录">
    <view class="records-page">
      <!-- 顶部搜索栏 -->
      <view class="search-header">
        <view class="search-bar">
          <u-search
            v-model="searchKeyword"
            placeholder="搜索车牌号"
            @search="handleSearch"
            @clear="clearSearch"
            :showAction="true"
            actionText="筛选"
            @clickIcon="handleSearch"
            @custom="showFilterPanel = true"
          ></u-search>
        </view>
        
        <!-- 时间范围选择器 -->
        <view class="time-range-selector">
          <scroll-view scroll-x class="time-range-scroll">
            <view class="time-range-options">
              <view 
                class="time-option" 
                :class="{'active': dateRange.mode === 'day'}"
                @click="setDateRange('day')"
              >今天</view>
              <view 
                class="time-option" 
                :class="{'active': dateRange.mode === 'week'}"
                @click="setDateRange('week')"
              >本周</view>
              <view 
                class="time-option" 
                :class="{'active': dateRange.mode === 'month'}"
                @click="setDateRange('month')"
              >本月</view>
              <view 
                class="time-option" 
                :class="{'active': dateRange.mode === 'year'}"
                @click="setDateRange('year')"
              >今年</view>
              <view 
                class="time-option" 
                :class="{'active': dateRange.mode === 'custom'}"
                @click="setDateRange('custom')"
              >自定义</view>
            </view>
          </scroll-view>
          
          <!-- 添加筛选条件展示区域 -->
          <view class="active-filters" v-if="hasActiveFilters">
            <scroll-view scroll-x class="filters-scroll">
              <view class="filter-tags">
                <!-- 时间筛选标签 -->
                <view class="filter-tag">
                  <text>时间: {{ getDateRangeText }}</text>
                </view>
                
                <!-- 通行类型筛选标签 -->
                <view class="filter-tag" v-if="filterOptions.type && filterOptions.type !== 'all'">
                  <text>类型: {{ getTypeText }}</text>
                  <u-icon name="close" size="12" color="#909399" @click="clearFilter('type')"></u-icon>
                </view>
                
                <!-- 支付状态筛选标签 -->
                <view class="filter-tag" v-if="filterOptions.status && filterOptions.status !== 'all'">
                  <text>状态: {{ getStatusText }}</text>
                  <u-icon name="close" size="12" color="#909399" @click="clearFilter('status')"></u-icon>
                </view>
                
                <!-- 车辆类型筛选标签 -->
                <view class="filter-tag" v-if="filterOptions.vehicleType && filterOptions.vehicleType !== 'all'">
                  <text>车型: {{ getVehicleTypeText }}</text>
                  <u-icon name="close" size="12" color="#909399" @click="clearFilter('vehicleType')"></u-icon>
                </view>
                
                <!-- 关键词搜索标签 -->
                <view class="filter-tag" v-if="searchKeyword">
                  <text>关键词: {{ searchKeyword }}</text>
                  <u-icon name="close" size="12" color="#909399" @click="clearSearch"></u-icon>
                </view>
                
                <!-- 清除所有筛选 -->
                <view class="filter-tag clear-all" @click="resetFilters">
                  <text>清除全部</text>
                </view>
              </view>
            </scroll-view>
          </view>
        </view>
      </view>
      
      <!-- 记录列表 -->
      <view class="records-container">
        <scroll-view 
          scroll-y 
          class="records-list"
          @scrolltolower="onLoadMore"
          refresher-enabled
          :refresher-triggered="refreshing"
          @refresherrefresh="onRefresh"
          refresher-background="#f5f7fa"
        >
          <!-- 加载中提示 -->
          <view v-if="loading && records.length === 0" class="loading-state">
            <u-loading-icon mode="circle" size="28"></u-loading-icon>
            <text>加载中...</text>
          </view>
          
          <!-- 记录列表项 -->
          <view 
            v-for="record in records" 
            :key="record.id" 
            class="record-item"
            :class="{'record-entry': record.type === 'entry', 'record-exit': record.type === 'exit'}"
            @click="navigateToDetail(record)"
          >
            <view class="record-icon">
              <u-icon :name="record.type === 'entry' ? 'arrow-down' : 'arrow-up'" :color="record.type === 'entry' ? '#19be6b' : '#fa3534'" size="24"></u-icon>
            </view>
            
            <view class="record-info">
              <view class="record-plate">{{ record.plateNumber }}</view>
              <view class="record-time">
                <text>{{ record.type === 'entry' ? '入场' : '出场' }}时间: {{ record.type === 'entry' ? record.entryTime : record.exitTime }}</text>
              </view>
              <view class="record-status" v-if="record.type === 'exit'">
                <text class="fee">¥{{ record.fee.toFixed(2) }}</text>
                <u-tag :text="record.paymentStatus === 'paid' ? '已支付' : '未支付'" :type="record.paymentStatus === 'paid' ? 'success' : 'warning'" size="mini"></u-tag>
              </view>
            </view>
            
            <view class="record-arrow">
              <u-icon name="arrow-right" size="16" color="#c0c4cc"></u-icon>
            </view>
          </view>
          
          <!-- 空状态 -->
          <view v-if="records.length === 0 && !loading" class="empty-state">
            <u-empty mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png">
              <u-button slot="default" type="primary" size="small" @click="resetFilters">重置筛选</u-button>
            </u-empty>
          </view>
          
          <!-- 加载更多 -->
          <view v-if="records.length > 0" class="load-more">
            <text v-if="loadingMore">加载中...</text>
            <text v-else-if="hasMore">上拉加载更多</text>
            <text v-else>没有更多数据了</text>
          </view>
        </scroll-view>
      </view>
    </view>

    <!-- 筛选面板 -->
    <u-popup :show="showFilterPanel" mode="right" @close="showFilterPanel = false" width="70%">
      <view class="filter-panel">
        <view class="filter-header">
          <text class="filter-title">筛选条件</text>
          <u-icon name="close" size="20" @click="showFilterPanel = false"></u-icon>
        </view>
        
        <view class="filter-content">
          <view class="filter-section">
            <view class="section-title">通行类型</view>
            <view class="filter-options">
              <view 
                class="filter-option" 
                :class="{'active': filterOptions.type === 'all' || filterOptions.type === ''}"
                @click="filterOptions.type = 'all'"
              >全部</view>
              <view 
                class="filter-option" 
                :class="{'active': filterOptions.type === 'entry'}"
                @click="filterOptions.type = 'entry'"
              >入场</view>
              <view 
                class="filter-option" 
                :class="{'active': filterOptions.type === 'exit'}"
                @click="filterOptions.type = 'exit'"
              >出场</view>
            </view>
          </view>
          
          <view class="filter-section">
            <view class="section-title">支付状态</view>
            <view class="filter-options">
              <view 
                class="filter-option" 
                :class="{'active': filterOptions.status === 'all' || filterOptions.status === ''}"
                @click="filterOptions.status = 'all'"
              >全部</view>
              <view 
                class="filter-option" 
                :class="{'active': filterOptions.status === 'paid'}"
                @click="filterOptions.status = 'paid'"
              >已支付</view>
              <view 
                class="filter-option" 
                :class="{'active': filterOptions.status === 'unpaid'}"
                @click="filterOptions.status = 'unpaid'"
              >未支付</view>
            </view>
          </view>
          
          <view class="filter-section">
            <view class="section-title">车辆类型</view>
            <view class="filter-options">
              <view 
                class="filter-option" 
                :class="{'active': filterOptions.vehicleType === 'all' || filterOptions.vehicleType === ''}"
                @click="filterOptions.vehicleType = 'all'"
              >全部</view>
              <view 
                class="filter-option" 
                :class="{'active': filterOptions.vehicleType === 'car'}"
                @click="filterOptions.vehicleType = 'car'"
              >小型车</view>
              <view 
                class="filter-option" 
                :class="{'active': filterOptions.vehicleType === 'truck'}"
                @click="filterOptions.vehicleType = 'truck'"
              >大型车</view>
            </view>
          </view>
        </view>
        
        <view class="filter-footer">
          <u-button type="info" @click="resetFilters">重置</u-button>
          <u-button type="primary" @click="applyFilters">确定</u-button>
        </view>
      </view>
    </u-popup>
    
    <!-- 自定义日期选择弹窗 -->
    <u-popup :show="showCustomDatePicker" mode="bottom" @close="showCustomDatePicker = false">
      <view class="date-picker-popup">
        <view class="date-picker-header">
          <text class="date-picker-title">选择日期范围</text>
          <u-icon name="close" size="20" @click="showCustomDatePicker = false"></u-icon>
        </view>
        
        <view class="date-picker-content">
          <view class="date-range-item">
            <text class="date-label">开始日期</text>
            <view class="date-input" @click="openStartDatePicker">
              <text>{{ dateRangeStart }}</text>
              <u-icon name="calendar" size="14" color="#909399"></u-icon>
            </view>
          </view>
          
          <view class="date-range-item">
            <text class="date-label">结束日期</text>
            <view class="date-input" @click="openEndDatePicker">
              <text>{{ dateRangeEnd }}</text>
              <u-icon name="calendar" size="14" color="#909399"></u-icon>
            </view>
          </view>
        </view>
        
        <view class="date-picker-footer">
          <u-button type="primary" @click="applyCustomDateRange">确定</u-button>
        </view>
      </view>
    </u-popup>
    
    <!-- 添加独立的日期选择器 -->
    <u-datetime-picker
      :show="showStartDatePicker"
      v-model="dateRange.start"
      mode="date"
      @confirm="onStartDateConfirm"
      @cancel="showStartDatePicker = false"
    ></u-datetime-picker>
    
    <u-datetime-picker
      :show="showEndDatePicker"
      v-model="dateRange.end"
      mode="date"
      @confirm="onEndDateConfirm"
      @cancel="showEndDatePicker = false"
    ></u-datetime-picker>

    <!-- 使用 page 组件的 pageBottom 插槽 -->
    <template #pageBottom>
      <u-button type="primary" icon="download" shape="circle" @click="exportData">导出数据</u-button>
    </template>
  </page>
</template>

<style lang="less" scoped>
/* 重要：确保页面组件设置了正确的高度 */
:deep(.page) {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

:deep(.page-center) {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.records-page {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.search-header {
  flex-shrink: 0;
  background-color: #ffffff;
  padding: 15px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
  z-index: 10;
  
  .search-bar {
    margin-bottom: 15px;
  }
  
  .time-range-selector {
    .time-range-scroll {
      white-space: nowrap;
      margin-bottom: 10px;
      
      .time-range-options {
        display: inline-flex;
        padding: 2px;
        
        .time-option {
          padding: 6px 15px;
          margin-right: 10px;
          background-color: #f5f7fa;
          border-radius: 20px;
          font-size: 14px;
          color: #606266;
          
          &.active {
            background-color: #3c9cff;
            color: #ffffff;
          }
          
          &:active {
            opacity: 0.8;
          }
        }
      }
    }
    
    .active-filters {
      margin-top: 10px;
      
      .filters-scroll {
        white-space: nowrap;
        
        .filter-tags {
          display: inline-flex;
          flex-wrap: nowrap;
          padding: 2px 0;
          
          .filter-tag {
            display: flex;
            align-items: center;
            padding: 4px 10px;
            margin-right: 8px;
            background-color: #f5f7fa;
            border-radius: 16px;
            font-size: 12px;
            color: #606266;
            
            text {
              margin-right: 4px;
            }
            
            &:active {
              opacity: 0.8;
            }
            
            &.clear-all {
              background-color: rgba(250, 53, 52, 0.1);
              color: #fa3534;
            }
          }
        }
      }
    }
  }
}

.records-container {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.records-list {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 10px 15px;
  box-sizing: border-box;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 0;
  
  text {
    font-size: 14px;
    color: #909399;
    margin-top: 10px;
  }
}

.record-item {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  
  &.record-entry {
    border-left: 3px solid #19be6b;
  }
  
  &.record-exit {
    border-left: 3px solid #fa3534;
  }
  
  &:active {
    background-color: #f8f9fa;
  }
  
  .record-icon {
    margin-right: 15px;
    flex-shrink: 0;
  }
  
  .record-info {
    flex: 1;
    min-width: 0;
    
    .record-plate {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .record-time {
      font-size: 13px;
      color: #606266;
      margin-bottom: 5px;
    }
    
    .record-status {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .fee {
        font-size: 14px;
        font-weight: bold;
        color: #fa3534;
      }
    }
  }
  
  .record-arrow {
    margin-left: 10px;
    flex-shrink: 0;
  }
}

.empty-state {
  padding: 40px 0;
}

.load-more {
  text-align: center;
  padding: 15px 0;
  
  text {
    font-size: 14px;
    color: #909399;
  }
}

.filter-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .filter-header {
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ebeef5;
    
    .filter-title {
      font-size: 16px;
      font-weight: bold;
    }
  }
  
  .filter-content {
    flex: 1;
    padding: 15px;
    overflow-y: auto;
    
    .filter-section {
      margin-bottom: 20px;
      
      .section-title {
        font-size: 14px;
        color: #606266;
        margin-bottom: 10px;
      }
      
      .filter-options {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        
        .filter-option {
          padding: 8px 15px;
          background-color: #f5f7fa;
          border-radius: 4px;
          font-size: 14px;
          color: #606266;
          
          &.active {
            background-color: rgba(60, 156, 255, 0.1);
            color: #3c9cff;
            border: 1px solid #3c9cff;
          }
          
          &:active {
            opacity: 0.8;
          }
        }
      }
    }
  }
  
  .filter-footer {
    padding: 15px;
    display: flex;
    gap: 15px;
    border-top: 1px solid #ebeef5;
    
    :deep(.u-button) {
      flex: 1;
    }
  }
}

.date-picker-popup {
  background-color: #ffffff;
  border-radius: 16px 16px 0 0;
  overflow: hidden;
  
  .date-picker-header {
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ebeef5;
    
    .date-picker-title {
      font-size: 16px;
      font-weight: bold;
    }
  }
  
  .date-picker-content {
    padding: 15px;
    
    .date-range-item {
      margin-bottom: 15px;
      
      .date-label {
        font-size: 14px;
        color: #606266;
        margin-bottom: 8px;
        display: block;
      }
      
      .date-input {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: #f5f7fa;
        padding: 10px 15px;
        border-radius: 4px;
        
        text {
          font-size: 14px;
          color: #303133;
        }
      }
    }
  }
  
  .date-picker-footer {
    padding: 15px;
    border-top: 1px solid #ebeef5;
  }
}
</style>
