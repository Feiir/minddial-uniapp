<template>
  <view>
    <view class="navbar" id="navbar">
      <view class="navbar-left">
        <view class="title u-line-1">{{ activeChat.title }}</view>
        <view class="subtitle">与 MindDial 的 {{ chatList.length - 1 }} 条对话</view>
      </view>
      <view class="navbar-right">
        <view class="icon-box" @click="onShowHistory">
          <image class="icon" src="@/static/svg/return.svg" mode="scaleToFill" />
        </view>
        <view class="icon-box" @click="showModal = true">
          <image class="icon" src="@/static/svg/rename.svg" mode="scaleToFill" />
        </view>
        <!-- #ifdef H5 -->
        <view class="icon-box" @click="showLogoutModel = true">
          <image class="icon" src="@/static/images/logout.png" mode="scaleToFill" />
        </view>
        <!-- #endif -->
      </view>
    </view>
    <view class="placeholder"></view>
    <u-modal
      :show="showModal"
      @cancel="showModal = false"
      @confirm="onConfirm"
      title="重命名对话"
      showCancelButton
    >
      <view class="slot-content">
        <u--textarea v-model="title" placeholder="请输入对话名称" autoHeight></u--textarea>
      </view>
    </u-modal>
    <u-modal
      :show="showLogoutModel"
      @cancel="showLogoutModel = false"
      @confirm="onLogoutConfirm"
      title="退出登录"
      showCancelButton
    >
      <view class="slot-content" style="text-align: center">
        <text>一定要跟老迈Say Goodbye吗？</text>
      </view>
    </u-modal>
  </view>
</template>

<script>
export default {
  data() {
    return {
      showModal: false,
      showLogoutModel: false,
      title: '',
    }
  },
  computed: {
    chatList() {
      return this.$store.state.chat.chatList.filter((item) => item.role !== 'system')
    },
    activeChat() {
      return this.$store.getters.activeChat
    },
  },
  watch: {
    activeChat: {
      handler(val) {
        if (val) {
          this.title = val.title
        }
      },
      immediate: true,
    },
  },
  methods: {
    onShowHistory() {
      this.$store.commit('setShowHistory', true)
    },
    onConfirm() {
      this.$store.commit('updateHistoryItem', {
        ...this.activeChat,
        title: this.title,
      })
      this.showModal = false
    },
    onLogoutConfirm() {
      this.showLogoutModel = false
      this.$store.commit('logout')
      uni.reLaunch({
        url: '/pages/login/login',
      })
    },
  },
}
</script>

<style scoped lang="scss">
.placeholder {
  width: 750rpx;
  height: calc(128rpx + var(--status-bar-height) + 28rpx);
}
.navbar {
  width: 750rpx;
  height: calc(128rpx + var(--status-bar-height) + 28rpx);
  padding: 28rpx 40rpx;
  padding-top: calc(28rpx + var(--status-bar-height));
  display: flex;
  justify-content: space-between;
  box-shadow: 0 0 10rpx 0 rgba($color: #000000, $alpha: 0.1);
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  background: #fff;
  .navbar-left {
    width: 50%;
    .title {
      font-size: 40rpx;
      font-weight: 700;
    }
    .subtitle {
      font-size: 28rpx;
      margin-top: 10rpx;
      color: rgb(48, 48, 48);
    }
  }

  .navbar-right {
    width: 50%;
    flex-shrink: 0;
    margin-left: 20rpx;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 20rpx;
    .icon-box {
      width: 100rpx;
      height: 100rpx;
      /* #ifdef MP-WEIXIN */
      width: 80rpx;
      height: 80rpx;
      /* #endif */
      box-shadow: 0 0 0 2rpx #dedede;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 20rpx;
      .icon {
        width: 32rpx;
        height: 32rpx;
        filter: invert(0.5);
      }
    }
  }
}
.slot-content {
  width: 100%;
}
</style>
