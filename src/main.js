import Vue from 'vue'
import App from './App'
import store from './store'
import uView from 'uview-ui'
import globalConfig from './common/config'
import mixin from '@/mixin'

Vue.config.productionTip = false
App.mpType = 'app'

Vue.use(uView)
Vue.prototype.globalConfig = globalConfig
Vue.mixin(mixin)

const app = new Vue({
  ...App,
  store,
})
app.$mount()
