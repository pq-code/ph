<script setup>
	import {
		nextTick,
		onMounted,
		ref,
		reactive,
		watch
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

	const previewMain = ref({
		width: 0,
		height: 0
	}); // 容器
	const spacing = ref(5); // 间隔
	const cropImage = ref();
	const seletIndex = ref(); // 当前下标
	const isOpenCropper = ref(false);
	const iamgeMainMax = ref(1);
	const formData = reactive({
		imageTypeText: "九宫格",
		imageType: 1,
		scale: 1,
	});
	const editeImage = ref(false)

	const fileListBackups = ref([]); // 备份
	const fileList = ref([]); // 裁切后

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
				nineSquareGrid();
			})
			.exec(); // 执行查询
	});

	const l3r2 = () => {
		const widthL3R2L = (previewMain.value.width - spacing.value) * 0.3;
		const heightL3R2L = (previewMain.value.height - spacing.value * 2) / 3;
		const widthL3R2R = (previewMain.value.width - spacing.value) * 0.7;
		const heightL3R2R = (previewMain.value.height - spacing.value) / 2;

		fileListBackups.value = new Array(5).fill({}).map((item, index) => {
			if (index < 3) {
				return {
					width: widthL3R2L,
					height: heightL3R2L,
					x: 0,
					y: index * (heightL3R2L + spacing.value),
					url: "",
				};
			} else {
				return {
					width: widthL3R2R,
					height: heightL3R2R,
					x: widthL3R2L + spacing.value,
					y: (index - 3) * (heightL3R2R + spacing.value),
					url: "",
				};
			}
		});

		fileList.value = JSON.parse(JSON.stringify(fileListBackups.value));
	};
	const l2r3 = () => {
		const widthL3R2R = (previewMain.value.width - spacing.value) * 0.3;
		const heightL3R2R = (previewMain.value.height - spacing.value * 2) / 3;
		const widthL3R2L = (previewMain.value.width - spacing.value) * 0.7;
		const heightL3R2L = (previewMain.value.height - spacing.value) / 2;

		fileListBackups.value = new Array(5).fill({}).map((item, index) => {
			if (index < 2) {
				return {
					width: widthL3R2L,
					height: heightL3R2L,
					x: 0,
					y: index * (heightL3R2L + spacing.value),
					url: "",
				};
			} else {
				return {
					width: widthL3R2R,
					height: heightL3R2R,
					x: widthL3R2L + spacing.value,
					y: (index - 2) * (heightL3R2R + spacing.value),
					url: "",
				};
			}
		});

		fileList.value = JSON.parse(JSON.stringify(fileListBackups.value));
	};
	// 九宫格
	const nineSquareGrid = () => {
		const width = (previewMain.value.width - spacing.value * 2) / 3;
		const height = (previewMain.value.height - spacing.value * 2) / 3;
		fileListBackups.value = new Array(9).fill({}).map((item, index) => {
			let row = Math.floor(index / 3);
			let col = index % 3;
			let x = col * (width + spacing.value);
			let y = row * (height + spacing.value);
			return {
				width,
				height,
				x,
				y,
				url: "",
			};
		});
		fileList.value = JSON.parse(JSON.stringify(fileListBackups.value));
	};
	// 左右对称
	const lrSymmetry = () => {
		const width = (previewMain.value.width - spacing.value) / 2;
		const height = previewMain.value.height;
		fileListBackups.value = new Array(2).fill({}).map((item, index) => {
			let col = index % 2;
			let x = col * (width + spacing.value);
			let y = 0
			return {
				width,
				height,
				x,
				y,
				url: "",
			};
		});
		fileList.value = JSON.parse(JSON.stringify(fileListBackups.value));
	}
	const tbSymmetry = () => {
		const width = previewMain.value.width;
		const height = (previewMain.value.height - spacing.value) / 2;
		fileListBackups.value = new Array(2).fill({}).map((item, index) => {
			let col = index % 2;
			let x = 0
			let y = col * (height + spacing.value);
			return {
				width,
				height,
				x,
				y,
				url: "",
			};
		});
		fileList.value = JSON.parse(JSON.stringify(fileListBackups.value));
	}
	const showImageType = ref(false);
	const columns = reactive([
		[{
				label: "九宫格",
				value: 1,
			},
			{
				label: "九宫格(中间放大)",
				value: 2,
			},
			{
				label: "左右对称",
				value: 3,
			},
			{
				label: "上下对称",
				value: 4,
			},
			{
				label: "左三右二",
				value: 5,
			},
			{
				label: "左二右三",
				value: 6,
			},
		],
	]);

	const iamgeColumns = reactive([
		[{
				label: "添加图片",
				value: 1,
			},
			{
				label: "编辑图片",
				value: 2,
			},
			{
				label: "预览图片",
				value: 3,
			},
			{
				label: "删除图片",
				value: 4,
			}
		]
	]);

	onPullDownRefresh(() => {
		console.log("下拉刷新");
	});

	onShow(() => {});

	// 编辑图片
	const editPicture = (item, index) => {
		editeImage.value = true
		seletIndex.value = index
	}

	// 
	const editImagePicker = (item) => {
		editeImage.value = false
		if (item.value[0].value == 1) {
			uni.chooseImage({
				count: 1, //默认9
				sizeType: ["original"], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ["album"], //从相册选择
				success: function(res) {
					cropImage.value = res.tempFilePaths[0];
					isOpenCropper.value = true;
					fileListBackups.value[seletIndex.value] = {
						...fileListBackups.value[seletIndex.value],
						url: res.tempFilePaths[0],
						status: "success",
						message: `${seletIndex.value}`,
					};
				},
			});
		}
		
		if (item.value[0].value == 2) {
			cropImage.value = fileListBackups.value[seletIndex.value]
			isOpenCropper.value = true;
		}
		
		if (item.value[0].value == 3) {
			uni.previewImage({
				urls: fileList.value.map((val) => val.url),
				current: seletIndex.value,
				longPressActions: {
					itemList: ["发送给朋友", "保存图片", "收藏"],
					success: function(data) {
						console.log(
							"选中了第" +
							(data.tapIndex + 1) +
							"个按钮,第" +
							(data.index + 1) +
							"张图片"
						);
					},
					fail: function(err) {
						console.log(err.errMsg);
					},
				},
			});
		}
		if (item.value[0].value == 4) {
			fileList.value[seletIndex.value] = {
				...fileList.value[seletIndex.value],
				url: "",
				status: "success",
				message: `${seletIndex.value}`,
			};
			fileListBackups.value[seletIndex.value] = {
				...fileListBackups.value[seletIndex.value],
				url: "",
				status: "success",
				message: `${seletIndex.value}`,
			};
		}
	}

	// 裁切图片
	const handleCrop = (url) => {
		isOpenCropper.value = false;
		fileList.value[seletIndex.value] = {
			...fileList.value[seletIndex.value],
			url: url,
			status: "success",
			message: `${seletIndex.value}`,
		};
	};

	// 绘制图片
	const drawItem = (ctx, item) => {
		if (item.url) {
			// ctx.drawImage(图片对象, 图像裁剪的x位置, 图像裁剪的y位置, 裁剪的宽度, 裁剪的高度, x位置, y位置, 宽度, 高度)
			ctx.drawImage(item.url, item.x, item.y, item.width, item.height);
		} else {
			// 没有图片绘制白色背景
			ctx.setFillStyle("white");
			ctx.fillRect(item.x, item.y, item.width, item.height);
		}
	};

	// 生成图片
	const getCanvasSize = async () => {
		const width = previewMain.value.width
		const height = previewMain.value.height
		// 创建canvas
		const ctx = uni.createCanvasContext("myCanvas");

		// 设置背景颜色
		ctx.setFillStyle("#e8e8e8"); // 设置背景颜色为白色
		ctx.fillRect(0, 0, width, height); // 填充整个画布

		fileList.value.forEach((item, index) => {
			console.log(';',item.url)
			drawItem(ctx, item);
		});

		// 绘制完成后导出图片
		ctx.draw(true, () => {
			uni.canvasToTempFilePath({
				canvasId: "myCanvas",
				success: (res) => {
					const tempFilePath = res.tempFilePath;
					// 预览生成的图片
					uni.previewImage({
						current: tempFilePath, // 当前显示的图片链接
						urls: [tempFilePath], // 需要预览的图片链接列表
						success: () => {
							clearCanvas();
						},
						fail: () => {
							clearCanvas();
						},
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
		});
	};

	// 清空画布
	const clearCanvas = () => {
		const ctx = uni.createCanvasContext("myCanvas");
		ctx.clearRect(0, 0, previewMain.value.width, previewMain.value.height); // 清空整个画布
		ctx.draw();
	};

	// 批量录入
	const batchInput = () => {
		const count = fileListBackups.value.length
		uni.chooseImage({
			count, // 数量控制
			sizeType: ["original", ], //可以指定是原图还是压缩图，默认二者都有
			sourceType: ["album"], //从相册选择
			success: function(res) {				
				const ctx = uni.createCanvasContext("myCanvas");
				// 设置背景颜色
			
				res.tempFilePaths.forEach((item, index) => {
					// 调整图片大小和清晰度
					const width = fileList.value[index].width
					const height = fileList.value[index].height
					const proportion = fileList.value[index].width / fileList.value[index].height
					
					// 保存原始数据
					fileListBackups.value[index] = {
						...fileListBackups.value[index],
						url: item, // 原图
						status: "success",
						message: `${index}`,
					};
					
					// 获取图片宽高做裁切
					uni.getImageInfo({
					    src: item, // 图片路径
					    success: function (imageInfo) {
							// 计算宽高比例最大限度不变形适配
							let imageW = imageInfo.width;
							let imageH = imageInfo.height;
							
							let drawX = 0
							let drawY = 0

							const proportion = width / height

							// 判断长边，宽或高
							if(imageW < imageH) {
								drawY = imageH / 2 - (imageW / 2)
								imageH = imageW
							} else {
								drawX = imageW / 2 - (imageH / 2)
								imageW = imageH
							}
							
							// 禁用图像平滑处理以保持清晰度
							ctx.imageSmoothingEnabled = false;
							
							// (图片对象, 图像裁剪的x位置, 图像裁剪的y位置, 裁剪的宽度, 裁剪的高度, x位置, y位置, 宽度, 高度)
							// 绘制图片
							ctx.drawImage(item, drawX, drawY, imageW, imageH,0,0,previewMain.value.width, previewMain.value.height);

							// 绘制完成后导出图片
							ctx.draw(true, () => {
								uni.canvasToTempFilePath({
									canvasId: "myCanvas",
									success: (res1) => {
										const cropImage = res1.tempFilePath;

										// 预览生成的图片
										fileList.value[index] = {
											...fileList.value[index],
											url: cropImage,
											status: "success",
											message: `${index}`,
										};
										clearCanvas() // 清除
									},
									fail: (err) => {
										console.error("导入图片失败:", err);
										// 提示用户合并图片失败
										uni.showToast({
											title: "导入图片失败",
											icon: "none",
										});
									},
								});
							});
					    },
					    fail: function (error) {
					        console.error("获取图片信息失败: ", error);
					    }
					});
				});
			},
		});
	};

	// 选择图片类型
	const typeConfirm = (item) => {
		formData.imageType = item.value[0].value;
		formData.imageTypeText = item.value[0].label;
		showImageType.value = false;
		formData.scale = 1;

		const typeFunctions = {
			1: nineSquareGrid,
			3: lrSymmetry,
			4: tbSymmetry,
			5: l3r2,
			6: l2r3,
		};

		const selectedFunction = typeFunctions[formData.imageType];
		if (selectedFunction) {
			selectedFunction();
		}
	};

	// 中心放大
	const formDataScale = (e) => {
		formData.scale = e;
		let result = {
			x: fileList.value[3].x + fileList.value[3].width + spacing.value,
			y: fileList.value[3].y + fileList.value[3].height + spacing.value,
			width: 0,
			height: 0,
		};

		const originalWidth = fileList.value[3].width
		const originalHeight = fileList.value[3].height

		// 计算放大比例
		const scaleRatio = e / 100 + 1;

		// 调整宽度和高度
		result.width = originalWidth * scaleRatio;
		result.height = originalHeight * scaleRatio;

		// 计算新的 x 和 y 坐标，保持中心点不变
		const originalX = result.x - (result.width - originalWidth) / 2;
		const originalY = result.y - (result.height - originalHeight) / 2;

		result.x = originalX;
		result.y = originalY;

		fileList.value[4] = {
			// ...fileList.value[4],
			x: result.x,
			y: result.x,
			width: result.width,
			height: result.height,
			zIndex: 700
		};
	}
</script>

<template>
	<page title="拼图" lButton="批量录入" rButton="生成照片" @lButton="batchInput" @rButton="getCanvasSize">
		<imageCropper v-show="isOpenCropper" :cropImage="cropImage" @handleCrop="handleCrop"></imageCropper>
		<u-picker :show="showImageType" :columns="columns" keyName="label" @cancel="showImageType = false"
			@confirm="typeConfirm"></u-picker>
		<u-picker :show="editeImage" :columns="iamgeColumns" keyName="label" @cancel="editeImage = false"
			@confirm="editImagePicker"></u-picker>
		<view class="content">
			<view class="content-main">
				<view id="contentMain" class="image-container">
					<view class="image-view" v-for="(item, index) of fileList" :key="item.url || index" :style="{
					  width: `${item.width}px`,
					  height: `${item.height}px`,
					  top: `${item.y}px`,
					  left: `${item.x}px`,
								 'z-index': `${item.zIndex || 666}`
					}" @click.stop="editPicture(item, index)">
											<u-image :height="`${item.height}px`" :width="`${item.width}px`" mode="aspectFill"
												:src="item.url">
											</u-image>
										</view>
				</view>

				<view class="preview-main-bottom">
					<canvas canvas-id="myCanvas"
						:style="{ width: previewMain.width +'px', height: previewMain.height +'px', opacity: 0, zIndex: 1 }"></canvas>
				</view>
			</view>

			<view class="controlPanel">
				<u-form labelWidth="100px" labelPosition="left" labelAlign="left" :model="formData" ref="form1">
					<u-form-item label="选择拼图类型" prop="imageType" borderBottom ref="imageType" border="none"
						placeholder="请选择">
						<u-input v-model="formData.imageTypeText" disabled disabledColor="#ffffff" placeholder="请选择"
							border="none" @click="showImageType = true"></u-input>
						<template #right>
							<u-icon name="arrow-right" @click="showImageType = true"></u-icon>
						</template>
					</u-form-item>
					<u-form-item v-if="formData.imageType == 2" label="中间图片大小" prop="opacity" borderBottom ref="text">
						<view style="display: flex; align-items: center">
							<view style="width: 83%">
								<u-slider v-model="formData.scale" @changing="formDataScale" min="1"
									max="100"></u-slider>
							</view>
							{{ `${formData.scale} %` }}
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
			overflow: auto;

			.preview-main-top {
				pointer-events: none;
				position: absolute;
				top: 0px;
				padding: 10px;
				width: calc(100vw - 40px);
				height: calc(100vw - 40px);
				display: grid;
				grid-gap: 5px;
				grid-template-rows: 1fr 1fr 1fr;
				grid-template-columns: 1fr 1fr 1fr;
				z-index: 300;

				.preview-main-image {
					padding: 5px;
					width: calc(100% - 10px);
					height: calc(100% - 10px);
					position: relative;
					display: flex;
					justify-content: space-between;

					.preview-main-image-icon {
						pointer-events: auto;
						width: 16px;
					}
				}
			}

			.preview-main-bottom {
				z-index: 100;
				pointer-events: none;
				position: absolute;
				top: 0px;
				width: calc(100vw - 20px);
				height: calc(100vw - 20px);
				display: node;
				padding: 10px;
			}

			.preview-main {
				padding: 10px;
				width: calc(100vw - 40px);
				height: calc(100vw - 40px);
				display: grid;
				grid-gap: 5px;
				z-index: 200;
				grid-template-rows: 1fr 1fr 1fr;
				grid-template-columns: 1fr 1fr 1fr;
			}

			.preview-main-lr {
				padding: 10px;
				width: calc(100vw - 40px);
				height: calc(100vw - 40px);
				display: grid;
				grid-gap: 5px;
				z-index: 200;
				grid-template-columns: 1fr 1fr;
			}

			.preview-main-tb {
				padding: 10px;
				width: calc(100vw - 40px);
				height: calc(100vw - 40px);
				display: grid;
				grid-gap: 5px;
				z-index: 200;
				grid-template-rows: 1fr 1fr;
			}

			.preview-main-l3r2 {
				width: calc(100vw - 40px);
				height: calc(100vw - 40px);
				margin: 10px;
				background-color: #e8e8e8;

				// .preview-main-l3r2-l {
				// 	width: 30%;
				// 	display: grid;
				// 	grid-gap: 5px;
				// 	grid-template-rows: 1fr 1fr 1fr;
				// }

				// .preview-main-l3r2-r {
				// 	width: 70%;
				// 	display: grid;
				// 	grid-gap: 5px;
				// 	grid-template-rows: 1fr 1fr;
				// }

				// .image-button {}
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

	.image-container {
		width: calc(100vw - 40px);
		height: calc(100vw - 40px);
		margin: 10px;
		background-color: #e8e8e8;
		position: relative;

		.image-view {
			background-color: #f3f3f3;
			position: absolute;

			.iamge-icon {
				position: absolute;
				top: 0;
				display: flex;
				justify-content: space-between;
				pointer-events: auto;
			}
		}
	}
</style>
