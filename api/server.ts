import { Hono } from 'hono';
import { extract } from 'npm:@extractus/article-extractor';

// --- Logika Aplikasi (Sama seperti di index.ts) ---
const app = new Hono();

const meta = {
  service: 'article-parser',
  lang: 'typescript',
  server: 'hono',
  platform: 'vercel'
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

// Ekspor handler untuk Vercel
export default app.fetch;
