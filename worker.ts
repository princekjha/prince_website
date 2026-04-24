// import { Hono } from 'hono';
// import { cors } from 'hono/cors';
// import { sign } from 'hono/jwt';

// interface D1Database {
//   prepare: (sql: string) => D1PreparedStatement;
// }

// interface D1PreparedStatement {
//   bind: (...values: any[]) => D1PreparedStatement;
//   all: <T = any>() => Promise<{ results: T[] }>;
//   first: <T = any>(colName?: string) => Promise<T>;
// }

// type Bindings = {
//   DB: D1Database;
//   JWT_SECRET: string;
//   ADMIN_PASSWORD_LAYER2: string;
// };

// const app = new Hono<{ Bindings: Bindings }>();

// app.use('*', cors());

// // Auth Routes
// app.post('/api/auth/google', async (c) => {
//   const { idToken } = await c.req.json();
//   // In a real worker, you'd verify the token with Google's library or public keys
//   // For this adaptation, we assume verification and check the email
//   const payload = { email: "pjha3913@gmail.com" }; // Mocked for demo
  
//   if (payload.email === "pjha3913@gmail.com") {
//     return c.json({ success: true, email: payload.email });
//   }
//   return c.json({ success: false }, 401);
// });

// app.post('/api/login', async (c) => {
//   const { password, email } = await c.req.json();
//   if (email === "pjha3913@gmail.com" && password === c.env.ADMIN_PASSWORD_LAYER2) {
//     const token = await sign({ email, role: 'admin' }, c.env.JWT_SECRET);
//     return c.json({ success: true, token });
//   }
//   return c.json({ success: false }, 401);
// });

// // Profile
// app.get('/api/profile', async (c) => {
//   const profile = await c.env.DB.prepare('SELECT * FROM profile WHERE id = "main"').first();
//   return c.json(profile);
// });

// // Projects
// app.get('/api/projects', async (c) => {
//   const { results } = await c.env.DB.prepare('SELECT * FROM projects ORDER BY orderIndex ASC').all();
//   return c.json(results.map(r => ({ ...r, techStack: JSON.parse(r.techStack as string || '[]') })));
// });

// // Experience
// app.get('/api/experience', async (c) => {
//   const { results } = await c.env.DB.prepare('SELECT * FROM experiences ORDER BY orderIndex ASC').all();
//   const experiences = await Promise.all(results.map(async (exp: any) => {
//     const images = await c.env.DB.prepare('SELECT * FROM experience_images WHERE experience_id = ?').bind(exp.id).all();
//     return { ...exp, images: images.results };
//   }));
//   return c.json(experiences);
// });

// // Verses/Creative
// app.get('/api/creative', async (c) => {
//   const { results } = await c.env.DB.prepare('SELECT * FROM creative_pieces ORDER BY orderIndex ASC').all();
//   return c.json(results);
// });

// // Skills
// app.get('/api/skills', async (c) => {
//   const { results } = await c.env.DB.prepare('SELECT * FROM skills ORDER BY orderIndex ASC').all();
//   return c.json(results.map(r => ({ ...r, skills: JSON.parse(r.skills_json as string || '[]') })));
// });

// // Learning Topics & Lessons
// app.get('/api/learning/topics', async (c) => {
//   const { results } = await c.env.DB.prepare('SELECT * FROM learning_topics').all();
//   return c.json(results);
// });

// app.get('/api/learning/lessons', async (c) => {
//   const { results } = await c.env.DB.prepare('SELECT * FROM lessons ORDER BY orderIndex ASC').all();
//   return c.json(results);
// });

// // Contact Form (Workers would use MailChannels or SMTP service)
// app.post('/api/contact', async (c) => {
//   const body = await c.req.json();
//   // Logic for sending email via MailChannels or Resend
//   return c.json({ success: true });
// });

// export default app;
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { sign } from 'hono/jwt';

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
  ADMIN_PASSWORD_LAYER2: string;
  ASSETS: { fetch: (request: Request) => Promise<Response> };
};

/* ---------------- APP INIT ---------------- */

