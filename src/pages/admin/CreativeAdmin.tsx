import { useState, useEffect, useRef } from 'react';
import { api } from '@/src/lib/api';
import { CreativePiece } from '@/src/types';
import { Plus, Edit, Trash2, Bold, Italic, List, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { format } from 'date-fns';

export default function CreativeAdmin() {
  const [pieces, setPieces] = useState<CreativePiece[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPiece, setCurrentPiece] = useState<Partial<CreativePiece> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchPieces();
  }, []);

  const fetchPieces = async () => {
    try {
      const data = await api.creative.list();
      setPieces(data.sort((a, b) => new Date(b.dateWritten).getTime() - new Date(a.dateWritten).getTime()));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (piece: CreativePiece | null) => {
    setCurrentPiece(piece || {
      title: '',
      type: 'Poem',
      language: 'English',
      content: '',
      dateWritten: new Date().toISOString().split('T')[0],
      status: 'draft'
    });
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentPiece?.id) {
        await api.creative.update(currentPiece.id, currentPiece);
      } else {
        await api.creative.create(currentPiece);
      }
      setIsEditing(false);
      fetchPieces();
      alert('Creative piece saved successfully!');
    } catch (err) {
      alert('Error saving piece');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this piece?')) {
      await api.creative.delete(id);
      fetchPieces();
    }
  };

  const insertFormatting = (prefix: string, suffix: string = '') => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const text = currentPiece?.content || '';
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);

    const newText = before + prefix + selection + suffix + after;
    setCurrentPiece({ ...currentPiece, content: newText });

    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#1A1A2E]">Ink & Verses</h1>
          <p className="text-gray-500">Curate your multilingual poetic output.</p>
        </div>
        {!isEditing && (
          <button onClick={() => handleEdit(null)} className="flex items-center gap-2 px-6 py-3 bg-[#E67E22] text-white rounded-xl font-bold shadow-lg hover:bg-[#D35400] transition-all">
            <Plus className="w-5 h-5" /> New Piece
          </button>
        )}
      </header>

      {isEditing ? (
        <form onSubmit={handleSave} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xl space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 md:col-span-1">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Title</label>
              <input required className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#E67E22] outline-none transition-all placeholder:italic" placeholder="Verse Title" value={currentPiece?.title} onChange={e => setCurrentPiece({...currentPiece, title: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Category</label>
              <select className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#E67E22] outline-none" value={currentPiece?.type} onChange={e => setCurrentPiece({...currentPiece, type: e.target.value as any})}>
                 {['Poem', 'Essay', 'Short Story', 'Other'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Language</label>
              <select className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#E67E22] outline-none" value={currentPiece?.language} onChange={e => setCurrentPiece({...currentPiece, language: e.target.value as any})}>
                 {['Hindi', 'English', 'Maithili'].map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-4">
             <div className="flex justify-between items-center bg-gray-50 p-2 rounded-xl border border-gray-100">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-2">Content</span>
                <div className="flex gap-2">
                   <button type="button" onClick={() => insertFormatting('**', '**')} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all" title="Bold"><Bold className="w-4 h-4" /></button>
                   <button type="button" onClick={() => insertFormatting('_', '_')} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all" title="Italic"><Italic className="w-4 h-4" /></button>
                   <button type="button" onClick={() => insertFormatting('- ')} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all" title="List"><List className="w-4 h-4" /></button>
                   <button type="button" onClick={() => insertFormatting('[', '](url)')} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all" title="Link"><LinkIcon className="w-4 h-4" /></button>
                </div>
             </div>
             <textarea 
               ref={textareaRef}
               required 
               rows={15} 
               className="w-full px-6 py-6 rounded-2xl bg-gray-50 font-serif text-lg italic border-2 border-transparent focus:bg-white focus:border-[#E67E22] resize-none transition-all leading-loose" 
               placeholder="Write your verses here..."
               value={currentPiece?.content} 
               onChange={e => setCurrentPiece({...currentPiece, content: e.target.value})} 
             />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Date Written</label>
              <input type="date" className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-[#E67E22] outline-none" value={currentPiece?.dateWritten} onChange={e => setCurrentPiece({...currentPiece, dateWritten: e.target.value})} />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Status</label>
                <select className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-[#E67E22] outline-none" value={currentPiece?.status} onChange={e => setCurrentPiece({...currentPiece, status: e.target.value as any})}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
             <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3 font-bold text-gray-500 hover:text-gray-700 transition-colors">Cancel</button>
             <button type="submit" className="px-10 py-3 bg-[#E67E22] text-white rounded-xl font-bold shadow-lg hover:bg-[#D35400] transition-all">Save Piece</button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
           <table className="w-full text-left">
              <thead>
                 <tr className="bg-gray-50/50 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                   <th className="px-8 py-5">Title</th>
                   <th className="px-8 py-5">Language</th>
                   <th className="px-8 py-5">Category</th>
                   <th className="px-8 py-5">Date</th>
                   <th className="px-8 py-5 text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                 {pieces.map(piece => (
                   <tr key={piece.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <span className="font-serif font-bold text-[#1A1A2E] group-hover:text-[#E67E22] transition-colors">{piece.title}</span>
                      </td>
                      <td className="px-8 py-5">
                         <span className="text-[10px] font-bold uppercase bg-gray-100 px-2 py-1 rounded text-gray-500 tracking-tighter">
                            {piece.language || 'English'}
                         </span>
                      </td>
                      <td className="px-8 py-5 text-xs text-gray-500 italic font-story">{piece.type}</td>
                      <td className="px-8 py-5 text-xs text-gray-400 font-mono italic">{format(new Date(piece.dateWritten), 'MMM yyyy')}</td>
                      <td className="px-8 py-5 text-right flex justify-end gap-1">
                         <button onClick={() => handleEdit(piece)} className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit className="w-4 h-4" /></button>
                         <button onClick={() => handleDelete(piece.id)} className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                      </td>
                   </tr>
                 ))}
                 {pieces.length === 0 && (
                   <tr>
                     <td colSpan={5} className="py-20 text-center text-gray-300 italic font-serif">Your poetic journey starts here. Add your first piece!</td>
                   </tr>
                 )}
              </tbody>
           </table>
        </div>
      )}
    </div>
  );
}
