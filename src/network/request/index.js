import { BASE_URL, whiteList } from './config'
import Request from 'uview-ui/libs/luch-request'
import store from '@/store'

const http = new Request()
http.config.baseURL = BASE_URL
// 请求拦截
http.interceptors.request.use(
  (config) => {
    if (store.state.auth.token) {
      config.header.Authorization = store.state.auth.token
    }
    // #ifdef H5
    config.header['os'] = 'web'
    // #endif
    // #ifdef MP-WEIXIN
    config.header['os'] = 'wx'
    // #endif
    return config
  },
  (config) => {
    return Promise.reject(config)
  },
)

// 响应拦截
http.interceptors.response.use(
  (response) => {
    const { data, config } = response
    if (whiteList.includes(config.url)) return data
    if (data.code === 0) {
      if (config.header.showMessage) {
        return data
      } else {
        return data.data
      }
    } else {
      uni.showToast({
        title: data.msg,
        icon: 'none',
        duration: 2000,
      })
      return Promise.reject(data)
    }
  },
  (response) => {
    return Promise.reject(response)
  },
)

export default http
