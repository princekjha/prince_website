// import { Hono } from 'hono';
// import { cors } from 'hono/cors';

// /* ---------------- TYPES ---------------- */

// interface D1Database {
//   prepare: (sql: string) => D1PreparedStatement;
// }

// interface D1PreparedStatement {
//   bind: (...values: any[]) => D1PreparedStatement;
//   all: <T = any>() => Promise<{ results: T[] }>;
//   first: <T = any>(colName?: string) => Promise<T>;
//   run: () => Promise<{ success: boolean }>;
// }

// type Bindings = {
//   DB: D1Database;
//   JWT_SECRET: string;
//   ADMIN_PASSWORD_LAYER2: string;
//   ASSETS?: { fetch: (request: Request) => Promise<Response> };
// };

// /* ---------------- APP INIT ---------------- */

// const app = new Hono<{ Bindings: Bindings }>();

// app.use('*', cors());

// app.onError((err, c) => {
//   console.error('Worker error:', err.message);
//   return c.json({ success: false, error: err.message }, 500);
// });

// /* ---------------- SESSION LOGIC (D1) ---------------- */

// const saveSession = async (db: D1Database, token: string, email: string) => {
//   await db.prepare('INSERT OR REPLACE INTO sessions (token, email, expiresAt) VALUES (?, ?, ?)')
//     .bind(token, email, Date.now() + 24 * 60 * 60 * 1000)
//     .run();
// };

// const isAdmin = async (c: any, next: any) => {
//   const authHeader = c.req.header('Authorization');
//   if (authHeader) {
//     const token = authHeader.replace('Bearer ', '');
//     try {
//       const session = await c.env.DB.prepare('SELECT * FROM sessions WHERE token = ? AND expiresAt > ?')
//         .bind(token, Date.now())
//         .first();
//       if (session) return next();
//     } catch (e) {
//       console.error('Session check failed:', e);
//     }
//   }
//   return c.json({ message: 'Unauthorized' }, 401);
// };

// /* ---------------- ASSET / SPA MIDDLEWARE ---------------- */

// app.use('*', async (c, next) => {
//   // If it's an API route, skip to the handlers
//   if (c.req.path.startsWith('/api')) {
//     return next();
//   }

//   const ASSETS = c.env.ASSETS;
//   if (!ASSETS) {
//     return next();
//   }

//   try {
//     // Attempt to fetch the static asset
//     let response = await ASSETS.fetch(c.req.raw);

//     // If the asset is not found (404), it might be an SPA route
//     // In which case we serve index.html
//     if (response.status === 404) {
//       const url = new URL(c.req.url);
//       url.pathname = '/index.html';
      
//       // Fetch index.html. We use a fresh Request but keep some context.
//       // We stripping out the body as index.html should be a plain GET.
//       const spaRequest = new Request(url.toString(), {
//         method: 'GET',
//         headers: c.req.raw.headers,
//       });
      
//       response = await ASSETS.fetch(spaRequest);
//     }

//     return response;
//   } catch (err) {
//     console.error('ASSETS fetch error:', err);
//     // Returning a more descriptive error helps debugging deployment issues
//     const errorMessage = err instanceof Error ? err.message : String(err);
//     return c.text(`Asset serving error: ${errorMessage}`, 500);
//   }
// });

// const makeId = () => crypto.randomUUID();

// /* ---------------- AUTH ---------------- */

// app.post('/api/auth/google', async (c) => {
//   const { idToken } = await c.req.json();
//   void idToken; // In production, verify idToken with Google
//   const email = 'pjha3913@gmail.com';
//   const token = crypto.randomUUID();
//   await saveSession(c.env.DB, token, email);
//   return c.json({ success: true, email, token });
// });

// app.post('/api/login', async (c) => {
//   const { email, password } = await c.req.json();
//   if (email === 'pjha3913@gmail.com' && password === c.env.ADMIN_PASSWORD_LAYER2) {
//     const token = crypto.randomUUID();
//     await saveSession(c.env.DB, token, email);
//     return c.json({ success: true, token });
//   }
//   return c.json({ success: false }, 401);
// });

// /* ---------------- API ROUTES ---------------- */

