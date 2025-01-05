<script setup lang='ts'>
import { ref, defineProps } from 'vue';
const props = defineProps({
    title: {
        type: String,
        default() {
            return ''
        }
    },
    userInfor: {
        type: Object,
        default() {
            return {}
        }
    },
    backUrl: {
        type: String,
        default() {
            return ''
        }
    }
})

const leftClick = () => {
    if (props.backUrl == '') {
        uni.navigateBack({});
    } else {
        console.log(props.backUrl)
        uni.switchTab({
            url: props.backUrl,
        });
    }
}

</script>
<template>
    <view class='page-search'>
        <view class="page-search-navbar">
            <u-navbar :title="title"
                      height="50"
                      @leftClick="leftClick"
                      :fixed="false"
                      :placeholder="true"
                      :autoBack="false">
                <template #left>
                    <view style="display: flex;">
                        <u-icon name="arrow-left"
                                size="20"
                                @click="leftClick"></u-icon>
                        <u-image :showLoading="true"
                                 v-if="Object.keys(userInfor).length !== 0"
                                 :src="userInfor.srv"
                                 width="30px"
                                 height="30px"
                                 shape="circle"></u-image>
                        <view v-if="Object.keys(userInfor).length !== 0"
                              class="user-name">{{ userInfor.name }}</view>
                    </view>
                </template>
            </u-navbar>
        </view>
        <view class="page-search-center">
            <slot></slot>
        </view>
		
    </view>
</template>
<style lang='less' scoped>
.page-search {
    width: 100vw;
    height: 90vh;
    background-color: rgb(204, 204, 204);

    .page-search-navbar {
        // float: top;
        // height: 50px;
        width: 100vw;


        .user-name {
            font-size: 10px;
            line-height: 30px;
            margin-left: 6px;
            text-align: center;
        }
    }

    .page-search-center {
        display: flex;
        flex-direction: column;
        overflow: scroll;
        height: calc(100vh - 50px);
        // #ifdef MP-WEIXIN
        height: calc(100vh - 97px);
        // #endif
        // height: 100%;
        background-color: rgb(255, 255, 255);

    }
	.bottom-button{
		width: 100%;
		height: 80px;
	}
}
</style>
