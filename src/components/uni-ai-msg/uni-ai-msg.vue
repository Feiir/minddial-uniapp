<template>
  <view class="rich-text-box" :class="{ 'show-cursor': showCursor }" ref="rich-text-box">
    <rich-text
      v-if="nodes && nodes.length"
      selectable
      space="nbsp"
      preview
      :nodes="nodes"
    ></rich-text>

    <!-- #ifdef H5 -->
    <view class="copy-box" :style="{ left, top }">
      <text class="copy" @click="copy">复制</text>
      <!-- <view v-if="left != '-100px'" class="copy-mask" @click="left = '-100px'"></view> -->
    </view>
    <!-- #endif -->
  </view>
</template>

<script>
// 引入markdown-it库
import MarkdownIt from '@/lib/markdown-it.min.js'

// hljs是由 Highlight.js 经兼容性修改后的文件，请勿直接升级。否则会造成uni-app-vue3-Android下有兼容问题
import hljs from '@/lib/highlight/highlight-uni.min.js'

// 引入html-parser.js库
import parseHtml from '@/lib/html-parser.js'

// console.log('hljs--',hljs);
// console.log('hljs--',hljs.getLanguage('js'));

// 初始化 MarkdownIt库
const markdownIt = MarkdownIt({
  // 在源码中启用 HTML 标签
  html: true,
  // 如果结果以 <pre ... 开头，内部包装器则会跳过。
  highlight: function (str, lang) {
    // if (lang && hljs.getLanguage(lang)) {
    // 	console.error('lang', lang)
    // 	try {
    // 		return '<pre class="hljs" style="padding: 5px 8px;margin: 5px 0;overflow: auto;"><code>' +
    // 			hljs.highlight('lang', str, true).value +
    // 			'</code></pre>';
    // 	} catch (__) {}
    // }

    try {
      return (
        '<pre class="hljs" style="padding: 5px 8px;margin: 5px 0;overflow: auto;"><code>' +
        hljs.highlightAuto(str).value +
        '</code></pre>'
      )
    } catch (__) {}

    return (
      '<pre class="hljs" style="padding: 5px 8px;margin: 5px 0;overflow: auto;"><code>' +
      markdownIt.utils.escapeHtml(str) +
      '</code></pre>'
    )
  },
})

export default {
  name: 'msg',
  data() {
    return {
      // 悬浮的复制按钮的左边距
      left: '-100px',
      // 悬浮的复制按钮的上边距
      top: '-100px',
    }
  },
  mounted() {
    // #ifdef H5
    // web端限制不选中文字时出现系统右键菜单
    let richTextBox = this.$refs['rich-text-box']
    if (richTextBox) {
      // 监听鼠标右键事件
      richTextBox.$el.addEventListener('contextmenu', (e) => {
        // 判断是否选中了文字内容，如果没有则限制系统默认行为（禁止弹出右键菜单）
        if (!document.getSelection().toString()) {
          // console.log(e);
          // 设置悬浮的复制按钮的坐标值
          this.top = e.y + 'px'
          this.left = e.x + 'px'

          // console.log(e.x);
          // console.log(e.y);
          // 禁止系统默认行为（禁止弹出右键菜单）
          e.preventDefault()
        }
      })
    }
    // 监听全局点击事件，隐藏悬浮的复制按钮的坐标
    document.addEventListener('click', () => {
      this.left = '-100px'
    })
    // #endif
  },
  props: {
    // 传入的markdown内容
    md: {
      type: String,
      default() {
        return ''
      },
    },
    // 是否显示鼠标闪烁的效果
    showCursor: {
      type: [Boolean, Number],
      default() {
        return false
      },
    },
  },
  computed: {
    // 修改转换结果的html值 用于正确给界面增加鼠标闪烁的效果
    html() {
      // 判断markdown中代码块标识符的数量是否为偶数
      if (this.md.split('```').length % 2) {
        return markdownIt.render(this.md + ' \n <span class="cursor">|</span>')
      } else {
        return markdownIt.render(this.md) + ' \n <span class="cursor">|</span>'
      }
    },
    nodes() {
      // return this.html
      // console.log('parseHtml(this.html)',parseHtml(this.html));
      // HTML String 类型转换 避免内部转换导致的性能下降。
      return parseHtml(this.html)
    },
  },
  methods: {
    // #ifdef H5
    // 复制文本内容到系统剪切板
    copy() {
      uni.setClipboardData({
        data: this.md,
        showToast: false,
      })
      // 设置悬浮的复制按钮的坐标值，使其隐藏
      this.left = '-100px'
    },
    // #endif
  },
}
</script>

<style lang="scss">
/* #ifndef VUE3 && APP-PLUS */
@import '@/components/uni-ai-msg/uni-ai-msg.scss';
/* #endif */
</style>
