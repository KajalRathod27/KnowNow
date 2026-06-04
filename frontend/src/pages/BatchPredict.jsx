// import React, { useState } from 'react'
// import { predictBatch } from '../api'

// export default function BatchPredict() {
//   const [inputs, setInputs] = useState(['', ''])
//   const [results, setResults] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError]   = useState(null)

//   const addRow = () => setInputs(i => [...i, ''])
//   const removeRow = idx => setInputs(i => i.filter((_, j) => j !== idx))
//   const updateRow = (idx, val) => setInputs(i => i.map((v, j) => j === idx ? val : v))

//   const handleSubmit = async () => {
//     const texts = inputs.filter(t => t.trim())
//     if (!texts.length) return
//     setLoading(true)
//     setError(null)
//     setResults([])
//     try {
//       const { data } = await predictBatch(texts)
//       setResults(data.results)
//     } catch (e) {
//       setError(e.response?.data?.detail || 'API error')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fakeCount = results.filter(r => r.prediction === 'FAKE').length
//   const realCount = results.filter(r => r.prediction === 'REAL').length

//   return (
//     <div style={{ maxWidth: 820, margin: '0 auto' }}>
//       <div style={styles.hero} className="animate-up">
//         <div style={styles.eyebrow}>Batch Analysis</div>
//         <h1 style={styles.title}>Analyse multiple articles at once</h1>
//         <p style={styles.sub}>Add up to 20 articles or headlines. All are analysed in a single API call.</p>
//       </div>

//       {/* Input rows */}
//       <div style={styles.inputsWrap}>
//         {inputs.map((val, idx) => (
//           <div key={idx} style={styles.inputRow}>
//             <span style={styles.rowNum}>{String(idx + 1).padStart(2, '0')}</span>
//             <input
//               style={styles.rowInput}
//               value={val}
//               onChange={e => updateRow(idx, e.target.value)}
//               placeholder={`Article or headline ${idx + 1}…`}
//             />
//             {inputs.length > 1 && (
//               <button style={styles.removeBtn} onClick={() => removeRow(idx)}>✕</button>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Actions */}
//       <div style={styles.actions}>
//         <button style={styles.addBtn} onClick={addRow} disabled={inputs.length >= 20}>
//           + Add row
//         </button>
//         <div style={{ display: 'flex', gap: 8 }}>
//           <button style={styles.clearBtn} onClick={() => { setInputs(['', '']); setResults([]) }}>
//             Reset
//           </button>
//           <button
//             style={{
//               ...styles.analyseBtn,
//               opacity: loading ? 0.6 : 1,
//               cursor: loading ? 'not-allowed' : 'pointer'
//             }}
//             onClick={handleSubmit}
//             disabled={loading}
//           >
//             {loading ? 'Analysing…' : `Analyse ${inputs.filter(t => t.trim()).length} articles →`}
//           </button>
//         </div>
//       </div>

//       {error && <div style={styles.error}>{error}</div>}

//       {/* Results */}
//       {results.length > 0 && (
//         <div style={styles.resultsWrap} className="animate-up">
//           {/* Summary */}
//           <div style={styles.summary}>
//             <div style={styles.summaryCard}>
//               <div style={styles.summaryNum}>{results.length}</div>
//               <div style={styles.summaryLabel}>Total analysed</div>
//             </div>
//             <div style={{ ...styles.summaryCard, borderColor: 'rgba(255,69,96,0.3)' }}>
//               <div style={{ ...styles.summaryNum, color: 'var(--fake)' }}>{fakeCount}</div>
//               <div style={styles.summaryLabel}>Fake detected</div>
//             </div>
//             <div style={{ ...styles.summaryCard, borderColor: 'rgba(0,230,118,0.3)' }}>
//               <div style={{ ...styles.summaryNum, color: 'var(--real)' }}>{realCount}</div>
//               <div style={styles.summaryLabel}>Real detected</div>
//             </div>
//             <div style={styles.summaryCard}>
//               <div style={styles.summaryNum}>
//                 {results.length ? Math.round(results.reduce((a, r) => a + r.confidence, 0) / results.length * 100) : 0}%
//               </div>
//               <div style={styles.summaryLabel}>Avg confidence</div>
//             </div>
//           </div>

