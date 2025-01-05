<script setup lang="ts">
import { ref } from "vue";
import Dropdown from "../../components/dropdown/dropdown.vue";
import pageSearch from "../../components/pageSearch/pageSearch.vue";

const loading = ref(false);
const keyword = ref();
const searchFn = () => {
  loading.value = true;
  setInterval(() => (loading.value = false), 1000);
};

const list = ref([{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]);

const onpen = (e) => {
  // uni.navigateTo({
  //     url: 'home'
  // });
};
</script>
<template>
  <pageSearch title="搜索" backUrl="home">
    <view class="content-heard">
      <u-search
        placeholder="搜索"
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
    <Dropdown></Dropdown>
    <view class="content-main">
      <ul class="ul">
        <li class="li" @click="onpen(item)" v-for="(item, index) in list">
          <view class="text">
            <view>标题</view>
            <view>萨达啊但是大的多撒点</view>
            <view></view>
          </view>
        </li>
      </ul>
    </view>
  </pageSearch>
  <u-loading-page :loading="loading" style="z-index: 2000"></u-loading-page>
</template>
<style lang="less" scoped>
.content-heard {
  height: 50px;
  width: calc(100vw - 20px);
  margin: 0 auto;
}

.text {
  margin-left: 10px;
  font-size: 18px;
}

.content-main {
  flex: 1;
  margin: 10px auto;
  width: 96%;
  height: 500px;
  overflow: scroll;
  padding-bottom: 20px;

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
      width: 100%;
      height: 100px;
      background-color: rgb(235, 235, 235);
      margin-bottom: 10px;
    }
  }
}
</style>
