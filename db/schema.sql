-- Cloudflare D1 Schema for Prince Kumar Jha Portfolio

DROP TABLE IF EXISTS projects;
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  fullDescription TEXT,
  techStack TEXT, -- JSON array
  imageUrl TEXT,
  link TEXT,
  github TEXT,
  orderIndex INTEGER DEFAULT 0
);

DROP TABLE IF EXISTS experiences;
CREATE TABLE experiences (
  id TEXT PRIMARY KEY,
  organization TEXT NOT NULL,
  role TEXT NOT NULL,
  tenure TEXT,
  description TEXT,
  orderIndex INTEGER DEFAULT 0
);

DROP TABLE IF EXISTS experience_images;
CREATE TABLE experience_images (
  id TEXT PRIMARY KEY,
  experience_id TEXT,
  url TEXT NOT NULL,
  description TEXT,
  FOREIGN KEY(experience_id) REFERENCES experiences(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS creative_pieces;
CREATE TABLE creative_pieces (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  type TEXT, -- Poem, Essay, etc.
  language TEXT, -- English, Hindi, etc.
  dateWritten TEXT,
  status TEXT DEFAULT 'draft',
  orderIndex INTEGER DEFAULT 0
);

DROP TABLE IF EXISTS learning_topics;
CREATE TABLE learning_topics (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  status TEXT DEFAULT 'draft'
);

DROP TABLE IF EXISTS lessons;
CREATE TABLE lessons (
  id TEXT PRIMARY KEY,
  topic_id TEXT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  content TEXT,
  readTime TEXT,
  status TEXT DEFAULT 'draft',
  orderIndex INTEGER DEFAULT 0,
  FOREIGN KEY(topic_id) REFERENCES learning_topics(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS blog_posts;
CREATE TABLE blog_posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  category TEXT,
  readTime TEXT,
  status TEXT DEFAULT 'draft',
  datePublished TEXT DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS skills;
CREATE TABLE skills (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  skills_json TEXT, -- JSON array of Skill objects
  orderIndex INTEGER DEFAULT 0
);

DROP TABLE IF EXISTS profile;
CREATE TABLE profile (
  id TEXT PRIMARY KEY DEFAULT 'main',
  name TEXT,
  role TEXT,
  bio TEXT,
  profileImage TEXT
);

-- Seed Initial Profile
INSERT INTO profile (id, name, role, bio) VALUES ('main', 'Prince Kumar Jha', 'Data Engineer & AI Specialist', 'Architecting the bridge between structured data and human-centric AI solutions.');
