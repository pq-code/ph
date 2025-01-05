<script setup>
	import {
		nextTick,
		onMounted,
		ref,
		reactive,
		watch,
		computed
	} from "vue";
	import {
		onLoad,
		onPullDownRefresh,
		onShow
	} from "@dcloudio/uni-app";
	import dayjs from "dayjs";
	import imageCropper from "@/pages/home/components/imageCropper/imageCropper.vue";
	import page from "@/components/pages/page.vue";

	const imageurl = ref({
		url: '',
		status: "success",
		message: 0,
	})
	const cropImage = ref()
	const formData = ref({
		test: '',
		iamge: '',
		opacity: '',
		angle: 45, // 角度
		density: '' // 密度
	})

	const selectImageFn = (item) => {
		if (item) {
			previewImage(item.url);
		} else {
			chooseImage();
		}
	}

	const previewImage = (urls) => {
		uni.previewImage({
			urls: urls,
			current: 1,
			longPressActions: {
				itemList: ["发送给朋友", "保存图片", "收藏"],
				success: function(data) {},
				fail: function(err) {
					console.log(err.errMsg);
					uni.showToast({
						title: '预览失败',
						icon: 'none'
					});
				},
			},
		});
	}

	const chooseImage = () => {
		uni.chooseImage({
			count: 1,
			sizeType: ["original", "compressed"],
			sourceType: ["album"],
			success: function(res) {
				debugger
				cropImage.value = res.tempFilePaths[0];
				imageurl.value = {
					url: res.tempFilePaths[0],
					status: "success",
					message: 0,
				};
			},
			fail: function(err) {
				console.log(err.errMsg);
				uni.showToast({
					title: '选择图片失败',
					icon: 'none'
				});
			},
		});
	}

	const watermarkStyle = (watermark) => {
		return {
			transform: `rotate(-${formData.angle}deg) translate(${watermark.x}%, ${watermark.y}%)`,
			width: `${watermark.width}px`,
			height: '50px'
		};
	}

	const watermarks = computed(() => {
		const watermarks = [];
		for (let i = 0; i < 9; i++) {
			watermarks.push({
				x: Math.floor(Math.random() * 130) + 70, // 随机x位置
				y: Math.floor(Math.random() * 190) + 20, // 随机y位置
				width: Math.floor(Math.random() * 120) + 70 // 随机宽度
			});
		}
		return watermarks
	})

	const addWatermark = (imageSrc, watermarkText, fontSize) => {
		const ctx = uni.createCanvasContext('watermark'); // 创建canvas上下文
		uni.getImageInfo({
			src: imageSrc,
			success: (info) => {
				const {
					width,
					height
				} = info;
				ctx.drawImage(imageSrc, 0, 0, width, height); // 绘制原始图片
				ctx.setFontSize(fontSize); // 设置字体大小
				ctx.setFillStyle('red'); // 设置水印颜色
				ctx.setGlobalAlpha(0.5); // 设置水印透明度
				ctx.fillText(watermarkText, width - 150, height - 40); // 绘制水印文字
				ctx.draw(false, () => {
					uni.canvasToTempFilePath({
						canvasId: 'watermark',
						success: (res) => {
							this.watermarkedImage = res.tempFilePath; // 存储生成的图片路径
						},
						fail: (err) => {
							console.error('Failed to add watermark:', err);
						},
					});
				});
			},
			fail: (err) => {
				console.error('Failed to get image info:', err);
			},
		});
	}
</script>

<template>
	<imageCropper v-show="isOpenCropper" :cropImage="cropImage" @handleCrop="handleCrop"></imageCropper>
	<page title="添加水印" rButton="生成图片">
		<view class="content">
			<view class="content-main">
				<view class="iamge">
					<u-image mode="aspectFit" width="350" height="350" :src="imageurl.url"
						@click.stop="selectImageFn(item)">
					</u-image>
				</view>
				<view class="watermark-container">
					<view class="watermark" :style="watermarkStyle(item)" v-for="item of watermarks">{{formData.text}}
					</view>
				</view>

				<view class="preview-main-bottom">
					<canvas canvas-id="watermark" style="height: 370px; width: 370px;"></canvas>
				</view>
			</view>


			<view class="controlPanel">
				<u-form labelWidth="100px" labelPosition="left" labelAlign="left" :model="formData" ref="form1">
					<u-form-item label="水印文字" prop="text" borderBottom ref="text">
						<u-input v-model="formData.text" border="none"></u-input>
					</u-form-item>
					<!-- <u-form-item label="水印图片" prop="image" borderBottom ref="text">
						<u-image width="40" height="40" :src="formData.image" @click.stop="selsectImageFn(item)">
						</u-image>
					</u-form-item>
					<u-form-item label="水印透明度" prop="opacity" borderBottom ref="text">
						<view style="display: flex;align-items: center;">
							<view style="width: 83%">
								<u-slider v-model="formData.opacity" @changing="(e)=> formData.opacity = e" min="1"
									max="100"></u-slider>
							</view>

							{{`${formData.opacity} %`}}
						</view>
					</u-form-item>
					<u-form-item label="水印旋转" prop="angle" borderBottom ref="text">
						<view style="display: flex;align-items: center;">
							<view style="width: 83%">
								<u-slider v-model="formData.angle" @changing="(e)=> formData.angle = e" min="1"
									max="100"></u-slider>
							</view>

							{{`${formData.angle} C`}}
						</view>
					</u-form-item> -->
					<!-- <u-form-item label="水印密度" prop="density" borderBottom ref="text">
						<view style="display: flex;align-items: center;">
							<view style="width: 83%">
								<u-slider v-model="formData.density" @changing="(e)=> formData.density = e" min="1"
									max="100"></u-slider>
							</view>

							{{`${formData.density} %`}}
						</view>
					</u-form-item> -->
				</u-form>
			</view>
		</view>
	</page>

</template>

<style scoped lang="less">
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 10px;
		height: calc(100vh - 20px);
		background: #e8e8e8;

		.content-main {
			position: relative;
			width: calc(100vw - 20px);
			height: calc(100vw - 20px);
			border-radius: 6px;
			background: #ffffff;

			.watermark-container {
				pointer-events: none;
				width: calc(100vw - 40px);
				height: calc(100vw - 40px);
				padding: 10px;
				position: absolute;
				top: 0px;
				font-size: 25px;
				color: rgba(0, 0, 0, 0.2);
				overflow: hidden;

				.watermark {
					white-space: nowrap;
					margin: 0 auto;
					transform: translate(-50%, -50%) rotate(-30deg);
					/* 居中并旋转 */
				}
			}

			.iamge {
				width: calc(100vw - 40px);
				height: calc(100vw - 40px);
				padding: 10px;
			}

			.preview-main-bottom {
				z-index: 100;
				pointer-events: none;
				position: absolute;
				top: 0px;
				width: calc(100vw - 20px);
				height: calc(100vw - 20px);
				display: node;
			}

		}

		.controlPanel {
			margin-top: 10px;
			width: calc(100vw - 40px);
			padding: 10px;
			overflow-y: auto;
			border-radius: 6px;
			background: #ffffff;
		}
	}
</style>
