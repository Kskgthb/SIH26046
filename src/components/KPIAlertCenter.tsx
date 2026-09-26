import React from 'react'
import type { Study, Alert, Role } from '../types'

interface KPIAlertCenterProps {
  studies: Study[]
  alerts: Alert[]
  currentRole: Role
  onOpenSAEForm: () => void
}

export const KPIAlertCenter: React.FC<KPIAlertCenterProps> = ({
  studies,
  alerts,
  currentRole,
  onOpenSAEForm,
}) => {
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

  return (
    <div className="kpi-alert-container">
      {/* Top Real-Time KPI Metric Cards */}
      <div className="kpi-cards-grid">
        {/* KPI 1: Enrolment */}
        <div className="kpi-glass-card">
          <div className="kpi-card-header">
            <span className="kpi-tag">ENROLMENT TRAJECTORY</span>
            <span className="kpi-icon">👥</span>
          </div>
          <div className="kpi-main-metric">
            <span className="kpi-number">{totalEnrolled}</span>
            <span className="kpi-divider">/ {totalTarget}</span>
          </div>
          <div className="kpi-bar-wrapper">
            <div
              className="kpi-bar-fill"
              style={{ width: `${Math.round((totalEnrolled / totalTarget) * 100)}%` }}
            ></div>
          </div>
          <div className="kpi-footer-note">
            <span className="kpi-status-badge lag">
              ⚠️ 12.4% Enrolment Lag in Study 1
            </span>
            <span className="kpi-sub-text">Across {studies.length} active trials</span>
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
            1 SAE subject under <strong>7-Day CDSCO Reporting Deadline</strong>
          </p>
          <div className="kpi-footer-action">
            <button
              type="button"
              className="kpi-action-btn-critical"
              onClick={onOpenSAEForm}
            >
              <span>Review Expedited SAE</span>
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
            <span className="kpi-divider">Action Items</span>
          </div>
          <ul className="kpi-compliance-list">
            <li>
              <span className="dot yellow"></span>
              <span>CTRI Bi-Annual Progress Update Due (Study 2)</span>
            </li>
            <li>
              <span className="dot yellow"></span>
              <span>IEC Annual Renewal Dossier Due Oct 2026</span>
            </li>
          </ul>
          <div className="kpi-footer-note">
            <span className="kpi-sub-text">100% GCP-ASU Guidelines Aligned</span>
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
            <span className="badge-pill-monitoring">1 Site Visit Overdue</span>
          </div>
          <div className="kpi-footer-note">
            <span className="kpi-sub-text">ALCOA+ Audit Trail Active</span>
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
                <span className="alert-category-tag">{alertItem.category}</span>
              </div>

              <div className="alert-content-col">
                <div className="alert-top-row">
                  <span className="alert-study-tag">[{alertItem.studyCode}]</span>
                  <h4 className="alert-title">{alertItem.title}</h4>
                  {alertItem.dueDate && (
                    <span className="alert-due-time">
                      ⏱️ Deadline: <strong>{alertItem.dueDate}</strong>
                    </span>
                  )}
                </div>
                <p className="alert-desc">{alertItem.description}</p>
                <div className="alert-action-row">
                  <span className="alert-action-label">Action Required:</span>
                  <span className="alert-action-text">{alertItem.actionRequired}</span>
                </div>
              </div>

              <div className="alert-btn-col">
                <button
                  type="button"
                  className="alert-resolve-btn"
                  onClick={() => window.alert(`Executed workflow trigger for: ${alertItem.title}`)}
                >
                  Resolve Alert
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
