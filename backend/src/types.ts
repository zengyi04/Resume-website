import { Types } from 'mongoose';

export type MongoId = Types.ObjectId;

export interface Home {
  name: string;
  subtitle: string;
  bio: string;
  linkedinUrl: string;
  email: string;
  internshipAvailability: string;
}

export interface Experience {
  title: string;
  role: string;
  date: string;
  language: string;
  description: string;
}

export interface Committee {
  title: string;
  role: string;
  date: string;
}

export interface Achievement {
  title: string;
  status: string;
  role: string;
  date: string;
  language: string;
  description: string;
}

export interface Education {
  university: string;
  degree: string;
  period: string;
  cgpa: string;
  skills: Array<{ name: string; category: string }>;
}

export interface SeedPayload {
  home: Home;
  experience: Experience[];
  committee: Committee[];
  achievements: Achievement[];
  education: Education[];
}
