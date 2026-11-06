import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname } from 'node:path'
import { Readable } from 'node:stream'

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
}
const port = Number(process.env.PORT ?? 4173)

createServer(async (request, response) => {
  const path = request.url.split('?')[0]
  if (path === '/api/account') {
    try {
      const { default: account } = await import('./api/account.js')
      const headers = new Headers(request.headers)
      headers.set('x-real-ip', request.socket.remoteAddress ?? 'local')
      const method = request.method
      const result = await account.fetch(new Request(`http://${request.headers.host}${request.url}`, {
        method, headers, ...(['POST', 'PUT'].includes(method) ? { body: Readable.toWeb(request), duplex: 'half' } : {}),
      }))
      response.writeHead(result.status, Object.fromEntries(result.headers))
      response.end(Buffer.from(await result.arrayBuffer()))
    } catch {
      response.writeHead(503, { 'Content-Type': 'application/json; charset=utf-8' })
        .end(JSON.stringify({ error: 'La sauvegarde en ligne est indisponible sur cette adresse.' }))
    }
    return
  }
  const file = path === '/' ? '/index.html' : path
  if (!/^\/(?:index\.html|(?:src|assets)\/[a-zA-Z0-9-]+\.[a-z0-9]+)$/.test(file) || !types[extname(file)]) {
    response.writeHead(404).end('Introuvable')
    return
  }

  try {
    const content = await readFile(new URL(`.${file}`, import.meta.url))
    response.writeHead(200, { 'Content-Type': types[extname(file)], 'X-Content-Type-Options': 'nosniff' }).end(content)
  } catch (error) {
    const status = error.code === 'ENOENT' ? 404 : 500
    response.writeHead(status).end(status === 404 ? 'Introuvable' : 'Erreur de lecture')
  }
}).listen(port, process.env.HOST ?? '127.0.0.1', () => {
  const address = process.env.HOST === '0.0.0.0' ? 'localhost' : (process.env.HOST ?? '127.0.0.1')
  console.log(`FocusBro · http://${address}:${port}`)
})
