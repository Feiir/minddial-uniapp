<template>
  <view class="container">
    <u-navbar :autoBack="true" title="我的邀请" bgColor="#fff" placeholder></u-navbar>
    <view class="content" v-if="!list">
      <u-empty text="暂无邀请用户" icon="http://cdn.uviewui.com/uview/empty/list.png"></u-empty>
    </view>
    <view class="list" v-else>
      <view v-for="(item, index) in list" :key="index">
        <u-cell :title="item.nickname">
          <text slot="label" class="label">{{ item.created_at | date }}</text>
          <text slot="value" class="value">+{{ item.frequency }}</text>
        </u-cell>
      </view>
    </view>
  </view>
</template>

<script>
import { getInviteList } from '@/network/api'
export default {
  data() {
    return {
      list: null,
      height: 0,
    }
  },
  async onLoad() {
    this.getList()
    const sys = uni.$u.sys()
    this.height = sys.windowHeight - sys.statusBarHeight - 44
  },
  methods: {
    async getList() {
      const res = await getInviteList()
      this.list = res
    },
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
}
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
  padding-bottom: calc(32rpx + constant(safe-area-inset-bottom));
  .content {
    flex: 1;
    background: #fff;
    box-shadow: 0px 4rpx 8rpx 0px rgb(0, 0, 0, 0.05);
    border-radius: 20rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin: 32rpx 32rpx 0 32rpx;
    padding: 32rpx;
    box-sizing: border-box;
  }
  .list {
    padding: 0 24rpx;
    .label {
      font-size: 24rpx;
      color: #999;
    }
    .value {
      font-size: 36rpx;
      color: $main-color;
    }
  }
}
</style>
