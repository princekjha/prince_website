// import { motion, AnimatePresence } from 'motion/react';
// import { Mail, Github, Linkedin, ExternalLink, ChevronRight, X, Maximize2, Image as ImageIcon } from 'lucide-react';
// import { useState, useEffect } from 'react';
// import { api } from '@/src/lib/api';
// import { Experience, ExperienceImage } from '@/src/types';
// import Markdown from 'react-markdown';

// // ... academicData ...
// const academicData = {
//   // ... (keeping existing academicData)
//   1: [
//     { name: "Financial Accounting", desc: "The bedrock of accounting—learning how double-entry bookkeeping actually captures the pulse of a business." },
//     { name: "Business Math & Statistics", desc: "Where I first started seeing data as a language. Probability and quantitative methods that laid my technical groundwork." },
//     { name: "Business Economics & Environment", desc: "Understanding the macro systems that drive markets and how individual choices ripple through the economy." },
//     { name: "Business Mgmt & Communication", desc: "The human side of systems—learning how organizations scale and communicate." },
//     { name: "MB - English & Non Hindi", desc: "Refining the essential skill of articulating complex ideas clearly and effectively." },
//   ],
//   2: [
//     { name: "Business Regulatory Framework", desc: "The rules of the game. Navigating legal compliances and the ethical boundaries of business." },
//     { name: "Corporate Accounting", desc: "Deep diving into the complex financial structures of large entities—mergers, acquisitions, and consolidated statements." },
//     { name: "Indian Economy & Entrepreneurship", desc: "A case study in growth and entrepreneurship within one of the world's most dynamic emerging markets." },
//     { name: "Monetary Theories & Institutions", desc: "Understanding central banking, inflation, and the flow of capital at a systemic level." },
//   ],
//   3: [
//     { name: "Financial & Investment Mgmt", desc: "Capital allocation and risk management. Evaluating value in a volatile world." },
//     { name: "Cost & Mgmt Accounting", desc: "The optimization layer—using data to drive operational efficiency and cost-effective decision making." },
//     { name: "Taxation Theory & Practices", desc: "Strategic fiscal planning and understanding the impact of policy on business performance." },
//     { name: "Principles of Auditing", desc: "The final check—ensuring integrity, accuracy, and governance in every financial record." },
//   ]
// };

// export default function About() {
//   const [activePart, setActivePart] = useState(1);
//   const [experiences, setExperiences] = useState<Experience[]>([]);
//   const [activeExp, setActiveExp] = useState<string | null>(null);
//   const [lightbox, setLightbox] = useState<ExperienceImage | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [showAllImages, setShowAllImages] = useState(false);

//   useEffect(() => {
//     async function fetchExperiences() {
//       try {
//         const data = await api.experience.list();
//         setExperiences(data);
//         if (data.length > 0) setActiveExp(data[0].id);
        
//         // Handle anchor scroll
//         if (window.location.hash === '#professional') {
//           setTimeout(() => {
//             const el = document.getElementById('professional');
//             if (el) el.scrollIntoView({ behavior: 'smooth' });
//           }, 500);
//         }
//       } catch (error) {
// // ...
//         console.error('Failed to fetch experiences:', error);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchExperiences();
//   }, []);

//   useEffect(() => {
//     setShowAllImages(false); // Reset image visibility when experience changes
//   }, [activeExp]);

//   const currentExp = experiences.find(e => e.id === activeExp) || experiences[0];

//   if (loading) return (
//     <div className="max-w-7xl mx-auto px-6 py-16 min-h-screen flex items-center justify-center bg-bg-primary text-text-secondary italic font-serif">
//       Mapping the milestones...
//     </div>
//   );

