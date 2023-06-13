export default {
  onShareAppMessage() {
    //发送给朋友
    const share = this.$store.state.config.setting
    return {
      imageUrl: share.share_img,
      path: '/pages/home/home?id=' + this.$store.state.auth.userInfo.id || '',
      title: share.share_title,
    }
  },
  onShareTimeline() {
    //分享到朋友圈
    const share = this.$store.state.config.setting
    return {
      imageUrl: share.share_img,
      path: '/pages/home/home?id=' + this.$store.state.auth.userInfo.id || '',
      title: share.share_title,
    }
  },
}
