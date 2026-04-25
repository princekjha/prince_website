// import express from 'express';
// import { createServer as createViteServer } from 'vite';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import fs from 'fs/promises';
// import dotenv from 'dotenv';
// import { OAuth2Client } from 'google-auth-library';
// import nodemailer from 'nodemailer';

// dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const DATA_DIR = path.join(__dirname, 'data');

// const GOOGLE_CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID;
// const ADMIN_EMAIL_WHITELIST = ['pjha3913@gmail.com']; // From metadata
// const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// async function ensureDirs() {
//   try { await fs.access(DATA_DIR); } catch { await fs.mkdir(DATA_DIR); }
//   const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');
//   try { await fs.access(SESSIONS_FILE); } catch { await fs.writeFile(SESSIONS_FILE, '[]', 'utf-8'); }
// }

// async function readData(filename: string) {
//   const filePath = path.join(DATA_DIR, filename);
//   try {
//     const data = await fs.readFile(filePath, 'utf-8');
//     if (!data || data.trim() === '') return [];
//     return JSON.parse(data);
//   } catch (error) {
//     if ((error as any).code === 'ENOENT') return [];
//     console.error(`Error reading ${filename}:`, error);
//     throw error;
//   }
// }

// async function writeData(filename: string, data: any) {
//   const filePath = path.join(DATA_DIR, filename);
//   const tempPath = `${filePath}.tmp`;
//   const content = JSON.stringify(data, null, 2);
//   await fs.writeFile(tempPath, content, 'utf-8');
//   await fs.rename(tempPath, filePath);
// }

// // Mailer Setup
// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST || 'smtp.gmail.com',
//   port: parseInt(process.env.SMTP_PORT || '587'),
//   secure: process.env.SMTP_SECURE === 'true',
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

// async function startServer() {
//   const app = express();
//   const PORT = 3000;

//   await ensureDirs();

//   app.use(express.json());

//   // Admin Session Store
//   const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');
  
//   const getSessions = async () => {
//     try {
//       const data = await fs.readFile(SESSIONS_FILE, 'utf-8');
//       if (!data || data.trim() === '') return new Set<string>();
//       const parsed = JSON.parse(data);
//       return new Set<string>(Array.isArray(parsed) ? parsed : []);
//     } catch (err) {
//       console.error('Error reading sessions:', err);
//       return new Set<string>();
//     }
//   };

//   const saveSession = async (token: string) => {
//     try {
//       const sessions = await getSessions();
//       sessions.add(token);
//       await fs.writeFile(SESSIONS_FILE, JSON.stringify([...sessions]), 'utf-8');
//     } catch (err) {
//       console.error('Error saving session:', err);
//     }
//   };

//   const isAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//       console.warn(`Admin access denied: No Authorization header for ${req.method} ${req.path}`);
//       return res.status(401).json({ message: 'Authorization header missing' });
//     }

//     const token = authHeader.replace(/^Bearer /i, '').trim();
//     if (!token) {
//       console.warn(`Admin access denied: Empty token for ${req.method} ${req.path}`);
//       return res.status(401).json({ message: 'Token missing' });
//     }

//     const sessions = await getSessions();
//     if (sessions.has(token)) {
//       return next();
//     }

//     console.warn(`Admin access denied: Token not found in active sessions for ${req.method} ${req.path}`);
//     res.status(401).json({ message: 'Session expired or invalid - Please log in again' });
//   };

//   app.post('/api/auth/google', async (req, res) => {
//     const { idToken } = req.body;
//     try {
//       const ticket = await client.verifyIdToken({
//         idToken,
//         audience: GOOGLE_CLIENT_ID,
//       });
//       const payload = ticket.getPayload();
//       if (payload && ADMIN_EMAIL_WHITELIST.includes(payload.email || '')) {
//         const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
//         await saveSession(token);
//         res.json({ success: true, email: payload.email, token });
//       } else {
//         res.status(403).json({ message: 'Email not whitelisted' });
//       }
//     } catch (error) {
//       res.status(400).json({ message: 'Invalid Google Token' });
//     }
//   });

//   app.post('/api/login', async (req, res) => {
//     const { password, email } = req.body;
//     const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Prince@1234@';
    
//     if (password === ADMIN_PASSWORD && ADMIN_EMAIL_WHITELIST.includes(email)) {
//       const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
//       await saveSession(token);
//       console.log(`Successfully logged in: ${email}, Session created.`);
//       res.json({ success: true, token });
//     } else {
//       console.warn(`Login failed for ${email}. Password match: ${password === ADMIN_PASSWORD}`);
//       res.status(401).json({ success: false, message: 'Invalid password or verification failed' });
//     }
//   });