//   return (
//     <div className="max-w-7xl mx-auto px-6 py-16 bg-bg-primary transition-colors duration-300">
//       {/* Lightbox Modal */}
//       <AnimatePresence>
//         {lightbox && (
//           <motion.div 
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
//             onClick={() => setLightbox(null)}
//           >
//             <motion.div 
//               initial={{ scale: 0.9, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               className="max-w-4xl w-full bg-bg-secondary rounded-3xl overflow-hidden shadow-2xl border border-border-theme"
//               onClick={e => e.stopPropagation()}
//             >
//               <div className="relative">
//                 <button 
//                   onClick={() => setLightbox(null)}
//                   className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors"
//                 >
//                   <X className="w-6 h-6" />
//                 </button>
//                 <img 
//                   src={lightbox.url} 
//                   alt="Experience Milestone" 
//                   className="w-full h-auto max-h-[70vh] object-contain bg-bg-primary/50"
//                 />
//               </div>
//               <div className="p-8 md:p-12">
//                 <h3 className="text-xl font-serif font-bold text-text-primary mb-4">Behind the Snapshot</h3>
//                 <p className="text-text-secondary font-story italic leading-relaxed">
//                   {lightbox.description || "A defining moment during this journey."}
//                 </p>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Hero Section */}
//       <motion.section 
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="mb-24"
//       >
//         <h1 className="text-3xl md:text-4xl font-serif font-bold text-text-primary mb-10 tracking-tight">Let me walk you through....</h1>
//         <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
//           <div className="md:col-span-5 rounded-2xl overflow-hidden shadow-lg border-4 border-bg-secondary bg-bg-secondary">
//             <img 
//               src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800" 
//               alt="Prince Kumar Jha" 
//               className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
//             />
//           </div>
//           <div className="md:col-span-7 space-y-6 text-base text-text-secondary leading-relaxed font-story italic">
//             <p>
//               I've always believed that the best way to understand the world is through the stories that data tells. Currently, I'm navigating the landscape of <strong>Data Engineering and AI at Quest Alliance</strong>, where my days are spent building automated pipelines and MIS dashboards that actually mean something for statistical growth.
//             </p>
//             <p>
//               But my work isn't just about the code. It's about bridging the gap between business logic and technical execution. Whether I'm deploying <strong>Gen-AI chatbots</strong> to help improve employability or architecting SQL-driven governance, my focus is always on making complex systems human-centric and error-free.
//             </p>
//             <p>
//               I come from a background that mixes <strong>Commerce and Data Science</strong>—a combination that allows me to see both the "why" and the "how." I'm passionate about data literacy and helping teams find clarity in the noise.
//             </p>
//           </div>
//         </div>
//       </motion.section>

//       {/* Origins */}
//       <section id="origins" className="mb-24">
//         <h2 className="text-2xl font-serif font-bold text-text-primary mb-10">Where it all began...</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
//           <div className="space-y-5 text-base text-text-secondary font-story">
//             <p>My journey really took flight at <strong>Lalit Narayan Mithila University (LNMU)</strong> in Darbhanga.</p>
//             <p>
//               While studying for my B.Com, I wasn't just sitting in lecture halls. I was leading the <strong>NSS</strong>, managing a team of ten to bring COVID-19 relief to rural areas. That was my first real lesson in data: if you don't know who needs help and where your resources are, your good intentions don't go very far.
//             </p>
//             <p>
//               I realized then that efficient systems are the backbone of community impact. That realization pushed me to look beyond accounting spreadsheets and into the world of data science.
//             </p>
//           </div>
//           <div className="rounded-2xl overflow-hidden shadow-md border-2 border-border-theme aspect-[4/3] bg-bg-secondary">
//             <img 
//               src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600" 
//               alt="The LNMU Spirit" 
//               className="w-full h-full object-cover opacity-80" 
//             />
//           </div>
//         </div>
//       </section>

//       {/* Academic Table: Interactive Component */}
//       <section id="academic" className="mb-24">
//         <div className="mb-10">
//           <h2 className="text-2xl font-serif font-bold text-text-primary mb-2">The Academic Core</h2>
//           <p className="text-sm text-text-secondary font-story italic">Three years of grounding in the logic of commerce.</p>
//         </div>

//         <div className="bg-bg-secondary rounded-3xl border border-border-theme shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">
//           {/* Sidebar Tabs */}
//           <div className="w-full md:w-64 bg-bg-primary/50 border-r border-border-theme p-4 space-y-2">
//             {[1, 2, 3].map((part) => (
//               <button
//                 key={part}
//                 onClick={() => setActivePart(part)}
//                 className={`w-full text-left px-6 py-4 rounded-xl transition-all duration-300 flex items-center justify-between group ${
//                   activePart === part 
//                   ? 'bg-bg-secondary text-brand shadow-sm border border-border-theme' 
//                   : 'text-text-secondary hover:bg-bg-secondary/50 hover:text-text-secondary'
//                 }`}
//               >
//                 <div className="flex flex-col">
//                   <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Curriculum</span>
//                   <span className="text-lg font-serif font-bold">Part {part}</span>
//                 </div>
//                 <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${activePart === part ? 'translate-x-0' : '-translate-x-2 opacity-0'}`} />
//               </button>
//             ))}
//           </div>

