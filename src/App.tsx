/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Terminal,
  Trophy,
  User,
  Users,
  Calendar,
  ChevronRight,
  Award,
  BookOpen,
  Cpu,
  Menu,
  X,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const skills = [
    { name: "Python", category: "Language" },
    { name: "Java", category: "Language" },
    { name: "TypeScript", category: "Language" },
    { name: "JavaScript", category: "Language" },
    { name: "SQL", category: "Database" },
    { name: "Node.js", category: "Backend" },
    { name: "React.js", category: "Frontend" },
    { name: "Flutter", category: "Mobile" },
    { name: "XML", category: "Data" }
  ];

  const experiences = [
    {
      title: "Code Fest Um",
      role: "Frontend Developer",
      date: "NOVEMBER 2025",
      language: "TypeScript",
      description: "Developed an AI-powered predictive analytics platform to support enterprise operations and trading decisions."
    },
    {
      title: "Devmatch",
      role: "Frontend & Backend Developer",
      date: "JUNE 2025",
      language: "React.js",
      description: "Developed a blockchain-based digital ID system for the university, enabling secure and verifiable student identities that can be used across multiple campus services and applications."
    },
    {
      title: "Kitahack 2025",
      role: "Documentalist",
      date: "AUGUST 2025",
      language: "Firebase",
      description: "Developed an AI-powered chatbot to support students with learning and academic questions. Implemented interactive conversational features to provide quick, personalized educational assistance."
    },
    {
      title: "Data Science Digital Race",
      role: "Machine Learning Developer",
      date: "MAY 2025",
      language: "Python",
      description: "Trained and optimized a machine learning model (Prophet, ARIMA, ETS, XGBoost) to detect undiagnosed dyslexia early by analyzing student learning behaviors."
    },
    {
      title: "Code Nection",
      role: "Backend Developer",
      date: "SEPTEMBER 2025",
      language: "TypeScript & JavaScript",
      description: "Developed a digital campus management platform to enhance university operations and student services. Implemented efficient workflows and data-driven features to optimize resource management and decision-making."
    }
  ];

  const achievements = [
    {
      title: "Code Nection",
      status: "Final Round Finalist",
      role: "Backend Developer",
      date: "SEPTEMBER 2025",
      language: "TypeScript & JavaScript",
      description: "Developed a digital campus management platform to enhance university operations and student services. Implemented efficient workflows and data-driven features to optimize resource management and decision-making."
    }
  ];

  const committeeExperiences = [
    { title: "Deans Cup 2026", role: "Program and Protocol", date: "2026" },
    { title: "Technothon 2026", role: "Program and Protocol", date: "2026" },
    { title: "PLN 2025", role: "Program and Protocol", date: "2025" },
    { title: "Technothon 2025", role: "Logistic", date: "2025" }
  ];

  const navItems = [
    { id: 'home', label: 'Home', icon: User },
    { id: 'experience', label: 'Experience', icon: Terminal },
    { id: 'committee', label: 'Committee', icon: Users },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'education', label: 'Education', icon: BookOpen },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto py-12 px-6"
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold mb-6 tracking-wider"
                >
                  SOFTWARE ENGINEERING UNDERGRADUATE
                </motion.div>
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-8 text-slate-900">
                  HAM <br />
                  <span className="text-blue-600">ZENG YI</span>
                </h1>
                <p className="text-xl text-slate-600 font-light leading-relaxed mb-10">
                  Year 2 student at University Malaya. Specialized in full-stack development, 
                  AI integration, and building scalable digital solutions.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => setActiveTab('experience')}
                    className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all flex items-center gap-2 group shadow-xl shadow-slate-200"
                  >
                    Explore Projects
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <div className="flex items-center gap-4 px-4">
                    <a href="https://www.linkedin.com/in/ham-zeng-yi-432713353/" target="_blank" className="text-slate-400 hover:text-blue-600 transition-colors">
                      <Linkedin size={24} />
                    </a>
                    <a href="mailto:yyjane42@gmail.com" className="text-slate-400 hover:text-blue-600 transition-colors">
                      <Mail size={24} />
                    </a>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-[4/5] rounded-[48px] bg-slate-100 overflow-hidden border-8 border-white shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
                  <img 
                    src="https://picsum.photos/seed/hamzengyi/800/1000" 
                    alt="Ham Zeng Yi" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-xl border border-slate-50 max-w-[200px]">
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2">Availability</p>
                  <p className="text-sm font-bold text-slate-900 leading-tight">Internship: Sept 2026 - May 2027</p>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 'experience':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-5xl mx-auto py-12 px-6"
          >
            <div className="mb-12">
              <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-4">Competition Experience</h2>
              <p className="text-slate-500 font-light">Technical projects developed during hackathons and competitions.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {experiences.map((exp, index) => (
                <div key={exp.title} className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 hover:bg-white hover:shadow-xl transition-all group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
                      <Terminal size={24} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{exp.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{exp.title}</h3>
                  <p className="text-blue-600 font-bold text-xs mb-4">{exp.role}</p>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 font-light">{exp.description}</p>
                  <div className="flex items-center gap-2 pt-4 border-t border-slate-200">
                    <Cpu size={14} className="text-slate-400" />
                    <span className="text-xs font-mono font-bold text-slate-500">{exp.language}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );
      case 'committee':
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-5xl mx-auto py-12 px-6"
          >
            <div className="mb-12">
              <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-4">Committee Roles</h2>
              <p className="text-slate-500 font-light">Leadership and organizational contributions to the university community.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {committeeExperiences.map((exp) => (
                <div key={exp.title} className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mx-auto mb-6">
                    <Users size={24} />
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{exp.date}</p>
                  <h3 className="font-bold text-slate-900 mb-1">{exp.title}</h3>
                  <p className="text-xs text-blue-600 font-medium">{exp.role}</p>
                </div>
              ))}
            </div>
          </motion.div>
        );
      case 'achievements':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto py-12 px-6"
          >
            <div className="mb-12">
              <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-4">Achievements</h2>
              <p className="text-slate-500 font-light">Key milestones and recognitions in technical competitions.</p>
            </div>
            <div className="space-y-8">
              {achievements.map((ach) => (
                <div key={ach.title} className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[100px] -z-0 opacity-50 group-hover:bg-blue-100 transition-colors" />
                  <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 shadow-sm">
                          <Award size={28} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900">{ach.title}</h3>
                          <p className="text-blue-600 font-bold text-sm uppercase tracking-wider">{ach.status}</p>
                        </div>
                      </div>
                      <div className="md:text-right">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{ach.date}</span>
                      </div>
                    </div>
                    
                    <p className="text-slate-600 font-light leading-relaxed mb-8 max-w-3xl">
                      {ach.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-8 pt-6 border-t border-slate-100">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Role</p>
                        <p className="text-sm font-bold text-slate-700">{ach.role}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Stack/Field</p>
                        <p className="text-sm font-bold text-slate-700">{ach.language}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );
      case 'education':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto py-12 px-6"
          >
            <div className="grid md:grid-cols-2 gap-16">
              <div>
                <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-12">Education</h2>
                <div className="p-8 rounded-[40px] bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">2024 - Present</p>
                      <h3 className="text-xl font-bold text-slate-900">University Malaya</h3>
                    </div>
                  </div>
                  <p className="text-lg text-slate-700 mb-6">Bachelor Of Software Engineering</p>
                  <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100">
                    <Award size={20} className="text-amber-500" />
                    <p className="font-bold text-slate-900">CGPA: 3.58 / 4.00</p>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-12">Technical Skills</h2>
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill) => (
                    <div key={skill.name} className="px-5 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-blue-200 transition-all">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{skill.category}</p>
                      <p className="font-bold text-slate-800">{skill.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setActiveTab('home')}
          >
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-xl group-hover:bg-blue-600 transition-colors">
              H
            </div>
            <span className="font-black text-xl tracking-tighter">HAM ZENG YI</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === item.id ? 'bg-slate-100 text-blue-600' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden bg-white border-t border-slate-100 p-6 flex flex-col gap-4"
            >
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 text-lg font-bold p-3 rounded-2xl ${activeTab === item.id ? 'bg-blue-50 text-blue-600' : 'text-slate-600'}`}
                >
                  <item.icon size={20} />
                  {item.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content Area */}
      <main className="pt-28 pb-20 min-h-[calc(100vh-80px)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 py-12 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              H
            </div>
            <span className="font-bold text-slate-900">Ham Zeng Yi</span>
          </div>
          
          <div className="flex items-center gap-8 text-sm font-bold text-slate-400">
            <button onClick={() => setActiveTab('home')} className="hover:text-blue-600 transition-colors">Home</button>
            <button onClick={() => setActiveTab('experience')} className="hover:text-blue-600 transition-colors">Experience</button>
            <button onClick={() => setActiveTab('achievements')} className="hover:text-blue-600 transition-colors">Achievements</button>
          </div>

          <div className="flex items-center gap-4">
            <a href="https://www.linkedin.com/in/ham-zeng-yi-432713353/" target="_blank" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all">
              <Linkedin size={18} />
            </a>
            <a href="mailto:yyjane42@gmail.com" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all">
              <Mail size={18} />
            </a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-200 text-center text-xs text-slate-400">
          <p>© 2026 Ham Zeng Yi. Professional Portfolio Website.</p>
        </div>
      </footer>

    </div>
  );
}
