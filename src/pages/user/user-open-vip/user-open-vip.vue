<template>
  <view class="container">
    <u-navbar :autoBack="true" title="开通会员" bgColor="transparent" placeholder></u-navbar>
    <view class="content">
      <u--input
        :customStyle="{ width: '590rpx' }"
        placeholder="请输入卡密兑换会员"
        border="surround"
        v-model="value"
      ></u--input>
      <u-button
        :customStyle="{
          background: theme.mainColor,
          color: '#fff',
          marginTop: '36rpx',
          border: 'none',
          fontSize: '36rpx',
        }"
        shape="circle"
        :loading="btnLoading"
        loadingMode="circle"
        type="primary"
        text="确认兑换"
        @click="onSubmit"
      ></u-button>

      <image
        class="pic"
        show-menu-by-longpress
        :src="setting.customer_service_qrcode"
        mode="widthFix"
      />
    </view>
  </view>
</template>

<script>
import { exchangeCard } from '@/network/api'
export default {
  data() {
    return {
      value: '',
      btnLoading: false,
    }
  },
  computed: {
    theme() {
      return this.$store.state.config.theme
    },
    setting() {
      return this.$store.state.config.setting
    },
  },
  methods: {
    async onSubmit() {
      if (!this.value) {
        uni.showToast({
          title: '请输入卡密',
          icon: 'none',
        })
        return
      }
      this.btnLoading = true
      try {
        const res = await exchangeCard({ CDKey: this.value })
        await this.$store.dispatch('getUserInfo')
        uni.showModal({
          title: "兑换成功",
          content:res,
          showCancel:false
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 3000)
      } finally {
        this.btnLoading = false
      }
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
  padding: 24rpx;
  box-sizing: border-box;
}
</style>
