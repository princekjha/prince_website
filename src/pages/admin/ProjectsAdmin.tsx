// import { useState, useEffect } from 'react';
// import { api } from '@/src/lib/api';
// import { Project } from '@/src/types';
// import { Plus, Edit, Trash2, Check, X, Image as ImageIcon, Save } from 'lucide-react';
// import { cn } from '@/src/lib/utils';
// import RichTextEditor from '@/src/components/admin/RichTextEditor';

// export default function ProjectsAdmin() {
// // ...
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentProject, setCurrentProject] = useState<Partial<Project> | null>(null);

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   const fetchProjects = async () => {
//     try {
//       const data = await api.projects.list();
//       setProjects(data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleEdit = (project: Project | null) => {
//     setCurrentProject(project || {
//       title: '',
//       slug: '',
//       description: '',
//       fullDescription: '',
//       techStack: [],
//       projectType: 'Full Project',
//       featured: false,
//       status: 'draft',
//       featuredImage: ''
//     });
//     setIsEditing(true);
//   };

//   const handleSave = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       if (currentProject?.id) {
//         await api.projects.update(currentProject.id, currentProject);
//       } else {
//         await api.projects.create(currentProject);
//       }
//       setIsEditing(false);
//       fetchProjects();
//       alert('Project saved successfully!');
//     } catch (err) {
//       alert('Error saving project');
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (confirm('Are you sure you want to delete this project?')) {
//       await api.projects.delete(id);
//       fetchProjects();
//     }
//   };

//   return (
//     <div className="space-y-8">
//       <header className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-serif font-bold text-[#1A1A2E]">Manage Projects</h1>
//           <p className="text-gray-500">Add, edit or remove projects from your portfolio.</p>
//         </div>
//         {!isEditing && (
//           <button 
//             onClick={() => handleEdit(null)}
//             className="flex items-center gap-2 px-6 py-3 bg-[#1A1A2E] text-white rounded-xl font-bold hover:bg-[#2C3E50] transition-colors"
//           >
//             <Plus className="w-5 h-5" /> Add Project
//           </button>
//         )}
//       </header>

//       {isEditing ? (
//         <form onSubmit={handleSave} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xl space-y-6 max-w-4xl">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Project Title</label>
//               <input 
//                 required
//                 className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#E67E22] focus:outline-none"
//                 value={currentProject?.title}
//                 onChange={e => setCurrentProject({ ...currentProject, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
//               />
//             </div>
//             <div className="space-y-2">
//               <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Slug</label>
//               <input 
//                 required
//                 className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#E67E22] focus:outline-none"
//                 value={currentProject?.slug}
//                 onChange={e => setCurrentProject({ ...currentProject, slug: e.target.value })}
//               />
//             </div>
//           </div>

//           <div className="space-y-2">
//             <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Featured Image URL</label>
//             <input 
//               className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#E67E22] focus:outline-none"
//               value={currentProject?.featuredImage}
//               onChange={e => setCurrentProject({ ...currentProject, featuredImage: e.target.value })}
//               placeholder="https://images.unsplash.com/..."
//             />
//           </div>

//           <div className="space-y-2">
//             <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Short Description</label>
//             <textarea 
//               required
//               rows={2}
//               className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#E67E22] focus:outline-none resize-none"
//               value={currentProject?.description}
//               onChange={e => setCurrentProject({ ...currentProject, description: e.target.value })}
//             />
//           </div>

//           <div className="space-y-4">
//             <RichTextEditor 
//               label="Full Project Story (Markdown)"
//               id="project-full-desc"
//               value={currentProject?.fullDescription || ''}
//               onChange={(val) => setCurrentProject({ ...currentProject, fullDescription: val })}
//               placeholder="Deep dive into the project architecture, challenges, and solutions..."
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="space-y-2">
//               <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Project Type</label>
//               <select 
//                 className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white"
//                 value={currentProject?.projectType}
//                 onChange={e => setCurrentProject({ ...currentProject, projectType: e.target.value as any })}
//               >
//                 <option value="Case Study">Case Study</option>
//                 <option value="Full Project">Full Project</option>
//                 <option value="Experiment">Experiment</option>
//               </select>
//             </div>
//             <div className="space-y-2">
//               <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Status</label>
//               <select 
//                 className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white"
//                 value={currentProject?.status}
//                 onChange={e => setCurrentProject({ ...currentProject, status: e.target.value as any })}
//               >
//                 <option value="draft">Draft</option>
//                 <option value="published">Published</option>
//               </select>
//             </div>
//             <div className="flex items-center gap-2 pt-6">
//                <input 
//                 type="checkbox" 
//                 id="featured"
//                 checked={currentProject?.featured}
//                 onChange={e => setCurrentProject({ ...currentProject, featured: e.target.checked })}
//                />
//                <label htmlFor="featured" className="text-sm font-bold text-gray-600">Featured on Home</label>
//             </div>
//           </div>

//           <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
//             <button 
//               type="button" 
//               onClick={() => setIsEditing(false)}
//               className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//             <button 
//               type="submit"
//               className="px-8 py-3 bg-[#E67E22] text-white rounded-xl font-bold hover:bg-[#D35400] shadow-lg transition-all"
//             >
//               Save Project
//             </button>
//           </div>
//         </form>
//       ) : (
//         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//           <table className="w-full text-left">
//             <thead>
//               <tr className="bg-gray-50 text-xs font-bold uppercase tracking-widest text-gray-400">
//                 <th className="px-6 py-4">Project</th>
//                 <th className="px-6 py-4">Type</th>
//                 <th className="px-6 py-4">Status</th>
//                 <th className="px-6 py-4 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {projects.map((project) => (
//                 <tr key={project.id} className="hover:bg-gray-50 transition-colors">
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-4">
//                       {project.featuredImage ? (
//                         <img src={project.featuredImage} className="w-10 h-10 rounded-lg object-cover" />
//                       ) : (
//                         <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
//                           <ImageIcon className="w-4 h-4 text-gray-400" />
//                         </div>
//                       )}
//                       <span className="font-bold text-[#1A1A2E]">{project.title}</span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <span className="text-xs font-bold px-2 py-1 bg-gray-100 rounded uppercase">{project.projectType}</span>
//                   </td>
//                   <td className="px-6 py-4">
//                     <span className={cn(
//                       "text-xs font-bold px-2 py-1 rounded-full uppercase",
//                       project.status === 'published' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
//                     )}>
//                       {project.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 text-right">
//                     <div className="flex justify-end gap-2">
//                        <button onClick={() => handleEdit(project)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
//                        <button onClick={() => handleDelete(project.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//               {projects.length === 0 && (
//                 <tr>
//                   <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">No projects yet. Add your first one!</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

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
          <h1 className="text-3xl font-serif font-bold text-[#1A1A2E]">Manage Projects</h1>
          <p className="text-gray-500">Add, edit or remove projects from your portfolio.</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => handleEdit(null)}
            className="flex items-center gap-2 px-6 py-3 bg-[#1A1A2E] text-white rounded-xl font-bold hover:bg-[#2C3E50] transition-colors"
          >
            <Plus className="w-5 h-5" /> Add Project
          </button>
        )}
      </header>

      {isEditing ? (
        <form onSubmit={handleSave} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xl space-y-6 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Project Title</label>
              <input 
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#E67E22] focus:outline-none"
                value={currentProject?.title}
                onChange={e => setCurrentProject({ ...currentProject, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Slug</label>
              <input 
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#E67E22] focus:outline-none"
                value={currentProject?.slug}
                onChange={e => setCurrentProject({ ...currentProject, slug: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Featured Image Path (Main)</label>
              <input 
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#E67E22] focus:outline-none"
                value={currentProject?.featuredImage}
                onChange={e => setCurrentProject({ ...currentProject, featuredImage: e.target.value })}
                placeholder="/images/projects/photo.png"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Gallery Images (Paths)</label>
              <div className="space-y-2">
                {(currentProject?.images || []).map((img, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input 
                      className="flex-1 px-4 py-2 rounded-lg bg-gray-50 border border-transparent focus:bg-white focus:border-[#E67E22] focus:outline-none"
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
                      className="p-2 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button 
                  type="button"
                  onClick={() => setCurrentProject({ ...currentProject, images: [...(currentProject?.images || []), ''] })}
                  className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:text-[#E67E22] transition-all flex items-center justify-center gap-2 text-xs font-bold"
                >
                  <Plus className="w-3 h-3" /> Add Gallery Image
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Short Description</label>
            <textarea 
              required
              rows={2}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#E67E22] focus:outline-none resize-none"
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
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Project Type</label>
              <select 
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white"
                value={currentProject?.projectType}
                onChange={e => setCurrentProject({ ...currentProject, projectType: e.target.value as any })}
              >
                <option value="Case Study">Case Study</option>
                <option value="Full Project">Full Project</option>
                <option value="Experiment">Experiment</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Status</label>
              <select 
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white"
                value={currentProject?.status}
                onChange={e => setCurrentProject({ ...currentProject, status: e.target.value as any })}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="flex items-center gap-2 pt-6">
               <input 
                type="checkbox" 
                id="featured"
                checked={currentProject?.featured}
                onChange={e => setCurrentProject({ ...currentProject, featured: e.target.checked })}
               />
               <label htmlFor="featured" className="text-sm font-bold text-gray-600">Featured on Home</label>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
            <button 
              type="button" 
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-8 py-3 bg-[#E67E22] text-white rounded-xl font-bold hover:bg-[#D35400] shadow-lg transition-all"
            >
              Save Project
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-xs font-bold uppercase tracking-widest text-gray-400">
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {project.featuredImage ? (
                        <img src={project.featuredImage} className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <ImageIcon className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                      <span className="font-bold text-[#1A1A2E]">{project.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold px-2 py-1 bg-gray-100 rounded uppercase">{project.projectType}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-xs font-bold px-2 py-1 rounded-full uppercase",
                      project.status === 'published' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    )}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       <button onClick={() => handleEdit(project)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                       <button onClick={() => handleDelete(project.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">No projects yet. Add your first one!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

