import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
/// <reference types="vite/client" />
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import KnowledgeMap from './components/layout/KnowledgeMap';

// ... existing pages ...
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Verses = lazy(() => import('./pages/Verses'));
const Learning = lazy(() => import('./pages/Learning'));
const TopicDetail = lazy(() => import('./pages/LearningTopic'));
const LessonView = lazy(() => import('./pages/LessonView'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

// Private Route Component
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAdmin = !!localStorage.getItem('admin_token');
  return isAdmin ? <>{children}</> : <Navigate to="/login" />;
};

export default function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  if (!googleClientId) {
    console.warn("VITE_GOOGLE_CLIENT_ID is missing. Google Login will not work. Please set it in the Settings menu (Secrets).");
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Router>
        <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary transition-colors duration-300">
          <Navbar />
          <main className="flex-grow pt-16">
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/learning" element={<Learning />} />
                <Route path="/learning/:topicSlug" element={<TopicDetail />} />
                <Route path="/learning/:topicSlug/:lessonSlug" element={<LessonView />} />
                <Route path="/verses" element={<Verses />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                
                {/* Admin Routes */}
                <Route path="/admin/*" element={
                  <PrivateRoute>
                    <AdminDashboard />
                  </PrivateRoute>
                } />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <KnowledgeMap />
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}