//           {/* Content Area */}
//           <div className="flex-1 p-8 md:p-12">
//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={activePart}
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -20 }}
//                 transition={{ duration: 0.3 }}
//                 className="space-y-8"
//               >
//                 <header className="mb-8 border-b border-border-theme pb-6">
//                   <h3 className="text-xs font-bold uppercase tracking-widest text-brand mb-1">Detailed Subject Breakdown</h3>
//                   <p className="text-sm text-text-secondary">Bachelor of Commerce (Hons.) — Darbhanga</p>
//                 </header>

//                 <div className="space-y-8">
//                   {academicData[activePart as keyof typeof academicData].map((subject, idx) => (
//                     <div key={idx} className="group">
//                       <h4 className="text-lg font-serif font-bold text-text-primary mb-2 group-hover:text-brand transition-colors">
//                         {subject.name}
//                       </h4>
//                       <p className="text-xs text-text-secondary/60 font-story leading-relaxed max-w-2xl italic">
//                         {subject.desc}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               </motion.div>
//             </AnimatePresence>
//           </div>
//         </div>
//       </section>

//       {/* Transition Section */}
//       <section className="mb-24">
//         <h2 className="text-2xl font-serif font-bold text-text-primary mb-10">Shifting Gears to Data...</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center flex-row-reverse mb-16">
//           <div className="order-2 md:order-1 rounded-2xl overflow-hidden shadow-lg border-2 border-border-theme aspect-video">
//             <img 
//               src="https://images.unsplash.com/photo-1551288049-bbdac8626ad1?auto=format&fit=crop&q=80&w=800" 
//               alt="Data Visualization" 
//               className="w-full h-full object-cover" 
//             />
//           </div>
//           <div className="order-1 md:order-2 space-y-5 text-base text-text-secondary font-story">
//             <p>
//               After LNMU, I knew I needed to build a formal bridge between business and the technical side. I joined <strong>AlmaBetter</strong> to dive headfirst into <strong>Data Science</strong>.
//             </p>
//             <p>
//               This was where the theory met the toolset. Python, SQL, and Machine Learning became my new vocabulary. I wasn't just learning to build models; I was learning how to make those models tell the right story to the right people. 
//             </p>
//             <p>
//               Everything I do now at Quest Alliance—the NLP, the automated pipelines—rooted here. It's about turning messy data into something that can actually change a life or a business.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Professional Journey Hub */}
//       <section id="professional" className="mb-24">
//         <div className="mb-10">
//           <h2 className="text-2xl font-serif font-bold text-text-primary mb-2">Professional Journey</h2>
//           <p className="text-sm text-text-secondary font-story italic">Mapping the impact across the industry.</p>
//         </div>

//         {loading ? (
//           <div className="h-64 flex items-center justify-center bg-bg-secondary rounded-3xl border border-border-theme italic text-text-secondary">
//             Mapping milestones...
//           </div>
//         ) : experiences.length === 0 ? (
//           <div className="p-12 text-center bg-bg-secondary rounded-3xl border border-dashed border-border-theme text-text-secondary font-serif italic">
//             No experiences listed yet. Add some in the Admin panel!
//           </div>
//         ) : (
//           <div className="bg-bg-secondary rounded-3xl border border-border-theme shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
//             {/* Sidebar Tabs */}
//             <div className="w-full md:w-72 bg-bg-primary/50 border-r border-border-theme p-4 space-y-2">
//               {experiences?.map((exp) => (
//                 <button
//                   key={exp.id}
//                   onClick={() => setActiveExp(exp.id)}
//                   className={`w-full text-left px-6 py-5 rounded-xl transition-all duration-300 flex items-center justify-between group ${
//                     activeExp === exp.id
//                       ? 'bg-bg-secondary text-brand shadow-sm border border-border-theme'
//                       : 'text-text-secondary hover:bg-bg-secondary/50 hover:text-text-secondary'
//                   }`}
//                 >
//                   <div className="flex flex-col">
//                     <span className="text-[9px] font-bold uppercase tracking-widest opacity-60 mb-1">
//                       {exp.tenure}
//                     </span>
//                     <span className="text-lg font-serif font-bold leading-tight">
//                       {exp.organization}
//                     </span>
//                     <span className="text-[10px] font-bold text-text-secondary/40 mt-1 uppercase tracking-tighter line-clamp-1">
//                       {exp.role}
//                     </span>
//                   </div>
//                   <ChevronRight 
//                     className={`w-5 h-5 transition-transform duration-300 ${
//                       activeExp === exp.id ? 'translate-x-0' : '-translate-x-2 opacity-0'
//                     }`} 
//                   />
//                 </button>
//               ))}
//             </div>

