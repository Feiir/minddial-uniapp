let BASE_URL = ''

if (process.env.NODE_ENV === 'development') {
  BASE_URL = 'http://test.minddial.top'
  // #ifdef H5
  BASE_URL = ''
  // #endif
} else {
  BASE_URL = 'http://test.minddial.top' // 正式环境
}

const whiteList = ['/api/chat/message']

export { BASE_URL, whiteList }
