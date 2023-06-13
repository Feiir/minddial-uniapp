<template>
  <view>
    <view class="container">
      <navbar></navbar>
      <view id="list-container">
        <chat-list></chat-list>
      </view>
      <send></send>
    </view>
    <u-popup :show="showHistory" mode="left">
      <view>
        <history></history>
      </view>
    </u-popup>
  </view>
</template>

<script>
import navbar from './components/custom-navbar.vue'
import send from './components/send'
import chatList from './components/chat-list.vue'
import history from './components/history.vue'
import { mapState } from 'vuex'
export default {
  components: {
    navbar,
    send,
    chatList,
    history,
  },
  data() {
    return {}
  },
  computed: {
    ...mapState({
      theme: (state) => state.config.theme,
      showHistory: (state) => state.chat.showHistory,
    }),
  },
  methods: {},
}
</script>

<style scoped lang="scss">
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  #list-container {
    flex: 1;
  }
}
</style>