//   const setupCRUD = (entity: string, filename: string) => {
//     app.get(`/api/${entity}`, async (req, res) => {
//       const data = await readData(filename);
//       res.json(data);
//     });

//     app.post(`/api/${entity}`, isAdmin, async (req, res) => {
//       const data = await readData(filename);
//       const newItem = { ...req.body, id: Date.now().toString() + Math.random().toString(36).substr(2, 5), createdAt: new Date().toISOString() };
//       data.push(newItem);
//       await writeData(filename, data);
//       res.json(newItem);
//     });

//     app.put(`/api/${entity}/:id`, isAdmin, async (req, res) => {
//       let data = await readData(filename);
//       const index = data.findIndex((item: any) => item.id === req.params.id);
//       if (index !== -1) {
//         data[index] = { ...data[index], ...req.body, updatedAt: new Date().toISOString() };
//         await writeData(filename, data);
//         res.json(data[index]);
//       } else {
//         res.status(404).json({ message: 'Not found' });
//       }
//     });

//     app.delete(`/api/${entity}/:id`, isAdmin, async (req, res) => {
//       let data = await readData(filename);
//       data = data.filter((item: any) => item.id !== req.params.id);
//       await writeData(filename, data);
//       res.json({ success: true });
//     });
//   };

//   // Add error handling for multer and other routes
//   app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
//     console.error('Server Error:', err);
//     res.status(err.status || 500).json({ 
//       message: err.message || 'Internal Server Error',
//       error: process.env.NODE_ENV === 'development' ? err : undefined
//     });
//   });

//   setupCRUD('projects', 'projects.json');
//   setupCRUD('blog', 'blog.json');
//   setupCRUD('creative', 'creative.json');
//   setupCRUD('learning/topics', 'topics.json');
//   setupCRUD('learning/lessons', 'lessons.json');
//   setupCRUD('experience', 'experience.json');
//   setupCRUD('skills', 'skills.json');

//   app.get('/api/profile', async (req, res) => {
//     const data = await readData('profile.json');
//     res.json(data && !Array.isArray(data) ? data : {
//       name: 'Prince Kumar Jha',
//       role: 'Data & Tech Officer',
//       bio: 'Architecting data pipelines, automation systems, and AI-driven solutions to solve complex business challenges.',
//       profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400'
//     });
//   });

//   app.post('/api/profile', isAdmin, async (req, res) => {
//     await writeData('profile.json', req.body);
//     res.json(req.body);
//   });

//   app.post('/api/contact', async (req, res) => {
//     const { name, email, subject, message } = req.body;
    
//     // Store in JSON for persistence
//     const messages = await readData('messages.json');
//     messages.push({ ...req.body, id: Date.now().toString(), date: new Date().toISOString() });
//     await writeData('messages.json', messages);

//     // Send Email if configured
//     if (process.env.SMTP_USER) {
//       try {
//         await transporter.sendMail({
//           from: `"Portfolio" <${process.env.SMTP_USER}>`,
//           to: 'pjha3913@gmail.com',
//           subject: `New Portfolio Message: ${subject}`,
//           html: `
//             <div style="font-family: serif; padding: 20px; color: #1a1a2e; border: 1px solid #e67e22;">
//               <h2 style="color: #e67e22;">New Transmission</h2>
//               <p><strong>Sender:</strong> ${name} (${email})</p>
//               <p><strong>Subject:</strong> ${subject}</p>
//               <div style="background: #fdf2e9; padding: 15px; border-radius: 10px; margin-top: 20px;">
//                 ${message.replace(/\n/g, '<br>')}
//               </div>
//             </div>
//           `,
//         });

//         await transporter.sendMail({
//           from: `"Prince Kumar Jha" <${process.env.SMTP_USER}>`,
//           to: email,
//           subject: 'Confirmation: Your message was received',
//           html: `
//             <div style="font-family: serif; padding: 20px; color: #1a1a2e;">
//               <h2 style="color: #e67e22;">Hello ${name},</h2>
//               <p>Thank you for reaching out. I've received your message regarding "<strong>${subject}</strong>".</p>
//               <p>I aim to respond to thoughtful inquiries within 48 hours. In the meantime, feel free to explore my latest data reflections on the site.</p>
//               <p>Best regards,<br>Prince Kumar Jha</p>
//             </div>
//           `,
//         });
//       } catch (mailError) {
//         console.error('Email failed:', mailError);
//       }
//     }

