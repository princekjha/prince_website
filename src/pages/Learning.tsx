import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { api } from '@/src/lib/api';
import { LearningTopic, Lesson, BlogPost } from '@/src/types';
import { Book, Clock, Search, ArrowRight, Play, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Learning() {
  const [topics, setTopics] = useState<LearningTopic[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [topicsData, lessonsData, blogData] = await Promise.all([
          api.topics.list(),
          api.lessons.list(),
          api.blog.list(),
        ]);
        setTopics(topicsData.filter(t => t.status === 'published'));
        setLessons(lessonsData.filter(l => l.status === 'published'));
        setBlogPosts(blogData.filter(b => b.status === 'published'));
      } catch (error) {
        console.error('Failed to fetch learning hub data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getLessonCount = (topicId: string) => lessons.filter(l => l.topicId === topicId).length;
  
  const filteredTopics = topics.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) || 
    t.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 min-h-screen">
      <header className="mb-20 text-center max-w-3xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-brand font-bold tracking-widest uppercase text-sm">Knowledge Sharing</span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-text-primary mt-4 mb-6">Master Your Craft, One Lesson at a Time.</h1>
          <p className="text-xl text-text-secondary mb-8">
            Structured guides and deep dives into technology, design, and personal growth.
          </p>
          
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search topics or lessons..."
              className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-border-theme bg-bg-secondary text-text-primary focus:border-brand focus:outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </motion.div>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {filteredTopics.map((topic, idx) => {
              const lessonCount = getLessonCount(topic.id);
              return (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="bg-bg-secondary rounded-3xl p-8 border border-border-theme shadow-sm hover:shadow-xl hover:border-brand transition-all group"
                >
                  <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center mb-6 text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                    <Book className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-text-primary mb-3">{topic.title}</h3>
                  <p className="text-text-secondary text-sm mb-6 line-clamp-2 leading-relaxed">
                    {topic.description}
                  </p>
                  
                  <div className="flex items-center gap-6 mb-8 text-sm font-medium text-text-secondary/60">
                    <div className="flex items-center gap-2">
                      <Play className="w-4 h-4 text-brand" />
                      {lessonCount} lessons
                    </div>
                    <div className="flex items-center gap-2">
                       <Clock className="w-4 h-4 text-brand" />
                       ~{lessonCount * 10} mins
                    </div>
                  </div>
                  
                  <Link 
                    to={`/learning/${topic.slug}`}
                    className="flex items-center justify-between py-4 px-6 bg-bg-primary rounded-xl font-bold group-hover:bg-navy group-hover:text-white transition-colors text-brand"
                  >
                    Start Learning <ArrowRight className="w-5 h-5" />
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <section>
             <h2 className="text-2xl font-serif font-bold mb-8 text-text-primary">Popular Lessons</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lessons.slice(0, 4).map(lesson => (
                  <Link 
                    key={lesson.id} 
                    to={`/learning/topic/${lesson.slug}`}
                    className="flex bg-bg-secondary p-6 rounded-2xl border border-border-theme hover:border-brand transition-all group"
                  >
                    <div className="flex-1">
                       <h4 className="font-bold group-hover:text-brand transition-colors text-text-primary group-hover:text-brand">{lesson.title}</h4>
                       <p className="text-sm text-text-secondary/60 mt-1">{lesson.readTime} read</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-text-secondary/40 group-hover:text-brand transition-all" />
                  </Link>
                ))}
             </div>
          </section>
          <section className="mt-20">
             <h2 className="text-3xl font-serif font-bold mb-10 text-text-primary">Blog & Articles</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map(post => (
                  <article key={post.id} className="bg-bg-secondary rounded-3xl border border-border-theme p-8 hover:shadow-lg transition-all group">
                     <span className="text-[10px] font-bold text-brand uppercase tracking-[0.2em] mb-4 block">{post.category}</span>
                     <h4 className="text-xl font-bold mb-4 group-hover:text-brand transition-colors text-text-primary">{post.title}</h4>
                     <p className="text-text-secondary/70 text-sm mb-6 line-clamp-2">{post.excerpt}</p>
                     <div className="flex items-center justify-between mt-auto">
                        <span className="text-xs text-text-secondary/40">{post.readTime} read</span>
                        <button className="text-text-primary font-bold text-sm flex items-center gap-1 hover:text-brand">
                          Read Now <ArrowRight className="w-4 h-4" />
                        </button>
                     </div>
                  </article>
                ))}
             </div>
          </section>
        </>
      )}

      {!loading && topics.length === 0 && (
        <div className="text-center py-20">
          <p className="text-text-secondary/40 text-xl font-serif italic text-center mx-auto">Knowledge is still being organized. Check back soon.</p>
        </div>
      )}
    </div>
  );
}
