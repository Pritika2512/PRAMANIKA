import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { URL } from 'node:url'

const distUrl = new URL('../dist/', import.meta.url)
const serverUrl = new URL('../dist/server/', import.meta.url)
const mimeTypes = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.ico':'image/x-icon' }
const assets = {}

async function collect(directory, prefix = '') {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name === 'server' || entry.name === '.openai') continue
    const itemUrl = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, directory)
    const relativePath = `${prefix}/${entry.name}`
    if (entry.isDirectory()) await collect(itemUrl, relativePath)
    else {
      const extension = entry.name.slice(entry.name.lastIndexOf('.'))
      assets[relativePath] = [mimeTypes[extension] || 'application/octet-stream', (await readFile(itemUrl)).toString('base64')]
    }
  }
}

await collect(distUrl)
await mkdir(serverUrl, { recursive: true })
await writeFile(new URL('index.js', serverUrl), `const assets = ${JSON.stringify(assets)}
const decode = value => Uint8Array.from(atob(value), character => character.charCodeAt(0))

export default {
  async fetch(request) {
    if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('Method Not Allowed', { status: 405 })
    const url = new URL(request.url)
    let path = url.pathname === '/' ? '/index.html' : url.pathname
    if (!assets[path] && !path.includes('.')) path = '/index.html'
    const asset = assets[path]
    if (!asset) return new Response('Not Found', { status: 404 })
    return new Response(request.method === 'HEAD' ? null : decode(asset[1]), { headers: { 'content-type': asset[0], 'cache-control': path === '/index.html' ? 'no-cache' : 'public, max-age=31536000, immutable' } })
  },
}\n`)
