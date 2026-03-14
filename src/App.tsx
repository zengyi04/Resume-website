/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, FormEvent } from 'react';
import {
  Mail,
  Linkedin,
  Terminal,
  User,
  Users,
  Award,
  BookOpen,
  Cpu,
  Menu,
  X,
  ArrowRight,
  Plus,
  Edit2,
  Trash2,
  LogIn,
  LogOut,
  Shield,
  Eye,
  Save,
  AlertTriangle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as api from './api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Skill { name: string; category: string; }

interface HomeData {
  _id?: string;
  name: string;
  tagline: string;
  description: string;
  availability: string;
  email: string;
  linkedin: string;
  skills: Skill[];
}

interface Experience {
  _id: string;
  title: string;
  role: string;
  date: string;
  language: string;
  description: string;
}

interface Committee {
  _id: string;
  title: string;
  role: string;
  date: string;
}

interface Achievement {
  _id: string;
  title: string;
  status: string;
  role: string;
  date: string;
  language: string;
  description: string;
}

interface EducationEntry {
  _id: string;
  institution: string;
  degree: string;
  period: string;
  cgpa: string;
}

type ModalSection = 'home' | 'experience' | 'committee' | 'achievement' | 'education';

interface ModalState {
  type: 'add' | 'edit';
  section: ModalSection;
  item: any;
}

// ─── Auth key ─────────────────────────────────────────────────────────────────
const AUTH_KEY = 'portfolio_admin_auth';

// ─── Login Page ───────────────────────────────────────────────────────────────

function LoginPage({
  onLogin,
  onGuest,
  error,
  loading,
}: {
  onLogin: (email: string, password: string) => void;
  onGuest: () => void;
  error: string;
  loading: boolean;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 shadow-xl">
            H
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900">Admin Login</h1>
          <p className="text-slate-500 mt-2 font-light">Sign in to manage your portfolio content</p>
        </div>
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium">
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-900 font-medium"
                placeholder="yyjane42@gmail.com"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-900 font-medium"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-blue-600 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={18} /> Sign In as Admin
                </>
              )}
            </button>
          </form>
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <button
              onClick={onGuest}
              className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-medium text-sm mx-auto"
            >
              <Eye size={16} /> Continue as Guest (View Only)
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Admin Modal ──────────────────────────────────────────────────────────────

function AdminModal({
  modal,
  onClose,
  onSave,
  saving,
}: {
  modal: ModalState;
  onClose: () => void;
  onSave: (section: string, data: any, id?: string) => void;
  saving: boolean;
}) {
  const { section, item } = modal;
  const isEdit = modal.type === 'edit';

  const getInitial = () => {
    if (section === 'home')
      return item || { name: '', tagline: '', description: '', availability: '', email: '', linkedin: '', skills: [] };
    if (section === 'experience')
      return item || { title: '', role: '', date: '', language: '', description: '' };
    if (section === 'committee')
      return item || { title: '', role: '', date: '' };
    if (section === 'achievement')
      return item || { title: '', status: '', role: '', date: '', language: '', description: '' };
    if (section === 'education')
      return item || { institution: '', degree: '', period: '', cgpa: '' };
    return {};
  };

  const [form, setForm] = useState<any>(getInitial());
  const [skillsText, setSkillsText] = useState(
    section === 'home'
      ? (item?.skills || []).map((s: Skill) => `${s.name}:${s.category}`).join('\n')
      : ''
  );

  const set = (key: string, value: string) => setForm((prev: any) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    let finalData = { ...form };
    if (section === 'home') {
      finalData.skills = skillsText
        .split('\n')
        .filter(Boolean)
        .map((line) => {
          const [name, category] = line.split(':').map((s) => s.trim());
          return { name, category: category || 'Other' };
        });
    }
    onSave(section, finalData, isEdit ? item?._id : undefined);
  };

  const titles: Record<string, string> = {
    home: 'Edit Profile',
    experience: isEdit ? 'Edit Experience' : 'Add Experience',
    committee: isEdit ? 'Edit Committee Role' : 'Add Committee Role',
    achievement: isEdit ? 'Edit Achievement' : 'Add Achievement',
    education: isEdit ? 'Edit Education' : 'Add Education',
  };

  const inputCls =
    'w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-900 text-sm bg-white';
  const labelCls = 'block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5';

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl my-4"
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-black tracking-tighter text-slate-900">{titles[section]}</h3>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          {section === 'home' && (
            <>
              <div><label className={labelCls}>Full Name</label><input className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} required /></div>
              <div><label className={labelCls}>Tagline (e.g. SOFTWARE ENGINEERING UNDERGRADUATE)</label><input className={inputCls} value={form.tagline} onChange={(e) => set('tagline', e.target.value)} required /></div>
              <div><label className={labelCls}>Bio Description</label><textarea className={inputCls + ' resize-none'} rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} required /></div>
              <div><label className={labelCls}>Availability</label><input className={inputCls} value={form.availability} onChange={(e) => set('availability', e.target.value)} placeholder="Internship: Sept 2026 - May 2027" required /></div>
              <div><label className={labelCls}>Email</label><input type="email" className={inputCls} value={form.email} onChange={(e) => set('email', e.target.value)} required /></div>
              <div><label className={labelCls}>LinkedIn URL</label><input className={inputCls} value={form.linkedin} onChange={(e) => set('linkedin', e.target.value)} required /></div>
              <div>
                <label className={labelCls}>Skills — one per line: Name:Category</label>
                <textarea
                  className={inputCls + ' resize-none font-mono text-xs'}
                  rows={7}
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                  placeholder={'Python:Language\nReact.js:Frontend\nSQL:Database'}
                />
              </div>
            </>
          )}
          {section === 'experience' && (
            <>
              <div><label className={labelCls}>Competition / Project Title</label><input className={inputCls} value={form.title} onChange={(e) => set('title', e.target.value)} required /></div>
              <div><label className={labelCls}>Your Role</label><input className={inputCls} value={form.role} onChange={(e) => set('role', e.target.value)} required /></div>
              <div><label className={labelCls}>Date (e.g. NOVEMBER 2025)</label><input className={inputCls} value={form.date} onChange={(e) => set('date', e.target.value)} placeholder="NOVEMBER 2025" required /></div>
              <div><label className={labelCls}>Language / Tech Stack</label><input className={inputCls} value={form.language} onChange={(e) => set('language', e.target.value)} required /></div>
              <div><label className={labelCls}>Description</label><textarea className={inputCls + ' resize-none'} rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} required /></div>
            </>
          )}
          {section === 'committee' && (
            <>
              <div><label className={labelCls}>Event / Programme Title</label><input className={inputCls} value={form.title} onChange={(e) => set('title', e.target.value)} required /></div>
              <div><label className={labelCls}>Your Role</label><input className={inputCls} value={form.role} onChange={(e) => set('role', e.target.value)} required /></div>
              <div><label className={labelCls}>Year</label><input className={inputCls} value={form.date} onChange={(e) => set('date', e.target.value)} placeholder="2025" required /></div>
            </>
          )}
          {section === 'achievement' && (
            <>
              <div><label className={labelCls}>Title</label><input className={inputCls} value={form.title} onChange={(e) => set('title', e.target.value)} required /></div>
              <div><label className={labelCls}>Status (e.g. Final Round Finalist)</label><input className={inputCls} value={form.status} onChange={(e) => set('status', e.target.value)} required /></div>
              <div><label className={labelCls}>Your Role</label><input className={inputCls} value={form.role} onChange={(e) => set('role', e.target.value)} required /></div>
              <div><label className={labelCls}>Date</label><input className={inputCls} value={form.date} onChange={(e) => set('date', e.target.value)} placeholder="SEPTEMBER 2025" required /></div>
              <div><label className={labelCls}>Language / Stack / Field</label><input className={inputCls} value={form.language} onChange={(e) => set('language', e.target.value)} required /></div>
              <div><label className={labelCls}>Description</label><textarea className={inputCls + ' resize-none'} rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} required /></div>
            </>
          )}
          {section === 'education' && (
            <>
              <div><label className={labelCls}>Institution</label><input className={inputCls} value={form.institution} onChange={(e) => set('institution', e.target.value)} required /></div>
              <div><label className={labelCls}>Degree / Programme</label><input className={inputCls} value={form.degree} onChange={(e) => set('degree', e.target.value)} required /></div>
              <div><label className={labelCls}>Period (e.g. 2024 - Present)</label><input className={inputCls} value={form.period} onChange={(e) => set('period', e.target.value)} required /></div>
              <div><label className={labelCls}>CGPA</label><input className={inputCls} value={form.cgpa} onChange={(e) => set('cgpa', e.target.value)} placeholder="3.58 / 4.00" required /></div>
            </>
          )}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={16} /> {isEdit ? 'Save Changes' : 'Create'}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  // ── Auth state ───────────────────────────────────────────────────────────
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // ── Navigation ───────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ── Remote data ──────────────────────────────────────────────────────────
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [educations, setEducations] = useState<EducationEntry[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // ── Admin UI state ───────────────────────────────────────────────────────
  const [modal, setModal] = useState<ModalState | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; section: string; title: string } | null>(null);
  const [saving, setSaving] = useState(false);

  // ── Restore auth from localStorage ───────────────────────────────────────
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      if (stored) {
        const { token: t } = JSON.parse(stored) as { token: string };
        setToken(t);
        setIsAdmin(true);
      }
    } catch {
      localStorage.removeItem(AUTH_KEY);
    }
  }, []);

  // ── Fetch all data from API ───────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setDataLoading(true);
    try {
      const [home, exp, comm, ach, edu] = await Promise.all([
        api.getHome(),
        api.getAll('experience'),
        api.getAll('committee'),
        api.getAll('achievement'),
        api.getAll('education'),
      ]);
      setHomeData(home);
      setExperiences(exp);
      setCommittees(comm);
      setAchievements(ach);
      setEducations(edu);
    } catch (e) {
      console.error('Failed to load data from API:', e);
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Auth handlers ─────────────────────────────────────────────────────────
  const handleLogin = async (email: string, password: string) => {
    setLoginLoading(true);
    setLoginError('');
    try {
      const { token: t } = await api.login(email, password);
      setToken(t);
      setIsAdmin(true);
      localStorage.setItem(AUTH_KEY, JSON.stringify({ token: t }));
      setShowLogin(false);
    } catch (e: any) {
      setLoginError(e.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setIsAdmin(false);
    localStorage.removeItem(AUTH_KEY);
  };

  // ── CRUD handlers ─────────────────────────────────────────────────────────
  const handleSave = async (section: string, data: any, id?: string) => {
    setSaving(true);
    try {
      if (section === 'home') {
        const updated = await api.updateHome(data, token!);
        setHomeData(updated);
      } else if (id) {
        const updated = await api.updateItem(section, id, data, token!);
        applyUpdate(section, updated);
      } else {
        const created = await api.createItem(section, data, token!);
        applyCreate(section, created);
      }
      setModal(null);
    } catch (e: any) {
      alert(e.message || 'Save failed — check console for details.');
    } finally {
      setSaving(false);
    }
  };

  const applyUpdate = (section: string, item: any) => {
    if (section === 'experience')
      setExperiences((prev) => prev.map((e) => (e._id === item._id ? item : e)));
    else if (section === 'committee')
      setCommittees((prev) => prev.map((c) => (c._id === item._id ? item : c)));
    else if (section === 'achievement')
      setAchievements((prev) => prev.map((a) => (a._id === item._id ? item : a)));
    else if (section === 'education')
      setEducations((prev) => prev.map((e) => (e._id === item._id ? item : e)));
  };

  const applyCreate = (section: string, item: any) => {
    if (section === 'experience') setExperiences((prev) => [...prev, item]);
    else if (section === 'committee') setCommittees((prev) => [...prev, item]);
    else if (section === 'achievement') setAchievements((prev) => [...prev, item]);
    else if (section === 'education') setEducations((prev) => [...prev, item]);
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setSaving(true);
    try {
      await api.deleteItem(deleteConfirm.section, deleteConfirm.id, token!);
      if (deleteConfirm.section === 'experience')
        setExperiences((prev) => prev.filter((e) => e._id !== deleteConfirm.id));
      else if (deleteConfirm.section === 'committee')
        setCommittees((prev) => prev.filter((c) => c._id !== deleteConfirm.id));
      else if (deleteConfirm.section === 'achievement')
        setAchievements((prev) => prev.filter((a) => a._id !== deleteConfirm.id));
      else if (deleteConfirm.section === 'education')
        setEducations((prev) => prev.filter((e) => e._id !== deleteConfirm.id));
      setDeleteConfirm(null);
    } catch (e: any) {
      alert(e.message || 'Delete failed.');
    } finally {
      setSaving(false);
    }
  };

  // ── Nav items ─────────────────────────────────────────────────────────────
  const navItems = [
    { id: 'home',         label: 'Home',         icon: User      },
    { id: 'experience',   label: 'Experience',   icon: Terminal  },
    { id: 'committee',    label: 'Committee',    icon: Users     },
    { id: 'achievements', label: 'Achievements', icon: Award     },
    { id: 'education',    label: 'Education',    icon: BookOpen  },
  ];

  // ── Section renderers ─────────────────────────────────────────────────────

  const renderHome = () => {
    if (!homeData) return null;
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto py-12 px-6">
        {isAdmin && (
          <div className="mb-6 flex justify-end">
            <button
              onClick={() => setModal({ type: 'edit', section: 'home', item: homeData })}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
            >
              <Edit2 size={15} /> Edit Profile
            </button>
          </div>
        )}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold mb-6 tracking-wider"
            >
              {homeData.tagline}
            </motion.div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-8 text-slate-900">
              HAM <br />
              <span className="text-blue-600">ZENG YI</span>
            </h1>
            <p className="text-xl text-slate-600 font-light leading-relaxed mb-10">{homeData.description}</p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setActiveTab('experience')}
                className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all flex items-center gap-2 group shadow-xl shadow-slate-200"
              >
                Explore Projects
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="flex items-center gap-4 px-4">
                <a href={homeData.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors">
                  <Linkedin size={24} />
                </a>
                <a href={`mailto:${homeData.email}`} className="text-slate-400 hover:text-blue-600 transition-colors">
                  <Mail size={24} />
                </a>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-[48px] bg-slate-100 overflow-hidden border-8 border-white shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
              <img
                src="/profile.jpg"
                alt={homeData.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(homeData.name)}&size=800&background=1e3a5f&color=ffffff&bold=true&format=png`;
                }}
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-xl border border-slate-50 max-w-[200px]">
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2">Availability</p>
              <p className="text-sm font-bold text-slate-900 leading-tight">{homeData.availability}</p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderExperience = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-5xl mx-auto py-12 px-6">
      <div className="mb-12 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-4">Competition Experience</h2>
          <p className="text-slate-500 font-light">Technical projects developed during hackathons and competitions.</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setModal({ type: 'add', section: 'experience', item: null })}
            className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <Plus size={16} /> Add Experience
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {experiences.map((exp) => (
          <div key={exp._id} className="relative bg-slate-50 p-8 rounded-[32px] border border-slate-100 hover:bg-white hover:shadow-xl transition-all group">
            {isAdmin && (
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button onClick={() => setModal({ type: 'edit', section: 'experience', item: exp })} className="w-8 h-8 bg-white rounded-lg shadow border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors">
                  <Edit2 size={14} />
                </button>
                <button onClick={() => setDeleteConfirm({ id: exp._id, section: 'experience', title: exp.title })} className="w-8 h-8 bg-white rounded-lg shadow border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            )}
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

  const renderCommittee = () => (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-5xl mx-auto py-12 px-6">
      <div className="mb-12 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-4">Committee Roles</h2>
          <p className="text-slate-500 font-light">Leadership and organizational contributions to the university community.</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setModal({ type: 'add', section: 'committee', item: null })}
            className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <Plus size={16} /> Add Role
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {committees.map((c) => (
          <div key={c._id} className="relative p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all text-center group">
            {isAdmin && (
              <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button onClick={() => setModal({ type: 'edit', section: 'committee', item: c })} className="w-7 h-7 bg-white rounded-lg shadow border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors">
                  <Edit2 size={12} />
                </button>
                <button onClick={() => setDeleteConfirm({ id: c._id, section: 'committee', title: c.title })} className="w-7 h-7 bg-white rounded-lg shadow border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 size={12} />
                </button>
              </div>
            )}
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mx-auto mb-6">
              <Users size={24} />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{c.date}</p>
            <h3 className="font-bold text-slate-900 mb-1">{c.title}</h3>
            <p className="text-xs text-blue-600 font-medium">{c.role}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderAchievements = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto py-12 px-6">
      <div className="mb-12 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-4">Achievements</h2>
          <p className="text-slate-500 font-light">Key milestones and recognitions in technical competitions.</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setModal({ type: 'add', section: 'achievement', item: null })}
            className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <Plus size={16} /> Add Achievement
          </button>
        )}
      </div>
      <div className="space-y-8">
        {achievements.map((ach) => (
          <div key={ach._id} className="relative bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden">
            {isAdmin && (
              <div className="absolute top-4 right-4 flex gap-2 z-10">
                <button onClick={() => setModal({ type: 'edit', section: 'achievement', item: ach })} className="w-8 h-8 bg-white rounded-lg shadow border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors">
                  <Edit2 size={14} />
                </button>
                <button onClick={() => setDeleteConfirm({ id: ach._id, section: 'achievement', title: ach.title })} className="w-8 h-8 bg-white rounded-lg shadow border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            )}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[100px] opacity-50 group-hover:bg-blue-100 transition-colors" />
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
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest md:text-right">{ach.date}</span>
              </div>
              <p className="text-slate-600 font-light leading-relaxed mb-8 max-w-3xl">{ach.description}</p>
              <div className="flex flex-wrap gap-8 pt-6 border-t border-slate-100">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Role</p>
                  <p className="text-sm font-bold text-slate-700">{ach.role}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Stack / Field</p>
                  <p className="text-sm font-bold text-slate-700">{ach.language}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderEducation = () => {
    const skills = homeData?.skills ?? [];
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto py-12 px-6">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-4xl font-black tracking-tighter text-slate-900">Education</h2>
              {isAdmin && (
                <button
                  onClick={() => setModal({ type: 'add', section: 'education', item: null })}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
                >
                  <Plus size={15} /> Add
                </button>
              )}
            </div>
            <div className="space-y-6">
              {educations.map((edu) => (
                <div key={edu._id} className="relative p-8 rounded-[40px] bg-slate-50 border border-slate-100 group">
                  {isAdmin && (
                    <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button onClick={() => setModal({ type: 'edit', section: 'education', item: edu })} className="w-7 h-7 bg-white rounded-lg shadow border flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors">
                        <Edit2 size={12} />
                      </button>
                      <button onClick={() => setDeleteConfirm({ id: edu._id, section: 'education', title: edu.institution })} className="w-7 h-7 bg-white rounded-lg shadow border flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{edu.period}</p>
                      <h3 className="text-xl font-bold text-slate-900">{edu.institution}</h3>
                    </div>
                  </div>
                  <p className="text-lg text-slate-700 mb-6">{edu.degree}</p>
                  <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100">
                    <Award size={20} className="text-amber-500" />
                    <p className="font-bold text-slate-900">CGPA: {edu.cgpa}</p>
                  </div>
                </div>
              ))}
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
  };

  const renderContent = () => {
    if (dataLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Loading from database…</p>
        </div>
      );
    }
    switch (activeTab) {
      case 'home':         return renderHome();
      case 'experience':  return renderExperience();
      case 'committee':   return renderCommittee();
      case 'achievements': return renderAchievements();
      case 'education':   return renderEducation();
      default: return null;
    }
  };

  // ── Show login page ───────────────────────────────────────────────────────
  if (showLogin) {
    return (
      <LoginPage
        onLogin={handleLogin}
        onGuest={() => setShowLogin(false)}
        error={loginError}
        loading={loginLoading}
      />
    );
  }

  // ── Main layout ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">

      {/* ── Navigation ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setActiveTab('home')}>
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-xl group-hover:bg-blue-600 transition-colors">H</div>
            <span className="font-black text-xl tracking-tighter">HAM ZENG YI</span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === item.id
                    ? 'bg-slate-100 text-blue-600'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
          </div>

          {/* Auth buttons + mobile toggle */}
          <div className="flex items-center gap-3">
            {isAdmin ? (
              <>
                <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100">
                  <Shield size={11} /> Admin Mode
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-blue-600 transition-all"
              >
                <LogIn size={16} />
                <span className="hidden sm:inline">Admin Login</span>
              </button>
            )}
            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
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
                  onClick={() => { setActiveTab(item.id); setIsMenuOpen(false); }}
                  className={`flex items-center gap-3 text-lg font-bold p-3 rounded-2xl ${
                    activeTab === item.id ? 'bg-blue-50 text-blue-600' : 'text-slate-600'
                  }`}
                >
                  <item.icon size={20} />
                  {item.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Main content ── */}
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

      {/* ── Footer ── */}
      <footer className="bg-slate-50 py-12 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-sm">H</div>
            <span className="font-bold text-slate-900">Ham Zeng Yi</span>
          </div>
          <div className="flex items-center gap-8 text-sm font-bold text-slate-400">
            <button onClick={() => setActiveTab('home')} className="hover:text-blue-600 transition-colors">Home</button>
            <button onClick={() => setActiveTab('experience')} className="hover:text-blue-600 transition-colors">Experience</button>
            <button onClick={() => setActiveTab('achievements')} className="hover:text-blue-600 transition-colors">Achievements</button>
          </div>
          <div className="flex items-center gap-4">
            <a href={homeData?.linkedin ?? '#'} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all">
              <Linkedin size={18} />
            </a>
            <a href={`mailto:${homeData?.email ?? ''}`} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all">
              <Mail size={18} />
            </a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-200 text-center text-xs text-slate-400">
          <p>© 2026 Ham Zeng Yi · Professional Portfolio Website</p>
        </div>
      </footer>

      {/* ── Admin: Edit / Add modal ── */}
      {modal && (
        <AdminModal modal={modal} onClose={() => setModal(null)} onSave={handleSave} saving={saving} />
      )}

      {/* ── Admin: Delete confirmation ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 flex-shrink-0">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Delete Item</h3>
                <p className="text-slate-500 text-sm">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-slate-700 mb-8">
              Are you sure you want to delete <strong>"{deleteConfirm.title}"</strong>?
              <br />
              <span className="text-sm text-slate-400">It will be permanently removed from MongoDB.</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={saving}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {saving ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
