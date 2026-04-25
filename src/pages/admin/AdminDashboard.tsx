// // import { useState, useEffect } from 'react';
// // import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
// import { Routes, Route, Link, useLocation, useNavigate, Navigate, Outlet } from 'react-router-dom';
// import { LayoutDashboard, Briefcase, BookOpen, PenTool, MessageSquare, LogOut, Plus, Edit, Trash2, Check, X, Award } from 'lucide-react';
// import { api } from '@/src/lib/api';
// import { cn } from '@/src/lib/utils';
// // import ProjectsAdmin from './ProjectsAdmin';
// // import BlogAdmin from './BlogAdmin';
// // import CreativeAdmin from './CreativeAdmin';
// // import LearningAdmin from './LearningAdmin';
// // import ExperienceAdmin from './ExperienceAdmin';
// // import SkillsAdmin from './SkillsAdmin';

// export default function AdminDashboard() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem('admin_token');
//     navigate('/');
//     window.location.reload();
//   };

//   const navItems = [
//     { name: 'Overview', href: '/admin', icon: LayoutDashboard, exact: true },
//     { name: 'Articles (Blog)', href: '/admin/blog', icon: MessageSquare },
//     { name: 'Ink & Verses', href: '/admin/creative', icon: PenTool },
//     { name: 'Learning Hub', href: '/admin/learning', icon: BookOpen },
//     { name: 'Experiences (Jobs)', href: '/admin/experience', icon: Briefcase },
//     { name: 'Technical Skills', href: '/admin/skills', icon: Award },
//     { name: 'Projects', href: '/admin/projects', icon: LayoutDashboard },
//   ];

//   return (
//     <div className="min-h-[calc(100vh-64px)] flex bg-bg-primary transition-colors duration-300">
//       {/* Sidebar - Desktop */}
//       <aside className="w-64 bg-bg-secondary border-r border-border-theme hidden lg:flex flex-col">
       
//         <div className="p-6 border-b border-border-theme">
//           <h2 className="text-lg font-serif font-bold text-text-primary">Admin Console</h2>
//         </div>
//         <nav className="flex-1 p-4 space-y-1">
//           {navItems.map((item) => {
//              const isActive = item.exact 
//                ? location.pathname === item.href 
//                : location.pathname.startsWith(item.href);
//              return (
//                <Link
//                  key={item.href}
//                  to={item.href}
//                  className={cn(
//                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
//                    isActive 
//                      ? "bg-text-primary text-bg-primary shadow-lg" 
//                      : "text-text-secondary hover:bg-bg-primary hover:text-text-primary"
//                  )}
//                >
//                  <item.icon className="w-5 h-5" />
//                  {item.name}
//                </Link>
//              );
//           })}
//         </nav>
        
//         <div className="p-4 border-t border-border-theme">
//           <button
//             onClick={handleLogout}
//             className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all"
//           >
//             <LogOut className="w-5 h-5" />
//             Sign Out
//           </button>
//         </div>
//       </aside>

//       {/* Admin Content Area */}
//       <main className="flex-1 p-4 md:p-8 overflow-y-auto">
//         <div className="max-w-6xl mx-auto">
//         <Routes>
//           <Route path="/" element={<Overview />} />
//           <Route path="/projects" element={<ProjectsAdmin />} />
//           <Route path="/blog" element={<BlogAdmin />} />
//           <Route path="/creative" element={<CreativeAdmin />} />
//           <Route path="/learning" element={<LearningAdmin />} />
//           <Route path="/experience" element={<ExperienceAdmin />} />
//           <Route path="/skills" element={<SkillsAdmin />} />
//         </Routes>
//       </main>
//     </div>
//   );
// }

// function Overview() {
//   const [stats, setStats] = useState({ projects: 0, blog: 0, creative: 0, experience: 0 });

