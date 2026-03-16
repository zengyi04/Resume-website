import { useEffect, useMemo, useState, type ClipboardEvent } from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  Cpu,
  FileText,
  Linkedin,
  Mail,
  Menu,
  MoonStar,
  SunMedium,
  Terminal,
  Trash2,
  Upload,
  User,
  Users,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import profilePhotoFallback from './assets/profile-photo-placeholder.jpg';

const withBaseUrl = (assetPath: string) => `${import.meta.env.BASE_URL}${assetPath}`;

const PROFILE_IMAGE_SOURCES = [
  'images/profile-photo.png',
  'images/profile-photo.jpg',
  'images/profile-photo.jpeg',
  'images/profile-photo.webp',
].map(withBaseUrl);

const PROFILE_IMAGE_FALLBACK_SRC = profilePhotoFallback;
const ADMIN_EMAIL = 'yyjane42@gmail.com';
const ADMIN_PASSWORD = 'password123';
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '');

const buildApiUrl = (path: string) => {
  return API_BASE_URL ? `${API_BASE_URL}${path}` : path;
};

const apiFetch = (path: string, init?: RequestInit) => fetch(buildApiUrl(path), init);
const BACKEND_UNAVAILABLE_MESSAGE = 'Backend is unavailable. Start backend with `npm --prefix backend run dev` or run `npm run dev` at repo root.';
const SECTION_SHELL_CLASS = 'mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8';
const PANEL_CLASS = 'rounded-[32px] border border-white/28 bg-white/18 shadow-[0_24px_80px_-28px_rgba(67,97,140,0.3)] backdrop-blur-2xl';
const CARD_CLASS = 'rounded-[28px] border border-white/24 bg-white/16 shadow-[0_18px_60px_-30px_rgba(67,97,140,0.25)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-200/40 hover:bg-white/22';
const FORM_PANEL_CLASS = `${PANEL_CLASS} mb-10 p-6 sm:p-7`;
const TEXT_INPUT_CLASS = 'rounded-2xl border border-white/24 bg-white/34 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] outline-none transition focus:border-cyan-300/60 focus:bg-white/55 focus:ring-2 focus:ring-cyan-300/15';
const PRIMARY_BUTTON_CLASS = 'mt-4 inline-flex items-center justify-center rounded-2xl border border-cyan-200/35 bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-400 px-5 py-3 font-extrabold text-slate-900 shadow-[0_16px_40px_-18px_rgba(56,189,248,0.45)] transition hover:-translate-y-0.5 hover:brightness-105 disabled:opacity-50';
const SECONDARY_BUTTON_CLASS = 'inline-flex items-center justify-center rounded-2xl border border-white/24 bg-white/18 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-cyan-200/40 hover:bg-white/30';
const SECTION_LABEL_CLASS = 'mb-4 inline-flex items-center rounded-full border border-cyan-300/30 bg-cyan-300/16 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.28em] text-cyan-900/80';
const SECTION_TITLE_CLASS = 'text-4xl font-black tracking-[-0.04em] text-slate-900 md:text-5xl';
const SECTION_COPY_CLASS = 'mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base';
const ICON_BADGE_CLASS = 'flex h-12 w-12 items-center justify-center rounded-2xl border border-white/24 bg-white/24 text-cyan-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.28)]';
const FORM_HEADING_CLASS = 'mb-2 text-lg font-extrabold text-white';
const FORM_DESCRIPTION_CLASS = 'mb-4 text-sm leading-7 text-slate-600';
const SOFT_SURFACE_CLASS = 'rounded-2xl border border-white/24 bg-white/18 backdrop-blur-xl';

const getStaggeredMotionProps = (index: number) => ({
  initial: { opacity: 0, y: 24, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.45, delay: 0.08 * index, ease: [0.22, 1, 0.36, 1] },
});

const HOME_SIGNAL_CARDS = [
  { label: 'Focus', value: 'Full-stack and AI product work' },
  { label: 'Base', value: 'University Malaya' },
  { label: 'Status', value: 'Open for internship' },
];

const HOME_EDITORIAL_POINTS = [
  'Frontend systems with a strong visual bar',
  'Backends built for reliable CRUD and deployment',
  'Hackathon-ready products with fast iteration loops',
];

type Role = 'admin' | 'guest';
type ThemeMode = 'dark' | 'light';
type Skill = { name: string; category: string };
type WithId = { _id?: string };

type HomeData = {
  name: string;
  subtitle: string;
  bio: string;
  linkedinUrl: string;
  email: string;
  internshipAvailability: string;
};

type ExperienceData = WithId & {
  title: string;
  role: string;
  date: string;
  language: string;
  description: string;
  certificateDataUrl?: string;
  certificateName?: string;
};

type CommitteeData = WithId & {
  title: string;
  role: string;
  date: string;
};

type AchievementData = WithId & {
  title: string;
  status: string;
  role: string;
  date: string;
  language: string;
  description: string;
};

type EducationData = WithId & {
  university: string;
  degree: string;
  period: string;
  cgpa: string;
  skills: Skill[];
};

const SEED_HOME: HomeData = {
  name: 'HAM ZENG YI',
  subtitle: 'SOFTWARE ENGINEERING UNDERGRADUATE',
  bio: 'Year 2 student at University Malaya. Specialized in full-stack development, AI integration, and building scalable digital solutions.',
  linkedinUrl: 'https://www.linkedin.com/in/ham-zeng-yi-432713353/',
  email: 'yyjane42@gmail.com',
  internshipAvailability: 'Internship: Sept 2026 - May 2027',
};

const SEED_SKILLS: Skill[] = [
  { name: 'Python', category: 'Language' },
  { name: 'Java', category: 'Language' },
  { name: 'TypeScript', category: 'Language' },
  { name: 'JavaScript', category: 'Language' },
  { name: 'SQL', category: 'Database' },
  { name: 'Node.js', category: 'Backend' },
  { name: 'React.js', category: 'Frontend' },
  { name: 'Flutter', category: 'Mobile' },
  { name: 'XML', category: 'Data' },
];

