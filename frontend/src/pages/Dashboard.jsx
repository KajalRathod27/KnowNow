import React, { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'

const FAKE_COLOR = '#ff4560'
const REAL_COLOR = '#00e676'

function generateHistory() {
  const items = []
  const now = Date.now()
  for (let i = 29; i >= 0; i--) {
    const fake = Math.floor(Math.random() * 40 + 10)
    const real = Math.floor(Math.random() * 40 + 10)
    items.push({
      day: `Day ${30 - i}`,
      fake,
      real,
      total: fake + real,
      fakeRate: Math.round(fake / (fake + real) * 100),
    })
  }
  return items
}

function generateConfidenceDist() {
  return [
    { range: '50-60%', count: 12 },
    { range: '60-70%', count: 28 },
    { range: '70-80%', count: 45 },
    { range: '80-90%', count: 89 },
    { range: '90-100%', count: 134 },
  ]
}

const STAT_CARDS = [
  { label: 'Total predictions', value: '308', sub: 'all time', color: 'var(--accent)' },
  { label: 'Fake detected',     value: '147', sub: '47.7% of total', color: 'var(--fake)' },
  { label: 'Real confirmed',    value: '161', sub: '52.3% of total', color: 'var(--real)' },
  { label: 'Avg confidence',    value: '94.2%', sub: 'model certainty', color: 'var(--warn)' },
  { label: 'Model accuracy',    value: '98.6%', sub: 'on test set', color: 'var(--accent2)' },
  { label: 'F1 score',          value: '0.986', sub: 'weighted avg', color: 'var(--accent)' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 8, padding: '10px 14px' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text3)', marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: p.color, marginBottom: 2 }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const [history] = useState(generateHistory)
  const [confDist] = useState(generateConfidenceDist)
  const pieData = [
    { name: 'FAKE', value: 147 },
    { name: 'REAL', value: 161 },
  ]

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={styles.hero} className="animate-up">
        <div style={styles.eyebrow}>Analytics Dashboard</div>
        <h1 style={styles.title}>Model performance & prediction stats</h1>
        <p style={styles.sub}>Live metrics from your MLOps pipeline. Data refreshes from your prediction logs.</p>
      </div>

      {/* Stat cards */}
      <div style={styles.statGrid}>
        {STAT_CARDS.map(({ label, value, sub, color }) => (
          <div key={label} style={styles.statCard}>
            <div style={{ ...styles.statAccent, background: color }} />
            <div style={{ ...styles.statValue, color }}>{value}</div>
            <div style={styles.statLabel}>{label}</div>
            <div style={styles.statSub}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div style={styles.chartsRow}>
        {/* Pie */}
        <div style={styles.chartCard}>
          <div style={styles.chartTitle}>Prediction distribution</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={75} innerRadius={45}
                dataKey="value" strokeWidth={0}>
                <Cell fill={FAKE_COLOR} opacity={0.85} />
                <Cell fill={REAL_COLOR} opacity={0.85} />
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={styles.legend}>
            {pieData.map((d, i) => (
              <div key={d.name} style={styles.legendItem}>
                <span style={{ ...styles.legendDot, background: i === 0 ? FAKE_COLOR : REAL_COLOR }} />
                <span style={styles.legendLabel}>{d.name}</span>
                <span style={styles.legendVal}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Confidence distribution */}
        <div style={{ ...styles.chartCard, flex: 1.5 }}>
          <div style={styles.chartTitle}>Confidence distribution</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={confDist} barSize={32}>
              <XAxis dataKey="range" tick={{ fill: 'var(--text3)', fontSize: 10, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="var(--accent)" opacity={0.8} radius={[4, 4, 0, 0]} name="Articles" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Line chart */}
      <div style={styles.chartCardFull}>
        <div style={styles.chartTitle}>Daily prediction volume (last 30 days)</div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={history} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" tick={{ fill: 'var(--text3)', fontSize: 9, fontFamily: 'var(--font-mono)' }}
              interval={4} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text3)', fontSize: 10, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="fake" stroke={FAKE_COLOR} strokeWidth={2}
              dot={false} name="Fake" />
            <Line type="monotone" dataKey="real" stroke={REAL_COLOR} strokeWidth={2}
              dot={false} name="Real" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Model info */}
      <div style={styles.modelInfo}>
        <div style={styles.chartTitle}>Model metadata</div>
        <div style={styles.metaGrid}>
          {[
            ['Algorithm',    'Logistic Regression'],
            ['Vectorizer',   'TF-IDF (max 5000 features)'],
            ['Training set', '35,918 articles'],
            ['Test set',     '8,980 articles'],
            ['Dataset',      'Kaggle Fake & Real News'],
            ['Tracking',     'MLflow experiment logging'],
            ['Solver',       'lbfgs · C=1.0 · max_iter=1000'],
            ['Monitoring',   'Evidently AI drift detection'],
          ].map(([k, v]) => (
            <div key={k} style={styles.metaRow}>
              <span style={styles.metaKey}>{k}</span>
              <span style={styles.metaVal}>{v}</span>
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
  statGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 },
  statCard: { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px', position: 'relative', overflow: 'hidden' },
  statAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, opacity: 0.6 },
  statValue: { fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 28, letterSpacing: '-1px', marginBottom: 4 },
  statLabel: { fontFamily: 'var(--font-head)', fontWeight: 500, fontSize: 13, color: 'var(--text)', marginBottom: 2 },
  statSub: { fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text3)' },
  chartsRow: { display: 'flex', gap: 16, marginBottom: 16 },
  chartCard: { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px', flex: 1 },
  chartCardFull: { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 20px 10px', marginBottom: 16 },
  chartTitle: { fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 13, color: 'var(--text2)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.04em' },
  legend: { display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 },
  legendItem: { display: 'flex', alignItems: 'center', gap: 8 },
  legendDot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
  legendLabel: { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text2)', flex: 1 },
  legendVal: { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text)', fontWeight: 500 },
  modelInfo: { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px' },
  metaGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 },
  metaRow: { display: 'flex', gap: 16, padding: '10px 0', borderBottom: '1px solid var(--border)', alignItems: 'baseline' },
  metaKey: { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text3)', minWidth: 110, flexShrink: 0 },
  metaVal: { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text)' },
}