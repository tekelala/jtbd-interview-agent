/**
 * Interview Storage System
 *
 * Persists interview data to local JSON files for later retrieval
 * and analysis in the admin panel.
 */

import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { InterviewData, InterviewSummary } from './types/interview.js';
import type { Message } from './interviewer.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', '..', '..', 'data', 'interviews');

export interface StoredInterview {
  id: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  config: {
    productContext?: string;
    intervieweeName?: string;
    model: string;
  };
  data: InterviewData;
  messages: Message[];
  summary?: InterviewSummary;
}

export interface InterviewListItem {
  id: string;
  createdAt: string;
  completedAt?: string;
  intervieweeName: string;
  productContext?: string;
  status: string;
  jobStatement?: string;
  insightCount: number;
  forceCount: number;
}

/**
 * Ensure the data directory exists
 */
async function ensureDataDir(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // Directory likely exists
  }
}

/**
 * Generate a unique interview ID
 */
export function generateInterviewId(): string {
  const now = new Date();
  const timestamp = now.toISOString()
    .replace(/[-:]/g, '')
    .replace('T', '_')
    .slice(0, 15);
  const random = Math.random().toString(36).substr(2, 6);
  return `interview_${timestamp}_${random}`;
}

/**
 * Save an interview to storage
 */
export async function saveInterview(interview: StoredInterview): Promise<void> {
  await ensureDataDir();
  const filePath = join(DATA_DIR, `${interview.id}.json`);
  await fs.writeFile(filePath, JSON.stringify(interview, null, 2), 'utf-8');
}

/**
 * Load an interview from storage
 */
