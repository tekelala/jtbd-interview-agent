import type { ForcesOfProgress, Force } from '../types';

interface ForcesVisualProps {
  forces: ForcesOfProgress;
}

type ForceType = 'push' | 'pull' | 'anxiety' | 'habit';

const FORCE_CONFIG: Record<ForceType, {
  label: string;
  description: string;
  color: string;
  bgColor: string;
  icon: string;
}> = {
  push: {
    label: 'Push',
    description: 'Away from current situation',
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.1)',
    icon: '👈'
  },
  pull: {
    label: 'Pull',
    description: 'Toward new solution',
    color: '#22c55e',
    bgColor: 'rgba(34, 197, 94, 0.1)',
    icon: '👉'
  },
  anxiety: {
    label: 'Anxiety',
    description: 'Fear of change',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.1)',
    icon: '😰'
  },
  habit: {
    label: 'Habit',
    description: 'Comfort with status quo',
    color: '#8b5cf6',
    bgColor: 'rgba(139, 92, 246, 0.1)',
    icon: '🔄'
  }
};

export default function ForcesVisual({ forces }: ForcesVisualProps) {
  const totalForces = Object.values(forces).flat().length;

  // Calculate average intensity for each force type
  const getAverageIntensity = (forceList: Force[]): number => {
    if (forceList.length === 0) return 0;
    return forceList.reduce((sum, f) => sum + f.intensity, 0) / forceList.length;
  };

  const forceTypes: ForceType[] = ['push', 'pull', 'anxiety', 'habit'];

  return (
    <div className="card">
      <h2>Forces of Progress</h2>

      {totalForces === 0 ? (
        <p style={styles.empty}>
          Forces will appear here as push, pull, anxiety, and habit factors are identified.
        </p>
      ) : (
        <>
          {/* Visual diagram */}
          <div style={styles.diagram}>
            <div style={styles.changeForces}>
              <div style={styles.forceBar}>
                <span style={{ ...styles.forceIcon, color: FORCE_CONFIG.push.color }}>
                  {FORCE_CONFIG.push.icon} Push
                </span>
                <div style={styles.barContainer}>
                  <div
                    style={{
                      ...styles.bar,
                      width: `${getAverageIntensity(forces.push) * 10}%`,
                      background: FORCE_CONFIG.push.color
                    }}
                  />
                </div>
              </div>
              <div style={styles.forceBar}>
                <span style={{ ...styles.forceIcon, color: FORCE_CONFIG.pull.color }}>
                  {FORCE_CONFIG.pull.icon} Pull
                </span>
                <div style={styles.barContainer}>
                  <div
                    style={{
                      ...styles.bar,
                      width: `${getAverageIntensity(forces.pull) * 10}%`,
                      background: FORCE_CONFIG.pull.color
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={styles.divider}>
              <span>vs</span>
            </div>

            <div style={styles.resistForces}>
              <div style={styles.forceBar}>
                <span style={{ ...styles.forceIcon, color: FORCE_CONFIG.anxiety.color }}>
                  {FORCE_CONFIG.anxiety.icon} Anxiety
                </span>
                <div style={styles.barContainer}>
                  <div
                    style={{
                      ...styles.bar,
                      width: `${getAverageIntensity(forces.anxiety) * 10}%`,
                      background: FORCE_CONFIG.anxiety.color
                    }}
                  />
                </div>
              </div>
              <div style={styles.forceBar}>
                <span style={{ ...styles.forceIcon, color: FORCE_CONFIG.habit.color }}>
                  {FORCE_CONFIG.habit.icon} Habit
                </span>
                <div style={styles.barContainer}>
                  <div
                    style={{
                      ...styles.bar,
                      width: `${getAverageIntensity(forces.habit) * 10}%`,
                      background: FORCE_CONFIG.habit.color
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Force details */}
          <div style={styles.details}>
            {forceTypes.map(type => {
              const forceList = forces[type];
              if (forceList.length === 0) return null;

              const config = FORCE_CONFIG[type];

              return (
                <div key={type} style={{ ...styles.forceSection, background: config.bgColor }}>
                  <div style={styles.forceHeader}>
                    <span style={{ ...styles.forceLabel, color: config.color }}>
                      {config.icon} {config.label}
                    </span>
                    <span style={styles.forceCount}>{forceList.length}</span>
                  </div>
                  <ul style={styles.forceList}>
                    {forceList.map((force, i) => (
                      <li key={i} style={styles.forceItem}>
                        <span>{force.description}</span>
                        <span style={styles.intensity}>{force.intensity}/10</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </>
      )}
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
  diagram: {
    marginBottom: '16px'
  },
  changeForces: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  resistForces: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  forceBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  forceIcon: {
    fontSize: '12px',
    fontWeight: 600,
    width: '80px',
    flexShrink: 0
  },
  barContainer: {
    flex: 1,
    height: '8px',
    background: '#e2e8f0',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  bar: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.3s'
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 0',
    color: '#94a3b8',
    fontSize: '12px',
    fontWeight: 500
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  forceSection: {
    borderRadius: '8px',
    padding: '12px'
  },
  forceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  forceLabel: {
    fontSize: '13px',
    fontWeight: 600
  },
  forceCount: {
    fontSize: '11px',
    color: '#94a3b8',
    background: 'white',
    padding: '2px 8px',
    borderRadius: '10px'
  },
  forceList: {
    listStyle: 'none',
    margin: 0,
    padding: 0
  },
  forceItem: {
    fontSize: '12px',
    color: '#475569',
    padding: '4px 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  intensity: {
    fontSize: '11px',
    color: '#94a3b8',
    fontWeight: 500
  }
};
