import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#1A1A2E] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-serif font-bold mb-4">Prince Kumar Jha</h3>
          <p className="text-gray-400 max-w-xs">
            A digital hub combining professional work, personal thoughts, and interactive learning.
          </p>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/about" className="hover:text-[#E67E22]">About Journey</Link></li>
            <li><Link to="/learning" className="hover:text-[#E67E22]">Learning & Blog</Link></li>
            <li><Link to="/verses" className="hover:text-[#E67E22]">Ink & Verses</Link></li>
            <li><Link to="/contact" className="hover:text-[#E67E22]">Contact</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4">Connect</h4>
          <div className="flex gap-4 mb-4">
            <a href="https://github.com/princekjha" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><Github className="w-6 h-6" /></a>
            <a href="https://linkedin.com/in/prince-k-jha" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><Linkedin className="w-5 h-6" /></a>
            <a href="mailto:pjha3913@gmail.com" className="text-gray-400 hover:text-white transition-colors"><Mail className="w-6 h-6" /></a>
          </div>
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Prince Kumar Jha. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