//     res.json({ success: true });
//   });

//   if (process.env.NODE_ENV !== 'production') {
//     const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
//     app.use(vite.middlewares);
    
//     // Explicit SPA fallback for development to avoid 404s on browser refresh
//     app.use('*', async (req, res, next) => {
//       const url = req.originalUrl;
//       if (url.startsWith('/api') || url.includes('.')) {
//         return next();
//       }
//       try {
//         let template = await fs.readFile(path.resolve(__dirname, 'index.html'), 'utf-8');
//         template = await vite.transformIndexHtml(url, template);
//         res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
//       } catch (e) {
//         next(e);
//       }
//     });
//   } else {
//     const distPath = path.join(__dirname, 'dist');
//     app.use(express.static(distPath));
//     app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
//   }

//   app.listen(PORT, '0.0.0.0', () => {
//     console.log(`Server running on http://localhost:${PORT}`);
//   });
// }

// startServer();


import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';
import nodemailer from 'nodemailer';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');

const GOOGLE_CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID;
const ADMIN_EMAIL_WHITELIST = ['pjha3913@gmail.com']; // From metadata
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

async function ensureDirs() {
  try { await fs.access(DATA_DIR); } catch { await fs.mkdir(DATA_DIR); }
  const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');
  try { await fs.access(SESSIONS_FILE); } catch { await fs.writeFile(SESSIONS_FILE, '[]', 'utf-8'); }
}

async function readData(filename: string) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    if (!data || data.trim() === '') return [];
    return JSON.parse(data);
  } catch (error) {
    if ((error as any).code === 'ENOENT') return [];
    console.error(`Error reading ${filename}:`, error);
    throw error;
  }
}

async function writeData(filename: string, data: any) {
  const filePath = path.join(DATA_DIR, filename);
  const tempPath = `${filePath}.tmp`;
  const content = JSON.stringify(data, null, 2);
  await fs.writeFile(tempPath, content, 'utf-8');
  await fs.rename(tempPath, filePath);
}

