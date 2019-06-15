const http = require('http')
const path = require('path')
const route = require('./route')
// const config = require('./config')
const fs = require('fs')
const yargs = require('yargs')
const Server = require('./app')
// console.log(yargs)
const argv = yargs
  .usage('anywhere [options]')
  .option('p', {
    alias: 'port',
    describe: '端口号',
    default: 9527,
  })
  .option('h', {
    alias: 'hostname',
    describe: 'host',
    default: '127.0.0.1',
  })
  .option('d', {
    alias: 'root',
    describe: 'root path',
    default: process.cwd(),
  })
  .option('o', {
    alias: 'open',
    describe: 'open url',
    default: false,
  })
  .version()
  .alias('v', 'version')
  .help().argv

// console.log(argv)
const server = new Server(argv)

server.start()
// process.on('uncaughtException', err => {
//   debugger
//   console.error(err)
// })
