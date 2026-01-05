import type { TimelineEvent, TimelinePhase } from '../types';

interface TimelineProps {
  events: TimelineEvent[];
}

const PHASE_ORDER: TimelinePhase[] = [
  'first_thought',
  'trigger',
  'passive_looking',
  'active_searching',
  'decision',
  'almost_stopped',
  'first_use'
];

const PHASE_LABELS: Record<TimelinePhase, string> = {
  first_thought: 'First Thought',
  trigger: 'Trigger Event',
  passive_looking: 'Passive Looking',
  active_searching: 'Active Searching',
  decision: 'Decision',
  almost_stopped: 'Almost Stopped',
  first_use: 'First Use'
};

const PHASE_ICONS: Record<TimelinePhase, string> = {
  first_thought: '💭',
  trigger: '⚡',
  passive_looking: '👀',
  active_searching: '🔍',
  decision: '✅',
  almost_stopped: '⚠️',
  first_use: '🎯'
};

export default function Timeline({ events }: TimelineProps) {
  // Create a map of existing events
  const eventMap = new Map(events.map(e => [e.phase, e]));

  // Sort by phase order
  const sortedPhases = PHASE_ORDER.filter(phase => eventMap.has(phase));

  return (
    <div className="card">
      <h2>Decision Timeline</h2>

      {sortedPhases.length === 0 ? (
        <p style={styles.empty}>
          Timeline events will appear here as they're discovered during the interview.
        </p>
      ) : (
        <div style={styles.timeline}>
          {sortedPhases.map((phase, index) => {
            const event = eventMap.get(phase)!;
            const isLast = index === sortedPhases.length - 1;

            return (
              <div key={phase} style={styles.event}>
                <div style={styles.connector}>
                  <div style={styles.dot}>{PHASE_ICONS[phase]}</div>
                  {!isLast && <div style={styles.line} />}
                </div>
                <div style={styles.content}>
                  <div style={styles.header}>
                    <span style={styles.label}>{PHASE_LABELS[phase]}</span>
                    {event.date && (
                      <span style={styles.date}>{event.date}</span>
                    )}
                  </div>
                  <p style={styles.details}>{event.details}</p>
                  {event.context && (
                    <p style={styles.context}>
                      <strong>Context:</strong> {event.context}
                    </p>
                  )}
                  {event.trigger && (
                    <p style={styles.trigger}>
                      <strong>Trigger:</strong> {event.trigger}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Progress indicator */}
      <div style={styles.progress}>
        <div style={styles.progressLabel}>
          {sortedPhases.length} of {PHASE_ORDER.length} phases captured
        </div>
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${(sortedPhases.length / PHASE_ORDER.length) * 100}%`
            }}
          />
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  empty: {
    color: '#94a3b8',
    fontSize: '14px',
    textAlign: 'center',
    padding: '20px'
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  event: {
    display: 'flex',
    gap: '12px'
  },
  connector: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '32px'
  },
  dot: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    flexShrink: 0
  },
  line: {
    width: '2px',
    flex: 1,
    background: '#e2e8f0',
    marginTop: '4px',
    marginBottom: '4px'
  },
  content: {
    flex: 1,
    paddingBottom: '16px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px'
  },
  label: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#1e293b'
  },
  date: {
    fontSize: '11px',
    color: '#94a3b8'
  },
  details: {
    fontSize: '13px',
    color: '#475569',
    margin: 0,
    lineHeight: 1.5
  },
  context: {
    fontSize: '12px',
    color: '#64748b',
    margin: '6px 0 0 0',
    fontStyle: 'italic'
  },
  trigger: {
    fontSize: '12px',
    color: '#f59e0b',
    margin: '4px 0 0 0'
  },
  progress: {
    marginTop: '16px',
    paddingTop: '12px',
    borderTop: '1px solid #e2e8f0'
  },
  progressLabel: {
    fontSize: '11px',
    color: '#94a3b8',
    marginBottom: '6px'
  },
  progressBar: {
    height: '4px',
    background: '#e2e8f0',
    borderRadius: '2px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    background: '#22c55e',
    borderRadius: '2px',
    transition: 'width 0.3s'
  }
};