// app.get('/api/profile', async (c) => {
//   const profile = await c.env.DB
//     .prepare('SELECT * FROM profile WHERE id = ?')
//     .bind('main')
//     .first();
//   return c.json(profile ?? { name: 'Prince Kumar Jha', role: 'Data & Tech Officer' });
// });

// app.post('/api/profile', isAdmin, async (c) => {
//   const body = await c.req.json<any>();
//   await c.env.DB
//     .prepare('INSERT OR REPLACE INTO profile (id, name, role, bio, profileImage) VALUES ("main", ?, ?, ?, ?)')
//     .bind(body.name ?? '', body.role ?? '', body.bio ?? '', body.profileImage ?? '')
//     .run();
//   return c.json(body);
// });

// app.get('/api/projects', async (c) => {
//   const { results } = await c.env.DB
//     .prepare('SELECT * FROM projects ORDER BY orderIndex ASC')
//     .all();
//   return c.json(results.map((r: any) => ({
//     ...r,
//     techStack: JSON.parse((r.techStack as string) || '[]'),
//   })));
// });

// app.post('/api/projects', isAdmin, async (c) => {
//   const body = await c.req.json<any>();
//   const id = body.id || makeId();
//   await c.env.DB
//     .prepare('INSERT INTO projects (id, title, description, fullDescription, techStack, imageUrl, link, github, orderIndex) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
//     .bind(id, body.title ?? 'Untitled Project', body.description ?? '', body.fullDescription ?? '', JSON.stringify(body.techStack ?? []), body.imageUrl ?? '', body.link ?? '', body.github ?? '', body.orderIndex ?? 0)
//     .run();
//   return c.json({ id, ...body });
// });

// app.put('/api/projects/:id', isAdmin, async (c) => {
//   const id = c.req.param('id');
//   const body = await c.req.json<any>();
//   await c.env.DB
//     .prepare('UPDATE projects SET title=?, description=?, fullDescription=?, techStack=?, imageUrl=?, link=?, github=?, orderIndex=? WHERE id=?')
//     .bind(body.title ?? 'Untitled Project', body.description ?? '', body.fullDescription ?? '', JSON.stringify(body.techStack ?? []), body.imageUrl ?? '', body.link ?? '', body.github ?? '', body.orderIndex ?? 0, id)
//     .run();
//   return c.json({ id, ...body });
// });

// app.delete('/api/projects/:id', isAdmin, async (c) => {
//   const id = c.req.param('id');
//   await c.env.DB.prepare('DELETE FROM projects WHERE id = ?').bind(id).run();
//   return c.json({ success: true });
// });

// app.get('/api/blog', async (c) => {
//   const { results } = await c.env.DB.prepare('SELECT * FROM blog_posts ORDER BY datePublished DESC').all();
//   return c.json(results);
// });

// app.post('/api/blog', isAdmin, async (c) => {
//   const body = await c.req.json<any>();
//   const id = body.id || makeId();
//   await c.env.DB
//     .prepare('INSERT INTO blog_posts (id, title, excerpt, content, category, readTime, status, datePublished) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
//     .bind(id, body.title ?? 'Untitled Post', body.excerpt ?? '', body.content ?? '', body.category ?? '', body.readTime ?? '', body.status ?? 'draft', body.datePublished ?? new Date().toISOString())
//     .run();
//   return c.json({ id, ...body });
// });

// app.put('/api/blog/:id', isAdmin, async (c) => {
//   const id = c.req.param('id');
//   const body = await c.req.json<any>();
//   await c.env.DB
//     .prepare('UPDATE blog_posts SET title=?, excerpt=?, content=?, category=?, readTime=?, status=?, datePublished=? WHERE id=?')
//     .bind(body.title ?? 'Untitled Post', body.excerpt ?? '', body.content ?? '', body.category ?? '', body.readTime ?? '', body.status ?? 'draft', body.datePublished ?? new Date().toISOString(), id)
//     .run();
//   return c.json({ id, ...body });
// });

// app.delete('/api/blog/:id', isAdmin, async (c) => {
//   const id = c.req.param('id');
//   await c.env.DB.prepare('DELETE FROM blog_posts WHERE id = ?').bind(id).run();
//   return c.json({ success: true });
// });

