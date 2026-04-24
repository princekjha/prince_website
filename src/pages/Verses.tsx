import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '@/src/lib/api';
import { CreativePiece } from '@/src/types';
import { PenTool, Feather, ScrollText, ZoomIn, ZoomOut, List as ListIcon, ChevronRight, Hash } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/src/lib/utils';

export default function Verses() {
  const [pieces, setPieces] = useState<CreativePiece[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activePieceId = searchParams.get('id');
  const [activeLang, setActiveLang] = useState('All');
  const [activeType, setActiveType] = useState('All');
  const [zoom, setZoom] = useState(1);

  const languages = ['All', 'Hindi', 'English', 'Maithili'];
  const types = ['All', 'Poem', 'Essay', 'Short Story', 'Other'];

  useEffect(() => {
    async function fetchPieces() {
      try {
        const data = await api.creative.list();
        const published = data.filter(p => p.status === 'published');
        setPieces(published);
        if (published.length > 0 && !activePieceId) {
          setSearchParams({ id: published[0].id }, { replace: true });
        }
      } catch (error) {
        console.error('Failed to fetch creative pieces:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPieces();
  }, []);

  const filteredPieces = pieces.filter(p => {
    const langMatch = activeLang === 'All' || p.language === activeLang;
    const typeMatch = activeType === 'All' || p.type === activeType;
    return langMatch && typeMatch;
  });

  const activePiece = pieces.find(p => p.id === activePieceId) || filteredPieces[0];

  const playSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    audio.volume = 0.2;
    audio.play().catch(e => console.log('Audio play blocked or failed'));
  };

  const handlePieceSelect = (id: string) => {
    if (id !== activePieceId) {
      playSound();
      setSearchParams({ id });
    }
  };

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.min(Math.max(prev + delta, 0.5), 2));
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-bg-primary">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col md:flex-row transition-colors duration-300">
      {/* Sidebar: Index & Filters */}
      <aside className="w-full md:w-80 lg:w-96 border-r border-border-theme bg-bg-secondary overflow-y-auto max-h-screen sticky top-16 pt-10">
        <div className="p-6 space-y-10">
          <header>
            <div className="flex items-center gap-3 mb-4">
              <Feather className="w-6 h-6 text-brand" />
              <h1 className="text-2xl font-serif font-bold text-text-primary">Ink & Verses</h1>
            </div>
            <p className="text-sm text-text-secondary font-story italic">
              A multilingual chronicle of thoughts and syllables.
            </p>
          </header>

          {/* Filters */}
            <div className="space-y-6">
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary/40">Language</span>
                <div className="flex flex-wrap gap-2">
                  {languages.map(lang => (
                    <button
                      key={lang}
                      onClick={() => { setActiveLang(lang); }}
                      className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold transition-all border",
                        activeLang === lang 
                          ? "bg-text-primary text-bg-primary border-text-primary" 
                          : "bg-bg-secondary text-text-secondary border-border-theme hover:border-brand"
                      )}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
 
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary/40">Category</span>
                <div className="flex flex-wrap gap-2">
                  {types.map(t => (
                    <button
                      key={t}
                      onClick={() => { setActiveType(t); }}
                      className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold transition-all border",
                        activeType === t 
                          ? "bg-brand text-white border-brand shadow-lg" 
                          : "bg-bg-secondary text-text-secondary border-border-theme hover:border-brand"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          {/* Index List - Compact & Scalable */}
          <nav className="space-y-2 border-t border-border-theme pt-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Hash className="w-3 h-3 text-brand/40" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary/40">Chronicle Index</span>
              </div>
              <span className="text-[9px] font-mono text-brand/20 font-bold">{filteredPieces.length} Ent.</span>
            </div>
            <div className="space-y-0.5 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredPieces.map((piece) => (
                <button
                  key={piece.id}
                  onClick={() => handlePieceSelect(piece.id)}
                  className={cn(
                    "w-full text-left px-4 py-2.5 rounded-lg transition-all duration-200 group flex items-center justify-between border border-transparent",
                    activePieceId === piece.id 
                    ? 'bg-bg-primary text-brand shadow-sm border-border-theme' 
                    : 'text-text-secondary/60 hover:bg-bg-primary/30 hover:text-text-secondary'
                  )}
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] font-serif font-bold truncate group-hover:translate-x-0.5 transition-transform">{piece.title}</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[7px] font-bold uppercase tracking-tighter text-brand bg-brand/5 px-1.5 rounded-sm">{piece.language}</span>
                      <span className="text-[7px] font-bold uppercase tracking-tighter opacity-30">{piece.type}</span>
                    </div>
                  </div>
                  <ChevronRight className={cn(
                    "w-3 h-3 transition-all duration-300 flex-shrink-0",
                    activePieceId === piece.id ? 'translate-x-0 opacity-100' : '-translate-x-1 opacity-0'
                  )} />
                </button>
              ))}
              {filteredPieces.length === 0 && (
                <div className="py-10 text-center text-[10px] text-text-secondary/40 italic">No matches in your chronicle.</div>
              )}
            </div>
          </nav>
        </div>
      </aside>

      {/* Main Content Area: split screen right side */}
      <main className="flex-1 relative bg-bg-primary overflow-hidden flex flex-col">
        {/* Controls Overlay */}
        <div className="absolute top-6 right-6 z-20 flex gap-2">
          <div className="flex bg-bg-secondary/80 backdrop-blur-md p-1.5 rounded-xl border border-border-theme shadow-xl">
             <button onClick={() => handleZoom(-0.1)} className="p-2 hover:bg-bg-primary rounded-lg text-text-secondary" title="Zoom Out"><ZoomOut className="w-5 h-5" /></button>
             <div className="flex items-center px-4 text-xs font-bold text-brand">{Math.round(zoom * 100)}%</div>
             <button onClick={() => handleZoom(0.1)} className="p-2 hover:bg-bg-primary rounded-lg text-text-secondary" title="Zoom In"><ZoomIn className="w-5 h-5" /></button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activePiece ? (
            <motion.div
              key={activePiece.id}
              initial={{ opacity: 0, x: 50, rotateY: 10 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: -50, rotateY: -10 }}
              transition={{ duration: 0.6, type: 'spring', damping: 20 }}
              className="flex-1 flex flex-col h-full overflow-y-auto scroll-smooth"
            >
              <div 
                className="max-w-3xl mx-auto px-8 md:px-16 py-24 w-full transition-transform duration-300 origin-top"
                style={{ transform: `scale(${zoom})` }}
              >
                <div className="relative group">
                  <div className="absolute -top-12 -left-12 p-8 text-text-primary/5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ScrollText className="w-64 h-64 rotate-12" />
                  </div>
                  
                  <div className="relative z-10 space-y-12">
                    <header className="space-y-4">
                      <div className="flex items-center gap-2 text-brand font-semibold text-xs uppercase tracking-[0.3em]">
                        <PenTool className="w-4 h-4" /> {activePiece.type} — {format(new Date(activePiece.dateWritten), 'MMMM yyyy')}
                      </div>
                      <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-text-primary leading-tight">
                        {activePiece.title}
                      </h2>
                    </header>

                    <div 
                      className={cn(
                        "font-story italic text-text-secondary whitespace-pre-wrap leading-[2.2em] max-w-none transition-all",
                        activePiece.language === 'English' ? "text-xl font-normal" : "text-2xl font-medium"
                      )}
                    >
                      {activePiece.content}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-text-secondary/20">
               <Feather className="w-24 h-24 mb-6 opacity-20" />
               <p className="font-serif italic text-xl">Select a verse to begin reading.</p>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
