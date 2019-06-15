module.exports = (totalSize, request, response) => {
  const range = request.headers.range
  if (!range) {
    return {
      code: 200,
    }
  }
  // console.log(size, range)

  const size = range.match(/bytes=(\d*)-(\d*)/)
  const end = size[2] || totalSize - 1
  const start = size[1] || totalSize - end

  if (start > end || start < 0 || end > totalSize) {
    return { code: 200 }
  }
  response.statusCode = 206
  response.setHeader('Accept-Ranges', 'bytes')
  response.setHeader('Content-Range', `byte ${start}-${end}/${totalSize}`)
  response.setHeader('Content-Length', end - start)
  return {
    code: 206,
    start: parseInt(start),
    end: parseInt(end),
  }
}