const app = new Hono<{ Bindings: Bindings }>();
app.use('*', cors());
app.onError((err, c) => {
  return c.json({ success: false, error: err.message }, 500);
});

app.use('*', async (c, next) => {
  if (c.req.path.startsWith('/api')) {
    return next();
  }
  return c.env.ASSETS.fetch(c.req.raw);
});

const makeId = () => crypto.randomUUID();

// const safeJSON = (val: any, fallback: any = []) => {
//   try {
//     return JSON.parse(val || JSON.stringify(fallback));
//   } catch {
//     return fallback;
//   }
// };

/* ---------------- AUTH ---------------- */

app.post('/api/auth/google', async (c) => {
  const { idToken } = await c.req.json();
  void idToken;

  const payload = { email: 'pjha3913@gmail.com' };

  if (payload.email === 'pjha3913@gmail.com') {
    return c.json({ success: true, email: payload.email });
  }

  return c.json({ success: false }, 401);
});

app.post('/api/login', async (c) => {
  const { email, password } = await c.req.json();

  if (email === 'pjha3913@gmail.com' && password === c.env.ADMIN_PASSWORD_LAYER2) {
    const token = await sign({ email, role: 'admin' }, c.env.JWT_SECRET);
    return c.json({ success: true, token });
  }

  return c.json({ success: false }, 401);
});

/* ---------------- PROFILE ---------------- */

app.get('/api/profile', async (c) => {
  const profile = await c.env.DB
    .prepare('SELECT * FROM profile WHERE id = ?')
    .bind('main').first();

  return c.json(profile ?? {});
});

app.post('/api/profile', async (c) => {
  const body = await c.req.json<any>();
  const existing = await c.env.DB.prepare('SELECT id FROM profile WHERE id = ?').bind('main').first();

  if (existing) {
    await c.env.DB.prepare('UPDATE profile SET name = ?, role = ?, bio = ?, profileImage = ? WHERE id = ?')
      .bind(body.name ?? '', body.role ?? '', body.bio ?? '', body.profileImage ?? '', 'main')
      .run();
  } else {
    await c.env.DB.prepare('INSERT INTO profile (id, name, role, bio, profileImage) VALUES (?, ?, ?, ?, ?)')
      .bind('main', body.name ?? '', body.role ?? '', body.bio ?? '', body.profileImage ?? '')
      .run();
  }

  const updated = await c.env.DB.prepare('SELECT * FROM profile WHERE id = ?').bind('main').first();
  return c.json(updated);
});

/* ---------------- PROJECTS ---------------- */

app.get('/api/projects', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM projects ORDER BY orderIndex ASC'
  ).all();

  return c.json(results.map((r: any) => ({ ...r, techStack: JSON.parse((r.techStack as string) || '[]') })));
});

app.post('/api/projects', async (c) => {
  const body = await c.req.json<any>();
  const id = body.id || makeId();
  await c.env.DB.prepare(
    'INSERT INTO projects (id, title, description, fullDescription, techStack, imageUrl, link, github, orderIndex) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  )
    .bind(
      id,
      body.title ?? 'Untitled Project',
      body.description ?? '',
      body.fullDescription ?? '',
      JSON.stringify(body.techStack ?? []),
      body.imageUrl ?? '',
      body.link ?? '',
      body.github ?? '',
      body.orderIndex ?? 0,
    )
    .run();

  const created = await c.env.DB.prepare('SELECT * FROM projects WHERE id = ?').bind(id).first<any>();
  return c.json({ ...created, techStack: JSON.parse((created?.techStack as string) || '[]') });
});

app.put('/api/projects/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json<any>();
  await c.env.DB.prepare(
    'UPDATE projects SET title=?, description=?, fullDescription=?, techStack=?, imageUrl=?, link=?, github=?, orderIndex=? WHERE id=?'
  )
    .bind(
      body.title ?? 'Untitled Project',
      body.description ?? '',
      body.fullDescription ?? '',
      JSON.stringify(body.techStack ?? []),
      body.imageUrl ?? '',
      body.link ?? '',
      body.github ?? '',
      body.orderIndex ?? 0,
      id,
    )
    .run();

  const updated = await c.env.DB.prepare('SELECT * FROM projects WHERE id = ?').bind(id).first<any>();
  return c.json({ ...updated, techStack: JSON.parse((updated?.techStack as string) || '[]') });
});

