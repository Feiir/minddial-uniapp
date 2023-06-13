import Vue from 'vue'
import Vuex from 'vuex'
import config from './modules/config'
import auth from './modules/auth'
import chat from './modules/chat'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    config,
    auth,
    chat,
  },
})

export default store
