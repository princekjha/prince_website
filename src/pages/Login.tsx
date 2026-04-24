import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/src/lib/api';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
  const [step, setStep] = useState(1); // 1: Google, 2: Password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.authGoogle(credentialResponse.credential);
      if (res.success) {
        setEmail(res.email);
        setStep(2);
      }
    } catch (err: any) {
      setError('Access denied. This email is not authorized.');
    } finally {
      setLoading(false);
    }
  };

  const handleFinalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await api.login(password, email);
      if (res.success) {
        localStorage.setItem('admin_token', res.token);
        navigate('/admin');
        window.location.reload();
      }
    } catch (err: any) {
      setError('Invalid password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4 transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-bg-secondary p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-border-theme"
      >
        <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <ShieldCheck className="w-8 h-8 text-brand" />
        </div>
        
        <h1 className="text-3xl font-serif font-bold text-center text-text-primary mb-2">Admin Security</h1>
        <p className="text-center text-text-secondary mb-8">Dual-layer verification required.</p>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="bg-bg-primary p-6 rounded-2xl border border-border-theme flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-primary uppercase tracking-widest">Step 1</h4>
                  <p className="text-[10px] text-text-secondary">Verify Identity via Google</p>
                </div>
              </div>
              
              <div className="flex justify-center py-4">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError('Google Login Failed')}
                  useOneTap
                  theme="filled_black"
                  shape="pill"
                />
              </div>
              
              <div className="text-center">
                <button 
                  type="button"
                  onClick={() => {
                    setEmail('pjha3913@gmail.com');
                    setStep(2);
                  }}
                  className="text-[10px] font-bold uppercase tracking-widest text-text-secondary/40 hover:text-brand transition-colors"
                >
                  Unable to use Google Login? Click here.
                </button>
              </div>

              {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}
            </motion.div>
          ) : (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="bg-green-500/5 p-6 rounded-2xl border border-green-500/20 flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-green-500 uppercase tracking-widest">Verified</h4>
                  <p className="text-[10px] text-green-600 font-medium">{email}</p>
                </div>
              </div>

              <form onSubmit={handleFinalLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-text-secondary/60">Layer 2: Access Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary/40" />
                    <input 
                      required
                      autoFocus
                      type="password" 
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-bg-primary border-2 border-transparent focus:bg-bg-secondary focus:border-brand focus:outline-none transition-all text-text-primary"
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-text-primary text-bg-primary py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand hover:text-white transition-all disabled:opacity-50 shadow-lg"
                >
                  {loading ? 'Finalizing...' : (
                    <>Unlock Dashboard <ArrowRight className="w-5 h-5" /></>
                  )}
                </button>
                
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary/40 hover:text-brand transition-colors"
                >
                  Wrong account? Sign out
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
