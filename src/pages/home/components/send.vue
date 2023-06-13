<template>
  <view class="send" :style="{ paddingBottom: bottom + 'px' }">
    <u--input
      @confirm="onSendMessage"
      @input="onInput"
      v-model="text"
      placeholder="对话从此刻开始"
      maxlength="-1"
      confirmType="发送"
      autoHeight
    ></u--input>
    <view class="btn" @click="onSendMessage">
      <image v-if="!sendLoadng" class="btn-icon" src="@/static/images/send.png" mode="widthFix" />
      <u-loading-icon v-else mode="circle"></u-loading-icon>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      text: '',
      id: '',
      bottom: 0,
    }
  },
  computed: {
    sendLoadng() {
      return this.$store.state.chat.sendLoading
    },
  },
  created() {
    this.bottom = uni.$u.sys().safeAreaInsets.bottom + 8
  },
  methods: {
    async onSendMessage() {
      if (this.sendLoadng) return
      if (uni.$u.trim(this.text) === '') {
        return uni.showToast({
          title: '请输入',
          icon: 'none',
        })
      }
      const message = {
        id: this.id || uni.$u.guid(),
        role: 'user',
        content: this.text,
        status: 'done',
        time: new Date().getTime(),
      }
      this.text = ''
      this.id = ''
      this.$store.commit('setSendLoading', true)
      await this.$store.dispatch('sendMessage', message)
    },
    onInput(value) {
      if (this.id === '') this.id = uni.$u.guid()
      if (value !== '') {
        const message = {
          id: this.id,
          role: 'user',
          content: value,
          status: 'sending',
          time: new Date().getTime(),
        }
        this.$store.commit('sendMessage', message)
      } else {
        this.$store.commit('deleteMessage', this.id)
        this.id = ''
      }
    },
  },
}
</script>
<style scoped lang="scss">
.send {
  padding: 16rpx 16rpx 0 16rpx;
  min-height: 100rpx;
  box-sizing: border-box;
  box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
  background: #fff;
  display: flex;
  align-items: center;
  .btn {
    width: 140rpx;
    height: 70rpx;
    background: $main-color;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 16rpx;
    flex-shrink: 0;
    border-radius: 70rpx;
  }
  .btn-icon {
    width: 50rpx;
  }
}
</style>
