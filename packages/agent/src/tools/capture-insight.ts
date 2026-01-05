/**
 * Capture Insight Tool
 *
 * Records key observations or verbatim quotes from the interviewee
 * with categorization for later analysis.
 */

import type { InsightCategory, Insight } from '../types/interview.js';

export interface CaptureInsightInput {
  insight: string;
  category: InsightCategory;
  isVerbatim: boolean;
}

export interface CaptureInsightResult {
  success: boolean;
  insightId: string;
  message: string;
}

/**
 * Tool definition for capturing insights during an interview
 */
export const captureInsightTool = {
  name: 'capture_insight',
  description: `Record a key observation or verbatim quote from the interviewee.

Use this tool whenever you hear something important:
- A struggling moment that triggered their search
- A force (push, pull, anxiety, habit)
- Media consumption or network information
- A particularly quotable statement

Categories:
- struggling_moment: The core problem that pushed them to seek a solution
- push: What was pushing them away from their current situation
- pull: What attracted them to the new solution
- anxiety: Concerns or fears about making the change
- habit: What kept them comfortable with the old way
- diet_media: Information about media consumption (podcasts, newsletters, etc.)
- diet_network: Professional networks, communities, conferences
- diet_physical: Physical touchpoints, locations, routines
- general: Other important observations`,

  inputSchema: {
    type: 'object' as const,
    properties: {
      insight: {
        type: 'string',
        description: 'The insight content or verbatim quote to capture'
      },
      category: {
        type: 'string',
        enum: [
          'struggling_moment',
          'push',
          'pull',
          'anxiety',
          'habit',
          'diet_media',
          'diet_network',
          'diet_physical',
          'general'
        ],
        description: 'The category this insight belongs to'
      },
      isVerbatim: {
        type: 'boolean',
        description: 'True if this is an exact quote from the interviewee'
      }
    },
    required: ['insight', 'category', 'isVerbatim']
  }
};

/**
 * Create an insight object from tool input
 */
export function createInsight(input: CaptureInsightInput): Insight {
  return {
    id: `insight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    content: input.insight,
    category: input.category,
    isVerbatim: input.isVerbatim,
    capturedAt: new Date()
  };
}

/**
 * Process the capture_insight tool call
 */
export function processCaptureInsight(input: CaptureInsightInput): CaptureInsightResult {
  const insight = createInsight(input);

  return {
    success: true,
    insightId: insight.id,
    message: `Captured ${input.isVerbatim ? 'verbatim quote' : 'insight'} in category: ${input.category}`
  };
}
