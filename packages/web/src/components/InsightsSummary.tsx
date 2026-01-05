import type { Insight, VerbatimQuote, InsightCategory } from '../types';

interface InsightsSummaryProps {
  insights: Insight[];
  quotes: VerbatimQuote[];
}

const CATEGORY_CONFIG: Record<InsightCategory, { label: string; color: string; bg: string }> = {
  struggling_moment: { label: 'Struggle', color: '#dc2626', bg: '#fef2f2' },
  push: { label: 'Push', color: '#ef4444', bg: '#fef2f2' },
  pull: { label: 'Pull', color: '#22c55e', bg: '#f0fdf4' },
  anxiety: { label: 'Anxiety', color: '#f59e0b', bg: '#fffbeb' },
  habit: { label: 'Habit', color: '#8b5cf6', bg: '#faf5ff' },
  diet_media: { label: 'Media', color: '#3b82f6', bg: '#eff6ff' },
  diet_network: { label: 'Network', color: '#6366f1', bg: '#eef2ff' },
  diet_physical: { label: 'Physical', color: '#14b8a6', bg: '#f0fdfa' },
  general: { label: 'General', color: '#64748b', bg: '#f8fafc' }
};

export default function InsightsSummary({ insights, quotes }: InsightsSummaryProps) {
  const isEmpty = insights.length === 0 && quotes.length === 0;

  // Group insights by category
  const groupedInsights = insights.reduce((acc, insight) => {
    if (!acc[insight.category]) {
      acc[insight.category] = [];
    }
    acc[insight.category].push(insight);
    return acc;
  }, {} as Record<InsightCategory, Insight[]>);

  const categories = Object.keys(groupedInsights) as InsightCategory[];

  return (
    <div className="card">
      <h2>Insights & Quotes</h2>

      {isEmpty ? (
        <p style={styles.empty}>
          Key insights and verbatim quotes will appear here as the interview progresses.
        </p>
      ) : (
        <div style={styles.content}>
          {/* Verbatim quotes */}
          {quotes.length > 0 && (
            <div style={styles.quotesSection}>
              <h3 style={styles.sectionTitle}>💬 Verbatim Quotes</h3>
              <div style={styles.quotes}>
                {quotes.slice(0, 5).map((quote, i) => (
                  <blockquote key={i} style={styles.quote}>
                    <p style={styles.quoteText}>"{quote.quote}"</p>
                    <cite style={styles.quoteCite}>
                      <span
                        className={`badge badge-${quote.category.split('_')[0]}`}
                        style={{
                          background: CATEGORY_CONFIG[quote.category].bg,
                          color: CATEGORY_CONFIG[quote.category].color
                        }}
                      >
                        {CATEGORY_CONFIG[quote.category].label}
                      </span>
                    </cite>
                  </blockquote>
                ))}
              </div>
            </div>
          )}

          {/* Categorized insights */}
          {categories.length > 0 && (
            <div style={styles.insightsSection}>
              <h3 style={styles.sectionTitle}>🎯 Key Insights</h3>
              {categories.map(category => {
                const config = CATEGORY_CONFIG[category];
                const categoryInsights = groupedInsights[category];

                return (
                  <div key={category} style={styles.categorySection}>
                    <div
                      style={{
                        ...styles.categoryHeader,
                        background: config.bg,
                        borderLeftColor: config.color
                      }}
                    >
                      <span style={{ color: config.color, fontWeight: 600 }}>
                        {config.label}
                      </span>
                      <span style={styles.count}>{categoryInsights.length}</span>
                    </div>
                    <ul style={styles.insightList}>
                      {categoryInsights.slice(0, 3).map(insight => (
                        <li key={insight.id} style={styles.insightItem}>
                          {insight.isVerbatim && <span style={styles.verbatimBadge}>Q</span>}
                          {insight.content}
                        </li>
                      ))}
                      {categoryInsights.length > 3 && (
                        <li style={styles.moreCount}>
                          +{categoryInsights.length - 3} more
                        </li>
                      )}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}

          {/* Summary stats */}
          <div style={styles.stats}>
            <div style={styles.stat}>
              <span style={styles.statValue}>{insights.length}</span>
              <span style={styles.statLabel}>Insights</span>
            </div>
            <div style={styles.stat}>
              <span style={styles.statValue}>{quotes.length}</span>
              <span style={styles.statLabel}>Quotes</span>
            </div>
            <div style={styles.stat}>
              <span style={styles.statValue}>{categories.length}</span>
              <span style={styles.statLabel}>Categories</span>
            </div>
          </div>
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
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  quotesSection: {
    paddingBottom: '12px',
    borderBottom: '1px solid #e2e8f0'
  },
  sectionTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#475569',
    marginBottom: '10px'
  },
  quotes: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  quote: {
    margin: 0,
    padding: '10px 12px',
    background: '#f8fafc',
    borderRadius: '8px',
    borderLeft: '3px solid #3b82f6'
  },
  quoteText: {
    fontSize: '13px',
    color: '#1e293b',
    fontStyle: 'italic',
    margin: '0 0 6px 0',
    lineHeight: 1.5
  },
  quoteCite: {
    display: 'block',
    textAlign: 'right'
  },
  insightsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  categorySection: {
    marginBottom: '8px'
  },
  categoryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 10px',
    borderRadius: '6px',
    borderLeft: '3px solid',
    fontSize: '12px'
  },
  count: {
    fontSize: '11px',
    color: '#94a3b8'
  },
  insightList: {
    listStyle: 'none',
    margin: '6px 0 0 0',
    padding: '0 0 0 14px'
  },
  insightItem: {
    fontSize: '12px',
    color: '#475569',
    padding: '3px 0',
    lineHeight: 1.4,
    display: 'flex',
    alignItems: 'flex-start',
    gap: '6px'
  },
  verbatimBadge: {
    fontSize: '9px',
    fontWeight: 700,
    color: '#3b82f6',
    background: '#dbeafe',
    padding: '1px 4px',
    borderRadius: '3px',
    flexShrink: 0
  },
  moreCount: {
    fontSize: '11px',
    color: '#94a3b8',
    fontStyle: 'italic',
    padding: '3px 0'
  },
  stats: {
    display: 'flex',
    justifyContent: 'space-around',
    paddingTop: '12px',
    borderTop: '1px solid #e2e8f0'
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  statValue: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#1e293b'
  },
  statLabel: {
    fontSize: '11px',
    color: '#94a3b8'
  }
};
