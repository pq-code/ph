<script setup lang="ts">
import { ref } from 'vue';
const props = defineProps({
    title: {
        type: String,
        default() {
            return '主页';
        },
    },
    backUrl: {
        type: String,
        default() {
            return '';
        },
    },
	lButton: {
		type: String,
		default() {
		    return '';
		},
	},
	rButton: {
		type: String,
		default() {
		    return '';
		},
    },
    rButtonDisabled: {
        type: Boolean,
        default() {
            return false;
        },
    },
    lButtonDisabled: {
        type: Boolean,
        default() {
            return false;
        },
    },
});
const emits = defineEmits(['lButton','rButton'])
const leftClick = () => {
    console.log(props.backUrl)
    if (props.backUrl == '') {
		uni.navigateBack({});
    } else {
        console.log(props.backUrl)
        uni.navigateTo({
            url: props.backUrl,
        });
    }
};

const bottomBUtton = (type) => {
	if(type == 1) emits('lButton')
	if(type == 2) emits('rButton')
}

</script>
<template>
    <view class="page">
        <view class="page-navbar">
            <u-navbar :title="title"
                      height="50"
                      @leftClick="leftClick"
                      :fixed="false"
                      :placeholder="true"
                      :autoBack="false"> </u-navbar>
        </view>
        <view class="page-center">
            <slot></slot>
        </view>
		
		<view v-if="lButton || rButton" class="page-bottom-button">
			<u-button v-if="lButton" :disabled="lButtonDisabled" type="primary" shape="circle" @click="bottomBUtton(1)">{{ lButton|| '批量录入' }}</u-button>
			<u-button v-if="rButton" :disabled="rButtonDisabled" type="success" shape="circle" @click="bottomBUtton(2)">{{ rButton|| '生成照片' }}</u-button>
			<slot name="pageBottom"></slot>
		</view>
    </view>
</template>
<style lang="less" scoped>
.page {
    width: 100vw;
    height: 100vh;
    background-color: rgb(219, 219, 219);
	overflow: hidden;
	display: flex;
	flex-direction: column;
    .page-navbar {
        // float: top;
        // height: 50px;
        width: 100vw;
    }

    .page-center {
		flex: 1;
        display: flex;
        flex-direction: column;
        overflow: scroll;
        // height: calc(100vh - 130px);
        // // #ifdef MP-WEIXIN
        // height: calc(100vh - 177px);
        // // #endif
        // height: 100%;
        background-color: rgb(255, 255, 255);
    }
	.page-bottom-button {
        z-index: 660;
		width: calc(100% - 20px);
		height: 60px;
		background-color: rgb(255, 255, 255);
		display: flex;
		flex-direction: row;
		gap: 10px;
		padding: 10px;
	}
}
</style>
