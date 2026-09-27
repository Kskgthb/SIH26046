import React, { useState } from 'react'
import type { Study, Alert, Role } from '../types'

interface KPIAlertCenterProps {
  studies: Study[]
  alerts: Alert[]
  currentRole: Role
  onOpenSAEForm: () => void
  onSelectStudy?: (studyId: string) => void
  onNavigateToPage?: (page: 'workspace' | 'kpis' | 'lifecycle' | 'pv' | 'consent' | 'audit' | 'standards') => void
}

export const KPIAlertCenter: React.FC<KPIAlertCenterProps> = ({
  studies,
  alerts,
  currentRole,
  onOpenSAEForm,
  onNavigateToPage,
}) => {
  const [selectedStudyTab, setSelectedStudyTab] = useState<string>('study-1')

  const totalEnrolled = studies.reduce((acc, s) => acc + s.enrolmentCurrent, 0)
  const totalTarget = studies.reduce((acc, s) => acc + s.enrolmentTarget, 0)
  const totalSAEs = studies.reduce((acc, s) => acc + s.activeSAEsCount, 0)
  const totalOpenQueries = studies.reduce((acc, s) => acc + s.totalOpenQueries, 0)
  const avgSdv = Math.round(
    studies.reduce((acc, s) => acc + s.sdvCompletedPercent, 0) / studies.length
  )

  // Filter alerts applicable to current role
  const relevantAlerts = alerts.filter(
    (a) => a.roleAudience.includes(currentRole) || currentRole === 'Admin'
  )

  const activeStudy = studies.find((s) => s.id === selectedStudyTab) || studies[0]

  return (
    <div className="kpi-alert-container">
      {/* 7-PILLAR ARCHITECTURE & COMPLIANCE COMMAND MATRIX */}
      <div className="platform-compliance-hub-card">
        <div className="hub-top-row">
          <div className="hub-title-group">
            <span className="hub-eyebrow">STANDARDS-FIRST CTMS &amp; PHARMACOVIGILANCE PLATFORM</span>
            <h3 className="hub-headline">National Clinical Trial &amp; Safety Compliance Architecture</h3>
            <p className="hub-subline">
              Comprehensive regulatory implementation conforming to CDISC standards, HL7 FHIR R4, ABDM (M1-M3), DPDP Act 2023, ALCOA+ cryptographic ledger, and 21 CFR Part 11 electronic records.
            </p>
          </div>
          <div className="hub-cert-badges">
            <span className="badge-tag">GAMP 5 CSV</span>
            <span className="badge-tag">ISO 27001</span>
            <span className="badge-tag">CERT-In AUDITED</span>
          </div>
        </div>

        <div className="hub-pillars-grid">
          {/* Pillar 1: Standards */}
          <div className="hub-pillar-box">
            <div className="pillar-header">
              <span className="pillar-ico">🛡️</span>
              <div>
                <h5>1. Standards-First Architecture</h5>
                <span className="pillar-tag font-mono">CDISC · FHIR · ABDM</span>
              </div>
            </div>
            <ul className="pillar-specs">
              <li>✓ <strong>CDISC CDASH v2.2</strong> eCRF domain models</li>
              <li>✓ <strong>CDISC SDTM v3.4</strong> &amp; <strong>ADaM</strong> datasets</li>
              <li>✓ <strong>Define-XML v2.1</strong> &amp; <strong>ODM 1.3.2</strong> export</li>
              <li>✓ <strong>HL7 FHIR R4</strong> ResearchStudy &amp; AdverseEvent APIs</li>
              <li>✓ <strong>ABDM Gateway</strong> (ABHA M1, HPR M2, HIU/HIP M3)</li>
            </ul>
            {onNavigateToPage && (
              <button
                type="button"
                className="pillar-action-btn"
                onClick={() => onNavigateToPage('standards')}
              >
                Inspect CDISC Datasets &amp; FHIR Console →
              </button>
            )}
          </div>

          {/* Pillar 2: Full Lifecycle */}
          <div className="hub-pillar-box">
            <div className="pillar-header">
              <span className="pillar-ico">🔄</span>
              <div>
                <h5>2. Full Study Lifecycle</h5>
                <span className="pillar-tag font-mono">10 Stages · Protocol to Close-out</span>
              </div>
            </div>
            <ul className="pillar-specs">
              <li>✓ <strong>Protocol Versioning</strong> (v1.0 to v2.1 approved)</li>
              <li>✓ <strong>IEC Approval Workflow</strong> &amp; annual renewal</li>
              <li>✓ <strong>CTRI Registration</strong> (CTRI/2024/03/064219)</li>
              <li>✓ <strong>Site Activation Checklist</strong> (4 multicentric sites)</li>
              <li>✓ <strong>Block Randomization</strong> (Stratified IWRS)</li>
              <li>✓ <strong>Visit Schedule</strong> &amp; ±2d window compliance</li>
            </ul>
            {onNavigateToPage && (
              <button
                type="button"
                className="pillar-action-btn"
                onClick={() => onNavigateToPage('lifecycle')}
              >
                Open 10-Stage Lifecycle &amp; Gantt →
              </button>
            )}
          </div>

          {/* Pillar 3: Pharmacovigilance */}
          <div className="hub-pillar-box">
            <div className="pillar-header">
              <span className="pillar-ico">💊</span>
              <div>
                <h5>3. Deep Pharmacovigilance</h5>
                <span className="pillar-tag font-mono">NPvCC Safety Desk</span>
              </div>
            </div>
            <ul className="pillar-specs">
              <li>✓ <strong>MedDRA v27.0</strong> auto-coder (LLT → PT → SOC)</li>
              <li>✓ <strong>WHODrug Dictionaries</strong> for concomitant meds</li>
              <li>✓ <strong>7/15/90-Day Statutory Timers</strong> for CDSCO SUGAM</li>
              <li>✓ <strong>Signal Detection</strong> (PRR &amp; ROR disproportionality)</li>
              <li>✓ <strong>Naranjo Algorithm</strong> interactive causality</li>
              <li>✓ <strong>21 CFR Part 11</strong> electronic signature dialog</li>
            </ul>
            {onNavigateToPage && (
              <button
                type="button"
                className="pillar-action-btn highlight-btn"
                onClick={() => onNavigateToPage('pv')}
              >
                Open PV Safety &amp; MedDRA Desk →
              </button>
            )}
          </div>

          {/* Pillar 4: Security & DPDP */}
          <div className="hub-pillar-box">
            <div className="pillar-header">
              <span className="pillar-ico">📜</span>
              <div>
                <h5>4. DPDP Act 2023 &amp; Security</h5>
                <span className="pillar-tag font-mono">MeitY Cloud · Section 6</span>
              </div>
            </div>
            <ul className="pillar-specs">
              <li>✓ <strong>DPDP Act 2023 &amp; 2025 Rules</strong> compliance</li>
              <li>✓ <strong>Bilingual Consent</strong> (Hindi / English dual script)</li>
              <li>✓ <strong>Section 12 Right to Erasure</strong> retention workflow</li>
              <li>✓ <strong>MeitY-Empanelled Cloud</strong> (New Delhi/Mumbai)</li>
              <li>✓ <strong>AES-256 Encryption</strong> at rest &amp; TLS 1.3 in transit</li>
            </ul>
            {onNavigateToPage && (
              <button
                type="button"
                className="pillar-action-btn"
                onClick={() => onNavigateToPage('consent')}
              >
                Open DPDP Consent Management →
              </button>
            )}
          </div>

          {/* Pillar 5: Multi-Persona Workspaces */}
          <div className="hub-pillar-box">
            <div className="pillar-header">
              <span className="pillar-ico">👥</span>
              <div>
                <h5>5. Role-Tailored Workspaces</h5>
                <span className="pillar-tag font-mono">7 Distinct Personas</span>
              </div>
            </div>
            <ul className="pillar-specs">
              <li>✓ <strong>Coordinator Desk</strong>: Visits, windows, pending eCRFs</li>
              <li>✓ <strong>Monitor (CRA) Hub</strong>: SDV status, query lifecycle</li>
              <li>✓ <strong>Ethics (IEC) Portal</strong>: Amendments, renewal dossiers</li>
              <li>✓ <strong>PV Queue</strong>: MedDRA queue, expedited 7-day clocks</li>
              <li>✓ <strong>Regulator View</strong>: Read-only audit &amp; risk heatmap</li>
              <li>✓ <strong>Admin &amp; PI Centers</strong>: Governance &amp; trial oversight</li>
            </ul>
            {onNavigateToPage && (
              <button
                type="button"
                className="pillar-action-btn"
                onClick={() => onNavigateToPage('workspace')}
              >
                Switch to Role Workspace ({currentRole}) →
              </button>
            )}
          </div>

          {/* Pillar 6: ALCOA+ Audit & Validation */}
          <div className="hub-pillar-box">
            <div className="pillar-header">
              <span className="pillar-ico">🔒</span>
              <div>
                <h5>6. ALCOA+ &amp; GCP CSV Validation</h5>
                <span className="pillar-tag font-mono">GAMP 5 · SHA-256 Ledger</span>
              </div>
            </div>
            <ul className="pillar-specs">
              <li>✓ <strong>ALCOA+ Principle</strong>: Attributable, Legible, Contemporaneous</li>
              <li>✓ <strong>SHA-256 Immutable Hash Chain</strong> (WORM ledger)</li>
              <li>✓ <strong>GCP CSV (IQ/OQ/PQ)</strong> formal qualification matrix</li>
              <li>✓ <strong>Validation Certificate</strong>: AIIA-CSV-2026-CERT-091</li>
              <li>✓ <strong>Audit Completeness</strong>: Zero untracked changes</li>
            </ul>
            {onNavigateToPage && (
              <button
                type="button"
                className="pillar-action-btn"
                onClick={() => onNavigateToPage('audit')}
              >
                Verify ALCOA+ Immutable Chain →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Top Real-Time KPI Metric Cards */}
      <div className="kpi-cards-grid">
        {/* KPI 1: Enrolment */}
        <div className="kpi-glass-card">
          <div className="kpi-card-header">
            <span className="kpi-tag">PORTFOLIO ENROLMENT TRAJECTORY</span>
            <span className="kpi-icon">👥</span>
          </div>
          <div className="kpi-main-metric">
            <span className="kpi-number">{totalEnrolled}</span>
            <span className="kpi-divider">/ {totalTarget} (74.0%)</span>
          </div>
          <div className="kpi-bar-wrapper">
            <div
              className="kpi-bar-fill"
              style={{ width: `${Math.round((totalEnrolled / totalTarget) * 100)}%` }}
            ></div>
          </div>
          <div className="kpi-footer-note">
            <span className="kpi-status-badge lag">
              ⚠️ 12.4% Lag in Study 1 (382 vs 436 Benchmark)
            </span>
            <span className="kpi-sub-text">Across 3 active multi-center trials</span>
          </div>
        </div>

        {/* KPI 2: Pharmacovigilance */}
        <div className="kpi-glass-card highlight-pv">
          <div className="kpi-card-header">
            <span className="kpi-tag">PHARMACOVIGILANCE &amp; SAEs</span>
            <span className="kpi-icon">🚨</span>
          </div>
          <div className="kpi-main-metric">
            <span className="kpi-number text-critical">{totalSAEs}</span>
            <span className="kpi-badge-critical">Expedited Action</span>
          </div>
          <p className="kpi-pv-headline">
            Subject <strong>AIIA-01-042</strong> under <strong>7-Day CDSCO Reporting Deadline</strong> (5 days left)
          </p>
          <div className="kpi-footer-action">
            <button
              type="button"
              className="kpi-action-btn-critical"
              onClick={onOpenSAEForm}
            >
              <span>Review Expedited SAE Desk</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* KPI 3: Ethics & CTRI */}
        <div className="kpi-glass-card">
          <div className="kpi-card-header">
            <span className="kpi-tag">ETHICS &amp; CTRI MILESTONES</span>
            <span className="kpi-icon">🏛️</span>
          </div>
          <div className="kpi-main-metric">
            <span className="kpi-number text-warn">2</span>
            <span className="kpi-divider">Statutory Deadlines</span>
          </div>
          <ul className="kpi-compliance-list">
            <li>
              <span className="dot yellow"></span>
              <span>Study 2 (AIIA/CTU/2025/04): IEC Renewal Due in 6 Days</span>
            </li>
            <li>
              <span className="dot yellow"></span>
              <span>Study 2 (CTRI/2025/02/079812): Bi-Annual Milestone Overdue</span>
            </li>
          </ul>
          <div className="kpi-footer-note">
            <span className="kpi-sub-text">100% CDSCO NDCT Rules 2019 Aligned</span>
          </div>
        </div>

        {/* KPI 4: Quality & Monitoring (SDV) */}
        <div className="kpi-glass-card">
          <div className="kpi-card-header">
            <span className="kpi-tag">DATA QUALITY &amp; SDV</span>
            <span className="kpi-icon">🔍</span>
          </div>
          <div className="kpi-main-metric">
            <span className="kpi-number">{avgSdv}%</span>
            <span className="kpi-sub-label">SDV Verified</span>
          </div>
          <div className="kpi-queries-status">
            <span className="badge-pill-queries">{totalOpenQueries} Open Data Queries</span>
            <span className="badge-pill-monitoring">1 Site Visit Overdue (NIA Jaipur)</span>
          </div>
          <div className="kpi-footer-note">
            <span className="kpi-sub-text">ALCOA+ Cryptographic Ledger Active</span>
          </div>
        </div>
      </div>

      {/* RECONCILED ENROLMENT MATH & PORTFOLIO BREAKDOWN */}
      <div className="enrolment-reconciliation-card">
        <div className="reconcile-header">
          <div className="rec-title-group">
            <span className="badge-tag">RECONCILED CLINICAL DATA MODEL</span>
            <h4>Total Enrolment Portfolio Reconciled: 636 / 860 Enrolled (74.0%)</h4>
          </div>
          <span className="rec-sub font-mono">
            382 (Study 1) + 240 (Study 2) + 14 (Study 3) = 636 Subjects Total
          </span>
        </div>

        <div className="study-reconciliation-grid">
          {studies.map((s) => (
            <div
              key={s.id}
              className={`study-rec-box ${selectedStudyTab === s.id ? 'active' : ''}`}
              onClick={() => setSelectedStudyTab(s.id)}
            >
              <div className="rec-box-top">
                <span className="font-mono text-muted">{s.protocolNumber}</span>
                <span className={`status-pill ${s.overallStatus === 'Recruiting' ? 'active' : 'info'}`}>
                  {s.overallStatus}
                </span>
              </div>
              <h5>{s.shortTitle}</h5>
              <div className="rec-progress-row">
                <span>Enrolment: <strong>{s.enrolmentCurrent}</strong> / {s.enrolmentTarget}</span>
                <span className="font-mono">{Math.round((s.enrolmentCurrent / s.enrolmentTarget) * 100)}%</span>
              </div>
              <div className="mini-bar">
                <div
                  className="mini-bar-fill"
                  style={{
                    width: `${Math.round((s.enrolmentCurrent / s.enrolmentTarget) * 100)}%`,
                    backgroundColor: s.enrolmentLagPercent > 0 ? 'var(--critical)' : 'var(--accent)',
                  }}
                ></div>
              </div>
              <div className="rec-note-sub">
                {s.id === 'study-1' && (
                  <span className="text-danger">⚠️ Benchmark to date: 436 (-12.4% recruitment lag)</span>
                )}
                {s.id === 'study-2' && (
                  <span className="text-accent">✓ 100% Target Met (240/240). Active visits ongoing.</span>
                )}
                {s.id === 'study-3' && (
                  <span className="text-muted">Initiation &amp; Site activation phase</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Selected Study Deep Info Banner */}
        <div className="selected-study-details-strip">
          <div className="details-col">
            <label>Selected Study:</label>
            <strong>{activeStudy.title}</strong>
          </div>
          <div className="details-meta-grid font-mono">
            <div><span>CTRI ID:</span> <strong>{activeStudy.ctriNumber}</strong></div>
            <div><span>IEC Ref:</span> <strong>{activeStudy.iecApprovalNumber}</strong></div>
            <div><span>Active Sites:</span> <strong>{activeStudy.sites.length} Centers</strong></div>
            <div><span>Screening Yield:</span> <strong>{activeStudy.screeningCurrent} / {activeStudy.screeningTarget}</strong></div>
          </div>
        </div>
      </div>

      {/* Real-time Alerts Action Center */}
      <div className="alerts-action-panel">
        <div className="alerts-panel-header">
          <div className="alerts-title-group">
            <span className="alerts-pulse-icon">🔔</span>
            <h3 className="alerts-heading">
              Active Alerts &amp; Non-Compliance Notifications
            </h3>
            <span className="alerts-count-badge">{relevantAlerts.length} For {currentRole}</span>
          </div>
          <span className="alerts-filter-hint">
            Showing high-priority triggers for persona: <strong>{currentRole}</strong>
          </span>
        </div>

        <div className="alerts-list">
          {relevantAlerts.map((alertItem) => (
            <div
              key={alertItem.id}
              className={`alert-item-card severity-${alertItem.severity.toLowerCase()}`}
            >
              <div className="alert-badge-col">
                <span className={`alert-severity-badge ${alertItem.severity.toLowerCase()}`}>
                  {alertItem.severity}
                </span>
                <span className="alert-cat-pill">{alertItem.category}</span>
              </div>

              <div className="alert-details-col">
                <div className="alert-headline-row">
                  <h4 className="alert-item-title">{alertItem.title}</h4>
                  <span className="alert-study-tag font-mono">{alertItem.studyCode}</span>
                </div>
                <p className="alert-item-desc">{alertItem.description}</p>
                <div className="alert-action-strip">
                  <span className="action-label">Action Required:</span>
                  <span className="action-text">{alertItem.actionRequired}</span>
                </div>
              </div>

              <div className="alert-actions-col">
                {alertItem.dueDate && (
                  <span className="alert-due-date font-mono">Due: {alertItem.dueDate}</span>
                )}
                {alertItem.category === 'PV / SAE Reporting' && (
                  <button
                    type="button"
                    className="btn-alert-action-primary"
                    onClick={onOpenSAEForm}
                  >
                    Take Action →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
