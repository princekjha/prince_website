import { motion } from 'motion/react';
import { useState } from 'react';
import { Mail, MessageSquare, Send, Calendar as CalendarIcon, Clock, CheckCircle2 } from 'lucide-react';
import { api } from '@/src/lib/api';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [booking, setBooking] = useState<{ date: string; time: string }[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // Spam bot protection
    
    setLoading(true);
    setError('');
    try {
      await api.contact({ ...formData, preferredSlots: booking });
      setSubmitted(true);
    } catch (error) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addSlot = () => {
    setBooking([...booking, { date: '', time: '09:00' }]);
  };

  const updateSlot = (idx: number, field: 'date' | 'time', value: string) => {
    const newBooking = [...booking];
    newBooking[idx][field] = value;
    setBooking(newBooking);
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-32 text-center">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-serif font-bold text-text-primary mb-4">Message Received!</h1>
          <p className="text-text-secondary mb-8">Thanks for reaching out. I'll get back to you as soon as possible.</p>
          <button 
            onClick={() => setSubmitted(false)}
            className="text-brand font-bold hover:underline"
          >
            Send another message
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 lg:grid-cols-2 gap-20">
      <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-text-primary mb-8">Let's start a conversation.</h1>
        <p className="text-xl text-text-secondary mb-12">
          Whether you have a project in mind, want to discuss a learning topic, or just want to say hi—I'm all ears.
        </p>

        <div className="space-y-8 mb-12">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center shrink-0">
              <Mail className="text-brand w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-text-primary">Email</h3>
              <p className="text-text-secondary">pjha3913@gmail.com</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center shrink-0">
              <MessageSquare className="text-brand w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-text-primary">Response Time</h3>
              <p className="text-text-secondary">Usually within 24-48 hours</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 30 }} 
        animate={{ opacity: 1, x: 0 }}
        className="bg-bg-secondary p-8 md:p-12 rounded-[2.5rem] border border-border-theme shadow-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Honeypot field for spam protection */}
          <input 
            type="text" 
            className="hidden" 
            value={honeypot} 
            onChange={e => setHoneypot(e.target.value)} 
            tabIndex={-1} 
            autoComplete="off" 
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text-secondary/60">Full Name</label>
              <input 
                required
                type="text" 
                className="w-full px-4 py-3 rounded-xl bg-bg-primary border border-border-theme text-text-primary focus:border-brand focus:outline-none transition-all"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text-secondary/60">Email Address</label>
              <input 
                required
                type="email" 
                className="w-full px-4 py-3 rounded-xl bg-bg-primary border border-border-theme text-text-primary focus:border-brand focus:outline-none transition-all"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-text-secondary/60">Subject</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-xl bg-bg-primary border border-border-theme text-text-primary focus:border-brand focus:outline-none transition-all"
              value={formData.subject}
              onChange={e => setFormData({ ...formData, subject: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-text-secondary/60">Message</label>
            <textarea 
              required
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-bg-primary border border-border-theme text-text-primary focus:border-brand focus:outline-none transition-all resize-none"
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
            />
          </div>

          {/* Calendar Booking Section */}
          <div className="pt-6 border-t border-border-theme">
            <h4 className="font-bold flex items-center gap-2 mb-4 text-text-primary">
              <CalendarIcon className="w-5 h-5 text-brand" /> Schedule a Call
            </h4>
            <p className="text-sm text-text-secondary/60 mb-4">Suggest up to 3 preferred time slots if you'd like to book a meeting.</p>
            
            <div className="space-y-3 mb-4">
               {booking.map((slot, idx) => (
                 <div key={idx} className="flex gap-2">
                    <input 
                      type="date" 
                      className="flex-1 px-3 py-2 rounded-lg bg-bg-primary text-sm border border-border-theme text-text-primary"
                      value={slot.date}
                      onChange={e => updateSlot(idx, 'date', e.target.value)}
                    />
                    <select 
                      className="px-3 py-2 rounded-lg bg-bg-primary text-sm border border-border-theme text-text-primary"
                      value={slot.time}
                      onChange={e => updateSlot(idx, 'time', e.target.value)}
                    >
                      {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <button 
                      type="button" 
                      onClick={() => setBooking(booking.filter((_, i) => i !== idx))}
                      className="text-text-secondary/40 hover:text-red-500"
                    >
                      &times;
                    </button>
                 </div>
               ))}
               {booking.length < 3 && (
                 <button 
                   type="button" 
                   onClick={addSlot}
                   className="text-sm font-bold text-brand hover:underline"
                 >
                   + Add a slot
                 </button>
               )}
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-brand text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Sending...' : (
              <>Send Message <Send className="w-5 h-5" /></>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
