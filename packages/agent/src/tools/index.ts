export {
  captureInsightTool,
  createInsight,
  processCaptureInsight,
  type CaptureInsightInput,
  type CaptureInsightResult
} from './capture-insight.js';

export {
  updateTimelineTool,
  createTimelineEvent,
  processUpdateTimeline,
  type UpdateTimelineInput,
  type UpdateTimelineResult
} from './update-timeline.js';

export {
  mapForcesTool,
  createForce,
  processMapForces,
  type ForceType,
  type MapForcesInput,
  type MapForcesResult
} from './map-forces.js';

/**
 * All interview tools for registration with Claude
 */
export const interviewTools = [
  {
    name: 'capture_insight',
    description: 'Record a key observation or verbatim quote from the interviewee',
    input_schema: {
      type: 'object',
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
  },
  {
    name: 'update_timeline',
    description: 'Add or update a point in the decision timeline',
    input_schema: {
      type: 'object',
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
          description: 'The phase of the decision journey'
        },
        date: {
          type: 'string',
          description: 'When this happened (approximate)'
        },
        context: {
          type: 'string',
          description: 'What else was happening in their life'
        },
        details: {
          type: 'string',
          description: 'Specific details about what occurred'
        },
        trigger: {
          type: 'string',
          description: 'For trigger phase: the specific triggering event'
        }
      },
      required: ['phase', 'context', 'details']
    }
  },
  {
    name: 'map_forces',
    description: 'Record a force of progress (push, pull, anxiety, or habit)',
    input_schema: {
      type: 'object',
      properties: {
        forceType: {
          type: 'string',
          enum: ['push', 'pull', 'anxiety', 'habit'],
          description: 'The type of force'
        },
        description: {
          type: 'string',
          description: 'Description of this force'
        },
        intensity: {
          type: 'number',
          minimum: 1,
          maximum: 10,
          description: 'Intensity rating (1-10)'
        },
        verbatim: {
          type: 'string',
          description: 'Optional verbatim quote capturing this force'
        }
      },
      required: ['forceType', 'description', 'intensity']
    }
  }
];
