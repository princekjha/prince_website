import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { sign } from 'hono/jwt';

interface D1Database {
  prepare: (sql: string) => D1PreparedStatement;
}

interface D1PreparedStatement {
  bind: (...values: any[]) => D1PreparedStatement;
  all: <T = any>() => Promise<{ results: T[] }>;
  first: <T = any>(colName?: string) => Promise<T>;
}

type Bindings = {
  DB: D1Database;
  JWT_SECRET: string;
  ADMIN_PASSWORD_LAYER2: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', cors());

// Auth Routes
app.post('/api/auth/google', async (c) => {
  const { idToken } = await c.req.json();
  // In a real worker, you'd verify the token with Google's library or public keys
  // For this adaptation, we assume verification and check the email
  const payload = { email: "pjha3913@gmail.com" }; // Mocked for demo
  
  if (payload.email === "pjha3913@gmail.com") {
    return c.json({ success: true, email: payload.email });
  }
  return c.json({ success: false }, 401);
});

app.post('/api/login', async (c) => {
  const { password, email } = await c.req.json();
  if (email === "pjha3913@gmail.com" && password === c.env.ADMIN_PASSWORD_LAYER2) {
    const token = await sign({ email, role: 'admin' }, c.env.JWT_SECRET);
    return c.json({ success: true, token });
  }
  return c.json({ success: false }, 401);
});

// Profile
app.get('/api/profile', async (c) => {
  const profile = await c.env.DB.prepare('SELECT * FROM profile WHERE id = "main"').first();
  return c.json(profile);
});

// Projects
app.get('/api/projects', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM projects ORDER BY orderIndex ASC').all();
  return c.json(results.map(r => ({ ...r, techStack: JSON.parse(r.techStack as string || '[]') })));
});

// Experience
app.get('/api/experience', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM experiences ORDER BY orderIndex ASC').all();
  const experiences = await Promise.all(results.map(async (exp: any) => {
    const images = await c.env.DB.prepare('SELECT * FROM experience_images WHERE experience_id = ?').bind(exp.id).all();
    return { ...exp, images: images.results };
  }));
  return c.json(experiences);
});

// Verses/Creative
app.get('/api/creative', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM creative_pieces ORDER BY orderIndex ASC').all();
  return c.json(results);
});

// Skills
app.get('/api/skills', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM skills ORDER BY orderIndex ASC').all();
  return c.json(results.map(r => ({ ...r, skills: JSON.parse(r.skills_json as string || '[]') })));
});

// Learning Topics & Lessons
app.get('/api/learning/topics', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM learning_topics').all();
  return c.json(results);
});

app.get('/api/learning/lessons', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM lessons ORDER BY orderIndex ASC').all();
  return c.json(results);
});

// Contact Form (Workers would use MailChannels or SMTP service)
app.post('/api/contact', async (c) => {
  const body = await c.req.json();
  // Logic for sending email via MailChannels or Resend
  return c.json({ success: true });
});

export default app;
