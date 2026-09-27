import React, { useState } from 'react'
import type { Role, Study, AdverseEvent } from '../types'

interface RoleSpecificWorkspaceProps {
  currentRole: Role
  studies: Study[]
  adverseEvents: AdverseEvent[]
  onSwitchRole: (role: Role) => void
  onNavigateToPage: (page: 'kpis' | 'lifecycle' | 'pv' | 'consent' | 'audit' | 'standards') => void
  onApproveESign?: (eventId: string) => void
}

export const RoleSpecificWorkspace: React.FC<RoleSpecificWorkspaceProps> = ({
  currentRole,
  studies,
  adverseEvents,
  onSwitchRole,
  onNavigateToPage,
}) => {
  // Coordinator states
  const [visitSchedule] = useState([
    { id: 'v-101', subjectId: 'AIIA-01-042', visit: 'Visit 4 (Day 28)', window: '2026-09-28 ± 2 days', status: 'Scheduled Today', site: 'AIIA New Delhi', crfPending: 'eCRF Vital Signs & Adverse Events' },
    { id: 'v-102', subjectId: 'AIIA-01-048', visit: 'Visit 2 (Day 7)', window: '2026-09-29 ± 1 day', status: 'Window Tomorrow', site: 'AIIA New Delhi', crfPending: 'eCRF Concomitant Meds' },
    { id: 'v-103', subjectId: 'NIA-02-019', visit: 'Visit 5 (Day 45)', window: '2026-09-25 ± 2 days', status: 'Overdue Window', site: 'NIA Jaipur', crfPending: 'eCRF Hepatic Safety Panel' },
    { id: 'v-104', subjectId: 'ITRA-03-031', visit: 'Visit 3 (Day 14)', window: '2026-10-02 ± 2 days', status: 'Upcoming', site: 'ITRA Jamnagar', crfPending: 'eCRF Cognitive Fatigue Scale' },
  ])

  // Monitor (CRA) SDV & Query State
  const [craQueries, setCraQueries] = useState([
    { id: 'QRY-892', subjectId: 'AIIA-01-042', field: 'AE Onset Time', description: 'Discrepancy between nursing note (14:15) and eCRF (14:30)', status: 'Open', priority: 'High', site: 'AIIA New Delhi' },
    { id: 'QRY-893', subjectId: 'NIA-02-019', field: 'ALT/AST Lab Unit', description: 'Lab report uploaded in U/L, eCRF recorded in µkat/L. Recalibration needed.', status: 'Under Investigation', priority: 'High', site: 'NIA Jaipur' },
    { id: 'QRY-894', subjectId: 'ITRA-03-024', field: 'Concomitant Meds', description: 'Missing stop date for Paracetamol administration', status: 'Answered', priority: 'Medium', site: 'ITRA Jamnagar' },
    { id: 'QRY-895', subjectId: 'TVM-04-012', field: 'Informed Consent Date', description: 'Verified: Signed prior to any study-related screening procedures.', status: 'Closed', priority: 'Low', site: 'Govt Ayurveda College, TVM' },
  ])

  // Ethics Committee (IEC) State
  const [iecReviews] = useState([
    { id: 'IEC-REV-01', study: 'AIIA/CTU/2024/01', item: 'Protocol Amendment #2 (Pharmacokinetics Sub-study)', submitDate: '2026-09-12', type: 'Substantial Amendment', status: 'Under Full Board Review', meetingDate: '2026-10-05' },
    { id: 'IEC-REV-02', study: 'AIIA/CTU/2025/04', item: 'Annual Ethics Approval Re-registration Dossier', submitDate: '2026-09-20', type: 'Annual Renewal', status: 'Expedited Review Pending', meetingDate: '2026-10-02' },
    { id: 'IEC-REV-03', study: 'AIIA/CTU/2024/01', item: 'SAE-2026-001 (Bronchospasm) 7-Day Safety Dossier', submitDate: '2026-09-25', type: 'Expedited SAE Notification', status: 'Reviewed & Acknowledged', meetingDate: 'Immediate' },
  ])

  // PV Queue State
  const [pvCodingQueue] = useState([
    { id: 'COD-101', term: 'Severe Anaphylactoid Bronchospasm', autoLLT: 'Bronchospasm acute', autoPT: 'Bronchospasm', autoSOC: 'Respiratory, thoracic and mediastinal disorders', code: '10006482', confidence: '99.4%', status: 'Coded & Verified' },
    { id: 'COD-102', term: 'Uncontrolled Hypoglycemic Episode', autoLLT: 'Hypoglycaemia adult', autoPT: 'Hypoglycaemia', autoSOC: 'Metabolism and nutrition disorders', code: '10020993', confidence: '98.8%', status: 'Coded & Verified' },
    { id: 'COD-103', term: 'Transient epigastric tenderness', autoLLT: 'Epigastric discomfort', autoPT: 'Dyspepsia', autoSOC: 'Gastrointestinal disorders', code: '10013946', confidence: '94.2%', status: 'Pending PV Sign-off' },
  ])

  const resolveQuery = (id: string) => {
    setCraQueries(prev => prev.map(q => q.id === id ? { ...q, status: q.status === 'Open' ? 'Answered' : 'Closed' } : q))
  }

  return (
    <div className="role-workspace-container">
      {/* Persona Header Banner */}
      <div className="role-workspace-hero">
        <div className="hero-content">
          <div className="hero-tag-row">
            <span className="hero-role-badge">PERSONA WORKSPACE</span>
            <span className="hero-active-tag">Active Context: {currentRole}</span>
          </div>
          <h2 className="hero-title">
            {currentRole === 'PI' && '🩺 Principal Investigator (PI) Control Center'}
            {currentRole === 'Coordinator' && '📋 Clinical Study Coordinator (CRC) Desk'}
            {currentRole === 'Monitor' && '🔍 Clinical Monitor (CRA) SDV & Quality Hub'}
            {currentRole === 'EC' && '🏛️ Institutional Ethics Committee (IEC / IRB) Portal'}
            {currentRole === 'PV' && '💊 National Pharmacovigilance Centre (NPvCC) Queue'}
            {currentRole === 'Admin' && '⚙️ System Administrator & Governance Console'}
            {currentRole === 'Regulator' && '⚖️ Statutory Regulator (CDSCO / CTRI) Audit View'}
          </h2>
          <p className="hero-desc">
            {currentRole === 'PI' && 'Protocol compliance oversight, clinical trial arms progression, participant safety review, and 21 CFR Part 11 statutory sign-offs.'}
            {currentRole === 'Coordinator' && 'Day-to-day subject visits tracking, ±2 days window compliance, pending eCRF data entry, and DPDP digital e-consent management.'}
            {currentRole === 'Monitor' && 'Site Source Data Verification (SDV), discrepancy query lifecycle, GCP monitoring logs, and CRA site visit scheduling.'}
            {currentRole === 'EC' && 'Institutional Ethics Committee approvals, protocol amendment evaluation, annual renewal dossiers, and expedited SAE safety review.'}
            {currentRole === 'PV' && 'MedDRA & WHODrug automated coding queues, 7-day/15-day expedited reporting deadlines, signal detection disproportionality metrics, and DSMB feeds.'}
            {currentRole === 'Admin' && 'ALCOA+ SHA-256 cryptographic audit logs, MeitY cloud data residency, RBAC user provisioning, and Right to Erasure workflows.'}
            {currentRole === 'Regulator' && 'Read-only compliance audit, CDISC Define-XML 2.1 & SDTM 3.4 export verification, HL7 FHIR R4 interop, and CTRI progress audit.'}
          </p>
        </div>
        <div className="hero-persona-switch">
          <label>Quick Switch Persona:</label>
          <div className="quick-switch-buttons">
            {(['PI', 'Coordinator', 'Monitor', 'EC', 'PV', 'Regulator'] as Role[]).map(r => (
              <button
                key={r}
                type="button"
                className={`quick-switch-btn ${currentRole === r ? 'active' : ''}`}
                onClick={() => onSwitchRole(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* VIEW 1: PRINCIPAL INVESTIGATOR (PI) WORKSPACE */}
      {currentRole === 'PI' && (
        <div className="persona-view-body">
          <div className="persona-grid-3">
            <div className="persona-card">
              <div className="pcard-header">
                <span className="pcard-icon">👥</span>
                <h4>Recruitment Portfolio Oversight</h4>
              </div>
              <div className="pcard-metric">
                <span className="big-num">636</span>
                <span className="denom">/ 860 Planned</span>
              </div>
              <p className="pcard-sub">Overall recruitment velocity is 74.0% across 3 active trials. Study 1 has a 12.4% lag at NIA Jaipur site.</p>
              <button type="button" className="pcard-btn" onClick={() => onNavigateToPage('lifecycle')}>
                View Study Gantt &amp; Milestones →
              </button>
            </div>

            <div className="persona-card warning-border">
              <div className="pcard-header">
                <span className="pcard-icon">🚨</span>
                <h4>Safety Review &amp; e-Sign Required</h4>
              </div>
              <div className="pcard-metric">
                <span className="big-num text-danger">1 SAE</span>
                <span className="denom">Pending CDSCO Sign</span>
              </div>
              <p className="pcard-sub">Subject AIIA-01-042 (Severe Bronchospasm). 7-Day statutory clock running (5 days remaining).</p>
              <button type="button" className="pcard-btn btn-danger" onClick={() => onNavigateToPage('pv')}>
                Review &amp; Apply 21 CFR Part 11 e-Sign →
              </button>
            </div>

            <div className="persona-card">
              <div className="pcard-header">
                <span className="pcard-icon">📝</span>
                <h4>Protocol Deviations Log</h4>
              </div>
              <div className="pcard-metric">
                <span className="big-num">5</span>
                <span className="denom">Logged Deviations</span>
              </div>
              <ul className="mini-bullet-list">
                <li>1 Visit Window Out-of-Range (+4 days at ITRA)</li>
                <li>2 Concomitant Ayurvedic syrup without prior notice</li>
                <li>2 Minor blood draw timing variations</li>
              </ul>
              <button type="button" className="pcard-btn" onClick={() => onNavigateToPage('kpis')}>
                Review Deviation Register →
              </button>
            </div>
          </div>

          <div className="persona-section-box">
            <h3>Trial Portfolio Breakdown (Reconciled Data Model)</h3>
            <table className="persona-table">
              <thead>
                <tr>
                  <th>Protocol #</th>
                  <th>Trial Title</th>
                  <th>Phase</th>
                  <th>Current Enrolment</th>
                  <th>Target To-Date Benchmark</th>
                  <th>Status &amp; Action</th>
                </tr>
              </thead>
              <tbody>
                {studies.map(s => (
                  <tr key={s.id}>
                    <td><strong>{s.protocolNumber}</strong></td>
                    <td>{s.shortTitle}</td>
                    <td><span className="badge-tag">{s.phase}</span></td>
                    <td><strong>{s.enrolmentCurrent}</strong> / {s.enrolmentTarget} ({Math.round(s.enrolmentCurrent / s.enrolmentTarget * 100)}%)</td>
                    <td>
                      {s.id === 'study-1' ? '436 (382 actual → -12.4% lag)' : s.id === 'study-2' ? '240 (100% on schedule)' : '14 (Initiation phase)'}
                    </td>
                    <td>
                      <span className={`status-pill ${s.overallStatus === 'Recruiting' ? 'active' : 'info'}`}>
                        {s.overallStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: STUDY COORDINATOR (CRC) WORKSPACE */}
      {currentRole === 'Coordinator' && (
        <div className="persona-view-body">
          <div className="persona-grid-3">
            <div className="persona-card">
              <div className="pcard-header">
                <span className="pcard-icon">📅</span>
                <h4>Today's Subject Visits</h4>
              </div>
              <div className="pcard-metric">
                <span className="big-num">4</span>
                <span className="denom">Active Visits Scheduled</span>
              </div>
              <p className="pcard-sub">1 visit scheduled for today, 1 due tomorrow, 1 visit out of window.</p>
            </div>

            <div className="persona-card">
              <div className="pcard-header">
                <span className="pcard-icon">📋</span>
                <h4>Pending eCRF Data Entry</h4>
              </div>
              <div className="pcard-metric">
                <span className="big-num text-warn">6</span>
                <span className="denom">eCRFs Pending</span>
              </div>
              <p className="pcard-sub">Vital signs, laboratory liver panel &amp; concomitant medication logs await submission.</p>
            </div>

            <div className="persona-card">
              <div className="pcard-header">
                <span className="pcard-icon">📜</span>
                <h4>DPDP e-Consent Status</h4>
              </div>
              <div className="pcard-metric">
                <span className="big-num">100%</span>
                <span className="denom">ABHA Verified</span>
              </div>
              <p className="pcard-sub">All active trial participants onboarded with bilingual digital consent &amp; audio-video backup.</p>
              <button type="button" className="pcard-btn" onClick={() => onNavigateToPage('consent')}>
                Open Consent Management →
              </button>
            </div>
          </div>

          <div className="persona-section-box">
            <div className="section-header-row">
              <h3>Subject Visit Scheduling &amp; Allowable Window Compliance (±2 Days)</h3>
              <span className="badge-tag">GCP Window Tracking Active</span>
            </div>
            <table className="persona-table">
              <thead>
                <tr>
                  <th>Subject ID</th>
                  <th>Scheduled Visit</th>
                  <th>Allowable Window</th>
                  <th>Site Center</th>
                  <th>Pending eCRF Forms</th>
                  <th>Window Status</th>
                </tr>
              </thead>
              <tbody>
                {visitSchedule.map(v => (
                  <tr key={v.id}>
                    <td><strong>{v.subjectId}</strong></td>
                    <td>{v.visit}</td>
                    <td><code>{v.window}</code></td>
                    <td>{v.site}</td>
                    <td><span className="badge-warn">{v.crfPending}</span></td>
                    <td>
                      <span className={`status-pill ${v.status.includes('Today') ? 'active' : v.status.includes('Overdue') ? 'danger' : 'info'}`}>
                        {v.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: CLINICAL MONITOR (CRA) WORKSPACE */}
      {currentRole === 'Monitor' && (
        <div className="persona-view-body">
          <div className="persona-grid-3">
            <div className="persona-card">
              <div className="pcard-header">
                <span className="pcard-icon">🔎</span>
                <h4>Source Data Verification (SDV)</h4>
              </div>
              <div className="pcard-metric">
                <span className="big-num">87.5%</span>
                <span className="denom">Portfolio Average</span>
              </div>
              <p className="pcard-sub">AIIA Delhi (95%), ITRA Jamnagar (88%), NIA Jaipur (68% - Backlog detected).</p>
            </div>

            <div className="persona-card warning-border">
              <div className="pcard-header">
                <span className="pcard-icon">❓</span>
                <h4>Data Query Lifecycle</h4>
              </div>
              <div className="pcard-metric">
                <span className="big-num text-danger">{craQueries.filter(q => q.status === 'Open').length}</span>
                <span className="denom">Open Queries</span>
              </div>
              <p className="pcard-sub">2 critical clinical queries open for medical verification at NIA Jaipur and AIIA Delhi.</p>
            </div>

            <div className="persona-card">
              <div className="pcard-header">
                <span className="pcard-icon">🚗</span>
                <h4>Monitoring Visit Schedule</h4>
              </div>
              <div className="pcard-metric">
                <span className="big-num text-warn">1</span>
                <span className="denom">Visit Overdue</span>
              </div>
              <p className="pcard-sub">Site NIA Jaipur monitoring visit was due on 2026-09-08. Interim remote review active.</p>
            </div>
          </div>

          <div className="persona-section-box">
            <div className="section-header-row">
              <h3>CRA Query Management &amp; Discrepancy Resolution Lifecycle</h3>
              <span className="badge-tag">Open → Under Investigation → Answered → Closed</span>
            </div>
            <table className="persona-table">
              <thead>
                <tr>
                  <th>Query ID</th>
                  <th>Subject</th>
                  <th>Field / Domain</th>
                  <th>Discrepancy Details</th>
                  <th>Site</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {craQueries.map(q => (
                  <tr key={q.id}>
                    <td><code>{q.id}</code></td>
                    <td><strong>{q.subjectId}</strong></td>
                    <td>{q.field}</td>
                    <td>{q.description}</td>
                    <td>{q.site}</td>
                    <td>
                      <span className={`status-pill ${q.status === 'Open' ? 'danger' : q.status === 'Closed' ? 'active' : 'warn'}`}>
                        {q.status}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn-tiny"
                        onClick={() => resolveQuery(q.id)}
                      >
                        {q.status === 'Open' ? 'Mark Answered' : q.status === 'Answered' ? 'Close Query' : 'Re-open'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 4: ETHICS COMMITTEE (IEC) WORKSPACE */}
      {currentRole === 'EC' && (
        <div className="persona-view-body">
          <div className="persona-grid-3">
            <div className="persona-card">
              <div className="pcard-header">
                <span className="pcard-icon">🏛️</span>
                <h4>IEC Approvals Active</h4>
              </div>
              <div className="pcard-metric">
                <span className="big-num">3</span>
                <span className="denom">Protocols Registered</span>
              </div>
              <p className="pcard-sub">All trials registered under CDSCO Ethics Committee Registration ECR/854/Inst/DL/2013/RR-19.</p>
            </div>

            <div className="persona-card warning-border">
              <div className="pcard-header">
                <span className="pcard-icon">⏳</span>
                <h4>Annual Renewal Due</h4>
              </div>
              <div className="pcard-metric">
                <span className="big-num text-danger">6 Days</span>
                <span className="denom">Study 2 Dossier</span>
              </div>
              <p className="pcard-sub">AIIA/CTU/2025/04 re-approval review scheduled before 2026-10-02.</p>
            </div>

            <div className="persona-card">
              <div className="pcard-header">
                <span className="pcard-icon">📑</span>
                <h4>Expedited SAE Reports</h4>
              </div>
              <div className="pcard-metric">
                <span className="big-num">2</span>
                <span className="denom">Reviewed SAEs</span>
              </div>
              <p className="pcard-sub">SAE-2026-001 reviewed by IEC Chair; independent causality confirmation submitted.</p>
            </div>
          </div>

          <div className="persona-section-box">
            <h3>Institutional Ethics Committee (IEC) Dossier Review Queue</h3>
            <table className="persona-table">
              <thead>
                <tr>
                  <th>Review Ref</th>
                  <th>Study Code</th>
                  <th>Submission Item</th>
                  <th>Submission Type</th>
                  <th>Submission Date</th>
                  <th>Scheduled Review</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {iecReviews.map(r => (
                  <tr key={r.id}>
                    <td><code>{r.id}</code></td>
                    <td><strong>{r.study}</strong></td>
                    <td>{r.item}</td>
                    <td><span className="badge-tag">{r.type}</span></td>
                    <td>{r.submitDate}</td>
                    <td>{r.meetingDate}</td>
                    <td>
                      <span className={`status-pill ${r.status.includes('Acknowledged') ? 'active' : 'warn'}`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 5: PHARMACOVIGILANCE (NPvCC) WORKSPACE */}
      {currentRole === 'PV' && (
        <div className="persona-view-body">
          <div className="persona-grid-3">
            <div className="persona-card warning-border">
              <div className="pcard-header">
                <span className="pcard-icon">⏱️</span>
                <h4>7-Day Expedited Clock</h4>
              </div>
              <div className="pcard-metric">
                <span className="big-num text-danger">5 Days</span>
                <span className="denom">Remaining for CDSCO</span>
              </div>
              <p className="pcard-sub">Subject AIIA-01-042 (Severe Bronchospasm). E2B(R3) XML generated; statutory draft pending PI signoff.</p>
              <button type="button" className="pcard-btn btn-danger" onClick={() => onNavigateToPage('pv')}>
                Open PV Safety Desk →
              </button>
            </div>

            <div className="persona-card">
              <div className="pcard-header">
                <span className="pcard-icon">🏷️</span>
                <h4>MedDRA Auto-Coding Engine</h4>
              </div>
              <div className="pcard-metric">
                <span className="big-num">{adverseEvents.length}</span>
                <span className="denom">Active Events Coded</span>
              </div>
              <p className="pcard-sub">{adverseEvents.filter(a => a.isSAE).length} Serious Adverse Events (SAEs) auto-coded (LLT → PT → HLT → SOC hierarchy).</p>
            </div>

            <div className="persona-card">
              <div className="pcard-header">
                <span className="pcard-icon">📊</span>
                <h4>Signal Detection &amp; DSMB Feed</h4>
              </div>
              <div className="pcard-metric">
                <span className="big-num">PRR: 1.14</span>
                <span className="denom">Disproportionality Metric</span>
              </div>
              <p className="pcard-sub">No disproportionality signal detected for Ashwagandha / Guduchi formulation.</p>
              <button type="button" className="pcard-btn" onClick={() => onNavigateToPage('pv')}>
                Inspect Signal Matrix →
              </button>
            </div>
          </div>

          <div className="persona-section-box">
            <h3>NPvCC Real-Time MedDRA Coding Queue (LLT → PT → SOC)</h3>
            <table className="persona-table">
              <thead>
                <tr>
                  <th>Queue ID</th>
                  <th>Reported Clinical Verbatim</th>
                  <th>MedDRA LLT</th>
                  <th>Preferred Term (PT)</th>
                  <th>System Organ Class (SOC)</th>
                  <th>MedDRA Code</th>
                  <th>Confidence</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pvCodingQueue.map(c => (
                  <tr key={c.id}>
                    <td><code>{c.id}</code></td>
                    <td><strong>{c.term}</strong></td>
                    <td>{c.autoLLT}</td>
                    <td><span className="badge-tag">{c.autoPT}</span></td>
                    <td><small>{c.autoSOC}</small></td>
                    <td><code>{c.code}</code></td>
                    <td><span className="badge-tag">{c.confidence}</span></td>
                    <td>
                      <span className={`status-pill ${c.status.includes('Verified') ? 'active' : 'warn'}`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 6: REGULATOR & LEADERSHIP (CDSCO / CTRI / AIIA LEADERSHIP) */}
      {(currentRole === 'Regulator' || currentRole === 'Admin') && (
        <div className="persona-view-body">
          <div className="persona-grid-3">
            <div className="persona-card">
              <div className="pcard-header">
                <span className="pcard-icon">🇮🇳</span>
                <h4>Statutory Compliance Matrix</h4>
              </div>
              <div className="pcard-metric">
                <span className="big-num">100%</span>
                <span className="denom">GCP Conformance</span>
              </div>
              <p className="pcard-sub">Aligned with New Drugs &amp; Clinical Trial Rules 2019, GCP-ASU Guidelines, and DPDP Act 2023.</p>
            </div>

            <div className="persona-card">
              <div className="pcard-header">
                <span className="pcard-icon">💾</span>
                <h4>Submission Ready Datasets</h4>
              </div>
              <div className="pcard-metric">
                <span className="big-num">Define-XML 2.1</span>
                <span className="denom">&amp; SDTM 3.4</span>
              </div>
              <p className="pcard-sub">Automated export packages ready for CDSCO SUGAM &amp; US FDA eCTD Module 4/5 submissions.</p>
              <button type="button" className="pcard-btn" onClick={() => onNavigateToPage('standards')}>
                Inspect CDISC &amp; FHIR Hub →
              </button>
            </div>

            <div className="persona-card">
              <div className="pcard-header">
                <span className="pcard-icon">🔒</span>
                <h4>ALCOA+ Cryptographic Ledger</h4>
              </div>
              <div className="pcard-metric">
                <span className="big-num">SHA-256</span>
                <span className="denom">Immutable WORM</span>
              </div>
              <p className="pcard-sub">Every clinical entry, signature, query, and consent update is cryptographically hashed and chained.</p>
              <button type="button" className="pcard-btn" onClick={() => onNavigateToPage('audit')}>
                Verify Audit Chain →
              </button>
            </div>
          </div>

          <div className="persona-section-box">
            <h3>Trial Portfolio Risk &amp; Compliance Heatmap</h3>
            <table className="persona-table">
              <thead>
                <tr>
                  <th>Trial Protocol</th>
                  <th>CTRI Public ID</th>
                  <th>Recruitment Progress</th>
                  <th>Safety Profile</th>
                  <th>Data Quality (SDV)</th>
                  <th>Ethics Status</th>
                  <th>CDISC Define-XML</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>AIIA/CTU/2024/01</strong> (Phase III Ashwagandha)</td>
                  <td><code>CTRI/2024/03/064219</code></td>
                  <td><span className="badge-warn">382 / 500 (-12.4% lag)</span></td>
                  <td><span className="badge-danger">1 SAE (Under 7-Day Timer)</span></td>
                  <td><span className="badge-tag">82% Verified</span></td>
                  <td><span className="badge-tag">Cleared</span></td>
                  <td><span className="status-pill active">Validated 2.1</span></td>
                </tr>
                <tr>
                  <td><strong>AIIA/CTU/2025/04</strong> (Phase IIb Pre-Diabetes)</td>
                  <td><code>CTRI/2025/02/079812</code></td>
                  <td><span className="badge-tag">240 / 240 (100% Target)</span></td>
                  <td><span className="badge-tag">1 SAE (Hospitalization - Resolved)</span></td>
                  <td><span className="badge-tag">94% Verified</span></td>
                  <td><span className="badge-warn">Renewal Due in 6 Days</span></td>
                  <td><span className="status-pill active">Validated 2.1</span></td>
                </tr>
                <tr>
                  <td><strong>AIIA/CTU/2026/02</strong> (Phase II Oncology Rasayana)</td>
                  <td><code>CTRI/2026/05/088190</code></td>
                  <td><span className="badge-tag">14 / 120 (Initiation)</span></td>
                  <td><span className="badge-tag">0 SAEs</span></td>
                  <td><span className="badge-tag">100% Verified</span></td>
                  <td><span className="badge-tag">Cleared</span></td>
                  <td><span className="status-pill active">Validated 2.1</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
