<script>
import store from '@/store'
export default {
  data() {
    return {
      id: '',
    }
  },
  onLaunch: function (options) {
    this.id = options.query.id || ''
    this.initApp()
  },
  methods: {
    initApp() {
      store.dispatch('getSetting')
      store.dispatch('setRoleList')
      if (uni.getStorageSync('token') && uni.getStorageSync('userInfo')) {
        store.commit('setToken', uni.getStorageSync('token'))
        store.commit('setUserInfo', uni.getStorageSync('userInfo'))
        store.dispatch('getUserInfo')
        store.commit('initHistoryList')
      }
      // #ifdef H5
      this.initRoute()
      // #endif
      // #ifdef MP-WEIXIN
      this.initWx()
      // #endif
    },
    initRoute() {
      if (!store.state.auth.token) {
        return uni.redirectTo({ url: '/pages/auth/login/login' })
      }
      uni.redirectTo({ url: '/pages/home/home' })
    },
    initWx() {
      if (!store.state.auth.token || this.id) {
        uni.login({
          provider: 'weixin',
          success: async (loginRes) => {
            await store.dispatch('wxLogin', {
              JsCode: loginRes.code.toString(),
              InvitationUID: +this.id || 0,
            })
          },
        })
      }
    },
  },
  onHide: function () {},
}
</script>

<style lang="scss">
@import 'uview-ui/index.scss';
</style>
