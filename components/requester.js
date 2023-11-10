import https from 'https'
import http from 'http'
import zlib from 'zlib'

export function httpRequest(url, opts = {}, postData) {
  return new Promise((resolve, reject) => {
    if (opts.agent) url = url.replace('https', 'http')

    const proto = url.startsWith('https') ? https : http

    const request = proto.request(url, opts, (res) => {
      // reject on bad status
      if (res.statusCode < 200 || res.statusCode > 302) {
        return reject(new Error('statusCode=' + res.statusCode))
      }

      const content = encodingResponse(res)

      const chunks = []
      res.on('data', (chunk) => {
        if (!content) chunks.push(chunk)
      })

      res.once('end', () => {
        if (content) return

        const body = Buffer.concat(chunks)
        resolve({ res, body })
      })

      if (!content) return
      content.on('data', (chunk) => {
        chunks.push(chunk)
      })

      content.once('end', () => {
        const body = Buffer.concat(chunks)
        resolve({ res, body })
      })

      content.on('error', (err) => {
        reject(err)
      })
    })

    request.on('error', (err) => {
      reject(err)
    })

    if (postData) {
      request.write(postData)
    }

    request.end()
  })
}

function encodingResponse(response) {
  const contentEncoding = response.headers['content-encoding'] || 'identity'
  const encoding = contentEncoding.trim().toLowerCase()

  const zlibOptions = {
    finishFlush: zlib.Z_SYNC_FLUSH,
    flush: zlib.Z_SYNC_FLUSH,
  }

  let content

  if (encoding === 'gzip') {
    content = zlib.createGunzip(zlibOptions)
    response.pipe(content)
  } else if (encoding === 'deflate') {
    content = zlib.createInflate(zlibOptions)
    response.pipe(content)
  }

  return content
}
