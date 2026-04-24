import { useState, useEffect } from 'react';
import { api } from '@/src/lib/api';
import { Plus, Trash2, Edit, Save, X, ChevronDown, ChevronUp, Layers, Award, Clock } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface IndividualSkill {
  name: string;
  level: string;
  subSkills: string;
}

interface SkillCategory {
  id: string;
  category: string;
  skills: IndividualSkill[];
}

export default function SkillsAdmin() {
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<SkillCategory>>({});

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const data = await api.skills.list();
      setSkillCategories(data);
    } catch (error) {
      console.error('Failed to fetch skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = () => {
    const newCat: Partial<SkillCategory> = {
      category: 'New Domain',
      skills: []
    };
    api.skills.create(newCat).then(() => {
      fetchSkills();
      alert('Domain category created!');
    }).catch(err => {
      alert('Failed to create domain: ' + err.message);
    });
  };

  const handleUpdate = (id: string) => {
    api.skills.update(id, editForm).then(() => {
      setEditingId(null);
      fetchSkills();
      alert('Technical assets updated successfully!');
    }).catch(err => {
      alert('Failed to update: ' + err.message);
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this entire category and all its skills?')) {
      api.skills.delete(id).then(fetchSkills);
    }
  };

  const startEditing = (cat: SkillCategory) => {
    setEditingId(cat.id);
    setEditForm(cat);
  };

  const addSkillToForm = () => {
    const skills = [...(editForm.skills || [])];
    skills.push({ name: 'New Skill', level: 'Intermediate', subSkills: '' });
    setEditForm({ ...editForm, skills });
  };

  const removeSkillFromForm = (idx: number) => {
    const skills = [...(editForm.skills || [])];
    skills.splice(idx, 1);
    setEditForm({ ...editForm, skills });
  };

  const updateSkillInForm = (idx: number, field: keyof IndividualSkill, value: string) => {
    const skills = [...(editForm.skills || [])];
    skills[idx] = { ...skills[idx], [field]: value };
    setEditForm({ ...editForm, skills });
  };

  if (loading) return <div>Exploring technical assets...</div>;

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-text-primary">Technical Inventory</h1>
          <p className="text-text-secondary">Curate your proficiency and market impact.</p>
        </div>
        <button 
          onClick={handleCreateCategory}
          className="bg-text-primary text-bg-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-brand hover:text-white transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" /> Add Category
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {skillCategories.map((cat) => (
          <div key={cat.id} className="bg-bg-secondary p-8 rounded-3xl border border-border-theme shadow-sm transition-all hover:shadow-md">
            {editingId === cat.id ? (
              <div className="space-y-6">
                <div className="flex items-end gap-6 border-b border-border-theme pb-6">
                  <div className="flex-1">
                    <label className="text-xs font-bold uppercase text-text-secondary/60 mb-2 block">Category / Domain Name</label>
                    <input 
                      className="w-full p-4 border border-border-theme rounded-2xl bg-bg-primary focus:bg-bg-secondary focus:ring-2 focus:ring-brand transition-all font-serif font-bold text-xl text-text-primary"
                      value={editForm.category}
                      onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h5 className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary/40">Individual Assets</h5>
                    <button 
                      onClick={addSkillToForm}
                      className="text-xs font-bold text-brand bg-brand/5 px-4 py-2 rounded-xl hover:bg-brand/10 transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add Skillset
                    </button>
                  </div>

                  <div className="space-y-3">
                    {editForm.skills?.map((skill, sIdx) => (
                      <div key={sIdx} className="grid grid-cols-12 gap-4 items-center bg-bg-primary/50 p-4 rounded-2xl border border-border-theme group">
                        <div className="col-span-12 md:col-span-4">
                          <label className="text-[9px] font-bold text-text-secondary/40 uppercase mb-1 block">Skill Name</label>
                          <input 
                            className="w-full px-3 py-2 border border-border-theme rounded-lg bg-bg-secondary text-sm font-medium text-text-primary"
                            value={skill.name}
                            onChange={e => updateSkillInForm(sIdx, 'name', e.target.value)}
                          />
                        </div>
                        <div className="col-span-6 md:col-span-3">
                          <label className="text-[9px] font-bold text-text-secondary/40 uppercase mb-1 block">Level</label>
                          <select 
                             className="w-full px-3 py-2 border border-border-theme rounded-lg bg-bg-secondary text-sm font-medium text-text-primary"
                             value={skill.level}
                             onChange={e => updateSkillInForm(sIdx, 'level', e.target.value)}
                          >
                            <option value="Expert">Expert</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Conceptual">Conceptual</option>
                          </select>
                        </div>
                        <div className="col-span-6 md:col-span-4">
                          <label className="text-[9px] font-bold text-text-secondary/40 uppercase mb-1 block">Sub-skills / Concepts</label>
                          <input 
                            className="w-full px-3 py-2 border border-border-theme rounded-lg bg-bg-secondary text-sm font-medium text-text-primary"
                            value={skill.subSkills}
                            onChange={(e: any) => updateSkillInForm(sIdx, 'subSkills', e.target.value)}
                          />
                        </div>
                        <div className="col-span-12 md:col-span-1 flex justify-end">
                           <button 
                             onClick={() => removeSkillFromForm(sIdx)}
                             className="p-2 text-red-300 hover:text-red-500 transition-colors"
                           >
                             <Trash2 className="w-5 h-5" />
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-border-theme">
                  <button onClick={() => setEditingId(null)} className="px-6 py-3 text-text-secondary font-bold hover:bg-bg-primary rounded-xl transition-all">Cancel</button>
                  <button 
                    onClick={() => handleUpdate(cat.id)}
                    className="px-8 py-3 bg-brand text-white rounded-xl font-bold flex items-center gap-3 hover:bg-brand/80 transition-all shadow-lg"
                  >
                    <Save className="w-5 h-5" /> Commit Assets
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-text-primary flex items-center justify-center text-bg-primary shadow-lg">
                    <Layers className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-text-primary">{cat.category}</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1.5 text-text-secondary/60">
                        <Award className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary/60">{cat.skills?.length || 0} Professional Assets</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button onClick={() => startEditing(cat)} className="p-3 text-text-secondary/40 hover:text-text-primary hover:bg-bg-primary transition-all rounded-xl">
                    <Edit className="w-6 h-6" />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="p-3 text-text-secondary/40 hover:text-red-500 hover:bg-red-500/10 transition-all rounded-xl">
                    <Trash2 className="w-6 h-6" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {skillCategories.length === 0 && (
          <div className="text-center py-24 bg-bg-secondary rounded-[3rem] border-4 border-dashed border-border-theme flex flex-col items-center">
             <div className="w-20 h-20 bg-bg-primary rounded-full flex items-center justify-center mb-6">
               <Layers className="text-text-secondary/20 w-10 h-10" />
             </div>
             <p className="text-text-secondary/60 font-serif italic text-xl">Your skill ecosystem is currently empty.</p>
             <button onClick={handleCreateCategory} className="mt-4 text-brand font-bold hover:underline">Architect your first domain</button>
          </div>
        )}
      </div>
    </div>
  );
}
