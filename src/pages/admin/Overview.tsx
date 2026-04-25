import { useState, useEffect } from 'react';
import { api } from '@/src/lib/api';
import { cn } from '@/src/lib/utils';
import { Briefcase, MessageSquare, PenTool, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Overview() {
  const [stats, setStats] = useState({ projects: 0, blog: 0, creative: 0, experience: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [p, b, c, e] = await Promise.all([
          api.projects.list(),
          api.blog.list(),
          api.creative.list(),
          api.experience.list()
        ]);
        setStats({
          projects: Array.isArray(p) ? p.length : 0,
          blog: Array.isArray(b) ? b.length : 0,
          creative: Array.isArray(c) ? c.length : 0,
          experience: Array.isArray(e) ? e.length : 0
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-bg-secondary rounded-full border border-border-theme"></div>
          <div className="h-4 w-32 bg-bg-secondary rounded border border-border-theme"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-serif font-bold text-text-primary">Dashboard Overview</h1>
        <p className="text-text-secondary">Welcome back, Prince.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Projects', count: stats.projects, icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Blog Posts', count: stats.blog, icon: MessageSquare, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Experiences', count: stats.experience, icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { label: 'Creative Pieces', count: stats.creative, icon: PenTool, color: 'text-brand', bg: 'bg-brand/10' },
        ].map((stat) => (
          <div key={stat.label} className="bg-bg-secondary p-6 rounded-2xl border border-border-theme shadow-sm flex items-center justify-between transition-colors">
            <div>
              <p className="text-sm font-medium text-text-secondary mb-1">{stat.label}</p>
              <h4 className="text-2xl font-bold text-text-primary">{stat.count}</h4>
            </div>
            <div className={cn("p-4 rounded-xl", stat.bg)}>
              <stat.icon className={stat.color} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-bg-secondary p-8 rounded-2xl border border-border-theme shadow-sm transition-colors">
        <h3 className="text-xl font-bold mb-6 text-text-primary">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <Link to="/admin/experience" className="flex items-center gap-2 px-6 py-3 bg-text-primary text-bg-primary rounded-xl font-bold hover:bg-brand hover:text-white transition-all">
            <Plus className="w-5 h-5" /> New Experience
          </Link>
          <Link to="/admin/projects" className="flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-xl font-bold hover:bg-brand/80 transition-all shadow-lg">
            <Plus className="w-5 h-5" /> New Project
          </Link>
        </div>
      </div>
    </div>
  );
}
