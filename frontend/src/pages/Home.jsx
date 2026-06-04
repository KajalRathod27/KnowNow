// import React, { useState } from 'react'
// import { predictSingle } from '../api'
// import ResultCard from '../components/ResultCard'

// const SAMPLES = [
//   { label: 'Fake example', text: 'SHOCKING: Government secretly implanting microchips in COVID vaccines, whistleblower reveals bombshell truth that mainstream media refuses to cover!' },
//   { label: 'Real example',  text: 'The Federal Reserve raised its benchmark interest rate by a quarter percentage point on Wednesday, as policymakers continued their efforts to bring inflation back to the 2% target.' },
//   { label: 'Fake example 2', text: 'BREAKING: Scientists discover that the moon is actually a giant hologram projected by the Illuminati to control human consciousness — NASA cover-up exposed!' },
// ]

// export default function Home() {
//   const [text, setText]     = useState('')
//   const [result, setResult] = useState(null)
//   const [loading, setLoading] = useState(false)
//   const [error, setError]   = useState(null)
//   const [history, setHistory] = useState([])

//   const handlePredict = async () => {
//     if (!text.trim()) return
//     setLoading(true)
//     setError(null)
//     setResult(null)
//     try {
//       const { data } = await predictSingle(text)
//       setResult(data)
//       setHistory(h => [{ text, ...data, id: Date.now() }, ...h].slice(0, 5))
//     } catch (e) {
//       setError(e.response?.data?.detail || 'API error — is the backend running?')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div style={{ maxWidth: 760, margin: '0 auto' }}>
//       {/* Hero */}
//       <div style={styles.hero} className="animate-up">
//         <div style={styles.heroEyebrow}>Single Article Detection</div>
//         <h1 style={styles.heroTitle}>Is this news real<br />or fabricated?</h1>
//         <p style={styles.heroSub}>
//           Paste any news article or headline below. Our TF-IDF + Logistic Regression
//           model trained on 44K articles will analyse it instantly.
//         </p>
//       </div>

//       {/* Sample buttons */}
//       <div style={styles.samples}>
//         <span style={styles.samplesLabel}>Try a sample:</span>
//         {SAMPLES.map((s, i) => (
//           <button key={i} style={{
//             ...styles.sampleBtn,
//             borderColor: s.label.includes('Fake') ? 'rgba(255,69,96,0.3)' : 'rgba(0,230,118,0.3)',
//             color: s.label.includes('Fake') ? 'var(--fake)' : 'var(--real)',
//           }} onClick={() => setText(s.text)}>
//             {s.label}
//           </button>
//         ))}
//       </div>

//       {/* Input area */}
//       <div style={styles.inputWrap}>
//         <textarea
//           style={styles.textarea}
//           value={text}
//           onChange={e => setText(e.target.value)}
//           placeholder="Paste a news article, headline, or any text here…"
//           rows={6}
//           onKeyDown={e => { if (e.ctrlKey && e.key === 'Enter') handlePredict() }}
//         />
//         <div style={styles.inputFooter}>
//           <span style={styles.charCount}>{text.length} chars · Ctrl+Enter to analyse</span>
//           <div style={{ display: 'flex', gap: 8 }}>
//             {text && (
//               <button style={styles.clearBtn} onClick={() => { setText(''); setResult(null) }}>
//                 Clear
//               </button>
//             )}
//             <button
//               style={{
//                 ...styles.analyseBtn,
//                 opacity: (!text.trim() || loading) ? 0.5 : 1,
//                 cursor: (!text.trim() || loading) ? 'not-allowed' : 'pointer',
//               }}
//               onClick={handlePredict}
//               disabled={!text.trim() || loading}
//             >
//               {loading ? (
//                 <span style={styles.spinner} />
//               ) : (
//                 <>Analyse →</>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Error */}
//       {error && (
//         <div style={styles.error}>{error}</div>
//       )}

//       {/* Result */}
//       <ResultCard result={result} text={text} />

