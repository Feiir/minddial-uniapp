<template>
  <view class="container">
    <u-navbar :autoBack="true" bgColor="transparent"></u-navbar>
    <view class="bg-box">
      <view class="bg-content">
        <view class="bg">
          <image class="bg-logo" src="@/static/svg/logo.svg" mode="widthFix" />
        </view>
        <view class="user" :style="{ top: top + 'px' }">
          <view
            @click="toPath('/pages/user/user-info/user-info')"
            class="user-avatar"
            :class="{ 'vip-avatar': isVip }"
          >
            <image class="avatar" :src="avatar" mode="scaleToFill" />
          </view>
          <view class="user-name">
            <view class="name">{{ userInfo.nickname }}</view>
            <view class="id">ID: {{ userInfo.id }}</view>
          </view>
        </view>
        <view class="vip-box">
          <view>
            <view class="vip-title">MindDial VIP</view>
            <view class="vip-desc">
              {{ isVip ? '到期时间：' + vipExpireTime : '开通会员可享无限次数对话及更多模型' }}
            </view>
          </view>
          <view @click="toPath('/pages/user/user-open-vip/user-open-vip')" class="vip-btn"></view>
        </view>
      </view>
    </view>
    <view class="content">
      <view class="statistics">
        <view class="item">
          <view class="item-count">{{ userInfo.frequency }}</view>
          <view class="item-text">可用对话次数</view>
        </view>
        <view class="item">
          <view class="item-count">{{ userInfo.totalUsedToken }}</view>
          <view class="item-text">累计消耗token</view>
        </view>
        <view class="item">
          <view class="item-count">{{ userInfo.frequency_income || 0 }}</view>
          <view class="item-text">分享总收益</view>
        </view>
      </view>
      <view class="cell-list">
        <u-cell-group :border="false" :customStyle="{ padding: '12rpx 32rpx' }">
          <u-cell
            icon="share-square"
            isLink
            :border="false"
            :iconStyle="{ color: theme.mainColor, marginRight: '10rpx' }"
            size="large"
          >
            <view slot="title">
              <button open-type="share" class="share-btn">
                <text>一键分享</text>
                <text class="share-value">
                  邀请好友可获得{{ setting.inviter_reward_frequency }}次对话次数
                </text>
              </button>
            </view>
          </u-cell>
          <u-cell
            v-for="item in list"
            :key="item.title"
            size="large"
            :icon="item.icon"
            :title="item.title"
            :value="item.value"
            :border="false"
            :isLink="item.isLink"
            :url="item.path"
            :iconStyle="{ color: theme.mainColor, marginRight: '10rpx' }"
          ></u-cell>
        </u-cell-group>
      </view>
    </view>
    <view class="placeholder" :style="{ paddingBottom: bottom + 10 + 'px' }">
      <view class="placeholder-content">
        <image class="placeholder-icon" src="@/static/svg/logo.svg" mode="scaleToFill" />
        <text>MindDial</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      list: [
        // { title: '切换模型', icon: 'tags', value: 'GPT4.0', isLink: true },
        {
          title: '我的邀请',
          icon: 'man-add',
          path: '/pages/user/user-invite/user-invite',
          isLink: true,
        },
        {
          title: '联系客服',
          icon: 'server-man',
          path: '/pages/user/user-server-man/user-server-man',
          isLink: true,
        },
        // { title: '免费获取次数', icon: 'gift', isLink: true },
      ],
      top: 0,
      bottom: 0,
    }
  },
  onLoad() {
    this.top = uni.$u.sys().statusBarHeight + 44
    this.bottom = uni.$u.sys().safeAreaInsets.bottom
    this.$store.dispatch('getUserInfo')
  },
  computed: {
    userInfo() {
      return this.$store.state.auth.userInfo
    },
    isVip() {
      return this.$store.getters.isVip
    },
    vipExpireTime() {
      return uni.$u.timeFormat(this.userInfo.vipExpireTime, 'yyyy-mm-dd')
    },
    avatar() {
      return this.$store.getters.avatar
    },
    theme() {
      return this.$store.state.config.theme
    },
    setting() {
      return this.$store.state.config.setting
    },
  },
  methods: {
    toPath(path) {
      uni.navigateTo({ url: path })
    },
  },
}
</script>
<style lang="scss">
.u-cell__body {
  padding: 32rpx 0 !important;
}
</style>
<style scoped lang="scss">
.container {
  position: relative;
  min-height: 100vh;
  background: #f2f4f5;
  display: flex;
  flex-direction: column;
  .bg-box {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 500rpx;
    .bg-content {
      position: relative;
      width: 100%;
      height: 100%;
      background: $sub-color;
      .bg-logo {
        width: 100%;
        position: absolute;
        top: -150rpx;
        left: 0rpx;
        opacity: 0.2;
        filter: blur(10rpx);
      }
    }
  }
  .user {
    height: 124rpx;
    position: absolute;
    top: calc(var(--status-bar-height));
    left: 40rpx;
    z-index: 10;
    display: flex;
    .user-avatar {
      width: 124rpx;
      height: 124rpx;
      border-radius: 50%;
      background: #fff;
      box-sizing: border-box;
      border: 4rpx solid #fff;
      box-shadow: 0 0 10rpx 2rpx rgba($color: #fff, $alpha: 0.2);
      margin-right: 24rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      .avatar {
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
      }
    }
    .user-name {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .name {
        color: #222;
        font-size: 36rpx;
      }
      .id {
        color: #666;
        font-size: 26rpx;
        margin-top: 10rpx;
      }
    }
  }
  .vip-box {
    position: absolute;
    left: 25rpx;
    bottom: 0rpx;
    width: 700rpx;
    height: 130rpx;
    background: url('@/static/images/user/my_bg_vip.png');
    background-size: cover;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30rpx;
    .vip-title {
      font-size: 42rpx;
      color: #fff;
      font-family: 'Yeseva';
      background-image: linear-gradient(to bottom, #f0e1b7, #e0c38a);
      -webkit-background-clip: text;
      color: transparent;
      font-weight: 700;
    }
    .vip-desc {
      font-size: 24rpx;
      color: #999999;
      margin-top: 10rpx;
    }
    .vip-btn {
      width: 162rpx;
      height: 60rpx;
      background: url('@/static/images/user/button_vip_01.png');
      background-size: cover;
    }
  }
  .content {
    position: relative;
    z-index: 20;
    margin-top: 530rpx;
    padding: 0 26rpx;
    .statistics {
      width: 100%;
      padding: 24rpx 0;
      border-radius: 24rpx;
      background: #fff;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        .item-count {
          font-size: 36rpx;
          font-weight: 700;
          color: #333;
        }
        .item-text {
          margin-top: 10rpx;
          font-size: 28rpx;
          color: #666;
        }
      }
    }
    .cell-list {
      border-radius: 24rpx;
      overflow: hidden;
      margin-top: 40rpx;
      background: #fff;
    }
  }
  .placeholder {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    flex: 1;
  }
  .placeholder-content {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 38rpx;
    color: #b2b2b2;
    opacity: 0.5;
    .placeholder-icon {
      width: 60rpx;
      height: 60rpx;
      margin-right: 10rpx;
      filter: invert(0.5);
    }
  }
}
.share-btn {
  background: transparent;
  text-align: left;
  border: none;
  padding: 0;
  height: 44rpx;
  line-height: 44rpx;
  font-size: 32rpx;
  color: #303133;
  display: flex;
  justify-content: space-between;
  &::after {
    display: none;
  }
  .share-value {
    font-size: 24rpx;
    color: #999;
  }
}
</style>