//             {/* Content Area */}
//             <div className="flex-1 p-8 md:p-12">
//               <AnimatePresence mode="wait">
//                 <motion.div
//                   key={activeExp}
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -20 }}
//                   transition={{ duration: 0.3 }}
//                   className="space-y-12"
//                 >
//                   <header className="border-b border-border-theme pb-8">
//                     <h3 className="text-xs font-bold uppercase tracking-widest text-brand mb-1">{currentExp.tenure}</h3>
//                     <h4 className="text-3xl font-serif font-bold text-text-primary mb-2">{currentExp.organization}</h4>
//                     <p className="text-lg font-bold text-text-secondary font-serif uppercase tracking-tight">{currentExp.role}</p>
//                   </header>

//                   {/* Impact Stories */}
//                   <div className="prose prose-orange prose-sm max-w-none text-text-secondary font-story italic leading-relaxed px-4 border-l-2 border-brand/20 hover:border-brand transition-all">
//                     {currentExp.description ? (
//                       <Markdown>{currentExp.description}</Markdown>
//                     ) : (
//                       <p className="italic text-text-secondary/40 font-story">Detailed impact stories for this role are being curated.</p>
//                     )}
//                   </div>

//                   {/* Visual Gallery at Bottom */}
//                   {currentExp.images && currentExp.images.length > 0 && (
//                     <div className="pt-8 border-t border-border-theme/30">
//                       <div className="flex items-center gap-2 mb-6">
//                         <ImageIcon className="text-brand w-4 h-4" />
//                         <h5 className="text-sm font-bold uppercase tracking-widest text-text-primary">Visual Milestones</h5>
//                       </div>
//                       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                         {(showAllImages ? currentExp.images : currentExp.images.slice(0, 3)).map((img, idx) => (
//                           <motion.div 
//                             key={idx}
//                             layout
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             className="relative group cursor-pointer aspect-square rounded-2xl overflow-hidden border-2 border-bg-primary shadow-sm"
//                             onClick={() => setLightbox(img)}
//                           >
//                             <img 
//                               src={img.url} 
//                               alt="Milestone" 
//                               className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                             />
//                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
//                               <Maximize2 className="text-white w-5 h-5" />
//                             </div>
//                           </motion.div>
//                         ))}
//                       </div>
//                       {currentExp.images.length > 3 && (
//                         <button 
//                           onClick={() => setShowAllImages(!showAllImages)}
//                           className="mt-6 text-brand text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:underline"
//                         >
//                           {showAllImages ? 'Show Less' : `+ Show ${currentExp.images.length - 3} more photos`}
//                         </button>
//                       )}
//                     </div>
//                   )}
//                 </motion.div>
//               </AnimatePresence>
//             </div>
//           </div>
//         )
//       }
//       </section>


//       {/* Loading next phase... section */}
//       <section className="mb-24 pt-12 border-t border-border-theme/30">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
//           <div className="space-y-8">
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-[1px] bg-brand/40" />
//               <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand/60">New Chapter</span>
//             </div>
//             <h2 className="text-4xl md:text-5xl font-serif font-bold text-text-primary tracking-tight italic">
//               Loading next phase<span className="text-brand">...</span>
//             </h2>
//             <div className="space-y-6 text-lg text-text-secondary font-story italic leading-relaxed">
//               <p>
//                 The journey doesn't end at the last milestone. It's a continuous iteration of learning, building, and evolving.
//               </p>
//               <div className="p-8 bg-bg-secondary rounded-[2rem] border border-border-theme shadow-sm relative overflow-hidden group">
//                 <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500" />
//                 <p className="relative z-10 text-xl font-serif text-text-primary mb-4">"Still building, still evolving."</p>
//                 <p className="relative z-10 text-sm opacity-60">I am currently exploring advanced data mesh architectures and fine-tuning LLMs for niche domain expertise. Stay tuned for the next transmission.</p>
//               </div>
//             </div>
//           </div>
//           <div className="relative">
//              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-2 border-border-theme group">
//                 <img 
//                   src="https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=800" 
//                   alt="Future Exploration" 
//                   className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-700"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-10">
//                    <p className="text-white font-story italic text-sm opacity-80 group-hover:opacity-100 transition-opacity">Architecting the unseen...</p>
//                 </div>
//              </div>
//              {/* Decorative Elements */}
//              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-brand/10 rounded-full blur-2xl" />
//              <div className="absolute -top-6 -right-6 w-32 h-32 bg-brand/5 rounded-full blur-3xl" />
//           </div>
//         </div>
//       </section>