// app.get('/api/experience', async (c) => {
//   const { results } = await c.env.DB.prepare('SELECT * FROM experiences ORDER BY orderIndex ASC').all();
//   const experiences = await Promise.all(results.map(async (exp: any) => {
//     const images = await c.env.DB.prepare('SELECT * FROM experience_images WHERE experience_id = ?').bind(exp.id).all();
//     return { ...exp, images: images.results };
//   }));
//   return c.json(experiences);
// });

// app.post('/api/experience', isAdmin, async (c) => {
//   const body = await c.req.json<any>();
//   const id = body.id || makeId();
//   await c.env.DB
//     .prepare('INSERT INTO experiences (id, organization, role, tenure, description, orderIndex) VALUES (?, ?, ?, ?, ?, ?)')
//     .bind(id, body.organization ?? '', body.role ?? '', body.tenure ?? '', body.description ?? '', body.orderIndex ?? 0)
//     .run();
//   return c.json({ id, ...body });
// });

// app.put('/api/experience/:id', isAdmin, async (c) => {
//   const id = c.req.param('id');
//   const body = await c.req.json<any>();
//   await c.env.DB
//     .prepare('UPDATE experiences SET organization=?, role=?, tenure=?, description=?, orderIndex=? WHERE id=?')
//     .bind(body.organization ?? '', body.role ?? '', body.tenure ?? '', body.description ?? '', body.orderIndex ?? 0, id)
//     .run();
//   return c.json({ id, ...body });
// });

// app.delete('/api/experience/:id', isAdmin, async (c) => {
//   const id = c.req.param('id');
//   await c.env.DB.prepare('DELETE FROM experiences WHERE id = ?').bind(id).run();
//   return c.json({ success: true });
// });

// app.get('/api/creative', async (c) => {
//   const { results } = await c.env.DB.prepare('SELECT * FROM creative_pieces ORDER BY orderIndex ASC').all();
//   return c.json(results);
// });

// app.post('/api/creative', isAdmin, async (c) => {
//   const body = await c.req.json<any>();
//   const id = body.id || makeId();
//   await c.env.DB
//     .prepare('INSERT INTO creative_pieces (id, title, content, type, language, dateWritten, status, orderIndex) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
//     .bind(id, body.title ?? '', body.content ?? '', body.type ?? '', body.language ?? '', body.dateWritten ?? '', body.status ?? 'draft', body.orderIndex ?? 0)
//     .run();
//   return c.json({ id, ...body });
// });

// app.get('/api/skills', async (c) => {
//   const { results } = await c.env.DB.prepare('SELECT * FROM skills ORDER BY orderIndex ASC').all();
//   return c.json(results.map((r: any) => ({
//     ...r,
//     skills: JSON.parse((r.skills_json as string) || '[]'),
//   })));
// });

// app.post('/api/skills', isAdmin, async (c) => {
//   const body = await c.req.json<any>();
//   const id = body.id || makeId();
//   await c.env.DB
//     .prepare('INSERT INTO skills (id, category, skills_json, orderIndex) VALUES (?, ?, ?, ?)')
//     .bind(id, body.category ?? '', JSON.stringify(body.skills ?? []), body.orderIndex ?? 0)
//     .run();
//   return c.json({ id, ...body });
// });

// app.get('/api/learning/topics', async (c) => {
//   const { results } = await c.env.DB.prepare('SELECT * FROM learning_topics ORDER BY title ASC').all();
//   return c.json(results);
// });

// app.get('/api/learning/lessons', async (c) => {
//   const { results } = await c.env.DB.prepare('SELECT * FROM lessons ORDER BY orderIndex ASC').all();
//   return c.json(results);
// });

// app.post('/api/contact', async (c) => {
//   const body = await c.req.json();
//   const id = crypto.randomUUID();
//   await c.env.DB.prepare('INSERT INTO messages (id, name, email, subject, message, createdAt) VALUES (?, ?, ?, ?, ?, ?)')
//     .bind(id, body.name, body.email, body.subject, body.message, new Date().toISOString())
//     .run();
//   return c.json({ success: true });
// });

// export default app;


