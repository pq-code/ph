<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue';
import dayjs from 'dayjs';
import page from "@/components/pages/page.vue";

// 统计时间范围
const timeRange = reactive({
  mode: 'day', // 'day', 'week', 'month', 'year'
  start: dayjs().format('YYYY-MM-DD'),
  end: dayjs().format('YYYY-MM-DD')
});

// 停车场概览数据
const parkingOverview = reactive({
  totalSpaces: 200,
  occupiedSpaces: 0,
  availableSpaces: 0,
  occupancyRate: 0,
  totalVehicles: 0,
  inVehicles: 0,
  outVehicles: 0
});

// 收入统计数据
const incomeStats = reactive({
  totalIncome: 0,
  todayIncome: 0,
  weekIncome: 0,
  monthIncome: 0,
  averagePerVehicle: 0
});

// 图表数据
const chartData = reactive({
  occupancy: [],
  income: [],
  vehicleFlow: {
    entry: [],
    exit: []
  }
});

// 加载状态
const loading = ref(false);

// 设置时间范围
const setTimeRange = (mode) => {
  timeRange.mode = mode;
  
  switch (mode) {
    case 'day':
      // 今天
      timeRange.start = dayjs().format('YYYY-MM-DD');
      timeRange.end = dayjs().format('YYYY-MM-DD');
      break;
    case 'week':
      // 本周
      timeRange.start = dayjs().startOf('week').format('YYYY-MM-DD');
      timeRange.end = dayjs().format('YYYY-MM-DD');
      break;
    case 'month':
      // 本月
      timeRange.start = dayjs().startOf('month').format('YYYY-MM-DD');
      timeRange.end = dayjs().format('YYYY-MM-DD');
      break;
    case 'year':
      // 今年
      timeRange.start = dayjs().startOf('year').format('YYYY-MM-DD');
      timeRange.end = dayjs().format('YYYY-MM-DD');
      break;
  }
  
  fetchStatisticsData();
};

// 获取统计数据
const fetchStatisticsData = () => {
  loading.value = true;
  
  // 模拟API调用
  setTimeout(() => {
    // 模拟停车场概览数据
    const occupiedSpaces = Math.floor(Math.random() * 150) + 50;
    parkingOverview.occupiedSpaces = occupiedSpaces;
    parkingOverview.availableSpaces = parkingOverview.totalSpaces - occupiedSpaces;
    parkingOverview.occupancyRate = Math.floor((occupiedSpaces / parkingOverview.totalSpaces) * 100);
    
    // 模拟车辆数据
    parkingOverview.totalVehicles = Math.floor(Math.random() * 500) + 200;
    parkingOverview.inVehicles = Math.floor(Math.random() * 100) + 50;
    parkingOverview.outVehicles = parkingOverview.totalVehicles - parkingOverview.inVehicles;
    
    // 模拟收入数据
    incomeStats.totalIncome = Math.floor(Math.random() * 10000) + 5000;
    incomeStats.todayIncome = Math.floor(Math.random() * 1000) + 500;
    incomeStats.weekIncome = Math.floor(Math.random() * 5000) + 2000;
    incomeStats.monthIncome = Math.floor(Math.random() * 20000) + 10000;
    incomeStats.averagePerVehicle = Math.floor(incomeStats.totalIncome / parkingOverview.totalVehicles);
    
    // 生成图表数据
    generateChartData();
    
    // 绘制图表
    nextTick(() => {
      drawOccupancyChart();
      drawIncomeChart();
      drawVehicleFlowChart();
    });
    
    loading.value = false;
  }, 1000);
};

// 生成图表数据
const generateChartData = () => {
  // 根据时间范围生成日期数组
  const dates = [];
  const startDate = dayjs(timeRange.start);
  const endDate = dayjs(timeRange.end);
  let currentDate = startDate;
  
  while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
    dates.push(currentDate.format('MM-DD'));
    currentDate = currentDate.add(1, 'day');
  }
  
  // 生成占用率数据
  chartData.occupancy = dates.map(date => {
    return {
      date,
      value: Math.floor(Math.random() * 50) + 50 // 50-100%
    };
  });
  
  // 生成收入数据
  chartData.income = dates.map(date => {
    return {
      date,
      value: Math.floor(Math.random() * 1000) + 500 // 500-1500元
    };
  });
  
  // 生成车流量数据
  chartData.vehicleFlow.entry = dates.map(date => {
    return {
      date,
      value: Math.floor(Math.random() * 100) + 50 // 50-150辆
    };
  });
  
  chartData.vehicleFlow.exit = dates.map(date => {
    return {
      date,
      value: Math.floor(Math.random() * 100) + 40 // 40-140辆
    };
  });
};

