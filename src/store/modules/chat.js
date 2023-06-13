import { sendMessage, summaryContext, summaryTitle } from '@/network/api'
import store from '../index'
import * as TextEdncoding from 'text-encoding-shim'
import { Base64 } from 'js-base64'
import globalConfig, { globalHint, globalStatus } from '@/common/config'

const MaxLength = 1000
const MaxMessageLength = 6
const MinSummaryTitleLength = 200
const TimeOut = 10 * 1000
let timer = null
const chat = {
  state: {
    chatList: [],
    historyList: [],
    activeChatIndex: 0,
    showHistory: true,
    sendLoading: false,
  },
  getters: {
    chatList(state) {
      let arr = []
      const index = findLastIndex(state.chatList, (item) => item.role === globalConfig.systemRole)
      if (index > 0) {
        arr = state.chatList.slice(index)
      } else {
        arr = state.chatList
      }
      arr = arr.filter((item) => item.status === globalStatus.done)
      return arr.map((item) => {
        return {
          role: item.role,
          content: item.content,
        }
      })
    },
    activeChat(state) {
      return state.historyList[state.activeChatIndex] || {}
    },
  },
  mutations: {
    beforeSeedMessage(state, message) {
      state.chatList.splice(state.chatList.length - 2, 0, message)
    },
    sendMessage(state, data) {
      const index = state.chatList.findIndex((item) => item.id === data.id)
      if (index > 0) {
        state.chatList.splice(index, 1, data)
      } else {
        state.chatList.push(data)
      }
    },
    setShowHistory(state, flag) {
      state.showHistory = flag
    },
    initHistoryList(state) {
      state.historyList = uni.getStorageSync(store.state.auth.userInfo.id.toString()) || []
      state.activeChatIndex = uni.getStorageSync('activeChatIndex') || 0
      if (state.historyList.length === 0) {
        state.showHistory = true
      } else {
        state.showHistory = false
        const chat = state.historyList[state.activeChatIndex]
        state.chatList = uni.getStorageSync(chat.id.toString()) || []
        const lastChat = state.chatList[state.chatList.length - 1]
        if (lastChat.status === globalStatus.loading) {
          lastChat.status = globalStatus.error
          lastChat.content = globalHint.error
        }
        if (lastChat.status === globalStatus.sending) {
          lastChat.status = globalStatus.done
        }
      }
    },
    addHistoryItem(state, data) {
      state.historyList.push(data)
      state.chatList = [
        {
          id: uni.$u.guid(),
          status: globalConfig.hint,
          role: globalConfig.robotRole,
          content: data.desc,
          time: new Date().getTime(),
        },
      ]
      state.activeChatIndex = state.historyList.length - 1
      uni.setStorageSync(store.state.auth.userInfo.id.toString(), state.historyList)
      uni.setStorageSync(data.id.toString(), state.chatList)
      uni.setStorageSync('activeChatIndex', state.activeChatIndex)
    },
    updateHistoryItem(state, data) {
      const chat = data || state.historyList[state.activeChatIndex]
      const arr = state.chatList.filter((item) => item.role !== globalConfig.systemRole)
      chat.length = arr.length - 1
      state.historyList.splice(state.activeChatIndex, 1, chat)
      uni.setStorageSync(store.state.auth.userInfo.id.toString(), state.historyList)
      uni.setStorageSync(chat.id.toString(), state.chatList)
    },
    updateHistoryTitle(state, data) {
      state.historyList[state.activeChatIndex].title =
        data + ' - ' + state.historyList[state.activeChatIndex].modelName
      state.historyList[state.activeChatIndex].generatedTitle = true
    },
    deleteHistoryItem(state, index) {
      if (state.activeChatIndex === index) {
        state.activeChatIndex = 0
        uni.setStorageSync('activeChatIndex', state.activeChatIndex)
      }
      state.historyList.splice(index, 1)
      uni.setStorageSync(store.state.auth.userInfo.id.toString(), state.historyList)
    },
    setActiveChatIndex(state, index) {
      state.activeChatIndex = index
      const chat = state.historyList[state.activeChatIndex]
      state.chatList = uni.getStorageSync(chat.id.toString()) || []
      uni.setStorageSync('activeChatIndex', state.activeChatIndex)
    },
    deleteChatListItem(state, index) {
      state.chatList.splice(index, 1)
      const chat = state.historyList[state.activeChatIndex]
      const arr = state.chatList.filter((item) => item.role !== globalConfig.systemRole)
      chat.length = arr.length - 1
      uni.setStorageSync(chat.id.toString(), state.chatList)
      uni.setStorageSync(store.state.auth.userInfo.id.toString(), state.historyList)
    },
    setSendLoading(state, flag) {
      state.sendLoading = flag
    },
    deleteMessage(state, id) {
      const index = state.chatList.findIndex((item) => item.id === id)
      if (index > 0) {
        state.chatList.splice(index, 1)
      }
    },
  },
  actions: {
    async sendMessage({ getters, commit, dispatch }, message) {
      commit('sendMessage', message)
      commit('updateHistoryItem')
      dispatch('updateRobotMessage')
      dispatch('afterSendMessage')
      await dispatch('beforeSeedMessage', message)
      const data = {
        message: JSON.stringify(getters.chatList),
        type: '2',
        model_id: getters.activeChat.modelId || 7,
      }
      const platform = uni.$u.platform
      if (platform === 'mp') {
        dispatch('messageMpFn', data)
      }
    },
    messageMpFn({ state, commit, dispatch }, data) {
      const requestTask = sendMessage(
        data,
        (res) => {},
        (error) => {
          console.log('error', error)
          dispatch('updateRobotMessage', {
            content: globalHint.error,
            status: globalStatus.error,
          })
        },
      )
      let message = ''
      let status = globalStatus.sending
      requestTask.onChunkReceived(function (response) {
        if (timer) clearTimeout(timer)
        const arrayBuffer = response.data
        const unit8Arr = new Uint8Array(arrayBuffer)
        const str = new TextEdncoding.TextDecoder('utf-8').decode(unit8Arr)
        let arr = str.split('\n')
        // console.log(arr)
        arr.forEach((item) => {
          if (item === 'data:<!finish>') {
            status = globalStatus.done
          } else if (item === 'data:<!error>') {
            status = globalStatus.error
            message = message || globalHint.error
          } else if (item.includes('data:<!sensitive>')) {
            status = globalStatus.sensitive
            let text = item.replace('data:<!sensitive>', '')
            message = Base64.decode(text)
            // 将用户的消息标记为敏感消息
            const userMessage = state.chatList[state.chatList.length - 2]
            commit('sendMessage', {
              ...userMessage,
              status: globalStatus.sensitive,
            })
          } else if (item.includes('data:<!json>')) {
            let text = item.replace('data:<!json>', '')
            let jsonData = JSON.parse(text)
            if (jsonData.code === 110) {
              status = globalStatus.sensitive
              // 将用户的消息标记为敏感消息
              const userMessage = state.chatList[state.chatList.length - 2]
              commit('sendMessage', {
                ...userMessage,
                status: globalStatus.sensitive,
              })
            } else {
              status = globalStatus.error
            }
            message = Base64.decode(jsonData.msg)
          } else {
            if (item.includes('data:')) {
              let text = item.replace('data:', '')
              message += Base64.decode(text)
            }
          }
        })
        if (status === globalStatus.sending) {
          timer = setTimeout(() => {
            if (!message) {
              status = globalStatus.error
              dispatch('updateRobotMessage', { content: globalHint.timeout, status })
            } else {
              status = globalStatus.done
              dispatch('updateRobotMessage', { content: message, status })
            }
            requestTask.abort()
          }, TimeOut)
        }
        dispatch('updateRobotMessage', { content: message, status })
      })
    },
    updateRobotMessage({ state, commit }, options) {
      let message = {}
      if (options) {
        message = JSON.parse(JSON.stringify(state.chatList[state.chatList.length - 1]))
        message = Object.assign(message, options)
      } else {
        message = {
          id: uni.$u.guid(),
          role: globalConfig.robotRole,
          content: '',
          status: globalStatus.loading,
          time: new Date().getTime(),
        }
      }
      if (
        options &&
        options.status !== globalStatus.loading &&
        options.status !== globalStatus.sending
      ) {
        commit('setSendLoading', false)
      }
      commit('sendMessage', message)
      commit('updateHistoryItem')
    },
    async beforeSeedMessage({ state, commit, getters }, sendMessage) {
      console.log('beforeSeedMessage', sendMessage)
      const str = JSON.stringify(getters.chatList)
      if (str.length > MaxLength || getters.chatList.length > MaxMessageLength) {
        const message = {
          id: uni.$u.guid(),
          role: globalConfig.systemRole,
          content: sendMessage.content,
          status: globalStatus.done,
          time: new Date().getTime(),
        }
        try {
          const res = await summaryContext(str)
          message.content = res.answer
          commit('beforeSeedMessage', message)
        } catch (e) {
          commit('beforeSeedMessage', message)
        }
      }
    },
    async afterSendMessage({ state, commit, getters }) {
      // 没有生成过则生成
      if (!getters.activeChat.generatedTitle) {
        const str = JSON.stringify(getters.chatList)
        console.log('当前长度+' + str.length)
        if (str.length > MinSummaryTitleLength) {
          const res = await summaryTitle(str)
          commit('updateHistoryTitle', res.answer)
        }
      }
    },
  },
}

function findLastIndex(array, condition) {
  for (let i = array.length - 1; i >= 0; i--) {
    if (condition(array[i])) {
      return i
    }
  }
  return -1 // 如果没有符合条件的元素，则返回 -1
}

export default chat