import { Hono } from 'hono';
import { cors } from 'hono/cors';

/* ---------------- TYPES ---------------- */

interface D1Database {
  prepare: (sql: string) => D1PreparedStatement;
}

interface D1PreparedStatement {
  bind: (...values: any[]) => D1PreparedStatement;
  all: <T = any>() => Promise<{ results: T[] }>;
  first: <T = any>(colName?: string) => Promise<T>;
  run: () => Promise<{ success: boolean }>;
}

type Bindings = {
  DB: D1Database;
  JWT_SECRET: string;
  ADMIN_PASSWORD?: string;
  ADMIN_PASSWORD_LAYER2: string;
  ASSETS?: { fetch: (request: Request) => Promise<Response> };
};

/* ---------------- APP INIT ---------------- */

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', cors());

app.onError((err, c) => {
  console.error('Worker error:', err.message);
  return c.json({ success: false, error: err.message }, 500);
});

/* ---------------- SESSION LOGIC (D1) ---------------- */

const saveSession = async (db: D1Database, token: string, email: string) => {
  await db.prepare('INSERT OR REPLACE INTO sessions (token, email, expiresAt) VALUES (?, ?, ?)')
    .bind(token, email, Date.now() + 24 * 60 * 60 * 1000)
    .run();
};

const isAdmin = async (c: any, next: any) => {
  const authHeader = c.req.header('Authorization');
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    try {
      const session = await c.env.DB.prepare('SELECT * FROM sessions WHERE token = ? AND expiresAt > ?')
        .bind(token, Date.now())
        .first();
      if (session) {
        return next();
      } else {
        console.warn(`Admin access denied: Session not found or expired for token starting with ${token.substring(0, 4)}...`);
      }
    } catch (e: any) {
      console.error('Session check failed in D1:', e.message);
      // If the session table doesn't exist, we should probably know
      if (e.message.includes('no such table: sessions')) {
        return c.json({ message: 'Database setup incomplete: sessions table missing. please run schema.sql' }, 500);
      }
    }
  } else {
    console.warn('Admin access denied: No Authorization header provided');
  }
  return c.json({ message: 'Unauthorized' }, 401);
};

/* ---------------- ASSET / SPA MIDDLEWARE ---------------- */

