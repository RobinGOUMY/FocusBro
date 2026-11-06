import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname } from 'node:path'

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
}
const port = Number(process.env.PORT ?? 4173)

createServer(async (request, response) => {
  const path = request.url.split('?')[0]
  const file = path === '/' ? '/index.html' : path
  if (!/^\/(?:index\.html|(?:src|assets)\/[a-zA-Z0-9-]+\.[a-z]+)$/.test(file) || !types[extname(file)]) {
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
