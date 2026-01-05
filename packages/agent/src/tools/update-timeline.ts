/**
 * Update Timeline Tool
 *
 * Adds or updates points in the decision timeline as they're
 * discovered during the interview.
 */

import type { TimelinePhase, TimelineEvent } from '../types/interview.js';

export interface UpdateTimelineInput {
  phase: TimelinePhase;
  date?: string;
  context: string;
  details: string;
  trigger?: string;
}

export interface UpdateTimelineResult {
  success: boolean;
  eventId: string;
  message: string;
}

/**
 * Tool definition for updating the decision timeline
 */
export const updateTimelineTool = {
  name: 'update_timeline',
  description: `Add or update a point in the interviewee's decision timeline.

Use this tool as you uncover the journey from first thought to purchase/decision:

Timeline phases (in typical order):
- first_thought: When they first thought about making a change
- trigger: The specific event that made them take action
- passive_looking: When they started noticing alternatives
- active_searching: When they began actively researching
- decision: The moment they decided to go with the solution
- almost_stopped: Moments they almost didn't proceed
- first_use: Their initial experience with the solution

Include as much context as possible:
- Approximate dates or timeframes
- What else was happening in their life
- Specific details about the moment
- Who was involved`,

  inputSchema: {
    type: 'object' as const,
    properties: {
      phase: {
        type: 'string',
        enum: [
          'first_thought',
          'trigger',
          'passive_looking',
          'active_searching',
          'decision',
          'almost_stopped',
          'first_use'
        ],
        description: 'The phase of the decision journey this event represents'
      },
      date: {
        type: 'string',
        description: 'When this happened (can be approximate, e.g., "about 6 months ago", "last September")'
      },
      context: {
        type: 'string',
        description: 'What else was happening in their life at this time'
      },
      details: {
        type: 'string',
        description: 'Specific details about what occurred during this phase'
      },
      trigger: {
        type: 'string',
        description: 'For trigger phase: the specific event or moment that caused action'
      }
    },
    required: ['phase', 'context', 'details']
  }
};

/**
 * Create a timeline event from tool input
 */
export function createTimelineEvent(input: UpdateTimelineInput): TimelineEvent {
  return {
    phase: input.phase,
    date: input.date,
    trigger: input.trigger,
    context: input.context,
    details: input.details,
    capturedAt: new Date()
  };
}

/**
 * Process the update_timeline tool call
 */
export function processUpdateTimeline(input: UpdateTimelineInput): UpdateTimelineResult {
  const event = createTimelineEvent(input);

  const phaseDescriptions: Record<TimelinePhase, string> = {
    first_thought: 'First thought about change',
    trigger: 'Triggering event',
    passive_looking: 'Passive awareness',
    active_searching: 'Active research',
    decision: 'Decision moment',
    almost_stopped: 'Hesitation point',
    first_use: 'First experience'
  };

  return {
    success: true,
    eventId: `timeline_${input.phase}_${Date.now()}`,
    message: `Timeline updated: ${phaseDescriptions[input.phase]}${input.date ? ` (${input.date})` : ''}`
  };
}
