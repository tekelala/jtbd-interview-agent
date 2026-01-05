/**
 * API Server for JTBD Interview Agent
 *
 * Provides HTTP endpoints for the React frontend to interact with
 * the interview agent.
 */

import { createServer, IncomingMessage, ServerResponse } from 'http';
import { JTBDInterviewer, CLAUDE_MODELS, type ClaudeModel, type Message } from './interviewer.js';
import type { InterviewConfig } from './types/interview.js';
import {
  generateInterviewId,
  saveInterview,
  loadInterview,
  deleteInterview,
  listInterviews,
  generateReport,
  type StoredInterview
} from './storage.js';

// Store active interview sessions with their messages
interface ActiveSession {
  interviewer: JTBDInterviewer;
  interviewId: string;
  config: { productContext?: string; intervieweeName?: string; model: string };
  messages: Message[];
}

const sessions = new Map<string, ActiveSession>();

interface RequestBody {
  content?: string;
  sessionId?: string;
  productContext?: string;
  intervieweeName?: string;
  model?: ClaudeModel;
}

async function parseBody(req: IncomingMessage): Promise<RequestBody> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

function sendJSON(res: ServerResponse, data: unknown, status = 200): void {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

async function handleRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const url = req.url || '/';
  const method = req.method || 'GET';

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  try {
    // Get available models
    if (url === '/api/models' && method === 'GET') {
      sendJSON(res, { models: CLAUDE_MODELS });
      return;
    }

    // Start a new interview
    if (url === '/api/interview/start' && method === 'POST') {
      const body = await parseBody(req);
      const sessionId = generateSessionId();
      const interviewId = generateInterviewId();
      const model = body.model || 'claude-sonnet-4-20250514';

      const interviewer = new JTBDInterviewer({ model });

      const config: InterviewConfig = {
        productContext: body.productContext,
        intervieweeName: body.intervieweeName,
        sessionId
      };

      const openingMessage = await interviewer.startInterview(config);

      const session: ActiveSession = {
        interviewer,
        interviewId,
        config: {
          productContext: body.productContext,
          intervieweeName: body.intervieweeName,
          model
        },
        messages: [{
          role: 'assistant',
          content: openingMessage,
          timestamp: new Date()
        }]
      };

      sessions.set(sessionId, session);

      sendJSON(res, {
        sessionId,
        interviewId,
        message: openingMessage,
        phase: interviewer.getCurrentPhase(),
        model
      });
      return;
    }

    // Send a message in an interview
    if (url === '/api/interview/message' && method === 'POST') {
      const body = await parseBody(req);

      if (!body.sessionId) {
        sendJSON(res, { error: 'Missing sessionId' }, 400);
        return;
      }

      const session = sessions.get(body.sessionId);
      if (!session) {
        sendJSON(res, { error: 'Session not found' }, 404);
        return;
      }

      if (!body.content) {
        sendJSON(res, { error: 'Missing message content' }, 400);
        return;
      }

      // Track user message
      session.messages.push({
        role: 'user',
        content: body.content,
        timestamp: new Date()
      });

      const response = await session.interviewer.sendMessage(body.content);

      // Track assistant response
      session.messages.push({
        role: 'assistant',
        content: response,
        timestamp: new Date()
      });

      sendJSON(res, {
        message: response,
        interviewData: session.interviewer.getInterviewData(),
        phase: session.interviewer.getCurrentPhase()
      });
      return;
    }

    // End an interview
    if (url === '/api/interview/end' && method === 'POST') {
      const body = await parseBody(req);

      if (!body.sessionId) {
        sendJSON(res, { error: 'Missing sessionId' }, 400);
        return;
      }

      const session = sessions.get(body.sessionId);
      if (!session) {
        sendJSON(res, { error: 'Session not found' }, 404);
        return;
      }

      const summary = await session.interviewer.endInterview();
      const interviewData = session.interviewer.getInterviewData();

      // Save interview to storage
      const storedInterview: StoredInterview = {
        id: session.interviewId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        config: session.config,
        data: interviewData,
        messages: session.messages,
        summary
      };

      await saveInterview(storedInterview);

      // Clean up session
      sessions.delete(body.sessionId);

      sendJSON(res, {
        interviewId: session.interviewId,
        summary,
        message: `Interview complete. Job Statement: ${summary.jobStatement}`
      });
      return;
    }

    // Get interview data (active session)
    if (url.startsWith('/api/interview/data/') && method === 'GET') {
      const sessionId = url.split('/').pop();
      if (!sessionId) {
        sendJSON(res, { error: 'Missing sessionId' }, 400);
        return;
      }

      const session = sessions.get(sessionId);
      if (!session) {
        sendJSON(res, { error: 'Session not found' }, 404);
        return;
      }

      sendJSON(res, {
        interviewData: session.interviewer.getInterviewData(),
        phase: session.interviewer.getCurrentPhase()
      });
      return;
    }

    // Export interview as JSON (active session)
    if (url.startsWith('/api/interview/export/') && method === 'GET') {
      const sessionId = url.split('/').pop();
      if (!sessionId) {
        sendJSON(res, { error: 'Missing sessionId' }, 400);
        return;
      }

      const session = sessions.get(sessionId);
      if (!session) {
        sendJSON(res, { error: 'Session not found' }, 404);
        return;
      }

      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="interview-${sessionId}.json"`,
        'Access-Control-Allow-Origin': '*'
      });
      res.end(session.interviewer.exportToJSON());
      return;
    }

    // =========================================
    // ADMIN ENDPOINTS
    // =========================================

    // List all saved interviews
    if (url === '/api/admin/interviews' && method === 'GET') {
      const interviews = await listInterviews();
      sendJSON(res, { interviews });
      return;
    }

    // Get a specific saved interview
    if (url.match(/^\/api\/admin\/interviews\/[^/]+$/) && method === 'GET') {
      const interviewId = url.split('/').pop();
      if (!interviewId) {
        sendJSON(res, { error: 'Missing interviewId' }, 400);
        return;
      }

      const interview = await loadInterview(interviewId);
      if (!interview) {
        sendJSON(res, { error: 'Interview not found' }, 404);
        return;
      }

      sendJSON(res, { interview });
      return;
    }

    // Delete a saved interview
    if (url.match(/^\/api\/admin\/interviews\/[^/]+$/) && method === 'DELETE') {
      const interviewId = url.split('/').pop();
      if (!interviewId) {
        sendJSON(res, { error: 'Missing interviewId' }, 400);
        return;
      }

      const deleted = await deleteInterview(interviewId);
      if (!deleted) {
        sendJSON(res, { error: 'Interview not found or could not be deleted' }, 404);
        return;
      }

      sendJSON(res, { success: true, message: 'Interview deleted' });
      return;
    }

    // Get interview report
    if (url.match(/^\/api\/admin\/interviews\/[^/]+\/report$/) && method === 'GET') {
      const parts = url.split('/');
      const interviewId = parts[parts.length - 2];

      const interview = await loadInterview(interviewId);
      if (!interview) {
        sendJSON(res, { error: 'Interview not found' }, 404);
        return;
      }

      const report = generateReport(interview);
      sendJSON(res, { report, interview });
      return;
    }

    // Health check
    if (url === '/api/health') {
      sendJSON(res, {
        status: 'healthy',
        activeSessions: sessions.size
      });
      return;
    }

    // Not found
    sendJSON(res, { error: 'Not found' }, 404);
  } catch (error) {
    console.error('Request error:', error);
    sendJSON(res, {
      error: error instanceof Error ? error.message : 'Internal server error'
    }, 500);
  }
}

export function startServer(port = 3001): void {
  const server = createServer(handleRequest);

  server.listen(port, () => {
    console.log(`JTBD Interview Agent API running at http://localhost:${port}`);
    console.log('Available endpoints:');
    console.log('  POST /api/interview/start - Start a new interview');
    console.log('  POST /api/interview/message - Send a message');
    console.log('  POST /api/interview/end - End and summarize interview');
    console.log('  GET  /api/interview/data/:sessionId - Get interview data');
    console.log('  GET  /api/interview/export/:sessionId - Export as JSON');
    console.log('  GET  /api/health - Health check');
  });
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const port = parseInt(process.env.PORT || '3001', 10);
  startServer(port);
}