app.use('*', async (c, next) => {
  if (c.req.path.startsWith('/api')) {
    return next();
  }

  const ASSETS = c.env.ASSETS;
  if (!ASSETS) {
    return next();
  }

  try {
    let response = await ASSETS.fetch(c.req.raw);

    if (response.status === 404) {
      const url = new URL(c.req.url);
      url.pathname = '/index.html';
      
      const spaRequest = new Request(url.toString(), {
        method: 'GET',
        headers: c.req.raw.headers,
      });
      
      response = await ASSETS.fetch(spaRequest);
    }

    return response;
  } catch (err) {
    console.error('ASSETS fetch error:', err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    return c.text(`Asset serving error: ${errorMessage}`, 500);
  }
});

const makeId = () => crypto.randomUUID();

/* ---------------- AUTH ---------------- */

app.post('/api/auth/google', async (c) => {
  const { idToken } = await c.req.json();
  void idToken;
  const email = 'pjha3913@gmail.com';
  const token = crypto.randomUUID();
  await saveSession(c.env.DB, token, email);
  return c.json({ success: true, email, token });
});

app.post('/api/login', async (c) => {
  const { email, password } = await c.req.json();
  const ADMIN_PASSWORD = c.env.ADMIN_PASSWORD_LAYER2 || c.env.ADMIN_PASSWORD || 'admin123';
  
  if (email === 'pjha3913@gmail.com' && password === ADMIN_PASSWORD) {
    const token = crypto.randomUUID();
    await saveSession(c.env.DB, token, email);
    return c.json({ success: true, token });
  }
  return c.json({ success: false, message: 'Invalid credentials' }, 401);
});

/* ---------------- API HANDLERS ---------------- */

app.get('/api/profile', async (c) => {
  const profile = await c.env.DB
    .prepare('SELECT * FROM profile WHERE id = ?')
    .bind('main')
    .first();
  return c.json(profile ?? { name: 'Prince Kumar Jha', role: 'Data & Tech Officer' });
});

app.post('/api/profile', isAdmin, async (c) => {
  const body = await c.req.json<any>();
  await c.env.DB
    .prepare('INSERT OR REPLACE INTO profile (id, name, role, bio, profileImage) VALUES ("main", ?, ?, ?, ?)')
    .bind(body.name ?? '', body.role ?? '', body.bio ?? '', body.profileImage ?? '')
    .run();
  return c.json(body);
});

app.get('/api/projects', async (c) => {
  const { results } = await c.env.DB
    .prepare('SELECT * FROM projects ORDER BY orderIndex ASC')
    .all();
  return c.json(results.map((r: any) => ({
    ...r,
    techStack: JSON.parse((r.techStack as string) || '[]'),
  })));
});

app.post('/api/projects', isAdmin, async (c) => {
  const body = await c.req.json<any>();
  const id = body.id || makeId();
  await c.env.DB
    .prepare('INSERT INTO projects (id, title, slug, description, fullDescription, techStack, featuredImage, imageUrl, projectType, demoUrl, repoUrl, link, github, featured, status, orderIndex, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(id, body.title ?? 'Untitled Project', body.slug ?? '', body.description ?? '', body.fullDescription ?? '', JSON.stringify(body.techStack ?? []), body.featuredImage ?? '', body.imageUrl ?? '', body.projectType ?? 'Full Project', body.demoUrl ?? '', body.repoUrl ?? '', body.link ?? '', body.github ?? '', body.featured ? 1 : 0, body.status ?? 'draft', body.orderIndex ?? 0, new Date().toISOString())
    .run();
  return c.json({ id, ...body });
});

app.put('/api/projects/:id', isAdmin, async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json<any>();
  await c.env.DB
    .prepare('UPDATE projects SET title=?, slug=?, description=?, fullDescription=?, techStack=?, featuredImage=?, imageUrl=?, projectType=?, demoUrl=?, repoUrl=?, link=?, github=?, featured=?, status=?, orderIndex=?, updatedAt=? WHERE id=?')
    .bind(body.title ?? 'Untitled Project', body.slug ?? '', body.description ?? '', body.fullDescription ?? '', JSON.stringify(body.techStack ?? []), body.featuredImage ?? '', body.imageUrl ?? '', body.projectType ?? 'Full Project', body.demoUrl ?? '', body.repoUrl ?? '', body.link ?? '', body.github ?? '', body.featured ? 1 : 0, body.status ?? 'draft', body.orderIndex ?? 0, new Date().toISOString(), id)
    .run();
  return c.json({ id, ...body });
});

app.delete('/api/projects/:id', isAdmin, async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM projects WHERE id = ?').bind(id).run();
  return c.json({ success: true });
});

app.get('/api/blog', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM blog_posts ORDER BY datePublished DESC').all();
  return c.json(results);
});

app.post('/api/blog', isAdmin, async (c) => {
  const body = await c.req.json<any>();
  const id = body.id || makeId();
  await c.env.DB
    .prepare('INSERT INTO blog_posts (id, title, slug, excerpt, content, featuredImage, category, tags, readTime, status, datePublished, publishDate, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(id, body.title ?? 'Untitled Post', body.slug ?? '', body.excerpt ?? '', body.content ?? '', body.featuredImage ?? '', body.category ?? '', JSON.stringify(body.tags ?? []), body.readTime ?? '', body.status ?? 'draft', body.datePublished ?? new Date().toISOString(), body.publishDate ?? '', new Date().toISOString())
    .run();
  return c.json({ id, ...body });
});

app.put('/api/blog/:id', isAdmin, async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json<any>();
  await c.env.DB
    .prepare('UPDATE blog_posts SET title=?, slug=?, excerpt=?, content=?, featuredImage=?, category=?, tags=?, readTime=?, status=?, datePublished=?, publishDate=?, updatedAt=? WHERE id=?')
    .bind(body.title ?? 'Untitled Post', body.slug ?? '', body.excerpt ?? '', body.content ?? '', body.featuredImage ?? '', body.category ?? '', JSON.stringify(body.tags ?? []), body.readTime ?? '', body.status ?? 'draft', body.datePublished ?? new Date().toISOString(), body.publishDate ?? '', new Date().toISOString(), id)
    .run();
  return c.json({ id, ...body });
});

