import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ModelSelector } from './admin/ModelSelector';

interface ClaudeModel {
  id: string;
  name: string;
  description: string;
}

interface SetupModalProps {
  onStart: (config: { productContext?: string; intervieweeName?: string; model?: string }) => void;
  models: ClaudeModel[];
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

export default function SetupModal({
  onStart,
  models,
  selectedModel,
  onModelChange
}: SetupModalProps) {
  const [productContext, setProductContext] = useState('');
  const [intervieweeName, setIntervieweeName] = useState('');
  const [isStarting, setIsStarting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsStarting(true);
    try {
      await onStart({
        productContext: productContext || undefined,
        intervieweeName: intervieweeName || undefined,
        model: selectedModel
      });
    } catch (error) {
      console.error('Failed to start interview:', error);
      setIsStarting(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.headerRow}>
          <h2 style={styles.title}>Start New Interview</h2>
          <Link to="/admin" style={styles.adminLink}>
            View Past Interviews
          </Link>
        </div>
        <p style={styles.description}>
          Configure the interview context. The AI interviewer will adapt questions
          based on the product/service context you provide.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Interviewee Name (optional)</label>
            <input
              type="text"
              className="input"
              placeholder="e.g., John"
              value={intervieweeName}
              onChange={e => setIntervieweeName(e.target.value)}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Product/Service Context (optional)</label>
            <textarea
              className="input"
              placeholder="e.g., Project management software for small teams"
              value={productContext}
              onChange={e => setProductContext(e.target.value)}
              rows={3}
              style={{ resize: 'vertical' }}
            />
            <p style={styles.hint}>
              This helps the interviewer ask relevant questions. Leave blank for a general JTBD interview.
            </p>
          </div>

          <div style={styles.field}>
            <ModelSelector
              models={models}
              selectedModel={selectedModel}
              onModelChange={onModelChange}
            />
          </div>

          <div style={styles.info}>
            <h3 style={styles.infoTitle}>What to expect:</h3>
            <ul style={styles.infoList}>
              <li>The AI will conduct a Bob Moesta-style JTBD interview</li>
              <li>It will explore a recent decision/purchase in depth</li>
              <li>You'll uncover the struggling moment and forces of progress</li>
              <li>The diet inquiry will reveal how to reach similar customers</li>
              <li>Expect the interview to take 15-30 minutes</li>
            </ul>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={styles.button}
            disabled={isStarting}
          >
            {isStarting ? 'Starting Interview...' : 'Start Interview'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000
  },
  modal: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto'
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  title: {
    fontSize: '24px',
    fontWeight: 600,
    margin: 0,
    color: '#1e293b'
  },
  adminLink: {
    fontSize: '14px',
    color: '#6366f1',
    textDecoration: 'none'
  },
  description: {
    color: '#64748b',
    marginBottom: '24px',
    lineHeight: 1.6
  },
  field: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 500,
    marginBottom: '8px',
    color: '#374151'
  },
  hint: {
    fontSize: '12px',
    color: '#9ca3af',
    marginTop: '6px'
  },
  info: {
    background: '#f1f5f9',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px'
  },
  infoTitle: {
    fontSize: '14px',
    fontWeight: 600,
    marginBottom: '8px',
    color: '#374151'
  },
  infoList: {
    fontSize: '13px',
    color: '#64748b',
    paddingLeft: '20px',
    margin: 0,
    lineHeight: 1.8
  },
  button: {
    width: '100%',
    padding: '14px',
    fontSize: '16px'
  }
};