//           {/* Result rows */}
//           <div style={styles.resultList}>
//             {results.map((r, i) => {
//               const isFake = r.prediction === 'FAKE'
//               return (
//                 <div key={i} style={{
//                   ...styles.resultRow,
//                   borderLeft: `3px solid ${isFake ? 'var(--fake)' : 'var(--real)'}`,
//                 }}>
//                   <span style={styles.resultIdx}>{String(i + 1).padStart(2, '0')}</span>
//                   <span style={styles.resultText}>{r.text}</span>
//                   <div style={styles.resultRight}>
//                     <span style={{
//                       ...styles.resultBadge,
//                       background: isFake ? 'rgba(255,69,96,0.12)' : 'rgba(0,230,118,0.12)',
//                       color: isFake ? 'var(--fake)' : 'var(--real)',
//                       border: `1px solid ${isFake ? 'rgba(255,69,96,0.3)' : 'rgba(0,230,118,0.3)'}`,
//                     }}>{r.prediction}</span>
//                     <span style={styles.resultConf}>{Math.round(r.confidence * 100)}%</span>
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// const styles = {
//   hero: { marginBottom: 28 },
//   eyebrow: {
//     fontFamily: 'var(--font-mono)',
//     fontSize: 11,
//     color: 'var(--accent)',
//     textTransform: 'uppercase',
//     letterSpacing: '0.15em',
//     marginBottom: 10,
//   },
//   title: {
//     fontFamily: 'var(--font-head)',
//     fontWeight: 800,
//     fontSize: 30,
//     letterSpacing: '-1px',
//     color: 'var(--text)',
//     marginBottom: 10,
//   },
//   sub: { fontSize: 14, color: 'var(--text2)', lineHeight: 1.6 },
//   inputsWrap: { display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 },
//   inputRow: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: 10,
//     background: 'var(--bg2)',
//     border: '1px solid var(--border)',
//     borderRadius: 10,
//     padding: '8px 12px',
//   },
//   rowNum: {
//     fontFamily: 'var(--font-mono)',
//     fontSize: 11,
//     color: 'var(--text3)',
//     minWidth: 22,
//   },
//   rowInput: {
//     flex: 1,
//     background: 'transparent',
//     border: 'none',
//     outline: 'none',
//     color: 'var(--text)',
//     fontSize: 14,
//     lineHeight: 1.5,
//   },
//   removeBtn: {
//     background: 'transparent',
//     border: 'none',
//     color: 'var(--text3)',
//     cursor: 'pointer',
//     fontSize: 12,
//     padding: '2px 6px',
//     borderRadius: 4,
//   },
//   actions: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   addBtn: {
//     fontFamily: 'var(--font-mono)',
//     fontSize: 12,
//     color: 'var(--accent)',
//     background: 'rgba(0,229,255,0.06)',
//     border: '1px solid rgba(0,229,255,0.2)',
//     borderRadius: 8,
//     padding: '8px 16px',
//     cursor: 'pointer',
//   },
//   clearBtn: {
//     fontFamily: 'var(--font-mono)',
//     fontSize: 12,
//     color: 'var(--text3)',
//     background: 'transparent',
//     border: '1px solid var(--border)',
//     borderRadius: 8,
//     padding: '8px 14px',
//     cursor: 'pointer',
//   },
//   analyseBtn: {
//     fontFamily: 'var(--font-head)',
//     fontWeight: 700,
//     fontSize: 13,
//     color: '#000',
//     background: 'var(--accent)',
//     border: 'none',
//     borderRadius: 8,
//     padding: '9px 20px',
//     boxShadow: '0 0 20px rgba(0,229,255,0.3)',
//   },
//   error: {
//     marginBottom: 20,
//     padding: '12px 16px',
//     background: 'rgba(255,69,96,0.08)',
//     border: '1px solid rgba(255,69,96,0.25)',
//     borderRadius: 10,
//     fontFamily: 'var(--font-mono)',
//     fontSize: 12,
//     color: 'var(--fake)',
//   },
//   resultsWrap: { marginTop: 8 },
//   summary: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(4, 1fr)',
//     gap: 12,
//     marginBottom: 20,
//   },
//   summaryCard: {
//     background: 'var(--bg2)',
//     border: '1px solid var(--border)',
//     borderRadius: 12,
//     padding: '16px 20px',
//     textAlign: 'center',
//   },
//   summaryNum: {
//     fontFamily: 'var(--font-head)',
//     fontWeight: 800,
//     fontSize: 28,
//     color: 'var(--text)',
//     letterSpacing: '-1px',
//   },
//   summaryLabel: {
//     fontFamily: 'var(--font-mono)',
//     fontSize: 10,
//     color: 'var(--text3)',
//     textTransform: 'uppercase',
//     letterSpacing: '0.08em',
//     marginTop: 4,
//   },
//   resultList: { display: 'flex', flexDirection: 'column', gap: 6 },
//   resultRow: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: 14,
//     background: 'var(--bg2)',
//     border: '1px solid var(--border)',
//     borderRadius: 10,
//     padding: '12px 16px',
//     paddingLeft: 14,
//   },
//   resultIdx: {
//     fontFamily: 'var(--font-mono)',
//     fontSize: 11,
//     color: 'var(--text3)',
//     minWidth: 22,
//     flexShrink: 0,
//   },
//   resultText: {
//     flex: 1,
//     fontSize: 13,
//     color: 'var(--text2)',
//     overflow: 'hidden',
//     textOverflow: 'ellipsis',
//     whiteSpace: 'nowrap',
//   },
//   resultRight: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: 10,
//     flexShrink: 0,
//   },
//   resultBadge: {
//     fontFamily: 'var(--font-mono)',
//     fontSize: 10,
//     fontWeight: 500,
//     padding: '3px 9px',
//     borderRadius: 6,
//     letterSpacing: '0.05em',
//   },
//   resultConf: {
//     fontFamily: 'var(--font-mono)',
//     fontSize: 12,
//     color: 'var(--text3)',
//     minWidth: 34,
//     textAlign: 'right',
//   },
// }

