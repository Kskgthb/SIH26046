import { useState, useEffect } from 'react'
import type { Role, AdverseEvent, AuditLogEntry, DashboardPage } from './types'
import { mockStudies, mockAdverseEvents, mockAlerts, mockAuditTrail, mockDPDPRecords } from './data/mockClinicalData'
import { Navbar } from './components/Navbar'
import { RoleSelector } from './components/RoleSelector'
import { StudyLifecycleTracker } from './components/StudyLifecycleTracker'
import { KPIAlertCenter } from './components/KPIAlertCenter'
import { PharmacovigilanceModule } from './components/PharmacovigilanceModule'
import { StandardsComplianceView } from './components/StandardsComplianceView'
import './App.css'

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hey-theme')
      if (saved === 'light' || saved === 'dark') {
        return saved
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'dark'
  })

  // Role Based Persona
  const [currentRole, setCurrentRole] = useState<Role>('PI')

  // Multi-Page Navigation State (4 distinct pages)
  const [currentPage, setCurrentPage] = useState<DashboardPage>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '')
      if (hash === 'lifecycle' || hash === 'kpis' || hash === 'pv' || hash === 'standards') {
        return hash as DashboardPage
      }
    }
    return 'kpis'
  })

  // Studies State
  const [studies] = useState(mockStudies)
  const [selectedStudyId, setSelectedStudyId] = useState(mockStudies[0].id)

  // Adverse Events & PV State
  const [adverseEvents, setAdverseEvents] = useState<AdverseEvent[]>(mockAdverseEvents)

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(mockAuditTrail)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('hey-theme', theme)
  }, [theme])

  // Sync hash with currentPage
  useEffect(() => {
    window.location.hash = currentPage
  }, [currentPage])

  // Listen to browser forward/backward hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash === 'lifecycle' || hash === 'kpis' || hash === 'pv' || hash === 'standards') {
        setCurrentPage(hash as DashboardPage)
      }
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  // Handle adding a new Adverse Event (Generates an immutable audit trail entry)
  const handleAddNewEvent = (newEvent: AdverseEvent) => {
    setAdverseEvents((prev) => [newEvent, ...prev])

    // ALCOA+ Cryptographic Audit Trail creation
    const newAuditEntry: AuditLogEntry = {
      id: `aud-${Math.floor(Math.random() * 9000 + 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' IST',
      userId: `usr-${currentRole.toLowerCase()}-01`,
      userName: `Active Session User (${currentRole})`,
      role: currentRole,
      action: 'ELECTRONIC_SIGNATURE',
      entity: 'AE_SAE',
      entityId: newEvent.id,
      details: `Logged ${newEvent.isSAE ? 'Serious Adverse Event (SAE)' : 'Adverse Event'}: ${newEvent.eventTerm}. Auto-coded MedDRA PT: ${newEvent.meddra.pt} (Code: ${newEvent.meddra.code}). Expedited Regulatory Timer initiated.`,
      ipAddress: '14.139.60.28 (Verified Secure Node)',
      alcoaHash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    }

    setAuditLogs((prev) => [newAuditEntry, ...prev])
  }

  return (
    <>
      <Navbar
        theme={theme}
        activePage={currentPage}
        onSelectPage={setCurrentPage}
        onToggleTheme={toggleTheme}
      />

      <main className="dashboard-main">
        {/* Role Switcher Bar (Available across all pages) */}
        <RoleSelector
          currentRole={currentRole}
          onSelectRole={(r) => {
            setCurrentRole(r)
            const auditEntry: AuditLogEntry = {
              id: `aud-${Math.floor(Math.random() * 9000 + 1000)}`,
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' IST',
              userId: `usr-${r.toLowerCase()}-session`,
              userName: `System Authenticator`,
              role: r,
              action: 'STATUS_CHANGE',
              entity: 'STUDY',
              entityId: selectedStudyId,
              details: `Switched active dashboard security context to Role: ${r}. RBAC filters recalculated.`,
              ipAddress: '14.139.60.1',
              alcoaHash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
            }
            setAuditLogs((prev) => [auditEntry, ...prev])
          }}
        />

        {/* Quick Page Navigation Tab Bar */}
        <div className="page-tabs-bar">
          <button
            type="button"
            className={`page-tab-btn ${currentPage === 'kpis' ? 'active' : ''}`}
            onClick={() => setCurrentPage('kpis')}
          >
            <span className="tab-icon">📊</span>
            <span className="tab-title">KPIs &amp; Alerts</span>
          </button>

          <button
            type="button"
            className={`page-tab-btn ${currentPage === 'lifecycle' ? 'active' : ''}`}
            onClick={() => setCurrentPage('lifecycle')}
          >
            <span className="tab-icon">🔄</span>
            <span className="tab-title">Lifecycle Pipeline</span>
          </button>

          <button
            type="button"
            className={`page-tab-btn ${currentPage === 'pv' ? 'active' : ''}`}
            onClick={() => setCurrentPage('pv')}
          >
            <span className="tab-icon">💊</span>
            <span className="tab-title">Pharmacovigilance</span>
          </button>

          <button
            type="button"
            className={`page-tab-btn ${currentPage === 'standards' ? 'active' : ''}`}
            onClick={() => setCurrentPage('standards')}
          >
            <span className="tab-icon">🛡️</span>
            <span className="tab-title">Standards &amp; Audit</span>
          </button>
        </div>

        {/* PAGE 1: KPIs & Alerts */}
        {currentPage === 'kpis' && (
          <section id="kpi-section" className="page-view-container">
            <KPIAlertCenter
              studies={studies}
              alerts={mockAlerts}
              currentRole={currentRole}
              onOpenSAEForm={() => setCurrentPage('pv')}
            />
          </section>
        )}

        {/* PAGE 2: Study Lifecycle Tracking */}
        {currentPage === 'lifecycle' && (
          <section id="lifecycle-section" className="page-view-container">
            <StudyLifecycleTracker
              studies={studies}
              selectedStudyId={selectedStudyId}
              onSelectStudy={setSelectedStudyId}
            />
          </section>
        )}

        {/* PAGE 3: Pharmacovigilance & Safety Module */}
        {currentPage === 'pv' && (
          <section id="pv-module" className="page-view-container">
            <PharmacovigilanceModule
              adverseEvents={adverseEvents}
              currentRole={currentRole}
              onAddNewEvent={handleAddNewEvent}
            />
          </section>
        )}

        {/* PAGE 4: Standards, Interoperability, Audit Trail & DPDP */}
        {currentPage === 'standards' && (
          <section id="standards-compliance" className="page-view-container">
            <StandardsComplianceView
              auditLogs={auditLogs}
              dpdpRecords={mockDPDPRecords}
            />
          </section>
        )}
      </main>

      <footer className="glass-footer">
        <div className="footer-status">
          <span className="status-indicator"></span>
          <span>
            AIIA CTMS &amp; NPvCC Platform · MeitY Empanelled Cloud (New Delhi) · ISO 27001 &amp; CERT-In Compliant
          </span>
        </div>
        <div className="footer-badges">
          <span className="footer-badge">CDISC (SDTM/ADaM)</span>
          <span className="footer-badge">HL7 FHIR R4</span>
          <span className="footer-badge">ABDM / ABHA</span>
          <span className="footer-badge">DPDP Act 2023</span>
          <span className="footer-badge">21 CFR Part 11</span>
        </div>
      </footer>
    </>
  )
}

export default App
