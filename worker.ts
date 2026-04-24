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
};

/* ---------------- APP INIT ---------------- */

const app = new Hono<{ Bindings: Bindings }>();
app.use('*', cors());

const makeId = () => crypto.randomUUID();

const safeJSON = (val: any, fallback: any = []) => {
  try {
    return JSON.parse(val || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
};

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
    .bind('main')
    .first();

  return c.json(profile ?? {});
});

app.post('/api/profile', async (c) => {
  const body = await c.req.json<any>();

  const exists = await c.env.DB
    .prepare('SELECT id FROM profile WHERE id = ?')
    .bind('main')
    .first();

  if (exists) {
    await c.env.DB.prepare(
      'UPDATE profile SET name=?, role=?, bio=?, profileImage=? WHERE id=?'
    )
      .bind(body.name ?? '', body.role ?? '', body.bio ?? '', body.profileImage ?? '', 'main')
      .run();
  } else {
    await c.env.DB.prepare(
      'INSERT INTO profile (id, name, role, bio, profileImage) VALUES (?, ?, ?, ?, ?)'
    )
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

  return c.json(results.map((r: any) => ({
    ...r,
    techStack: safeJSON(r.techStack),
  })));
});

app.post('/api/projects', async (c) => {
  const body = await c.req.json<any>();
  const id = body.id || makeId();

  await c.env.DB.prepare(
    `INSERT INTO projects 
    (id, title, description, fullDescription, techStack, imageUrl, link, github, orderIndex) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
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
      body.orderIndex ?? 0
    )
    .run();

  const created = await c.env.DB.prepare('SELECT * FROM projects WHERE id=?').bind(id).first<any>();

  return c.json({
    ...created,
    techStack: safeJSON(created?.techStack),
  });
});

/* ---------------- EXPERIENCE ---------------- */

app.get('/api/experience', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM experiences ORDER BY orderIndex ASC'
  ).all();

  const data = await Promise.all(
    results.map(async (exp: any) => {
      const images = await c.env.DB
        .prepare('SELECT id, url, description FROM experience_images WHERE experience_id=?')
        .bind(exp.id)
        .all();

      return { ...exp, images: images.results };
    })
  );

  return c.json(data);
});

/* ---------------- CREATIVE ---------------- */

app.get('/api/creative', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM creative_pieces ORDER BY orderIndex ASC'
  ).all();

  return c.json(results);
});

/* ---------------- SKILLS ---------------- */

app.get('/api/skills', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM skills ORDER BY orderIndex ASC'
  ).all();

  return c.json(results.map((r: any) => ({
    ...r,
    skills: safeJSON(r.skills_json),
  })));
});

/* ---------------- LEARNING ---------------- */

app.get('/api/topics', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM learning_topics ORDER BY title ASC'
  ).all();

  return c.json(results);
});

app.get('/api/lessons', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM lessons ORDER BY orderIndex ASC'
  ).all();

  return c.json(results.map((r: any) => ({
    ...r,
    topicId: r.topic_id,
    lessonNumber: r.orderIndex,
  })));
});

/* ---------------- COMPATIBILITY ---------------- */

app.get('/api/learning/topics', (c) => c.redirect('/api/topics'));
app.get('/api/learning/lessons', (c) => c.redirect('/api/lessons'));

/* ---------------- UPLOAD ---------------- */

app.post('/api/upload', async (c) => {
  return c.json(
    { message: 'Use hosted image URLs (Cloudflare Workers has no local storage).' },
    501
  );
});

/* ---------------- CONTACT ---------------- */

app.post('/api/contact', async (c) => {
  const body = await c.req.json();
  void body;

  return c.json({ success: true });
});

/* ---------------- EXPORT ---------------- */

export default app;