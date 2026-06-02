import React, { useState, useEffect } from 'react'
import { checkHealth, predictSingle } from '../api'

const ENDPOINTS = [
  { method: 'GET',  path: '/health',         desc: 'Health check',           color: '#00e676' },
  { method: 'POST', path: '/predict',         desc: 'Single text prediction', color: '#00e5ff' },
  { method: 'POST', path: '/predict/batch',   desc: 'Batch text prediction',  color: '#7c3aed' },
  { method: 'POST', path: '/predict/csv',     desc: 'CSV file upload',        color: '#ffab00' },
]

function StatusRow({ label, value, mono = false, color }) {
  return (
    <div style={styles.statusRow}>
      <span style={styles.statusKey}>{label}</span>
      <span style={{ ...styles.statusVal, fontFamily: mono ? 'var(--font-mono)' : 'var(--font-body)', color: color || 'var(--text)' }}>
        {value}
      </span>
    </div>
  )
}

export default function APIStatus() {
  const [health, setHealth]     = useState(null)
  const [online, setOnline]     = useState(null)
  const [checking, setChecking] = useState(false)
  const [latency, setLatency]   = useState(null)
  const [pingResult, setPingResult] = useState(null)

  const doCheck = async () => {
    setChecking(true)
    const t0 = Date.now()
    try {
      const { data } = await checkHealth()
      setLatency(Date.now() - t0)
      setHealth(data)
      setOnline(true)
    } catch {
      setOnline(false)
      setHealth(null)
      setLatency(null)
    } finally {
      setChecking(false)
    }
  }

  const doTestPredict = async () => {
    setPingResult(null)
    try {
      const { data } = await predictSingle('The president signed the bill into law on Friday.')
      setPingResult({ ok: true, data })
    } catch (e) {
      setPingResult({ ok: false, error: e.message })
    }
  }

  useEffect(() => { doCheck() }, [])

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div style={styles.hero} className="animate-up">
        <div style={styles.eyebrow}>API Status</div>
        <h1 style={styles.title}>Backend health & endpoints</h1>
        <p style={styles.sub}>Monitor your FastAPI backend, check all endpoints, and run live tests.</p>
      </div>

      {/* Main status card */}
      <div style={{
        ...styles.statusCard,
        borderColor: online === null ? 'var(--border2)' : online ? 'rgba(0,230,118,0.35)' : 'rgba(255,69,96,0.35)',
        boxShadow: online ? 'var(--glow-real)' : online === false ? 'var(--glow-fake)' : 'none',
      }}>
        <div style={styles.statusHeader}>
          <div style={styles.statusHeaderLeft}>
            <div style={{
              ...styles.bigDot,
              background: online === null ? 'var(--warn)' : online ? 'var(--real)' : 'var(--fake)',
              boxShadow: online ? '0 0 14px var(--real)' : 'none',
              animation: online === null ? 'blink 1s infinite' : online ? 'pulse-real 2s infinite' : 'none',
            }} />
            <div>
              <div style={styles.statusTitle}>
                {online === null ? 'Checking…' : online ? 'API Online' : 'API Offline'}
              </div>
              <div style={styles.statusUrl}>http://localhost:8000</div>
            </div>
          </div>
          <button
            style={{ ...styles.refreshBtn, opacity: checking ? 0.5 : 1 }}
            onClick={doCheck}
            disabled={checking}
          >
            {checking ? '↻ Checking…' : '↻ Refresh'}
          </button>
        </div>

        {online && (
          <div style={styles.statusRows}>
            <StatusRow label="Status"       value={health?.status || '—'}        mono color="var(--real)" />
            <StatusRow label="Model loaded" value={health?.model_loaded ? 'true' : 'false'} mono color={health?.model_loaded ? 'var(--real)' : 'var(--fake)'} />
            <StatusRow label="Latency"      value={latency != null ? `${latency}ms` : '—'} mono color="var(--accent)" />
            <StatusRow label="Base URL"     value="http://localhost:8000" mono />
            <StatusRow label="Docs"         value="http://localhost:8000/docs" mono color="var(--accent)" />
          </div>
        )}

        {online === false && (
          <div style={styles.offlineMsg}>
            <p>Backend is not reachable. Make sure you have run:</p>
            <pre style={styles.cmd}>uvicorn app.main:app --reload --port 8000</pre>
          </div>
        )}
      </div>

      {/* Endpoints */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Endpoints</div>
        <div style={styles.endpointList}>
          {ENDPOINTS.map(e => (
            <div key={e.path} style={styles.endpointRow}>
              <span style={{ ...styles.methodBadge, background: `${e.color}18`, color: e.color, border: `1px solid ${e.color}40` }}>
                {e.method}
              </span>
              <span style={styles.endpointPath}>{e.path}</span>
              <span style={styles.endpointDesc}>{e.desc}</span>
              <a
                href={`http://localhost:8000/docs#/default`}
                target="_blank"
                rel="noreferrer"
                style={styles.docsLink}
              >
                Swagger ↗
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Live test */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Live test</div>
        <div style={styles.testCard}>
          <div style={styles.testDesc}>
            Sends a real request to <code style={styles.code}>POST /predict</code> with a sample sentence and shows the raw response.
          </div>
          <button style={{ ...styles.testBtn, opacity: !online ? 0.4 : 1 }} onClick={doTestPredict} disabled={!online}>
            Run test prediction →
          </button>
          {pingResult && (
            <pre style={{
              ...styles.pre,
              borderColor: pingResult.ok ? 'rgba(0,230,118,0.25)' : 'rgba(255,69,96,0.25)',
              background: pingResult.ok ? 'rgba(0,230,118,0.04)' : 'rgba(255,69,96,0.04)',
            }}>
              {JSON.stringify(pingResult.ok ? pingResult.data : { error: pingResult.error }, null, 2)}
            </pre>
          )}
        </div>
      </div>

      {/* Tech stack */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Stack info</div>
        <div style={styles.stackGrid}>
          {[
            { name: 'FastAPI',      role: 'REST API framework',     version: '0.110.0' },
            { name: 'scikit-learn', role: 'ML model + vectorizer',  version: '1.4.2' },
            { name: 'MLflow',       role: 'Experiment tracking',    version: '2.12.1' },
            { name: 'Evidently',    role: 'Drift detection',        version: '0.4.22' },
            { name: 'Docker',       role: 'Containerization',       version: 'latest' },
            { name: 'React + Vite', role: 'This frontend',          version: '18 + 5' },
          ].map(s => (
            <div key={s.name} style={styles.stackCard}>
              <div style={styles.stackName}>{s.name}</div>
              <div style={styles.stackRole}>{s.role}</div>
              <div style={styles.stackVersion}>v{s.version}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const styles = {
  hero: { marginBottom: 28 },
  eyebrow: { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 10 },
  title: { fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 30, letterSpacing: '-1px', color: 'var(--text)', marginBottom: 10 },
  sub: { fontSize: 14, color: 'var(--text2)', lineHeight: 1.6 },
  statusCard: { background: 'var(--bg2)', border: '1px solid', borderRadius: 'var(--radius)', padding: 24, marginBottom: 24, transition: 'all 0.3s' },
  statusHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  statusHeaderLeft: { display: 'flex', alignItems: 'center', gap: 14 },
  bigDot: { width: 16, height: 16, borderRadius: '50%', flexShrink: 0 },
  statusTitle: { fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 18, color: 'var(--text)', marginBottom: 2 },
  statusUrl: { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text3)' },
  refreshBtn: { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)', background: 'rgba(0,229,255,0.06)', border: '1px solid rgba(0,229,255,0.2)', borderRadius: 8, padding: '8px 16px', cursor: 'pointer' },
  statusRows: { display: 'flex', flexDirection: 'column', gap: 0, borderTop: '1px solid var(--border)', paddingTop: 16 },
  statusRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' },
  statusKey: { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text3)' },
  statusVal: { fontSize: 13 },
  offlineMsg: { borderTop: '1px solid var(--border)', paddingTop: 16 },
  cmd: { fontFamily: 'var(--font-mono)', fontSize: 12, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', marginTop: 10, color: 'var(--accent)' },
  section: { marginBottom: 24 },
  sectionTitle: { fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 13, color: 'var(--text2)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' },
  endpointList: { display: 'flex', flexDirection: 'column', gap: 6 },
  endpointRow: { display: 'flex', alignItems: 'center', gap: 14, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px' },
  methodBadge: { fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 500, padding: '3px 8px', borderRadius: 5, letterSpacing: '0.05em', flexShrink: 0 },
  endpointPath: { fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text)', flex: 1 },
  endpointDesc: { fontSize: 12, color: 'var(--text3)', flex: 1 },
  docsLink: { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', textDecoration: 'none', flexShrink: 0 },
  testCard: { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 },
  testDesc: { fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 14 },
  code: { fontFamily: 'var(--font-mono)', fontSize: 12, background: 'var(--bg3)', padding: '1px 6px', borderRadius: 4, color: 'var(--accent)' },
  testBtn: { fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 13, color: '#000', background: 'var(--accent)', border: 'none', borderRadius: 8, padding: '9px 20px', cursor: 'pointer', boxShadow: '0 0 20px rgba(0,229,255,0.3)', marginBottom: 14 },
  pre: { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text2)', background: 'var(--bg3)', border: '1px solid', borderRadius: 10, padding: '14px 16px', whiteSpace: 'pre-wrap', lineHeight: 1.7 },
  stackGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 },
  stackCard: { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px' },
  stackName: { fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 4 },
  stackRole: { fontSize: 12, color: 'var(--text3)', lineHeight: 1.4, marginBottom: 6 },
  stackVersion: { fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)' },
}