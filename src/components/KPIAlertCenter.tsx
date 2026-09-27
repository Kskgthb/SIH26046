import React, { useState } from 'react'
import type { Study, Alert, Role } from '../types'

interface KPIAlertCenterProps {
  studies: Study[]
  alerts: Alert[]
  currentRole: Role
  onOpenSAEForm: () => void
  onSelectStudy?: (studyId: string) => void
}

export const KPIAlertCenter: React.FC<KPIAlertCenterProps> = ({
  studies,
  alerts,
  currentRole,
  onOpenSAEForm,
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
