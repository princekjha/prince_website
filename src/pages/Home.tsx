import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Briefcase, User, PenTool, Sparkles, Database, Code2, Heart, Upload, Camera, ChevronRight, Edit, Download, X, History } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { api } from '@/src/lib/api';
import { Lesson, Experience, CreativePiece, Project } from '@/src/types';
import { cn } from '@/src/lib/utils';

interface Profile {
  name: string;
  role: string;
  bio: string;
  profileImage: string;
}

export default function Home() {
  const [data, setData] = useState<{
    lesson?: Lesson;
    experience?: Experience;
    creative?: CreativePiece;
    profile?: Profile;
    skills?: any[];
    projects?: Project[];
  }>({});
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsAdmin(!!localStorage.getItem('admin_token'));
    
    async function fetchData() {
      try {
        const [lessons, experiences, creatives, profile, skills] = await Promise.all([
          api.lessons.list(),
          api.experience.list(),
          api.creative.list(),
          api.profile.get(),
          api.skills.list(),
        ]);
        
        const sortedCreatives = creatives
          .filter(p => p.status === 'published')
          .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

        // // Group skills by category
        // const groupedSkills = (skills || []).reduce((acc: any[], skill: any) => {
        //   const catName = skill.category || 'General';
        //   const existing = acc.find(c => c.category === catName);
        //   if (existing) {
        //     existing.skills.push(skill);
        //   } else {
        //     acc.push({ category: catName, skills: [skill] });
        //   }
        //   return acc;
        // }, []);

        setData({
          lesson: lessons[0],
          experience: experiences[0],
          creative: sortedCreatives[0],
          profile: profile,
          skills: skills || [],
        });

        if (skills && skills.length > 0) {
          setActiveCategory(skills[0].category);
        }
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleDownloadResume = () => {
    // Replace with actual resume URL when available
    const resumeUrl = "public/Prince_Resume_DS2.pdf"; 
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = "Prince_Kumar_Jha_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowResumeModal(false);
  };

  const handleImagePathUpdate = async (path: string) => {
    if (!path.startsWith('/images/')) {
      alert('Image path must start with /images/');
      return;
    }
    setUploading(true);
    try {
      const updatedProfile = { ...(data.profile as Profile), profileImage: path };
      await api.profile.update(updatedProfile);
      setData(prev => ({ ...prev, profile: updatedProfile as Profile }));
      alert('Profile picture path updated successfully!');
    } catch (error: any) {
      alert('Update failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-story italic">Loading your world...</div>;

  return (
    <div className="bg-bg-primary min-h-screen font-sans overflow-x-hidden transition-colors duration-300">
      {/* Resume Modal */}
      <AnimatePresence>
        {showResumeModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
            onClick={() => setShowResumeModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-xl w-full bg-bg-secondary rounded-[2.5rem] p-10 shadow-2xl border border-border-theme text-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-16 h-16 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto mb-8">
                <History className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-text-primary mb-4 italic">A map is not the terrain.</h3>
              <p className="text-text-secondary font-story italic leading-relaxed mb-10">
                A resume captures the milestones, but the journey captures the soul. While you're welcome to the map, I invite you to explore the nuances of the journey first.
              </p>
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => navigate('/about')}
                  className="w-full bg-brand text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-brand/90 transition-all flex items-center justify-center gap-2"
                >
                  Explore the journey first <ArrowRight className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={handleDownloadResume}
                    className="bg-bg-primary text-text-secondary border border-border-theme py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-brand hover:text-white hover:border-brand transition-all"
                  >
                    I'll read it after this
                  </button>
                  <button 
                    onClick={() => navigate('/about#professional')}
                    className="bg-bg-primary text-text-secondary border border-border-theme py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-brand hover:text-white hover:border-brand transition-all"
                  >
                    Take me there
                  </button>
                </div>
              </div>
              <button 
                onClick={() => setShowResumeModal(false)}
                className="mt-8 text-[10px] font-bold uppercase tracking-widest text-text-secondary/40 hover:text-brand transition-colors"
              >
                Maybe later
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-8 flex flex-col gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-4 h-4 text-brand" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand">Personal Portfolio</span>
              </div>
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-black leading-[1.1] text-text-primary tracking-tight">
                Hi, I'm <span className="text-brand whitespace-nowrap">{data.profile?.name || 'Prince Kumar Jha'}</span>
              </h1>
              
              {/* Profile Image (Mobile/Tablet Only) - Moved higher */}
              <div className="lg:hidden relative group w-full max-w-xs mx-auto my-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                  className="relative aspect-square rounded-[2rem] overflow-hidden shadow-xl border-4 border-white transform rotate-1"
                >
                  <img 
                    src={data.profile?.profileImage} 
                    alt="Profile" 
                    className={cn("w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700", uploading && "opacity-50 blur-sm")}
                  />
                  
                  {isAdmin && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center text-white">
                      <button 
                        onClick={() => {
                          const path = prompt("Enter local image path:", data.profile?.profileImage);
                          if (path) handleImagePathUpdate(path);
                        }}
                        className="bg-brand text-white px-4 py-1.5 rounded-full font-bold text-[10px] uppercase shadow-lg border border-white/20"
                      >
                        Update
                      </button>
                    </div>
                  )}
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  onClick={() => setShowResumeModal(true)}
                  className="absolute -bottom-4 -right-4 bg-white text-[#1A1A2E] p-4 rounded-2xl shadow-xl border border-border-theme z-20 flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-brand" />
                  <span className="text-[10px] font-serif font-bold">Resume</span>
                </motion.button>
              </div>

              <p className="mt-8 text-lg text-text-secondary font-story italic leading-relaxed max-w-2xl">
                {data.profile?.bio}
              </p>
            </motion.div>

            {/* Specialized Skills */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="pt-12 relative group/skills"
            >
              {isAdmin && (
                <Link 
                  to="/admin/skills"
                  className="absolute -top-4 right-0 p-3 bg-bg-secondary border border-border-theme rounded-xl shadow-lg opacity-0 group-hover/skills:opacity-100 transition-opacity z-10 flex items-center gap-2 text-xs font-bold text-brand hover:bg-bg-primary"
                  title="Modify Skills"
                >
                  <Edit className="w-4 h-4" /> Edit Technical Assets
                </Link>
              )}
              <div className="bg-bg-secondary rounded-3xl border border-border-theme shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[400px]">
                {/* Sidebar Tabs */}
                <div className="w-full md:w-56 bg-bg-primary/50 border-r border-border-theme p-4 space-y-2">
                  <div className="px-5 py-2 mb-2">
                     <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary/80">Domain</span>
                  </div>
                  {(data.skills || []).map((cat) => (
                      <button
                        key={cat.category}
                        onClick={() => setActiveCategory(cat.category)}
                        className={cn(
                        "w-full text-left px-5 py-4 rounded-xl transition-all duration-300 flex items-center justify-between group",
                        activeCategory === cat.category 
                        ? 'bg-bg-secondary text-brand shadow-sm border border-border-theme' 
                        : 'text-text-secondary/70 hover:bg-bg-secondary/50 hover:text-text-secondary'
                      )}
                      >
                      <span className="text-sm font-serif font-bold leading-tight">{cat.category}</span>
                      <ChevronRight className={cn(
                        "w-4 h-4 transition-transform duration-300",
                        activeCategory === cat.category ? 'translate-x-0' : '-translate-x-2 opacity-0'
                      )} />
                    </button>
                  ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6 md:p-8">
                  <div className="overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-primary border-b border-border-theme">
                          <th className="pb-4 font-black">Skill</th>
                          <th className="pb-4 font-black">Proficiency</th>
                          <th className="pb-4 font-black text-right pr-4">Sub-skills / Concepts</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-theme/50">
                        {(data.skills?.find(c => c.category === activeCategory)?.skills || []).map((s: any, sIdx: number) => (
                          <tr key={sIdx} className="group hover:bg-bg-primary/30 transition-colors">
                            <td className="py-4">
                              <span className="text-sm font-serif font-bold text-text-primary group-hover:text-brand transition-colors">{s.name}</span>
                            </td>
                            <td className="py-4">
                               <span className={cn(
                                 "text-[10px] font-bold uppercase px-2 py-1 rounded-md",
                                 s.level === 'Expert' ? "text-brand bg-brand/5" : "text-text-secondary/60 bg-bg-primary"
                               )}>
                                 {s.level}
                               </span>
                            </td>
                            <td className="py-4 text-[11px] text-text-primary/60 font-story italic text-right pr-4">
                              {s.subSkills}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>

              <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 0.4, duration: 0.8 }}
                 className="pt-10 flex flex-col sm:flex-row flex-wrap gap-4"
              >
                <div className="flex flex-wrap gap-4">
                  <Link to="/about" className="bg-text-primary text-bg-primary px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-brand hover:text-white transition-all flex items-center gap-2 group shadow-xl">
                    My Story <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/learning" className="px-8 py-4 border-2 border-text-primary text-text-primary rounded-full font-bold text-xs uppercase tracking-widest hover:bg-text-primary hover:text-bg-primary transition-all">
                    Learning Hub
                  </Link>
                </div>

                <div 
                  onClick={() => navigate('/about#professional')}
                  className="bg-brand/5 border border-brand/20 px-6 py-4 rounded-full flex items-center gap-3 group cursor-pointer hover:bg-brand hover:text-white transition-all shadow-sm"
                >
                  <Briefcase className="w-4 h-4 text-brand group-hover:text-white transition-colors" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Professional Journey</span>
                  <ChevronRight className="w-4 h-4 text-brand group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
          </div>

          <div className="hidden lg:block lg:col-span-4 relative group sticky top-32">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white transform rotate-3 hover:rotate-0 transition-transform duration-500"
            >
              <img 
                src={data.profile?.profileImage} 
                alt="Profile" 
                className={cn("w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700", uploading && "opacity-50 blur-sm")}
              />
              
              {/* Admin Path Trigger */}
              {isAdmin && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 text-center text-white">
                  <div className="p-4 rounded-full bg-brand mb-4">
                    <Camera className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-bold uppercase tracking-widest mb-4 text-white">Change Profile Picture</p>
                  <button 
                    onClick={() => {
                      const path = prompt("Enter local image path (e.g. /images/about/profile.png):", data.profile?.profileImage || "/images/about/My_latest_pic.jpeg"
                      );
                      if (path) handleImagePathUpdate(path);
                    }}
                    disabled={uploading}
                    className="bg-white text-brand px-6 py-2 rounded-full font-bold text-xs uppercase hover:bg-bg-primary transition-colors"
                  >
                    {uploading ? 'Processing...' : 'Change Image Path'}
                  </button>
                </div>
              )}
            </motion.div>

            {/* Resume Button Overlay on Profile */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              onClick={() => setShowResumeModal(true)}
              className="absolute -bottom-6 -right-6 bg-white text-[#1A1A2E] p-6 rounded-3xl shadow-2xl hover:bg-brand hover:text-white transition-all flex items-center gap-3 group border border-border-theme z-20"
            >
              <Download className="w-5 h-5 group-hover:bounce transition-all" />
              <div className="text-left">
                <p className="text-xs font-serif font-bold">Download Resume</p>
              </div>
            </motion.button>
          </div>

        </div>
      </section>

      {/* Narrative Section - Replaces Grid */}
      <section className="py-24 bg-bg-secondary border-y border-border-theme">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-20">
          <div className="space-y-6">
            <h2 className="text-3xl font-serif font-bold text-text-primary">Data and Poetry.</h2>
            <p className="text-text-secondary font-story italic leading-relaxed text-lg mb-6">
              In the world of data engineering, I build systems that move millions of rows with precision. In the world of "Ink & Verses", I craft syllables that capture the raw essence of life across three languages. To me, code and poetry are both about finding the perfect sequence.
            </p>
            
            {data.creative && (
              <div className="bg-bg-primary/50 backdrop-blur-sm p-6 rounded-2xl border border-border-theme mb-8 group cursor-pointer hover:bg-bg-secondary transition-all shadow-sm" onClick={() => navigate(`/verses?id=${data.creative.id}`)}>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-brand mb-2">Latest Reflection</p>
                 <h4 className="text-lg font-serif font-bold text-text-primary mb-2">"{data.creative.title}"</h4>
                 <p className="text-sm text-text-secondary line-clamp-2 italic font-story">
                   {data.creative.content.substring(0, 150)}...
                 </p>
              </div>
            )}

            <div className="pt-4">
               <Link to="/verses" className="text-brand font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:underline">
                 Read latest verses <ArrowRight className="w-4 h-4" />
               </Link>
            </div>
          </div>
          <div className="bg-bg-primary/30 rounded-[2.5rem] p-10 flex flex-col justify-between border border-border-theme">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-bg-secondary flex items-center justify-center mb-8 shadow-sm">
                <BookOpen className="text-brand w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-text-primary mb-2">{data.lesson?.title || 'Learning Updates'}</h3>
              <p className="text-sm text-text-secondary/60 font-story italic line-clamp-2">Exploring the frontiers of conversational AI and structured data architecture.</p>
            </div>
            <Link to="/learning" className="mt-8 inline-flex items-center gap-4 group">
               <div className="w-10 h-10 rounded-full border border-border-theme flex items-center justify-center group-hover:border-brand transition-colors">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </div>
               <span className="text-xs font-bold uppercase tracking-widest text-text-primary">Visit Learning Hub</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Global Mission - Fixed Parallax Background */}
      <section 
        className="relative py-48 px-6 md:px-12 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2070')` }}
      >
        <div className="absolute inset-0 bg-black/70" />
        
        <motion.div
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           className="relative z-10 max-w-7xl mx-auto text-center space-y-8"
        >
          <div className="flex justify-center mb-6">
             <Heart className="w-12 h-12 text-white/20 fill-white/10" />
          </div>
          <h2 className="text-4xl font-serif font-bold text-white">A Path Defined by Purpose.</h2>
          <p className="text-gray-200 max-w-2xl mx-auto font-story italic text-lg leading-relaxed">
            From the rural fields of Darbhanga with the NSS to architecting AI solutions in New Delhi, my mission remains the same: harness technology and leadership to empower communities.
          </p>
          <div className="pt-8">
             <Link to="/contact" className="inline-block text-brand font-bold uppercase tracking-[0.3em] text-xs hover:tracking-[0.4em] transition-all">
               Collaborate with me
             </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
