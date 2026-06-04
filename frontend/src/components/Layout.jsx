// import React, { useState, useEffect } from 'react'
// import { Outlet, NavLink, useLocation } from 'react-router-dom'
// import { checkHealth } from '../api'

// const NAV = [
//   { to: '/',         icon: '⬡', label: 'Detect',    sub: 'Single article' },
//   { to: '/batch',    icon: '⬢', label: 'Batch',     sub: 'Multiple texts' },
//   { to: '/csv',      icon: '◈', label: 'CSV Upload', sub: 'File analysis' },
//   { to: '/dashboard',icon: '◉', label: 'Dashboard', sub: 'Analytics' },
//   { to: '/status',   icon: '◎', label: 'API Status', sub: 'Health & info' },
// ]

// export default function Layout() {
//   const [apiOnline, setApiOnline] = useState(null)
//   const location = useLocation()

//   useEffect(() => {
//     const check = async () => {
//       try {
//         await checkHealth()
//         setApiOnline(true)
//       } catch {
//         setApiOnline(false)
//       }
//     }
//     check()
//     const t = setInterval(check, 15000)
//     return () => clearInterval(t)
//   }, [])

//   return (
//     <div style={styles.shell}>
//       {/* Sidebar */}
//       <aside style={styles.sidebar}>
//         {/* Logo */}
//         <div style={styles.logo}>
//           <div style={styles.logoMark}>
//             <span style={styles.logoGlyph}>KN</span>
//           </div>
//           <div>
//             <div style={styles.logoName}>KnowNow</div>
//             <div style={styles.logoSub}>MLOps Pipeline</div>
//           </div>
//         </div>

//         {/* API status pill */}
//         <div style={styles.statusPill}>
//           <span style={{
//             ...styles.statusDot,
//             background: apiOnline === null ? 'var(--warn)' : apiOnline ? 'var(--real)' : 'var(--fake)',
//             boxShadow: apiOnline ? '0 0 8px var(--real)' : apiOnline === false ? '0 0 8px var(--fake)' : '0 0 8px var(--warn)',
//             animation: apiOnline === null ? 'blink 1s infinite' : 'none'
//           }} />
//           <span style={styles.statusText}>
//             {apiOnline === null ? 'Checking...' : apiOnline ? 'API Online' : 'API Offline'}
//           </span>
//         </div>

//         {/* Navigation */}
//         <nav style={styles.nav}>
//           {NAV.map(({ to, icon, label, sub }) => (
//             <NavLink
//               key={to}
//               to={to}
//               end={to === '/'}
//               style={({ isActive }) => ({
//                 ...styles.navItem,
//                 ...(isActive ? styles.navItemActive : {})
//               })}
//             >
//               {({ isActive }) => (
//                 <>
//                   <span style={{
//                     ...styles.navIcon,
//                     color: isActive ? 'var(--accent)' : 'var(--text3)'
//                   }}>{icon}</span>
//                   <div>
//                     <div style={{
//                       ...styles.navLabel,
//                       color: isActive ? 'var(--text)' : 'var(--text2)'
//                     }}>{label}</div>
//                     <div style={styles.navSub}>{sub}</div>
//                   </div>
//                   {isActive && <div style={styles.navIndicator} />}
//                 </>
//               )}
//             </NavLink>
//           ))}
//         </nav>

//         {/* Footer */}
//         <div style={styles.sideFooter}>
//           <div style={styles.sideFooterText}>Built with</div>
//           <div style={styles.techStack}>
//             {['FastAPI','MLflow','Evidently','Docker'].map(t => (
//               <span key={t} style={styles.techBadge}>{t}</span>
//             ))}
//           </div>
//         </div>
//       </aside>

//       {/* Main content */}
//       <main style={styles.main}>
//         {/* Top bar */}
//         <header style={styles.topbar}>
//           <div style={styles.topbarLeft}>
//             <div style={styles.pageCrumb}>
//               {NAV.find(n => n.to === location.pathname)?.label || 'KnowNow'}
//             </div>
//           </div>
//           <div style={styles.topbarRight}>
//             <div style={styles.monoBadge}>
//               TF-IDF + Logistic Regression
//             </div>
//           </div>
//         </header>

//         {/* Page content */}
//         <div style={styles.content}>
//           <Outlet />
//         </div>
//       </main>
//     </div>
//   )
// }

