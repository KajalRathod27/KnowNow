import React, { useState, useRef } from 'react'
import { predictCSV } from '../api'

export default function CSVPredict() {
  const [file, setFile]         = useState(null)
  const [results, setResults]   = useState([])
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef()

  const handleFile = f => {
    if (!f) return
    if (!f.name.endsWith('.csv')) { setError('Only .csv files accepted'); return }
    setFile(f)
    setError(null)
    setResults([])
  }

  const handleDrop = e => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleSubmit = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    setResults([])
    try {
      const { data } = await predictCSV(file)
      setResults(data)
    } catch (e) {
      setError(e.response?.data?.detail || 'Upload failed. Make sure CSV has a "text" column.')
    } finally {
      setLoading(false)
    }
  }

  const fakeCount = results.filter(r => r.prediction === 'FAKE').length
  const realCount = results.filter(r => r.prediction === 'REAL').length

  const downloadResults = () => {
    const header = 'text,prediction,confidence\n'
    const rows = results.map(r =>
      `"${r.text.replace(/"/g, '""')}",${r.prediction},${r.confidence}`
    ).join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url
    a.download = 'predictions.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ maxWidth: 820, margin: '0 auto' }}>
      <div style={styles.hero} className="animate-up">
        <div style={styles.eyebrow}>CSV Batch Upload</div>
        <h1 style={styles.title}>Upload a CSV, get predictions</h1>
        <p style={styles.sub}>
          Your CSV must have a column named <code style={styles.code}>text</code>. 
          Each row is analysed and results are returned instantly.
        </p>
      </div>

      {/* Format hint */}
      <div style={styles.formatHint}>
        <div style={styles.formatLabel}>Expected CSV format</div>
        <pre style={styles.pre}>{`text
"Government secretly hiding alien invasion..."
"Federal Reserve raised interest rates by 0.25%..."
"SHOCKING: Scientists discover moon is a hologram!"`}</pre>
      </div>

      {/* Drop zone */}
      <div
        style={{
          ...styles.dropzone,
          borderColor: dragging ? 'var(--accent)' : file ? 'rgba(0,230,118,0.4)' : 'var(--border2)',
          background: dragging ? 'rgba(0,229,255,0.04)' : file ? 'rgba(0,230,118,0.03)' : 'var(--bg2)',
        }}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          style={{ display: 'none' }}
          onChange={e => handleFile(e.target.files[0])}
        />
        {file ? (
          <>
            <div style={styles.fileIcon}>◈</div>
            <div style={styles.fileName}>{file.name}</div>
            <div style={styles.fileSize}>{(file.size / 1024).toFixed(1)} KB · Click to change</div>
          </>
        ) : (
          <>
            <div style={styles.dropIcon}>↑</div>
            <div style={styles.dropText}>Drop CSV here or click to browse</div>
            <div style={styles.dropSub}>Supports .csv with a "text" column</div>
          </>
        )}
      </div>

      {/* Actions */}
      <div style={styles.actions}>
        {file && (
          <button style={styles.clearBtn} onClick={() => { setFile(null); setResults([]); setError(null) }}>
            Remove file
          </button>
        )}
        <button
          style={{
            ...styles.analyseBtn,
            opacity: (!file || loading) ? 0.5 : 1,
            cursor: (!file || loading) ? 'not-allowed' : 'pointer',
            marginLeft: 'auto',
          }}
          onClick={handleSubmit}
          disabled={!file || loading}
        >
          {loading ? 'Processing…' : 'Upload & Analyse →'}
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {/* Results */}
      {results.length > 0 && (
        <div style={styles.resultsWrap} className="animate-up">
          <div style={styles.resultsHeader}>
            <div style={styles.summary}>
              <span style={{ color: 'var(--text)' }}>{results.length} rows</span>
              <span style={{ color: 'var(--fake)' }}>{fakeCount} FAKE</span>
              <span style={{ color: 'var(--real)' }}>{realCount} REAL</span>
            </div>
            <button style={styles.downloadBtn} onClick={downloadResults}>
              ↓ Download results.csv
            </button>
          </div>

          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {['#', 'Text', 'Prediction', 'Confidence'].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => {
                  const isFake = r.prediction === 'FAKE'
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ ...styles.td, color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontSize: 11, width: 36 }}>
                        {i + 1}
                      </td>
                      <td style={{ ...styles.td, maxWidth: 380 }}>
                        <span style={{ fontSize: 13, color: 'var(--text2)' }}>
                          {r.text.length > 80 ? r.text.slice(0, 80) + '…' : r.text}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 11,
                          padding: '3px 9px',
                          borderRadius: 6,
                          background: isFake ? 'rgba(255,69,96,0.12)' : 'rgba(0,230,118,0.12)',
                          color: isFake ? 'var(--fake)' : 'var(--real)',
                          border: `1px solid ${isFake ? 'rgba(255,69,96,0.3)' : 'rgba(0,230,118,0.3)'}`,
                        }}>{r.prediction}</span>
                      </td>
                      <td style={styles.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{
                            flex: 1, height: 4, background: 'var(--bg3)', borderRadius: 2, maxWidth: 80
                          }}>
                            <div style={{
                              width: `${r.confidence * 100}%`,
                              height: '100%',
                              background: isFake ? 'var(--fake)' : 'var(--real)',
                              borderRadius: 2,
                            }} />
                          </div>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text2)' }}>
                            {Math.round(r.confidence * 100)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  hero: { marginBottom: 24 },
  eyebrow: { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 10 },
  title: { fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 30, letterSpacing: '-1px', color: 'var(--text)', marginBottom: 10 },
  sub: { fontSize: 14, color: 'var(--text2)', lineHeight: 1.6 },
  code: { fontFamily: 'var(--font-mono)', fontSize: 13, background: 'var(--bg3)', padding: '1px 6px', borderRadius: 4, color: 'var(--accent)' },
  formatHint: { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', marginBottom: 20 },
  formatLabel: { fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 },
  pre: { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text2)', lineHeight: 1.8, whiteSpace: 'pre-wrap' },
  dropzone: {
    border: '2px dashed',
    borderRadius: 'var(--radius)',
    padding: '48px 32px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginBottom: 16,
  },
  fileIcon: { fontSize: 32, color: 'var(--real)', marginBottom: 10 },
  fileName: { fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 16, color: 'var(--text)', marginBottom: 6 },
  fileSize: { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text3)' },
  dropIcon: { fontSize: 32, color: 'var(--text3)', marginBottom: 12 },
  dropText: { fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 16, color: 'var(--text2)', marginBottom: 6 },
  dropSub: { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text3)' },
  actions: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 },
  clearBtn: { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text3)', background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 14px', cursor: 'pointer' },
  analyseBtn: { fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 13, color: '#000', background: 'var(--accent)', border: 'none', borderRadius: 8, padding: '9px 22px', boxShadow: '0 0 20px rgba(0,229,255,0.3)' },
  error: { marginBottom: 20, padding: '12px 16px', background: 'rgba(255,69,96,0.08)', border: '1px solid rgba(255,69,96,0.25)', borderRadius: 10, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fake)' },
  resultsWrap: { marginTop: 8 },
  resultsHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  summary: { display: 'flex', gap: 20, fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 15 },
  downloadBtn: { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', background: 'rgba(0,229,255,0.06)', border: '1px solid rgba(0,229,255,0.2)', borderRadius: 7, padding: '7px 14px', cursor: 'pointer' },
  tableWrap: { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', background: 'var(--bg3)', borderBottom: '1px solid var(--border)' },
  td: { padding: '12px 16px', verticalAlign: 'middle' },
}