/**
 * JTBD Interviewer
 *
 * Main class that conducts Jobs to Be Done interviews using
 * the Anthropic SDK with Bob Moesta's methodology embedded.
 */

import Anthropic from '@anthropic-ai/sdk';
import type {
  InterviewConfig,
  InterviewData,
  InterviewPhase,
  InterviewSummary,
  Insight,
  Force
} from './types/interview.js';

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
  private client: Anthropic;
  private model: string;
  private conversationHistory: Message[] = [];
  private interviewData: InterviewData;
  private currentPhase: InterviewPhase = 'setup';
  private productContext?: string;

  constructor(config: InterviewerConfig = {}) {
    this.client = new Anthropic(); // Uses ANTHROPIC_API_KEY env var
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
   * Query Claude using the direct Anthropic SDK
   */
  private async queryWithSkills(prompt: string): Promise<string> {
    try {
      // Build message history for context
      const messages = this.buildMessageHistory(prompt);

      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 1024,
        system: this.buildSystemPrompt(),
        messages
      });

      // Extract text from response
      const textContent = response.content.find(block => block.type === 'text');
      if (textContent && textContent.type === 'text') {
        return textContent.text;
      }

      return 'I apologize, but I was unable to generate a response. Could you please try again?';
    } catch (error) {
      console.error('Anthropic API error:', error);
      throw error;
    }
  }

  /**
   * Build message history for the API call
   */
  private buildMessageHistory(currentPrompt: string): Array<{ role: 'user' | 'assistant'; content: string }> {
    // Convert conversation history to API format
    const messages: Array<{ role: 'user' | 'assistant'; content: string }> = this.conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Add current prompt as user message
    messages.push({ role: 'user', content: currentPrompt });

    return messages;
  }

  /**
   * Build the system prompt for JTBD interviews - Bob Moesta methodology embedded
   */
  private buildSystemPrompt(): string {
    let prompt = `You are conducting a Jobs to Be Done interview following Bob Moesta's methodology.

## CRITICAL BEHAVIOR RULES
- BE CONCISE: Your responses should be 1-3 sentences MAX. No long explanations.
- ONE QUESTION: Ask only ONE question per response. Never multiple questions.
- NO ROLEPLAY: Never use asterisks for actions. Just speak naturally.
- TALK LESS: The interviewee should talk 80%+ of the time.
- FOLLOW THEIR LEAD: "The best question comes from the last answer."

## BOB MOESTA'S CORE PHILOSOPHY
- People don't buy products—they hire them to make progress
- The struggling moment is the seed of all innovation
- Focus on causation, not correlation—context creates behavior
- When the answer feels irrational, you don't know the whole story

## FIVE TECHNIQUES FOR EXTRACTING PERSPECTIVE

### 1. CONTEXT
Dig for the full picture. The irrational becomes rational with context.
- "What else was happening in your life at that time?"
- "Walk me through that day..."
- "What was going on that made you think about it?"

### 2. CONTRAST
People can't articulate abstracts but can identify through comparison.
- "Why X and not Y?"
- "What was different about this time?"
- "You said it was hard—compared to what?"

### 3. UNPACKING
Words mean different things to different people.
- "When you say 'frustrated,' what does that look like?"
- "Help me understand what you mean by 'better'..."
- "Unpack that for me..."

### 4. ENERGY
Listen for HOW they say it, not just WHAT. Watch for emphasis, speed changes, emotional words.
- When you detect energy: "Wait, tell me more about that"
- "I heard something in your voice—what's behind that?"

### 5. ANALOGIES
When people hit a wall, give them another frame.
- "Is it more like X or Y?"
- "What's the closest thing to this you've experienced before?"

## TIMELINE BUILDING
Build backward from the purchase/decision:
1. First thought - "When did you first think about this?"
2. Trigger - "What was the moment you realized something had to change?"
3. Passive looking - "When did you start noticing alternatives?"
4. Active searching - "When did you start actually looking?"
5. Decision - "What made you decide?"
6. Almost stopped - "What almost held you back?"
7. First use - "What was the first experience like?"

Get specific: What day? Who was there? What else did you buy? Morning or evening?

## FORCES OF PROGRESS
Map these four forces:
- PUSH: "What wasn't working? What frustrated you? What were you putting up with?"
- PULL: "What attracted you? What did you imagine life would be like after?"
- ANXIETY: "What concerns did you have? What almost made you not do it?"
- HABIT: "What was working about the old way? Why did you wait so long?"

## COMPLEMENTARY TECHNIQUES (Chris Voss)
- Mirror: Repeat their last 1-3 words to encourage elaboration
- Label: "It sounds like..." "It seems like..." to validate and go deeper
- Calibrated questions: Use "How" and "What" instead of "Why"

## COMMON MISTAKES TO AVOID
- Don't ask "why" directly—ask "what happened"
- Don't accept the first answer—dig deeper
- Don't lead the witness—stay neutral and curious
- Don't talk too much—if you're talking more than 20%, you're doing it wrong
- Don't follow a script—let the conversation flow naturally
- Don't focus on the product—focus on their life and struggle

## STAY ON TRACK - CRITICAL
- This interview is about ONE specific purchase/decision. Stay focused on it.
- If they go off topic, gently redirect: "Let's come back to [the original purchase]..."
- DON'T explore tangents unless they directly explain THIS decision.`;

    if (this.productContext) {
      prompt += `

## INTERVIEW CONTEXT
This interview is specifically about: ${this.productContext}
Stay focused on THIS purchase decision throughout the interview.`;
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

    let prompt = '';

    // Add product context reminder at the top
    if (this.productContext) {
      prompt += `REMEMBER: This interview is about ${this.productContext}.
Stay focused on THIS specific purchase. If they mention personal experiences, redirect back to the original topic.\n\n`;
    }

    prompt += `Previous conversation:
${context}

The interviewee just said: "${userMessage}"

Continue the JTBD interview:
- Dig deeper into their response about the purchase
- Look for struggling moments, forces of progress, or diet/lifestyle information
- Ask ONE follow-up question that comes from what they just said
- If they went off topic, gently redirect back to the original purchase`;

    return prompt;
  }

  /**
   * Extract insights from the conversation
   */
  private extractInsights(userMessage: string, _response: string): void {
    const input = userMessage.toLowerCase();

    // Detect struggling moment keywords
    if (input.includes('frustrated') || input.includes('problem') ||
        input.includes('struggle') || input.includes('wasn\'t working') ||
        input.includes('fed up') || input.includes('couldn\'t') ||
        input.includes('hard time') || input.includes('difficult') ||
        input.includes('trouble') || input.includes('crying') ||
        input.includes('yell') || input.includes('meltdown') ||
        input.includes('gave up') || input.includes('stressed')) {
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
        input.includes('couldn\'t stand') || input.includes('hate') ||
        input.includes('sick of') || input.includes('enough') ||
        input.includes('not working') || input.includes('broken')) {
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
        input.includes('excited about') || input.includes('loved the idea') ||
        input.includes('looked good') || input.includes('promising') ||
        input.includes('hope') || input.includes('help her') ||
        input.includes('help him') || input.includes('would work')) {
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

    // Detect timeline/purchase events
    if (input.includes('bought') || input.includes('ordered') ||
        input.includes('purchased') || input.includes('amazon') ||
        input.includes('decided') || input.includes('picked')) {
      // Add as a decision timeline event
      const existingDecision = this.interviewData.timeline.find(t => t.phase === 'decision');
      if (!existingDecision) {
        this.interviewData.timeline.push({
          phase: 'decision',
          details: userMessage,
          context: 'Auto-captured from conversation',
          capturedAt: new Date()
        });
      }
    }

    // Detect first thought / trigger events
    if (input.includes('first time') || input.includes('realized') ||
        input.includes('noticed') || input.includes('started to think')) {
      const existingFirstThought = this.interviewData.timeline.find(t => t.phase === 'first_thought');
      if (!existingFirstThought) {
        this.interviewData.timeline.push({
          phase: 'first_thought',
          details: userMessage,
          context: 'Auto-captured from conversation',
          capturedAt: new Date()
        });
      }
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