// const styles = {
//   shell: {
//     display: 'flex',
//     minHeight: '100vh',
//     background: 'var(--bg)',
//   },
//   sidebar: {
//     width: 240,
//     flexShrink: 0,
//     background: 'var(--bg2)',
//     borderRight: '1px solid var(--border)',
//     display: 'flex',
//     flexDirection: 'column',
//     padding: '24px 0',
//     position: 'sticky',
//     top: 0,
//     height: '100vh',
//     overflowY: 'auto',
//   },
//   logo: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: 12,
//     padding: '0 20px 24px',
//     borderBottom: '1px solid var(--border)',
//     marginBottom: 20,
//   },
//   logoMark: {
//     width: 40,
//     height: 40,
//     borderRadius: 10,
//     background: 'linear-gradient(135deg, var(--accent2), var(--accent))',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexShrink: 0,
//   },
//   logoGlyph: {
//     fontFamily: 'var(--font-head)',
//     fontWeight: 800,
//     fontSize: 14,
//     color: '#fff',
//     letterSpacing: '-0.5px',
//   },
//   logoName: {
//     fontFamily: 'var(--font-head)',
//     fontWeight: 700,
//     fontSize: 16,
//     color: 'var(--text)',
//     letterSpacing: '-0.3px',
//   },
//   logoSub: {
//     fontFamily: 'var(--font-mono)',
//     fontSize: 10,
//     color: 'var(--text3)',
//     marginTop: 1,
//   },
//   statusPill: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: 8,
//     margin: '0 16px 20px',
//     padding: '8px 12px',
//     background: 'var(--bg3)',
//     borderRadius: 8,
//     border: '1px solid var(--border)',
//   },
//   statusDot: {
//     width: 7,
//     height: 7,
//     borderRadius: '50%',
//     flexShrink: 0,
//   },
//   statusText: {
//     fontFamily: 'var(--font-mono)',
//     fontSize: 11,
//     color: 'var(--text2)',
//   },
//   nav: {
//     flex: 1,
//     display: 'flex',
//     flexDirection: 'column',
//     gap: 2,
//     padding: '0 12px',
//   },
//   navItem: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: 12,
//     padding: '10px 12px',
//     borderRadius: 10,
//     transition: 'background 0.15s',
//     position: 'relative',
//     textDecoration: 'none',
//   },
//   navItemActive: {
//     background: 'rgba(0,229,255,0.06)',
//     border: '1px solid rgba(0,229,255,0.12)',
//   },
//   navIcon: {
//     fontSize: 18,
//     width: 22,
//     textAlign: 'center',
//     flexShrink: 0,
//   },
//   navLabel: {
//     fontFamily: 'var(--font-head)',
//     fontSize: 13,
//     fontWeight: 600,
//     lineHeight: 1.2,
//   },
//   navSub: {
//     fontSize: 11,
//     color: 'var(--text3)',
//     marginTop: 1,
//   },
//   navIndicator: {
//     position: 'absolute',
//     right: 10,
//     width: 5,
//     height: 5,
//     borderRadius: '50%',
//     background: 'var(--accent)',
//     boxShadow: '0 0 8px var(--accent)',
//   },
//   sideFooter: {
//     padding: '20px 20px 0',
//     borderTop: '1px solid var(--border)',
//     marginTop: 16,
//   },
//   sideFooterText: {
//     fontSize: 10,
//     color: 'var(--text3)',
//     textTransform: 'uppercase',
//     letterSpacing: '0.1em',
//     marginBottom: 8,
//   },
//   techStack: {
//     display: 'flex',
//     flexWrap: 'wrap',
//     gap: 4,
//   },
//   techBadge: {
//     fontFamily: 'var(--font-mono)',
//     fontSize: 9,
//     color: 'var(--text3)',
//     background: 'var(--bg3)',
//     border: '1px solid var(--border)',
//     borderRadius: 4,
//     padding: '2px 6px',
//   },
//   main: {
//     flex: 1,
//     display: 'flex',
//     flexDirection: 'column',
//     minWidth: 0,
//   },
//   topbar: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: '16px 32px',
//     borderBottom: '1px solid var(--border)',
//     background: 'var(--bg2)',
//     position: 'sticky',
//     top: 0,
//     zIndex: 10,
//   },
//   topbarLeft: {},
//   pageCrumb: {
//     fontFamily: 'var(--font-head)',
//     fontWeight: 700,
//     fontSize: 15,
//     color: 'var(--text)',
//   },
//   topbarRight: {},
//   monoBadge: {
//     fontFamily: 'var(--font-mono)',
//     fontSize: 11,
//     color: 'var(--text3)',
//     background: 'var(--bg3)',
//     border: '1px solid var(--border)',
//     borderRadius: 6,
//     padding: '4px 10px',
//   },
//   content: {
//     flex: 1,
//     padding: '32px',
//     overflowY: 'auto',
//   },
// }

