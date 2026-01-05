/**
 * Map Forces Tool
 *
 * Records forces of progress (push, pull, anxiety, habit)
 * with intensity ratings as they're discovered.
 */

import type { Force } from '../types/interview.js';

export type ForceType = 'push' | 'pull' | 'anxiety' | 'habit';

export interface MapForcesInput {
  forceType: ForceType;
  description: string;
  intensity: number;
  verbatim?: string;
}

export interface MapForcesResult {
  success: boolean;
  forceId: string;
  message: string;
}

/**
 * Tool definition for mapping forces of progress
 */
export const mapForcesTool = {
  name: 'map_forces',
  description: `Record a force of progress that influenced the interviewee's decision.

The Forces of Progress model identifies four forces that determine whether someone makes a change:

FORCES PUSHING TOWARD CHANGE:
- PUSH: What pushed them away from their current situation
  - Frustrations, pain points, things that weren't working
  - "I couldn't stand that..." "It was driving me crazy..."
  - Higher intensity = stronger motivation to change

- PULL: What attracted them to the new solution
  - Promises, benefits, imagined future state
  - "I imagined being able to..." "What got me excited was..."
  - Higher intensity = stronger attraction

FORCES HOLDING BACK:
- ANXIETY: What concerns almost stopped them
  - Fear of the unknown, risk, uncertainty
  - "What if it doesn't work?" "I was worried about..."
  - Higher intensity = bigger barrier to overcome

- HABIT: What kept them comfortable with the status quo
  - Familiarity, comfort, "good enough"
  - "At least I knew how to..." "It was working fine..."
  - Higher intensity = stronger resistance to change

Key insight: Push + Pull must be greater than Anxiety + Habit for change to occur.

Rate intensity from 1-10:
- 1-3: Minor factor, mentioned in passing
- 4-6: Moderate factor, clearly important
- 7-10: Major factor, defining element of the decision`,

  inputSchema: {
    type: 'object' as const,
    properties: {
      forceType: {
        type: 'string',
        enum: ['push', 'pull', 'anxiety', 'habit'],
        description: 'The type of force being recorded'
      },
      description: {
        type: 'string',
        description: 'Description of this specific force'
      },
      intensity: {
        type: 'number',
        minimum: 1,
        maximum: 10,
        description: 'Intensity rating from 1 (minor) to 10 (major factor)'
      },
      verbatim: {
        type: 'string',
        description: 'Optional verbatim quote that captures this force'
      }
    },
    required: ['forceType', 'description', 'intensity']
  }
};

/**
 * Create a force object from tool input
 */
export function createForce(input: MapForcesInput): Force {
  return {
    description: input.description,
    intensity: input.intensity,
    verbatim: input.verbatim,
    capturedAt: new Date()
  };
}

/**
 * Process the map_forces tool call
 */
export function processMapForces(input: MapForcesInput): MapForcesResult {
  const force = createForce(input);

  const forceLabels: Record<ForceType, string> = {
    push: 'Push (away from status quo)',
    pull: 'Pull (toward new solution)',
    anxiety: 'Anxiety (barrier to change)',
    habit: 'Habit (comfort with current)'
  };

  const intensityLabel =
    input.intensity >= 7 ? 'strong' :
    input.intensity >= 4 ? 'moderate' : 'minor';

  return {
    success: true,
    forceId: `force_${input.forceType}_${Date.now()}`,
    message: `Mapped ${intensityLabel} ${forceLabels[input.forceType]} (intensity: ${input.intensity}/10)`
  };
}
