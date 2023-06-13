<template>
  <view>
    <view class="history">
      <view class="header">
        <view class="title">MindDial</view>
        <view class="subtitle">下一代AI.</view>
        <image class="logo" src="@/static/svg/logo.svg" mode="scaleToFill" />
      </view>
      <view class="btns">
        <view class="btn" @click="toUserCenter">
          <image class="btn-icon" src="@/static/images/user.png" mode="scaleToFill" />
          <text class="btn-text">个人中心</text>
        </view>
        <view class="btn" @click="toNewChat">
          <image class="btn-icon" src="@/static/svg/mask.svg" mode="scaleToFill" />
          <text class="btn-text">模型角色</text>
        </view>
        <view class="btn" @click="createChat">
          <image class="btn-icon" src="@/static/svg/add.svg" mode="scaleToFill" />
          <text class="btn-text">新的聊天</text>
        </view>
      </view>
      <view class="list-box" id="list-box">
        <scroll-view scroll-y :style="{ height: height + 'px' }">
          <view class="list">
            <view
              class="item"
              :class="{ 'active-item': activeIndex === index }"
              v-for="(item, index) in historyList"
              :key="index"
              @click="onItemClick(item, index)"
            >
              <view class="item-title-box">
                <view class="item-title">{{ item.title }}</view>
                <view @click.stop="onDeleteItem(item, index)">
                  <u-icon name="close"></u-icon>
                </view>
              </view>
              <view class="item-bottom">
                <text class="item-text">{{ item.length }}条对话</text>
                <text class="item-text">{{ item.time | date('yyyy-mm-dd hh:MM:ss') }}</text>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>

    <u-modal
      :show="showModal"
      :content="content"
      @cancel="showModal = false"
      @confirm="onDeleteConfirm"
      showCancelButton
    ></u-modal>
  </view>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      height: 0,
      showModal: false,
      selectItem: {},
      selectIndex: 0,
    }
  },
  computed: {
    ...mapState({
      activeIndex: (state) => state.chat.activeChatIndex,
      historyList: (state) => state.chat.historyList,
      showHistory: (state) => state.chat.showHistory,
    }),
    content() {
      return `确定要删除聊天记录: ${this.selectItem.title} 吗？`
    },
  },
  watch: {
    showHistory: {
      handler(val) {
        if (val && !this.height) {
          uni
            .createSelectorQuery()
            .in(this)
            .select('#list-box')
            .boundingClientRect((data) => {
              this.height = data.height
            })
            .exec()
        }
      },
      immediate: true,
    },
  },
  methods: {
    createChat() {
      const item = this.$store.state.config.roleList[0]
      const chat = {
        id: uni.$u.guid(),
        title: '新的聊天 - ' + item.name,
        desc: item.desc,
        time: new Date().getTime(),
        generatedTitle: false,
        length: 0,
        modelId: item.id,
        modelName: item.name,
        avatar: item.img,
      }
      this.$store.commit('addHistoryItem', chat)
      this.$store.commit('setShowHistory', false)
    },
    onItemClick(item, index) {
      this.$store.commit('setActiveChatIndex', index)
      this.$store.commit('setShowHistory', false)
    },
    toUserCenter() {
      uni.navigateTo({
        url: '/pages/user/user-center/user-center',
      })
    },
    toNewChat() {
      uni.navigateTo({
        url: '/pages/new-chat/new-chat',
      })
    },
    onDeleteItem(item, index) {
      this.selectItem = item
      this.selectIndex = index
      this.showModal = true
    },
    onDeleteConfirm() {
      this.$store.commit('deleteHistoryItem', this.selectIndex)
      this.showModal = false
    },
  },
}
</script>

<style scoped lang="scss">
.history {
  width: 750rpx;
  height: 100vh;
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background: $sub-color;
  .header {
    padding: 40rpx 0;
    /* #ifdef MP-WEIXIN */
    padding-top: calc(var(--status-bar-height));
    /* #endif */
    position: relative;
    .title {
      font-size: 40rpx;
      font-weight: 700;
      color: #222;
    }
    .subtitle {
      font-size: 24rpx;
      color: #222;
      letter-spacing: 4rpx;
    }
    .logo {
      position: absolute;
      right: 0;
      top: 36rpx;
      /* #ifdef MP-WEIXIN */
      display: none;
      /* #endif */
      width: 100rpx;
      height: 100rpx;
      opacity: 0.5;
    }
  }
  .btns {
    display: flex;
    justify-content: space-between;
    gap: 20rpx;
    & .btn:first-child {
      .btn-icon {
        filter: invert(0.3) !important;
      }
    }
    .btn {
      flex: 1;
      height: 96rpx;
      background: #fff;
      box-shadow: 0px 4rpx 8rpx 0px rgb(0, 0, 0, 0.05);
      border-radius: 20rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 40rpx;
    }
    .btn-icon {
      width: 32rpx;
      height: 32rpx;
      margin-right: 10rpx;
      filter: invert(0.5);
    }
    .btn-text {
      font-size: 24rpx;
      color: #333;
    }
  }
  .list-box {
    flex: 1;
    width: 100%;
  }
  .item {
    padding: 20rpx 28rpx;
    background: #fff;
    box-shadow: 0px 4rpx 8rpx 0px rgb(0, 0, 0, 0.05);
    margin-bottom: 20rpx;
    border-radius: 20rpx;
    .item-title-box {
      display: flex;
      .item-title {
        font-size: 28rpx;
        font-weight: 700;
        flex: 1;
        margin-right: 20rpx;
      }
    }

    .item-bottom {
      display: flex;
      justify-content: space-between;
      margin-top: 16rpx;
      .item-text {
        color: rgb(166, 166, 166);
        font-size: 24rpx;
      }
    }
  }
  .active-item {
    border: 4rpx solid rgba($main-color, 0.9);
  }
}
</style>