app.delete('/api/blog/:id', isAdmin, async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM blog_posts WHERE id = ?').bind(id).run();
  return c.json({ success: true });
});

app.get('/api/experience', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM experiences ORDER BY orderIndex ASC').all();
  const experiences = await Promise.all(results.map(async (exp: any) => {
    const images = await c.env.DB.prepare('SELECT * FROM experience_images WHERE experience_id = ?').bind(exp.id).all();
    return { ...exp, images: images.results };
  }));
  return c.json(experiences);
});

app.post('/api/experience', isAdmin, async (c) => {
  const body = await c.req.json<any>();
  const id = body.id || makeId();
  await c.env.DB
    .prepare('INSERT INTO experiences (id, organization, role, tenure, description, orderIndex) VALUES (?, ?, ?, ?, ?, ?)')
    .bind(id, body.organization ?? '', body.role ?? '', body.tenure ?? '', body.description ?? '', body.orderIndex ?? 0)
    .run();
    
  // Handle associated images
  if (body.images && Array.isArray(body.images)) {
    for (const img of body.images) {
      await c.env.DB
        .prepare('INSERT INTO experience_images (id, experience_id, url, description) VALUES (?, ?, ?, ?)')
        .bind(makeId(), id, img.url, img.description ?? '')
        .run();
    }
  }
  
  return c.json({ id, ...body });
});

app.put('/api/experience/:id', isAdmin, async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json<any>();
  await c.env.DB
    .prepare('UPDATE experiences SET organization=?, role=?, tenure=?, description=?, orderIndex=? WHERE id=?')
    .bind(body.organization ?? '', body.role ?? '', body.tenure ?? '', body.description ?? '', body.orderIndex ?? 0, id)
    .run();
    
  // Sync images: simplest way is to delete and re-insert for the experience_id
  await c.env.DB.prepare('DELETE FROM experience_images WHERE experience_id = ?').bind(id).run();
  if (body.images && Array.isArray(body.images)) {
    for (const img of body.images) {
      await c.env.DB
        .prepare('INSERT INTO experience_images (id, experience_id, url, description) VALUES (?, ?, ?, ?)')
        .bind(makeId(), id, img.url, img.description ?? '')
        .run();
    }
  }
  
  return c.json({ id, ...body });
});

app.delete('/api/experience/:id', isAdmin, async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM experiences WHERE id = ?').bind(id).run();
  return c.json({ success: true });
});

app.get('/api/creative', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM creative_pieces ORDER BY orderIndex ASC').all();
  return c.json(results);
});

app.post('/api/creative', isAdmin, async (c) => {
  const body = await c.req.json<any>();
  const id = body.id || makeId();
  await c.env.DB
    .prepare('INSERT INTO creative_pieces (id, title, content, type, language, dateWritten, status, orderIndex) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(id, body.title ?? '', body.content ?? '', body.type ?? '', body.language ?? '', body.dateWritten ?? '', body.status ?? 'draft', body.orderIndex ?? 0)
    .run();
  return c.json({ id, ...body });
});

app.put('/api/creative/:id', isAdmin, async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json<any>();
  await c.env.DB
    .prepare('UPDATE creative_pieces SET title=?, content=?, type=?, language=?, dateWritten=?, status=?, orderIndex=? WHERE id=?')
    .bind(body.title ?? '', body.content ?? '', body.type ?? '', body.language ?? '', body.dateWritten ?? '', body.status ?? 'draft', body.orderIndex ?? 0, id)
    .run();
  return c.json({ id, ...body });
});

app.delete('/api/creative/:id', isAdmin, async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM creative_pieces WHERE id = ?').bind(id).run();
  return c.json({ success: true });
});

app.get('/api/skills', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM skills ORDER BY orderIndex ASC').all();
  return c.json(results.map((r: any) => ({
    ...r,
    skills: JSON.parse((r.skills_json as string) || '[]'),
  })));
});

