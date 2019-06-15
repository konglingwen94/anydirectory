const { cache } = require('./config.js')

function refreshRes(stat, res) {
  const { expires, cacheControl, lastModified, etag, maxAge } = cache
  if (expires) {
    res.setHeader('Expires', new Date(Date.now() + maxAge * 1000).toUTCString())
  }

  if (cacheControl) {
    res.setHeader('Cache-Control', `public, max-age=${maxAge}`)
  }

  if (lastModified) {
    res.setHeader('Last-Modified', stat.mtime.toUTCString())
  }

  if (etag) {
    res.setHeader('Etag', stat.size +'-'+ stat.mtime )
  }
}

module.exports = (stat, req, res) => {
  refreshRes(stat, res)

  const lastModified = req.headers['if-modified-since']
  const etag = req.headers['if-none-match']

  if (!lastModified && !etag) {
    return false
  }
  console.log(lastModified, res.getHeader('Last-Modified'))
  if (lastModified && lastModified !== res.getHeader('Last-Modified')) {
    return false
  }

  if (etag && etag !== res.getHeader('ETag')) {
    return false
  }

  return true
}