//   useEffect(() => {
//     async function fetchStats() {
//       try {
//         const [p, b, c, e] = await Promise.all([
//           api.projects.list(),
//           api.blog.list(),
//           api.creative.list(),
//           api.experience.list()
//         ]);
//         setStats({
//           projects: p.length,
//           blog: b.length,
//           creative: c.length,
//           experience: e.length
//         });
//       } catch (error) {
//         console.error('Failed to fetch stats:', error);
//       }
//     }
//     fetchStats();
//   }, []);

//   return (
//     <div className="space-y-8">
//       <header>
//         <h1 className="text-3xl font-serif font-bold text-text-primary">Dashboard Overview</h1>
//         <p className="text-text-secondary">Welcome back, Prince.</p>
//       </header>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {[
//           { label: 'Projects', count: stats.projects, icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-500/10' },
//           { label: 'Blog Posts', count: stats.blog, icon: MessageSquare, color: 'text-green-500', bg: 'bg-green-500/10' },
//           { label: 'Experiences', count: stats.experience, icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-500/10' },
//           { label: 'Creative Pieces', count: stats.creative, icon: PenTool, color: 'text-brand', bg: 'bg-brand/10' },
//         ].map((stat) => (
//           <div key={stat.label} className="bg-bg-secondary p-6 rounded-2xl border border-border-theme shadow-sm flex items-center justify-between transition-colors">
//             <div>
//               <p className="text-sm font-medium text-text-secondary mb-1">{stat.label}</p>
//               <h4 className="text-2xl font-bold text-text-primary">{stat.count}</h4>
//             </div>
//             <div className={cn("p-4 rounded-xl", stat.bg)}>
//               <stat.icon className={stat.color} />
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="bg-bg-secondary p-8 rounded-2xl border border-border-theme shadow-sm transition-colors">
//         <h3 className="text-xl font-bold mb-6 text-text-primary">Quick Actions</h3>
//         <div className="flex flex-wrap gap-4">
//           <Link to="/admin/experience" className="flex items-center gap-2 px-6 py-3 bg-text-primary text-bg-primary rounded-xl font-bold hover:bg-brand hover:text-white transition-all">
//             <Plus className="w-5 h-5" /> New Experience
//           </Link>
//           <Link to="/admin/projects" className="flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-xl font-bold hover:bg-brand/80 transition-all shadow-lg">
//             <Plus className="w-5 h-5" /> New Project
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }



import { Routes, Route, Link, useLocation, useNavigate, Navigate, Outlet } from 'react-router-dom';
import { LayoutDashboard, Briefcase, BookOpen, PenTool, MessageSquare, LogOut, Plus, Edit, Trash2, Check, X, Award } from 'lucide-react';
import { api } from '@/src/lib/api';
import { cn } from '@/src/lib/utils';

export default function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/');
    window.location.reload();
  };

  const navItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Articles (Blog)', href: '/admin/blog', icon: MessageSquare },
    { name: 'Ink & Verses', href: '/admin/creative', icon: PenTool },
    { name: 'Learning Hub', href: '/admin/learning', icon: BookOpen },
    { name: 'Experiences (Jobs)', href: '/admin/experience', icon: Briefcase },
    { name: 'Technical Skills', href: '/admin/skills', icon: Award },
    { name: 'Projects', href: '/admin/projects', icon: LayoutDashboard },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] flex bg-bg-primary transition-colors duration-300">
      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-bg-secondary border-r border-border-theme hidden lg:flex flex-col">
        <div className="p-6 border-b border-border-theme">
          <h2 className="text-lg font-serif font-bold text-text-primary">Admin Console</h2>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
             const isActive = item.exact 
               ? location.pathname === item.href 
               : location.pathname.startsWith(item.href);
             return (
               <Link
                 key={item.href}
                 to={item.href}
                 className={cn(
                   "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                   isActive 
                     ? "bg-text-primary text-bg-primary shadow-lg" 
                     : "text-text-secondary hover:bg-bg-primary hover:text-text-primary"
                 )}
               >
                 <item.icon className="w-5 h-5" />
                 {item.name}
               </Link>
             );
          })}
        </nav>
        
        <div className="p-4 border-t border-border-theme">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Admin Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
