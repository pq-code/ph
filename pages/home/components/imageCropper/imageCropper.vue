<script setup>
import { ref, watch } from "vue";
import { onLoad, onPullDownRefresh, onShow } from "@dcloudio/uni-app";

const emits = defineEmits(["handleCrop"]);

const props = defineProps({
    cropImage: {
        type: String,
        default: ''
    }
})

const handleCrop =(e)=> {
	console.log(e.tempFilePath)
	emits('handleCrop',e.tempFilePath)
}

watch(props.cropImage,(n,o)=>{
	console.log(n)
})

</script>

<template>
  <view class="content">
	<qf-image-cropper 
	:src="props.cropImage" 
	:showBorder="true"
	:showAngle="true"
	:showGrid="true"
	:gpu="true"
	:zIndex="999"
	@crop="handleCrop"></qf-image-cropper>
  </view>
</template>

<style scoped lang="less">
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  height: calc(100vh - 20px);
  
}
</style>
