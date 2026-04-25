import { useState, useEffect } from 'react';
import { api } from '@/src/lib/api';
import { LearningTopic, Lesson } from '@/src/types';
import { Plus, Edit, Trash2, ArrowLeft, BookOpen, ExternalLink } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function LearningAdmin() {
  const [topics, setTopics] = useState<LearningTopic[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<LearningTopic | null>(null);
  const [isEditingTopic, setIsEditingTopic] = useState(false);
  const [isEditingLesson, setIsEditingLesson] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<Partial<LearningTopic> | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Partial<Lesson> | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [topicsData, lessonsData] = await Promise.all([
        api.topics.list(),
        api.lessons.list()
      ]);
      setTopics(topicsData);
      setLessons(lessonsData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditTopic = (topic: LearningTopic | null) => {
    setCurrentTopic(topic || {
      title: '',
      slug: '',
      description: '',
      status: 'draft'
    });
    setIsEditingTopic(true);
  };

  const handleSaveTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentTopic?.id) {
        await api.topics.update(currentTopic.id, currentTopic);
      } else {
        await api.topics.create(currentTopic);
      }
      setIsEditingTopic(false);
      fetchData();
      alert('Topic saved successfully!');
    } catch (err) {
      alert('Error saving topic');
    }
  };

  const handleDeleteTopic = async (id: string) => {
    if (confirm('Delete this topic and all its lessons?')) {
      await api.topics.delete(id);
      fetchData();
    }
  };

  const handleEditLesson = (lesson: Lesson | null) => {
    setCurrentLesson(lesson || {
      topicId: selectedTopic?.id,
      title: '',
      slug: '',
      lessonNumber: lessons.filter(l => l.topicId === selectedTopic?.id).length + 1,
      content: '',
      readTime: '10 min',
      status: 'draft'
    });
    setIsEditingLesson(true);
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentLesson?.id) {
        await api.lessons.update(currentLesson.id, currentLesson);
      } else {
        await api.lessons.create(currentLesson);
      }
      setIsEditingLesson(false);
      fetchData();
      alert('Lesson saved successfully!');
    } catch (err) {
      alert('Error saving lesson');
    }
  };

  const handleDeleteLesson = async (id: string) => {
    if (confirm('Delete this lesson?')) {
      await api.lessons.delete(id);
      fetchData();
    }
  };

  if (selectedTopic) {
    const topicLessons = lessons
      .filter(l => l.topicId === selectedTopic.id)
      .sort((a, b) => a.lessonNumber - b.lessonNumber);

    return (
      <div className="space-y-8">
        <button onClick={() => setSelectedTopic(null)} className="flex items-center gap-2 text-sm font-bold text-text-secondary hover:text-text-primary">
          <ArrowLeft className="w-4 h-4" /> Back to Topics
        </button>
        
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-serif font-bold text-text-primary">{selectedTopic.title} — Lessons</h1>
            <p className="text-text-secondary">Add or edit lessons for this topic.</p>
          </div>
          {!isEditingLesson && (
            <button onClick={() => handleEditLesson(null)} className="flex items-center gap-2 px-6 py-3 bg-text-primary text-bg-primary rounded-xl font-bold hover:bg-brand transition-all">
              <Plus className="w-5 h-5" /> New Lesson
            </button>
          )}
        </header>

        {isEditingLesson ? (
          <form onSubmit={handleSaveLesson} className="bg-bg-secondary p-8 rounded-2xl border border-border-theme shadow-xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-text-secondary/70">Lesson Title</label>
                <input required className="w-full px-4 py-3 rounded-xl bg-bg-primary border-2 border-transparent focus:border-brand outline-none text-text-primary" value={currentLesson?.title} onChange={e => setCurrentLesson({...currentLesson, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-text-secondary/70">Read Time</label>
                <input className="w-full px-4 py-3 rounded-xl bg-bg-primary text-text-primary" value={currentLesson?.readTime} onChange={e => setCurrentLesson({...currentLesson, readTime: e.target.value})} />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text-secondary/70">Lesson Content (Markdown)</label>
              <textarea required rows={15} className="w-full px-4 py-3 rounded-xl bg-bg-primary font-mono text-sm border-2 border-transparent focus:border-brand resize-none text-text-primary" value={currentLesson?.content} onChange={e => setCurrentLesson({...currentLesson, content: e.target.value})} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-text-secondary/70">Lesson Number</label>
                  <input type="number" className="w-full px-4 py-3 rounded-xl bg-bg-primary text-text-primary" value={isNaN(currentLesson?.lessonNumber as any) ? '' : currentLesson?.lessonNumber} onChange={e => {
                    const val = parseInt(e.target.value);
                    setCurrentLesson({...currentLesson, lessonNumber: isNaN(val) ? 0 : val});
                  }} />
               
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-text-secondary/70">Status</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-bg-primary text-text-primary" value={currentLesson?.status} onChange={e => setCurrentLesson({...currentLesson, status: e.target.value as any})}>
                    <option value="draft" className="bg-bg-secondary">Draft</option>
                    <option value="published" className="bg-bg-secondary">Published</option>
                  </select>
               </div>
            </div>

            <div className="flex justify-end gap-4 pt-6">
               <button type="button" onClick={() => setIsEditingLesson(false)} className="px-6 py-3 font-bold text-text-secondary hover:text-text-primary transition-colors">Cancel</button>
               <button type="submit" className="px-8 py-3 bg-text-primary text-bg-primary rounded-xl font-bold hover:bg-brand transition-all">Save Lesson</button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 gap-4">
             {topicLessons.map((lesson, idx) => (
                <div key={lesson.id} className="bg-bg-secondary p-6 rounded-2xl border border-border-theme shadow-sm flex items-center justify-between group">
                   <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-full bg-bg-primary flex items-center justify-center text-xs font-bold text-text-secondary/60 border border-border-theme">{lesson.lessonNumber}</span>
                      <h4 className="font-bold text-text-primary group-hover:text-brand transition-colors">{lesson.title}</h4>
                      {lesson.status === 'draft' && <span className="bg-bg-primary text-text-secondary/60 text-[10px] font-bold px-2 py-0.5 rounded uppercase border border-border-theme">Draft</span>}
                   </div>
                   <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEditLesson(lesson)} className="p-2 text-brand hover:bg-brand/10 rounded-lg transition-all"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteLesson(lesson.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                   </div>
                </div>
             ))}
             {topicLessons.length === 0 && <p className="text-center py-12 text-text-secondary/40 italic font-serif">No lessons in this topic yet.</p>}
          </div>
        )}

      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-text-primary">Learning Hub Topics</h1>
          <p className="text-text-secondary">Organize your lessons into high-level topics.</p>
        </div>
        {!isEditingTopic && (
          <button onClick={() => handleEditTopic(null)} className="flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-xl font-bold hover:bg-brand/90 transition-all shadow-lg">
            <Plus className="w-5 h-5" /> New Topic
          </button>
        )}
      </header>

      {isEditingTopic ? (
        <form onSubmit={handleSaveTopic} className="bg-bg-secondary p-8 rounded-2xl border border-border-theme shadow-xl space-y-6 max-w-2xl">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-text-secondary/70">Topic Title</label>
            <input required className="w-full px-4 py-3 rounded-xl bg-bg-primary border-2 border-transparent focus:border-brand outline-none text-text-primary" value={currentTopic?.title} onChange={e => setCurrentTopic({...currentTopic, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-text-secondary/70">Icon Path (e.g. /images/topics/python.svg)</label>
            <input className="w-full px-4 py-3 rounded-xl bg-bg-primary border-2 border-transparent focus:border-brand outline-none text-text-primary" value={currentTopic?.icon} onChange={e => setCurrentTopic({...currentTopic, icon: e.target.value})} placeholder="/images/topics/default.png" />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-text-secondary/70">Description</label>
            <textarea required rows={3} className="w-full px-4 py-3 rounded-xl bg-bg-primary border-2 border-transparent focus:border-brand resize-none text-text-primary" value={currentTopic?.description} onChange={e => setCurrentTopic({...currentTopic, description: e.target.value})} />
          </div>

          <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text-secondary/70">Status</label>
              <select className="w-full px-4 py-3 rounded-xl bg-bg-primary text-text-primary" value={currentTopic?.status} onChange={e => setCurrentTopic({...currentTopic, status: e.target.value as any})}>
                <option value="draft" className="bg-bg-secondary">Draft</option>
                <option value="published" className="bg-bg-secondary">Published</option>
              </select>
          </div>

          <div className="flex justify-end gap-4 pt-6">
             <button type="button" onClick={() => setIsEditingTopic(false)} className="px-6 py-3 font-bold text-text-secondary hover:text-text-primary transition-colors">Cancel</button>
             <button type="submit" className="px-8 py-3 bg-brand text-white rounded-xl font-bold hover:bg-brand/90 transition-all">Save Topic</button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {topics.map(topic => (
              <div key={topic.id} className="bg-bg-secondary p-8 rounded-2xl border border-border-theme shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                 <div>
                    <div className="flex justify-between items-start mb-4">
                       <div className="w-12 h-12 bg-bg-primary rounded-xl flex items-center justify-center border border-border-theme"><BookOpen className="text-brand w-6 h-6" /></div>
                       <div className="flex gap-2">
                         <button onClick={() => handleEditTopic(topic)} className="p-2 text-brand hover:bg-brand/10 rounded-lg transition-all"><Edit className="w-4 h-4" /></button>
                         <button onClick={() => handleDeleteTopic(topic.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                       </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-text-primary">{topic.title}</h3>
                    <p className="text-sm text-text-secondary mb-6 line-clamp-2">{topic.description}</p>
                 </div>
                 <button 
                   onClick={() => setSelectedTopic(topic)}
                   className="flex items-center justify-between w-full p-4 bg-bg-primary border border-border-theme rounded-xl text-sm font-bold text-text-primary hover:bg-brand hover:text-white transition-all"
                 >
                   Manage Lessons ({lessons.filter(l => l.topicId === topic.id).length})
                   <ExternalLink className="w-4 h-4" />
                 </button>
              </div>
           ))}
        </div>
      )}
    </div>
  );
}
