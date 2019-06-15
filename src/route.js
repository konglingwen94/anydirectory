const fs = require('fs')
const { promisify } = require('util')
const path = require('path')
const readFile = promisify(fs.readFile)
const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir)
const HandleBars = require('handlebars')
const compress = require('./compress')
const range = require('./range')
const mime = require('./mime')
const cache = require('./cache')
// console.log(mime['.json'])

const html = fs.readFileSync(path.join(__dirname, './dir.html'))
const template = HandleBars.compile(html.toString())

// const { root } = require('./config')
// const config = require('./config')
module.exports = async (req, res, filePath, config) => {
  try {
    const result = await stat(filePath)

    if (result.isDirectory()) {
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/html')

      const files = await readdir(filePath)

      const dirPath = path.relative(config.root, filePath)

      console.log(__dirname,config.root, filePath)
      const data = {
        title: path.basename(filePath),
        files: files.map(file => {
          const ext = path.extname(file)
          let isFile
          try {
            const absolutePath = path.join(filePath, file)

            isFile = fs.statSync(absolutePath).isFile()
            // console.log(absolutePath)
          } catch (err) {
            // isFile = false
            console.error(err)
          }
          return {
            file,
            mime: mime[ext] || 'text/plain',
            isFile,
          }
        }),
        dir: dirPath ? '/'+dirPath : '',
      }
      // console.log(data)
      // console.log(data)
      res.end(template(data))
    } else if (result.isFile()) {
      const contentType = mime[path.extname(filePath)] || 'text/plain'
      res.setHeader('Content-Type', contentType)

      if (cache(result, req, res)) {
        res.statusCode = 304
        res.end()
        return
      }

      let readStream
      const { code, start, end } = range(result.size, req, res)
      if (code === 206) {
        readStream = fs.createReadStream(filePath, { start, end })
      } else {
        res.statusCode = 200
        readStream = fs.createReadStream(filePath)
      }
      console.log(filePath.match)
      if (filePath.match(config.compress)) {
        readStream = compress(readStream, req, res)
      }
      readStream.pipe(res)
    }
  } catch (err) {
    console.error(err)
    res.statusCode = 400
    res.end(err.toString())
  }
}
