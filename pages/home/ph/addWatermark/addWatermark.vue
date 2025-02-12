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
	})// 图片信息
	const originalImage = ref({
		url: '',
		status: "success",
		message: 0,
	})// 原始图片信息
const formData = ref({
		longitude: '', //经度
	latitude: '', // 纬度
	address: '', // 地址
		notes:'', // 备注
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

	// 水印类型
	const watermarkType = 1; // 1:现场拍照水印，2：图片水印

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
	// 添加图片
	const chooseImage = () => {
		return new Promise((resolve, reject) => {
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

				// 保留原始图片信息
				originalImage.value.url = {
					url: imageInfo.path,
					width: imageW,
					height: imageH,
					status: "success",
					message: 0,
				};
				
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
				resolve();
			},
			fail: function(err) {
				console.log(err.errMsg);
				uni.showToast({
					title: '选择图片失败',
					icon: 'none'
				});
				reject();
			},
		});
		});
	}
	// 添加水印
	const addWatermark = async () => {
  const { width: imageWidth, height: imageHeight, x: imageX, y: imageY, url } = imageurl.value;
  const ctx = uni.createCanvasContext('watermark');
  
  // 清除并重绘原图
  clearCanvas()
  await ctx.drawImage(url, imageX, imageY, imageWidth, imageHeight);
  
  // 设置文字样式
	ctx.save();

  // 1. 绘制中间的大号水印文字
  const centerText = "现场拍照";
  const centerFontSize = Math.min(imageWidth, imageHeight) * 0.15; // 自适应字体大小
  ctx.setFontSize(centerFontSize);
  ctx.setTextAlign('center');
  ctx.setTextBaseline('middle');
  
  // 计算中心点位置
  const centerX = imageX + imageWidth / 2;
  const centerY = imageY + imageHeight / 2;
  
  // 设置文字样式
  ctx.translate(centerX, centerY);
  
  // 先绘制白色描边
  ctx.setGlobalAlpha(0.2); // 描边透明度
  ctx.setLineWidth(3); // 描边宽度
  ctx.setStrokeStyle('#FFFFFF');
  ctx.strokeText(centerText, 0, 0);
  
  // 再绘制主体文字
  ctx.setGlobalAlpha(0.2); // 主体文字透明度
  ctx.setFillStyle('#666666'); // 使用浅灰色
  ctx.font = `bold ${centerFontSize}px sans-serif`;
  ctx.fillText(centerText, 0, 0);
  
  ctx.restore();
	
  const fontSize = 14; // 设置较小的字号
  ctx.setFontSize(fontSize);
  ctx.setTextAlign('left');
  ctx.setTextBaseline('top');
  
  // 设置文字颜色和透明度
  ctx.setGlobalAlpha(0.5); // 半透明效果
  ctx.setFillStyle('#666666'); // 灰色文字
  
  // 准备水印文字内容
  const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss');
  const watermarkLines = [
    `经度：${formData.value.longitude}`,
    `纬度：${formData.value.latitude}`,
    `坐标：WGS84坐标系`,
    `地址：${formData.value.address}`,
    `时间：${timestamp}`,
    `备注：${formData.value.notes}`
  ];
  
  // 计算文字位置
  const padding = 20;
  const lineHeight = fontSize + 4;
  let currentY = imageHeight - (watermarkLines.length * lineHeight) - padding + imageY;

  // 绘制每行文字
  watermarkLines.forEach((line, index) => {
    // 绘制主体文字
    ctx.setGlobalAlpha(1);
    ctx.setFillStyle('#FFFFFF');
    ctx.fillText(line, padding + imageX, currentY);
    currentY += lineHeight;
  });

  ctx.restore();
  ctx.draw(true);
}

	const editeImage = ref(false)
	const iamgeColumns = reactive([
		[{
				label: "添加图片/编辑图片",
				value: 1,
			},
			{
				label: "拍照",
				value: 2,
			},
			{
				label: "预览图片",
				value: 3,
			},
		]
	])
	const editImagePicker = async(item) => {
		if (item.value[0].value == 1) {
			await chooseImage(); // 添加图片
			// 添加水印
			addWatermark()
		} else if(item.value[0].value == 2) {
			uni.getSetting({
				success: res => {
					if (res.authSetting['scope.camera']) {
						// 用户已经授权
						takePictures()
					} else {
						// 用户还没有授权，向用户发起授权请求
						uni.authorize({
							scope: 'scope.camera',
							success() {
								// 用户同意授权
								takePictures()
							},
							fail() {
								// 用户不同意授权
								_this.openSetting('camera').then(res => {
									takePictures()
								});
							}
						});
					}
				},
				fail: res => {
					console.log('获取用户授权信息失败');
				}
			})
		} else {
			previewImage(imageurl.value.url);
		}
	}
	const takePictures = () => {
		uni.chooseImage({
		        count: 1, // 只能拍一张
		        sourceType: ['camera'], // 只允许拍照
		        success: (res) => {
		          // 获取拍照后的临时路径
		          this.imagePath = res.tempFilePaths[0];
		          console.log('拍照成功，图片路径：', this.imagePath);
		
		          // 这里可以进一步处理图片，比如上传到服务器
		          this.uploadImage(this.imagePath);
		        },
		        fail: (err) => {
		          console.error('拍照失败：', err);
		          uni.showToast({
		            title: '拍照失败，请重试',
		            icon: 'none'
		          });
		        }
		      });
}

	
// 生成图片
const generateImages = () => {
  // 获取图片实际显示区域的尺寸和位置
  const { width: imageWidth, height: imageHeight, x: imageX, y: imageY } = imageurl.value
  
  uni.canvasToTempFilePath({
    canvasId: "watermark",
    x: imageX, // 裁剪起点x坐标
    y: imageY, // 裁剪起点y坐标
    width: imageWidth, // 裁剪宽度
    height: imageHeight, // 裁剪高度
    destWidth: imageWidth, // 输出图片宽度
    destHeight: imageHeight, // 输出图片高度
    success: (res) => {
      const tempFilePath = res.tempFilePath
      // 预览生成的图片
      uni.previewImage({
        current: tempFilePath,
        urls: [tempFilePath],
        success: () => {
          // 可以在这里添加保存成功的提示
          uni.showToast({
            title: '图片生成成功',
            icon: 'success'
          })
        },
        fail: () => {
          uni.showToast({
            title: '预览失败',
            icon: 'none'
          })
        },
      })
    },
    fail: (err) => {
      console.error("生成图片失败:", err)
      uni.showToast({
        title: "生成图片失败",
        icon: "none",
      })
    },
  })
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
					<canvas canvas-id="watermark" style="position: absolute;top: 0; z-index: 100;"
						:style="{ width: previewMain.width +'px', height: previewMain.height +'px'}"></canvas>
				</view>
				<!-- <view class="watermark-canvas-image">
					<canvas canvas-id="watermarkImage"
						:style="{ width: previewMain.width +'px', height: previewMain.height +'px'}"></canvas>
				</view> -->
			</view>

			<view class="controlPanel">
				<u-form labelWidth="100px" labelPosition="left" labelAlign="left" :model="formData" ref="form1">
					<!-- <u-form-item label="水印类型" prop="text" borderBottom ref="text">
						<u-input v-model="formData.text" placeholder="请输入" border="none" @change="addWatermark"></u-input>
					</u-form-item> -->

					<u-form-item label="经度" prop="longitude" borderBottom ref="text">
						<u-input v-model="formData.longitude" placeholder="请输入" border="none" @change="addWatermark"></u-input>
					</u-form-item>

					<u-form-item label="纬度" prop="latitude" borderBottom ref="text">
						<u-input v-model="formData.latitude" placeholder="请输入" border="none" @change="addWatermark"></u-input>
					</u-form-item>

					<u-form-item label="地址" prop="address" borderBottom ref="text">
						<u-input v-model="formData.address" placeholder="请输入" border="none" @change="addWatermark"></u-input>
					</u-form-item>

					<u-form-item label="备注" prop="notes" borderBottom ref="text">
						<u-input v-model="formData.notes" placeholder="请输入" border="none" @change="addWatermark"></u-input>
					</u-form-item>

					<!-- <u-form-item label="水印文字" prop="text" borderBottom ref="text">
						<u-input v-model="formData.text" placeholder="请输入" border="none" @change="addWatermark"></u-input>
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
			width: 100vw;
			height: 600px;
			border-radius: 6px;
			background: #ffffff;
			
			.watermark-canvas {
				opacity: 1;
				width: 100%;
				height: 100%;
				.watermark-text {
					z-index: 200;
					width: 100%;
					height: 100%;
					position: relative;
					// background-color: aquamarine;
					margin: 20px;
					.sign {
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
						color: rgb(0 0 0 / 17%);
						// border: 1px solid aliceblue;
						font-size: 30px;
						font-weight: 600;
						pointer-events: none; /* 确保水印不影响交互 */
						opacity: 0.2;
						 -webkit-text-stroke: 1px white; /* 给文字添加边框 */
						text-stroke: 1px white; /* 标准属性，但不广泛支持 */
					}
					.text {
						position: absolute;
						bottom: 0%;
						left: 0%;
						color: #ffffff;
					}
				}
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
