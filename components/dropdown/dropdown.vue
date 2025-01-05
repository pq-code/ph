<script setup lang='ts'>
import { ref } from 'vue';
const show = ref()
const value1 = ref()
const props = defineProps({
    dataList: {
        type: Array,
        default() {
            return [{ title: '品牌' }, { title: '价格区间' }, { title: '年份' }, { title: '地区' }]
        }
    }
})

const close = () => {
    show.value = false
}
const open = () => {
    show.value = true
}
</script>
<template>
    <view class="dropdown-centor">
        <u-row>
            <u-col :span="12 / dataList.length"
                   v-for="(item, index) in dataList">
                <view class="dropdown"
                      @click="show = true">{{ item.title }}
                    <view style="margin-left: 10px; size: 16;"><u-icon name="arrow-down"></u-icon></view>
                </view>
            </u-col>
        </u-row>
        <u-popup :show="show"
                 mode="bottom"
                 @close="close"
                 @open="open">
            <view style="height: 300px;">
                <text>选择器</text>
            </view>
        </u-popup>
    </view>
</template>
<style lang='less' scoped>
.dropdown-centor {
    height: 40px;
    width: 100%;

    // background-color: rgb(133, 133, 133);
    .dropdown {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        height: 40px;
        font-size: 16px;
        font-weight: bold;
        color: rgb(45, 45, 45);
        // background-color: rgb(133, 133, 133);
    }
}
</style>
