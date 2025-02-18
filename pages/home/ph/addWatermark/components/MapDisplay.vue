<!-- 导入地图 -->
<template>
	<view class="content">
		<!-- 新增搜索容器 -->
		<view class="search-container">
			<u-input v-model="searchKeyword" placeholder="输入地址进行搜索" @confirm="handleSearch" />
			<u-button @click="handleSearch">搜索</u-button>
			<u-button @click="closeMap">确认</u-button>
		</view>
		<!-- 新增地址显示和搜索结果 -->
		<view class="info-box" v-if="selectedAddress">
			<text>{{ selectedAddress }}</text>
		</view>
		<view class="search-results" v-if="results.length > 0">
			<scroll-view scroll-y style="max-height: 200px;">
				<view v-for="(item, index) in results" :key="index" class="result-item" 
					  @click="selectLocation(item)">
					{{ item.title }}
				</view>
			</scroll-view>
		</view>
		<view class="wrapperBox">
			<!-- <view id="wrapper"></view> -->
			<map style="width:100%;height:100%;" 
				:latitude="latitude" 
				:longitude="longitude" 
				:scale="scale"
				@tap="handleMapTap" 
				:markers="marker" 
				@markertap="toMap()"/>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import QQMapWX from '@/libs/qqmap-wx-jssdk'

const emits = defineEmits(['closeMap']); // 添加缺失的事件声明

const location = ref({})
const latitude = ref(30.254515) //纬度
const longitude = ref(120.11) //经度
const scale = ref(13) //地图缩放程度

const key = 'TINBZ-DRE6I-H7XGE-UG7XQ-UGPHH-4ZBR6'
const mapInstance = ref(null)
let qqmapsdk = null

// 新增响应式数据
const searchKeyword = ref('')
const results = ref([])
const selectedAddress = ref('')
const currentMarker = ref(null) // 新增标记实例
const marker = ref([]) // 新增标记数组

// 关闭地图
const closeMap = (item) => {
  emits('closeMap',item || location.value)
}

// 生命周期钩子
onMounted(() => {
  qqmapsdk = new QQMapWX({
    key: key  //申请的key
  });
	// 定位请求
	getLocation()
})

onBeforeUnmount(() => {
	if (mapInstance.value) {
		mapInstance.value.destroy()
	}
	delete window.mapInit
})

// 方法
const loadScript = () => {
  // // 动态加载腾讯地图SDK
	// const script = document.createElement('script')
	// script.src = `https://map.qq.com/api/gljs?v=1.exp&key=${key}&libraries=visualization&callback=mapInit`
	// script.onerror = () => {
	// 	console.error('地图脚本加载失败')
	// }
	// document.body.appendChild(script)

  // mapInit()
}

// 新增搜索方法
const handleSearch = async () => {
    if (!searchKeyword.value) return
    try {
        qqmapsdk.search({
            keyword: searchKeyword.value,
            region: '全国',
            page_size: 20,
            keyword_auto_complete: 1,
            address_format: 'short',
            filter: 'category=地址',
            success: function(res) {
              console.log('res',res)
              if (res.status === 0 && res.data) {
                const uniqueResults = new Map();
                results.value = res.data.filter(item => {
                  const key = `${item.location.lat},${item.location.lng}`;
                  return !uniqueResults.has(key) && uniqueResults.set(key, true);
                }).map(item => ({
                    title: item.title.replace(/<[^>]+>/g, ''),
                    lat: item.location.lat,
                    lng: item.location.lng
                }))
                if(results.value.length === 0) {
                    uni.showToast({ 
                        title: res.message === 'query params error' 
                            ? '请输入更详细的关键词' 
                            : '未找到相关地址', 
                        icon: 'none' 
                    })
                }
            }
          }
        })
    } catch (error) {
        console.error('搜索失败:', error)
        uni.showToast({ title: '搜索失败：' + error.message, icon: 'none' })
    }
}
const getLocation = () => {
  uni.authorize({
    scope: 'scope.userLocation',
    success() {
      let location = {
        longitude: longitude.value,
        latitude: latitude.value,
        province: "",
        city: "",
        area: "",
        street: "",
        address: "",
      };
      uni.getLocation({
        type: 'gcj02',
        geocode: true,
        success: function(res) {
          uni.setStorageSync('location', {
            latitude: latitude.value,
            longitude: longitude.value
          });

          longitude.value = res.longitude;
          latitude.value = res.latitude;

          location.longitude = res.longitude;
          location.latitude = res.latitude;
    
          qqmapsdk.reverseGeocoder({
            location,
            success: function(res) {
                let info = res.result;
                location.province = info.address_component.province;
                location.city = info.address_component.city;
                location.area = info.address_component.district;
                location.street = info.address_component.street;
                location.address = info.address;
                location.value = location
            },
          });
        },
        fail: function(err) {
          console.log(err,'err')
          // 新增IP定位备选方案
          qqmapsdk.geocoder({
            geocoder: 1, // 1表示IP定位
            success: (res) => {
              const location = res.result.location
              longitude.value = location.lng
              latitude.value = location.lat
              
              qqmapsdk.reverseGeocoder({
                location,
                success: function(res) {
                  let info = res.result;
                  uni.setStorageSync('location', {
                    latitude: location.lat,
                    longitude: location.lng
                  });
                  uni.showToast({
                    title: '已使用IP定位',
                    icon: 'none'
                  })
                }
              });
            },
            fail: (err) => {
              uni.showToast({
                title: '定位失败，请手动选择位置',
                icon: 'none'
              })
            }
          })
        }
      })
    },
    fail() {
      uni.showToast({
        title: '需要位置权限才能使用该功能',
        icon: 'none'
      })
    }
  })
}
// 新增标记更新方法
const updateMarker = (lat, lng) => {
    // 使用uni-app原生map组件方式更新标记
    marker.value = [{
        id: 1,
        latitude: lat,
        longitude: lng,
        iconPath: '/static/location.png', // 需要准备标记图标
        width: 30,
        height: 30
    }]
}

