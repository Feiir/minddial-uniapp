let BASE_URL = ''

if (process.env.NODE_ENV === 'development') {
  BASE_URL = '1.15.64.40:8991'
  // #ifdef H5
  BASE_URL = ''
  // #endif
} else {
  BASE_URL = '1.15.64.40:8991' // 正式环境
}

const whiteList = ['/api/chat/message']

export { BASE_URL, whiteList }