//       {/* History */}
//       {history.length > 0 && (
//         <div style={styles.historySection}>
//           <div style={styles.sectionTitle}>Recent predictions</div>
//           <div style={styles.historyList}>
//             {history.map(h => (
//               <div key={h.id} style={styles.historyItem}
//                 onClick={() => setText(h.text)}>
//                 <span style={{
//                   ...styles.historyBadge,
//                   background: h.prediction === 'FAKE' ? 'rgba(255,69,96,0.15)' : 'rgba(0,230,118,0.15)',
//                   color: h.prediction === 'FAKE' ? 'var(--fake)' : 'var(--real)',
//                 }}>{h.prediction}</span>
//                 <span style={styles.historyText}>
//                   {h.text.slice(0, 60)}…
//                 </span>
//                 <span style={styles.historyConf}>{Math.round(h.confidence * 100)}%</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// const styles = {
//   hero: { marginBottom: 28 },
//   heroEyebrow: {
//     fontFamily: 'var(--font-mono)',
//     fontSize: 11,
//     color: 'var(--accent)',
//     textTransform: 'uppercase',
//     letterSpacing: '0.15em',
//     marginBottom: 10,
//   },
//   heroTitle: {
//     fontFamily: 'var(--font-head)',
//     fontWeight: 800,
//     fontSize: 36,
//     lineHeight: 1.1,
//     letterSpacing: '-1.5px',
//     color: 'var(--text)',
//     marginBottom: 12,
//   },
//   heroSub: {
//     fontSize: 15,
//     color: 'var(--text2)',
//     lineHeight: 1.7,
//     maxWidth: 560,
//   },
//   samples: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: 8,
//     flexWrap: 'wrap',
//     marginBottom: 16,
//   },
//   samplesLabel: {
//     fontFamily: 'var(--font-mono)',
//     fontSize: 11,
//     color: 'var(--text3)',
//   },
//   sampleBtn: {
//     fontFamily: 'var(--font-mono)',
//     fontSize: 11,
//     padding: '4px 10px',
//     background: 'transparent',
//     border: '1px solid',
//     borderRadius: 6,
//     cursor: 'pointer',
//     transition: 'opacity 0.15s',
//   },
//   inputWrap: {
//     background: 'var(--bg2)',
//     border: '1px solid var(--border2)',
//     borderRadius: 'var(--radius)',
//     overflow: 'hidden',
//     transition: 'border-color 0.2s',
//   },
//   textarea: {
//     width: '100%',
//     background: 'transparent',
//     border: 'none',
//     outline: 'none',
//     color: 'var(--text)',
//     fontSize: 15,
//     lineHeight: 1.7,
//     padding: '20px 24px 12px',
//     resize: 'vertical',
//     minHeight: 140,
//   },
//   inputFooter: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: '10px 16px',
//     borderTop: '1px solid var(--border)',
//     background: 'var(--bg3)',
//   },
//   charCount: {
//     fontFamily: 'var(--font-mono)',
//     fontSize: 11,
//     color: 'var(--text3)',
//   },
//   clearBtn: {
//     fontFamily: 'var(--font-mono)',
//     fontSize: 12,
//     color: 'var(--text3)',
//     background: 'transparent',
//     border: '1px solid var(--border)',
//     borderRadius: 7,
//     padding: '7px 14px',
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
//     padding: '8px 20px',
//     display: 'flex',
//     alignItems: 'center',
//     gap: 6,
//     transition: 'opacity 0.2s',
//     boxShadow: '0 0 20px rgba(0,229,255,0.3)',
//   },
//   spinner: {
//     width: 14,
//     height: 14,
//     border: '2px solid rgba(0,0,0,0.2)',
//     borderTopColor: '#000',
//     borderRadius: '50%',
//     animation: 'spin 0.7s linear infinite',
//     display: 'inline-block',
//   },
//   error: {
//     marginTop: 16,
//     padding: '12px 16px',
//     background: 'rgba(255,69,96,0.08)',
//     border: '1px solid rgba(255,69,96,0.25)',
//     borderRadius: 10,
//     fontFamily: 'var(--font-mono)',
//     fontSize: 12,
//     color: 'var(--fake)',
//   },
//   historySection: { marginTop: 36 },
//   sectionTitle: {
//     fontFamily: 'var(--font-head)',
//     fontWeight: 700,
//     fontSize: 14,
//     color: 'var(--text2)',
//     marginBottom: 12,
//     textTransform: 'uppercase',
//     letterSpacing: '0.05em',
//   },
//   historyList: { display: 'flex', flexDirection: 'column', gap: 6 },
//   historyItem: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: 12,
//     padding: '10px 14px',
//     background: 'var(--bg2)',
//     border: '1px solid var(--border)',
//     borderRadius: 9,
//     cursor: 'pointer',
//     transition: 'border-color 0.15s',
//   },
//   historyBadge: {
//     fontFamily: 'var(--font-mono)',
//     fontSize: 10,
//     fontWeight: 500,
//     padding: '2px 8px',
//     borderRadius: 5,
//     flexShrink: 0,
//     letterSpacing: '0.05em',
//   },
//   historyText: {
//     flex: 1,
//     fontSize: 12,
//     color: 'var(--text2)',
//     overflow: 'hidden',
//     textOverflow: 'ellipsis',
//     whiteSpace: 'nowrap',
//   },
//   historyConf: {
//     fontFamily: 'var(--font-mono)',
//     fontSize: 11,
//     color: 'var(--text3)',
//     flexShrink: 0,
//   },
// }