const SEED_EXPERIENCES: ExperienceData[] = [
  {
    title: 'Code Fest Um',
    role: 'Frontend Developer',
    date: 'NOVEMBER 2025',
    language: 'TypeScript',
    description: 'Developed an AI-powered predictive analytics platform to support enterprise operations and trading decisions.',
  },
  {
    title: 'Devmatch',
    role: 'Frontend & Backend Developer',
    date: 'JUNE 2025',
    language: 'React.js',
    description: 'Developed a blockchain-based digital ID system for the university, enabling secure and verifiable student identities across campus services.',
  },
  {
    title: 'Kitahack 2025',
    role: 'Documentalist',
    date: 'AUGUST 2025',
    language: 'Firebase',
    description: 'Developed an AI-powered chatbot to support students with learning and academic questions.',
  },
  {
    title: 'Data Science Digital Race',
    role: 'Machine Learning Developer',
    date: 'MAY 2025',
    language: 'Python',
    description: 'Trained and optimized machine learning models to detect undiagnosed dyslexia early.',
  },
  {
    title: 'Code Nection',
    role: 'Backend Developer',
    date: 'SEPTEMBER 2025',
    language: 'TypeScript & JavaScript',
    description: 'Developed a digital campus management platform to enhance university operations and student services.',
  },
];

const SEED_ACHIEVEMENTS: AchievementData[] = [
  {
    title: 'Code Nection',
    status: 'Final Round Finalist',
    role: 'Backend Developer',
    date: 'SEPTEMBER 2025',
    language: 'TypeScript & JavaScript',
    description: 'Developed a digital campus management platform to enhance university operations and student services.',
  },
];

const SEED_COMMITTEE: CommitteeData[] = [
  { title: 'Deans Cup 2026', role: 'Program and Protocol', date: '2026' },
  { title: 'Technothon 2026', role: 'Program and Protocol', date: '2026' },
  { title: 'PLN 2025', role: 'Program and Protocol', date: '2025' },
  { title: 'Technothon 2025', role: 'Logistic', date: '2025' },
];

const SEED_EDUCATION: EducationData[] = [
  {
    university: 'University Malaya',
    degree: 'Bachelor Of Software Engineering',
    period: '2024 - Present',
    cgpa: '3.58 / 4.00',
    skills: SEED_SKILLS,
  },
];

const SEED_PAYLOAD = {
  home: SEED_HOME,
  experience: SEED_EXPERIENCES,
  committee: SEED_COMMITTEE,
  achievements: SEED_ACHIEVEMENTS,
  education: SEED_EDUCATION,
};

