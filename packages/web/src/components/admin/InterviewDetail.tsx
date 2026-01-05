/**
 * Interview Detail Component
 *
 * Displays the full conversation and data from a saved interview.
 */

import { useState } from 'react';
import type { StoredInterview } from '../../hooks/useAdmin';

interface InterviewDetailProps {
  interview: StoredInterview;
  onBack: () => void;
  onViewReport: () => void;
}

type TabType = 'conversation' | 'timeline' | 'forces' | 'diet' | 'insights';

export function InterviewDetail({
  interview,
  onBack,
  onViewReport
}: InterviewDetailProps) {
  const [activeTab, setActiveTab] = useState<TabType>('conversation');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const phaseLabels: Record<string, string> = {
    first_thought: 'First Thought',
    trigger: 'Trigger Event',
    passive_looking: 'Passive Looking',
    active_searching: 'Active Searching',
    decision: 'Decision',
    almost_stopped: 'Almost Stopped',
    first_use: 'First Use'
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: 'conversation', label: 'Conversation' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'forces', label: 'Forces' },
    { id: 'diet', label: 'Diet Profile' },
    { id: 'insights', label: 'Insights' }
  ];

  return (
    <div className="interview-detail">
      <div className="detail-header">
        <button className="back-btn" onClick={onBack}>
          &larr; Back to List
        </button>
        <div className="header-info">
          <h2>{interview.config.intervieweeName || 'Anonymous'}</h2>
          <p className="meta">
            {formatDate(interview.createdAt)} | Model: {interview.config.model}
          </p>
          {interview.config.productContext && (
            <p className="product-context">{interview.config.productContext}</p>
          )}
        </div>
        <button className="report-btn" onClick={onViewReport}>
          View Report
        </button>
      </div>

      {interview.summary?.jobStatement && (
        <div className="job-statement-box">
          <strong>Job Statement:</strong>
          <p>"{interview.summary.jobStatement}"</p>
        </div>
      )}

      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'conversation' && (
          <div className="conversation">
            {interview.messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.role}`}>
                <div className="message-role">
                  {msg.role === 'user' ? 'Interviewee' : 'Interviewer'}
                </div>
                <div className="message-content">{msg.content}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="timeline-view">
            {interview.data.timeline.length === 0 ? (
              <p className="empty">No timeline events captured</p>
            ) : (
              <div className="timeline-items">
                {interview.data.timeline.map((event, idx) => (
                  <div key={idx} className="timeline-event">
                    <div className="event-marker">{idx + 1}</div>
                    <div className="event-content">
                      <h4>{phaseLabels[event.phase] || event.phase}</h4>
                      {event.date && <span className="date">{event.date}</span>}
                      <p>{event.details}</p>
                      {event.context && (
                        <p className="context">Context: {event.context}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'forces' && (
          <div className="forces-view">
            <div className="forces-grid">
              <div className="force-section push">
                <h4>Push Forces</h4>
                {interview.data.forces.push.length === 0 ? (
                  <p className="empty">None captured</p>
                ) : (
                  <ul>
                    {interview.data.forces.push.map((f, idx) => (
                      <li key={idx}>
                        <span className="intensity">{f.intensity}/10</span>
                        <span className="description">{f.description}</span>
                        {f.verbatim && <q>{f.verbatim}</q>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="force-section pull">
                <h4>Pull Forces</h4>
                {interview.data.forces.pull.length === 0 ? (
                  <p className="empty">None captured</p>
                ) : (
                  <ul>
                    {interview.data.forces.pull.map((f, idx) => (
                      <li key={idx}>
                        <span className="intensity">{f.intensity}/10</span>
                        <span className="description">{f.description}</span>
                        {f.verbatim && <q>{f.verbatim}</q>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="force-section anxiety">
                <h4>Anxiety Forces</h4>
                {interview.data.forces.anxiety.length === 0 ? (
                  <p className="empty">None captured</p>
                ) : (
                  <ul>
                    {interview.data.forces.anxiety.map((f, idx) => (
                      <li key={idx}>
                        <span className="intensity">{f.intensity}/10</span>
                        <span className="description">{f.description}</span>
                        {f.verbatim && <q>{f.verbatim}</q>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="force-section habit">
                <h4>Habit Forces</h4>
                {interview.data.forces.habit.length === 0 ? (
                  <p className="empty">None captured</p>
                ) : (
                  <ul>
                    {interview.data.forces.habit.map((f, idx) => (
                      <li key={idx}>
                        <span className="intensity">{f.intensity}/10</span>
                        <span className="description">{f.description}</span>
                        {f.verbatim && <q>{f.verbatim}</q>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'diet' && (
          <div className="diet-view">
            <div className="diet-section">
              <h4>Media Consumption</h4>
              {interview.data.dietProfile.mediaConsumption.podcasts.length > 0 && (
                <div className="diet-item">
                  <strong>Podcasts:</strong>
                  <span>{interview.data.dietProfile.mediaConsumption.podcasts.map(p => p.name).join(', ')}</span>
                </div>
              )}
              {interview.data.dietProfile.mediaConsumption.newsletters.length > 0 && (
                <div className="diet-item">
                  <strong>Newsletters:</strong>
                  <span>{interview.data.dietProfile.mediaConsumption.newsletters.map(n => n.name).join(', ')}</span>
                </div>
              )}
              {interview.data.dietProfile.mediaConsumption.youtubeChannels.length > 0 && (
                <div className="diet-item">
                  <strong>YouTube:</strong>
                  <span>{interview.data.dietProfile.mediaConsumption.youtubeChannels.map(y => y.name).join(', ')}</span>
                </div>
              )}
            </div>

            {interview.data.dietProfile.professionalNetworks.length > 0 && (
              <div className="diet-section">
                <h4>Professional Networks</h4>
                <ul>
                  {interview.data.dietProfile.professionalNetworks.map((n, idx) => (
                    <li key={idx}>{n.name} ({n.type})</li>
                  ))}
                </ul>
              </div>
            )}

            {interview.data.dietProfile.physicalTouchpoints.length > 0 && (
              <div className="diet-section">
                <h4>Physical Touchpoints</h4>
                <ul>
                  {interview.data.dietProfile.physicalTouchpoints.map((t, idx) => (
                    <li key={idx}>{t.name || t.type}</li>
                  ))}
                </ul>
              </div>
            )}

            {interview.data.dietProfile.trustedSources.length > 0 && (
              <div className="diet-section">
                <h4>Trusted Sources</h4>
                <ul>
                  {interview.data.dietProfile.trustedSources.map((s, idx) => (
                    <li key={idx}>{s.name} ({s.type})</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="insights-view">
            {interview.data.insights.length === 0 ? (
              <p className="empty">No insights captured</p>
            ) : (
              <div className="insights-list">
                {interview.data.insights.map((insight, idx) => (
                  <div key={idx} className={`insight-item ${insight.category}`}>
                    <span className="category">{insight.category.replace('_', ' ')}</span>
                    <p className={insight.isVerbatim ? 'verbatim' : ''}>
                      {insight.isVerbatim ? `"${insight.content}"` : insight.content}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {interview.data.verbatimQuotes.length > 0 && (
              <div className="quotes-section">
                <h4>Key Quotes</h4>
                {interview.data.verbatimQuotes.map((quote, idx) => (
                  <blockquote key={idx}>
                    "{quote.quote}"
                    {quote.context && <cite>- {quote.context}</cite>}
                  </blockquote>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .interview-detail {
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .detail-header {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 1rem;
        }

        .back-btn {
          padding: 0.5rem 1rem;
          background: transparent;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          cursor: pointer;
          white-space: nowrap;
        }

        .back-btn:hover {
          background: #f3f4f6;
        }

        .header-info {
          flex: 1;
        }

        .header-info h2 {
          margin: 0;
          font-size: 1.25rem;
        }

        .header-info .meta {
          margin: 0.25rem 0 0 0;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .header-info .product-context {
          margin: 0.25rem 0 0 0;
          font-size: 0.875rem;
          color: #4b5563;
        }

        .report-btn {
          padding: 0.5rem 1rem;
          background: #6366f1;
          color: white;
          border: none;
          border-radius: 0.375rem;
          cursor: pointer;
          white-space: nowrap;
        }

        .report-btn:hover {
          background: #4f46e5;
        }

        .job-statement-box {
          background: #f0fdf4;
          border: 1px solid #86efac;
          border-radius: 0.5rem;
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .job-statement-box strong {
          color: #166534;
        }

        .job-statement-box p {
          margin: 0.5rem 0 0 0;
          font-style: italic;
          color: #15803d;
        }

        .tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 0.5rem;
        }

        .tab {
          padding: 0.5rem 1rem;
          background: transparent;
          border: none;
          border-radius: 0.375rem;
          cursor: pointer;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .tab:hover {
          background: #f3f4f6;
          color: #1f2937;
        }

        .tab.active {
          background: #6366f1;
          color: white;
        }

        .tab-content {
          flex: 1;
          overflow-y: auto;
        }

        .empty {
          color: #9ca3af;
          text-align: center;
          padding: 2rem;
        }

        /* Conversation */
        .conversation {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .message {
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
        }

        .message.user {
          background: #f3f4f6;
          margin-left: 2rem;
        }

        .message.assistant {
          background: #eef2ff;
          margin-right: 2rem;
        }

        .message-role {
          font-size: 0.75rem;
          font-weight: 600;
          color: #6b7280;
          margin-bottom: 0.25rem;
        }

        .message-content {
          font-size: 0.875rem;
          line-height: 1.5;
          white-space: pre-wrap;
        }

        /* Timeline */
        .timeline-items {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .timeline-event {
          display: flex;
          gap: 1rem;
        }

        .event-marker {
          width: 2rem;
          height: 2rem;
          background: #6366f1;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          flex-shrink: 0;
        }

        .event-content {
          flex: 1;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .event-content h4 {
          margin: 0 0 0.25rem 0;
          color: #1f2937;
        }

        .event-content .date {
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .event-content p {
          margin: 0.5rem 0 0 0;
          font-size: 0.875rem;
          color: #4b5563;
        }

        .event-content .context {
          font-size: 0.75rem;
          color: #9ca3af;
          font-style: italic;
        }

        /* Forces */
        .forces-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .force-section {
          padding: 1rem;
          border-radius: 0.5rem;
        }

        .force-section.push { background: #fef2f2; }
        .force-section.pull { background: #f0fdf4; }
        .force-section.anxiety { background: #fefce8; }
        .force-section.habit { background: #f5f3ff; }

        .force-section h4 {
          margin: 0 0 0.75rem 0;
          font-size: 0.875rem;
        }

        .force-section ul {
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .force-section li {
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }

        .force-section .intensity {
          display: inline-block;
          padding: 0.125rem 0.375rem;
          background: rgba(0,0,0,0.1);
          border-radius: 0.25rem;
          font-size: 0.75rem;
          margin-right: 0.5rem;
        }

        .force-section q {
          display: block;
          margin-top: 0.25rem;
          font-style: italic;
          color: #6b7280;
          font-size: 0.75rem;
        }

        /* Diet */
        .diet-section {
          margin-bottom: 1.5rem;
        }

        .diet-section h4 {
          margin: 0 0 0.5rem 0;
          color: #1f2937;
        }

        .diet-item {
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }

        .diet-item strong {
          color: #6b7280;
          margin-right: 0.5rem;
        }

        .diet-section ul {
          margin: 0;
          padding-left: 1.5rem;
        }

        .diet-section li {
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }

        /* Insights */
        .insights-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .insight-item {
          padding: 0.75rem;
          border-radius: 0.375rem;
          background: #f9fafb;
          border-left: 3px solid #d1d5db;
        }

        .insight-item.struggling_moment { border-left-color: #ef4444; }
        .insight-item.push { border-left-color: #f97316; }
        .insight-item.pull { border-left-color: #22c55e; }
        .insight-item.anxiety { border-left-color: #eab308; }
        .insight-item.habit { border-left-color: #8b5cf6; }

        .insight-item .category {
          display: inline-block;
          font-size: 0.75rem;
          color: #6b7280;
          text-transform: capitalize;
          margin-bottom: 0.25rem;
        }

        .insight-item p {
          margin: 0;
          font-size: 0.875rem;
        }

        .insight-item p.verbatim {
          font-style: italic;
        }

        .quotes-section {
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }

        .quotes-section h4 {
          margin: 0 0 1rem 0;
        }

        .quotes-section blockquote {
          margin: 0 0 1rem 0;
          padding: 1rem;
          background: #f9fafb;
          border-left: 3px solid #6366f1;
          font-style: italic;
        }

        .quotes-section cite {
          display: block;
          margin-top: 0.5rem;
          font-size: 0.75rem;
          color: #6b7280;
        }

        @media (max-width: 768px) {
          .forces-grid {
            grid-template-columns: 1fr;
          }

          .detail-header {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

export default InterviewDetail;