import React, { useState, useEffect } from 'react'
import { predictSingle } from '../api'
import ResultCard from '../components/ResultCard'

const SAMPLES = [
  { label: 'Fake example', text: 'SHOCKING: Government secretly implanting microchips in COVID vaccines, whistleblower reveals bombshell truth that mainstream media refuses to cover!' },
  { label: 'Real example', text: 'The Federal Reserve raised its benchmark interest rate by a quarter percentage point on Wednesday, as policymakers continued their efforts to bring inflation back to the 2% target.' },
  { label: 'Fake example 2', text: 'BREAKING: Scientists discover that the moon is actually a giant hologram projected by the Illuminati to control human consciousness — NASA cover-up exposed!' },
]

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}

export default function Home() {
  const [text, setText]       = useState('')
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [history, setHistory] = useState([])
  const isMobile = useIsMobile()

  const handlePredict = async () => {
    if (!text.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const { data } = await predictSingle(text)
      setResult(data)
      setHistory(h => [{ text, ...data, id: Date.now() }, ...h].slice(0, 5))
    } catch (e) {
      setError(e.response?.data?.detail || 'API error — is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      {/* Hero */}
      <div style={styles.hero} className="animate-up">
        <div style={styles.heroEyebrow}>Single Article Detection</div>
        <h1 style={{
          ...styles.heroTitle,
          fontSize: isMobile ? 26 : 36,
        }}>
          Is this news real{isMobile ? ' ' : <br />}or fabricated?
        </h1>
        <p style={styles.heroSub}>
          Paste any news article or headline below. Our TF-IDF + Logistic Regression
          model trained on 44K articles will analyse it instantly.
        </p>
      </div>

      {/* Sample buttons */}
      <div style={styles.samples}>
        <span style={styles.samplesLabel}>Try a sample:</span>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {SAMPLES.map((s, i) => (
            <button key={i} style={{
              ...styles.sampleBtn,
              borderColor: s.label.includes('Fake') ? 'rgba(255,69,96,0.3)' : 'rgba(0,230,118,0.3)',
              color: s.label.includes('Fake') ? 'var(--fake)' : 'var(--real)',
            }} onClick={() => setText(s.text)}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input area */}
      <div style={styles.inputWrap}>
        <textarea
          style={styles.textarea}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Paste a news article, headline, or any text here…"
          rows={isMobile ? 5 : 6}
          onKeyDown={e => { if (e.ctrlKey && e.key === 'Enter') handlePredict() }}
        />
        <div style={{
          ...styles.inputFooter,
          flexWrap: isMobile ? 'wrap' : 'nowrap',
          gap: isMobile ? 8 : 0,
        }}>
          <span style={styles.charCount}>
            {text.length} chars{!isMobile && ' · Ctrl+Enter to analyse'}
          </span>
          <div style={{ display: 'flex', gap: 8, marginLeft: isMobile ? 0 : 'auto' }}>
            {text && (
              <button style={styles.clearBtn} onClick={() => { setText(''); setResult(null) }}>
                Clear
              </button>
            )}
            <button
              style={{
                ...styles.analyseBtn,
                opacity: (!text.trim() || loading) ? 0.5 : 1,
                cursor: (!text.trim() || loading) ? 'not-allowed' : 'pointer',
              }}
              onClick={handlePredict}
              disabled={!text.trim() || loading}
            >
              {loading ? (
                <span style={styles.spinner} />
              ) : (
                <>Analyse →</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={styles.error}>{error}</div>
      )}

      {/* Result */}
      <ResultCard result={result} text={text} />

      {/* History */}
      {history.length > 0 && (
        <div style={styles.historySection}>
          <div style={styles.sectionTitle}>Recent predictions</div>
          <div style={styles.historyList}>
            {history.map(h => (
              <div key={h.id} style={styles.historyItem} onClick={() => setText(h.text)}>
                <span style={{
                  ...styles.historyBadge,
                  background: h.prediction === 'FAKE' ? 'rgba(255,69,96,0.15)' : 'rgba(0,230,118,0.15)',
                  color: h.prediction === 'FAKE' ? 'var(--fake)' : 'var(--real)',
                }}>{h.prediction}</span>
                <span style={styles.historyText}>
                  {h.text.slice(0, isMobile ? 40 : 60)}…
                </span>
                <span style={styles.historyConf}>{Math.round(h.confidence * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  hero: { marginBottom: 24 },
  heroEyebrow: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--accent)',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    marginBottom: 10,
  },
  heroTitle: {
    fontFamily: 'var(--font-head)',
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: '-1.5px',
    color: 'var(--text)',
    marginBottom: 12,
  },
  heroSub: {
    fontSize: 14,
    color: 'var(--text2)',
    lineHeight: 1.7,
    maxWidth: 560,
  },
  samples: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  samplesLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--text3)',
    paddingTop: 3,
    flexShrink: 0,
  },
  sampleBtn: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    padding: '4px 10px',
    background: 'transparent',
    border: '1px solid',
    borderRadius: 6,
    cursor: 'pointer',
    transition: 'opacity 0.15s',
  },
  inputWrap: {
    background: 'var(--bg2)',
    border: '1px solid var(--border2)',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
    transition: 'border-color 0.2s',
  },
  textarea: {
    width: '100%',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'var(--text)',
    fontSize: 14,
    lineHeight: 1.7,
    padding: '16px 18px 10px',
    resize: 'vertical',
    minHeight: 120,
    boxSizing: 'border-box',
  },
  inputFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 14px',
    borderTop: '1px solid var(--border)',
    background: 'var(--bg3)',
  },
  charCount: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--text3)',
  },
  clearBtn: {
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    color: 'var(--text3)',
    background: 'transparent',
    border: '1px solid var(--border)',
    borderRadius: 7,
    padding: '7px 14px',
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
    padding: '8px 18px',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    transition: 'opacity 0.2s',
    boxShadow: '0 0 20px rgba(0,229,255,0.3)',
  },
  spinner: {
    width: 14,
    height: 14,
    border: '2px solid rgba(0,0,0,0.2)',
    borderTopColor: '#000',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
    display: 'inline-block',
  },
  error: {
    marginTop: 16,
    padding: '12px 16px',
    background: 'rgba(255,69,96,0.08)',
    border: '1px solid rgba(255,69,96,0.25)',
    borderRadius: 10,
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    color: 'var(--fake)',
  },
  historySection: { marginTop: 36 },
  sectionTitle: {
    fontFamily: 'var(--font-head)',
    fontWeight: 700,
    fontSize: 14,
    color: 'var(--text2)',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  historyList: { display: 'flex', flexDirection: 'column', gap: 6 },
  historyItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px',
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: 9,
    cursor: 'pointer',
    transition: 'border-color 0.15s',
  },
  historyBadge: {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    fontWeight: 500,
    padding: '2px 7px',
    borderRadius: 5,
    flexShrink: 0,
    letterSpacing: '0.05em',
  },
  historyText: {
    flex: 1,
    fontSize: 12,
    color: 'var(--text2)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  historyConf: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--text3)',
    flexShrink: 0,
  },
}