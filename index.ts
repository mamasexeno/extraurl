import { Hono } from 'hono'
import { extract } from 'article-extractor'

const app = new Hono()

const meta = {
  service: 'article-parser',
  lang: 'typescript',
  server: 'hono',
  platform: 'deno'
}

app.get('/ping', (c) => {
  return c.text('Ping successful', 200)
})

app.get('/', async (c) => {
  const url = c.req.query('url')
  if (!url) {
    return c.json(meta)
  }
  try {
    const data = await extract(url)
    return c.json({
      error: 0,
      message: 'article has been extracted successfully',
      data
    })
  } catch (err: any) {
    return c.json({
      error: 1,
      message: err.message,
      data: null
    })
  }
})

// Hapus fungsi serve() yang lama dan gunakan Deno.serve bawaan
Deno.serve(app.fetch)
