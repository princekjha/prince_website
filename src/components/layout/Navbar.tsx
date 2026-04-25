// import { Link, useLocation } from 'react-router-dom';
// import { Menu, X, LogIn, LayoutDashboard, LogOut } from 'lucide-react';
// import { useState, useEffect } from 'react';
// import { cn } from '@/src/lib/utils';
// import { motion, AnimatePresence } from 'motion/react';
// import ThemeToggle from '../ThemeToggle';

// const NAV_LINKS = [
//   { name: 'Home', href: '/' },
//   { name: 'About', href: '/about' },
//   { name: 'Learning & Blog', href: '/learning' },
//   { name: 'Ink & Verses', href: '/verses' },
//   { name: 'Contact', href: '/contact' },
// ];

// export default function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const location = useLocation();
//   const isAdmin = !!localStorage.getItem('admin_token');

//   return (
//     <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/80 backdrop-blur-md border-b border-border-theme transition-colors duration-300">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16 items-center">
//           <div className="flex-shrink-0">
//             <Link to="/" className="text-xl font-serif font-bold text-text-primary">
//               Prince Kumar Jha
//             </Link>
//           </div>
          
//           <div className="hidden md:flex space-x-8 items-center">
//             {NAV_LINKS.map((link) => (
//               <Link
//                 key={link.href}
//                 to={link.href}
//                 className={cn(
//                   "text-sm font-medium transition-colors hover:text-brand",
//                   location.pathname === link.href ? "text-brand" : "text-text-secondary"
//                 )}
//               >
//                 {link.name}
//               </Link>
//             ))}
//             <ThemeToggle />
//             {isAdmin ? (
//               <div className="flex items-center gap-3">
//                 <Link
//                   to="/admin"
//                   className="flex items-center gap-2 bg-text-primary text-bg-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand hover:text-white transition-all"
//                 >
//                   <LayoutDashboard className="w-4 h-4" />
//                   Admin
//                 </Link>
//                 <button
//                   onClick={() => {
//                     localStorage.removeItem('admin_token');
//                     window.location.reload();
//                   }}
//                   className="p-2 text-gray-400 hover:text-red-500 transition-colors"
//                   title="Logout"
//                 >
//                   <LogOut className="w-5 h-5" />
//                 </button>
//               </div>
//             ) : (
//               <Link
//                 to="/login"
//                 className="text-text-secondary hover:text-text-primary transition-colors"
//                 title="Admin Login"
//               >
//                 <LogIn className="w-5 h-5" />
//               </Link>
//             )}
//           </div>

//           <div className="md:hidden flex items-center gap-4">
//             <button
//               onClick={() => setIsOpen(!isOpen)}
//               className="text-text-secondary hover:text-text-primary transition-colors"
//             >
//               {isOpen ? <X /> : <Menu />}
//             </button>
//           </div>
//         </div>
//       </div>

//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             className="md:hidden bg-bg-secondary border-b border-border-theme"
//           >
//             <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-text-primary">
//               {NAV_LINKS.map((link) => (
//                 <Link
//                   key={link.href}
//                   to={link.href}
//                   className="block px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:text-brand hover:bg-bg-primary"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   {link.name}
//                 </Link>
//               ))}
              
//               <div className="px-3 py-2">
//                 <ThemeToggle />
//               </div>

//               {isAdmin && (
//                 <Link
//                   to="/admin"
//                   className="block px-3 py-2 rounded-md text-base font-medium text-[#E67E22] hover:bg-gray-50"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   Admin Dashboard
//                 </Link>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </nav>
//   );
// }

import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, LayoutDashboard, LogOut, Home as HomeIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import ThemeToggle from '../ThemeToggle';

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Learning & Blog', href: '/learning' },
  { name: 'Ink & Verses', href: '/verses' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isAdmin = !!localStorage.getItem('admin_token');

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/80 backdrop-blur-md border-b border-border-theme transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link to="/" className="p-2 rounded-full hover:bg-bg-secondary text-text-primary transition-all flex items-center justify-center border border-transparent hover:border-border-theme" title="Home">
              <HomeIcon className="w-5 h-5" />
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8 items-center">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-brand",
                  location.pathname === link.href ? "text-brand" : "text-text-secondary"
                )}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="h-6 w-[1px] bg-border-theme mx-2" />
            
            <ThemeToggle />
            
            {isAdmin ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/admin"
                  className="flex items-center gap-2 bg-text-primary text-bg-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand hover:text-white transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Admin
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem('admin_token');
                    window.location.reload();
                  }}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-text-secondary hover:text-text-primary transition-colors"
                title="Admin Login"
              >
                <LogIn className="w-5 h-5" />
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-all border border-border-theme"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-bg-secondary border-b border-border-theme"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-text-primary">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "block px-3 py-3 rounded-md text-base font-medium transition-colors",
                    location.pathname === link.href ? "bg-brand/10 text-brand" : "text-text-secondary hover:text-brand hover:bg-bg-primary"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              {isAdmin && (
                <Link
                  to="/admin"
                  className="block px-3 py-3 rounded-md text-base font-medium text-brand hover:bg-bg-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
