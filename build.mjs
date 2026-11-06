import { cp, mkdir, rm } from 'node:fs/promises'

const output = new URL('./dist/', import.meta.url)
await rm(output, { recursive: true, force: true })
await mkdir(output)
await Promise.all(['index.html', 'src', 'assets'].map(entry =>
  cp(new URL(entry, import.meta.url), new URL(entry, output), { recursive: true }),
))
