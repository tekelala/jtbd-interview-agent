import type { DietProfile as DietProfileType } from '../types';

interface DietProfileProps {
  profile: DietProfileType;
}

export default function DietProfile({ profile }: DietProfileProps) {
  const hasMedia = Object.values(profile.mediaConsumption).some(arr => arr.length > 0);
  const hasNetworks = profile.professionalNetworks.length > 0;
  const hasTouchpoints = profile.physicalTouchpoints.length > 0;
  const hasSources = profile.trustedSources.length > 0;
  const hasChannels = profile.discoveryChannels.length > 0;
  const hasRoutine = Object.values(profile.dailyRoutine).some(v => v);

  const isEmpty = !hasMedia && !hasNetworks && !hasTouchpoints && !hasSources && !hasChannels && !hasRoutine;

  return (
    <div className="card">
      <h2>Information Diet</h2>

      {isEmpty ? (
        <p style={styles.empty}>
          Diet information will appear here as media consumption, networks, and touchpoints are discovered.
        </p>
      ) : (
        <div style={styles.sections}>
          {/* Media Consumption */}
          {hasMedia && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>📱 Media Consumption</h3>
              <div style={styles.tags}>
                {profile.mediaConsumption.podcasts.map((p, i) => (
                  <span key={`podcast-${i}`} style={{ ...styles.tag, ...styles.podcastTag }}>
                    🎧 {p.name}
                  </span>
                ))}
                {profile.mediaConsumption.newsletters.map((n, i) => (
                  <span key={`newsletter-${i}`} style={{ ...styles.tag, ...styles.newsletterTag }}>
                    📧 {n.name}
                  </span>
                ))}
                {profile.mediaConsumption.socialMedia.map((s, i) => (
                  <span key={`social-${i}`} style={{ ...styles.tag, ...styles.socialTag }}>
                    📲 {s.name}
                  </span>
                ))}
                {profile.mediaConsumption.publications.map((p, i) => (
                  <span key={`pub-${i}`} style={{ ...styles.tag, ...styles.pubTag }}>
                    📰 {p.name}
                  </span>
                ))}
                {profile.mediaConsumption.youtubeChannels.map((y, i) => (
                  <span key={`youtube-${i}`} style={{ ...styles.tag, ...styles.youtubeTag }}>
                    📺 {y.name}
                  </span>
                ))}
                {profile.mediaConsumption.influencers.map((inf, i) => (
                  <span key={`influencer-${i}`} style={{ ...styles.tag, ...styles.influencerTag }}>
                    ⭐ {inf.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Professional Networks */}
          {hasNetworks && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>🤝 Professional Networks</h3>
              <div style={styles.tags}>
                {profile.professionalNetworks.map((n, i) => (
                  <span key={i} style={{ ...styles.tag, ...styles.networkTag }}>
                    {n.type === 'slack' ? '💬' :
                     n.type === 'discord' ? '🎮' :
                     n.type === 'conference' ? '🎪' :
                     n.type === 'meetup' ? '👥' : '🔗'} {n.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Physical Touchpoints */}
          {hasTouchpoints && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>📍 Physical Touchpoints</h3>
              <div style={styles.tags}>
                {profile.physicalTouchpoints.map((t, i) => (
                  <span key={i} style={{ ...styles.tag, ...styles.touchpointTag }}>
                    {t.type === 'coffee_shop' ? '☕' :
                     t.type === 'gym' ? '🏋️' :
                     t.type === 'coworking' ? '💼' :
                     t.type === 'commute' ? '🚗' : '📍'} {t.name || t.type}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Trusted Sources */}
          {hasSources && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>🎯 Trusted Sources</h3>
              <div style={styles.tags}>
                {profile.trustedSources.map((s, i) => (
                  <span key={i} style={{ ...styles.tag, ...styles.sourceTag }}>
                    {s.type === 'person' ? '👤' :
                     s.type === 'publication' ? '📖' :
                     s.type === 'community' ? '👥' : '✓'} {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Discovery Channels */}
          {hasChannels && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>🔍 Discovery Channels</h3>
              <div style={styles.tags}>
                {profile.discoveryChannels.map((c, i) => (
                  <span key={i} style={{ ...styles.tag, ...styles.channelTag }}>
                    🔍 {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Daily Routine */}
          {hasRoutine && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>⏰ Daily Routine</h3>
              <div style={styles.routine}>
                {profile.dailyRoutine.morning && (
                  <div style={styles.routineItem}>
                    <span style={styles.routineLabel}>🌅 Morning</span>
                    <span style={styles.routineValue}>{profile.dailyRoutine.morning}</span>
                  </div>
                )}
                {profile.dailyRoutine.commute && (
                  <div style={styles.routineItem}>
                    <span style={styles.routineLabel}>🚗 Commute</span>
                    <span style={styles.routineValue}>{profile.dailyRoutine.commute}</span>
                  </div>
                )}
                {profile.dailyRoutine.evening && (
                  <div style={styles.routineItem}>
                    <span style={styles.routineLabel}>🌙 Evening</span>
                    <span style={styles.routineValue}>{profile.dailyRoutine.evening}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
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
  sections: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  section: {
    paddingBottom: '12px',
    borderBottom: '1px solid #e2e8f0'
  },
  sectionTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#475569',
    marginBottom: '8px'
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px'
  },
  tag: {
    fontSize: '11px',
    padding: '4px 8px',
    borderRadius: '12px',
    whiteSpace: 'nowrap'
  },
  podcastTag: { background: '#dbeafe', color: '#1d4ed8' },
  newsletterTag: { background: '#dcfce7', color: '#166534' },
  socialTag: { background: '#fce7f3', color: '#9d174d' },
  pubTag: { background: '#fed7aa', color: '#9a3412' },
  youtubeTag: { background: '#fee2e2', color: '#b91c1c' },
  influencerTag: { background: '#fef3c7', color: '#92400e' },
  networkTag: { background: '#e0e7ff', color: '#4338ca' },
  touchpointTag: { background: '#f3e8ff', color: '#7e22ce' },
  sourceTag: { background: '#ccfbf1', color: '#115e59' },
  channelTag: { background: '#f1f5f9', color: '#475569' },
  routine: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  routineItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px'
  },
  routineLabel: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#64748b',
    width: '80px',
    flexShrink: 0
  },
  routineValue: {
    fontSize: '12px',
    color: '#475569',
    lineHeight: 1.4
  }
};
