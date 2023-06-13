let BASE_URL = ''

if (process.env.NODE_ENV === 'development') {
  // BASE_URL = 'http://minddial.top:8991'
  BASE_URL = 'https://yourwebsite.com'
  // #ifdef H5
  BASE_URL = ''
  // #endif
} else {
  BASE_URL = 'https://yourwebsite.com' // 正式环境
}

const whiteList = ['/api/chat/message']

export { BASE_URL, whiteList }