app.delete('/api/projects/:id', async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM projects WHERE id = ?').bind(id).run();
  return c.json({ success: true });
});

// Blog /* ---------------- Blog ---------------- */

app.get('/api/blog', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM blog_posts ORDER BY datePublished DESC').all();
  return c.json(results);
});

app.post('/api/blog', async (c) => {
  const body = await c.req.json<any>();
  const id = body.id || makeId();
  await c.env.DB.prepare(
    'INSERT INTO blog_posts (id, title, excerpt, content, category, readTime, status, datePublished) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  )
    .bind(
      id,
      body.title ?? 'Untitled Post',
      body.excerpt ?? '',
      body.content ?? '',
      body.category ?? '',
      body.readTime ?? '',
      body.status ?? 'draft',
      body.datePublished ?? new Date().toISOString(),
    )
    .run();

  const created = await c.env.DB.prepare('SELECT * FROM blog_posts WHERE id = ?').bind(id).first();
  return c.json(created);
});

app.put('/api/blog/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json<any>();
  await c.env.DB.prepare(
    'UPDATE blog_posts SET title=?, excerpt=?, content=?, category=?, readTime=?, status=?, datePublished=? WHERE id=?'
  )
    .bind(
      body.title ?? 'Untitled Post',
      body.excerpt ?? '',
      body.content ?? '',
      body.category ?? '',
      body.readTime ?? '',
      body.status ?? 'draft',
      body.datePublished ?? new Date().toISOString(),
      id,
    )
    .run();

  const updated = await c.env.DB.prepare('SELECT * FROM blog_posts WHERE id = ?').bind(id).first();
  return c.json(updated);
});

app.delete('/api/blog/:id', async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM blog_posts WHERE id = ?').bind(id).run();
  return c.json({ success: true });
});

/* ---------------- EXPERIENCE ---------------- */

app.get('/api/experience', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM experiences ORDER BY orderIndex ASC'
  ).all();

const experiences = await Promise.all(
    results.map(async (exp: any) => {
      const images = await c.env.DB.prepare('SELECT id, url, description FROM experience_images WHERE experience_id = ?').bind(exp.id).all();
      return { ...exp, images: images.results };
    }),
  );
  return c.json(experiences);
});

app.post('/api/experience', async (c) => {
  const body = await c.req.json<any>();
  const id = body.id || makeId();
  await c.env.DB.prepare(
    'INSERT INTO experiences (id, organization, role, tenure, description, orderIndex) VALUES (?, ?, ?, ?, ?, ?)'
  )
    .bind(id, body.organization ?? 'New Organization', body.role ?? 'Role Name', body.tenure ?? '', body.description ?? '', body.orderIndex ?? 0)
    .run();

  const images = Array.isArray(body.images) ? body.images : [];
  for (const img of images) {
    await c.env.DB.prepare('INSERT INTO experience_images (id, experience_id, url, description) VALUES (?, ?, ?, ?)')
      .bind(makeId(), id, img.url ?? '', img.description ?? '')
      .run();
  }

  const created = await c.env.DB.prepare('SELECT * FROM experiences WHERE id = ?').bind(id).first<any>();
  return c.json({ ...created, images });
});

app.put('/api/experience/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json<any>();
  await c.env.DB.prepare('UPDATE experiences SET organization=?, role=?, tenure=?, description=?, orderIndex=? WHERE id=?')
    .bind(body.organization ?? 'New Organization', body.role ?? 'Role Name', body.tenure ?? '', body.description ?? '', body.orderIndex ?? 0, id)
    .run();

  await c.env.DB.prepare('DELETE FROM experience_images WHERE experience_id = ?').bind(id).run();
  const images = Array.isArray(body.images) ? body.images : [];
  for (const img of images) {
    await c.env.DB.prepare('INSERT INTO experience_images (id, experience_id, url, description) VALUES (?, ?, ?, ?)')
      .bind(makeId(), id, img.url ?? '', img.description ?? '')
      .run();
  }

  const updated = await c.env.DB.prepare('SELECT * FROM experiences WHERE id = ?').bind(id).first<any>();
  return c.json({ ...updated, images });
});