import React, { useState, useEffect } from 'react'
import { predictBatch } from '../api'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}

export default function BatchPredict() {
  const [inputs, setInputs]   = useState(['', ''])
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const isMobile = useIsMobile()

  const addRow    = () => setInputs(i => [...i, ''])
  const removeRow = idx => setInputs(i => i.filter((_, j) => j !== idx))
  const updateRow = (idx, val) => setInputs(i => i.map((v, j) => j === idx ? val : v))

  const handleSubmit = async () => {
    const texts = inputs.filter(t => t.trim())
    if (!texts.length) return
    setLoading(true)
    setError(null)
    setResults([])
    try {
      const { data } = await predictBatch(texts)
      setResults(data.results)
    } catch (e) {
      setError(e.response?.data?.detail || 'API error')
    } finally {
      setLoading(false)
    }
  }

  const fakeCount = results.filter(r => r.prediction === 'FAKE').length
  const realCount = results.filter(r => r.prediction === 'REAL').length

  return (
    <div style={{ maxWidth: 820, margin: '0 auto' }}>
      <div style={styles.hero} className="animate-up">
        <div style={styles.eyebrow}>Batch Analysis</div>
        <h1 style={{
          ...styles.title,
          fontSize: isMobile ? 22 : 30,
        }}>
          Analyse multiple articles at once
        </h1>
        <p style={styles.sub}>Add up to 20 articles or headlines. All are analysed in a single API call.</p>
      </div>

      {/* Input rows */}
      <div style={styles.inputsWrap}>
        {inputs.map((val, idx) => (
          <div key={idx} style={styles.inputRow}>
            <span style={styles.rowNum}>{String(idx + 1).padStart(2, '0')}</span>
            <input
              style={styles.rowInput}
              value={val}
              onChange={e => updateRow(idx, e.target.value)}
              placeholder={`Article or headline ${idx + 1}…`}
            />
            {inputs.length > 1 && (
              <button style={styles.removeBtn} onClick={() => removeRow(idx)}>✕</button>
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{
        ...styles.actions,
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : 'center',
        gap: isMobile ? 8 : 0,
      }}>
        <button style={styles.addBtn} onClick={addRow} disabled={inputs.length >= 20}>
          + Add row
        </button>
        <div style={{
          display: 'flex',
          gap: 8,
          justifyContent: isMobile ? 'flex-end' : 'flex-end',
        }}>
          <button style={styles.clearBtn} onClick={() => { setInputs(['', '']); setResults([]) }}>
            Reset
          </button>
          <button
            style={{
              ...styles.analyseBtn,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
              flex: isMobile ? 1 : 'unset',
            }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Analysing…' : `Analyse ${inputs.filter(t => t.trim()).length} →`}
          </button>
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {/* Results */}
      {results.length > 0 && (
        <div style={styles.resultsWrap} className="animate-up">
          {/* Summary */}
          <div style={{
            ...styles.summary,
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          }}>
            <div style={styles.summaryCard}>
              <div style={styles.summaryNum}>{results.length}</div>
              <div style={styles.summaryLabel}>Total analysed</div>
            </div>
            <div style={{ ...styles.summaryCard, borderColor: 'rgba(255,69,96,0.3)' }}>
              <div style={{ ...styles.summaryNum, color: 'var(--fake)' }}>{fakeCount}</div>
              <div style={styles.summaryLabel}>Fake detected</div>
            </div>
            <div style={{ ...styles.summaryCard, borderColor: 'rgba(0,230,118,0.3)' }}>
              <div style={{ ...styles.summaryNum, color: 'var(--real)' }}>{realCount}</div>
              <div style={styles.summaryLabel}>Real detected</div>
            </div>
            <div style={styles.summaryCard}>
              <div style={styles.summaryNum}>
                {results.length ? Math.round(results.reduce((a, r) => a + r.confidence, 0) / results.length * 100) : 0}%
              </div>
              <div style={styles.summaryLabel}>Avg confidence</div>
            </div>
          </div>

          {/* Result rows */}
          <div style={styles.resultList}>
            {results.map((r, i) => {
              const isFake = r.prediction === 'FAKE'
              return (
                <div key={i} style={{
                  ...styles.resultRow,
                  borderLeft: `3px solid ${isFake ? 'var(--fake)' : 'var(--real)'}`,
                }}>
                  <span style={styles.resultIdx}>{String(i + 1).padStart(2, '0')}</span>
                  <span style={{
                    ...styles.resultText,
                    maxWidth: isMobile ? 120 : 'none',
                  }}>{r.text}</span>
                  <div style={styles.resultRight}>
                    <span style={{
                      ...styles.resultBadge,
                      background: isFake ? 'rgba(255,69,96,0.12)' : 'rgba(0,230,118,0.12)',
                      color: isFake ? 'var(--fake)' : 'var(--real)',
                      border: `1px solid ${isFake ? 'rgba(255,69,96,0.3)' : 'rgba(0,230,118,0.3)'}`,
                    }}>{r.prediction}</span>
                    <span style={styles.resultConf}>{Math.round(r.confidence * 100)}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  hero: { marginBottom: 24 },
  eyebrow: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--accent)',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    marginBottom: 10,
  },
  title: {
    fontFamily: 'var(--font-head)',
    fontWeight: 800,
    letterSpacing: '-1px',
    color: 'var(--text)',
    marginBottom: 10,
  },
  sub: { fontSize: 14, color: 'var(--text2)', lineHeight: 1.6 },
  inputsWrap: { display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 },
  inputRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '8px 12px',
  },
  rowNum: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--text3)',
    minWidth: 22,
    flexShrink: 0,
  },
  rowInput: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'var(--text)',
    fontSize: 14,
    lineHeight: 1.5,
    minWidth: 0,
  },
  removeBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text3)',
    cursor: 'pointer',
    fontSize: 12,
    padding: '2px 6px',
    borderRadius: 4,
    flexShrink: 0,
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  addBtn: {
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    color: 'var(--accent)',
    background: 'rgba(0,229,255,0.06)',
    border: '1px solid rgba(0,229,255,0.2)',
    borderRadius: 8,
    padding: '8px 16px',
    cursor: 'pointer',
  },
  clearBtn: {
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    color: 'var(--text3)',
    background: 'transparent',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '8px 14px',
    cursor: 'pointer',
  },
  analyseBtn: {
    fontFamily: 'var(--font-head)',
    fontWeight: 700,
    fontSize: 13,
    color: '#000',
    background: 'var(--accent)',
    border: 'none',
    borderRadius: 8,
    padding: '9px 20px',
    boxShadow: '0 0 20px rgba(0,229,255,0.3)',
  },
  error: {
    marginBottom: 20,
    padding: '12px 16px',
    background: 'rgba(255,69,96,0.08)',
    border: '1px solid rgba(255,69,96,0.25)',
    borderRadius: 10,
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    color: 'var(--fake)',
  },
  resultsWrap: { marginTop: 8 },
  summary: {
    display: 'grid',
    gap: 10,
    marginBottom: 20,
  },
  summaryCard: {
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: '14px 16px',
    textAlign: 'center',
  },
  summaryNum: {
    fontFamily: 'var(--font-head)',
    fontWeight: 800,
    fontSize: 26,
    color: 'var(--text)',
    letterSpacing: '-1px',
  },
  summaryLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    color: 'var(--text3)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginTop: 4,
  },
  resultList: { display: 'flex', flexDirection: 'column', gap: 6 },
  resultRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '12px 14px',
    paddingLeft: 12,
  },
  resultIdx: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--text3)',
    minWidth: 22,
    flexShrink: 0,
  },
  resultText: {
    flex: 1,
    fontSize: 13,
    color: 'var(--text2)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  resultRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  resultBadge: {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    fontWeight: 500,
    padding: '3px 9px',
    borderRadius: 6,
    letterSpacing: '0.05em',
  },
  resultConf: {
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    color: 'var(--text3)',
    minWidth: 34,
    textAlign: 'right',
  },
}