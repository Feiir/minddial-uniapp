const globalConfig = {
  robotRole: 'assistant', // 机器人角色
  userRole: 'user', // 用户角色
  systemRole: 'system', // 系统角色
  status: {
    hint: 'hint', // 提示（用于打开助手第一条消息及一些人性化提示）
    loading: 'loading', // 加载中
    done: 'done', // 加载完成
    error: 'error', // 加载失败
    sending: 'sending', // 发送中
    sensitive: 'sensitive', // 敏感词（eg:尖阁诸岛在哪）
  },
  hint: {
    loading: '思考中...',
    error: '出错了，请稍后重试！',
    sending: '正在输入...',
    sensitive: '您的输入包含敏感词，请重新输入！',
    timeout: '请求超时，请稍后重试！',
  },
}

export default globalConfig
export const globalStatus = globalConfig.status
export const globalHint = globalConfig.hint