app.delete('/api/experience/:id', async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM experiences WHERE id = ?').bind(id).run();
  return c.json({ success: true });
});


/* ---------------- CREATIVE ---------------- */

app.get('/api/creative', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM creative_pieces ORDER BY orderIndex ASC'
  ).all();

  return c.json(results);
});

app.post('/api/creative', async (c) => {
  const body = await c.req.json<any>();
  const id = body.id || makeId();
  await c.env.DB.prepare(
    'INSERT INTO creative_pieces (id, title, content, type, language, dateWritten, status, orderIndex) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  )
    .bind(
      id,
      body.title ?? 'Untitled Piece',
      body.content ?? '',
      body.type ?? '',
      body.language ?? '',
      body.dateWritten ?? new Date().toISOString().slice(0, 10),
      body.status ?? 'draft',
      body.orderIndex ?? 0,
    )
    .run();

  const created = await c.env.DB.prepare('SELECT * FROM creative_pieces WHERE id = ?').bind(id).first();
  return c.json(created);
});

app.put('/api/creative/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json<any>();
  await c.env.DB.prepare(
    'UPDATE creative_pieces SET title=?, content=?, type=?, language=?, dateWritten=?, status=?, orderIndex=? WHERE id=?'
  )
    .bind(
      body.title ?? 'Untitled Piece',
      body.content ?? '',
      body.type ?? '',
      body.language ?? '',
      body.dateWritten ?? new Date().toISOString().slice(0, 10),
      body.status ?? 'draft',
      body.orderIndex ?? 0,
      id,
    )
    .run();

  const updated = await c.env.DB.prepare('SELECT * FROM creative_pieces WHERE id = ?').bind(id).first();
  return c.json(updated);
});

app.delete('/api/creative/:id', async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM creative_pieces WHERE id = ?').bind(id).run();
  return c.json({ success: true });
});



/* ---------------- SKILLS ---------------- */

app.get('/api/skills', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM skills ORDER BY orderIndex ASC'
  ).all();

  return c.json(results.map((r: any) => ({ ...r, skills: JSON.parse((r.skills_json as string) || '[]') })));
});

app.post('/api/skills', async (c) => {
  const body = await c.req.json<any>();
  const id = body.id || makeId();
  await c.env.DB.prepare('INSERT INTO skills (id, category, skills_json, orderIndex) VALUES (?, ?, ?, ?)')
    .bind(id, body.category ?? 'New Category', JSON.stringify(body.skills ?? []), body.orderIndex ?? 0)
    .run();

  const created = await c.env.DB.prepare('SELECT * FROM skills WHERE id = ?').bind(id).first<any>();
  return c.json({ ...created, skills: JSON.parse((created?.skills_json as string) || '[]') });
});

app.put('/api/skills/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json<any>();
  await c.env.DB.prepare('UPDATE skills SET category=?, skills_json=?, orderIndex=? WHERE id=?')
    .bind(body.category ?? 'New Category', JSON.stringify(body.skills ?? []), body.orderIndex ?? 0, id)
    .run();

  const updated = await c.env.DB.prepare('SELECT * FROM skills WHERE id = ?').bind(id).first<any>();
  return c.json({ ...updated, skills: JSON.parse((updated?.skills_json as string) || '[]') });
});

app.delete('/api/skills/:id', async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM skills WHERE id = ?').bind(id).run();
  return c.json({ success: true });
});

/* ---------------- LEARNING ---------------- */

app.get('/api/topics', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM learning_topics ORDER BY title ASC').all();
  return c.json(results);
});