//       {/* Final Note */}
//       <section className="bg-[#1A1A2E] text-white rounded-[2.5rem] p-12 md:p-16 text-center relative overflow-hidden shadow-2xl">
//         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand/20 to-transparent pointer-events-none" />
//         <h2 className="text-4xl font-serif font-bold mb-6 relative z-10 font-story italic tracking-tight text-white">Let's build something data-driven!</h2>
//         <p className="text-lg text-gray-200 max-w-2xl mx-auto mb-10 relative z-10 leading-relaxed font-story italic opacity-90">
//           Currently based in <strong>New Delhi</strong>, I'm always open to talking about data engineering, AI, or how we can make tech feel more human.
//         </p>
//         <div className="flex justify-center gap-4 relative z-10">
//           <a href="mailto:pjha3913@gmail.com" className="bg-brand text-white px-8 py-4 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-brand/80 transition-all shadow-lg hover:-translate-y-1">
//             <Mail className="w-4 h-4" /> Say Hello
//           </a>
//           <a href="https://linkedin.com/in/prince-k-jha" target="_blank" rel="noopener noreferrer" className="bg-white/10 text-white border border-white/20 px-8 py-4 rounded-xl text-sm font-bold hover:bg-white/20 transition-all">
//             LinkedIn
//           </a>
//         </div>
//       </section>
//     </div>
//   );
// }

