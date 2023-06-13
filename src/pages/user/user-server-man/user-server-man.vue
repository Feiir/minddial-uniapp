<template>
  <view class="container">
    <u-navbar :autoBack="true" title="联系客服" bgColor="transparent" placeholder></u-navbar>
    <view class="content">
      <image
        class="pic"
        show-menu-by-longpress
        :src="setting.customer_service_qrcode"
        mode="widthFix"
      />
      <view class="wx-id">
        <text>微信号：{{ setting.customer_service_wxid }}</text>
        <view @click="onCopy" class="copy">复制</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {}
  },
  computed: {
    setting() {
      return this.$store.state.config.setting
    },
  },
  methods: {
    onCopy() {
      uni.setClipboardData({
        data: this.setting.customer_service_wxid,
        success: () => {
          uni.showToast({
            title: '复制成功',
            icon: 'none',
          })
        },
      })
    },
  },
}
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  min-height: 100vh;
  background: $sub-color;
}
.content {
  background: #fff;
  box-shadow: 0px 4rpx 8rpx 0px rgb(0, 0, 0, 0.05);
  border-radius: 20rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 32rpx;
  padding: 32rpx;
  box-sizing: border-box;
  .pic {
    width: 100%;
  }
  .wx-id {
    margin-top: 32rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 32rpx;
    .copy {
      color: $main-color;
      font-size: 24rpx;
      margin-left: 24rpx;
    }
  }
}
</style>
