/**
 * Seed script — populates MongoDB with all real portfolio data.
 * Run:  npm run seed
 *
 * It is idempotent: existing collections are cleared and re-created.
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

import mongoose from 'mongoose';
import Home from './models/Home.js';
import Experience from './models/Experience.js';
import Committee from './models/Committee.js';
import Achievement from './models/Achievement.js';
import Education from './models/Education.js';

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('<db_password>')) {
    console.error('❌ Please replace <db_password> in backend/.env with your real MongoDB password.');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('✅ Connected');

  // ── HOME ──────────────────────────────────────────────────────────────────
  await Home.deleteMany({});
  await Home.create({
    name: 'Ham Zeng Yi',
    tagline: 'SOFTWARE ENGINEERING UNDERGRADUATE',
    description:
      'Year 2 student at University Malaya. Specialized in full-stack development, ' +
      'AI integration, and building scalable digital solutions.',
    availability: 'Internship: Sept 2026 - May 2027',
    email: 'yyjane42@gmail.com',
    linkedin: 'https://www.linkedin.com/in/ham-zeng-yi-432713353/',
    skills: [
      { name: 'Python', category: 'Language' },
      { name: 'Java', category: 'Language' },
      { name: 'TypeScript', category: 'Language' },
      { name: 'JavaScript', category: 'Language' },
      { name: 'SQL', category: 'Database' },
      { name: 'Node.js', category: 'Backend' },
      { name: 'React.js', category: 'Frontend' },
      { name: 'Flutter', category: 'Mobile' },
      { name: 'XML', category: 'Data' },
    ],
  });
  console.log('✅ Home seeded');

  // ── EXPERIENCES ───────────────────────────────────────────────────────────
  await Experience.deleteMany({});
  await Experience.insertMany([
    {
      title: 'Code Fest Um',
      role: 'Frontend Developer',
      date: 'NOVEMBER 2025',
      language: 'TypeScript',
      description:
        'Developed an AI-powered predictive analytics platform to support enterprise operations and trading decisions.',
      order: 1,
    },
    {
      title: 'Devmatch',
      role: 'Frontend & Backend Developer',
      date: 'JUNE 2025',
      language: 'React.js',
      description:
        'Developed a blockchain-based digital ID system for the university, enabling secure and verifiable student identities that can be used across multiple campus services and applications.',
      order: 2,
    },
    {
      title: 'Kitahack 2025',
      role: 'Documentalist',
      date: 'AUGUST 2025',
      language: 'Firebase',
      description:
        'Developed an AI-powered chatbot to support students with learning and academic questions. Implemented interactive conversational features to provide quick, personalized educational assistance.',
      order: 3,
    },
    {
      title: 'Data Science Digital Race',
      role: 'Machine Learning Developer',
      date: 'MAY 2025',
      language: 'Python',
      description:
        'Trained and optimized a machine learning model (Prophet, ARIMA, ETS, XGBoost) to detect undiagnosed dyslexia early by analyzing student learning behaviors.',
      order: 4,
    },
    {
      title: 'Code Nection',
      role: 'Backend Developer',
      date: 'SEPTEMBER 2025',
      language: 'TypeScript & JavaScript',
      description:
        'Developed a digital campus management platform to enhance university operations and student services. Implemented efficient workflows and data-driven features to optimize resource management and decision-making.',
      order: 5,
    },
  ]);
  console.log('✅ Experiences seeded (5)');

  // ── COMMITTEES ────────────────────────────────────────────────────────────
  await Committee.deleteMany({});
  await Committee.insertMany([
    { title: "Deans Cup 2026", role: 'Program and Protocol', date: '2026' },
    { title: 'Technothon 2026', role: 'Program and Protocol', date: '2026' },
    { title: 'PLN 2025',       role: 'Program and Protocol', date: '2025' },
    { title: 'Technothon 2025', role: 'Logistic',            date: '2025' },
  ]);
  console.log('✅ Committees seeded (4)');

  // ── ACHIEVEMENTS ──────────────────────────────────────────────────────────
  await Achievement.deleteMany({});
  await Achievement.insertMany([
    {
      title: 'Code Nection',
      status: 'Final Round Finalist',
      role: 'Backend Developer',
      date: 'SEPTEMBER 2025',
      language: 'TypeScript & JavaScript',
      description:
        'Developed a digital campus management platform to enhance university operations and student services. Implemented efficient workflows and data-driven features to optimize resource management and decision-making.',
    },
  ]);
  console.log('✅ Achievements seeded (1)');

  // ── EDUCATION ─────────────────────────────────────────────────────────────
  await Education.deleteMany({});
  await Education.insertMany([
    {
      institution: 'University Malaya',
      degree: 'Bachelor Of Software Engineering',
      period: '2024 - Present',
      cgpa: '3.58 / 4.00',
    },
  ]);
  console.log('✅ Education seeded (1)');

  // ── MOCK DATA IN SEPARATE COLLECTIONS ─────────────────────────────────────
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('MongoDB database connection is not available');
  }

  await db.collection('home_mock').deleteMany({});
  await db.collection('home_mock').insertOne({
    name: 'Mock User',
    tagline: 'MOCK SOFTWARE ENGINEERING STUDENT',
    description: 'Mock home profile data for testing and development.',
    availability: 'Mock Availability Window',
    email: 'mock@example.com',
    linkedin: 'https://linkedin.com/in/mock-user',
    skills: [
      { name: 'MockScript', category: 'Language' },
      { name: 'MockDB', category: 'Database' },
    ],
  });

  await db.collection('experience_mock').deleteMany({});
  await db.collection('experience_mock').insertMany([
    {
      title: 'Mock Hackathon',
      role: 'Mock Developer',
      date: 'JANUARY 2026',
      language: 'TypeScript',
      description: 'Mock experience entry for UI/API tests.',
    },
  ]);

  await db.collection('committee_mock').deleteMany({});
  await db.collection('committee_mock').insertMany([
    { title: 'Mock Committee 2026', role: 'Mock Role', date: '2026' },
  ]);

  await db.collection('achievements_mock').deleteMany({});
  await db.collection('achievements_mock').insertMany([
    {
      title: 'Mock Achievement',
      status: 'Participant',
      role: 'Mock Contributor',
      date: '2026',
      language: 'Mock Stack',
      description: 'Mock achievement data for testing.',
    },
  ]);

  await db.collection('education_mock').deleteMany({});
  await db.collection('education_mock').insertMany([
    {
      institution: 'Mock University',
      degree: 'Mock Bachelor Program',
      period: '2020 - 2024',
      cgpa: '4.00 / 4.00',
    },
  ]);
  console.log('✅ Separate mock collections seeded');

  await mongoose.disconnect();
  console.log('\n🎉 All data has been saved to MongoDB successfully!');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
