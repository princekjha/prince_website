// export interface Project {
//   id: string;
//   title: string;
//   slug: string;
//   description: string;
//   fullDescription: string;
//   featuredImage: string;
//   techStack: string[];
//   projectType: 'Case Study' | 'Experiment' | 'Full Project';
//   demoUrl?: string;
//   repoUrl?: string;
//   featured: boolean;
//   status: 'published' | 'draft';
//   createdAt: string;
//   updatedAt?: string;
// }

// export interface BlogPost {
//   id: string;
//   title: string;
//   slug: string;
//   excerpt: string;
//   content: string;
//   featuredImage?: string;
//   category: string;
//   tags: string[];
//   readTime: string;
//   status: 'published' | 'draft';
//   publishDate: string;
//   createdAt: string;
//   updatedAt?: string;
// }

// export interface CreativePiece {
//   id: string;
//   title: string;
//   type: 'Poem' | 'Essay' | 'Short Story' | 'Other';
//   language: 'Hindi' | 'English' | 'Maithili';
//   content: string;
//   dateWritten: string;
//   status: 'published' | 'draft';
//   createdAt: string;
// }

// export interface LearningTopic {
//   id: string;
//   title: string;
//   slug: string;
//   description: string;
//   icon?: string;
//   status: 'published' | 'draft';
//   createdAt: string;
// }

// export interface Lesson {
//   id: string;
//   topicId: string;
//   title: string;
//   slug: string;
//   lessonNumber: number;
//   content: string;
//   readTime: string;
//   status: 'published' | 'draft';
//   createdAt: string;
//   updatedAt?: string;
// }

// export interface ExperienceImage {
//   url: string;
//   description?: string;
// }

// export interface Experience {
//   id: string;
//   organization: string;
//   role: string;
//   tenure: string;
//   images: ExperienceImage[];
//   description: string;
//   status: 'published' | 'draft';
//   createdAt: string;
//   updatedAt?: string;
// }

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  fullDescription: string;
  featuredImage: string;
  images: string[];
  techStack: string[];
  projectType: 'Case Study' | 'Experiment' | 'Full Project';
  demoUrl?: string;
  repoUrl?: string;
  featured: boolean;
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  category: string;
  tags: string[];
  readTime: string;
  status: 'published' | 'draft';
  publishDate: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreativePiece {
  id: string;
  title: string;
  type: 'Poem' | 'Essay' | 'Short Story' | 'Other';
  language: 'Hindi' | 'English' | 'Maithili';
  content: string;
  dateWritten: string;
  status: 'published' | 'draft';
  createdAt: string;
}

export interface LearningTopic {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon?: string;
  status: 'published' | 'draft';
  createdAt: string;
}

export interface Lesson {
  id: string;
  topicId: string;
  title: string;
  slug: string;
  lessonNumber: number;
  content: string;
  readTime: string;
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt?: string;
}

export interface Experience {
  id: string;
  organization: string;
  role: string;
  tenure: string;
  images: string[];
  description: string;
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt?: string;
}
