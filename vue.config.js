module.exports = {
  transpileDependencies: ['uview-ui'],
  devServer: {
    proxy: {
      '/api': {
        target: '1.15.64.40:8991',
        changeOrigin: true,
      },
    },
  },
}
