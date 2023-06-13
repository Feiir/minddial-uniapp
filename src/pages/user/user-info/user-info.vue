<template>
  <view class="container">
    <u-navbar
      :autoBack="true"
      title="修改个人资料"
      :bgColor="theme.subColor"
      placeholder
    ></u-navbar>
    <view class="content">
      <button class="user-avatar" open-type="chooseAvatar" @chooseavatar="onSelectAvatar">
        <image class="avatar" :src="avatar" mode="scaleToFill" />
      </button>
      <view class="info-cell">
        <view class="info-label">用户昵称：</view>
        <input type="nickname" @blur="onInput" v-model="form.nickname" placeholder="请输入昵称" />
      </view>
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
        text="确认修改"
        @click="onSubmit"
      ></u-button>
    </view>
  </view>
</template>

<script>
import logo from '@/static/svg/logo.svg'
import { uploadFile, updateUserInfo } from '@/network/api'
export default {
  data() {
    return {
      form: {
        avatar: '',
        nickname: '',
      },
      btnLoading: false,
    }
  },
  onLoad() {
    this.form.nickname = this.userInfo.nickname
  },
  computed: {
    theme() {
      return this.$store.state.config.theme
    },
    userInfo() {
      return this.$store.state.auth.userInfo
    },
    avatar() {
      return this.form.avatar || this.userInfo.avatar || logo
    },
  },
  watch: {
    userInfo: {
      handler() {
        this.form.nickname = this.userInfo.nickname
        this.form.avatar = this.userInfo.avatar
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    async onSelectAvatar(e) {
      this.form.avatar = e.detail.avatarUrl
      uni.showLoading({ title: '上传中', mask: true })
      try {
        const res = await uploadFile(this.form.avatar)
        this.form.avatar = res
        uni.hideLoading()
      } catch (err) {
        uni.showToast({ title: '上传失败', icon: 'none' })
        uni.hideLoading()
      }
    },
    onInput(e) {
      if (e.detail.value !== this.form.nickname) {
        this.form.nickname = e.detail.value
      }
    },
    onSubmit() {
      this.$nextTick(async () => {
        if (!this.form.nickname) {
          uni.showToast({ title: '请输入昵称', icon: 'none' })
          return
        }
        this.btnLoading = true
        try {
          await updateUserInfo(this.form)
          await this.$store.dispatch('getUserInfo')
          uni.showToast({ title: '修改成功' })
          uni.navigateBack()
        } finally {
          this.btnLoading = false
        }
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
  .user-avatar {
    width: 124rpx;
    height: 124rpx;
    border-radius: 50%;
    background: #fff;
    box-sizing: border-box;
    box-shadow: 0 0 10rpx 2rpx rgba($color: #000, $alpha: 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    &::after {
      display: none;
    }
    .avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
    }
  }
  .info-cell {
    width: 100%;
    height: 80rpx;
    display: flex;
    align-items: center;
    box-shadow: 0 1rpx 0 0 rgba($color: #000, $alpha: 0.1);
    .info-label {
      flex-shrink: 0;
      color: #666;
      margin-right: 20rpx;
    }
    input {
      flex: 1;
      text-align: right;
    }
  }
}
</style>
