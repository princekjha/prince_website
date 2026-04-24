import { motion } from 'motion/react';
import { Bold, Italic, List, Link as LinkIcon, Eye, Code } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useState } from 'react';
import { cn } from '@/src/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  id?: string;
}

export default function RichTextEditor({ value, onChange, label, placeholder, id }: RichTextEditorProps) {
  const [mode, setMode] = useState<'write' | 'preview'>('write');

  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById(id || 'rich-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = value.substring(0, start);
    const selection = value.substring(start, end);
    const after = value.substring(end);

    const newText = before + prefix + (selection || 'text') + suffix + after;
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {label && <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary/40">{label}</label>}
        
        <div className="flex items-center gap-1 bg-bg-primary border border-border-theme p-1 rounded-xl shadow-sm">
          <button 
            type="button"
            onClick={() => setMode('write')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
              mode === 'write' ? "bg-text-primary text-bg-primary shadow-sm" : "text-text-secondary hover:bg-bg-secondary"
            )}
          >
            <Code className="w-3 h-3" /> Write
          </button>
          <button 
            type="button"
            onClick={() => setMode('preview')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
              mode === 'preview' ? "bg-text-primary text-bg-primary shadow-sm" : "text-text-secondary hover:bg-bg-secondary"
            )}
          >
            <Eye className="w-3 h-3" /> Preview
          </button>
        </div>
      </div>

      {mode === 'write' ? (
        <div className="relative group">
          {/* Toolbar Overlay on Focus */}
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-focus-within:opacity-100 transition-opacity z-10 bg-bg-secondary/80 backdrop-blur-sm p-1 rounded-xl border border-border-theme">
            <button type="button" onClick={() => insertFormatting('**', '**')} className="p-2 hover:bg-bg-primary rounded-lg transition-colors text-text-primary" title="Bold"><Bold className="w-4 h-4" /></button>
            <button type="button" onClick={() => insertFormatting('_', '_')} className="p-2 hover:bg-bg-primary rounded-lg transition-colors text-text-primary" title="Italic"><Italic className="w-4 h-4" /></button>
            <button type="button" onClick={() => insertFormatting('- ')} className="p-2 hover:bg-bg-primary rounded-lg transition-colors text-text-primary" title="List"><List className="w-4 h-4" /></button>
            <button type="button" onClick={() => insertFormatting('[', '](url)')} className="p-2 hover:bg-bg-primary rounded-lg transition-colors text-text-primary" title="Link"><LinkIcon className="w-4 h-4" /></button>
          </div>
          
          <textarea 
            id={id || 'rich-editor'}
            className="w-full p-6 bg-bg-primary border border-border-theme rounded-2xl min-h-[300px] text-text-primary focus:ring-2 focus:ring-brand focus:bg-bg-secondary outline-none transition-all font-sans text-base leading-relaxed placeholder:text-text-secondary/20"
            placeholder={placeholder || "Start writing your story..."}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      ) : (
        <div className="w-full p-8 bg-bg-secondary border border-border-theme rounded-2xl min-h-[300px] prose prose-slate max-w-none prose-headings:font-serif prose-p:font-story prose-p:italic prose-p:text-lg">
          {value ? (
            <ReactMarkdown>{value}</ReactMarkdown>
          ) : (
            <div className="h-full flex items-center justify-center text-text-secondary/20 italic">
              Nothing to preview yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