const emptyExperience: ExperienceData = {
  title: '',
  role: '',
  date: '',
  language: '',
  description: '',
  certificateDataUrl: '',
  certificateName: '',
};
const emptyCommittee: CommitteeData = { title: '', role: '', date: '' };
const emptyAchievement: AchievementData = { title: '', status: '', role: '', date: '', language: '', description: '' };
const emptyEducation = { university: '', degree: '', period: '', cgpa: '', skillsText: '' };

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileImageIndex, setProfileImageIndex] = useState(0);

  const [role, setRole] = useState<Role | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const [authError, setAuthError] = useState('');

  const [homeData, setHomeData] = useState<HomeData>(SEED_HOME);
  const [skills, setSkills] = useState<Skill[]>(SEED_SKILLS);
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [achievements, setAchievements] = useState<AchievementData[]>([]);
  const [committeeExperiences, setCommitteeExperiences] = useState<CommitteeData[]>([]);
  const [educationData, setEducationData] = useState<EducationData[]>(SEED_EDUCATION);

  const [experienceForm, setExperienceForm] = useState<ExperienceData>(emptyExperience);
  const [achievementForm, setAchievementForm] = useState<AchievementData>(emptyAchievement);
  const [committeeForm, setCommitteeForm] = useState<CommitteeData>(emptyCommittee);
  const [educationForm, setEducationForm] = useState(emptyEducation);

  const [saving, setSaving] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState('');

  const isAdmin = role === 'admin';
  const isLightTheme = themeMode === 'light';

  const currentEducation = useMemo(() => {
    return educationData.find((item) => /present/i.test(item.period)) ?? educationData[0] ?? SEED_EDUCATION[0];
  }, [educationData]);

  const additionalEducation = useMemo(() => {
    return educationData.filter((item) => item._id !== currentEducation._id && item.university !== currentEducation.university);
  }, [educationData, currentEducation]);

  const navItems = [
    { id: 'home', label: 'Home', icon: User },
    { id: 'experience', label: 'Experience', icon: Terminal },
    { id: 'committee', label: 'Committee', icon: Users },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'education', label: 'Education', icon: BookOpen },
  ];

  const parseSkillsText = (skillsText: string): Skill[] => {
    return skillsText
      .split(',')
      .map((token) => token.trim())
      .filter(Boolean)
      .map((token) => {
        const [nameRaw, categoryRaw] = token.split(':').map((item) => item.trim());
        return { name: nameRaw, category: categoryRaw || 'Skill' };
      });
  };

  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
          return;
        }

        reject(new Error('Failed to read certificate file.'));
      };
      reader.onerror = () => reject(new Error('Failed to read certificate file.'));
      reader.readAsDataURL(file);
    });
  };

  const handleExperienceCertificateUpload = async (file?: File) => {
    if (!file) {
      return;
    }

    const maxBytes = 4 * 1024 * 1024;
    if (file.size > maxBytes) {
      setSaveMessage('Certificate file is too large. Please upload a file smaller than 4MB.');
      return;
    }

    try {
      const certificateDataUrl = await readFileAsDataUrl(file);
      setExperienceForm((prev) => ({ ...prev, certificateDataUrl, certificateName: file.name }));
      setSaveMessage('Certificate file attached. Save Experience to upload to database.');
    } catch (error) {
      setSaveMessage((error as Error).message);
    }
  };

  const handleExperiencePaste = (event: ClipboardEvent<HTMLDivElement>) => {
    const imageItem = Array.from(event.clipboardData.items).find((item) => item.type.startsWith('image/'));

    if (!imageItem) {
      return;
    }

    const file = imageItem.getAsFile();
    if (!file) {
      return;
    }

    event.preventDefault();
    void handleExperienceCertificateUpload(file);
  };

  const checkBackendHealth = async (): Promise<boolean> => {
    try {
      const response = await apiFetch('/api/health');
      return response.ok;
    } catch {
      return false;
    }
  };

  const fetchAllData = async (): Promise<{ seeded: boolean }> => {
    const [homeRes, experienceRes, committeeRes, achievementsRes, educationRes] = await Promise.all([
      apiFetch('/api/home'),
      apiFetch('/api/experience'),
      apiFetch('/api/committee'),
      apiFetch('/api/achievements'),
      apiFetch('/api/education'),
    ]);

    const home = homeRes.ok ? ((await homeRes.json()) as HomeData | null) : null;
    const experience = experienceRes.ok ? ((await experienceRes.json()) as ExperienceData[]) : [];
    const committee = committeeRes.ok ? ((await committeeRes.json()) as CommitteeData[]) : [];
    const achievement = achievementsRes.ok ? ((await achievementsRes.json()) as AchievementData[]) : [];
    const education = educationRes.ok ? ((await educationRes.json()) as EducationData[]) : [];

    const needsSeed = !home && experience.length === 0 && committee.length === 0 && achievement.length === 0 && education.length === 0;

    if (needsSeed) {
      const seedRes = await apiFetch('/api/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(SEED_PAYLOAD),
      });

      if (!seedRes.ok) {
        throw new Error('Failed to seed default data to MongoDB.');
      }

      return { seeded: true };
    }

    setHomeData(home ?? SEED_HOME);
    setExperiences(experience);
    setCommitteeExperiences(committee);
    setAchievements(achievement);
    const resolvedEducation = education.length ? education : SEED_EDUCATION;
    setEducationData(resolvedEducation);

    const resolvedCurrentEducation = resolvedEducation.find((item) => /present/i.test(item.period)) ?? resolvedEducation[0];
    setSkills(resolvedCurrentEducation?.skills?.length ? resolvedCurrentEducation.skills : SEED_SKILLS);

    return { seeded: false };
  };

  const syncData = async (): Promise<boolean> => {
    const isBackendHealthy = await checkBackendHealth();

    if (!isBackendHealthy) {
      setSaveMessage((current) =>
        current.includes('saved') || current.includes('deleted') ? current : BACKEND_UNAVAILABLE_MESSAGE
      );
      return false;
    }

    try {
      const result = await fetchAllData();
      if (result.seeded) {
        await fetchAllData();
      }

      setSaveMessage((current) => (current === BACKEND_UNAVAILABLE_MESSAGE ? '' : current));
      return true;
    } catch (error) {
      console.error('Failed to sync data from backend.', error);
      setSaveMessage((current) =>
        current.includes('saved') || current.includes('deleted') ? current : 'Failed to sync data from backend.'
      );
      return false;
    }
  };

  useEffect(() => {
    setProfileImageIndex(0);
  }, []);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('resume-theme');

    if (storedTheme === 'dark' || storedTheme === 'light') {
      setThemeMode(storedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = themeMode;
    window.localStorage.setItem('resume-theme', themeMode);
  }, [themeMode]);

  useEffect(() => {
    if (!role) {
      return;
    }

    let timeoutId: number | undefined;
    let cancelled = false;

    const poll = async () => {
      const success = await syncData();
      if (cancelled) {
        return;
      }

      timeoutId = window.setTimeout(() => {
        void poll();
      }, success ? 8000 : 25000);
    };

    void poll();

    return () => {
      cancelled = true;
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [role]);

  const handleAdminLogin = () => {
    setAuthError('');
    if (loginEmail === ADMIN_EMAIL && loginPassword === ADMIN_PASSWORD) {
      setRole('admin');
      setActiveTab('home');
      setSaveMessage('');
      return;
    }

    setAuthError('Invalid email or password.');
  };

  const handleGuestEntry = () => {
    setAuthError('');
    setRole('guest');
    setActiveTab('home');
    setSaveMessage('');
  };

  const toggleThemeMode = () => {
    setThemeMode((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  const resetSession = () => {
    setRole(null);
    setLoginEmail('');
    setLoginPassword('');
    setShowLoginPassword(false);
    setAuthError('');
    setSaveMessage('');
    setIsMenuOpen(false);
  };

  const resetStatus = () => setSaveMessage('');

  const handleAddExperience = async () => {
    if (!isAdmin) {
      return;
    }

    const hasAnyValue =
      Boolean(experienceForm.title.trim()) ||
      Boolean(experienceForm.role.trim()) ||
      Boolean(experienceForm.date.trim()) ||
      Boolean(experienceForm.language.trim()) ||
      Boolean(experienceForm.description.trim()) ||
      Boolean(experienceForm.certificateDataUrl);

    if (!hasAnyValue) {
      setSaveMessage('Add at least one field or paste/upload sijil before saving experience.');
      return;
    }

    setSaving('experience');
    setSaveMessage('');

    try {
      const response = await apiFetch('/api/experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(experienceForm),
      });

      if (!response.ok) {
        throw new Error('Failed to save experience.');
      }

      setExperienceForm(emptyExperience);
      setSaveMessage('Experience saved to MongoDB.');
      await syncData();
    } catch (error) {
      setSaveMessage((error as Error).message);
    } finally {
      setSaving(null);
    }
  };

  const handleDeleteExperience = async (id?: string) => {
    if (!isAdmin || !id) {
      return;
    }

    setSaving(`experience-delete-${id}`);
    setSaveMessage('');

    try {
      const response = await apiFetch(`/api/experience/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete experience.');
      }

      setSaveMessage('Experience deleted.');
      await syncData();
    } catch (error) {
      setSaveMessage((error as Error).message);
    } finally {
      setSaving(null);
    }
  };

  const handleAddCommittee = async () => {
    if (!isAdmin) {
      return;
    }

    if (!committeeForm.title || !committeeForm.role || !committeeForm.date) {
      setSaveMessage('Please fill in title, role, and date for committee.');
      return;
    }

    setSaving('committee');
    setSaveMessage('');

    try {
      const response = await apiFetch('/api/committee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(committeeForm),
      });

      if (!response.ok) {
        throw new Error('Failed to save committee entry.');
      }

      setCommitteeForm(emptyCommittee);
      setSaveMessage('Committee entry saved to MongoDB.');
      await syncData();
    } catch (error) {
      setSaveMessage((error as Error).message);
    } finally {
      setSaving(null);
    }
  };

  const handleDeleteCommittee = async (id?: string) => {
    if (!isAdmin || !id) {
      return;
    }

    setSaving(`committee-delete-${id}`);
    setSaveMessage('');

    try {
      const response = await apiFetch(`/api/committee/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete committee entry.');
      }

      setSaveMessage('Committee entry deleted.');
      await syncData();
    } catch (error) {
      setSaveMessage((error as Error).message);
    } finally {
      setSaving(null);
    }
  };

  const handleAddAchievement = async () => {
    if (!isAdmin) {
      return;
    }

    if (!achievementForm.title || !achievementForm.status || !achievementForm.date) {
      setSaveMessage('Please fill in title, status, and date for achievement.');
      return;
    }

    setSaving('achievements');
    setSaveMessage('');

    try {
      const response = await apiFetch('/api/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(achievementForm),
      });

      if (!response.ok) {
        throw new Error('Failed to save achievement.');
      }

      setAchievementForm(emptyAchievement);
      setSaveMessage('Achievement saved to MongoDB.');
      await syncData();
    } catch (error) {
      setSaveMessage((error as Error).message);
    } finally {
      setSaving(null);
    }
  };

  const handleDeleteAchievement = async (id?: string) => {
    if (!isAdmin || !id) {
      return;
    }

    setSaving(`achievement-delete-${id}`);
    setSaveMessage('');

    try {
      const response = await apiFetch(`/api/achievements/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete achievement.');
      }

      setSaveMessage('Achievement deleted.');
      await syncData();
    } catch (error) {
      setSaveMessage((error as Error).message);
    } finally {
      setSaving(null);
    }
  };

  const handleAddEducation = async () => {
    if (!isAdmin) {
      return;
    }

    const parsedSkills = parseSkillsText(educationForm.skillsText);

    if (!educationForm.university || !educationForm.degree || !educationForm.period || !educationForm.cgpa) {
      setSaveMessage('Please fill in university, degree, period, and CGPA for education.');
      return;
    }

    setSaving('education');
    setSaveMessage('');

    try {
      const payload = {
        university: educationForm.university,
        degree: educationForm.degree,
        period: educationForm.period,
        cgpa: educationForm.cgpa,
        skills: parsedSkills,
      };

      const response = await apiFetch('/api/education', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save education.');
      }

      setEducationForm(emptyEducation);
      setSaveMessage('Education saved to MongoDB.');
      await syncData();
    } catch (error) {
      setSaveMessage((error as Error).message);
    } finally {
      setSaving(null);
    }
  };

  const handleDeleteEducation = async (id?: string) => {
    if (!isAdmin || !id) {
      return;
    }

    setSaving(`education-delete-${id}`);
    setSaveMessage('');

    try {
      const response = await apiFetch(`/api/education/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete education.');
      }

      setSaveMessage('Education deleted.');
      await syncData();
    } catch (error) {
      setSaveMessage((error as Error).message);
    } finally {
      setSaving(null);
    }
  };

  const renderAdminNotice = () => {
    if (!isAdmin) {
      return null;
    }

    return (
      <div className="mb-8 rounded-3xl border border-cyan-300/18 bg-cyan-300/8 px-5 py-4 text-sm font-semibold text-cyan-50 shadow-[0_18px_50px_-30px_rgba(34,211,238,0.8)] backdrop-blur-xl">
        Admin mode: you can add and delete records. Changes save to MongoDB and guest view auto-refreshes.
      </div>
    );
  };

  const renderStatus = () => {
    if (!saveMessage) {
      return null;
    }

    const isError = saveMessage.toLowerCase().includes('failed') || saveMessage.toLowerCase().includes('please');

    return (
      <div
        className={`mb-6 rounded-3xl border px-5 py-4 text-sm font-semibold shadow-[0_18px_50px_-30px_rgba(8,15,30,0.8)] backdrop-blur-xl ${
          isError ? 'border-rose-300/18 bg-rose-300/8 text-rose-100' : 'border-emerald-300/18 bg-emerald-300/8 text-emerald-100'
        }`}
      >
        {saveMessage}
      </div>
    );
  };

  const renderDeleteButton = (onDelete: () => Promise<void>, saveKey: string) => {
    if (!isAdmin) {
      return null;
    }

    return (
      <button
        onClick={() => void onDelete()}
        disabled={saving === saveKey}
        className="inline-flex items-center gap-1 rounded-full border border-red-500/55 bg-red-500/20 px-3 py-1.5 text-xs font-bold text-red-50 shadow-[0_10px_30px_-18px_rgba(239,68,68,0.95)] transition hover:bg-red-500/28 hover:border-red-400/70 disabled:opacity-50"
      >
        <Trash2 size={13} />
        Delete
      </button>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={SECTION_SHELL_CLASS}>
            {renderAdminNotice()}
            {renderStatus()}
            <div className="grid items-center gap-8 xl:grid-cols-[1.15fr_0.85fr]">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className={`${PANEL_CLASS} relative overflow-hidden p-8 sm:p-10 lg:p-12`}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                <div className="absolute -left-16 top-8 h-40 w-40 rounded-full bg-cyan-300/10 blur-3xl" />
                <div className="absolute -right-10 bottom-6 h-40 w-40 rounded-full bg-fuchsia-300/10 blur-3xl" />
                <div className="relative">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className={SECTION_LABEL_CLASS}
                  >
                    {homeData.subtitle}
                  </motion.div>
                  <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
                    <div>
                      <h1 className="max-w-4xl text-5xl font-black leading-[0.88] tracking-[-0.06em] text-white sm:text-6xl md:text-7xl xl:text-[5.4rem]">
                        {homeData.name.split(' ').slice(0, 1).join(' ')} <br />
                        <span className="bg-gradient-to-r from-cyan-200 via-sky-300 to-fuchsia-200 bg-clip-text text-transparent">
                          {homeData.name.split(' ').slice(1).join(' ')}
                        </span>
                      </h1>
                      <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-xl">{homeData.bio}</p>
                      <div className="mt-8 flex flex-wrap gap-4">
                        <button
                          onClick={() => {
                            setActiveTab('experience');
                            resetStatus();
                          }}
                          className="group inline-flex items-center gap-2 rounded-2xl border border-cyan-200/25 bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-400 px-7 py-4 font-extrabold text-slate-950 shadow-[0_18px_55px_-25px_rgba(56,189,248,0.95)] transition hover:-translate-y-0.5"
                        >
                          Explore Projects
                          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <div className="flex items-center gap-3">
                          <a href={homeData.linkedinUrl} target="_blank" className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/14 bg-white/8 text-slate-200 transition hover:border-cyan-200/30 hover:bg-white/14 hover:text-cyan-100" rel="noreferrer">
                            <Linkedin size={24} />
                          </a>
                          <a href={`mailto:${homeData.email}`} className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/14 bg-white/8 text-slate-200 transition hover:border-cyan-200/30 hover:bg-white/14 hover:text-cyan-100">
                            <Mail size={24} />
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className={`${SOFT_SURFACE_CLASS} p-5 sm:p-6`}>
                      <div className="space-y-3">
                        {HOME_EDITORIAL_POINTS.map((point, index) => (
                          <motion.div key={point} {...getStaggeredMotionProps(index)} className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
                            <p className="text-sm leading-6 text-slate-200">{point}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-10 grid gap-4 sm:grid-cols-3">
                    {HOME_SIGNAL_CARDS.map((item, index) => (
                      <motion.div key={item.label} {...getStaggeredMotionProps(index)} className="rounded-2xl border border-white/12 bg-white/8 px-4 py-4 backdrop-blur-xl">
                        <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-slate-400">{item.label}</p>
                        <p className="mt-2 text-sm font-bold text-white">{item.value}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
              <div className="relative">
                <motion.div
                  initial={{ opacity: 0, x: 30, rotate: 2 }}
                  animate={{ opacity: 1, x: 0, rotate: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className={`${PANEL_CLASS} relative mx-auto aspect-[0.9] w-full max-w-[430px] overflow-hidden rounded-[40px] p-4`}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#67e8f933,transparent_44%),linear-gradient(180deg,rgba(15,23,42,0.35),rgba(15,23,42,0.7))]" />
                  <div className="absolute inset-x-4 top-4 bottom-[18%] overflow-hidden rounded-[30px] border border-white/12 bg-slate-800/60">
                    <img
                      src={PROFILE_IMAGE_SOURCES[profileImageIndex] ?? PROFILE_IMAGE_FALLBACK_SRC}
                      alt="Ham Zeng Yi portrait"
                      className="w-full h-full object-cover object-center"
                      onError={(event) => {
                        const image = event.currentTarget;

                        if (image.src.endsWith(PROFILE_IMAGE_FALLBACK_SRC)) {
                          return;
                        }

                        setProfileImageIndex((currentIndex) => {
                          const nextIndex = currentIndex + 1;
                          if (nextIndex >= PROFILE_IMAGE_SOURCES.length) {
                            image.src = PROFILE_IMAGE_FALLBACK_SRC;
                            return currentIndex;
                          }

                          return nextIndex;
                        });
                      }}
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-[32%] bg-gradient-to-t from-slate-950/90 to-transparent" />
                </motion.div>
                <div className="absolute -bottom-5 right-0 max-w-[220px] rounded-[28px] border border-white/16 bg-white/12 p-5 text-right shadow-[0_18px_50px_-30px_rgba(8,15,30,0.9)] backdrop-blur-2xl">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-cyan-100/80">Availability</p>
                  <p className="mt-2 text-sm font-bold leading-6 text-white">{homeData.internshipAvailability}</p>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 'experience':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className={SECTION_SHELL_CLASS}>
            {renderAdminNotice()}
            {renderStatus()}

            {isAdmin && (
              <div className={FORM_PANEL_CLASS} onPaste={handleExperiencePaste}>
                <h3 className={FORM_HEADING_CLASS}>Add Experience</h3>
                <p className={FORM_DESCRIPTION_CLASS}>You can optionally fill any info and paste or upload sijil for guests to view.</p>
                <div className="grid gap-3 md:grid-cols-2">
                  <input className={TEXT_INPUT_CLASS} placeholder="Title (optional)" value={experienceForm.title} onChange={(e) => setExperienceForm((prev) => ({ ...prev, title: e.target.value }))} />
                  <input className={TEXT_INPUT_CLASS} placeholder="Role (optional)" value={experienceForm.role} onChange={(e) => setExperienceForm((prev) => ({ ...prev, role: e.target.value }))} />
                  <input className={TEXT_INPUT_CLASS} placeholder="Date (optional)" value={experienceForm.date} onChange={(e) => setExperienceForm((prev) => ({ ...prev, date: e.target.value }))} />
                  <input className={TEXT_INPUT_CLASS} placeholder="Language (optional)" value={experienceForm.language} onChange={(e) => setExperienceForm((prev) => ({ ...prev, language: e.target.value }))} />
                </div>
                <textarea className={`${TEXT_INPUT_CLASS} mt-3 min-h-[90px] w-full`} placeholder="Description (optional)" value={experienceForm.description} onChange={(e) => setExperienceForm((prev) => ({ ...prev, description: e.target.value }))} />
                <label className="mt-3 flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-white/18 bg-white/8 px-3 py-2 text-sm text-slate-300 transition-colors hover:border-cyan-300/35 hover:text-cyan-100">
                  <Upload size={16} />
                  <span>{experienceForm.certificateName || 'Upload or paste sijil (jpg, png, pdf)'}</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      void handleExperienceCertificateUpload(file);
                      event.currentTarget.value = '';
                    }}
                  />
                </label>
                {experienceForm.certificateDataUrl && (
                  <div className="mt-2 flex items-center gap-3 rounded-xl border border-white/12 bg-slate-950/25 px-3 py-2 text-xs text-slate-300">
                    <FileText size={14} />
                    <span className="truncate">{experienceForm.certificateName || 'Certificate attached'}</span>
                    <button
                      type="button"
                      onClick={() => setExperienceForm((prev) => ({ ...prev, certificateDataUrl: '', certificateName: '' }))}
                      className="ml-auto rounded-md border border-white/12 px-2 py-1 text-[11px] font-semibold text-slate-200 transition hover:bg-white/10"
                    >
                      Remove
                    </button>
                  </div>
                )}
                <button onClick={() => void handleAddExperience()} disabled={saving === 'experience'} className={PRIMARY_BUTTON_CLASS}>
                  {saving === 'experience' ? 'Saving...' : 'Save Experience'}
                </button>
              </div>
            )}

            <div className="mb-10">
              <p className={SECTION_LABEL_CLASS}>Experience</p>
              <h2 className={SECTION_TITLE_CLASS}>Competition Experience</h2>
              <p className={SECTION_COPY_CLASS}>Technical projects developed during hackathons and competitions.</p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {experiences.map((exp, index) => (
                <motion.div key={exp._id ?? `${exp.title}-${index}`} {...getStaggeredMotionProps(index)}>
                  <div className={`${CARD_CLASS} group p-8`}>
                  <div className="mb-6 flex justify-between items-start gap-3">
                    <div className={ICON_BADGE_CLASS}>
                      <Terminal size={24} />
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate-400">{exp.date}</span>
                      {renderDeleteButton(() => handleDeleteExperience(exp._id), `experience-delete-${exp._id ?? ''}`)}
                    </div>
                  </div>
                  <h3 className="mb-1 text-xl font-extrabold text-white">{exp.title}</h3>
                  <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-100/85">{exp.role}</p>
                  <p className="mb-6 text-sm leading-7 text-slate-300">{exp.description}</p>
                  {exp.certificateDataUrl && (
                    <div className="mb-5 rounded-2xl border border-white/12 bg-slate-950/25 p-3 backdrop-blur-xl">
                      {exp.certificateDataUrl.startsWith('data:image') && (
                        <img
                          src={exp.certificateDataUrl}
                          alt={`${exp.title} certificate`}
                          className="mb-3 h-40 w-full rounded-xl object-cover"
                        />
                      )}
                      <a
                        href={exp.certificateDataUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-cyan-200/20 bg-cyan-300/10 px-3 py-2 text-xs font-bold text-cyan-100 transition hover:bg-cyan-300/16"
                      >
                        <FileText size={14} />
                        View Sijil{exp.certificateName ? `: ${exp.certificateName}` : ''}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2 border-t border-white/10 pt-4">
                    <Cpu size={14} className="text-slate-400" />
                    <span className="text-xs font-mono font-bold text-slate-300">{exp.language}</span>
                  </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      case 'committee':
        return (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={SECTION_SHELL_CLASS}>
            {renderAdminNotice()}
            {renderStatus()}

            {isAdmin && (
              <div className={FORM_PANEL_CLASS}>
                <h3 className={FORM_HEADING_CLASS}>Add Committee Entry</h3>
                <div className="grid gap-3 md:grid-cols-3">
                  <input className={TEXT_INPUT_CLASS} placeholder="Title" value={committeeForm.title} onChange={(e) => setCommitteeForm((prev) => ({ ...prev, title: e.target.value }))} />
                  <input className={TEXT_INPUT_CLASS} placeholder="Role" value={committeeForm.role} onChange={(e) => setCommitteeForm((prev) => ({ ...prev, role: e.target.value }))} />
                  <input className={TEXT_INPUT_CLASS} placeholder="Date" value={committeeForm.date} onChange={(e) => setCommitteeForm((prev) => ({ ...prev, date: e.target.value }))} />
                </div>
                <button onClick={() => void handleAddCommittee()} disabled={saving === 'committee'} className={PRIMARY_BUTTON_CLASS}>
                  {saving === 'committee' ? 'Saving...' : 'Save Committee'}
                </button>
              </div>
            )}

            <div className="mb-10">
              <p className={SECTION_LABEL_CLASS}>Committee</p>
              <h2 className={SECTION_TITLE_CLASS}>Committee Roles</h2>
              <p className={SECTION_COPY_CLASS}>Leadership and organizational contributions to the university community.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {committeeExperiences.map((exp, index) => (
                <motion.div key={exp._id ?? `${exp.title}-${index}`} {...getStaggeredMotionProps(index)}>
                  <div className={`${CARD_CLASS} p-8 text-center`}>
                  <div className="mb-6 flex justify-between items-start gap-2">
                    <div className={`${ICON_BADGE_CLASS} mx-auto rounded-full`}>
                      <Users size={24} />
                    </div>
                    {renderDeleteButton(() => handleDeleteCommittee(exp._id), `committee-delete-${exp._id ?? ''}`)}
                  </div>
                  <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate-400">{exp.date}</p>
                  <h3 className="mb-1 font-extrabold text-white">{exp.title}</h3>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100/85">{exp.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      case 'achievements':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={SECTION_SHELL_CLASS}>
            {renderAdminNotice()}
            {renderStatus()}

            {isAdmin && (
              <div className={FORM_PANEL_CLASS}>
                <h3 className={FORM_HEADING_CLASS}>Add Achievement</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  <input className={TEXT_INPUT_CLASS} placeholder="Title" value={achievementForm.title} onChange={(e) => setAchievementForm((prev) => ({ ...prev, title: e.target.value }))} />
                  <input className={TEXT_INPUT_CLASS} placeholder="Status" value={achievementForm.status} onChange={(e) => setAchievementForm((prev) => ({ ...prev, status: e.target.value }))} />
                  <input className={TEXT_INPUT_CLASS} placeholder="Role" value={achievementForm.role} onChange={(e) => setAchievementForm((prev) => ({ ...prev, role: e.target.value }))} />
                  <input className={TEXT_INPUT_CLASS} placeholder="Date" value={achievementForm.date} onChange={(e) => setAchievementForm((prev) => ({ ...prev, date: e.target.value }))} />
                  <input className={`${TEXT_INPUT_CLASS} md:col-span-2`} placeholder="Language" value={achievementForm.language} onChange={(e) => setAchievementForm((prev) => ({ ...prev, language: e.target.value }))} />
                </div>
                <textarea className={`${TEXT_INPUT_CLASS} mt-3 min-h-[90px] w-full`} placeholder="Description" value={achievementForm.description} onChange={(e) => setAchievementForm((prev) => ({ ...prev, description: e.target.value }))} />
                <button onClick={() => void handleAddAchievement()} disabled={saving === 'achievements'} className={PRIMARY_BUTTON_CLASS}>
                  {saving === 'achievements' ? 'Saving...' : 'Save Achievement'}
                </button>
              </div>
            )}

            <div className="mb-10">
              <p className={SECTION_LABEL_CLASS}>Achievements</p>
              <h2 className={SECTION_TITLE_CLASS}>Achievements</h2>
              <p className={SECTION_COPY_CLASS}>Key milestones and recognitions in technical competitions.</p>
            </div>
            <div className="space-y-8">
              {achievements.map((ach, index) => (
                <motion.div key={ach._id ?? `${ach.title}-${index}`} {...getStaggeredMotionProps(index)}>
                  <div className={`${CARD_CLASS} group relative overflow-hidden p-8`}>
                  <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-[100px] bg-cyan-300/10 -z-0 opacity-80 transition-colors group-hover:bg-fuchsia-300/12" />
                  <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/14 bg-white/10 text-cyan-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                          <Award size={28} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-extrabold text-white">{ach.title}</h3>
                          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-cyan-100/85">{ach.status}</p>
                        </div>
                      </div>
                      <div className="md:text-right flex flex-col items-end gap-2">
                        <span className="text-xs font-extrabold uppercase tracking-[0.22em] text-slate-400">{ach.date}</span>
                        {renderDeleteButton(() => handleDeleteAchievement(ach._id), `achievement-delete-${ach._id ?? ''}`)}
                      </div>
                    </div>

                    <p className="mb-8 max-w-3xl leading-7 text-slate-300">{ach.description}</p>

                    <div className="flex flex-wrap gap-8 border-t border-white/10 pt-6">
                      <div>
                        <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate-400">Role</p>
                        <p className="text-sm font-bold text-white">{ach.role}</p>
                      </div>
                      <div>
                        <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate-400">Stack/Field</p>
                        <p className="text-sm font-bold text-white">{ach.language}</p>
                      </div>
                    </div>
                  </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      case 'education':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={SECTION_SHELL_CLASS}>
            {renderAdminNotice()}
            {renderStatus()}

            {isAdmin && (
              <div className={FORM_PANEL_CLASS}>
                <h3 className={FORM_HEADING_CLASS}>Add Education</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  <input className={TEXT_INPUT_CLASS} placeholder="University" value={educationForm.university} onChange={(e) => setEducationForm((prev) => ({ ...prev, university: e.target.value }))} />
                  <input className={TEXT_INPUT_CLASS} placeholder="Degree" value={educationForm.degree} onChange={(e) => setEducationForm((prev) => ({ ...prev, degree: e.target.value }))} />
                  <input className={TEXT_INPUT_CLASS} placeholder="Period" value={educationForm.period} onChange={(e) => setEducationForm((prev) => ({ ...prev, period: e.target.value }))} />
                  <input className={TEXT_INPUT_CLASS} placeholder="CGPA" value={educationForm.cgpa} onChange={(e) => setEducationForm((prev) => ({ ...prev, cgpa: e.target.value }))} />
                </div>
                <input className={`${TEXT_INPUT_CLASS} mt-3 w-full`} placeholder="Skills (comma separated, optional format: Skill:Category)" value={educationForm.skillsText} onChange={(e) => setEducationForm((prev) => ({ ...prev, skillsText: e.target.value }))} />
                <button onClick={() => void handleAddEducation()} disabled={saving === 'education'} className={PRIMARY_BUTTON_CLASS}>
                  {saving === 'education' ? 'Saving...' : 'Save Education'}
                </button>
              </div>
            )}

            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <p className={SECTION_LABEL_CLASS}>Education</p>
                <h2 className={`${SECTION_TITLE_CLASS} mb-12`}>Education</h2>
                <div className={`${PANEL_CLASS} p-8`}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className={ICON_BADGE_CLASS}>
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-cyan-100/85">{currentEducation.period}</p>
                      <h3 className="text-xl font-extrabold text-white">{currentEducation.university}</h3>
                    </div>
                  </div>
                  <p className="mb-6 text-lg text-slate-300">{currentEducation.degree}</p>
                  <div className="flex items-center gap-3 rounded-2xl border border-white/12 bg-slate-950/20 p-4">
                    <Award size={20} className="text-cyan-100" />
                    <p className="font-bold text-white">CGPA: {currentEducation.cgpa}</p>
                  </div>
                </div>

                {additionalEducation.length > 0 && (
                  <div className={`${PANEL_CLASS} mt-6 space-y-3 p-4`}>
                    <p className="text-sm font-bold text-white">More Education</p>
                    {additionalEducation.map((item, index) => (
                      <motion.div key={item._id ?? `${item.university}-${index}`} {...getStaggeredMotionProps(index)} className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 backdrop-blur-xl">
                        <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-cyan-100/85">{item.period}</p>
                        <p className="text-base font-bold text-white">{item.university}</p>
                        <p className="text-sm text-slate-300">{item.degree}</p>
                        <p className="mt-1 text-sm font-semibold text-slate-100">CGPA: {item.cgpa}</p>
                      </motion.div>
                    ))}
                  </div>
                )}

                {isAdmin && (
                  <div className={`${PANEL_CLASS} mt-6 space-y-3 p-4`}>
                    <p className="text-sm font-bold text-white">Existing education entries</p>
                    {educationData.map((item, index) => (
                      <div key={item._id ?? `${item.university}-${index}`} className="flex items-center justify-between rounded-2xl border border-white/12 bg-white/8 px-3 py-3">
                        <div>
                          <p className="text-sm font-bold text-white">{item.university}</p>
                          <p className="text-xs text-slate-400">{item.degree}</p>
                        </div>
                        {renderDeleteButton(() => handleDeleteEducation(item._id), `education-delete-${item._id ?? ''}`)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <p className={SECTION_LABEL_CLASS}>Stack</p>
                <h2 className={`${SECTION_TITLE_CLASS} mb-12`}>Technical Skills</h2>
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill, index) => (
                    <motion.div key={`${skill.name}-${index}`} {...getStaggeredMotionProps(index)} className="rounded-2xl border border-white/12 bg-white/8 px-5 py-4 shadow-[0_18px_50px_-35px_rgba(8,15,30,0.85)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-cyan-200/25 hover:bg-white/12">
                      <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate-400">{skill.category}</p>
                      <p className="font-bold text-white">{skill.name}</p>
                    </motion.div>
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

  if (!role) {
    return (
      <div className="relative min-h-screen overflow-hidden px-6 py-10 text-slate-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_75%_18%,rgba(244,114,182,0.12),transparent_22%),linear-gradient(135deg,rgba(255,255,255,0.03),transparent_42%)]" />
        <div className="relative mx-auto max-w-6xl rounded-[40px] border border-white/14 bg-white/8 p-6 shadow-[0_30px_90px_-35px_rgba(8,15,30,0.92)] backdrop-blur-2xl md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
            <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="rounded-[32px] border border-white/24 bg-white/16 p-8 md:p-10">
              <p className={SECTION_LABEL_CLASS}>Resume Portal</p>
              <p className="mt-6 max-w-xl leading-8 text-slate-300">
                Sign in as admin to manage experience, achievements, committee, and education data with direct MongoDB saves,
                or continue as guest for read-only browsing.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} className="rounded-[32px] border border-white/24 bg-white/22 p-6 shadow-[0_24px_70px_-40px_rgba(56,189,248,0.35)] backdrop-blur-2xl md:p-8">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-cyan-900/70">Access</p>
                  <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-slate-900">Login</h2>
                </div>
                <button type="button" onClick={toggleThemeMode} className="inline-flex items-center gap-2 rounded-full border border-white/24 bg-white/28 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-cyan-200/40 hover:bg-white/36">
                  {isLightTheme ? <MoonStar size={14} /> : <SunMedium size={14} />}
                  {isLightTheme ? 'Dark Mode' : 'Light Mode'}
                </button>
              </div>
              <div className="space-y-3">
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className={`${TEXT_INPUT_CLASS} w-full`}
                  placeholder="Email"
                />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className={`${TEXT_INPUT_CLASS} w-full`}
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword((current) => !current)}
                  className={SECONDARY_BUTTON_CLASS}
                >
                  {showLoginPassword ? 'Hide Password' : 'Show Password'}
                </button>
                {authError && <p className="text-sm font-medium text-rose-600">{authError}</p>}
                <button onClick={handleAdminLogin} className={`${PRIMARY_BUTTON_CLASS} mt-2 w-full`}>
                  Login
                </button>
              </div>

              <div className="my-5 border-t border-white/10" />

              <button onClick={handleGuestEntry} className={`${SECONDARY_BUTTON_CLASS} w-full`}>
                Continue as Guest
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-100 font-sans">
      <div className={`fixed inset-0 -z-10 transition-all duration-500 ${isLightTheme ? 'bg-[radial-gradient(circle_at_18%_12%,rgba(251,191,36,0.08),transparent_24%),radial-gradient(circle_at_82%_16%,rgba(244,114,182,0.08),transparent_22%),radial-gradient(circle_at_24%_82%,rgba(56,189,248,0.08),transparent_22%)]' : 'bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.18),transparent_24%),radial-gradient(circle_at_80%_15%,rgba(244,114,182,0.12),transparent_20%),radial-gradient(circle_at_25%_85%,rgba(59,130,246,0.14),transparent_24%)]'}`} />
      <nav className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between rounded-[28px] border border-white/14 bg-slate-950/30 px-4 shadow-[0_18px_60px_-30px_rgba(8,15,30,0.95)] backdrop-blur-2xl sm:px-6 lg:px-8">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => {
              setActiveTab('home');
              resetStatus();
            }}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-200/20 bg-gradient-to-br from-cyan-300 to-blue-500 text-slate-950 font-black text-xl shadow-[0_12px_30px_-18px_rgba(56,189,248,0.95)] transition group-hover:scale-105">
              H
            </div>
            <span className="font-black text-lg tracking-[-0.04em] text-white sm:text-xl">{homeData.name}</span>
          </div>

          <div className="hidden md:flex items-center gap-2 rounded-2xl border border-white/10 bg-white/6 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  resetStatus();
                }}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all duration-300 ${
                  activeTab === item.id
                    ? 'scale-110 bg-white/14 text-cyan-100 shadow-[0_10px_30px_-18px_rgba(255,255,255,0.5)]'
                    : 'text-slate-300 hover:scale-105 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              onClick={toggleThemeMode}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/12 px-4 py-2 text-xs font-bold text-slate-100 transition hover:border-cyan-200/30 hover:bg-white/10"
            >
              {isLightTheme ? <MoonStar size={14} /> : <SunMedium size={14} />}
              {isLightTheme ? 'Dark' : 'Light'}
            </button>
            <span className={`rounded-full border px-3 py-1 text-xs font-bold ${isAdmin ? 'border-emerald-300/20 bg-emerald-300/10 text-emerald-100' : 'border-white/12 bg-white/8 text-slate-200'}`}>
              {isAdmin ? 'ADMIN' : 'GUEST'}
            </span>
            <button
              onClick={resetSession}
              className="rounded-2xl border border-white/12 px-4 py-2 text-xs font-bold text-slate-200 transition hover:border-cyan-200/30 hover:bg-white/10 hover:text-white"
            >
              Logout
            </button>
          </div>

          <button className="rounded-xl border border-white/10 bg-white/8 p-2 text-slate-100 md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-4 mt-3 flex flex-col gap-4 rounded-[28px] border border-white/14 bg-slate-950/50 p-6 shadow-[0_18px_60px_-30px_rgba(8,15,30,0.95)] backdrop-blur-2xl md:hidden"
            >
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMenuOpen(false);
                    resetStatus();
                  }}
                  className={`flex items-center gap-3 rounded-2xl p-3 text-lg font-bold transition-all duration-300 ${
                    activeTab === item.id ? 'scale-105 bg-white/14 text-cyan-100 shadow-[0_10px_30px_-18px_rgba(255,255,255,0.45)]' : 'text-slate-200 hover:scale-[1.03] hover:bg-white/10'
                  }`}
                >
                  <item.icon size={20} />
                  {item.label}
                </button>
              ))}
              <button type="button" onClick={toggleThemeMode} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/12 px-3 py-2 text-sm font-bold text-slate-100">
                {isLightTheme ? <MoonStar size={16} /> : <SunMedium size={16} />}
                {isLightTheme ? 'Dark Mode' : 'Light Mode'}
              </button>
              <button
                onClick={resetSession}
                className="rounded-2xl border border-white/12 px-3 py-2 text-sm font-bold text-slate-100"
              >
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="min-h-[calc(100vh-80px)] pb-20 pt-32">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="px-6 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-cyan-200/20 bg-gradient-to-br from-cyan-300 to-blue-500 text-sm font-black text-slate-950">H</div>
            <span className="font-bold text-white">{homeData.name}</span>
          </div>

          <div className="flex items-center gap-8 text-sm font-bold text-slate-400">
            <button onClick={() => setActiveTab('home')} className={`transition-all duration-300 hover:text-cyan-100 ${activeTab === 'home' ? 'scale-110 text-cyan-100' : ''}`}>Home</button>
            <button onClick={() => setActiveTab('experience')} className={`transition-all duration-300 hover:text-cyan-100 ${activeTab === 'experience' ? 'scale-110 text-cyan-100' : ''}`}>Experience</button>
            <button onClick={() => setActiveTab('achievements')} className={`transition-all duration-300 hover:text-cyan-100 ${activeTab === 'achievements' ? 'scale-110 text-cyan-100' : ''}`}>Achievements</button>
          </div>

          <div className="flex items-center gap-4">
            <a href={homeData.linkedinUrl} target="_blank" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/8 text-slate-300 transition-all hover:border-cyan-200/30 hover:text-cyan-100" rel="noreferrer">
              <Linkedin size={18} />
            </a>
            <a href={`mailto:${homeData.email}`} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/8 text-slate-300 transition-all hover:border-cyan-200/30 hover:text-cyan-100">
              <Mail size={18} />
            </a>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-8 text-center text-xs text-slate-400">
          <p>© 2026 Ham Zeng Yi. Professional Portfolio Website.</p>
        </div>
      </footer>
    </div>
  );
}
