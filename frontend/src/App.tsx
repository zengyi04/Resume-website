import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  Cpu,
  FileText,
  Linkedin,
  Mail,
  Menu,
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

type Role = 'admin' | 'guest';
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

  const resetStatus = () => setSaveMessage('');

  const handleAddExperience = async () => {
    if (!isAdmin) {
      return;
    }

    if (!experienceForm.title || !experienceForm.role || !experienceForm.date || !experienceForm.language || !experienceForm.description) {
      setSaveMessage('Please fill in title, role, date, language, and description for experience.');
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
      <div className="mb-8 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-sm font-medium text-blue-800">
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
        className={`mb-6 rounded-xl border p-3 text-sm ${
          isError ? 'border-red-100 bg-red-50 text-red-700' : 'border-emerald-100 bg-emerald-50 text-emerald-700'
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
        className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-2 py-1 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto py-12 px-6">
            {renderAdminNotice()}
            {renderStatus()}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold mb-6 tracking-wider"
                >
                  {homeData.subtitle}
                </motion.div>
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-8 text-slate-900">
                  {homeData.name.split(' ').slice(0, 1).join(' ')} <br />
                  <span className="text-blue-600">{homeData.name.split(' ').slice(1).join(' ')}</span>
                </h1>
                <p className="text-xl text-slate-600 font-light leading-relaxed mb-10">{homeData.bio}</p>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => {
                      setActiveTab('experience');
                      resetStatus();
                    }}
                    className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all flex items-center gap-2 group shadow-xl shadow-slate-200"
                  >
                    Explore Projects
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <div className="flex items-center gap-4 px-4">
                    <a href={homeData.linkedinUrl} target="_blank" className="text-slate-400 hover:text-blue-600 transition-colors" rel="noreferrer">
                      <Linkedin size={24} />
                    </a>
                    <a href={`mailto:${homeData.email}`} className="text-slate-400 hover:text-blue-600 transition-colors">
                      <Mail size={24} />
                    </a>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="relative mx-auto w-full max-w-[420px] aspect-square overflow-hidden rounded-[44px] bg-[#163a63] shadow-2xl shadow-slate-300/70">
                  <div className="absolute inset-x-0 top-0 bottom-[18%] overflow-hidden rounded-t-[44px] bg-slate-200">
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
                  <div className="absolute inset-x-0 bottom-0 h-[30%] bg-[#163a63]" />
                  <div className="absolute inset-x-[-6%] bottom-[10%] h-[24%] rounded-t-[100%] bg-white" />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-xl border border-slate-50 max-w-[200px]">
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2">Availability</p>
                  <p className="text-sm font-bold text-slate-900 leading-tight">{homeData.internshipAvailability}</p>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 'experience':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-5xl mx-auto py-12 px-6">
            {renderAdminNotice()}
            {renderStatus()}

            {isAdmin && (
              <div className="mb-10 rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm">
                <h3 className="mb-2 text-lg font-bold text-slate-900">Add Experience</h3>
                <p className="mb-4 text-sm text-slate-500">You can optionally upload sijil (certificate) for guests to view.</p>
                <div className="grid gap-3 md:grid-cols-2">
                  <input className="rounded-xl border border-slate-200 px-3 py-2" placeholder="Title" value={experienceForm.title} onChange={(e) => setExperienceForm((prev) => ({ ...prev, title: e.target.value }))} />
                  <input className="rounded-xl border border-slate-200 px-3 py-2" placeholder="Role" value={experienceForm.role} onChange={(e) => setExperienceForm((prev) => ({ ...prev, role: e.target.value }))} />
                  <input className="rounded-xl border border-slate-200 px-3 py-2" placeholder="Date" value={experienceForm.date} onChange={(e) => setExperienceForm((prev) => ({ ...prev, date: e.target.value }))} />
                  <input className="rounded-xl border border-slate-200 px-3 py-2" placeholder="Language" value={experienceForm.language} onChange={(e) => setExperienceForm((prev) => ({ ...prev, language: e.target.value }))} />
                </div>
                <textarea className="mt-3 min-h-[90px] w-full rounded-xl border border-slate-200 px-3 py-2" placeholder="Description" value={experienceForm.description} onChange={(e) => setExperienceForm((prev) => ({ ...prev, description: e.target.value }))} />
                <label className="mt-3 flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-3 py-2 text-sm text-slate-600 hover:border-blue-400 hover:text-blue-600">
                  <Upload size={16} />
                  <span>{experienceForm.certificateName || 'Upload sijil (jpg, png, pdf)'}</span>
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
                  <div className="mt-2 flex items-center gap-3 rounded-xl bg-slate-100 px-3 py-2 text-xs text-slate-600">
                    <FileText size={14} />
                    <span className="truncate">{experienceForm.certificateName || 'Certificate attached'}</span>
                    <button
                      type="button"
                      onClick={() => setExperienceForm((prev) => ({ ...prev, certificateDataUrl: '', certificateName: '' }))}
                      className="ml-auto rounded-md border border-slate-300 px-2 py-1 text-[11px] font-semibold text-slate-600 hover:bg-white"
                    >
                      Remove
                    </button>
                  </div>
                )}
                <button onClick={() => void handleAddExperience()} disabled={saving === 'experience'} className="mt-4 rounded-xl bg-slate-900 px-5 py-2 font-bold text-white hover:bg-blue-600 disabled:opacity-50">
                  {saving === 'experience' ? 'Saving...' : 'Save Experience'}
                </button>
              </div>
            )}

            <div className="mb-12">
              <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-4">Competition Experience</h2>
              <p className="text-slate-500 font-light">Technical projects developed during hackathons and competitions.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {experiences.map((exp, index) => (
                <div key={exp._id ?? `${exp.title}-${index}`} className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 hover:bg-white hover:shadow-xl transition-all group">
                  <div className="mb-6 flex justify-between items-start gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
                      <Terminal size={24} />
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">{exp.date}</span>
                      {renderDeleteButton(() => handleDeleteExperience(exp._id), `experience-delete-${exp._id ?? ''}`)}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{exp.title}</h3>
                  <p className="text-blue-600 font-bold text-xs mb-4">{exp.role}</p>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 font-light">{exp.description}</p>
                  {exp.certificateDataUrl && (
                    <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-3">
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
                        className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100"
                      >
                        <FileText size={14} />
                        View Sijil{exp.certificateName ? `: ${exp.certificateName}` : ''}
                      </a>
                    </div>
                  )}
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
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-5xl mx-auto py-12 px-6">
            {renderAdminNotice()}
            {renderStatus()}

            {isAdmin && (
              <div className="mb-10 rounded-3xl border border-slate-200 bg-white p-6">
                <h3 className="mb-4 text-lg font-bold text-slate-900">Add Committee Entry</h3>
                <div className="grid gap-3 md:grid-cols-3">
                  <input className="rounded-xl border border-slate-200 px-3 py-2" placeholder="Title" value={committeeForm.title} onChange={(e) => setCommitteeForm((prev) => ({ ...prev, title: e.target.value }))} />
                  <input className="rounded-xl border border-slate-200 px-3 py-2" placeholder="Role" value={committeeForm.role} onChange={(e) => setCommitteeForm((prev) => ({ ...prev, role: e.target.value }))} />
                  <input className="rounded-xl border border-slate-200 px-3 py-2" placeholder="Date" value={committeeForm.date} onChange={(e) => setCommitteeForm((prev) => ({ ...prev, date: e.target.value }))} />
                </div>
                <button onClick={() => void handleAddCommittee()} disabled={saving === 'committee'} className="mt-4 rounded-xl bg-slate-900 px-5 py-2 font-bold text-white hover:bg-blue-600 disabled:opacity-50">
                  {saving === 'committee' ? 'Saving...' : 'Save Committee'}
                </button>
              </div>
            )}

            <div className="mb-12">
              <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-4">Committee Roles</h2>
              <p className="text-slate-500 font-light">Leadership and organizational contributions to the university community.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {committeeExperiences.map((exp, index) => (
                <div key={exp._id ?? `${exp.title}-${index}`} className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all text-center">
                  <div className="mb-6 flex justify-between items-start gap-2">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mx-auto">
                      <Users size={24} />
                    </div>
                    {renderDeleteButton(() => handleDeleteCommittee(exp._id), `committee-delete-${exp._id ?? ''}`)}
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto py-12 px-6">
            {renderAdminNotice()}
            {renderStatus()}

            {isAdmin && (
              <div className="mb-10 rounded-3xl border border-slate-200 bg-white p-6">
                <h3 className="mb-4 text-lg font-bold text-slate-900">Add Achievement</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  <input className="rounded-xl border border-slate-200 px-3 py-2" placeholder="Title" value={achievementForm.title} onChange={(e) => setAchievementForm((prev) => ({ ...prev, title: e.target.value }))} />
                  <input className="rounded-xl border border-slate-200 px-3 py-2" placeholder="Status" value={achievementForm.status} onChange={(e) => setAchievementForm((prev) => ({ ...prev, status: e.target.value }))} />
                  <input className="rounded-xl border border-slate-200 px-3 py-2" placeholder="Role" value={achievementForm.role} onChange={(e) => setAchievementForm((prev) => ({ ...prev, role: e.target.value }))} />
                  <input className="rounded-xl border border-slate-200 px-3 py-2" placeholder="Date" value={achievementForm.date} onChange={(e) => setAchievementForm((prev) => ({ ...prev, date: e.target.value }))} />
                  <input className="rounded-xl border border-slate-200 px-3 py-2 md:col-span-2" placeholder="Language" value={achievementForm.language} onChange={(e) => setAchievementForm((prev) => ({ ...prev, language: e.target.value }))} />
                </div>
                <textarea className="mt-3 min-h-[90px] w-full rounded-xl border border-slate-200 px-3 py-2" placeholder="Description" value={achievementForm.description} onChange={(e) => setAchievementForm((prev) => ({ ...prev, description: e.target.value }))} />
                <button onClick={() => void handleAddAchievement()} disabled={saving === 'achievements'} className="mt-4 rounded-xl bg-slate-900 px-5 py-2 font-bold text-white hover:bg-blue-600 disabled:opacity-50">
                  {saving === 'achievements' ? 'Saving...' : 'Save Achievement'}
                </button>
              </div>
            )}

            <div className="mb-12">
              <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-4">Achievements</h2>
              <p className="text-slate-500 font-light">Key milestones and recognitions in technical competitions.</p>
            </div>
            <div className="space-y-8">
              {achievements.map((ach, index) => (
                <div key={ach._id ?? `${ach.title}-${index}`} className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
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
                      <div className="md:text-right flex flex-col items-end gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{ach.date}</span>
                        {renderDeleteButton(() => handleDeleteAchievement(ach._id), `achievement-delete-${ach._id ?? ''}`)}
                      </div>
                    </div>

                    <p className="text-slate-600 font-light leading-relaxed mb-8 max-w-3xl">{ach.description}</p>

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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto py-12 px-6">
            {renderAdminNotice()}
            {renderStatus()}

            {isAdmin && (
              <div className="mb-10 rounded-3xl border border-slate-200 bg-white p-6">
                <h3 className="mb-4 text-lg font-bold text-slate-900">Add Education</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  <input className="rounded-xl border border-slate-200 px-3 py-2" placeholder="University" value={educationForm.university} onChange={(e) => setEducationForm((prev) => ({ ...prev, university: e.target.value }))} />
                  <input className="rounded-xl border border-slate-200 px-3 py-2" placeholder="Degree" value={educationForm.degree} onChange={(e) => setEducationForm((prev) => ({ ...prev, degree: e.target.value }))} />
                  <input className="rounded-xl border border-slate-200 px-3 py-2" placeholder="Period" value={educationForm.period} onChange={(e) => setEducationForm((prev) => ({ ...prev, period: e.target.value }))} />
                  <input className="rounded-xl border border-slate-200 px-3 py-2" placeholder="CGPA" value={educationForm.cgpa} onChange={(e) => setEducationForm((prev) => ({ ...prev, cgpa: e.target.value }))} />
                </div>
                <input className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2" placeholder="Skills (comma separated, optional format: Skill:Category)" value={educationForm.skillsText} onChange={(e) => setEducationForm((prev) => ({ ...prev, skillsText: e.target.value }))} />
                <button onClick={() => void handleAddEducation()} disabled={saving === 'education'} className="mt-4 rounded-xl bg-slate-900 px-5 py-2 font-bold text-white hover:bg-blue-600 disabled:opacity-50">
                  {saving === 'education' ? 'Saving...' : 'Save Education'}
                </button>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-16">
              <div>
                <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-12">Education</h2>
                <div className="p-8 rounded-[40px] bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{currentEducation.period}</p>
                      <h3 className="text-xl font-bold text-slate-900">{currentEducation.university}</h3>
                    </div>
                  </div>
                  <p className="text-lg text-slate-700 mb-6">{currentEducation.degree}</p>
                  <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100">
                    <Award size={20} className="text-amber-500" />
                    <p className="font-bold text-slate-900">CGPA: {currentEducation.cgpa}</p>
                  </div>
                </div>

                {additionalEducation.length > 0 && (
                  <div className="mt-6 space-y-3 rounded-3xl border border-slate-200 bg-white p-4">
                    <p className="text-sm font-bold text-slate-800">More Education</p>
                    {additionalEducation.map((item, index) => (
                      <div key={item._id ?? `${item.university}-${index}`} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{item.period}</p>
                        <p className="text-base font-bold text-slate-900">{item.university}</p>
                        <p className="text-sm text-slate-700">{item.degree}</p>
                        <p className="mt-1 text-sm font-semibold text-slate-800">CGPA: {item.cgpa}</p>
                      </div>
                    ))}
                  </div>
                )}

                {isAdmin && (
                  <div className="mt-6 space-y-3 rounded-3xl border border-slate-200 bg-white p-4">
                    <p className="text-sm font-bold text-slate-800">Existing education entries</p>
                    {educationData.map((item, index) => (
                      <div key={item._id ?? `${item.university}-${index}`} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                        <div>
                          <p className="text-sm font-bold text-slate-800">{item.university}</p>
                          <p className="text-xs text-slate-500">{item.degree}</p>
                        </div>
                        {renderDeleteButton(() => handleDeleteEducation(item._id), `education-delete-${item._id ?? ''}`)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-12">Technical Skills</h2>
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill, index) => (
                    <div key={`${skill.name}-${index}`} className="px-5 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-blue-200 transition-all">
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

  if (!role) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,#dbeafe,transparent_45%),radial-gradient(circle_at_bottom_left,#e2e8f0,transparent_40%),#f8fafc] px-6 py-10 text-slate-900">
        <div className="mx-auto max-w-4xl rounded-[36px] border border-slate-200 bg-white/90 p-8 shadow-2xl shadow-slate-200/80 md:p-12">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-blue-700">Resume Portal</p>
              <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">Welcome Back</h1>
              <p className="text-slate-600 leading-relaxed">
                Sign in as admin to manage experience, achievements, committee, and education data with direct MongoDB saves,
                or continue as guest for read-only browsing.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-6">
              <h2 className="mb-4 text-lg font-bold text-slate-900">Login</h2>
              <div className="space-y-3">
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
                  placeholder="Email"
                />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
                  placeholder="Password"
                />
                {authError && <p className="text-sm font-medium text-red-600">{authError}</p>}
                <button onClick={handleAdminLogin} className="w-full rounded-xl bg-slate-900 py-2.5 font-bold text-white hover:bg-blue-700">
                  Login
                </button>
              </div>

              <div className="my-5 border-t border-slate-200" />

              <button onClick={handleGuestEntry} className="w-full rounded-xl border border-slate-300 bg-white py-2.5 font-bold text-slate-800 hover:border-blue-300 hover:text-blue-700">
                Continue as Guest
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => {
              setActiveTab('home');
              resetStatus();
            }}
          >
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-xl group-hover:bg-blue-600 transition-colors">
              H
            </div>
            <span className="font-black text-xl tracking-tighter">{homeData.name}</span>
          </div>

          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  resetStatus();
                }}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === item.id ? 'bg-slate-100 text-blue-600' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${isAdmin ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
              {isAdmin ? 'ADMIN' : 'GUEST'}
            </span>
            <button
              onClick={() => {
                setRole(null);
                setLoginEmail('');
                setLoginPassword('');
                setAuthError('');
                setSaveMessage('');
              }}
              className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-blue-200 hover:text-blue-700"
            >
              Logout
            </button>
          </div>

          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

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
                    resetStatus();
                  }}
                  className={`flex items-center gap-3 text-lg font-bold p-3 rounded-2xl ${
                    activeTab === item.id ? 'bg-blue-50 text-blue-600' : 'text-slate-600'
                  }`}
                >
                  <item.icon size={20} />
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => {
                  setRole(null);
                  setLoginEmail('');
                  setLoginPassword('');
                  setAuthError('');
                  setSaveMessage('');
                }}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700"
              >
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="pt-28 pb-20 min-h-[calc(100vh-80px)]">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="bg-slate-50 py-12 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-sm">H</div>
            <span className="font-bold text-slate-900">{homeData.name}</span>
          </div>

          <div className="flex items-center gap-8 text-sm font-bold text-slate-400">
            <button onClick={() => setActiveTab('home')} className="hover:text-blue-600 transition-colors">Home</button>
            <button onClick={() => setActiveTab('experience')} className="hover:text-blue-600 transition-colors">Experience</button>
            <button onClick={() => setActiveTab('achievements')} className="hover:text-blue-600 transition-colors">Achievements</button>
          </div>

          <div className="flex items-center gap-4">
            <a href={homeData.linkedinUrl} target="_blank" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all" rel="noreferrer">
              <Linkedin size={18} />
            </a>
            <a href={`mailto:${homeData.email}`} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all">
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