import { motion, AnimatePresence } from 'motion/react';
import { Mail, Github, Linkedin, ExternalLink, ChevronRight, X, Maximize2, Image as ImageIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '@/src/lib/api';
import { Experience } from '@/src/types';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// ... academicData ...
const academicData = {
  // ... (keeping existing academicData)
  1: [
    { name: "Financial Accounting", desc: "The bedrock of accounting—learning how double-entry bookkeeping actually captures the pulse of a business." },
    { name: "Business Math & Statistics", desc: "Where I first started seeing data as a language. Probability and quantitative methods that laid my technical groundwork." },
    { name: "Business Economics & Environment", desc: "Understanding the macro systems that drive markets and how individual choices ripple through the economy." },
    { name: "Business Mgmt & Communication", desc: "The human side of systems—learning how organizations scale and communicate." },
    { name: "MB - English & Non Hindi", desc: "Refining the essential skill of articulating complex ideas clearly and effectively." },
  ],
  2: [
    { name: "Business Regulatory Framework", desc: "The rules of the game. Navigating legal compliances and the ethical boundaries of business." },
    { name: "Corporate Accounting", desc: "Deep diving into the complex financial structures of large entities—mergers, acquisitions, and consolidated statements." },
    { name: "Indian Economy & Entrepreneurship", desc: "A case study in growth and entrepreneurship within one of the world's most dynamic emerging markets." },
    { name: "Monetary Theories & Institutions", desc: "Understanding central banking, inflation, and the flow of capital at a systemic level." },
  ],
  3: [
    { name: "Financial & Investment Mgmt", desc: "Capital allocation and risk management. Evaluating value in a volatile world." },
    { name: "Cost & Mgmt Accounting", desc: "The optimization layer—using data to drive operational efficiency and cost-effective decision making." },
    { name: "Taxation Theory & Practices", desc: "Strategic fiscal planning and understanding the impact of policy on business performance." },
    { name: "Principles of Auditing", desc: "The final check—ensuring integrity, accuracy, and governance in every financial record." },
  ]
};

export default function About() {
  const [activePart, setActivePart] = useState(1);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [activeExp, setActiveExp] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAllImages, setShowAllImages] = useState(false);

  useEffect(() => {
    async function fetchExperiences() {
      try {
        const data = await api.experience.list();
        setExperiences(data);
        if (data.length > 0) setActiveExp(data[0].id);
        
        // Handle anchor scroll
        if (window.location.hash === '#professional') {
          setTimeout(() => {
            const el = document.getElementById('professional');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 500);
        }
      } catch (error) {
// ...
        console.error('Failed to fetch experiences:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchExperiences();
  }, []);

  useEffect(() => {
    setShowAllImages(false); // Reset image visibility when experience changes
  }, [activeExp]);

  const currentExp = experiences.find(e => e.id === activeExp) || experiences[0];

  if (loading) return (
    <div className="max-w-7xl mx-auto px-6 py-16 min-h-screen flex items-center justify-center bg-bg-primary text-text-secondary italic font-serif">
      Mapping the milestones...
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 bg-bg-primary transition-colors duration-300">
      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightbox && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={() => setLightbox(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-4xl w-full bg-bg-secondary rounded-3xl overflow-hidden shadow-2xl border border-border-theme"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative">
                <button 
                  onClick={() => setLightbox(null)}
                  className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <img 
                  src={lightbox} 
                  alt="Experience Milestone" 
                  className="w-full h-auto max-h-[70vh] object-contain bg-bg-primary/50"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-24"
      >
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-text-primary mb-10 tracking-tight">Let me walk you through....</h1>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-5 rounded-2xl overflow-hidden shadow-lg border-4 border-bg-secondary bg-bg-secondary">
            <img 
              src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800" 
              alt="Prince Kumar Jha" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
            />
          </div>
          <div className="md:col-span-7 space-y-6 text-base text-text-secondary leading-relaxed font-story italic">
            <p>
              I've always believed that the best way to understand the world is through the stories that data tells. Currently, I'm navigating the landscape of <strong>Data Engineering and AI at Quest Alliance</strong>, where my days are spent building automated pipelines and MIS dashboards that actually mean something for statistical growth.
            </p>
            <p>
              But my work isn't just about the code. It's about bridging the gap between business logic and technical execution. Whether I'm deploying <strong>Gen-AI chatbots</strong> to help improve employability or architecting SQL-driven governance, my focus is always on making complex systems human-centric and error-free.
            </p>
            <p>
              I come from a background that mixes <strong>Commerce and Data Science</strong>—a combination that allows me to see both the "why" and the "how." I'm passionate about data literacy and helping teams find clarity in the noise.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Origins */}
      <section id="origins" className="mb-24">
        <h2 className="text-2xl font-serif font-bold text-text-primary mb-10">Where it all began...</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="space-y-5 text-base text-text-secondary font-story">
            <p>My journey really took flight at <strong>Lalit Narayan Mithila University (LNMU)</strong> in Darbhanga.</p>
            <p>
              While studying for my B.Com, I wasn't just sitting in lecture halls. I was leading the <strong>NSS</strong>, managing a team of ten to bring COVID-19 relief to rural areas. That was my first real lesson in data: if you don't know who needs help and where your resources are, your good intentions don't go very far.
            </p>
            <p>
              I realized then that efficient systems are the backbone of community impact. That realization pushed me to look beyond accounting spreadsheets and into the world of data science.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-md border-2 border-border-theme aspect-[4/3] bg-bg-secondary">
            <img 
              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600" 
              alt="The LNMU Spirit" 
              className="w-full h-full object-cover opacity-80" 
            />
          </div>
        </div>
      </section>

      {/* Academic Table: Interactive Component */}
      <section id="academic" className="mb-24">
        <div className="mb-10">
          <h2 className="text-2xl font-serif font-bold text-text-primary mb-2">The Academic Core</h2>
          <p className="text-sm text-text-secondary font-story italic">Three years of grounding in the logic of commerce.</p>
        </div>

        <div className="bg-bg-secondary rounded-3xl border border-border-theme shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 bg-bg-primary/50 border-r border-border-theme p-4 space-y-2">
            {[1, 2, 3].map((part) => (
              <button
                key={part}
                onClick={() => setActivePart(part)}
                className={`w-full text-left px-6 py-4 rounded-xl transition-all duration-300 flex items-center justify-between group ${
                  activePart === part 
                  ? 'bg-bg-secondary text-brand shadow-sm border border-border-theme' 
                  : 'text-text-secondary hover:bg-bg-secondary/50 hover:text-text-secondary'
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Curriculum</span>
                  <span className="text-lg font-serif font-bold">Part {part}</span>
                </div>
                <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${activePart === part ? 'translate-x-0' : '-translate-x-2 opacity-0'}`} />
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 p-8 md:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePart}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <header className="mb-8 border-b border-border-theme pb-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-brand mb-1">Detailed Subject Breakdown</h3>
                  <p className="text-sm text-text-secondary">Bachelor of Commerce (Hons.) — Darbhanga</p>
                </header>

                <div className="space-y-8">
                  {academicData[activePart as keyof typeof academicData].map((subject, idx) => (
                    <div key={idx} className="group">
                      <h4 className="text-lg font-serif font-bold text-text-primary mb-2 group-hover:text-brand transition-colors">
                        {subject.name}
                      </h4>
                      <p className="text-xs text-text-secondary/60 font-story leading-relaxed max-w-2xl italic">
                        {subject.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Transition Section */}
      <section className="mb-24">
        <h2 className="text-2xl font-serif font-bold text-text-primary mb-10">Shifting Gears to Data...</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center flex-row-reverse mb-16">
          <div className="order-2 md:order-1 rounded-2xl overflow-hidden shadow-lg border-2 border-border-theme aspect-video">
            <img 
              src="https://images.unsplash.com/photo-1551288049-bbdac8626ad1?auto=format&fit=crop&q=80&w=800" 
              alt="Data Visualization" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="order-1 md:order-2 space-y-5 text-base text-text-secondary font-story">
            <p>
              After LNMU, I knew I needed to build a formal bridge between business and the technical side. I joined <strong>AlmaBetter</strong> to dive headfirst into <strong>Data Science</strong>.
            </p>
            <p>
              This was where the theory met the toolset. Python, SQL, and Machine Learning became my new vocabulary. I wasn't just learning to build models; I was learning how to make those models tell the right story to the right people. 
            </p>
            <p>
              Everything I do now at Quest Alliance—the NLP, the automated pipelines—rooted here. It's about turning messy data into something that can actually change a life or a business.
            </p>
          </div>
        </div>
      </section>

      {/* Professional Journey Hub */}
      <section id="professional" className="mb-24">
        <div className="mb-10">
          <h2 className="text-2xl font-serif font-bold text-text-primary mb-2">Professional Journey</h2>
          <p className="text-sm text-text-secondary font-story italic">Mapping the impact across the industry.</p>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center bg-bg-secondary rounded-3xl border border-border-theme italic text-text-secondary">
            Mapping milestones...
          </div>
        ) : experiences.length === 0 ? (
          <div className="p-12 text-center bg-bg-secondary rounded-3xl border border-dashed border-border-theme text-text-secondary font-serif italic">
            No experiences listed yet. Add some in the Admin panel!
          </div>
        ) : (
          <div className="bg-bg-secondary rounded-3xl border border-border-theme shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
            {/* Sidebar Tabs */}
            <div className="w-full md:w-72 bg-bg-primary/50 border-r border-border-theme p-4 space-y-2">
              {experiences?.map((exp) => (
                <button
                  key={exp.id}
                  onClick={() => setActiveExp(exp.id)}
                  className={`w-full text-left px-6 py-5 rounded-xl transition-all duration-300 flex items-center justify-between group ${
                    activeExp === exp.id
                      ? 'bg-bg-secondary text-brand shadow-sm border border-border-theme'
                      : 'text-text-secondary hover:bg-bg-secondary/50 hover:text-text-secondary'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold uppercase tracking-widest opacity-60 mb-1">
                      {exp.tenure}
                    </span>
                    <span className="text-lg font-serif font-bold leading-tight">
                      {exp.organization}
                    </span>
                    <span className="text-[10px] font-bold text-text-secondary/40 mt-1 uppercase tracking-tighter line-clamp-1">
                      {exp.role}
                    </span>
                  </div>
                  <ChevronRight 
                    className={`w-5 h-5 transition-transform duration-300 ${
                      activeExp === exp.id ? 'translate-x-0' : '-translate-x-2 opacity-0'
                    }`} 
                  />
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 p-8 md:p-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeExp}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-12"
                >
                  <header className="border-b border-border-theme pb-8">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-brand mb-1">{currentExp.tenure}</h3>
                    <h4 className="text-3xl font-serif font-bold text-text-primary mb-2">{currentExp.organization}</h4>
                    <p className="text-lg font-bold text-text-secondary font-serif uppercase tracking-tight">{currentExp.role}</p>
                  </header>

                  {/* Impact Stories */}
                  <div className="prose prose-orange prose-sm max-w-none text-text-secondary font-story italic leading-relaxed px-4 border-l-2 border-brand/20 hover:border-brand transition-all">
                    {currentExp.description ? (
                      <Markdown remarkPlugins={[remarkGfm]}>{currentExp.description}</Markdown>
                    ) : (
                      <p className="italic text-text-secondary/40 font-story">Detailed impact stories for this role are being curated.</p>
                    )}
                  </div>

                  {/* Visual Content */}
                  {currentExp?.images && currentExp.images.length > 0 && (
                    <div className="pt-8 border-t border-border-theme/30">
                      <div className="flex items-center gap-2 mb-6">
                        <ImageIcon className="text-brand w-4 h-4" />
                        <h5 className="text-sm font-bold uppercase tracking-widest text-text-primary">Journey Milestones</h5>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentExp.images.map((img, idx) => (
                          <motion.div 
                            key={idx}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="relative group cursor-pointer aspect-video sm:aspect-square rounded-2xl overflow-hidden border-2 border-bg-primary shadow-md hover:shadow-xl transition-all"
                            onClick={() => setLightbox(img)}
                          >
                            <img 
                              src={img} 
                              alt={`${currentExp.organization} Milestone ${idx + 1}`} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                               <Maximize2 className="text-white w-6 h-6" />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )
      }
      </section>


      {/* Loading next phase... section */}
      <section className="mb-24 pt-12 border-t border-border-theme/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-[1px] bg-brand/40" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand/60">New Chapter</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-text-primary tracking-tight italic">
              Loading next phase<span className="text-brand">...</span>
            </h2>
            <div className="space-y-6 text-lg text-text-secondary font-story italic leading-relaxed">
              <p>
                The journey doesn't end at the last milestone. It's a continuous iteration of learning, building, and evolving.
              </p>
              <div className="p-8 bg-bg-secondary rounded-[2rem] border border-border-theme shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500" />
                <p className="relative z-10 text-xl font-serif text-text-primary mb-4">"Still building, still evolving."</p>
                <p className="relative z-10 text-sm opacity-60">I am currently exploring advanced data mesh architectures and fine-tuning LLMs for niche domain expertise. Stay tuned for the next transmission.</p>
              </div>
            </div>
          </div>
          <div className="relative">
             <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-2 border-border-theme group">
                <img 
                  src="https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=800" 
                  alt="Future Exploration" 
                  className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-10">
                   <p className="text-white font-story italic text-sm opacity-80 group-hover:opacity-100 transition-opacity">Architecting the unseen...</p>
                </div>
             </div>
             {/* Decorative Elements */}
             <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-brand/10 rounded-full blur-2xl" />
             <div className="absolute -top-6 -right-6 w-32 h-32 bg-brand/5 rounded-full blur-3xl" />
          </div>
        </div>
      </section>

      {/* Final Note */}
      <section className="bg-[#1A1A2E] text-white rounded-[2.5rem] p-12 md:p-16 text-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand/20 to-transparent pointer-events-none" />
        <h2 className="text-4xl font-serif font-bold mb-6 relative z-10 font-story italic tracking-tight text-white">Let's build something data-driven!</h2>
        <p className="text-lg text-gray-200 max-w-2xl mx-auto mb-10 relative z-10 leading-relaxed font-story italic opacity-90">
          Currently based in <strong>New Delhi</strong>, I'm always open to talking about data engineering, AI, or how we can make tech feel more human.
        </p>
        <div className="flex justify-center gap-4 relative z-10">
          <a href="mailto:pjha3913@gmail.com" className="bg-brand text-white px-8 py-4 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-brand/80 transition-all shadow-lg hover:-translate-y-1">
            <Mail className="w-4 h-4" /> Say Hello
          </a>
          <a href="https://linkedin.com/in/prince-k-jha" target="_blank" rel="noopener noreferrer" className="bg-white/10 text-white border border-white/20 px-8 py-4 rounded-xl text-sm font-bold hover:bg-white/20 transition-all">
            LinkedIn
          </a>
        </div>
      </section>
    </div>
  );
}

