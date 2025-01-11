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
	import {
		getCurrentInstance
	} from "vue";
	const instance = getCurrentInstance();

	const imageurl = ref({
		url: '',
		status: "success",
		message: 0,
	})
	const formData = ref({
		test: '',
		image: '',
		opacity: '',
		angle: -45, // 角度
		density: '' // 密度
	})
	const previewMain = ref({
		width: '',
		height: ''
	})

	// 清空画布
	const clearCanvas = () => {
		const ctx = uni.createCanvasContext("watermark");
		ctx.clearRect(0, 0, previewMain.value.width, previewMain.value.height); // 清空整个画布
		ctx.draw();
	};

	onLoad(() => {
		editeImage.value = true
		nextTick(() => {
			editeImage.value = false
		})
	})

	onMounted(() => {
		// 创建查询对象
		const query = uni.createSelectorQuery().in(instance.proxy);

		// 选择元素
		query
			.select("#contentMain")
			.boundingClientRect((data) => {
				if (data) {
					// data包含元素的宽高等信息
					console.log("元素的宽：" + data.width);
					console.log("元素的高：" + data.height);
					previewMain.value = {
						width: data.width,
						height: data.height,
					};
				}
			})
			.exec(); // 执行查询
	});

	const previewImage = (urls) => {
		uni.previewImage({
			urls: [urls],
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
	const getImageInfo = (src) => {
		return new Promise((resolve, reject) => {
			uni.getImageInfo({
				src,
				success: resolve,
				fail: reject
			});
		});
	};

	const chooseImage = () => {
		uni.chooseImage({
			count: 1,
			sizeType: ["original", "compressed"],
			sourceType: ["album"],
			success: async function(res) {
				clearCanvas() // 重新绘制
				const width = previewMain.value.width;
				const height = previewMain.value.height;
				const proportion = width / height;

				// 获取图片宽高做裁切
				const imageInfo = await getImageInfo(res.tempFilePaths[0]);

				let imageW = imageInfo.width;
				let imageH = imageInfo.height;

				// 计算缩放比例，确保图片在保持宽高比的前提下，缩放到画布的最大尺寸
				let scale = 1;

				if (imageW > imageH) {
					// 图片宽度大于高度，按高度缩放
					scale = imageW / width;
				} else {
					// 图片高度大于宽度，按宽度缩放
					scale = imageH / height;
				}

				// 缩放后的图片宽度和高度
				imageW /= scale;
				imageH /= scale;

				// 计算绘制位置，确保图片在 Canvas 中居中显示
				let drawX = (width - imageW) / 2;
				let drawY = (height - imageH) / 2;

				// 绘制图片到 Canvas
				const ctx = uni.createCanvasContext("watermark");
				// 禁用图像平滑处理以保持清晰度
				ctx.imageSmoothingEnabled = false;
				await ctx.drawImage(imageInfo.path, drawX, drawY, imageW, imageH);
				await ctx.draw(true);
				// const cropImage = (await uni.canvasToTempFilePath({ canvasId: "watermark" })).tempFilePath;

				imageurl.value = {
					url: imageInfo.path,
					width: imageW,
					height: imageH,
					x: drawX,
					y: drawY,
					status: "success",
					message: 0,
				};
				editeImage.value = false
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

	const addWatermark = async () => {
		const imageWidth = imageurl.value.width || 100;
		const imageHeight = imageurl.value.height || 100;
		const imageX = imageurl.value.x || 0;
		const imageY = imageurl.value.y || 0;
		const ctx = uni.createCanvasContext('watermark'); // 创建canvas上下文
		clearCanvas() // 重新绘制
		await ctx.drawImage(imageurl.value.url, imageX, imageY, imageWidth, imageHeight);
		console.log('imageInfo', imageurl.value.url, imageX, imageY, imageWidth, imageHeight)
		if (formData.value.text) {
			let fontSize = formData.value.fontSize || 20;

			// 创建上下文
			// 计算旋转角度（弧度）
			const angle = formData.value.angle * Math.PI / 180;
			// 设置填充文本样式
			ctx.textAlign = 'center';
			ctx.font = `${fontSize}px Arial`;
			ctx.fillStyle = `rgba(50, 50, 50, ${formData.value.opacity ||0.3})`;

			// 循环绘制多个水印
			for (let i = 0; i < 15; i++) {
				// 保存当前画布状态
				ctx.save();

				// 计算水印的x和y坐标，这里简单地将水印分散在画布上
				const x = (i % 5) * (imageWidth / 2); // 每行5个水印
				const y = Math.floor(i / 5) * (imageHeight / 2); // 每列2个水印，根据行数计算y坐标

				// 移动到水印的起始位置
				ctx.translate(x + imageWidth / 2, y + imageHeight / 2);

				// 旋转画布
				ctx.rotate(angle);

				// 绘制水印文本
				ctx.fillText(formData.value.text, 0, 0);

				// 恢复画布状态以重置变换
				ctx.restore();

				// 恢复平移和旋转状态，准备绘制下一个水印
				// ctx.resetTransform(); // 重置当前变换矩阵为单位矩阵，并重置当前变换原点
			}

			// 恢复画布状态
			ctx.restore();
			// // 设置字体样式和大小
			// ctx.setFontSize(fontSize);
			// ctx.setFillStyle('rgba(255, 255, 255, 0.5)'); // 半透明白色字体

			// // 计算水印文本的位置
			// const textWidth = ctx.measureText(formData.value.text).width;
			// const x = (imageWidth - textWidth) / 2;
			// const y = imageHeight - fontSize - 10; // 距离底部10px
			// console.log(imageWidth, imageHeight, textWidth, x, y)
			// 绘制水印文本
		} else {
			ctx.drawImage(formData.value.image.url, 0, 0, 10, formData.value.image.height * formData.value.image
				.width / 10);
		}
		ctx.draw(true, () => {})
	}

	const editeImage = ref(false)
	const iamgeColumns = reactive([
		[{
				label: "添加图片/编辑图片",
				value: 1,
			},
			{
				label: "预览图片",
				value: 2,
			},
		]
	])
	const editImagePicker = (item) => {
		if (item.value[0].value == 1) {
			chooseImage();
		} else {
			previewImage(imageurl.value.url);
		}
	}
	// 生成图片
	const generateImages = () => {
		// const ctx = uni.createCanvasContext('watermarkImage'); // 创建canvas上下文
		//  ctx.drawImage(imageurl.value.url);
		//  ctx.draw(true, () => {
		// 		// 预览生成的图片
		// 		uni.previewImage({
		// 			current: imageurl.value.url, // 当前显示的图片链接
		// 			urls: [imageurl.value.url], // 需要预览的图片链接列表
		// 			success: () => {
		// 			},
		// 			fail: () => {
		// 			},
		// 		});
		//  })
		uni.canvasToTempFilePath({
			canvasId: "watermark",
			success: (res) => {
				const tempFilePath = res.tempFilePath;
				// 预览生成的图片
				uni.previewImage({
					current: tempFilePath, // 当前显示的图片链接
					urls: [tempFilePath], // 需要预览的图片链接列表
					success: () => {},
					fail: () => {},
				});
			},
			fail: (err) => {
				console.error("合并图片失败:", err);
				// 提示用户合并图片失败
				uni.showToast({
					title: "合并图片失败",
					icon: "none",
				});
			},
		});
	}

	const selsectImageFn = () => {
		if (formData.value.image) {
			uni.previewImage({
				urls: [formData.value.image],
				current: 0,
				longPressActions: {
					itemList: ["发送给朋友", "保存图片", "收藏"],
					success: function(data) {},
					fail: function(err) {
						console.log(err.errMsg);
					},
				},
			});
		} else {
			uni.chooseImage({
				count: 1, //默认9
				sizeType: ["original"], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ["album"], //从相册选择
				success: async function(res) {
					const hw = await getImageInfo(res.tempFilePaths[0])
					formData.value.image = {
						url: res.tempFilePaths[0],
						width: hw.width,
						height: hw.height,
						status: "success",
					}
					addWatermark() // 添加水印
				}
			});
		}
	}
	// 生成水印
	const generateWatermark = (item, image) => {

	}
</script>

<template>
	<u-picker :show="editeImage" :columns="iamgeColumns" keyName="label" @cancel="editeImage = false"
		@confirm="editImagePicker" :closeOnClickOverlay='true'></u-picker>
	<page title="添加水印" rButton="生成图片" @rButton="generateImages">
		<view class="content">
			<view class="content-main" id='contentMain'>
				<view class="watermark-canvas" @click="editeImage= true">
					<canvas canvas-id="watermark"
						:style="{ width: previewMain.width +'px', height: previewMain.height +'px'}"></canvas>
				</view>
				<view class="watermark-canvas-image">
					<canvas canvas-id="watermarkImage"
						:style="{ width: previewMain.width +'px', height: previewMain.height +'px'}"></canvas>
				</view>
			</view>


			<view class="controlPanel">
				<u-form labelWidth="100px" labelPosition="left" labelAlign="left" :model="formData" ref="form1">
					<u-form-item label="水印文字" prop="text" borderBottom ref="text">
						<u-input v-model="formData.text" border="none" @change="addWatermark"></u-input>
					</u-form-item>
					<u-form-item label="水印图片" prop="image" borderBottom ref="text">
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
					</u-form-item>
					<u-form-item label="水印密度" prop="density" borderBottom ref="text">
						<view style="display: flex;align-items: center;">
							<view style="width: 83%">
								<u-slider v-model="formData.density" @changing="(e)=> formData.density = e" min="1"
									max="100"></u-slider>
							</view>

							{{`${formData.density} %`}}
						</view>
					</u-form-item>
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

			.watermark-canvas {
				z-index: 200;
				opacity: 1;
			}

			.watermark-canvas-image {
				pointer-events: none;
				position: absolute;
				top: 0;
				z-index: 100;
				opacity: 0;
			}

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