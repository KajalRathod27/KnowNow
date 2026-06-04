// import React from 'react'

// export default function ResultCard({ result, text }) {
//   if (!result) return null
//   const isFake = result.prediction === 'FAKE'
//   const pct = Math.round(result.confidence * 100)

//   return (
//     <div style={{
//       ...styles.card,
//       borderColor: isFake ? 'rgba(255,69,96,0.35)' : 'rgba(0,230,118,0.35)',
//       boxShadow: isFake ? 'var(--glow-fake)' : 'var(--glow-real)',
//       animation: isFake ? 'pulse-fake 2.5s ease infinite' : 'pulse-real 2.5s ease infinite',
//     }}>
//       {/* Verdict */}
//       <div style={styles.verdictRow}>
//         <div style={styles.verdictLeft}>
//           <div style={{
//             ...styles.verdictBadge,
//             background: isFake ? 'rgba(255,69,96,0.12)' : 'rgba(0,230,118,0.12)',
//             border: `1px solid ${isFake ? 'rgba(255,69,96,0.4)' : 'rgba(0,230,118,0.4)'}`,
//           }}>
//             <span style={{ fontSize: 22 }}>{isFake ? '⚠' : '✓'}</span>
//             <span style={{
//               fontFamily: 'var(--font-head)',
//               fontWeight: 800,
//               fontSize: 28,
//               color: isFake ? 'var(--fake)' : 'var(--real)',
//               letterSpacing: '-1px',
//             }}>{result.prediction}</span>
//           </div>
//           <div style={styles.verdictSub}>
//             {isFake
//               ? 'This article shows signs of misinformation'
//               : 'This article appears to be credible news'}
//           </div>
//         </div>

//         {/* Confidence meter */}
//         <div style={styles.meterWrap}>
//           <svg width="90" height="90" viewBox="0 0 90 90">
//             <circle cx="45" cy="45" r="36" fill="none" stroke="var(--bg3)" strokeWidth="8" />
//             <circle
//               cx="45" cy="45" r="36"
//               fill="none"
//               stroke={isFake ? 'var(--fake)' : 'var(--real)'}
//               strokeWidth="8"
//               strokeLinecap="round"
//               strokeDasharray={`${2 * Math.PI * 36 * pct / 100} ${2 * Math.PI * 36}`}
//               strokeDashoffset={2 * Math.PI * 36 * 0.25}
//               style={{ transition: 'stroke-dasharray 1s ease', filter: `drop-shadow(0 0 6px ${isFake ? 'var(--fake)' : 'var(--real)'})` }}
//             />
//             <text x="45" y="41" textAnchor="middle" fill={isFake ? 'var(--fake)' : 'var(--real)'}
//               style={{ fontFamily: 'var(--font-head)', fontSize: 18, fontWeight: 800 }}>
//               {pct}%
//             </text>
//             <text x="45" y="57" textAnchor="middle" fill="var(--text3)"
//               style={{ fontFamily: 'var(--font-mono)', fontSize: 9 }}>
//               confidence
//             </text>
//           </svg>
//         </div>
//       </div>

//       {/* Stats row */}
//       <div style={styles.statsRow}>
//         {[
//           { label: 'Label code', value: result.label === 0 ? '0 (FAKE)' : '1 (REAL)' },
//           { label: 'Confidence', value: `${result.confidence}` },
//           { label: 'Model', value: 'LR + TF-IDF' },
//         ].map(({ label, value }) => (
//           <div key={label} style={styles.stat}>
//             <div style={styles.statLabel}>{label}</div>
//             <div style={styles.statValue}>{value}</div>
//           </div>
//         ))}
//       </div>

//       {/* Text snippet */}
//       {text && (
//         <div style={styles.snippet}>
//           <div style={styles.snippetLabel}>Analysed text</div>
//           <div style={styles.snippetText}>
//             "{text.length > 180 ? text.slice(0, 180) + '…' : text}"
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// const styles = {
//   card: {
//     background: 'var(--bg2)',
//     border: '1px solid',
//     borderRadius: 'var(--radius)',
//     padding: 28,
//     marginTop: 24,
//     animation: 'fadeUp 0.4s ease both',
//   },
//   verdictRow: {
//     display: 'flex',
//     alignItems: 'flex-start',
//     justifyContent: 'space-between',
//     gap: 20,
//     marginBottom: 24,
//   },
//   verdictLeft: { flex: 1 },
//   verdictBadge: {
//     display: 'inline-flex',
//     alignItems: 'center',
//     gap: 10,
//     borderRadius: 10,
//     padding: '10px 20px',
//     marginBottom: 10,
//   },
//   verdictSub: {
//     fontSize: 13,
//     color: 'var(--text2)',
//     lineHeight: 1.5,
//     maxWidth: 340,
//   },
//   meterWrap: { flexShrink: 0 },
//   statsRow: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(3, 1fr)',
//     gap: 12,
//     marginBottom: 20,
//   },
//   stat: {
//     background: 'var(--bg3)',
//     borderRadius: 10,
//     padding: '12px 16px',
//     border: '1px solid var(--border)',
//   },
//   statLabel: {
//     fontFamily: 'var(--font-mono)',
//     fontSize: 10,
//     color: 'var(--text3)',
//     textTransform: 'uppercase',
//     letterSpacing: '0.08em',
//     marginBottom: 4,
//   },
//   statValue: {
//     fontFamily: 'var(--font-mono)',
//     fontSize: 13,
//     color: 'var(--text)',
//   },
//   snippet: {
//     background: 'var(--bg3)',
//     borderRadius: 10,
//     padding: '14px 16px',
//     border: '1px solid var(--border)',
//   },
//   snippetLabel: {
//     fontFamily: 'var(--font-mono)',
//     fontSize: 10,
//     color: 'var(--text3)',
//     textTransform: 'uppercase',
//     letterSpacing: '0.08em',
//     marginBottom: 6,
//   },
//   snippetText: {
//     fontSize: 13,
//     color: 'var(--text2)',
//     lineHeight: 1.6,
//     fontStyle: 'italic',
//   },
// }