// 新增选择位置方法
const selectLocation = (item) => {
    // 更新地图中心坐标到选中位置
    latitude.value = item.lat
    longitude.value = item.lng
    console.log('item',item)
    // 更新标记位置
    updateMarker(item.lat, item.lng)
    // 获取并显示详细地址
    qqmapsdk.reverseGeocoder({
        location: { latitude: item.lat, longitude: item.lng },
        success: function(res) {
            const info = res.result
            selectedAddress.value = info.address
            location.value = {
                longitude: item.lng,
                latitude: item.lat,
                province: info.address_component.province,
                city: info.address_component.city,
                area: info.address_component.district,
                street: info.address_component.street,
                address: info.address
            }
        }
    })
    results.value = []
    searchKeyword.value = ''
}

// 新增地图点击处理方法
const handleMapTap = (e) => {
  const { latitude, longitude } = e.detail
  location.value = {
    longitude,
    latitude,
    province: "",
    city: "",
    area: "",
    street: "",
    address: "",
  }   
  qqmapsdk.reverseGeocoder({
    location: { latitude, longitude },
    success: function(res) {
      const info = res.result
      selectedAddress.value = info.address
      location.value = {
        ...location.value,
        province: info.address_component.province,
        city: info.address_component.city,
        area: info.address_component.district,
        street: info.address_component.street,
        address: info.address
      }

      // 新增确认弹窗
      uni.showModal({
        title: '确认位置',
        content: `是否选择当前位置：${info.address}`,
        success: function(res2) {
          if (res2.confirm) {
            // 更新标记位置
            // updateMarker(latitude, longitude)
            // 自动触发确认（如果需要自动关闭地图）
            closeMap(location.value)
          }
        }
      })
    },
    fail: function(err) {
      console.error('逆地理编码失败:', err)
    }
  })
}
</script>

<style>
	.content {
		position: fixed;
		top: 0;
		left: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	
	.wrapperBox {
		position: relative;
		width: 100vw;
		height: 100vh;
    z-index: 999;
		overflow: hidden; /* 添加防止滚动条 */
	}

	#wrapper {
		width: 100%;  /* 修改为百分比布局 */
		height: 100%;
		top: 0;      /* 调整定位 */
		left: 0;
	}

	/* 新增搜索框样式 */
	.search-container {
		position: absolute;
		top: 90px;
		left: 10px;
		z-index: 1000;
		background: rgba(255, 255, 255, 0.9);
		padding: 10px;
		border-radius: 8px;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
		display: flex;
		gap: 8px;
		/* width: 300px; */
	}

	/* .search-container input {
		flex: 1;
	} */

	.search-container button {
    width: 60px !important;
		/* background: #007aff;
		color: white;
		border: none;
		padding: 8px 12px;
		border-radius: 4px;
		font-size: 14px;
		cursor: pointer; */
	}

	.info-box {
		position: absolute;
		bottom: 20px;
		left: 20px;
		z-index: 1000;
		background: rgba(255, 255, 255, 0.9);
		padding: 10px;
		border-radius: 8px;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
		max-width: 300px;
	}

	.search-results {
		position: absolute;
    top: 150px;
    left: 10px;
		z-index: 1000;
		background: white;
		width: 300px;
		border-radius: 8px;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
	}

	.result-item {
		padding: 10px;
		border-bottom: 1px solid #eee;
		cursor: pointer;
	}

	.result-item:last-child {
		border-bottom: none;
	}

	.result-item:hover {
		background-color: #f5f5f5;
	}
</style>
