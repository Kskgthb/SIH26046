import { useState, useEffect } from 'react'
import type { Role, AdverseEvent, Alert, AuditLogEntry, DPDPRecord, DashboardPage } from './types'
import { mockStudies, mockAdverseEvents, mockAlerts, mockAuditTrail, mockDPDPRecords } from './data/mockClinicalData'
import { Navbar } from './components/Navbar'
import { RoleSelector } from './components/RoleSelector'
import { StudyLifecycleTracker } from './components/StudyLifecycleTracker'
import { KPIAlertCenter } from './components/KPIAlertCenter'
import { PharmacovigilanceModule } from './components/PharmacovigilanceModule'
import { ConsentManagementView } from './components/ConsentManagementView'
import { AuditTrailView } from './components/AuditTrailView'
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

  // Multi-Page Navigation State (6 distinct pages)
  const [currentPage, setCurrentPage] = useState<DashboardPage>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '')
      if (
        hash === 'lifecycle' ||
        hash === 'kpis' ||
        hash === 'pv' ||
        hash === 'standards' ||
        hash === 'consent' ||
        hash === 'audit'
      ) {
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

  // DPDP Consent State
  const [dpdpRecords, setDpdpRecords] = useState<DPDPRecord[]>(mockDPDPRecords)

  // Live Alerts State
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)

  // Live Simulated Alert Toast
  const [activeToast, setActiveToast] = useState<{ title: string; message: string; severity: string } | null>(null)

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
      if (
        hash === 'lifecycle' ||
        hash === 'kpis' ||
        hash === 'pv' ||
        hash === 'standards' ||
        hash === 'consent' ||
        hash === 'audit'
      ) {
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
      action: 'CREATE',
      entity: 'AE_SAE',
      entityId: newEvent.id,
      details: `Logged ${newEvent.isSAE ? 'Serious Adverse Event (SAE)' : 'Adverse Event'}: ${newEvent.eventTerm}. Auto-coded MedDRA PT: ${newEvent.meddra.pt} (Code: ${newEvent.meddra.code}). Expedited Statutory Timer initiated.`,
      ipAddress: '14.139.60.28 (AIIA Secure Node)',
      alcoaHash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    }

    setAuditLogs((prev) => [newAuditEntry, ...prev])
  }

  // Handle 21 CFR Part 11 e-Signature on SAE
  const handleApproveEventESign = (eventId: string, signerName: string, reason: string) => {
    setAdverseEvents((prev) =>
      prev.map((ev) => {
        if (ev.id === eventId) {
          return {
            ...ev,
            regulatoryReporting: {
              ...ev.regulatoryReporting,
              cdscoSubmissionStatus: 'Submitted',
              ethicsCommitteeStatus: 'Submitted',
            },
          }
        }
        return ev
      })
    )

    const auditEntry: AuditLogEntry = {
      id: `aud-${Math.floor(Math.random() * 9000 + 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' IST',
      userId: signerName,
      userName: `Dr. Meera Nambiar (NPvCC Lead)`,
      role: currentRole,
      action: 'ELECTRONIC_SIGNATURE',
      entity: 'AE_SAE',
      entityId: eventId,
      details: `Applied 21 CFR Part 11 electronic signature for statutory CDSCO submission. Reason: ${reason}.`,
      oldValue: 'Status: Drafted',
      newValue: 'Status: Submitted to CDSCO SUGAM & Ethics Committee',
      ipAddress: '14.139.60.18',
      alcoaHash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    }

    setAuditLogs((prev) => [auditEntry, ...prev])
    setActiveToast({
      title: '21 CFR Part 11 e-Signature Applied!',
      message: `Report ${eventId} electronically approved & transmitted to CDSCO SUGAM.`,
      severity: 'success',
    })
  }

  // Handle Participant Consent Revocation (DPDP Section 6(7))
  const handleWithdrawConsent = (subjectId: string, reason: string) => {
    setDpdpRecords((prev) =>
      prev.map((r) => {
        if (r.subjectId === subjectId) {
          return { ...r, consentStatus: 'Withdrawn' }
        }
        return r
      })
    )

    const auditEntry: AuditLogEntry = {
      id: `aud-${Math.floor(Math.random() * 9000 + 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' IST',
      userId: `usr-coord-04`,
      userName: `Vikram Joshi (Clinical Coordinator)`,
      role: 'Coordinator',
      action: 'CONSENT_WITHDRAWAL',
      entity: 'CONSENT',
      entityId: subjectId,
      details: `Revocation of digital informed consent under Section 6(7) DPDP Act 2023. Stated reason: ${reason}. Participant dosing halted immediately.`,
      oldValue: 'Consent Status: Active (Signed)',
      newValue: 'Consent Status: Revoked / Withdrawn',
      ipAddress: '14.139.60.22',
      alcoaHash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    }

    setAuditLogs((prev) => [auditEntry, ...prev])
    setActiveToast({
      title: 'Consent Revoked (DPDP Section 6(7))',
      message: `Participant ${subjectId} consent withdrawn. Biological sampling frozen.`,
      severity: 'warning',
    })
  }

  // Handle SIH Live Demo Simulation Alert Triggers
  const handleTriggerDemoAlert = (type: 'sae' | 'lag' | 'ethics') => {
    const timestamp = new Date().toLocaleTimeString()
    let newAlert: Alert

    if (type === 'sae') {
      newAlert = {
        id: `alt-sim-${Date.now()}`,
        severity: 'CRITICAL',
        category: 'PV / SAE Reporting',
        studyId: 'study-1',
        studyCode: 'AIIA/CTU/2024/01',
        title: `🚨 Live Alert (${timestamp}): Acute SAE Occurred at Site NIA Jaipur`,
        description: 'Subject NIA-02-019 reported acute hepatic enzyme elevation (ALT > 5x ULN). 7-day expedited CDSCO notification countdown started.',
        dueDate: 'In 7 Days',
        actionRequired: 'Initiate expedited medical narrative, e-sign safety report, and alert Data Safety Monitoring Board (DSMB).',
        roleAudience: ['PI', 'PV', 'Admin', 'Regulator'],
      }
      setActiveToast({
        title: 'CRITICAL SAE ALERT GENERATED!',
        message: 'Acute hepatic elevation detected at Site NIA Jaipur. 7-Day CDSCO timer active.',
        severity: 'critical',
      })
    } else if (type === 'lag') {
      newAlert = {
        id: `alt-sim-${Date.now()}`,
        severity: 'HIGH',
        category: 'Enrolment Lag',
        studyId: 'study-1',
        studyCode: 'AIIA/CTU/2024/01',
        title: `📉 Live Alert (${timestamp}): Site Enrolment Velocity Dropped -15%`,
        description: 'Monthly recruitment velocity at Site ITRA Jamnagar is 15.2% below protocol target trajectory.',
        actionRequired: 'Issue site recruitment booster memorandum and schedule CRC support review.',
        roleAudience: ['PI', 'Coordinator', 'Admin'],
      }
      setActiveToast({
        title: 'Enrolment Lag Alert',
        message: 'Recruitment deficit of 15% detected at ITRA Jamnagar site.',
        severity: 'warning',
      })
    } else {
      newAlert = {
        id: `alt-sim-${Date.now()}`,
        severity: 'MEDIUM',
        category: 'Ethics & CTRI',
        studyId: 'study-2',
        studyCode: 'AIIA/CTU/2025/04',
        title: `🏛️ Live Alert (${timestamp}): IEC Annual Re-Approval Renewal Required`,
        description: 'Ethics approval dossier must be submitted to Institutional Ethics Committee within 14 calendar days.',
        dueDate: 'In 14 Days',
        actionRequired: 'Upload safety summary and participant status report to IEC portal.',
        roleAudience: ['PI', 'Coordinator', 'EC'],
      }
      setActiveToast({
        title: 'Ethics Renewal Notice',
        message: 'Institutional Ethics Committee annual re-approval filing due in 14 days.',
        severity: 'info',
      })
    }

    setAlerts((prev) => [newAlert, ...prev])

    // Log alert generation to immutable ALCOA+ audit trail
    const auditEntry: AuditLogEntry = {
      id: `aud-${Math.floor(Math.random() * 9000 + 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' IST',
      userId: `sys-alert-engine`,
      userName: `Automated Surveillance Monitor`,
      role: 'Admin',
      action: 'CREATE',
      entity: 'STUDY',
      entityId: newAlert.studyCode,
      details: `Generated live clinical surveillance alert: "${newAlert.title}". Broadcasted to roles: ${newAlert.roleAudience.join(', ')}.`,
      ipAddress: '127.0.0.1 (System Core)',
      alcoaHash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    }
    setAuditLogs((prev) => [auditEntry, ...prev])
  }

  return (
    <>
      <Navbar
        theme={theme}
        activePage={currentPage}
        onSelectPage={setCurrentPage}
        onToggleTheme={toggleTheme}
      />

      {/* Live Toast Notification Banner */}
      {activeToast && (
        <div className={`live-toast-banner ${activeToast.severity}`}>
          <div className="toast-content">
            <span className="toast-icon">
              {activeToast.severity === 'critical' ? '🚨' : activeToast.severity === 'warning' ? '⚠️' : '✓'}
            </span>
            <div>
              <strong>{activeToast.title}</strong>
              <p>{activeToast.message}</p>
            </div>
          </div>
          <button
            type="button"
            className="toast-close"
            onClick={() => setActiveToast(null)}
          >
            ✕
          </button>
        </div>
      )}

      <main className="dashboard-main">
        {/* Role Switcher & Live Demo Simulation Control Bar */}
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
          onTriggerDemoAlert={handleTriggerDemoAlert}
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
            <span className="tab-title">Lifecycle &amp; Gantt</span>
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
            className={`page-tab-btn ${currentPage === 'consent' ? 'active' : ''}`}
            onClick={() => setCurrentPage('consent')}
          >
            <span className="tab-icon">📜</span>
            <span className="tab-title">Consent (DPDP)</span>
          </button>

          <button
            type="button"
            className={`page-tab-btn ${currentPage === 'audit' ? 'active' : ''}`}
            onClick={() => setCurrentPage('audit')}
          >
            <span className="tab-icon">🔒</span>
            <span className="tab-title">ALCOA+ Audit Trail</span>
          </button>

          <button
            type="button"
            className={`page-tab-btn ${currentPage === 'standards' ? 'active' : ''}`}
            onClick={() => setCurrentPage('standards')}
          >
            <span className="tab-icon">🛡️</span>
            <span className="tab-title">Standards &amp; Interop</span>
          </button>
        </div>

        {/* PAGE 1: KPIs & Alerts */}
        {currentPage === 'kpis' && (
          <section id="kpi-section" className="page-view-container">
            <KPIAlertCenter
              studies={studies}
              alerts={alerts}
              currentRole={currentRole}
              onOpenSAEForm={() => setCurrentPage('pv')}
            />
          </section>
        )}

        {/* PAGE 2: Study Lifecycle Tracking & Visual Gantt */}
        {currentPage === 'lifecycle' && (
          <section id="lifecycle-section" className="page-view-container">
            <StudyLifecycleTracker
              studies={studies}
              selectedStudyId={selectedStudyId}
              onSelectStudy={setSelectedStudyId}
              currentRole={currentRole}
            />
          </section>
        )}

        {/* PAGE 3: Pharmacovigilance & Safety Module (MedDRA + e-Sign) */}
        {currentPage === 'pv' && (
          <section id="pv-module" className="page-view-container">
            <PharmacovigilanceModule
              adverseEvents={adverseEvents}
              currentRole={currentRole}
              onAddNewEvent={handleAddNewEvent}
              onApproveEventESign={handleApproveEventESign}
            />
          </section>
        )}

        {/* PAGE 4: Consent Management (DPDP Act 2023) */}
        {currentPage === 'consent' && (
          <section id="consent-section" className="page-view-container">
            <ConsentManagementView
              dpdpRecords={dpdpRecords}
              currentRole={currentRole}
              onWithdrawConsent={handleWithdrawConsent}
            />
          </section>
        )}

        {/* PAGE 5: Dedicated ALCOA+ Audit Trail Ledger */}
        {currentPage === 'audit' && (
          <section id="audit-section" className="page-view-container">
            <AuditTrailView
              auditLogs={auditLogs}
              currentRole={currentRole}
            />
          </section>
        )}

        {/* PAGE 6: Standards, Interoperability (CDISC, FHIR R4, ABDM) */}
        {currentPage === 'standards' && (
          <section id="standards-compliance" className="page-view-container">
            <StandardsComplianceView
              auditLogs={auditLogs}
              dpdpRecords={dpdpRecords}
              onNavigateToAudit={() => setCurrentPage('audit')}
              onNavigateToConsent={() => setCurrentPage('consent')}
            />
          </section>
        )}
      </main>

      <footer className="glass-footer">
        <div className="footer-status">
          <span className="status-indicator"></span>
          <span>
            AIIA CTMS &amp; NPvCC Platform v3.0 · MeitY Empanelled Cloud (New Delhi) · ISO 27001 &amp; CERT-In Compliant
          </span>
        </div>
        <div className="footer-badges">
          <span className="footer-badge">CDISC (SDTM/ADaM)</span>
          <span className="footer-badge">HL7 FHIR R4</span>
          <span className="footer-badge">ABDM / ABHA M1-M3</span>
          <span className="footer-badge">DPDP Act 2023 Sec 6</span>
          <span className="footer-badge">21 CFR Part 11 e-Sign</span>
          <span className="footer-badge">ALCOA+ Immutable Ledger</span>
        </div>
      </footer>
    </>
  )
}

export default App
