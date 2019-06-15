const http = require('http')
const path = require('path')
const chalk = require('chalk')
const config = require('./config')
const route = require('./route')
const open = require('./openUrl')

class Server {
  constructor(conf) {
    this.config = Object.assign({}, config, conf)
    // console.log(this.config)
  }
  start() {
    const server = http.createServer((req, res) => {
      if (req.url.startsWith('/favicon.ico')) return

      const filePath = path.join(this.config.root, req.url)
      route(req, res, filePath, this.config)
    })

    server.listen(this.config.port, this.config.host, () => {
      const url = `http://${this.config.host}:${this.config.port}`
      console.log('server is running at ' + chalk.green(url))
      open(url)
    })
  }
}

module.exports = Server