import React, { useState, useEffect, useCallback } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { checkHealth } from '../api'

const NAV = [
  { to: '/',          icon: '⬡', label: 'Detect',     sub: 'Single article' },
  { to: '/batch',     icon: '⬢', label: 'Batch',      sub: 'Multiple texts' },
  { to: '/csv',       icon: '◈', label: 'CSV Upload',  sub: 'File analysis' },
  { to: '/dashboard', icon: '◉', label: 'Dashboard',  sub: 'Analytics' },
  { to: '/status',    icon: '◎', label: 'API Status', sub: 'Health & info' },
]

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}

export default function Layout() {
  const [apiOnline, setApiOnline] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isMobile = useIsMobile()
  const location = useLocation()

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (isMobile) setSidebarOpen(false)
  }, [location.pathname, isMobile])

  // Close sidebar on ESC
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setSidebarOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    const check = async () => {
      try {
        await checkHealth()
        setApiOnline(true)
      } catch {
        setApiOnline(false)
      }
    }
    check()
    const t = setInterval(check, 15000)
    return () => clearInterval(t)
  }, [])

  const sidebarVisible = !isMobile || sidebarOpen

  return (
    <div style={styles.shell}>

      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div
          style={styles.overlay}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside style={{
        ...styles.sidebar,
        ...(isMobile ? styles.sidebarMobile : {}),
        ...(isMobile && sidebarOpen ? styles.sidebarMobileOpen : {}),
      }}>
        {/* Logo */}
        <div style={styles.logo}>
          <div style={styles.logoMark}>
            <span style={styles.logoGlyph}>KN</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={styles.logoName}>KnowNow</div>
            <div style={styles.logoSub}>MLOps Pipeline</div>
          </div>
          {/* Close button on mobile */}
          {isMobile && (
            <button
              style={styles.closeBtn}
              onClick={() => setSidebarOpen(false)}
              aria-label="Close navigation"
            >
              ✕
            </button>
          )}
        </div>

        {/* API status pill */}
        <div style={styles.statusPill}>
          <span style={{
            ...styles.statusDot,
            background: apiOnline === null ? 'var(--warn)' : apiOnline ? 'var(--real)' : 'var(--fake)',
            boxShadow: apiOnline ? '0 0 8px var(--real)' : apiOnline === false ? '0 0 8px var(--fake)' : '0 0 8px var(--warn)',
            animation: apiOnline === null ? 'blink 1s infinite' : 'none',
          }} />
          <span style={styles.statusText}>
            {apiOnline === null ? 'Checking...' : apiOnline ? 'API Online' : 'API Offline'}
          </span>
        </div>

        {/* Navigation */}
        <nav style={styles.nav}>
          {NAV.map(({ to, icon, label, sub }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              style={({ isActive }) => ({
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {}),
              })}
            >
              {({ isActive }) => (
                <>
                  <span style={{
                    ...styles.navIcon,
                    color: isActive ? 'var(--accent)' : 'var(--text3)',
                  }}>{icon}</span>
                  <div>
                    <div style={{
                      ...styles.navLabel,
                      color: isActive ? 'var(--text)' : 'var(--text2)',
                    }}>{label}</div>
                    <div style={styles.navSub}>{sub}</div>
                  </div>
                  {isActive && <div style={styles.navIndicator} />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div style={styles.sideFooter}>
          <div style={styles.sideFooterText}>Built with</div>
          <div style={styles.techStack}>
            {['FastAPI', 'MLflow', 'Evidently', 'Docker'].map(t => (
              <span key={t} style={styles.techBadge}>{t}</span>
            ))}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={styles.main}>
        {/* Top bar */}
        <header style={styles.topbar}>
          <div style={styles.topbarLeft}>
            {/* Hamburger button (mobile only) */}
            {isMobile && (
              <button
                style={styles.hamburger}
                onClick={() => setSidebarOpen(true)}
                aria-label="Open navigation"
              >
                <span style={styles.hamburgerLine} />
                <span style={styles.hamburgerLine} />
                <span style={styles.hamburgerLine} />
              </button>
            )}
            <div style={styles.pageCrumb}>
              {NAV.find(n => n.to === location.pathname)?.label || 'KnowNow'}
            </div>
          </div>
          <div style={styles.topbarRight}>
            <div style={{
              ...styles.monoBadge,
              ...(isMobile ? { fontSize: 9, padding: '3px 7px' } : {}),
            }}>
              {isMobile ? 'TF-IDF + LR' : 'TF-IDF + Logistic Regression'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div style={{
          ...styles.content,
          padding: isMobile ? '20px 16px' : '32px',
        }}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

const styles = {
  shell: {
    display: 'flex',
    minHeight: '100vh',
    background: 'var(--bg)',
    position: 'relative',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.55)',
    zIndex: 40,
  },
  sidebar: {
    width: 240,
    flexShrink: 0,
    background: 'var(--bg2)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 0',
    position: 'sticky',
    top: 0,
    height: '100vh',
    overflowY: 'auto',
  },
  sidebarMobile: {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    zIndex: 50,
    transform: 'translateX(-100%)',
    transition: 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '4px 0 24px rgba(0,0,0,0.4)',
  },
  sidebarMobileOpen: {
    transform: 'translateX(0)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '0 20px 24px',
    borderBottom: '1px solid var(--border)',
    marginBottom: 20,
  },
  logoMark: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: 'linear-gradient(135deg, var(--accent2), var(--accent))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  logoGlyph: {
    fontFamily: 'var(--font-head)',
    fontWeight: 800,
    fontSize: 14,
    color: '#fff',
    letterSpacing: '-0.5px',
  },
  logoName: {
    fontFamily: 'var(--font-head)',
    fontWeight: 700,
    fontSize: 16,
    color: 'var(--text)',
    letterSpacing: '-0.3px',
  },
  logoSub: {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    color: 'var(--text3)',
    marginTop: 1,
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text3)',
    fontSize: 16,
    cursor: 'pointer',
    padding: '4px 6px',
    borderRadius: 6,
    flexShrink: 0,
    marginLeft: 'auto',
  },
  statusPill: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    margin: '0 16px 20px',
    padding: '8px 12px',
    background: 'var(--bg3)',
    borderRadius: 8,
    border: '1px solid var(--border)',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    flexShrink: 0,
  },
  statusText: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--text2)',
  },
  nav: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    padding: '0 12px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 12px',
    borderRadius: 10,
    transition: 'background 0.15s',
    position: 'relative',
    textDecoration: 'none',
  },
  navItemActive: {
    background: 'rgba(0,229,255,0.06)',
    border: '1px solid rgba(0,229,255,0.12)',
  },
  navIcon: {
    fontSize: 18,
    width: 22,
    textAlign: 'center',
    flexShrink: 0,
  },
  navLabel: {
    fontFamily: 'var(--font-head)',
    fontSize: 13,
    fontWeight: 600,
    lineHeight: 1.2,
  },
  navSub: {
    fontSize: 11,
    color: 'var(--text3)',
    marginTop: 1,
  },
  navIndicator: {
    position: 'absolute',
    right: 10,
    width: 5,
    height: 5,
    borderRadius: '50%',
    background: 'var(--accent)',
    boxShadow: '0 0 8px var(--accent)',
  },
  sideFooter: {
    padding: '20px 20px 0',
    borderTop: '1px solid var(--border)',
    marginTop: 16,
  },
  sideFooterText: {
    fontSize: 10,
    color: 'var(--text3)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: 8,
  },
  techStack: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 4,
  },
  techBadge: {
    fontFamily: 'var(--font-mono)',
    fontSize: 9,
    color: 'var(--text3)',
    background: 'var(--bg3)',
    border: '1px solid var(--border)',
    borderRadius: 4,
    padding: '2px 6px',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  topbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 20px',
    borderBottom: '1px solid var(--border)',
    background: 'var(--bg2)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    gap: 10,
  },
  topbarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  hamburger: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 5,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '4px 6px',
    borderRadius: 6,
    flexShrink: 0,
  },
  hamburgerLine: {
    display: 'block',
    width: 20,
    height: 2,
    background: 'var(--text2)',
    borderRadius: 2,
  },
  pageCrumb: {
    fontFamily: 'var(--font-head)',
    fontWeight: 700,
    fontSize: 15,
    color: 'var(--text)',
  },
  topbarRight: {},
  monoBadge: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--text3)',
    background: 'var(--bg3)',
    border: '1px solid var(--border)',
    borderRadius: 6,
    padding: '4px 10px',
    whiteSpace: 'nowrap',
  },
  content: {
    flex: 1,
    overflowY: 'auto',
  },
}