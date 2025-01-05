<template>
    <view style="position: absolute;overflow: hidden;z-index: 999;">
        <block v-if="!imgPath">
            <image-cropper ref="cropper" :cropScale="cropScale" :src="imgSrc" @crop="handleCrop">
            </image-cropper>
        </block>
        <block v-if="imgPath">
            <view class="crop-cont cont_center">
                <image :src="imgPath" mode="widthFix"></image>
            </view>
            <view class="crop-bottom">
                <view class="crop-a left" @click="getBack">取消</view>
                <view class="crop-btn right" @click="onSubCrop">确定</view>
            </view>
        </block>

    </view>
</template>

<script>
    import common from '@/utils/common';
    import imageCropper from '@/components/custom/image-cropper/index';
    import {
        uploadHsFile,
        getUploadFile
    } from "@/api/main";

    export default {
        components: {
            imageCropper
        },
        data() {
            return {
                cropScale: '1:1', //裁剪比例，默认1:1
                width: 500,
                // imgSrc: 'https://img1.baidu.com/it/u=3893389324,4043822814&fm=253&fmt=auto&app=120&f=JPEG?w=1280&h=800',
                imgSrc: null, //需要裁剪地址
                imgPath: null, //裁剪后图片地址
                isfrom: null, //页面来源
            };
        },
        onLoad(options) {
            if (options) {
                if (options.isfrom) {
                    this.isfrom = options.isfrom;
                }
                if (options.scale) { //裁剪比例
                    this.cropScale = options.scale;
                }
                if (options.src) { //需要裁剪的地址
                    this.imgSrc = options.src;
                }
            }
            if (!common.isEmpty(this.storage.get('fileData'))) {
                this.storage.remove('fileData');
            }
        },
        methods: {
            handleCrop(e) {
                let that = this;
                // console.log(e)
                if (e && e.tempFilePath) {
                    var filePath = null;
                    // #ifdef H5
                    // 返回besa64 {tempFilePath: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwA…qD4BlmXardc/z2wLW/we1LoP21+aEvgAAAABJRU5ErkJggg=='}
                    this.imgPath = e.tempFilePath;
                    // #endif
                    // #ifdef MP-WEIXIN
                    // 返回缓存地址 {tempFilePath: "http://tmp/92DOAKXWBPmrb8fd3ad722b9693120bf7ab6dbda5f18.png"}
                    var filePaths = e.tempFilePath;
                    uni.getFileSystemManager().readFile({
                        filePath: filePaths, //选择图片返回的相对路径
                        encoding: 'base64', //编码格式
                        success: res => { //成功的回调
                            //console.log('data:image/png;base64,'+res.data)
                            that.imgPath = 'data:image/png;base64,' + res.data;
                        }
                    })
                    // #endif
                }
            },
            onSubCrop() { //确定
                this.uploadHsFile(this.imgPath);
            },
            async uploadHsFile(imageData) { //上传base64格式图片
                let that = this;
                let temp = {
                    imageData: imageData
                }
                await uploadHsFile(temp).then((res) => {
                    if (res.retCode == 200) {
                        var list = [];
                        if (res.data) {
                            var obj = {
                                url: common.getViewImageUrl(res.data),
                                fileReturnId: res.data,
                                type: "image"
                            }
                            list.push(obj);
                        }
                        var params = {
                            isfrom: that.isfrom,
                            imgList: list
                        };
                        // console.log(params)
                        that.storage.set('fileData', params);
                        that.getBack();
                    } else {
                        common.toast(res);
                    }
                }).catch((err) => {
                    common.toast('图片发送失败');
                })
            },
            async getUploadFile(file) { //上传file格式图片
                let that = this;
                let temp = {
                    url: file.path
                }
                await getUploadFile(temp).then((res) => {
                    if (res.retCode == 200) {
                        if (res.retData) {
                            // console.log(res.retData)
                            var list = [];
                            if (res.retData.length > 0) {
                                res.retData.forEach((v, index) => {
                                    var obj = {
                                        url: common.getViewImageUrl(v.fileReturnId),
                                        fileReturnId: v.fileReturnId,
                                        type: "image"
                                    }
                                    list.push(obj);
                                })
                            }
                            var params = {
                                isfrom: that.isfrom,
                                imgList: list
                            };
                            // console.log(params)
                            that.storage.set('fileData', params);
                            that.getBack();
                        }
                    } else {
                        common.toast(res);
                    }
                }).catch((err) => {
                    common.toast('图片发送失败');
                })
            },

            getBack() { //取消返回
                common.getUniBack(1)
            },

        }
    };
</script>

<style>
    .crop-cont {
        width: 100%;
        height: 100vh;
        padding: 30rpx 50rpx;
        background: #333;
    }

    .crop-cont>image {
        display: block;
        width: 100%;
    }


    .crop-bottom {
        width: 100%;
        overflow: hidden;
        background: #fff;
        padding: 20rpx;
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 10;
    }

    .crop-a {
        width: 120rpx;
        line-height: 60rpx;
        font-size: 30rpx;
        color: #027BFF;
        text-align: center;
    }

    .crop-btn {
        width: 120rpx;
        line-height: 60rpx;
        font-size: 30rpx;
        color: #fff;
        background: #027BFF;
        text-align: center;
        border-radius: 16rpx;
    }
</style>