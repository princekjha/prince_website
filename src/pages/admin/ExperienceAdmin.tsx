import { useState, useEffect, useRef } from 'react';
import { api } from '@/src/lib/api';
import { Experience, ExperienceImage } from '@/src/types';
import { Plus, Trash2, Edit, Save, X, Image as ImageIcon, Upload, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import RichTextEditor from '@/src/components/admin/RichTextEditor';

export default function ExperienceAdmin() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  // ... rest of state ...
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Experience>>({});
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = () => {
    api.experience.list().then(setExperiences).finally(() => setLoading(false));
  };

  const handleCreate = () => {
    const newExp: Partial<Experience> = {
      organization: 'New Organization',
      role: 'Role Name',
      tenure: 'Start - End',
      images: [],
      description: '',
      status: 'published'
    };
    api.experience.create(newExp).then(() => {
      fetchExperiences();
      alert('Experience drafted. Please fill in details and click "Save Changes".');
    }).catch(err => {
      alert('Failed to create experience: ' + err.message);
    });
  };

  const handleUpdate = (id: string) => {
    api.experience.update(id, editForm).then(() => {
      setEditingId(null);
      fetchExperiences();
      alert('Experience saved successfully!');
    }).catch(err => {
      alert('Failed to save changes: ' + err.message);
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this experience?')) {
      api.experience.delete(id).then(fetchExperiences);
    }
  };

  const startEditing = (exp: Experience) => {
    setEditingId(exp.id);
    setEditForm(exp);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await api.upload(file);
      const newImage: ExperienceImage = { url: res.url, description: '' };
      setEditForm({
        ...editForm,
        images: [...(editForm.images || []), newImage]
      });
      alert('Image uploaded successfully!');
    } catch (error: any) {
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (idx: number) => {
    const images = [...(editForm.images || [])];
    images.splice(idx, 1);
    setEditForm({ ...editForm, images });
  };

  const updateImageDesc = (idx: number, desc: string) => {
    const images = [...(editForm.images || [])];
    images[idx] = { ...images[idx], description: desc };
    setEditForm({ ...editForm, images });
  };

  if (loading) return <div>Loading experiences...</div>;

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-text-primary">Professional Journey</h1>
          <p className="text-text-secondary">Manage your career history and impact.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="bg-text-primary text-bg-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-brand hover:text-white transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" /> Add Experience
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {experiences.map((exp) => (
          <div key={exp.id} className="bg-bg-secondary p-8 rounded-3xl border border-border-theme shadow-sm transition-all hover:shadow-md">
            {editingId === exp.id ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <label className="text-xs font-bold uppercase text-text-secondary/60 mb-2 block">Organization</label>
                    <input 
                      className="w-full p-3 border border-border-theme rounded-xl bg-bg-primary focus:bg-bg-secondary focus:ring-2 focus:ring-brand transition-all text-text-primary"
                      value={editForm.organization}
                      onChange={e => setEditForm({ ...editForm, organization: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-text-secondary/60 mb-2 block">Role</label>
                    <input 
                      className="w-full p-3 border border-border-theme rounded-xl bg-bg-primary focus:bg-bg-secondary focus:ring-2 focus:ring-brand transition-all text-text-primary"
                      value={editForm.role}
                      onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-text-secondary/60 mb-2 block">Tenure</label>
                    <input 
                      className="w-full p-3 border border-border-theme rounded-xl bg-bg-primary focus:bg-bg-secondary focus:ring-2 focus:ring-brand transition-all text-text-primary"
                      value={editForm.tenure}
                      onChange={e => setEditForm({ ...editForm, tenure: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <RichTextEditor 
                    label="Storytelling & Impact"
                    id="exp-description"
                    value={editForm.description || ''}
                    onChange={(val) => setEditForm({ ...editForm, description: val })}
                    placeholder="Tell the story of your impact here. Use markdown for rich formatting..."
                  />
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h5 className="text-sm font-bold uppercase tracking-widest text-text-primary">Visual Gallery</h5>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="text-sm font-bold text-brand flex items-center gap-2 hover:bg-brand/10 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
                    >
                      {uploading ? 'Uploading...' : <><Upload className="w-4 h-4" /> Upload Local Photo</>}
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload} 
                      className="hidden" 
                      accept="image/*"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {editForm.images?.map((img, idx) => (
                      <div key={idx} className="bg-bg-primary rounded-2xl overflow-hidden border border-border-theme shadow-sm relative group">
                        <button 
                          onClick={() => removeImage(idx)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <img src={img.url} className="w-full h-32 object-cover" />
                        <div className="p-3">
                          <textarea 
                            className="w-full p-2 text-xs border border-border-theme rounded-lg bg-bg-secondary text-text-primary"
                            placeholder="Add a storytelling context for this photo..."
                            value={img.description || ''}
                            onChange={e => updateImageDesc(idx, e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-border-theme">
                  <button onClick={() => setEditingId(null)} className="px-6 py-3 text-text-secondary font-bold hover:bg-bg-primary rounded-xl transition-all">Cancel</button>
                  <button 
                    onClick={() => handleUpdate(exp.id)}
                    className="px-8 py-3 bg-brand text-white rounded-xl font-bold flex items-center gap-3 hover:bg-brand/80 transition-all shadow-lg"
                  >
                    <Save className="w-5 h-5" /> Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-bg-primary border border-border-theme flex items-center justify-center">
                      <ImageIcon className="text-brand w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-serif font-bold text-text-primary">{exp.organization}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-brand font-bold text-xs uppercase tracking-widest">{exp.role}</p>
                        <span className="w-1 h-1 rounded-full bg-border-theme" />
                        <p className="text-text-secondary/60 text-xs font-bold tracking-tight">{exp.tenure}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-[10px] bg-bg-primary px-3 py-1.5 rounded-full text-text-secondary font-bold border border-border-theme tracking-tight">
                      {exp.description ? 'Story Written' : 'Draft'}
                    </span>
                    <span className="text-[10px] bg-bg-primary px-3 py-1.5 rounded-full text-text-secondary font-bold border border-border-theme tracking-tight">
                      {exp.images?.length || 0} Photos
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEditing(exp)} className="p-3 text-text-secondary/60 hover:text-text-primary hover:bg-bg-primary rounded-xl transition-all">
                    <Edit className="w-6 h-6" />
                  </button>
                  <button onClick={() => handleDelete(exp.id)} className="p-3 text-text-secondary/60 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                    <Trash2 className="w-6 h-6" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {experiences.length === 0 && (
          <div className="text-center py-20 bg-bg-secondary rounded-[2rem] border-4 border-dashed border-border-theme flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-bg-primary flex items-center justify-center mb-6">
              <Plus className="text-text-secondary/20 w-10 h-10" />
            </div>
            <p className="text-text-secondary/60 italic font-serif text-lg">Your professional story starts here.</p>
            <button 
              onClick={handleCreate}
              className="mt-6 text-brand font-bold hover:underline"
            >
              Add your first milestone
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