export async function loadInterview(id: string): Promise<StoredInterview | null> {
  try {
    const filePath = join(DATA_DIR, `${id}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as StoredInterview;
  } catch {
    return null;
  }
}

/**
 * Delete an interview from storage
 */
export async function deleteInterview(id: string): Promise<boolean> {
  try {
    const filePath = join(DATA_DIR, `${id}.json`);
    await fs.unlink(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * List all interviews
 */
export async function listInterviews(): Promise<InterviewListItem[]> {
  await ensureDataDir();

  try {
    const files = await fs.readdir(DATA_DIR);
    const jsonFiles = files.filter(f => f.endsWith('.json'));

    const interviews: InterviewListItem[] = [];

    for (const file of jsonFiles) {
      try {
        const filePath = join(DATA_DIR, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const interview = JSON.parse(content) as StoredInterview;

        const forceCount =
          interview.data.forces.push.length +
          interview.data.forces.pull.length +
          interview.data.forces.anxiety.length +
          interview.data.forces.habit.length;

        interviews.push({
          id: interview.id,
          createdAt: interview.createdAt,
          completedAt: interview.completedAt,
          intervieweeName: interview.config.intervieweeName || 'Anonymous',
          productContext: interview.config.productContext,
          status: interview.data.status,
          jobStatement: interview.summary?.jobStatement,
          insightCount: interview.data.insights.length,
          forceCount
        });
      } catch {
        // Skip invalid files
      }
    }

    // Sort by creation date, newest first
    interviews.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return interviews;
  } catch {
    return [];
  }
}

/**
 * Generate a formatted report for an interview
 */
export function generateReport(interview: StoredInterview): string {
  const { data, summary, config, messages } = interview;

  let report = `# JTBD Interview Report\n\n`;
  report += `**Date:** ${new Date(interview.createdAt).toLocaleDateString()}\n`;
  report += `**Interviewee:** ${config.intervieweeName || 'Anonymous'}\n`;

  if (config.productContext) {
    report += `**Product Context:** ${config.productContext}\n`;
  }

  report += `**Model Used:** ${config.model}\n`;
  report += `**Status:** ${data.status}\n\n`;

  // Job Statement
  report += `## Job Statement\n\n`;
  if (summary?.jobStatement) {
    report += `> ${summary.jobStatement}\n\n`;
  } else if (data.jobStatement) {
    report += `> ${data.jobStatement}\n\n`;
  } else {
    report += `_Not yet synthesized_\n\n`;
  }

  // Struggling Moment
  if (summary?.strugglingMoment) {
    report += `## Struggling Moment\n\n`;
    report += `${summary.strugglingMoment}\n\n`;
  }

  // Timeline
  if (data.timeline.length > 0) {
    report += `## Decision Timeline\n\n`;
    for (const event of data.timeline) {
      report += `### ${formatPhase(event.phase)}`;
      if (event.date) report += ` (${event.date})`;
      report += `\n\n`;
      report += `${event.details}\n`;
      if (event.context) report += `\n_Context: ${event.context}_\n`;
      report += `\n`;
    }
  }

  // Forces of Progress
  report += `## Forces of Progress\n\n`;

  if (data.forces.push.length > 0) {
    report += `### Push (Away from current situation)\n\n`;
    for (const f of data.forces.push) {
      report += `- ${f.description} (intensity: ${f.intensity}/10)\n`;
      if (f.verbatim) report += `  > "${f.verbatim}"\n`;
    }
    report += `\n`;
  }

  if (data.forces.pull.length > 0) {
    report += `### Pull (Toward new solution)\n\n`;
    for (const f of data.forces.pull) {
      report += `- ${f.description} (intensity: ${f.intensity}/10)\n`;
      if (f.verbatim) report += `  > "${f.verbatim}"\n`;
    }
    report += `\n`;
  }

  if (data.forces.anxiety.length > 0) {
    report += `### Anxiety (Barriers to change)\n\n`;
    for (const f of data.forces.anxiety) {
      report += `- ${f.description} (intensity: ${f.intensity}/10)\n`;
      if (f.verbatim) report += `  > "${f.verbatim}"\n`;
    }
    report += `\n`;
  }

  if (data.forces.habit.length > 0) {
    report += `### Habit (Comfort with status quo)\n\n`;
    for (const f of data.forces.habit) {
      report += `- ${f.description} (intensity: ${f.intensity}/10)\n`;
      if (f.verbatim) report += `  > "${f.verbatim}"\n`;
    }
    report += `\n`;
  }

  // Diet Profile
  const diet = data.dietProfile;
  const hasDiet =
    diet.mediaConsumption.podcasts.length > 0 ||
    diet.mediaConsumption.newsletters.length > 0 ||
    diet.professionalNetworks.length > 0 ||
    diet.physicalTouchpoints.length > 0;

  if (hasDiet) {
    report += `## Information Diet\n\n`;

    if (diet.mediaConsumption.podcasts.length > 0) {
      report += `**Podcasts:** ${diet.mediaConsumption.podcasts.map(p => p.name).join(', ')}\n\n`;
    }

    if (diet.mediaConsumption.newsletters.length > 0) {
      report += `**Newsletters:** ${diet.mediaConsumption.newsletters.map(n => n.name).join(', ')}\n\n`;
    }

    if (diet.professionalNetworks.length > 0) {
      report += `**Professional Networks:** ${diet.professionalNetworks.map(n => `${n.name} (${n.type})`).join(', ')}\n\n`;
    }

    if (diet.physicalTouchpoints.length > 0) {
      report += `**Physical Touchpoints:** ${diet.physicalTouchpoints.map(t => t.name || t.type).join(', ')}\n\n`;
    }

    if (diet.trustedSources.length > 0) {
      report += `**Trusted Sources:** ${diet.trustedSources.map(s => s.name).join(', ')}\n\n`;
    }
  }

  // Key Quotes
  if (data.verbatimQuotes.length > 0) {
    report += `## Key Quotes\n\n`;
    for (const q of data.verbatimQuotes.slice(0, 10)) {
      report += `> "${q.quote}"\n\n`;
    }
  }

  // Key Insights
  if (data.insights.length > 0) {
    report += `## Key Insights\n\n`;
    const grouped = groupInsightsByCategory(data.insights);
    for (const [category, insights] of Object.entries(grouped)) {
      report += `**${formatCategory(category)}:**\n`;
      for (const insight of insights.slice(0, 5)) {
        report += `- ${insight.content}\n`;
      }
      report += `\n`;
    }
  }

  // Conversation (abbreviated)
  report += `## Conversation Summary\n\n`;
  report += `_${messages.length} messages exchanged_\n\n`;

  // Show first few and last few messages
  const preview = messages.slice(0, 4);
  for (const msg of preview) {
    const role = msg.role === 'user' ? 'Interviewee' : 'Interviewer';
    const content = msg.content.length > 200
      ? msg.content.slice(0, 200) + '...'
      : msg.content;
    report += `**${role}:** ${content}\n\n`;
  }

  if (messages.length > 4) {
    report += `_... ${messages.length - 4} more messages ..._\n\n`;
  }

  return report;
}

function formatPhase(phase: string): string {
  const labels: Record<string, string> = {
    first_thought: 'First Thought',
    trigger: 'Trigger Event',
    passive_looking: 'Passive Looking',
    active_searching: 'Active Searching',
    decision: 'Decision',
    almost_stopped: 'Almost Stopped',
    first_use: 'First Use'
  };
  return labels[phase] || phase;
}

function formatCategory(category: string): string {
  const labels: Record<string, string> = {
    struggling_moment: 'Struggling Moment',
    push: 'Push Factors',
    pull: 'Pull Factors',
    anxiety: 'Anxiety Factors',
    habit: 'Habit Factors',
    diet_media: 'Media Diet',
    diet_network: 'Professional Networks',
    diet_physical: 'Physical Touchpoints',
    general: 'General Insights'
  };
  return labels[category] || category;
}

function groupInsightsByCategory(insights: StoredInterview['data']['insights']): Record<string, typeof insights> {
  const grouped: Record<string, typeof insights> = {};
  for (const insight of insights) {
    if (!grouped[insight.category]) {
      grouped[insight.category] = [];
    }
    grouped[insight.category].push(insight);
  }
  return grouped;
}

export default {
  generateInterviewId,
  saveInterview,
  loadInterview,
  deleteInterview,
  listInterviews,
  generateReport
};
