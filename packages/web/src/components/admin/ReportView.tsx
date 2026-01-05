/**
 * Report View Component
 *
 * Displays a formatted interview report with markdown rendering.
 */

interface ReportViewProps {
  report: string;
  onBack: () => void;
  onDownload: () => void;
}

export function ReportView({ report, onBack }: ReportViewProps) {
  // Simple markdown to HTML conversion for display
  const renderMarkdown = (text: string): string => {
    return text
      // Headers
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/_(.+?)_/g, '<em>$1</em>')
      // Blockquotes
      .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
      // List items
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      // Paragraphs (double newlines)
      .replace(/\n\n/g, '</p><p>')
      // Single newlines in context
      .replace(/\n/g, '<br/>');
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(report);
    alert('Report copied to clipboard!');
  };

  const handleDownload = () => {
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-report-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="report-view">
      <div className="report-header">
        <button className="back-btn" onClick={onBack}>
          &larr; Back to Interview
        </button>
        <h2>Interview Report</h2>
        <div className="report-actions">
          <button className="action-btn" onClick={handleCopyToClipboard}>
            Copy
          </button>
          <button className="action-btn primary" onClick={handleDownload}>
            Download
          </button>
        </div>
      </div>

      <div className="report-content">
        <div
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: `<p>${renderMarkdown(report)}</p>` }}
        />
      </div>

      <div className="report-raw">
        <details>
          <summary>View Raw Markdown</summary>
          <pre>{report}</pre>
        </details>
      </div>

      <style>{`
        .report-view {
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .report-header {
          display: flex;
          align-items: center;
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

        .report-header h2 {
          flex: 1;
          margin: 0;
          font-size: 1.25rem;
        }

        .report-actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          padding: 0.5rem 1rem;
          background: transparent;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          cursor: pointer;
          font-size: 0.875rem;
        }

        .action-btn:hover {
          background: #f3f4f6;
        }

        .action-btn.primary {
          background: #6366f1;
          color: white;
          border-color: #6366f1;
        }

        .action-btn.primary:hover {
          background: #4f46e5;
        }

        .report-content {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
        }

        .markdown-body {
          font-size: 0.9375rem;
          line-height: 1.7;
          color: #1f2937;
        }

        .markdown-body h1 {
          font-size: 1.5rem;
          margin: 0 0 1rem 0;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e5e7eb;
          color: #111827;
        }

        .markdown-body h2 {
          font-size: 1.25rem;
          margin: 1.5rem 0 0.75rem 0;
          color: #1f2937;
        }

        .markdown-body h3 {
          font-size: 1.1rem;
          margin: 1.25rem 0 0.5rem 0;
          color: #374151;
        }

        .markdown-body p {
          margin: 0 0 1rem 0;
        }

        .markdown-body blockquote {
          margin: 1rem 0;
          padding: 0.75rem 1rem;
          background: #f0fdf4;
          border-left: 4px solid #22c55e;
          font-style: italic;
          color: #166534;
        }

        .markdown-body li {
          margin-bottom: 0.5rem;
          margin-left: 1.5rem;
          list-style-type: disc;
        }

        .markdown-body strong {
          color: #111827;
        }

        .markdown-body em {
          color: #6b7280;
        }

        .report-raw {
          margin-top: 1rem;
        }

        .report-raw summary {
          cursor: pointer;
          padding: 0.5rem;
          background: #f3f4f6;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .report-raw summary:hover {
          background: #e5e7eb;
        }

        .report-raw pre {
          margin-top: 0.5rem;
          padding: 1rem;
          background: #1f2937;
          color: #e5e7eb;
          border-radius: 0.375rem;
          overflow-x: auto;
          font-size: 0.75rem;
          line-height: 1.5;
          white-space: pre-wrap;
          word-break: break-word;
        }
      `}</style>
    </div>
  );
}

export default ReportView;
