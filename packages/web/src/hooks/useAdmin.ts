/**
 * Admin Hook
 *
 * Manages state and API calls for the admin panel.
 */

import { useState, useCallback, useEffect } from 'react';

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
  data: {
    interviewee: { name: string; context: string };
    timeline: Array<{
      phase: string;
      date?: string;
      trigger?: string;
      context?: string;
      details: string;
    }>;
    forces: {
      push: Array<{ description: string; intensity: number; verbatim?: string }>;
      pull: Array<{ description: string; intensity: number; verbatim?: string }>;
      anxiety: Array<{ description: string; intensity: number; verbatim?: string }>;
      habit: Array<{ description: string; intensity: number; verbatim?: string }>;
    };
    dietProfile: {
      mediaConsumption: {
        podcasts: Array<{ name: string }>;
        newsletters: Array<{ name: string }>;
        socialMedia: Array<{ platform: string; accounts: string[] }>;
        publications: Array<{ name: string }>;
        youtubeChannels: Array<{ name: string }>;
        influencers: Array<{ name: string }>;
      };
      professionalNetworks: Array<{ name: string; type: string }>;
      physicalTouchpoints: Array<{ type: string; name?: string }>;
      trustedSources: Array<{ name: string; type: string }>;
      discoveryChannels: Array<{ name: string }>;
    };
    insights: Array<{
      id: string;
      content: string;
      category: string;
      isVerbatim: boolean;
    }>;
    verbatimQuotes: Array<{
      quote: string;
      context: string;
      category: string;
    }>;
    status: string;
  };
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp?: string;
  }>;
  summary?: {
    jobStatement: string;
    strugglingMoment: string;
    keyInsights: string[];
    recommendations: string[];
  };
}

export interface ClaudeModel {
  id: string;
  name: string;
  description: string;
}

const API_BASE = 'http://localhost:3001';

export function useAdmin() {
  const [interviews, setInterviews] = useState<InterviewListItem[]>([]);
  const [selectedInterview, setSelectedInterview] = useState<StoredInterview | null>(null);
  const [report, setReport] = useState<string | null>(null);
  const [models, setModels] = useState<ClaudeModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch available models
  const fetchModels = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/api/models`);
      const data = await response.json();
      if (data.models) {
        setModels(data.models);
      }
    } catch (err) {
      console.error('Failed to fetch models:', err);
    }
  }, []);

  // Fetch all interviews
  const fetchInterviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/admin/interviews`);
      const data = await response.json();
      if (data.interviews) {
        setInterviews(data.interviews);
      }
    } catch (err) {
      setError('Failed to load interviews');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a specific interview
  const fetchInterview = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/admin/interviews/${id}`);
      const data = await response.json();
      if (data.interview) {
        setSelectedInterview(data.interview);
      } else {
        setError('Interview not found');
      }
    } catch (err) {
      setError('Failed to load interview');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete an interview
  const deleteInterview = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/admin/interviews/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        setInterviews(prev => prev.filter(i => i.id !== id));
        if (selectedInterview?.id === id) {
          setSelectedInterview(null);
        }
        return true;
      }
      return false;
    } catch (err) {
      setError('Failed to delete interview');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [selectedInterview]);

  // Fetch interview report
  const fetchReport = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/admin/interviews/${id}/report`);
      const data = await response.json();
      if (data.report) {
        setReport(data.report);
      }
    } catch (err) {
      setError('Failed to generate report');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear selected interview
  const clearSelection = useCallback(() => {
    setSelectedInterview(null);
    setReport(null);
  }, []);

  // Load models on mount
  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  return {
    interviews,
    selectedInterview,
    report,
    models,
    loading,
    error,
    fetchInterviews,
    fetchInterview,
    deleteInterview,
    fetchReport,
    clearSelection,
    fetchModels
  };
}

export default useAdmin;
