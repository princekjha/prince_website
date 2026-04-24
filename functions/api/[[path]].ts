import { Hono } from 'hono';
import { handle } from 'hono/cloudflare-pages';

const app = new Hono().basePath('/api');

// This is a bridge. On Cloudflare, these routes run.
// We will eventually move your server.ts logic here.

app.get('/health', (c) => c.json({ status: 'ok', bridge: 'cloudflare' }));

app.get('/profile', (c) => {
  return c.json({
    name: 'Prince Kumar Jha',
    role: 'Data & Tech Officer',
    bio: 'Architecting data pipelines, automation systems, and AI-driven solutions to solve complex business challenges.',
    profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400'
  });
});

export const onRequest = handle(app);