app.post('/api/topics', async (c) => {
  const body = await c.req.json<any>();
  const id = body.id || makeId();
  await c.env.DB.prepare('INSERT INTO learning_topics (id, title, slug, description, status) VALUES (?, ?, ?, ?, ?)')
    .bind(id, body.title ?? 'New Topic', body.slug ?? `topic-${id}`, body.description ?? '', body.status ?? 'draft')
    .run();

  const created = await c.env.DB.prepare('SELECT * FROM learning_topics WHERE id = ?').bind(id).first();
  return c.json(created);
});

app.put('/api/topics/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json<any>();
  await c.env.DB.prepare('UPDATE learning_topics SET title=?, slug=?, description=?, status=? WHERE id=?')
    .bind(body.title ?? 'New Topic', body.slug ?? `topic-${id}`, body.description ?? '', body.status ?? 'draft', id)
    .run();

  const updated = await c.env.DB.prepare('SELECT * FROM learning_topics WHERE id = ?').bind(id).first();
  return c.json(updated);
});

app.delete('/api/topics/:id', async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM learning_topics WHERE id = ?').bind(id).run();
  return c.json({ success: true });
});

// Lessons
app.get('/api/lessons', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM lessons ORDER BY orderIndex ASC').all();
  return c.json(
    results.map((row: any) => ({
      ...row,
      topicId: row.topic_id,
      lessonNumber: row.orderIndex,
    })),
  );
});

app.post('/api/lessons', async (c) => {
  const body = await c.req.json<any>();
  const id = body.id || makeId();
  const topicId = body.topicId ?? body.topic_id ?? null;
  const lessonNumber = body.lessonNumber ?? body.orderIndex ?? 0;

  await c.env.DB.prepare(
    'INSERT INTO lessons (id, topic_id, title, slug, content, readTime, status, orderIndex) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  )
    .bind(id, topicId, body.title ?? 'New Lesson', body.slug ?? `lesson-${id}`, body.content ?? '', body.readTime ?? '10 min', body.status ?? 'draft', lessonNumber)
    .run();

  const created = await c.env.DB.prepare('SELECT * FROM lessons WHERE id = ?').bind(id).first<any>();
  return c.json({ ...created, topicId: created?.topic_id, lessonNumber: created?.orderIndex ?? 0 });
});

app.put('/api/lessons/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json<any>();
  const topicId = body.topicId ?? body.topic_id ?? null;
  const lessonNumber = body.lessonNumber ?? body.orderIndex ?? 0;

  await c.env.DB.prepare('UPDATE lessons SET topic_id=?, title=?, slug=?, content=?, readTime=?, status=?, orderIndex=? WHERE id=?')
    .bind(topicId, body.title ?? 'New Lesson', body.slug ?? `lesson-${id}`, body.content ?? '', body.readTime ?? '10 min', body.status ?? 'draft', lessonNumber, id)
    .run();

  const updated = await c.env.DB.prepare('SELECT * FROM lessons WHERE id = ?').bind(id).first<any>();
  return c.json({ ...updated, topicId: updated?.topic_id, lessonNumber: updated?.orderIndex ?? 0 });
});

app.delete('/api/lessons/:id', async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM lessons WHERE id = ?').bind(id).run();
  return c.json({ success: true });
});


/* ---------------- COMPATIBILITY aliases ---------------- */

app.get('/api/learning/topics', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM learning_topics ORDER BY title ASC').all();
  return c.json(results);
});

app.get('/api/learning/lessons', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM lessons ORDER BY orderIndex ASC').all();
  return c.json(results.map((row: any) => ({ ...row, topicId: row.topic_id, lessonNumber: row.orderIndex })));
});

/* ---------------- Upload placeholder for Workers runtime (no local disk uploads)---------------- */

app.post('/api/upload', async (c) => {
  return c.json({ message: 'Upload is not configured in Cloudflare Worker. Use hosted image URLs.' }, 501);
});

app.post('/api/contact', async (c) => {
  const body = await c.req.json();
  void body;
  return c.json({ success: true });
});


// /* ---------------- CONTACT ---------------- */

// app.post('/api/contact', async (c) => {
//   const body = await c.req.json();
//   void body;

//   return c.json({ success: true });
// });

/* ---------------- EXPORT ---------------- */

export default app;