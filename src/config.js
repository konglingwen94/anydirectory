module.exports = {
  port: 3000,
  host: '127.0.0.1',
  root: process.cwd(),
  compress:/(html|js|txt)/,
  cache:{
    maxAge:10,
    lastModified:true,
    cacheControl:true,
    etag:true,
    expires:true
  }
}