app.post('/api/skills', isAdmin, async (c) => {
  const body = await c.req.json<any>();
  const id = body.id || makeId();
  await c.env.DB
    .prepare('INSERT INTO skills (id, category, skills_json, orderIndex) VALUES (?, ?, ?, ?)')
    .bind(id, body.category ?? '', JSON.stringify(body.skills ?? []), body.orderIndex ?? 0)
    .run();
  return c.json({ id, ...body });
});

app.put('/api/skills/:id', isAdmin, async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json<any>();
  await c.env.DB
    .prepare('UPDATE skills SET category=?, skills_json=?, orderIndex=? WHERE id=?')
    .bind(body.category ?? '', JSON.stringify(body.skills ?? []), body.orderIndex ?? 0, id)
    .run();
  return c.json({ id, ...body });
});

app.delete('/api/skills/:id', isAdmin, async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM skills WHERE id = ?').bind(id).run();
  return c.json({ success: true });
});

app.get('/api/learning/topics', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM learning_topics ORDER BY title ASC').all();
  return c.json(results);
});

app.post('/api/learning/topics', isAdmin, async (c) => {
  const body = await c.req.json<any>();
  const id = body.id || makeId();
  await c.env.DB
    .prepare('INSERT INTO learning_topics (id, title, slug, description, status) VALUES (?, ?, ?, ?, ?)')
    .bind(id, body.title ?? '', body.slug ?? '', body.description ?? '', body.status ?? 'draft')
    .run();
  return c.json({ id, ...body });
});

app.put('/api/learning/topics/:id', isAdmin, async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json<any>();
  await c.env.DB
    .prepare('UPDATE learning_topics SET title=?, slug=?, description=?, status=? WHERE id=?')
    .bind(body.title ?? '', body.slug ?? '', body.description ?? '', body.status ?? 'draft', id)
    .run();
  return c.json({ id, ...body });
});

app.delete('/api/learning/topics/:id', isAdmin, async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM learning_topics WHERE id = ?').bind(id).run();
  return c.json({ success: true });
});

app.get('/api/learning/lessons', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM lessons ORDER BY orderIndex ASC').all();
  return c.json(results);
});

app.post('/api/learning/lessons', isAdmin, async (c) => {
  const body = await c.req.json<any>();
  const id = body.id || makeId();
  const topicId = body.topic_id || body.topicId;
  await c.env.DB
    .prepare('INSERT INTO lessons (id, topic_id, title, slug, lessonNumber, content, readTime, status, orderIndex, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(id, topicId ?? '', body.title ?? '', body.slug ?? '', body.lessonNumber ?? 0, body.content ?? '', body.readTime ?? '', body.status ?? 'draft', body.orderIndex ?? 0, new Date().toISOString())
    .run();
  return c.json({ id, ...body });
});

app.put('/api/learning/lessons/:id', isAdmin, async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json<any>();
  const topicId = body.topic_id || body.topicId;
  await c.env.DB
    .prepare('UPDATE lessons SET topic_id=?, title=?, slug=?, lessonNumber=?, content=?, readTime=?, status=?, orderIndex=?, updatedAt=? WHERE id=?')
    .bind(topicId ?? '', body.title ?? '', body.slug ?? '', body.lessonNumber ?? 0, body.content ?? '', body.readTime ?? '', body.status ?? 'draft', body.orderIndex ?? 0, new Date().toISOString(), id)
    .run();
  return c.json({ id, ...body });
});

app.delete('/api/learning/lessons/:id', isAdmin, async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM lessons WHERE id = ?').bind(id).run();
  return c.json({ success: true });
});

app.post('/api/upload', isAdmin, async (c) => {
  return c.json({ 
    success: false, 
    message: 'Uploads are not supported on Workers without R2. Please use external URLs or configure R2.' 
  }, 501);
});

app.post('/api/contact', async (c) => {
  const body = await c.req.json();
  const id = crypto.randomUUID();
  await c.env.DB.prepare('INSERT INTO messages (id, name, email, subject, message, createdAt) VALUES (?, ?, ?, ?, ?, ?)')
    .bind(id, body.name, body.email, body.subject, body.message, new Date().toISOString())
    .run();
  return c.json({ success: true });
});

export default app;

