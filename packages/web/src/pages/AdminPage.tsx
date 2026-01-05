/**
 * Admin Page
 *
 * Dashboard for viewing and managing saved interviews.
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { InterviewList, InterviewDetail, ReportView } from '../components/admin';
import { useAdmin } from '../hooks/useAdmin';

type ViewMode = 'list' | 'detail' | 'report';

export function AdminPage() {
  const {
    interviews,
    selectedInterview,
    report,
    loading,
    error,
    fetchInterviews,
    fetchInterview,
    deleteInterview,
    fetchReport,
    clearSelection
  } = useAdmin();

  const [viewMode, setViewMode] = useState<ViewMode>('list');

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  const handleSelectInterview = async (id: string) => {
    await fetchInterview(id);
    setViewMode('detail');
  };

  const handleViewReport = async () => {
    if (selectedInterview) {
      await fetchReport(selectedInterview.id);
      setViewMode('report');
    }
  };

  const handleBackToList = () => {
    clearSelection();
    setViewMode('list');
  };

  const handleBackToDetail = () => {
    setViewMode('detail');
  };

  const handleDownloadReport = () => {
    if (report) {
      const blob = new Blob([report], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `interview-report-${selectedInterview?.id || 'unknown'}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="header-left">
          <h1>JTBD Interview Admin</h1>
        </div>
        <div className="header-right">
          <Link to="/" className="new-interview-btn">
            + New Interview
          </Link>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => fetchInterviews()}>Retry</button>
        </div>
      )}

      <main className="admin-content">
        {viewMode === 'list' && (
          <InterviewList
            interviews={interviews}
            onSelect={handleSelectInterview}
            onDelete={deleteInterview}
            loading={loading}
          />
        )}

        {viewMode === 'detail' && selectedInterview && (
          <InterviewDetail
            interview={selectedInterview}
            onBack={handleBackToList}
            onViewReport={handleViewReport}
          />
        )}

        {viewMode === 'report' && report && (
          <ReportView
            report={report}
            onBack={handleBackToDetail}
            onDownload={handleDownloadReport}
          />
        )}
      </main>

      <style>{`
        .admin-page {
          min-height: 100vh;
          background: #f9fafb;
          display: flex;
          flex-direction: column;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background: white;
          border-bottom: 1px solid #e5e7eb;
        }

        .header-left h1 {
          margin: 0;
          font-size: 1.5rem;
          color: #1f2937;
        }

        .new-interview-btn {
          padding: 0.5rem 1rem;
          background: #6366f1;
          color: white;
          text-decoration: none;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .new-interview-btn:hover {
          background: #4f46e5;
        }

        .error-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 2rem;
          background: #fef2f2;
          color: #dc2626;
          border-bottom: 1px solid #fecaca;
        }

        .error-banner button {
          padding: 0.25rem 0.75rem;
          background: white;
          border: 1px solid #fecaca;
          border-radius: 0.25rem;
          cursor: pointer;
        }

        .admin-content {
          flex: 1;
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        @media (max-width: 768px) {
          .admin-header {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
          }

          .admin-content {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default AdminPage;
