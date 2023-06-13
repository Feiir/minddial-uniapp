import http from './request'
import store from '@/store'
import { BASE_URL } from './request/config'

//模拟登录
export const handleLogin = (id) => http.get('/api/wx/manual/' + id)
// 发送消息
let sendMessage = (data, onSuccess, onError) => {
  return wx.request({
    url: BASE_URL + 'message',
    data: data,
    method: 'POST',
    header: {
      Authorization: store.state.auth.token,
    },
    timeout: 30000,
    responseType: 'arraybuffer',
    enableChunked: true,
    success: (res) => onSuccess && onSuccess(res),
    fail: (err) => onError && onError(err),
  })
}

// #ifdef H5
sendMessage = (data) => {
  return fetch(BASE_URL + 'message', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      Authorization: store.state.auth.token,
      'Content-Type': 'application/json',
    },
  })
}
// #endif

export const uploadFile = (path) => {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: BASE_URL + 'image',
      filePath: path,
      name: 'image',
      header: {
        Authorization: store.state.auth.token,
      },
      success(res) {
        const data = JSON.parse(res.data)
        if (data.code === 0) {
          resolve(data.data)
        } else {
          reject(data.msg)
        }
      },
      fail: (err) => reject(err),
    })
  })
}

// 微信登录
export const wxLogin = (data) => http.post('wechat/login', data)
// 公共配置
export const getCommonSetting = () => http.get('common/setting')

// 发送验证码
export const sendSms = (data) => http.post('verify-code', data)
// 注册
export const register = (data) => http.post('register', data)
// 登录
export const login = (data) => http.post('login', data)
// 忘记密码
export const forgetPassword = (data) => http.post('forget-password', data)
// 获取用户信息
export const getUserInfo = () => http.get('info')
// 修改用户信息
export const updateUserInfo = (data) => http.post('info', data)
// 获取角色模型列表
export const getRoleList = () => http.get('model/list')
// 总结上下文
export const summaryContext = (message) => http.post('helper', { message, type: '2' })
// 总结标题
export const summaryTitle = (message) => http.post('helper', { message, type: '1' })
// 兑换卡密
export const exchangeCard = (data) => http.post('cd-key/redeem', data)
// 获取邀请列表
export const getInviteList = () => http.get('invited-users')

export { sendMessage }
