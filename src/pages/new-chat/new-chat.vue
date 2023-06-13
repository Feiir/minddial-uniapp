<template>
  <view class="container">
    <u-navbar :autoBack="true" placeholder></u-navbar>
    <view class="emoji-box">
      <view class="emoji-item">
        <image class="emoji-icon" src="@/static/images/emoji/1f606.png" mode="aspectFit"></image>
      </view>
      <view class="emoji-item">
        <image class="emoji-icon" src="@/static/images/emoji/1f916.png" mode="aspectFit"></image>
      </view>
      <view class="emoji-item">
        <image class="emoji-icon" src="@/static/images/emoji/1f479.png" mode="aspectFit"></image>
      </view>
    </view>
    <view class="title">挑选一个面具</view>
    <view class="subtitle">现在开始，与面具背后的灵魂思维碰撞</view>
    <view class="btn" @click="onStart(roleList[0])">
      <image class="btn-icon" src="@/static/svg/lightning.svg" mode="scaleToFill" />
      <text class="btn-text">直接开始</text>
    </view>
    <view class="list">
      <view
        class="item"
        :class="{ 'vip-item': item.is_vip == 1 }"
        v-for="item in roleList"
        :key="item.id"
        @click="onStart(item)"
      >
        <view class="item-icon-box">
          <image class="item-icon" :src="item.img" mode="scaleToFill" />
        </view>
        <text class="item-text">{{ item.name }}</text>
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
    roleList() {
      return this.$store.state.config.roleList
    },
    isVip() {
      return this.$store.getters.isVip
    },
  },
  methods: {
    onStart(item) {
      if (this.isVip == 0 && item.is_vip == 1) {
        uni.showModal({
          content: '该面具需开通会员后才能使用，是否前往开通会员？',
          success: function (res) {
            if (res.confirm) {
              uni.$u.route('/pages/user/user-open-vip/user-open-vip')
            }
          },
        })
        return
      }
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
      uni.navigateBack()
    },
  },
}
</script>

<style scoped lang="scss">
.container {
  .emoji-box {
    display: flex;
    justify-content: center;
    margin-top: 5vh;
    margin-bottom: 40rpx;

    .emoji-item {
      width: 92rpx;
      height: 140rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 28rpx;
      border: 2rpx solid rgb(222, 222, 222);
      box-shadow: 0px 4rpx 8rpx 0px rgb(0, 0, 0, 0.05);
      background: #fff;

      .emoji-icon {
        width: 48rpx;
        height: 48rpx;
      }

      &:first-child {
        transform: rotate(-15deg) translateY(10rpx);
      }

      &:nth-child(2) {
        position: relative;
        z-index: 2;
      }

      &:last-child {
        transform: rotate(15deg) translateY(10rpx);
        position: relative;
        z-index: 3;
      }
    }
  }

  .title {
    font-size: 64rpx;
    margin-bottom: 1vh;
    font-weight: 700;
    text-align: center;
  }

  .subtitle {
    text-align: center;
  }

  .btn {
    margin: 40rpx auto;
    width: 200rpx;
    height: 100rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    background: $main-color;
    border-radius: 20rpx;
    box-shadow: 0px 4rpx 8rpx 0px rgb(0, 0, 0, 0.05);

    .btn-icon {
      width: 32rpx;
      height: 32rpx;
      filter: brightness(100);
    }

    .btn-text {
      font-size: 28rpx;
      margin-left: 10rpx;
      color: #fff;
    }
  }

  .list {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 20rpx;
    padding: 0 40rpx 40rpx 40rpx;
  }

  .item {
    padding: 20rpx 28rpx;
    border: 2rpx solid rgb(222, 222, 222);
    box-shadow: 0px 4rpx 8rpx 0px rgb(0, 0, 0, 0.05);
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    border-radius: 20rpx;

    .item-icon-box {
      width: 60rpx;
      height: 60rpx;
      border: 2rpx solid rgb(222, 222, 222);
      box-shadow: 0px 4rpx 8rpx 0px rgb(0, 0, 0, 0.05);
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 16rpx;
      margin-right: 20rpx;

      .item-icon {
        width: 40rpx;
        height: 40rpx;
      }
    }
  }
  .vip-item {
    border: 2rpx solid rgba(255, 193, 7, 0.5);
    box-shadow: 0px 4rpx 8rpx 0px rgba(255, 193, 7, 0.3);
    position: relative;
    &::after {
      content: 'V';
      position: absolute;
      bottom: -10rpx;
      right: -10rpx;
      width: 40rpx;
      height: 40rpx;
      background-color: #ffdc83;
      color: #fff;
      font-size: 28rpx;
      text-align: center;
      line-height: 20px;
      border-radius: 50%;
      font-family: 'Yeseva';
      font-weight: 700;
      box-sizing: border-box;
      padding-left: 2rpx;
    }
  }
}
</style>
