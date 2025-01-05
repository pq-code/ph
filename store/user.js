import { defineStore } from 'pinia'
 
//创建小仓库
const useUserStore = defineStore('User', {
  state: () => {
    return {
      activeTab: 0 // 默认选中的索引
    }
  },
  actions: {
    //设置active的值
    setActive(active) {
      this.activeTab = active
    }
  }
})
 
//暴露小仓库
export default useUserStore