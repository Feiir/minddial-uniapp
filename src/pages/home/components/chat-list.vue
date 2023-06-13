<template>
  <view class="chat-list" id="chat-list">
    <scroll-view
      scroll-y
      :style="{ height: height + 'px' }"
      :scroll-into-view="lastBottomId"
      :scroll-anchoring="true"
      class="scroll-view"
    >
      <view class="list" id="list">
        <template>
          <view :id="item.id" v-for="(item, index) in chatList" :key="item.id">
            <chat-item
              v-if="item.role === globalConfig.robotRole || item.role === globalConfig.userRole"
              :item="item"
              :index="index"
            ></chat-item>
          </view>
        </template>
      </view>
      <view id="last-msg-item"></view>
    </scroll-view>
  </view>
</template>

<script>
import { mapState } from 'vuex'
import chatItem from './chat-item'
export default {
  components: {
    chatItem,
  },
  data() {
    return {
      height: 0,
      globalConfig: this.globalConfig,
      lastBottomId: '',
      list: [],
    }
  },
  computed: {
    ...mapState({
      chatList: (state) => state.chat.chatList,
    }),
  },
  watch: {
    chatList: {
      handler() {
        const chat = this.chatList[this.chatList.length - 1]
        if (chat) {
          uni.$u.throttle(() => {
            this.$nextTick(() => {
              this.lastBottomId = 'last-msg-item'
              this.$nextTick(() => {
                this.lastBottomId = ''
              })
            })
          }, 500)
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.$nextTick(async () => {
      this.height = await this.getDomHeight('#chat-list')
    })
  },
  methods: {
    getDomHeight(str) {
      const query = uni.createSelectorQuery().in(this)
      return new Promise((resolve) => {
        query
          .select(str)
          .boundingClientRect((data) => {
            resolve(data.height)
          })
          .exec()
      })
    },
  },
  scrollBottom() {
    this.$nextTick(() => {
      this.lastBottomId = 'last-msg-item'
      this.$nextTick(() => {
        this.lastBottomId = ''
      })
    })
  },
}
</script>

<style scoped lang="scss">
.chat-list {
  width: 100%;
  height: 100%;
  .list {
    display: flex;
    flex-direction: column;
    padding: 24rpx;
  }
}
</style>
