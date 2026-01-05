/**
 * Core interview data types for JTBD Interview Agent
 */

export interface InterviewConfig {
  productContext?: string;
  intervieweeName?: string;
  sessionId?: string;
}

export interface InterviewData {
  interviewee: IntervieweeInfo;
  timeline: TimelineEvent[];
  forces: ForcesOfProgress;
  dietProfile: DietProfile;
  insights: Insight[];
  verbatimQuotes: VerbatimQuote[];
  jobStatement?: string;
  status: InterviewStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IntervieweeInfo {
  name: string;
  context: string;
  role?: string;
  industry?: string;
}

export type InterviewPhase =
  | 'setup'
  | 'warmup'
  | 'decision_deep_dive'
  | 'forces_mapping'
  | 'diet_inquiry'
  | 'synthesis'
  | 'complete';

export type InterviewStatus = 'in_progress' | 'paused' | 'complete' | 'abandoned';

export interface TimelineEvent {
  phase: TimelinePhase;
  date?: string;
  trigger?: string;
  context: string;
  details: string;
  capturedAt: Date;
}

export type TimelinePhase =
  | 'first_thought'
  | 'trigger'
  | 'passive_looking'
  | 'active_searching'
  | 'decision'
  | 'almost_stopped'
  | 'first_use';

export interface ForcesOfProgress {
  push: Force[];
  pull: Force[];
  anxiety: Force[];
  habit: Force[];
}

export interface Force {
  description: string;
  intensity: number; // 1-10
  verbatim?: string;
  capturedAt: Date;
}

export interface Insight {
  id: string;
  content: string;
  category: InsightCategory;
  isVerbatim: boolean;
  capturedAt: Date;
}

export type InsightCategory =
  | 'struggling_moment'
  | 'push'
  | 'pull'
  | 'anxiety'
  | 'habit'
  | 'diet_media'
  | 'diet_network'
  | 'diet_physical'
  | 'general';

export interface VerbatimQuote {
  quote: string;
  context: string;
  category: InsightCategory;
  capturedAt: Date;
}

export interface DietProfile {
  dailyRoutine: DailyRoutine;
  mediaConsumption: MediaConsumption;
  professionalNetworks: ProfessionalNetwork[];
  physicalTouchpoints: PhysicalTouchpoint[];
  trustedSources: TrustedSource[];
  discoveryChannels: string[];
}

export interface DailyRoutine {
  morning?: string;
  commute?: string;
  workday?: string;
  evening?: string;
  weekend?: string;
}

export interface MediaConsumption {
  podcasts: MediaItem[];
  newsletters: MediaItem[];
  socialMedia: SocialMediaItem[];
  publications: MediaItem[];
  youtubeChannels: MediaItem[];
  influencers: MediaItem[];
}

export interface MediaItem {
  name: string;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'occasionally';
  notes?: string;
}

export interface SocialMediaItem extends MediaItem {
  platform: 'twitter' | 'linkedin' | 'instagram' | 'tiktok' | 'facebook' | 'reddit' | 'other';
}

export interface ProfessionalNetwork {
  name: string;
  type: 'slack' | 'discord' | 'linkedin_group' | 'conference' | 'meetup' | 'association' | 'other';
  frequency?: string;
  notes?: string;
}

export interface PhysicalTouchpoint {
  type: 'coffee_shop' | 'gym' | 'coworking' | 'retail' | 'restaurant' | 'commute' | 'other';
  name?: string;
  frequency?: string;
  context?: string;
}

export interface TrustedSource {
  name: string;
  type: 'person' | 'publication' | 'community' | 'brand' | 'other';
  domain?: string;
  notes?: string;
}

export interface InterviewSummary {
  interviewee: IntervieweeInfo;
  jobStatement: string;
  strugglingMoment: string;
  timeline: TimelineEvent[];
  forces: ForcesOfProgress;
  dietProfile: DietProfile;
  keyInsights: string[];
  topVerbatimQuotes: VerbatimQuote[];
  recommendations: string[];
  generatedAt: Date;
}
