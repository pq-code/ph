<script setup lang="ts">
import { ref } from "vue";
import pageSearch from "../../components/pageSearch/pageSearch.vue";

const loading = ref(false);
const keyword = ref();

const searchFn = () => {
  loading.value = true;
  setInterval(() => (loading.value = false), 1000);
  uni.navigateTo({
    url: "searchList",
	
  });
};

</script>
<template>
  <pageSearch title="搜索">
    <view class="content-heard">
      <u-search
        placeholder="搜索"
        :focus="true"
        :show-action="true"
        actionText="搜索"
        width="100"
        bgColor="rgb(235, 235, 235)"
        :animation="false"
        @custom="searchFn"
        @search="searchFn"
        v-model="keyword"
      ></u-search>
    </view>
    <view class="text">热门推荐</view>
    <view class="content-main">
      <ul class="ul">
        <li class="li" @click="searchFn">1111</li>
        <li class="li" @click="searchFn">1111</li>
        <li class="li" @click="searchFn">1111</li>
      </ul>
    </view>
  </pageSearch>
  <u-loading-page :loading="loading"></u-loading-page>
</template>
<style lang="less" scoped>
.content-heard {
  height: 50px;
  width: calc(100vw - 20px);
  margin: 0 10px;
}

.text {
  margin-left: 10px;
  font-size: 16px;
}

.content-main {
  margin: 10px auto;
  width: 96%;
  height: 500px;
  // background-color: rgb(244, 244, 244);

  .ul {
    padding: 0px;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .li {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      width: 49%;
      height: 40px;
      background-color: rgb(235, 235, 235);
      margin-bottom: 10px;
    }
  }
}
</style>
