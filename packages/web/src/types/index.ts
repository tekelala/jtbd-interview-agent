/**
 * Shared types for the JTBD Interview web interface
 */

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface InterviewConfig {
  productContext?: string;
  intervieweeName?: string;
}

export type InterviewPhase =
  | 'setup'
  | 'warmup'
  | 'decision_deep_dive'
  | 'forces_mapping'
  | 'diet_inquiry'
  | 'synthesis'
  | 'complete';

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

export interface Force {
  description: string;
  intensity: number;
  verbatim?: string;
  capturedAt: Date;
}

export interface ForcesOfProgress {
  push: Force[];
  pull: Force[];
  anxiety: Force[];
  habit: Force[];
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
  dailyRoutine: {
    morning?: string;
    commute?: string;
    workday?: string;
    evening?: string;
    weekend?: string;
  };
  mediaConsumption: {
    podcasts: MediaItem[];
    newsletters: MediaItem[];
    socialMedia: SocialMediaItem[];
    publications: MediaItem[];
    youtubeChannels: MediaItem[];
    influencers: MediaItem[];
  };
  professionalNetworks: ProfessionalNetwork[];
  physicalTouchpoints: PhysicalTouchpoint[];
  trustedSources: TrustedSource[];
  discoveryChannels: string[];
}

export interface MediaItem {
  name: string;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'occasionally';
  notes?: string;
}

export interface SocialMediaItem extends MediaItem {
  platform: string;
}

export interface ProfessionalNetwork {
  name: string;
  type: string;
  frequency?: string;
  notes?: string;
}

export interface PhysicalTouchpoint {
  type: string;
  name?: string;
  frequency?: string;
  context?: string;
}

export interface TrustedSource {
  name: string;
  type: string;
  domain?: string;
  notes?: string;
}

export interface InterviewData {
  interviewee: { name: string; context: string };
  timeline: TimelineEvent[];
  forces: ForcesOfProgress;
  dietProfile: DietProfile;
  insights: Insight[];
  verbatimQuotes: VerbatimQuote[];
  jobStatement?: string;
  status: 'in_progress' | 'paused' | 'complete' | 'abandoned';
}
