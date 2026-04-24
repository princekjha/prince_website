import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, X, MapPin, Milestone, GraduationCap, PenTool, BookOpen, Send, Home as HomeIcon, Maximize2, Minimize2, MessageCircleQuestion, ArrowUpRight, ChevronRight, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface Node {
  id: string;
  label: string;
  path: string;
  type: 'main' | 'sub';
  icon: any;
  parent?: string;
}

const NODES: Node[] = [
  { id: 'home', label: 'Home', path: '/', type: 'main', icon: HomeIcon },
  { id: 'about', label: 'About', path: '/about', type: 'main', icon: Milestone, parent: 'home' },
  { id: 'learning', label: 'Learning Hub', path: '/learning', type: 'main', icon: BookOpen, parent: 'home' },
  { id: 'verses', label: 'Ink & Verses', path: '/verses', type: 'main', icon: PenTool, parent: 'home' },
  { id: 'contact', label: 'Contact', path: '/contact', type: 'main', icon: Send, parent: 'home' },
  { id: 'professional', label: 'Professional', path: '/about#professional', type: 'sub', icon: MapPin, parent: 'about' },
  { id: 'academic', label: 'Academic', path: '/about#academic', type: 'sub', icon: GraduationCap, parent: 'about' },
  { id: 'origins', label: 'Origins', path: '/about#origins', type: 'sub', icon: HomeIcon, parent: 'about' },
];

export default function KnowledgeMap() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [expandedIds, setExpandedIds] = useState<string[]>(['home']);
  const navigate = useNavigate();
  const location = useLocation();
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as any)) {
        if (!(event.target as HTMLElement).closest('.compass-btn')) {
          setIsOpen(false);
        }
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleNavigate = (path: string) => {
    setIsOpen(false);
    if (path.includes('#')) {
      const [route, hash] = path.split('#');
      if (location.pathname === route) {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate(route);
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 300);
      }
    } else {
      navigate(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const renderTree = (parentId: string | null = null, depth = 0) => {
    const children = NODES.filter(n => n.parent === parentId || (parentId === null && !n.parent));
    
    return (
      <div className={cn("flex flex-col gap-4", depth > 0 && "ml-4 pl-4 border-l border-gray-100")}>
        {children.map(node => {
          const nodeChildren = NODES.filter(n => n.parent === node.id);
          const isNodeExpanded = expandedIds.includes(node.id);
          const isCurrent = location.pathname === node.path.split('#')[0] && 
                           (node.path.includes('#') ? location.hash === '#' + node.path.split('#')[1] : true);

          return (
            <div key={node.id} className="space-y-3">
              <div className="flex items-center gap-3 group">
                {/* Node Expansion / Trigger */}
                <button
                  onClick={() => nodeChildren.length > 0 ? toggleExpand(node.id) : handleNavigate(node.path)}
                  className={cn(
                    "w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 relative shrink-0",
                    isCurrent 
                      ? "bg-[#1A1A2E] text-white shadow-lg" 
                      : "bg-white border border-gray-100 text-gray-400 hover:border-[#E67E22] hover:text-[#E67E22]"
                  )}
                >
                  <node.icon className="w-4 h-4" />
                  {nodeChildren.length > 0 && (
                    <div className="absolute -bottom-1 -right-1 bg-[#E67E22] rounded-full p-0.5 border-2 border-white">
                      {isNodeExpanded ? <ChevronDown className="w-2 h-2 text-white" /> : <ChevronRight className="w-2 h-2 text-white" />}
                    </div>
                  )}
                </button>

                {/* Label & Direct Nav Arrow */}
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest truncate",
                    isCurrent ? "text-[#E67E22]" : "text-gray-500 group-hover:text-[#1A1A2E]"
                  )}>
                    {node.label}
                  </span>
                  
                  {/* Direct Jump Arrow */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigate(node.path);
                    }}
                    className="p-1.5 hover:bg-[#E67E22]/10 rounded-lg text-gray-300 hover:text-[#E67E22] transition-colors shrink-0"
                    title="Direct Jump"
                  >
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Children */}
              <AnimatePresence>
                {isNodeExpanded && nodeChildren.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    {renderTree(node.id, depth + 1)}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3">
        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.9 }}
              className="bg-[#1A1A2E] text-white px-4 py-3 rounded-2xl shadow-xl border border-white/10 mb-2 flex items-center gap-3 whitespace-nowrap"
            >
              <div className="w-8 h-8 bg-[#E67E22] rounded-full flex items-center justify-center text-sm">🧭</div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold tracking-tight">Need a guide? ✨</span>
                <span className="text-[9px] text-gray-400 font-medium tracking-wider uppercase italic">Explore the blueprint</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Knowledge Map Pop-over */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={popoverRef}
              initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: 'bottom right' }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0, 
                width: isExpanded ? '400px' : '300px',
                height: isExpanded ? '600px' : '450px'
              }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-50/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-200/50 overflow-hidden flex flex-col transition-all duration-300 ease-in-out"
            >
              <div className="px-6 py-5 border-b border-gray-200/30 flex items-center justify-between bg-white/50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#E67E22] rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#1A1A2E] opacity-80">Perspective Blueprint</span>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 hover:bg-gray-200/50 rounded-lg transition-colors text-gray-500 hover:text-[#1A1A2E]"
                    title={isExpanded ? "Collapse" : "Expand"}
                  >
                    {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-200/50 rounded-lg transition-colors text-gray-500 hover:text-[#1A1A2E]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar scroll-smooth">
                {renderTree(null)}
              </div>

              <div className="px-6 py-4 bg-gray-100/50 border-t border-gray-200/30">
                 <p className="text-[8px] font-bold uppercase tracking-[0.4em] text-gray-400">A hierarchy of defined intentions.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Compass Toggle Button */}
        <motion.button
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "compass-btn relative z-50 p-4 rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.15)] transition-all duration-500 overflow-hidden group",
            isOpen ? 'bg-[#E67E22] text-white rotate-90' : 'bg-[#1A1A2E] text-white'
          )}
        >
          <Compass className="w-6 h-6 relative z-10" />
          {!isOpen && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#E67E22]/10 to-transparent"
            />
          )}
        </motion.button>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E67E2233;
          border-radius: 10px;
        }
      `}</style>
    </>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
