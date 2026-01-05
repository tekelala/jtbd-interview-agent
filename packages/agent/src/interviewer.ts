/**
 * JTBD Interviewer
 *
 * Main class that conducts Jobs to Be Done interviews using
 * the Claude Agent SDK with Bob Moesta Skills.
 */

import { query } from '@anthropic-ai/claude-agent-sdk';
import path from 'path';
import { fileURLToPath } from 'url';
import type {
  InterviewConfig,
  InterviewData,
  InterviewPhase,
  InterviewSummary,
  Insight,
  TimelineEvent,
  Force,
  DietProfile,
  ForcesOfProgress
} from './types/interview.js';

// Get project root (where .claude/skills/ is located)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../../..');  // packages/agent/src -> project root

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface InterviewerConfig {
  apiKey?: string;
  model?: ClaudeModel;
}

// Available Claude models
export type ClaudeModel =
  | 'claude-sonnet-4-20250514'
  | 'claude-opus-4-20250514'
  | 'claude-3-5-haiku-20241022';

export const CLAUDE_MODELS: { id: ClaudeModel; name: string; description: string }[] = [
  {
    id: 'claude-sonnet-4-20250514',
    name: 'Claude Sonnet 4',
    description: 'Balanced performance and speed (Recommended)'
  },
  {
    id: 'claude-opus-4-20250514',
    name: 'Claude Opus 4',
    description: 'Highest quality, deeper understanding'
  },
  {
    id: 'claude-3-5-haiku-20241022',
    name: 'Claude Haiku 3.5',
    description: 'Fastest, most economical'
  }
];

export class JTBDInterviewer {
  private model: string;
  private conversationHistory: Message[] = [];
  private interviewData: InterviewData;
  private currentPhase: InterviewPhase = 'setup';
  private productContext?: string;
  private sessionId?: string;

  constructor(config: InterviewerConfig = {}) {
    this.model = config.model || 'claude-sonnet-4-20250514';
    this.interviewData = this.createEmptyInterviewData();
  }

