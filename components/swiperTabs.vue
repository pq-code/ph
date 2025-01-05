<script setup lang='ts'>
import { ref, defineProps } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

let navbarHeight = ref(44);
const props = defineProps({
    stickyDisabled: {
        type: Boolean,
        default() {
            return true
        }
    },
    tabsList: {
        type: Array,
        default() {
            return [{
                name: '关注',
            }, {
                name: '推荐',
            }, {
                name: '电影'
            }, {
                name: '科技'
            }, {
                name: '音乐'
            }, {
                name: '美食'
            }, {
                name: '文化'
            }, {
                name: '财经'
            }, {
                name: '手工'
            }]
        }
    },
})

onLoad(() => {
    uni.getSystemInfo({
        success: (e) => {
            // #ifdef MP-WEIXIN
            navbarHeight.value = e.statusBarHeight + 44;
            // #endif
            console.log('height', navbarHeight.value)
        },
    });
});

const tabsClick = () => {

}
const centerClick = () => {

}

const centerChange = () => {

}

</script>
<template>
    <view>
        <u-sticky :offset-top="navbarHeight"
                  bgColor="#fff">
            <u-tabs :list="tabsList"
                    @click="tabsClick"></u-tabs>
        </u-sticky>

        <u-swiper :list="['https://cdn.uviewui.com/uview/swiper/swiper3.png',
            'https://cdn.uviewui.com/uview/swiper/swiper2.png',
            'https://cdn.uviewui.com/uview/swiper/swiper1.png',]"
                  @change="centerChange"
                  @click="centerClick">

        </u-swiper>
    </view>
</template>
<style lang='less' scoped>
</style>
