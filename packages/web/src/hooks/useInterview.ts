import { useState, useCallback, useEffect } from 'react';
import type {
  Message,
  InterviewConfig,
  InterviewPhase,
  InterviewData,
  DietProfile,
  ForcesOfProgress
} from '../types';

export interface ClaudeModel {
  id: string;
  name: string;
  description: string;
}

const API_BASE = 'http://localhost:3001';

const createEmptyDietProfile = (): DietProfile => ({
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
});

const createEmptyForces = (): ForcesOfProgress => ({
  push: [],
  pull: [],
  anxiety: [],
  habit: []
});

const createEmptyInterviewData = (): InterviewData => ({
  interviewee: { name: '', context: '' },
  timeline: [],
  forces: createEmptyForces(),
  dietProfile: createEmptyDietProfile(),
  insights: [],
  verbatimQuotes: [],
  status: 'in_progress'
});

export function useInterview() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [interviewData, setInterviewData] = useState<InterviewData>(createEmptyInterviewData());
  const [phase, setPhase] = useState<InterviewPhase>('setup');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [models, setModels] = useState<ClaudeModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('claude-sonnet-4-20250514');

  // Fetch available models on mount
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/models`);
        const data = await response.json();
        if (data.models) {
          setModels(data.models);
          // Set default to first model if available
          if (data.models.length > 0) {
            setSelectedModel(data.models[0].id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch models:', error);
        // Set default models if fetch fails
        setModels([
          { id: 'claude-sonnet-4-20250514', name: 'Claude Sonnet 4', description: 'Balanced performance and speed (Recommended)' },
          { id: 'claude-opus-4-20250514', name: 'Claude Opus 4', description: 'Highest quality, deeper understanding' },
          { id: 'claude-3-5-haiku-20241022', name: 'Claude Haiku 3.5', description: 'Fastest, most economical' }
        ]);
      }
    };
    fetchModels();
  }, []);

  const startInterview = useCallback(async (config: InterviewConfig & { model?: string }) => {
    setIsLoading(true);
    setInterviewData(createEmptyInterviewData());
    setMessages([]);

    try {
      const response = await fetch(`${API_BASE}/api/interview/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...config,
          model: config.model || selectedModel
        })
      });

      const data = await response.json();
      setSessionId(data.sessionId);
      setPhase('warmup');

      if (data.message) {
        const assistantMessage: Message = {
          id: `msg_${Date.now()}`,
          role: 'assistant',
          content: data.message,
          timestamp: new Date()
        };
        setMessages([assistantMessage]);
      }
    } catch (error) {
      console.error('Failed to start interview:', error);
      // For demo purposes, create a mock opening message
      const mockMessage: Message = {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: `Thanks for taking the time to chat with me today! I'm really interested in understanding your experience - there are no right or wrong answers here.

Before we dive in, I should mention that I might ask some detailed questions about specific moments. Is that okay with you?

To get started, could you tell me a little about yourself and what brings you here today?`,
        timestamp: new Date()
      };
      setMessages([mockMessage]);
      setPhase('warmup');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/interview/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, sessionId })
      });

      const data = await response.json();

      if (data.message) {
        const assistantMessage: Message = {
          id: `msg_${Date.now() + 1}`,
          role: 'assistant',
          content: data.message,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      }

      // Update interview data if provided
      if (data.interviewData) {
        setInterviewData(data.interviewData);
      }

      if (data.phase) {
        setPhase(data.phase);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // Mock response for demo
      const mockResponses = getMockResponse(content, phase);
      const assistantMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: mockResponses.message,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Update mock data
      if (mockResponses.insight) {
        setInterviewData(prev => ({
          ...prev,
          insights: [...prev.insights, mockResponses.insight!]
        }));
      }
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, phase]);

  const endInterview = useCallback(async () => {
    setIsLoading(true);
    setPhase('complete');

    try {
      const response = await fetch(`${API_BASE}/api/interview/end`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });

      const data = await response.json();
      if (data.summary) {
        const summaryMessage: Message = {
          id: `msg_${Date.now()}`,
          role: 'assistant',
          content: `## Interview Summary\n\n${data.summary}`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, summaryMessage]);
      }

      setInterviewData(prev => ({ ...prev, status: 'complete' }));
    } catch (error) {
      console.error('Failed to end interview:', error);
      const summaryMessage: Message = {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: `## Interview Complete\n\nThank you for sharing your story with me. Your insights are really valuable.\n\nI've captured the key elements of your journey, including your struggling moment, the forces that influenced your decision, and how you discover new solutions.\n\nYou can now review the timeline, forces diagram, and diet profile on the right panel.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, summaryMessage]);
      setInterviewData(prev => ({ ...prev, status: 'complete' }));
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  return {
    messages,
    interviewData,
    phase,
    isLoading,
    sendMessage,
    startInterview,
    endInterview,
    setPhase,
    models,
    selectedModel,
    setSelectedModel
  };
}

// Mock response generator for demo purposes
function getMockResponse(userInput: string, phase: InterviewPhase): {
  message: string;
  insight?: {
    id: string;
    content: string;
    category: 'struggling_moment' | 'push' | 'pull' | 'anxiety' | 'habit' | 'diet_media' | 'diet_network' | 'diet_physical' | 'general';
    isVerbatim: boolean;
    capturedAt: Date;
  };
} {
  const input = userInput.toLowerCase();

  if (input.includes('frustrated') || input.includes('problem') || input.includes('struggle')) {
    return {
      message: `That sounds really frustrating. Tell me more about that moment - what specifically wasn't working? What were you putting up with before you decided to make a change?`,
      insight: {
        id: `insight_${Date.now()}`,
        content: userInput,
        category: 'struggling_moment',
        isVerbatim: true,
        capturedAt: new Date()
      }
    };
  }

  if (input.includes('podcast') || input.includes('newsletter') || input.includes('read')) {
    return {
      message: `That's helpful to know. Which specific podcasts or newsletters actually make it into your regular rotation? What makes them worth your time compared to others you've tried?`,
      insight: {
        id: `insight_${Date.now()}`,
        content: userInput,
        category: 'diet_media',
        isVerbatim: false,
        capturedAt: new Date()
      }
    };
  }

  if (input.includes('community') || input.includes('slack') || input.includes('group')) {
    return {
      message: `Interesting! Are you an active contributor in those communities, or more of a lurker? And when you need advice or recommendations, do you turn to those communities or somewhere else?`,
      insight: {
        id: `insight_${Date.now()}`,
        content: userInput,
        category: 'diet_network',
        isVerbatim: false,
        capturedAt: new Date()
      }
    };
  }

  // Default response based on phase
  const phaseResponses: Record<InterviewPhase, string> = {
    setup: 'Let me get some information to start the interview...',
    warmup: `Thanks for sharing that. Now I'd love to hear about a specific decision you made recently. Can you think of a purchase or change you made in the past few months? Take me back to that moment.`,
    decision_deep_dive: `Walk me through what happened next. What was going on in your life at that time? Who else was involved in this decision?`,
    forces_mapping: `That's a really important insight. Let me ask - what almost stopped you from making this change? What concerns did you have?`,
    diet_inquiry: `Let's shift gears a bit. Walk me through your typical morning - what do you read, listen to, or scroll through before you start your day?`,
    synthesis: `Based on everything you've shared, it sounds like when you were [in that situation], you wanted [to solve that problem], so you could [achieve that outcome]. Does that capture it?`,
    complete: `Thank you so much for sharing your story with me. Your insights have been incredibly valuable.`
  };

  return { message: phaseResponses[phase] || phaseResponses.decision_deep_dive };
}