  private createEmptyInterviewData(): InterviewData {
    return {
      interviewee: { name: '', context: '' },
      timeline: [],
      forces: { push: [], pull: [], anxiety: [], habit: [] },
      dietProfile: {
        dailyRoutine: {},
        mediaConsumption: {
          podcasts: [],
          newsletters: [],
          socialMedia: [],
          publications: [],
          youtubeChannels: [],
          influencers: []
        },
        professionalNetworks: [],
        physicalTouchpoints: [],
        trustedSources: [],
        discoveryChannels: []
      },
      insights: [],
      verbatimQuotes: [],
      status: 'in_progress',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Start a new interview session
   */
  async startInterview(config: InterviewConfig): Promise<string> {
    this.conversationHistory = [];
    this.interviewData = this.createEmptyInterviewData();
    this.currentPhase = 'warmup';
    this.productContext = config.productContext;

    if (config.intervieweeName) {
      this.interviewData.interviewee.name = config.intervieweeName;
    }

    // Generate opening message using the SDK with Skills
    const openingPrompt = this.buildOpeningPrompt(config);
    const response = await this.queryWithSkills(openingPrompt);

    return response;
  }

  /**
   * Send a message and get a response using Claude Agent SDK with Skills
   */
  async sendMessage(userMessage: string): Promise<string> {
    // Add user message to history
    this.conversationHistory.push({
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    });

    // Build the full prompt with context
    const prompt = this.buildConversationPrompt(userMessage);

    // Query using the SDK with Skills
    const response = await this.queryWithSkills(prompt);

    // Add assistant response to history
    this.conversationHistory.push({
      role: 'assistant',
      content: response,
      timestamp: new Date()
    });

    // Extract structured data from the conversation
    this.extractInsights(userMessage, response);

    this.interviewData.updatedAt = new Date();

    return response;
  }

  /**
   * Query Claude using the Agent SDK with Skills enabled
   */
  private async queryWithSkills(prompt: string): Promise<string> {
    let response = '';

    try {
      for await (const message of query({
        prompt,
        options: {
          model: this.model,
          cwd: PROJECT_ROOT,  // Project root where .claude/skills/ is located
          settingSources: ['user', 'project'],  // Load Skills from both locations
          allowedTools: ['Skill', 'Read'],  // Enable Skill tool
          systemPrompt: this.buildSystemPrompt(),
          permissionMode: 'bypassPermissions'  // For non-interactive use
        }
      })) {
        // Handle different message types
        if (message.type === 'assistant') {
          // Extract text content from assistant message
          const content = message.message.content;
          if (Array.isArray(content)) {
            for (const block of content) {
              if (block.type === 'text') {
                response += block.text;
              }
            }
          }
        } else if (message.type === 'result') {
          // Store session ID for resume capability
          this.sessionId = message.session_id;

          // If result has content, use it
          if (message.subtype === 'success' && message.result) {
            if (!response) {
              response = message.result;
            }
          }
        }
      }
    } catch (error) {
      console.error('SDK query error:', error);
      throw error;
    }

    return response || 'I apologize, but I was unable to generate a response. Could you please try again?';
  }

  /**
   * Build the system prompt for JTBD interviews
   */
  private buildSystemPrompt(): string {
    let prompt = `You are conducting a Jobs to Be Done interview following Bob Moesta's methodology.

CRITICAL BEHAVIOR RULES:
- BE CONCISE: Your responses should be 1-3 sentences MAX. No long explanations.
- ONE QUESTION: Ask only ONE question per response. Never multiple questions.
- NO ROLEPLAY: Never use asterisks for actions like *pauses* or *leans in*. Just speak naturally.
- TALK LESS: The interviewee should talk 80%+ of the time. You ask short questions, they give long answers.
- NO LECTURING: Don't explain JTBD methodology to them. Just conduct the interview.
- FOLLOW THEIR LEAD: Your next question comes from what they just said.

INTERVIEW GOALS:
1. Uncover the STRUGGLING MOMENT that caused them to seek a solution
2. Map the FORCES OF PROGRESS (push, pull, anxiety, habit)
3. Understand their INFORMATION DIET (how to reach similar people)

QUESTIONING STYLE:
- Ask "what happened" not "why"
- Get specific: "Was that a Monday or Tuesday?" "Morning or evening?"
- Build the timeline backward from purchase
- Use contrast: "How was it different from before?"
- Unpack vague words: "When you say 'frustrated', what do you mean?"

EXAMPLE GOOD RESPONSES:
- "Interesting. So what happened next?"
- "When you say she was struggling, what did that actually look like?"
- "Take me back to that moment. What time of day was it?"
- "And before that evening, had you thought about getting help for her focus?"`;

    if (this.productContext) {
      prompt += `\n\nProduct Context: The interview relates to ${this.productContext}`;
    }

    return prompt;
  }

  /**
   * Build the opening prompt for starting an interview
   */
  private buildOpeningPrompt(config: InterviewConfig): string {
    let prompt = `Start with a brief, warm greeting (2-3 sentences max).
Introduce yourself casually, thank them for their time, and ask ONE simple opening question to get them talking.
Don't explain the methodology or what you're looking for - just start the conversation naturally.`;

    if (config.intervieweeName) {
      prompt += ` The interviewee's name is ${config.intervieweeName}.`;
    }

    if (config.productContext) {
      prompt += ` Ask about their experience with ${config.productContext}.`;
    }

    return prompt;
  }

  /**
   * Build conversation prompt with history context
   */
  private buildConversationPrompt(userMessage: string): string {
    // Build context from conversation history
    const context = this.conversationHistory
      .slice(-10) // Last 10 messages for context
      .map(msg => `${msg.role === 'user' ? 'Interviewee' : 'Interviewer'}: ${msg.content}`)
      .join('\n\n');

    return `Previous conversation:
${context}

The interviewee just said: "${userMessage}"

Continue the JTBD interview following Bob Moesta's methodology.
- Dig deeper into their response
- Look for struggling moments, forces of progress, or diet/lifestyle information
- Ask follow-up questions that come from what they just said
- Remember: the best question comes from the last answer`;
  }

  /**
   * Extract insights from the conversation
   */
  private extractInsights(userMessage: string, _response: string): void {
    const input = userMessage.toLowerCase();

    // Detect struggling moment keywords
    if (input.includes('frustrated') || input.includes('problem') ||
        input.includes('struggle') || input.includes('wasn\'t working') ||
        input.includes('fed up') || input.includes('couldn\'t')) {
      const insight: Insight = {
        id: `insight_${Date.now()}`,
        content: userMessage,
        category: 'struggling_moment',
        isVerbatim: true,
        capturedAt: new Date()
      };
      this.interviewData.insights.push(insight);
      this.interviewData.verbatimQuotes.push({
        quote: userMessage,
        context: 'struggling moment',
        category: 'struggling_moment',
        capturedAt: new Date()
      });
    }

    // Detect push forces
    if (input.includes('annoyed') || input.includes('tired of') ||
        input.includes('couldn\'t stand') || input.includes('hate')) {
      const force: Force = {
        description: userMessage,
        intensity: 7,
        verbatim: userMessage,
        capturedAt: new Date()
      };
      this.interviewData.forces.push.push(force);
    }

    // Detect pull forces
    if (input.includes('attracted') || input.includes('wanted') ||
        input.includes('excited about') || input.includes('loved the idea')) {
      const force: Force = {
        description: userMessage,
        intensity: 7,
        verbatim: userMessage,
        capturedAt: new Date()
      };
      this.interviewData.forces.pull.push(force);
    }

    // Detect anxiety
    if (input.includes('worried') || input.includes('afraid') ||
        input.includes('hesitated') || input.includes('almost didn\'t')) {
      const force: Force = {
        description: userMessage,
        intensity: 6,
        verbatim: userMessage,
        capturedAt: new Date()
      };
      this.interviewData.forces.anxiety.push(force);
    }

    // Detect diet/media consumption
    if (input.includes('podcast') || input.includes('newsletter') ||
        input.includes('read') || input.includes('listen')) {
      const insight: Insight = {
        id: `insight_${Date.now()}`,
        content: userMessage,
        category: 'diet_media',
        isVerbatim: false,
        capturedAt: new Date()
      };
      this.interviewData.insights.push(insight);
    }

    // Detect professional networks
    if (input.includes('community') || input.includes('slack') ||
        input.includes('group') || input.includes('conference')) {
      const insight: Insight = {
        id: `insight_${Date.now()}`,
        content: userMessage,
        category: 'diet_network',
        isVerbatim: false,
        capturedAt: new Date()
      };
      this.interviewData.insights.push(insight);
    }
  }

  /**
   * Get current interview data
   */
  getInterviewData(): InterviewData {
    return { ...this.interviewData };
  }

  /**
   * Get current phase
   */
  getCurrentPhase(): InterviewPhase {
    return this.currentPhase;
  }

  /**
   * Set current phase
   */
  setPhase(phase: InterviewPhase): void {
    this.currentPhase = phase;
  }

  /**
   * Get the model being used
   */
  getModel(): string {
    return this.model;
  }

  /**
   * End the interview and generate summary
   */
  async endInterview(): Promise<InterviewSummary> {
    this.interviewData.status = 'complete';

    // Ask Claude to generate a job statement based on the interview
    const summaryPrompt = `Based on the interview conversation, please:
1. Generate a Job Statement in the format: "When I [situation], I want to [motivation], so I can [outcome]"
2. Summarize the key struggling moment
3. List the top 3-5 most important insights
4. Provide recommendations for reaching similar customers

Format your response as a summary for the interview report.`;

    const summaryResponse = await this.queryWithSkills(summaryPrompt);

    // Sort timeline by typical phase order
    const phaseOrder = [
      'first_thought',
      'trigger',
      'passive_looking',
      'active_searching',
      'decision',
      'almost_stopped',
      'first_use'
    ];

    const sortedTimeline = [...this.interviewData.timeline].sort(
      (a, b) => phaseOrder.indexOf(a.phase) - phaseOrder.indexOf(b.phase)
    );

    return {
      interviewee: this.interviewData.interviewee,
      jobStatement: this.interviewData.jobStatement || extractJobStatement(summaryResponse),
      strugglingMoment: extractStrugglingMoment(this.interviewData.insights),
      timeline: sortedTimeline,
      forces: this.interviewData.forces,
      dietProfile: this.interviewData.dietProfile,
      keyInsights: this.interviewData.insights
        .filter(i => i.category !== 'general')
        .map(i => i.content)
        .slice(0, 10),
      topVerbatimQuotes: this.interviewData.verbatimQuotes.slice(0, 5),
      recommendations: extractRecommendations(summaryResponse),
      generatedAt: new Date()
    };
  }

  /**
   * Export interview to JSON
   */
  exportToJSON(): string {
    return JSON.stringify(this.interviewData, null, 2);
  }

  /**
   * Get conversation history for display
   */
  getConversationHistory(): Message[] {
    return [...this.conversationHistory];
  }
}

// Helper functions for extracting structured data from responses

function extractJobStatement(response: string): string {
  // Look for "When I..." pattern
  const match = response.match(/When I[^.]+\./i);
  return match ? match[0] : 'Job statement pending synthesis';
}

function extractStrugglingMoment(insights: Insight[]): string {
  const strugglingInsights = insights.filter(i => i.category === 'struggling_moment');
  return strugglingInsights.length > 0
    ? strugglingInsights[0].content
    : 'Struggling moment pending identification';
}

function extractRecommendations(response: string): string[] {
  // Basic extraction - look for numbered items or bullet points
  const lines = response.split('\n');
  const recommendations: string[] = [];

  for (const line of lines) {
    if (line.match(/^[\d\-\*•]/)) {
      const cleaned = line.replace(/^[\d\.\-\*•\s]+/, '').trim();
      if (cleaned.length > 10) {
        recommendations.push(cleaned);
      }
    }
  }

  return recommendations.slice(0, 5);
}

export default JTBDInterviewer;
