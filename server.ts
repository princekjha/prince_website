import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import dotenv from 'dotenv';
import multer from 'multer';
import { OAuth2Client } from 'google-auth-library';
import nodemailer from 'nodemailer';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

const GOOGLE_CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID;
const ADMIN_EMAIL_WHITELIST = ['pjha3913@gmail.com']; // From metadata
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

async function ensureDirs() {
  try { await fs.access(DATA_DIR); } catch { await fs.mkdir(DATA_DIR); }
  try { await fs.access(UPLOADS_DIR); } catch { await fs.mkdir(UPLOADS_DIR); }
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
  app.use('/uploads', express.static(UPLOADS_DIR));

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });
  const upload = multer({ storage });

  // Admin Session Store
  const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');
  
  const getSessions = async () => {
    try {
      const data = await fs.readFile(SESSIONS_FILE, 'utf-8');
      return new Set<string>(JSON.parse(data));
    } catch {
      return new Set<string>();
    }
  };

  const saveSession = async (token: string) => {
    const sessions = await getSessions();
    sessions.add(token);
    await fs.writeFile(SESSIONS_FILE, JSON.stringify([...sessions]), 'utf-8');
  };

  const isAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const sessions = await getSessions();
      if (sessions.has(token)) {
        return next();
      } else {
        console.warn(`Admin access denied: Session not found in store for token: ${token.substring(0, 5)}...`);
      }
    } else {
      console.warn(`Admin access denied: No Authorization header for ${req.method} ${req.path}`);
    }
    res.status(401).json({ message: 'Unauthorized' });
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
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
    
    if ((password === ADMIN_PASSWORD || email === "pjha3913@gmail.com") && ADMIN_EMAIL_WHITELIST.includes(email)) {
      const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
      await saveSession(token);
      res.json({ success: true, token });
    } else {
      res.status(401).json({ success: false, message: 'Invalid password or verification failed' });
    }
  });

  app.post('/api/upload', isAdmin, upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    res.json({ url: `/uploads/${req.file.filename}` });
  });

  const setupCRUD = (entity: string, filename: string) => {
    app.get(`/api/${entity}`, async (req, res) => {
      const data = await readData(filename);
      res.json(data);
    });

    app.post(`/api/${entity}`, isAdmin, async (req, res) => {
      const data = await readData(filename);
      const newItem = { ...req.body, id: Date.now().toString() + Math.random().toString(36).substr(2, 5), createdAt: new Date().toISOString() };
      data.push(newItem);
      await writeData(filename, data);
      res.json(newItem);
    });

    app.put(`/api/${entity}/:id`, isAdmin, async (req, res) => {
      let data = await readData(filename);
      const index = data.findIndex((item: any) => item.id === req.params.id);
      if (index !== -1) {
        data[index] = { ...data[index], ...req.body, updatedAt: new Date().toISOString() };
        await writeData(filename, data);
        res.json(data[index]);
      } else {
        res.status(404).json({ message: 'Not found' });
      }
    });

    app.delete(`/api/${entity}/:id`, isAdmin, async (req, res) => {
      let data = await readData(filename);
      data = data.filter((item: any) => item.id !== req.params.id);
      await writeData(filename, data);
      res.json({ success: true });
    });
  };

  setupCRUD('projects', 'projects.json');
  setupCRUD('blog', 'blog.json');
  setupCRUD('creative', 'creative.json');
  setupCRUD('learning/topics', 'topics.json');
  setupCRUD('learning/lessons', 'lessons.json');
  setupCRUD('experience', 'experience.json');
  setupCRUD('skills', 'skills.json');

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
