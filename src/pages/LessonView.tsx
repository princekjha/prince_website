import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { api } from '@/src/lib/api';
import { LearningTopic, Lesson } from '@/src/types';
import { ArrowLeft, Menu, X, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

export default function LessonView() {
  const { topicSlug, lessonSlug } = useParams<{ topicSlug: string; lessonSlug: string }>();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<LearningTopic | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

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
          const topicLessons = lessonsData
            .filter(l => l.topicId === foundTopic.id && l.status === 'published')
            .sort((a, b) => a.lessonNumber - b.lessonNumber);
          setLessons(topicLessons);
          const foundLesson = topicLessons.find(l => l.slug === lessonSlug);
          if (foundLesson) {
            setCurrentLesson(foundLesson);
          }
        }
      } catch (error) {
        console.error('Failed to fetch lesson data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [topicSlug, lessonSlug]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo(0, 0);
    }
    setSidebarOpen(false); // Close sidebar on mobile when lesson changes
  }, [lessonSlug]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!topic || !currentLesson) return <div className="text-center py-20">Lesson or topic not found</div>;

  const currentIdx = lessons.findIndex(l => l.id === currentLesson.id);
  const prevLesson = currentIdx > 0 ? lessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < lessons.length - 1 ? lessons[currentIdx + 1] : null;

  return (
    <div className="fixed inset-0 top-16 flex flex-col md:flex-row bg-bg-primary z-40">
      {/* Mobile Header Overlay (sidebar toggle) */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border-theme bg-bg-primary">
        <button onClick={() => setSidebarOpen(true)} className="flex items-center gap-2 text-sm font-bold text-text-primary">
          <Menu className="w-5 h-5" /> Lessons
        </button>
        <span className="text-xs font-bold text-text-secondary/40 truncate max-w-[200px]">
          {currentLesson.title}
        </span>
      </div>

      {/* Sidebar - Desktop Sticky / Mobile Overlay */}
      <AnimatePresence>
        {(sidebarOpen || (typeof window !== 'undefined' && window.innerWidth >= 768)) && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className={cn(
              "fixed md:relative inset-y-0 left-0 w-[300px] bg-bg-secondary border-r border-border-theme z-50 flex flex-col",
              !sidebarOpen && "hidden md:flex"
            )}
          >
            <div className="p-6 border-b border-border-theme flex items-center justify-between">
              <Link to={`/learning/${topicSlug}`} className="text-xs font-bold uppercase tracking-widest text-text-secondary hover:text-brand transition-colors flex items-center gap-2">
                <ArrowLeft className="w-3 h-3" /> {topic.title}
              </Link>
              <button onClick={() => setSidebarOpen(false)} className="md:hidden p-2 text-text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {lessons.map((lesson, idx) => (
                <Link
                  key={lesson.id}
                  to={`/learning/${topicSlug}/${lesson.slug}`}
                  className={cn(
                    "flex items-start gap-4 p-4 rounded-xl transition-all font-bold transition-all",
                    lesson.id === currentLesson.id 
                      ? "bg-bg-primary shadow-md border border-brand/20" 
                      : "hover:bg-bg-primary/50"
                  )}
                >
                  <span className={cn(
                    "w-6 h-6 rounded-full flex shrink-0 items-center justify-center text-[10px] font-bold transition-colors",
                    lesson.id === currentLesson.id ? "bg-brand text-white" : "bg-bg-primary text-text-secondary/40 border border-border-theme"
                  )}>
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className={cn("text-sm font-bold leading-tight transition-colors", lesson.id === currentLesson.id ? "text-text-primary" : "text-text-secondary")}>
                      {lesson.title}
                    </h4>
                    <span className="text-[10px] text-text-secondary/40 mt-1 block">{lesson.readTime}</span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main ref={contentRef} className="flex-1 overflow-y-auto scroll-smooth">
        <div className="max-w-3xl mx-auto px-6 py-12 md:py-20">
          <motion.div
            key={currentLesson.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <span className="px-3 py-1 bg-brand text-white text-[10px] font-bold rounded-full uppercase tracking-widest">
                Lesson {currentIdx + 1}
              </span>
              <div className="h-px bg-border-theme flex-1" />
              <span className="text-text-secondary/40 text-xs flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> {currentLesson.readTime}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-serif font-bold text-text-primary mb-12">
              {currentLesson.title}
            </h1>

            <div className="prose prose-lg prose-slate max-w-none 
              prose-headings:font-serif prose-headings:text-text-primary 
              prose-p:text-text-secondary prose-p:leading-relaxed 
              prose-a:text-brand prose-a:no-underline hover:prose-a:underline
              prose-code:text-text-primary prose-code:bg-bg-secondary prose-code:px-1 prose-code:rounded
              prose-pre:bg-bg-dark prose-pre:text-white prose-pre:rounded-2xl
              prose-img:rounded-3xl prose-img:shadow-xl
              mb-20"
            >
              <ReactMarkdown>{currentLesson.content}</ReactMarkdown>
            </div>

            {/* Navigation Controls */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-12 border-t border-border-theme">
              {prevLesson ? (
                <Link 
                  to={`/learning/${topicSlug}/${prevLesson.slug}`}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-bg-secondary hover:bg-bg-primary hover:shadow-md border border-border-theme hover:border-brand transition-all flex-1"
                >
                  <ChevronLeft className="w-6 h-6 text-brand" />
                  <div>
                    <span className="text-[10px] font-bold uppercase text-text-secondary/40">Previous</span>
                    <h5 className="font-bold text-sm text-text-primary line-clamp-1">{prevLesson.title}</h5>
                  </div>
                </Link>
              ) : <div className="flex-1" />}

              {nextLesson ? (
                <Link 
                  to={`/learning/${topicSlug}/${nextLesson.slug}`}
                  className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-bg-secondary hover:bg-bg-primary hover:shadow-md border border-border-theme hover:border-brand transition-all flex-1 text-right"
                >
                  <div className="flex-1">
                    <span className="text-[10px] font-bold uppercase text-text-secondary/40">Next</span>
                    <h5 className="font-bold text-sm text-text-primary line-clamp-1">{nextLesson.title}</h5>
                  </div>
                  <ChevronRight className="w-6 h-6 text-brand" />
                </Link>
              ) : <div className="flex-1" />}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
