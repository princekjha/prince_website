import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { api } from '@/src/lib/api';
import { LearningTopic, Lesson } from '@/src/types';
import { ArrowLeft, Play, Clock, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function TopicDetail() {
  const { topicSlug } = useParams<{ topicSlug: string }>();
  const [topic, setTopic] = useState<LearningTopic | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [topicsData, lessonsData] = await Promise.all([
          api.topics.list(),
          api.lessons.list(),
        ]);
        const foundTopic = topicsData.find(t => t.slug === topicSlug);
        if (foundTopic) {
          setTopic(foundTopic);
          setLessons(lessonsData.filter(l => l.topicId === foundTopic.id && l.status === 'published').sort((a, b) => a.lessonNumber - b.lessonNumber));
        }
      } catch (error) {
        console.error('Failed to fetch topic data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [topicSlug]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!topic) return <div className="text-center py-20">Topic not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <Link to="/learning" className="inline-flex items-center gap-2 text-sm font-bold text-text-secondary/60 hover:text-brand mb-12 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to All Topics
      </Link>

      <motion.header 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-text-primary mb-6">{topic.title}</h1>
        <p className="text-xl text-text-secondary leading-relaxed max-w-2xl">
          {topic.description}
        </p>
        
        <div className="flex gap-6 mt-8 p-6 bg-bg-secondary border border-border-theme rounded-2xl shadow-sm">
           <div className="flex items-center gap-2 text-text-primary font-bold">
              <Play className="w-5 h-5 text-brand" />
              {lessons.length} Lessons
           </div>
           <div className="flex items-center gap-2 text-text-primary font-bold">
              <Clock className="w-5 h-5 text-brand" />
              ~{lessons.length * 10} min read
           </div>
        </div>
      </motion.header>

      <section>
        <h2 className="text-2xl font-serif font-bold mb-8 text-text-primary">Curriculum</h2>
        <div className="space-y-4">
          {lessons.map((lesson, idx) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link 
                to={`/learning/${topicSlug}/${lesson.slug}`}
                className="group flex items-center gap-6 p-6 bg-bg-secondary rounded-2xl border border-border-theme hover:border-brand transition-all shadow-sm"
              >
                <div className="w-12 h-12 rounded-full bg-bg-primary flex items-center justify-center font-serif font-bold text-text-secondary/40 group-hover:bg-brand group-hover:text-white transition-colors">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-text-primary group-hover:text-brand transition-colors">{lesson.title}</h3>
                  <p className="text-sm text-text-secondary/60 mt-1">{lesson.readTime} read</p>
                </div>
                <ChevronRight className="w-6 h-6 text-text-secondary/20 group-hover:text-brand group-hover:translate-x-1 transition-all" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