import React, { useEffect, useState } from 'react'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 520)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 520)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}

export default function ResultCard({ result, text }) {
  const isMobile = useIsMobile()
  if (!result) return null
  const isFake = result.prediction === 'FAKE'
  const pct = Math.round(result.confidence * 100)

  return (
    <div style={{
      ...styles.card,
      borderColor: isFake ? 'rgba(255,69,96,0.35)' : 'rgba(0,230,118,0.35)',
      boxShadow: isFake ? 'var(--glow-fake)' : 'var(--glow-real)',
      animation: isFake ? 'pulse-fake 2.5s ease infinite' : 'pulse-real 2.5s ease infinite',
    }}>
      {/* Verdict */}
      <div style={{
        ...styles.verdictRow,
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'flex-start',
      }}>
        <div style={styles.verdictLeft}>
          <div style={{
            ...styles.verdictBadge,
            background: isFake ? 'rgba(255,69,96,0.12)' : 'rgba(0,230,118,0.12)',
            border: `1px solid ${isFake ? 'rgba(255,69,96,0.4)' : 'rgba(0,230,118,0.4)'}`,
          }}>
            <span style={{ fontSize: isMobile ? 18 : 22 }}>{isFake ? '⚠' : '✓'}</span>
            <span style={{
              fontFamily: 'var(--font-head)',
              fontWeight: 800,
              fontSize: isMobile ? 22 : 28,
              color: isFake ? 'var(--fake)' : 'var(--real)',
              letterSpacing: '-1px',
            }}>{result.prediction}</span>
          </div>
          <div style={styles.verdictSub}>
            {isFake
              ? 'This article shows signs of misinformation'
              : 'This article appears to be credible news'}
          </div>
        </div>

        {/* Confidence meter */}
        <div style={{
          ...styles.meterWrap,
          alignSelf: isMobile ? 'center' : 'flex-start',
          marginTop: isMobile ? 12 : 0,
        }}>
          <svg width={isMobile ? 72 : 90} height={isMobile ? 72 : 90} viewBox="0 0 90 90">
            <circle cx="45" cy="45" r="36" fill="none" stroke="var(--bg3)" strokeWidth="8" />
            <circle
              cx="45" cy="45" r="36"
              fill="none"
              stroke={isFake ? 'var(--fake)' : 'var(--real)'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 36 * pct / 100} ${2 * Math.PI * 36}`}
              strokeDashoffset={2 * Math.PI * 36 * 0.25}
              style={{ transition: 'stroke-dasharray 1s ease', filter: `drop-shadow(0 0 6px ${isFake ? 'var(--fake)' : 'var(--real)'})` }}
            />
            <text x="45" y="41" textAnchor="middle" fill={isFake ? 'var(--fake)' : 'var(--real)'}
              style={{ fontFamily: 'var(--font-head)', fontSize: 18, fontWeight: 800 }}>
              {pct}%
            </text>
            <text x="45" y="57" textAnchor="middle" fill="var(--text3)"
              style={{ fontFamily: 'var(--font-mono)', fontSize: 9 }}>
              confidence
            </text>
          </svg>
        </div>
      </div>

      {/* Stats row */}
      <div style={{
        ...styles.statsRow,
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
      }}>
        {[
          { label: 'Label code', value: result.label === 0 ? '0 (FAKE)' : '1 (REAL)' },
          { label: 'Confidence', value: `${result.confidence}` },
          { label: 'Model', value: 'LR + TF-IDF' },
        ].map(({ label, value }) => (
          <div key={label} style={styles.stat}>
            <div style={styles.statLabel}>{label}</div>
            <div style={styles.statValue}>{value}</div>
          </div>
        ))}
      </div>

      {/* Text snippet */}
      {text && (
        <div style={styles.snippet}>
          <div style={styles.snippetLabel}>Analysed text</div>
          <div style={styles.snippetText}>
            "{text.length > 180 ? text.slice(0, 180) + '…' : text}"
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  card: {
    background: 'var(--bg2)',
    border: '1px solid',
    borderRadius: 'var(--radius)',
    padding: 'clamp(16px, 4vw, 28px)',
    marginTop: 24,
    animation: 'fadeUp 0.4s ease both',
  },
  verdictRow: {
    display: 'flex',
    gap: 20,
    marginBottom: 24,
  },
  verdictLeft: { flex: 1 },
  verdictBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    borderRadius: 10,
    padding: '10px 16px',
    marginBottom: 10,
  },
  verdictSub: {
    fontSize: 13,
    color: 'var(--text2)',
    lineHeight: 1.5,
    maxWidth: 340,
  },
  meterWrap: { flexShrink: 0 },
  statsRow: {
    display: 'grid',
    gap: 10,
    marginBottom: 20,
  },
  stat: {
    background: 'var(--bg3)',
    borderRadius: 10,
    padding: '12px 14px',
    border: '1px solid var(--border)',
  },
  statLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    color: 'var(--text3)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 4,
  },
  statValue: {
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    color: 'var(--text)',
    wordBreak: 'break-all',
  },
  snippet: {
    background: 'var(--bg3)',
    borderRadius: 10,
    padding: '14px 16px',
    border: '1px solid var(--border)',
  },
  snippetLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    color: 'var(--text3)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 6,
  },
  snippetText: {
    fontSize: 13,
    color: 'var(--text2)',
    lineHeight: 1.6,
    fontStyle: 'italic',
  },
}