import { useState, useEffect } from 'react';
import { api } from '@/src/lib/api';
import { BlogPost } from '@/src/types';
import { Plus, Edit, Trash2, ImageIcon } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function BlogAdmin() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost> | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await api.blog.list();
      setPosts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (post: BlogPost | null) => {
    setCurrentPost(post || {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: 'Engineering',
      tags: [],
      readTime: '5 min',
      status: 'draft',
      publishDate: new Date().toISOString().split('T')[0],
      featuredImage: ''
    });
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentPost?.id) {
        await api.blog.update(currentPost.id, currentPost);
      } else {
        await api.blog.create(currentPost);
      }
      setIsEditing(false);
      fetchPosts();
      alert('Blog post saved successfully!');
    } catch (err) {
      alert('Error saving post');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this post?')) {
      await api.blog.delete(id);
      fetchPosts();
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#1A1A2E]">Blog CMS</h1>
          <p className="text-gray-500">Manage your articles and essays.</p>
        </div>
        {!isEditing && (
          <button onClick={() => handleEdit(null)} className="flex items-center gap-2 px-6 py-3 bg-[#1A1A2E] text-white rounded-xl font-bold hover:bg-[#2C3E50]">
            <Plus className="w-5 h-5" /> New Post
          </button>
        )}
      </header>

      {isEditing ? (
        <form onSubmit={handleSave} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xl space-y-6 max-w-4xl">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Post Title</label>
              <input 
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#E67E22] focus:outline-none"
                value={currentPost?.title}
                onChange={e => setCurrentPost({ ...currentPost, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Slug</label>
              <input required className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#E67E22] focus:outline-none" value={currentPost?.slug} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Excerpt</label>
            <textarea required rows={2} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#E67E22] resize-none" value={currentPost?.excerpt} onChange={e => setCurrentPost({...currentPost, excerpt: e.target.value})} />
          </div>

          <div className="space-y-2">
             <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Content (Markdown)</label>
             <textarea required rows={10} className="w-full px-4 py-3 rounded-xl bg-gray-50 font-mono text-sm border-2 border-transparent focus:bg-white focus:border-[#E67E22] resize-none" value={currentPost?.content} onChange={e => setCurrentPost({...currentPost, content: e.target.value})} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Category</label>
                <select className="w-full px-4 py-3 rounded-xl bg-gray-50" value={currentPost?.category} onChange={e => setCurrentPost({...currentPost, category: e.target.value})}>
                  {['Engineering', 'Design', 'Personal', 'Tutorial'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Status</label>
                <select className="w-full px-4 py-3 rounded-xl bg-gray-50" value={currentPost?.status} onChange={e => setCurrentPost({...currentPost, status: e.target.value as any})}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Read Time</label>
                <input className="w-full px-4 py-3 rounded-xl bg-gray-50" value={currentPost?.readTime} onChange={e => setCurrentPost({...currentPost, readTime: e.target.value})} />
             </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
             <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3 font-bold text-gray-500">Cancel</button>
             <button type="submit" className="px-8 py-3 bg-[#1A1A2E] text-white rounded-xl font-bold">Save Post</button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
           <table className="w-full text-left">
              <thead>
                 <tr className="bg-gray-50 text-xs font-bold uppercase tracking-widest text-gray-400">
                   <th className="px-6 py-4">Article</th>
                   <th className="px-6 py-4">Category</th>
                   <th className="px-6 py-4">Status</th>
                   <th className="px-6 py-4 text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                 {posts.map(post => (
                   <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-[#1A1A2E]">{post.title}</td>
                      <td className="px-6 py-4"><span className="text-xs font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded">{post.category}</span></td>
                      <td className="px-6 py-4"><span className={cn("text-xs font-bold px-2 py-1 rounded-full", post.status === 'published' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500")}>{post.status}</span></td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                         <button onClick={() => handleEdit(post)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                         <button onClick={() => handleDelete(post.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      )}
    </div>
  );
}