// 绘制占用率图表
const drawOccupancyChart = () => {
  const ctx = uni.createCanvasContext('occupancyChart');
  const data = chartData.occupancy;
  
  if (data.length === 0) return;
  
  // 设置画布尺寸
  const canvasWidth = 330;
  const canvasHeight = 200;
  const padding = 40;
  const chartWidth = canvasWidth - padding * 2;
  const chartHeight = canvasHeight - padding * 2;
  
  // 清空画布
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  
  // 绘制背景
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // 绘制标题
  ctx.fillStyle = '#333333';
  ctx.font = 'normal bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('停车场占用率趋势', canvasWidth / 2, 20);
  
  // 绘制坐标轴
  ctx.beginPath();
  ctx.strokeStyle = '#cccccc';
  ctx.lineWidth = 1;
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, canvasHeight - padding);
  ctx.lineTo(canvasWidth - padding, canvasHeight - padding);
  ctx.stroke();
  
  // 绘制Y轴刻度
  ctx.fillStyle = '#666666';
  ctx.font = 'normal 10px sans-serif';
  ctx.textAlign = 'right';
  
  for (let i = 0; i <= 4; i++) {
    const y = padding + (chartHeight / 4) * i;
    const value = 100 - i * 25;
    
    ctx.beginPath();
    ctx.moveTo(padding - 5, y);
    ctx.lineTo(padding, y);
    ctx.stroke();
    
    ctx.fillText(value + '%', padding - 8, y + 4);
    
    // 绘制网格线
    ctx.beginPath();
    ctx.strokeStyle = '#eeeeee';
    ctx.moveTo(padding, y);
    ctx.lineTo(canvasWidth - padding, y);
    ctx.stroke();
  }
  
  // 计算X轴间隔
  const xStep = chartWidth / (data.length - 1 || 1);
  
  // 绘制X轴刻度
  ctx.textAlign = 'center';
  data.forEach((item, index) => {
    const x = padding + xStep * index;
    
    ctx.beginPath();
    ctx.strokeStyle = '#cccccc';
    ctx.moveTo(x, canvasHeight - padding);
    ctx.lineTo(x, canvasHeight - padding + 5);
    ctx.stroke();
    
    ctx.fillText(item.date, x, canvasHeight - padding + 15);
  });
  
  // 绘制折线
  ctx.beginPath();
  ctx.strokeStyle = '#3c9cff';
  ctx.lineWidth = 2;
  
  data.forEach((item, index) => {
    const x = padding + xStep * index;
    const y = padding + chartHeight - (item.value / 100) * chartHeight;
    
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  
  ctx.stroke();
  
  // 绘制数据点
  data.forEach((item, index) => {
    const x = padding + xStep * index;
    const y = padding + chartHeight - (item.value / 100) * chartHeight;
    
    ctx.beginPath();
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#3c9cff';
    ctx.lineWidth = 2;
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // 绘制数据标签
    ctx.fillStyle = '#3c9cff';
    ctx.textAlign = 'center';
    ctx.fillText(item.value + '%', x, y - 10);
  });
  
  // 执行绘制
  ctx.draw();
};

// 绘制收入图表
const drawIncomeChart = () => {
  const ctx = uni.createCanvasContext('incomeChart');
  const data = chartData.income;
  
  if (data.length === 0) return;
  
  // 设置画布尺寸
  const canvasWidth = 330;
  const canvasHeight = 200;
  const padding = 40;
  const chartWidth = canvasWidth - padding * 2;
  const chartHeight = canvasHeight - padding * 2;
  
  // 找出最大值
  const maxValue = Math.max(...data.map(item => item.value));
  const yMax = Math.ceil(maxValue / 500) * 500; // 向上取整到最近的500
  
  // 清空画布
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  
  // 绘制背景
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // 绘制标题
  ctx.fillStyle = '#333333';
  ctx.font = 'normal bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('停车场收入趋势', canvasWidth / 2, 20);
  
  // 绘制坐标轴
  ctx.beginPath();
  ctx.strokeStyle = '#cccccc';
  ctx.lineWidth = 1;
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, canvasHeight - padding);
  ctx.lineTo(canvasWidth - padding, canvasHeight - padding);
  ctx.stroke();
  
  // 绘制Y轴刻度
  ctx.fillStyle = '#666666';
  ctx.font = 'normal 10px sans-serif';
  ctx.textAlign = 'right';
  
  for (let i = 0; i <= 4; i++) {
    const y = padding + (chartHeight / 4) * i;
    const value = yMax - i * (yMax / 4);
    
    ctx.beginPath();
    ctx.moveTo(padding - 5, y);
    ctx.lineTo(padding, y);
    ctx.stroke();
    
    ctx.fillText('¥' + value, padding - 8, y + 4);
    
    // 绘制网格线
    ctx.beginPath();
    ctx.strokeStyle = '#eeeeee';
    ctx.moveTo(padding, y);
    ctx.lineTo(canvasWidth - padding, y);
    ctx.stroke();
  }
  
  // 计算X轴间隔
  const xStep = chartWidth / (data.length - 1 || 1);
  
  // 绘制X轴刻度
  ctx.textAlign = 'center';
  data.forEach((item, index) => {
    const x = padding + xStep * index;
    
    ctx.beginPath();
    ctx.strokeStyle = '#cccccc';
    ctx.moveTo(x, canvasHeight - padding);
    ctx.lineTo(x, canvasHeight - padding + 5);
    ctx.stroke();
    
    ctx.fillText(item.date, x, canvasHeight - padding + 15);
  });
  
  // 绘制折线
  ctx.beginPath();
  ctx.strokeStyle = '#19be6b';
  ctx.lineWidth = 2;
  
  data.forEach((item, index) => {
    const x = padding + xStep * index;
    const y = padding + chartHeight - (item.value / yMax) * chartHeight;
    
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  
  ctx.stroke();
  
  // 绘制数据点
  data.forEach((item, index) => {
    const x = padding + xStep * index;
    const y = padding + chartHeight - (item.value / yMax) * chartHeight;
    
    ctx.beginPath();
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#19be6b';
    ctx.lineWidth = 2;
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // 绘制数据标签
    ctx.fillStyle = '#19be6b';
    ctx.textAlign = 'center';
    ctx.fillText('¥' + item.value, x, y - 10);
  });
  
  // 执行绘制
  ctx.draw();
};

// 绘制车流量图表
const drawVehicleFlowChart = () => {
  const ctx = uni.createCanvasContext('vehicleFlowChart');
  const entryData = chartData.vehicleFlow.entry;
  const exitData = chartData.vehicleFlow.exit;
  
  if (entryData.length === 0 || exitData.length === 0) return;
  
  // 设置画布尺寸
  const canvasWidth = 330;
  const canvasHeight = 200;
  const padding = 40;
  const chartWidth = canvasWidth - padding * 2;
  const chartHeight = canvasHeight - padding * 2;
  
  // 找出最大值
  const maxEntry = Math.max(...entryData.map(item => item.value));
  const maxExit = Math.max(...exitData.map(item => item.value));
  const yMax = Math.ceil(Math.max(maxEntry, maxExit) / 50) * 50; // 向上取整到最近的50
  
  // 清空画布
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  
  // 绘制背景
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // 绘制标题
  ctx.fillStyle = '#333333';
  ctx.font = 'normal bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('车辆进出流量', canvasWidth / 2, 20);
  
  // 绘制图例
  ctx.fillStyle = '#3c9cff';
  ctx.fillRect(canvasWidth / 2 - 60, 30, 10, 10);
  ctx.fillStyle = '#333333';
  ctx.textAlign = 'left';
  ctx.fillText('入场', canvasWidth / 2 - 45, 38);
  
  ctx.fillStyle = '#fa3534';
  ctx.fillRect(canvasWidth / 2 + 10, 30, 10, 10);
  ctx.fillStyle = '#333333';
  ctx.fillText('出场', canvasWidth / 2 + 25, 38);
  
  // 绘制坐标轴
  ctx.beginPath();
  ctx.strokeStyle = '#cccccc';
  ctx.lineWidth = 1;
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, canvasHeight - padding);
  ctx.lineTo(canvasWidth - padding, canvasHeight - padding);
  ctx.stroke();
  
  // 绘制Y轴刻度
  ctx.fillStyle = '#666666';
  ctx.font = 'normal 10px sans-serif';
  ctx.textAlign = 'right';
  
  for (let i = 0; i <= 4; i++) {
    const y = padding + (chartHeight / 4) * i;
    const value = yMax - i * (yMax / 4);
    
    ctx.beginPath();
    ctx.moveTo(padding - 5, y);
    ctx.lineTo(padding, y);
    ctx.stroke();
    
    ctx.fillText(value.toString(), padding - 8, y + 4);
    
    // 绘制网格线
    ctx.beginPath();
    ctx.strokeStyle = '#eeeeee';
    ctx.moveTo(padding, y);
    ctx.lineTo(canvasWidth - padding, y);
    ctx.stroke();
  }
  
  // 计算X轴间隔
  const xStep = chartWidth / (entryData.length - 1 || 1);
  
  // 绘制X轴刻度
  ctx.textAlign = 'center';
  entryData.forEach((item, index) => {
    const x = padding + xStep * index;
    
    ctx.beginPath();
    ctx.strokeStyle = '#cccccc';
    ctx.moveTo(x, canvasHeight - padding);
    ctx.lineTo(x, canvasHeight - padding + 5);
    ctx.stroke();
    
    ctx.fillText(item.date, x, canvasHeight - padding + 15);
  });
  
  // 绘制入场折线
  ctx.beginPath();
  ctx.strokeStyle = '#3c9cff';
  ctx.lineWidth = 2;
  
  entryData.forEach((item, index) => {
    const x = padding + xStep * index;
    const y = padding + chartHeight - (item.value / yMax) * chartHeight;
    
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  
  ctx.stroke();
  
  // 绘制出场折线
  ctx.beginPath();
  ctx.strokeStyle = '#fa3534';
  ctx.lineWidth = 2;
  
  exitData.forEach((item, index) => {
    const x = padding + xStep * index;
    const y = padding + chartHeight - (item.value / yMax) * chartHeight;
    
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  
  ctx.stroke();
  
  // 绘制入场数据点
  entryData.forEach((item, index) => {
    const x = padding + xStep * index;
    const y = padding + chartHeight - (item.value / yMax) * chartHeight;
    
    ctx.beginPath();
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#3c9cff';
    ctx.lineWidth = 2;
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // 绘制数据标签
    ctx.fillStyle = '#3c9cff';
    ctx.textAlign = 'center';
    ctx.fillText(item.value.toString(), x, y - 10);
  });
  
  // 绘制出场数据点
  exitData.forEach((item, index) => {
    const x = padding + xStep * index;
    const y = padding + chartHeight - (item.value / yMax) * chartHeight;
    
    ctx.beginPath();
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#fa3534';
    ctx.lineWidth = 2;
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // 绘制数据标签
    ctx.fillStyle = '#fa3534';
    ctx.textAlign = 'center';
    ctx.fillText(item.value.toString(), x, y + 20); // 向下偏移，避免与入场数据重叠
  });
  
  // 执行绘制
  ctx.draw();
};

// 生命周期钩子
onMounted(() => {
  setTimeRange('day'); // 默认显示今天的数据
});
</script>

<template>
  <page title="统计分析">
    <view class="statistics-page">
      <!-- 时间范围选择器 -->
      <view class="time-selector">
        <view 
          class="time-option" 
          :class="{'active': timeRange.mode === 'day'}"
          @click="setTimeRange('day')"
        >今天</view>
        <view 
          class="time-option" 
          :class="{'active': timeRange.mode === 'week'}"
          @click="setTimeRange('week')"
        >本周</view>
        <view 
          class="time-option" 
          :class="{'active': timeRange.mode === 'month'}"
          @click="setTimeRange('month')"
        >本月</view>
        <view 
          class="time-option" 
          :class="{'active': timeRange.mode === 'year'}"
          @click="setTimeRange('year')"
        >今年</view>
      </view>
      
      <!-- 加载状态 -->
      <view class="loading-overlay" v-if="loading">
        <u-loading-icon mode="circle" size="32" color="#3c9cff"></u-loading-icon>
      </view>
      
      <!-- 停车场概览 -->
      <view class="overview-section">
        <view class="section-title">停车场概览</view>
        
        <view class="overview-cards">
          <view class="overview-card">
            <view class="card-value">{{ parkingOverview.occupiedSpaces }}</view>
            <view class="card-label">已占车位</view>
          </view>
          
          <view class="overview-card">
            <view class="card-value">{{ parkingOverview.availableSpaces }}</view>
            <view class="card-label">可用车位</view>
          </view>
          
          <view class="overview-card">
            <view class="card-value">{{ parkingOverview.occupancyRate }}%</view>
            <view class="card-label">使用率</view>
          </view>
          
          <view class="overview-card">
            <view class="card-value">{{ parkingOverview.totalVehicles }}</view>
            <view class="card-label">总车流量</view>
          </view>
        </view>
      </view>
      
      <!-- 车辆状态 -->
      <view class="vehicle-status-section">
        <view class="status-header">
          <text class="section-title">车辆状态</text>
        </view>
        
        <view class="status-cards">
          <view class="status-card in-vehicles">
            <view class="status-icon">
              <u-icon name="car" size="18" color="#ffffff"></u-icon>
            </view>
            <view class="status-info">
              <view class="status-value">{{ parkingOverview.inVehicles }}</view>
              <view class="status-label">场内车辆</view>
            </view>
          </view>
          
          <view class="status-card out-vehicles">
            <view class="status-icon">
              <u-icon name="car-fill" size="18" color="#ffffff"></u-icon>
            </view>
            <view class="status-info">
              <view class="status-value">{{ parkingOverview.outVehicles }}</view>
              <view class="status-label">已出场车辆</view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 收入统计 -->
      <view class="income-section">
        <view class="section-title">收入统计</view>
        
        <view class="income-cards">
          <view class="income-card">
            <view class="income-value">¥{{ incomeStats.totalIncome.toLocaleString() }}</view>
            <view class="income-label">总收入</view>
          </view>
          
          <view class="income-card">
            <view class="income-value">¥{{ incomeStats.todayIncome.toLocaleString() }}</view>
            <view class="income-label">今日收入</view>
          </view>
          
          <view class="income-card">
            <view class="income-value">¥{{ incomeStats.averagePerVehicle }}</view>
            <view class="income-label">平均收入/车</view>
          </view>
        </view>
      </view>
      
      <!-- 图表区域 - 使用原生canvas -->
      <view class="charts-section">
        <!-- 占用率趋势图 -->
        <view class="chart-container">
          <view class="chart-title">停车场占用率趋势</view>
          <canvas canvas-id="occupancyChart" id="occupancyChart" class="charts" style="width: 100%; height: 200px;"></canvas>
        </view>
        
        <!-- 收入趋势图 -->
        <view class="chart-container">
          <view class="chart-title">停车场收入趋势</view>
          <canvas canvas-id="incomeChart" id="incomeChart" class="charts" style="width: 100%; height: 200px;"></canvas>
        </view>
        
        <!-- 车流量趋势图 -->
        <view class="chart-container">
          <view class="chart-title">车辆进出流量</view>
          <canvas canvas-id="vehicleFlowChart" id="vehicleFlowChart" class="charts" style="width: 100%; height: 200px;"></canvas>
        </view>
      </view>
    </view>
  </page>
</template>

<style lang="less" scoped>
.statistics-page {
  padding: 15px;
  background-color: #f5f7fa;
  position: relative;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.time-selector {
  display: flex;
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 15px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  
  .time-option {
    flex: 1;
    text-align: center;
    padding: 10px 0;
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

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #303133;
}

.overview-section {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  
  .overview-cards {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    
    .overview-card {
      flex: 1;
      min-width: calc(50% - 5px);
      background-color: #f8f9fa;
      border-radius: 8px;
      padding: 12px;
      text-align: center;
      
      .card-value {
        font-size: 24px;
        font-weight: bold;
        color: #3c9cff;
        margin-bottom: 4px;
      }
      
      .card-label {
        font-size: 12px;
        color: #909399;
      }
    }
  }
}

.vehicle-status-section {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  
  .status-header {
    margin-bottom: 12px;
    color: #303133;
  }
  
  .status-cards {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    
    .status-card {
      flex: 1;
      min-width: calc(50% - 5px);
      background-color: #f8f9fa;
      border-radius: 8px;
      padding: 12px;
      text-align: center;
      
      .status-icon {
        margin-bottom: 4px;
      }
      
      .status-info {
        .status-value {
          font-size: 24px;
          font-weight: bold;
          color: #3c9cff;
          margin-bottom: 4px;
        }
        
        .status-label {
          font-size: 12px;
          color: #909399;
        }
      }
    }
  }
}

.income-section {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  
  .income-cards {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    
    .income-card {
      flex: 1;
      min-width: calc(50% - 5px);
      background-color: #f8f9fa;
      border-radius: 8px;
      padding: 12px;
      text-align: center;
      
      .income-value {
        font-size: 24px;
        font-weight: bold;
        color: #3c9cff;
        margin-bottom: 4px;
      }
      
      .income-label {
        font-size: 12px;
        color: #909399;
      }
    }
  }
}

.charts-section {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  
  .chart-container {
    flex: 1;
    min-width: calc(50% - 5px);
    background-color: #ffffff;
    border-radius: 8px;
    padding: 12px;
    text-align: center;
    
    .chart-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 12px;
      color: #303133;
    }
    
    .charts {
      width: 100%;
      height: 200px;
    }
  }
}
</style>