import { motion } from 'motion/react';
import { Mail, Phone, Linkedin, Github, Download, Printer, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Resume() {
  const navigate = useNavigate();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      {/* Controls - Hidden during print */}
      <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center print:hidden">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-text-secondary hover:text-brand transition-colors font-bold text-xs uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex gap-4">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-text-primary text-bg-primary px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-brand hover:text-white transition-all shadow-lg"
          >
            <Printer className="w-4 h-4" /> Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Resume Document */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white shadow-2xl p-8 md:p-16 text-[#1a1a2e] print:shadow-none print:p-0"
      >
        {/* Header */}
        <header className="text-center border-b-2 border-brand pb-8 mb-10">
          <h1 className="text-5xl font-serif font-bold mb-4 tracking-tight">Prince Kumar Jha</h1>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-600 font-medium">
            <a href="mailto:pjha3913@gmail.com" className="flex items-center gap-1 hover:text-brand"><Mail className="w-4 h-4" /> pjha3913@gmail.com</a>
            <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> +91 7970928775</span>
            <a href="https://linkedin.com/in/prince-k-jha" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-brand"><Linkedin className="w-4 h-4" /> linkedin.com/in/prince-k-jha</a>
            <a href="https://github.com/princekjha" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-brand"><Github className="w-4 h-4" /> github.com/princekjha</a>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-12">
          {/* Experience */}
          <section>
            <h2 className="text-xl font-bold uppercase tracking-[0.2em] text-brand border-b border-gray-100 pb-2 mb-6">Experience</h2>
            
            <div className="space-y-8">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold">Quest Alliance</h3>
                    <p className="text-brand font-bold italic">Data and Tech Officer</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">January 2024 – Present</p>
                    <p className="text-sm text-gray-500">New Delhi</p>
                  </div>
                </div>
                <ul className="list-disc list-outside ml-5 space-y-2 text-sm leading-relaxed text-gray-700">
                  <li>Designed and supervised end-to-end automated data pipelines and enterprise MIS dashboards using Python, SQL, APIs, and Power BI.</li>
                  <li>Enabled district-level indicator monitoring, fund-flow visibility, and SDG-aligned reporting, reducing manual intervention by ~40%.</li>
                  <li>Led data quality audits and governance processes for government (DTTE) and senior stakeholders.</li>
                  <li>Developed AI chatbots using Gemini-Pro for employability support and WhatsApp bots via Glific.</li>
                  <li>Ran training sessions for 150+ principal level gov. staff on data literacy and dashboard interpretation.</li>
                </ul>
              </div>

              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold">QuantumBit Technologies Private Limited, Geekster</h3>
                    <p className="text-brand font-bold italic">Data Analyst</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">June 2023 - Sept 2023</p>
                    <p className="text-sm text-gray-500">Gurugram</p>
                  </div>
                </div>
                <ul className="list-disc list-outside ml-5 space-y-1 text-sm leading-relaxed text-gray-700">
                  <li>Analyzed student feedback data and created performance dashboards for module planning.</li>
                  <li>Conducted SQL-based data cleaning and transformation ensuring reporting reliability.</li>
                  <li>Delivered actionable insights for operational planning to program teams.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Projects */}
          <section>
            <h2 className="text-xl font-bold uppercase tracking-[0.2em] text-brand border-b border-gray-100 pb-2 mb-6">Key Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border-l-2 border-gray-100 pl-4">
                <h3 className="font-bold mb-1">Revenue Insights Dashboard <span className="text-xs font-normal text-gray-400">| Power BI</span></h3>
                <p className="text-xs text-gray-500 mb-2">Dec 2023 - Jan 2024</p>
                <p className="text-sm text-gray-700 leading-relaxed">Analyzed $1.79M in revenue from 52k+ orders, identifying top-performing categories to drive sales strategies.</p>
              </div>
              <div className="border-l-2 border-gray-100 pl-4">
                <h3 className="font-bold mb-1">Finance & Supply Chain Analysis <span className="text-xs font-normal text-gray-400">| SQL</span></h3>
                <p className="text-xs text-gray-500 mb-2">Oct 2023 - Nov 2023</p>
                <p className="text-sm text-gray-700 leading-relaxed">Optimized inventory at Atliq Technology, reducing excess stock by 10% and saving $100,000 annually.</p>
              </div>
            </div>
          </section>

          {/* Education & Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <section>
              <h2 className="text-xl font-bold uppercase tracking-[0.2em] text-brand border-b border-gray-100 pb-2 mb-6">Education</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold">AlmaBetter</h3>
                  <p className="text-sm text-brand font-bold">Data Science and Analytics</p>
                  <p className="text-xs text-gray-500 italic">May 2022 – April 2023 | Bangalore</p>
                </div>
                <div>
                  <h3 className="font-bold">Lalit Narayan Mithila University</h3>
                  <p className="text-sm text-brand font-bold">Bachelor of Commerce</p>
                  <p className="text-xs text-gray-500 italic">2018 – 2021 | Darbhanga</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold uppercase tracking-[0.2em] text-brand border-b border-gray-100 pb-2 mb-6">Technical Skills</h2>
              <div className="space-y-3">
                <p className="text-sm"><strong className="text-xs uppercase tracking-wider text-gray-400 block mb-1">Analytics & Viz</strong> Power BI, Tableau, Looker Studio, Excel (VBA/App Script)</p>
                <p className="text-sm"><strong className="text-xs uppercase tracking-wider text-gray-400 block mb-1">Databases</strong> SQL, PostgreSQL, MySQL, BigQuery</p>
                <p className="text-sm"><strong className="text-xs uppercase tracking-wider text-gray-400 block mb-1">Programming</strong> Python (Pandas, NumPy, Scikit-Learn), ML, NLP</p>
                <p className="text-sm"><strong className="text-xs uppercase tracking-wider text-gray-400 block mb-1">Engineering</strong> ETL/ELT, Automated Data Pipelines, API Integration</p>
              </div>
            </section>
          </div>
        </div>

        <footer className="mt-16 pt-8 border-t border-gray-100 text-center">
          <p className="text-[10px] uppercase tracking-[0.5em] text-gray-300">Generated from Prince's Digital Hub</p>
        </footer>
      </motion.div>
    </div>
  );
}
