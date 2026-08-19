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
const emits = defineEmits(['lButton','rButton','back'])
const leftClick = () => {
    let defaultPrevented = false
    emits('back', { preventDefault: () => { defaultPrevented = true } })
    if (defaultPrevented) return
    if (props.backUrl == '') {
		uni.navigateBack({});
    } else {
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
	background-color: #f0f2f5;
	overflow: hidden;
	display: flex;
	flex-direction: column;

	.page-navbar {
		width: 100vw;
	}

	.page-center {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: scroll;
		background-color: #f0f2f5;
	}

	.page-bottom-button {
		z-index: 660;
		width: calc(100% - 24px);
		height: 56px;
		background-color: #ffffff;
		display: flex;
		flex-direction: row;
		gap: 12px;
		padding: 12px;
		padding-bottom: calc(12px + env(safe-area-inset-bottom));
		box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.04);
	}
}
</style>
