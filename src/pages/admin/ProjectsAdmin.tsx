import { useState, useEffect } from 'react';
import { api } from '@/src/lib/api';
import { Project } from '@/src/types';
import { Plus, Edit, Trash2, Check, X, Image as ImageIcon, Save } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import RichTextEditor from '@/src/components/admin/RichTextEditor';

export default function ProjectsAdmin() {
// ...
  const [projects, setProjects] = useState<Project[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project> | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await api.projects.list();
      setProjects(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (project: Project | null) => {
    setCurrentProject(project || {
      title: '',
      slug: '',
      description: '',
      fullDescription: '',
      techStack: [],
      projectType: 'Full Project',
      featured: false,
      status: 'draft',
      featuredImage: '',
      images: []
    });
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentProject?.id) {
        await api.projects.update(currentProject.id, currentProject);
      } else {
        await api.projects.create(currentProject);
      }
      setIsEditing(false);
      fetchProjects();
      alert('Project saved successfully!');
    } catch (err) {
      alert('Error saving project');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await api.projects.delete(id);
      fetchProjects();
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-text-primary">Manage Projects</h1>
          <p className="text-text-secondary">Add, edit or remove projects from your portfolio.</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => handleEdit(null)}
            className="flex items-center gap-2 px-6 py-3 bg-text-primary text-bg-primary rounded-xl font-bold hover:bg-brand hover:text-white transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" /> Add Project
          </button>
        )}
      </header>

      {isEditing ? (
        <form onSubmit={handleSave} className="bg-bg-secondary p-8 rounded-2xl border border-border-theme shadow-xl space-y-6 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text-secondary/70">Project Title</label>
              <input 
                required
                className="w-full px-4 py-3 rounded-xl bg-bg-primary border-2 border-transparent focus:bg-bg-secondary focus:border-brand focus:outline-none text-text-primary transition-all"
                value={currentProject?.title}
                onChange={e => setCurrentProject({ ...currentProject, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text-secondary/70">Slug</label>
              <input 
                required
                className="w-full px-4 py-3 rounded-xl bg-bg-primary border-2 border-transparent focus:bg-bg-secondary focus:border-brand focus:outline-none text-text-primary transition-all"
                value={currentProject?.slug}
                onChange={e => setCurrentProject({ ...currentProject, slug: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text-secondary/70">Featured Image Path (Main)</label>
              <input 
                className="w-full px-4 py-3 rounded-xl bg-bg-primary border-2 border-transparent focus:bg-bg-secondary focus:border-brand focus:outline-none text-text-primary transition-all"
                value={currentProject?.featuredImage}
                onChange={e => setCurrentProject({ ...currentProject, featuredImage: e.target.value })}
                placeholder="/images/projects/photo.png"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text-secondary/70">Gallery Images (Paths)</label>
              <div className="space-y-2">
                {(currentProject?.images || []).map((img, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input 
                      className="flex-1 px-4 py-2 rounded-lg bg-bg-primary border border-border-theme focus:border-brand focus:outline-none text-text-primary transition-all"
                      value={img}
                      onChange={e => {
                        const newImages = [...(currentProject?.images || [])];
                        newImages[idx] = e.target.value;
                        setCurrentProject({ ...currentProject, images: newImages });
                      }}
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        const newImages = (currentProject?.images || []).filter((_, i) => i !== idx);
                        setCurrentProject({ ...currentProject, images: newImages });
                      }}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button 
                  type="button"
                  onClick={() => setCurrentProject({ ...currentProject, images: [...(currentProject?.images || []), ''] })}
                  className="w-full py-2 border-2 border-dashed border-border-theme rounded-xl text-text-secondary/60 hover:text-brand hover:border-brand transition-all flex items-center justify-center gap-2 text-xs font-bold"
                >
                  <Plus className="w-3 h-3" /> Add Gallery Image
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-text-secondary/70">Short Description</label>
            <textarea 
              required
              rows={2}
              className="w-full px-4 py-3 rounded-xl bg-bg-primary border-2 border-transparent focus:bg-bg-secondary focus:border-brand focus:outline-none resize-none text-text-primary transition-all"
              value={currentProject?.description}
              onChange={e => setCurrentProject({ ...currentProject, description: e.target.value })}
            />
          </div>

          <div className="space-y-4">
            <RichTextEditor 
              label="Full Project Story (Markdown)"
              id="project-full-desc"
              value={currentProject?.fullDescription || ''}
              onChange={(val) => setCurrentProject({ ...currentProject, fullDescription: val })}
              placeholder="Deep dive into the project architecture, challenges, and solutions..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text-secondary/70">Project Type</label>
              <select 
                className="w-full px-4 py-3 rounded-xl bg-bg-primary border-2 border-transparent focus:border-brand text-text-primary transition-all"
                value={currentProject?.projectType}
                onChange={e => setCurrentProject({ ...currentProject, projectType: e.target.value as any })}
              >
                <option value="Case Study" className="bg-bg-secondary">Case Study</option>
                <option value="Full Project" className="bg-bg-secondary">Full Project</option>
                <option value="Experiment" className="bg-bg-secondary">Experiment</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text-secondary/70">Status</label>
              <select 
                className="w-full px-4 py-3 rounded-xl bg-bg-primary border-2 border-transparent focus:border-brand text-text-primary transition-all"
                value={currentProject?.status}
                onChange={e => setCurrentProject({ ...currentProject, status: e.target.value as any })}
              >
                <option value="draft" className="bg-bg-secondary">Draft</option>
                <option value="published" className="bg-bg-secondary">Published</option>
              </select>
            </div>
            <div className="flex items-center gap-2 pt-6">
               <input 
                type="checkbox" 
                id="featured"
                className="rounded border-border-theme text-brand focus:ring-brand"
                checked={currentProject?.featured}
                onChange={e => setCurrentProject({ ...currentProject, featured: e.target.checked })}
               />
               <label htmlFor="featured" className="text-sm font-bold text-text-secondary">Featured on Home</label>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-border-theme">
            <button 
              type="button" 
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 rounded-xl font-bold text-text-secondary hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-8 py-3 bg-brand text-white rounded-xl font-bold hover:bg-brand/90 shadow-lg transition-all"
            >
              Save Project
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-bg-secondary rounded-2xl border border-border-theme shadow-sm overflow-hidden transition-all">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-bg-primary text-xs font-bold uppercase tracking-widest text-text-secondary/70">
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-theme">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-bg-primary/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {project.featuredImage ? (
                        <img src={project.featuredImage} className="w-10 h-10 rounded-lg object-cover border border-border-theme" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-bg-primary flex items-center justify-center border border-border-theme">
                          <ImageIcon className="w-4 h-4 text-text-secondary/40" />
                        </div>
                      )}
                      <span className="font-bold text-text-primary group-hover:text-brand transition-colors">{project.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold px-2 py-1 bg-bg-primary text-text-secondary border border-border-theme rounded uppercase tracking-tighter">{project.projectType}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter border",
                      project.status === 'published' ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-bg-primary text-text-secondary border-border-theme"
                    )}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       <button onClick={() => handleEdit(project)} className="p-2 text-brand hover:bg-brand/10 rounded-lg transition-all"><Edit className="w-4 h-4" /></button>
                       <button onClick={() => handleDelete(project.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-text-secondary/40 italic font-serif">No projects yet. Add your first one!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
