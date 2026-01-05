import { useState, useRef, useEffect } from 'react';
import type { Message, InterviewPhase } from '../types';

interface InterviewChatProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onEndInterview: () => void;
  phase: InterviewPhase;
}

export default function InterviewChat({
  messages,
  onSendMessage,
  isLoading,
  onEndInterview,
  phase
}: InterviewChatProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="card" style={styles.container}>
      <div style={styles.header}>
        <h2 style={{ margin: 0, borderBottom: 'none', paddingBottom: 0 }}>Interview</h2>
        {phase !== 'complete' && (
          <button
            className="btn btn-secondary"
            onClick={onEndInterview}
            style={{ fontSize: '13px', padding: '6px 12px' }}
          >
            End Interview
          </button>
        )}
      </div>

      <div style={styles.messages}>
        {messages.map(message => (
          <div
            key={message.id}
            style={{
              ...styles.message,
              ...(message.role === 'user' ? styles.userMessage : styles.assistantMessage)
            }}
          >
            <div style={styles.messageRole}>
              {message.role === 'user' ? 'You' : 'Interviewer'}
            </div>
            <div style={styles.messageContent}>
              {message.content.split('\n').map((line, i) => (
                <p key={i} style={{ margin: line ? '0 0 8px 0' : '0' }}>
                  {line || '\u00A0'}
                </p>
              ))}
            </div>
            <div style={styles.messageTime}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{ ...styles.message, ...styles.assistantMessage }}>
            <div style={styles.messageRole}>Interviewer</div>
            <div style={styles.typing}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} style={styles.inputForm}>
        <input
          type="text"
          className="input"
          placeholder={phase === 'complete' ? 'Interview complete' : 'Type your response...'}
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={isLoading || phase === 'complete'}
          style={{ flex: 1 }}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!input.trim() || isLoading || phase === 'complete'}
        >
          Send
        </button>
      </form>

      <style>{`
        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
        .typing span {
          width: 8px;
          height: 8px;
          background: #94a3b8;
          border-radius: 50%;
          display: inline-block;
          margin: 0 2px;
          animation: typing 1s infinite;
        }
        .typing span:nth-child(2) { animation-delay: 0.1s; }
        .typing span:nth-child(3) { animation-delay: 0.2s; }
      `}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 180px)',
    minHeight: '500px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '12px',
    borderBottom: '1px solid #e2e8f0',
    marginBottom: '16px'
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: '4px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  message: {
    maxWidth: '85%',
    padding: '12px 16px',
    borderRadius: '12px'
  },
  userMessage: {
    alignSelf: 'flex-end',
    background: '#2563eb',
    color: 'white'
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    background: '#f1f5f9',
    color: '#1e293b'
  },
  messageRole: {
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase',
    marginBottom: '6px',
    opacity: 0.7
  },
  messageContent: {
    fontSize: '14px',
    lineHeight: 1.6
  },
  messageTime: {
    fontSize: '10px',
    opacity: 0.5,
    marginTop: '6px',
    textAlign: 'right'
  },
  typing: {
    display: 'flex',
    gap: '4px',
    padding: '8px 0'
  },
  inputForm: {
    display: 'flex',
    gap: '12px',
    paddingTop: '16px',
    borderTop: '1px solid #e2e8f0',
    marginTop: '16px'
  }
};
