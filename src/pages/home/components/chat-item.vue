<template>
  <view
    class="chat-item"
    :class="{
      assistant: item.role === globalConfig.robotRole,
      user: item.role === globalConfig.userRole,
    }"
  >
    <view
      class="user-avatar"
      :class="{ 'vip-avatar': isVip }"
      v-if="item.role === globalConfig.userRole"
    >
      <image
        @click="toUserCenter"
        v-if="item.role === globalConfig.userRole"
        class="avatar-pic"
        :src="avatar"
        mode="scaleToFill"
      />
    </view>
    <view class="robot-avatar" v-if="item.role === globalConfig.robotRole">
      <image
        class="robot-avatar-pic"
        v-if="activeChat.avatar"
        :src="activeChat.avatar"
        mode="scaleToFill"
      ></image>
      <text v-else class="robot-avatar-text" :style="{ fontSize }">
        {{ name }}
      </text>
    </view>
    <view class="msg-box">
      <view
        class="fn-box"
        v-if="
          (item.status === globalStatus.error || item.status === globalStatus.done) &&
          item.role !== globalConfig.systemRole
        "
      >
        <text
          @click="onReset"
          class="fn-text"
          v-if="item.status !== globalStatus.sensitive && item.role === globalConfig.robotRole"
        >
          重试
        </text>
        <text @click="onCopy" class="fn-text">复制</text>
        <text @click="onDetlete" class="fn-text">删除</text>
      </view>
      <view
        class="loading-text"
        v-if="item.status === globalStatus.loading || item.status === globalStatus.sending"
        :style="{ textAlign: item.role === globalConfig.userRole ? 'right' : 'left' }"
      >
        <text v-if="item.status === globalStatus.loading">{{ globalConfig.hint.loading }}</text>
        <text v-if="item.status === globalStatus.sending">{{ globalConfig.hint.sending }}</text>
      </view>
      <view class="msg">
        <view v-if="item.status !== globalStatus.loading">
          <uni-ai-msg :md="item.content" :showCursor="item.status === 'sending'"></uni-ai-msg>
          <!-- <scroll-view scroll-x :style="{ maxWidth: '520rpx' }">
            <uni-ai-msg :md="item.content" :showCursor="item.status === 'sending'"></uni-ai-msg>
          </scroll-view> -->
        </view>
        <view v-else class="loading-box">
          <u-loading-icon mode="circle" :color="theme.mainColor"></u-loading-icon>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import uniAiMsg from '@/components/uni-ai-msg/uni-ai-msg'
import { mapState } from 'vuex'
export default {
  props: {
    item: {
      type: Object,
      default: () => {},
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  components: {
    uniAiMsg,
  },
  data() {
    return {
      globalConfig: this.globalConfig,
      globalStatus: this.globalConfig.status,
    }
  },
  computed: {
    ...mapState({
      theme: (state) => state.config.theme,
    }),
    activeChat() {
      return this.$store.getters.activeChat
    },
    isVip() {
      return this.$store.getters.isVip
    },
    avatar() {
      return this.$store.getters.avatar
    },
    name() {
      if (!this.activeChat.title) return ''
      if (this.activeChat.title.length > 1) {
        return this.activeChat.title.substring(0, 2)
      } else {
        return this.activeChat.title || ''
      }
    },
    fontSize() {
      return this.name.length > 1 ? '32rpx' : '48rpx'
    },
  },
  methods: {
    async onReset() {
      let message = this.$store.state.chat.chatList[this.index - 1]
      message = JSON.parse(JSON.stringify(message))
      message.id = uni.$u.guid()
      message.time = new Date().getTime()
      this.$store.commit('setSendLoading', true)
      this.$store.dispatch('sendMessage', message)
    },
    onCopy() {
      uni.setClipboardData({
        data: this.item.content,
        success: () => {
          uni.showToast({
            title: '复制成功',
            icon: 'none',
          })
        },
      })
    },
    onDetlete() {
      this.$store.commit('deleteChatListItem', this.index)
    },
    toUserCenter() {
      uni.navigateTo({
        url: '/pages/user/user-center/user-center',
      })
    },
  },
}
</script>

<style scoped lang="scss">
.chat-item {
  font-size: 28rpx;
  line-height: 1.5;
  display: flex;
  margin-bottom: 24rpx;
  margin-top: 24rpx;
  .user-avatar {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    border: 2rpx solid #fff;
    box-sizing: border-box;
    box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.2);
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    .avatar-pic {
      width: 90%;
      height: 90%;
      border-radius: 50%;
    }
  }
  .robot-avatar {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    background: #fff;
    box-sizing: border-box;
    box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.2);
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    .robot-avatar-text {
      color: $main-color;
      font-weight: 700;
      transition: all 0.3s ease-in-out;
    }
    .robot-avatar-pic {
      width: 90%;
      height: 90%;
      border-radius: 50%;
    }
  }
  .msg-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .msg {
    padding: 20rpx;
    display: flex;
    align-items: center;
    word-break: break-all;
    margin-top: 12rpx;
  }
  .loading-text {
    font-size: 24rpx;
    color: #999;
  }
  .loading-box {
    padding-left: 10rpx;
  }
}
.assistant {
  flex-direction: row;
  .msg-box {
    margin-left: 16rpx;
    .fn-container {
      height: 33rpx;
    }
  }
  .msg {
    border-radius: 0 32rpx 32rpx 32rpx;
    background: #fff;
    color: #333;
    box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.1);
  }
}
.user {
  flex-direction: row-reverse;
  .msg-box {
    margin-right: 16rpx;
  }
  .msg {
    border-radius: 32rpx 0 32rpx 32rpx;
    background: $main-color;
    color: #fff;
    box-shadow: 0 0 20rpx rgba($main-color, 0.5);
  }
}
.fn-box {
  display: flex;
  justify-content: flex-end;

  color: #333;
  opacity: 0.5;
  font-size: 24rpx;
  .fn-text {
    margin-left: 20rpx;
  }
}
</style>
