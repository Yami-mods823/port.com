export interface VideoDTO {
  id: string;
  title: string;
  description: string;
  category: string;
  aiTools: string[];
  date: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  published: boolean;
  order: number;
}

export interface ProjectDTO {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string | null;
  liveUrl: string | null;
  githubUrl: string | null;
  published: boolean;
  order: number;
}

export interface SkillDTO {
  id: string;
  name: string;
  percentage: number;
  logoUrl: string | null;
  published: boolean;
  order: number;
}

export interface SocialLinkDTO {
  platform: 'GITHUB' | 'LINKEDIN' | 'INSTAGRAM' | 'YOUTUBE' | 'TIKTOK' | 'WHATSAPP';
  url: string | null;
}

export interface SiteSettingsDTO {
  name: string;
  age: number;
  email: string;
  phone: string;
  bio: string;
  heroTagline: string;
  heroDescription: string;
  aboutHeading: string;
  aboutBody: string;
  videosSectionTitle: string;
  projectsSectionTitle: string;
  skillsSectionTitle: string;
  profileImageUrl: string | null;
  logoUrl: string | null;
}
