// api/index.ts
import { Hono } from 'hono';

// --- Logika Aplikasi ---
const app = new Hono();

const meta = {
  service: 'article-parser',
  lang: 'typescript',
  server: 'hono',
  platform: 'vercel-nodejs'
};

app.get('/ping', (c) => {
  return c.text('Ping successful', 200);
});

app.get('/', async (c) => {
  const url = c.req.query('url');
  if (!url) {
    return c.json(meta);
  }
  try {
    // Perubahan ada di sini! Menggunakan dynamic import()
    const { extract } = await import('@extractus/article-extractor');
    const data = await extract(url);
    
    return c.json({
      error: 0,
      message: 'article has been extracted successfully',
      data
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    return c.json({
      error: 1,
      message: errorMessage,
      data: null
    });
  }
});
// --- Akhir Logika Aplikasi ---

// Ekspor handler untuk Vercel (tetap sama)
export default app.fetch;