// Mailer Setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  await ensureDirs();

  app.use(express.json());

  // Admin Session Store
  const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');
  
  const getSessions = async () => {
    try {
      const data = await fs.readFile(SESSIONS_FILE, 'utf-8');
      if (!data || data.trim() === '') return new Set<string>();
      const parsed = JSON.parse(data);
      return new Set<string>(Array.isArray(parsed) ? parsed : []);
    } catch (err) {
      console.error('Error reading sessions:', err);
      return new Set<string>();
    }
  };

  const saveSession = async (token: string) => {
    try {
      const sessions = await getSessions();
      sessions.add(token);
      await fs.writeFile(SESSIONS_FILE, JSON.stringify([...sessions]), 'utf-8');
    } catch (err) {
      console.error('Error saving session:', err);
    }
  };

  const isAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.warn(`Admin access denied: No Authorization header for ${req.method} ${req.path}`);
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.replace(/^Bearer /i, '').trim();
    if (!token) {
      console.warn(`Admin access denied: Empty token for ${req.method} ${req.path}`);
      return res.status(401).json({ message: 'Token missing' });
    }

    const sessions = await getSessions();
    if (sessions.has(token)) {
      return next();
    }

    console.warn(`Admin access denied: Token not found in active sessions for ${req.method} ${req.path}`);
    res.status(401).json({ message: 'Session expired or invalid - Please log in again' });
  };

  app.post('/api/auth/google', async (req, res) => {
    const { idToken } = req.body;
    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (payload && ADMIN_EMAIL_WHITELIST.includes(payload.email || '')) {
        const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
        await saveSession(token);
        res.json({ success: true, email: payload.email, token });
      } else {
        res.status(403).json({ message: 'Email not whitelisted' });
      }
    } catch (error) {
      res.status(400).json({ message: 'Invalid Google Token' });
    }
  });

  app.post('/api/login', async (req, res) => {
    const { password, email } = req.body;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Prince@1234@';
    
    if (password === ADMIN_PASSWORD && ADMIN_EMAIL_WHITELIST.includes(email)) {
      const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
      await saveSession(token);
      console.log(`Successfully logged in: ${email}, Session created.`);
      res.json({ success: true, token });
    } else {
      console.warn(`Login failed for ${email}. Password match: ${password === ADMIN_PASSWORD}`);
      res.status(401).json({ success: false, message: 'Invalid password or verification failed' });
    }
  });



  const setupCRUD = (entity: string, filename: string) => {
    const route = `/api/${entity}`;
    
    app.get(route, async (req, res, next) => {
      try {
        const data = await readData(filename);
        res.json(data);
      } catch (err) {
        next(err);
      }
    });

    app.post(route, isAdmin, async (req, res, next) => {
      try {
        const data = await readData(filename);
        const newItem = { 
          ...req.body, 
          id: Date.now().toString() + Math.random().toString(36).substr(2, 5), 
          createdAt: new Date().toISOString() 
        };
        data.push(newItem);
        await writeData(filename, data);
        res.json(newItem);
      } catch (err) {
        console.error(`Error in POST ${route}:`, err);
        next(err);
      }
    });

    app.put(`${route}/:id`, isAdmin, async (req, res, next) => {
      try {
        let data = await readData(filename);
        const index = data.findIndex((item: any) => item.id === req.params.id);
        if (index !== -1) {
          data[index] = { ...data[index], ...req.body, updatedAt: new Date().toISOString() };
          await writeData(filename, data);
          res.json(data[index]);
        } else {
          res.status(404).json({ message: 'Not found' });
        }
      } catch (err) {
        console.error(`Error in PUT ${route}:`, err);
        next(err);
      }
    });

    app.delete(`${route}/:id`, isAdmin, async (req, res, next) => {
      try {
        let data = await readData(filename);
        data = data.filter((item: any) => item.id !== req.params.id);
        await writeData(filename, data);
        res.json({ success: true });
      } catch (err) {
        console.error(`Error in DELETE ${route}:`, err);
        next(err);
      }
    });
  };

  // Error handler moved after routes

  setupCRUD('projects', 'projects.json');
  setupCRUD('blog', 'blog.json');
  setupCRUD('creative', 'creative.json');
  setupCRUD('learning/topics', 'topics.json');
  setupCRUD('learning/lessons', 'lessons.json');
  setupCRUD('experience', 'experience.json');
  setupCRUD('skills', 'skills.json');

  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Server API Error:', err);
    res.status(err.status || 500).json({ 
      message: err.message || 'Internal Server Error',
      error: process.env.NODE_ENV === 'development' ? err : undefined
    });
  });

  app.get('/api/profile', async (req, res) => {
    const data = await readData('profile.json');
    res.json(data && !Array.isArray(data) ? data : {
      name: 'Prince Kumar Jha',
      role: 'Data & Tech Officer',
      bio: 'Architecting data pipelines, automation systems, and AI-driven solutions to solve complex business challenges.',
      profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400'
    });
  });

  app.post('/api/profile', isAdmin, async (req, res) => {
    await writeData('profile.json', req.body);
    res.json(req.body);
  });

  app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;
    
    // Store in JSON for persistence
    const messages = await readData('messages.json');
    messages.push({ ...req.body, id: Date.now().toString(), date: new Date().toISOString() });
    await writeData('messages.json', messages);

    // Send Email if configured
    if (process.env.SMTP_USER) {
      try {
        await transporter.sendMail({
          from: `"Portfolio" <${process.env.SMTP_USER}>`,
          to: 'pjha3913@gmail.com',
          subject: `New Portfolio Message: ${subject}`,
          html: `
            <div style="font-family: serif; padding: 20px; color: #1a1a2e; border: 1px solid #e67e22;">
              <h2 style="color: #e67e22;">New Transmission</h2>
              <p><strong>Sender:</strong> ${name} (${email})</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <div style="background: #fdf2e9; padding: 15px; border-radius: 10px; margin-top: 20px;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
          `,
        });

        await transporter.sendMail({
          from: `"Prince Kumar Jha" <${process.env.SMTP_USER}>`,
          to: email,
          subject: 'Confirmation: Your message was received',
          html: `
            <div style="font-family: serif; padding: 20px; color: #1a1a2e;">
              <h2 style="color: #e67e22;">Hello ${name},</h2>
              <p>Thank you for reaching out. I've received your message regarding "<strong>${subject}</strong>".</p>
              <p>I aim to respond to thoughtful inquiries within 48 hours. In the meantime, feel free to explore my latest data reflections on the site.</p>
              <p>Best regards,<br>Prince Kumar Jha</p>
            </div>
          `,
        });
      } catch (mailError) {
        console.error('Email failed:', mailError);
      }
    }

    res.json({ success: true });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
    
    // Explicit SPA fallback for development to avoid 404s on browser refresh
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api') || url.includes('.')) {
        return next();
      }
      try {
        let template = await fs.readFile(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        next(e);
      }
    });
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
