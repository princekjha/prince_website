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
        <button onClick={() => setSelectedTopic(null)} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#1A1A2E]">
          <ArrowLeft className="w-4 h-4" /> Back to Topics
        </button>
        
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#1A1A2E]">{selectedTopic.title} — Lessons</h1>
            <p className="text-gray-500">Add or edit lessons for this topic.</p>
          </div>
          {!isEditingLesson && (
            <button onClick={() => handleEditLesson(null)} className="flex items-center gap-2 px-6 py-3 bg-[#1A1A2E] text-white rounded-xl font-bold">
              <Plus className="w-5 h-5" /> New Lesson
            </button>
          )}
        </header>

        {isEditingLesson ? (
          <form onSubmit={handleSaveLesson} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Lesson Title</label>
                <input required className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#E67E22] outline-none" value={currentLesson?.title} onChange={e => setCurrentLesson({...currentLesson, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Read Time</label>
                <input className="w-full px-4 py-3 rounded-xl bg-gray-50" value={currentLesson?.readTime} onChange={e => setCurrentLesson({...currentLesson, readTime: e.target.value})} />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Lesson Content (Markdown)</label>
              <textarea required rows={15} className="w-full px-4 py-3 rounded-xl bg-gray-50 font-mono text-sm border-2 border-transparent focus:bg-white focus:border-[#E67E22] resize-none" value={currentLesson?.content} onChange={e => setCurrentLesson({...currentLesson, content: e.target.value})} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Lesson Number</label>
                  <input type="number" className="w-full px-4 py-3 rounded-xl bg-gray-50" value={currentLesson?.lessonNumber} onChange={e => setCurrentLesson({...currentLesson, lessonNumber: parseInt(e.target.value)})} />
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Status</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-gray-50" value={currentLesson?.status} onChange={e => setCurrentLesson({...currentLesson, status: e.target.value as any})}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
               </div>
            </div>

            <div className="flex justify-end gap-4 pt-6">
               <button type="button" onClick={() => setIsEditingLesson(false)} className="px-6 py-3 font-bold text-gray-500">Cancel</button>
               <button type="submit" className="px-8 py-3 bg-[#1A1A2E] text-white rounded-xl font-bold">Save Lesson</button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 gap-4">
             {topicLessons.map((lesson, idx) => (
                <div key={lesson.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group">
                   <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">{lesson.lessonNumber}</span>
                      <h4 className="font-bold text-[#1A1A2E]">{lesson.title}</h4>
                      {lesson.status === 'draft' && <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Draft</span>}
                   </div>
                   <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEditLesson(lesson)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteLesson(lesson.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                   </div>
                </div>
             ))}
             {topicLessons.length === 0 && <p className="text-center py-12 text-gray-400 italic">No lessons in this topic yet.</p>}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#1A1A2E]">Learning Hub Topics</h1>
          <p className="text-gray-500">Organize your lessons into high-level topics.</p>
        </div>
        {!isEditingTopic && (
          <button onClick={() => handleEditTopic(null)} className="flex items-center gap-2 px-6 py-3 bg-[#E67E22] text-white rounded-xl font-bold">
            <Plus className="w-5 h-5" /> New Topic
          </button>
        )}
      </header>

      {isEditingTopic ? (
        <form onSubmit={handleSaveTopic} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xl space-y-6 max-w-2xl">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Topic Title</label>
            <input required className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#E67E22] outline-none" value={currentTopic?.title} onChange={e => setCurrentTopic({...currentTopic, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Description</label>
            <textarea required rows={3} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#E67E22] resize-none" value={currentTopic?.description} onChange={e => setCurrentTopic({...currentTopic, description: e.target.value})} />
          </div>

          <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Status</label>
              <select className="w-full px-4 py-3 rounded-xl bg-gray-50" value={currentTopic?.status} onChange={e => setCurrentTopic({...currentTopic, status: e.target.value as any})}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
          </div>

          <div className="flex justify-end gap-4 pt-6">
             <button type="button" onClick={() => setIsEditingTopic(false)} className="px-6 py-3 font-bold text-gray-500">Cancel</button>
             <button type="submit" className="px-8 py-3 bg-[#E67E22] text-white rounded-xl font-bold">Save Topic</button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {topics.map(topic => (
             <div key={topic.id} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                   <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center"><BookOpen className="text-[#E67E22] w-6 h-6" /></div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEditTopic(topic)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteTopic(topic.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                   </div>
                   <h3 className="text-xl font-bold mb-2">{topic.title}</h3>
                   <p className="text-sm text-gray-500 mb-6 line-clamp-2">{topic.description}</p>
                </div>
                <button 
                  onClick={() => setSelectedTopic(topic)}
                  className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-xl text-sm font-bold hover:bg-[#1A1A2E] hover:text-white transition-all"
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
