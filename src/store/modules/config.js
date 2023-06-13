import theme from '@/static/styles/theme.scss'
import { getRoleList, getCommonSetting } from '@/network/api'
const config = {
  state: {
    theme: theme,
    roleList: [],
    setting: {},
  },
  mutations: {
    setRoleList(state, data) {
      state.roleList = data
    },
    setSetting(state, data) {
      state.setting = data
    },
  },
  actions: {
    async setRoleList({ commit }) {
      const cache = uni.getStorageSync('roleList')
      if (cache) {
        commit('setRoleList', cache)
      }
      const res = await getRoleList()
      if (JSON.stringify(res) !== JSON.stringify(cache)) {
        uni.setStorageSync('roleList', res)
        commit('setRoleList', res)
      }
    },
    async getSetting({ commit }) {
      const cache = uni.getStorageSync('setting')
      if (cache) {
        commit('setSetting', cache)
      }
      const res = await getCommonSetting()
      if (JSON.stringify(res) !== JSON.stringify(cache)) {
        uni.setStorageSync('setting', res)
        commit('setSetting', res)
      }
    },
  },
}

export default config
