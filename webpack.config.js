var path = require('path')

module.exports = {
  entry: './src/index.js',
  //...
  devServer: {
    // contentBase: path.join(__dirname, 'src'),
    // compress: true,
    proxy: [
      {
        context: ['/image'],
        target: 'http://e.hiphotos.baidu.com',
        changeOrigin: true,
        bypass(req, res, proxy) {
          req.headers.referer = 'http://e.hiphotos.baidu.com'
          console.log(proxy)
          // return true
        },
      },
    ],
  },
}
