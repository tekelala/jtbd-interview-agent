/**
 * Interview List Component
 *
 * Displays a list of saved interviews with search and filter.
 */

import React, { useState, useMemo } from 'react';

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

interface InterviewListProps {
  interviews: InterviewListItem[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export function InterviewList({
  interviews,
  onSelect,
  onDelete,
  loading = false
}: InterviewListProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredInterviews = useMemo(() => {
    return interviews.filter(interview => {
      const matchesSearch =
        interview.intervieweeName.toLowerCase().includes(search.toLowerCase()) ||
        interview.productContext?.toLowerCase().includes(search.toLowerCase()) ||
        interview.jobStatement?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || interview.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [interviews, search, statusFilter]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this interview?')) {
      onDelete(id);
    }
  };

  if (loading) {
    return (
      <div className="interview-list-loading">
        <div className="spinner"></div>
        <p>Loading interviews...</p>
      </div>
    );
  }

  return (
    <div className="interview-list">
      <div className="list-header">
        <h2>Saved Interviews</h2>
        <div className="filters">
          <input
            type="text"
            placeholder="Search interviews..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="all">All Status</option>
            <option value="complete">Complete</option>
            <option value="in_progress">In Progress</option>
          </select>
        </div>
      </div>

      {filteredInterviews.length === 0 ? (
        <div className="empty-state">
          <p>No interviews found</p>
          {interviews.length > 0 && (
            <button onClick={() => { setSearch(''); setStatusFilter('all'); }}>
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="list-items">
          {filteredInterviews.map(interview => (
            <div
              key={interview.id}
              className="interview-card"
              onClick={() => onSelect(interview.id)}
            >
              <div className="card-header">
                <h3>{interview.intervieweeName}</h3>
                <span className={`status-badge ${interview.status}`}>
                  {interview.status === 'complete' ? 'Complete' : 'In Progress'}
                </span>
              </div>

              {interview.productContext && (
                <p className="product-context">{interview.productContext}</p>
              )}

              {interview.jobStatement && (
                <p className="job-statement">"{interview.jobStatement}"</p>
              )}

              <div className="card-meta">
                <span className="date">{formatDate(interview.createdAt)}</span>
                <span className="stats">
                  {interview.insightCount} insights | {interview.forceCount} forces
                </span>
              </div>

              <button
                className="delete-btn"
                onClick={(e) => handleDelete(e, interview.id)}
                title="Delete interview"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .interview-list {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .interview-list-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
          color: #6b7280;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e5e7eb;
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .list-header {
          margin-bottom: 1rem;
        }

        .list-header h2 {
          margin: 0 0 1rem 0;
          font-size: 1.25rem;
          color: #1f2937;
        }

        .filters {
          display: flex;
          gap: 0.75rem;
        }

        .search-input {
          flex: 1;
          padding: 0.5rem 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.875rem;
        }

        .search-input:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
        }

        .status-filter {
          padding: 0.5rem 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          background: white;
        }

        .empty-state {
          text-align: center;
          padding: 3rem;
          color: #6b7280;
        }

        .empty-state button {
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background: #6366f1;
          color: white;
          border: none;
          border-radius: 0.375rem;
          cursor: pointer;
        }

        .list-items {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .interview-card {
          position: relative;
          padding: 1rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .interview-card:hover {
          border-color: #6366f1;
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.1);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.5rem;
        }

        .card-header h3 {
          margin: 0;
          font-size: 1rem;
          color: #1f2937;
        }

        .status-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .status-badge.complete {
          background: #d1fae5;
          color: #065f46;
        }

        .status-badge.in_progress {
          background: #fef3c7;
          color: #92400e;
        }

        .product-context {
          margin: 0 0 0.5rem 0;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .job-statement {
          margin: 0 0 0.5rem 0;
          font-size: 0.875rem;
          color: #4b5563;
          font-style: italic;
          line-height: 1.4;
        }

        .card-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .delete-btn {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          padding: 0.25rem 0.5rem;
          background: transparent;
          border: 1px solid #fecaca;
          color: #dc2626;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .interview-card:hover .delete-btn {
          opacity: 1;
        }

        .delete-btn:hover {
          background: #fef2f2;
        }
      `}</style>
    </div>
  );
}

export default InterviewList;
