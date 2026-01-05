/**
 * JTBD Interview Agent
 *
 * A Claude-powered interview agent that conducts Jobs to Be Done interviews
 * following Bob Moesta's methodology, including diet/lifestyle inquiry
 * for audience research.
 */

export { JTBDInterviewer, default } from './interviewer.js';
export type { Message, InterviewerConfig } from './interviewer.js';

// Types
export * from './types/index.js';

// Prompts
export {
  createSystemPrompt,
  SYSTEM_PROMPT,
  PHASE_PROMPTS,
  TECHNIQUE_PROMPTS,
  DIET_INQUIRY_PROMPTS,
  DIET_SYNTHESIS_PROMPTS
} from './prompts/index.js';

// Tools
export {
  interviewTools,
  captureInsightTool,
  updateTimelineTool,
  mapForcesTool,
  processCaptureInsight,
  processUpdateTimeline,
  processMapForces
} from './tools/index.js';
