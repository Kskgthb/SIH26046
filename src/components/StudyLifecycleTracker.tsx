import React, { useState } from 'react'
import type { Study, LifecycleStage, Role } from '../types'

interface StudyLifecycleTrackerProps {
  studies: Study[]
  selectedStudyId: string
  onSelectStudy: (id: string) => void
  currentRole?: Role
}

interface GanttStage {
  stage: LifecycleStage
  order: number
  icon: string
  plannedStart: string
  plannedEnd: string
  actualStart: string
  actualEnd: string
  durationDays: number
  progress: number
  status: 'Completed' | 'In-Progress' | 'Scheduled'
  regulatoryMilestone: string
}

const studyGanttData: Record<string, GanttStage[]> = {
  'study-1': [
    {
      stage: 'Protocol',
      order: 1,
      icon: '📄',
      plannedStart: '2023-08-01',
      plannedEnd: '2023-10-15',
      actualStart: '2023-08-01',
      actualEnd: '2023-10-10',
      durationDays: 70,
      progress: 100,
      status: 'Completed',
      regulatoryMilestone: 'CDISC CDASH eCRF Design Locked',
    },
    {
      stage: 'IEC Approval',
      order: 2,
      icon: '🏛️',
      plannedStart: '2023-10-15',
      plannedEnd: '2023-12-01',
      actualStart: '2023-10-12',
      actualEnd: '2023-11-20',
      durationDays: 39,
      progress: 100,
      status: 'Completed',
      regulatoryMilestone: 'AIIA/IEC/2023/11/48 Clearance Granted',
    },
    {
      stage: 'CTRI Registration',
      order: 3,
      icon: '🇮🇳',
      plannedStart: '2023-12-01',
      plannedEnd: '2024-03-15',
      actualStart: '2023-12-05',
      actualEnd: '2024-03-12',
      durationDays: 98,
      progress: 100,
      status: 'Completed',
      regulatoryMilestone: 'CTRI/2024/03/064219 Public ID Issued',
    },
    {
      stage: 'Site Activation',
      order: 4,
      icon: '🏥',
      plannedStart: '2024-03-15',
      plannedEnd: '2024-05-01',
      actualStart: '2024-03-18',
      actualEnd: '2024-05-02',
      durationDays: 45,
      progress: 100,
      status: 'Completed',
      regulatoryMilestone: '4 Centers Activated (Delhi, Jaipur, Jamnagar, TVM)',
    },
    {
      stage: 'Screening',
      order: 5,
      icon: '🔬',
      plannedStart: '2024-05-01',
      plannedEnd: '2026-11-30',
      actualStart: '2024-05-02',
      actualEnd: 'Ongoing',
      durationDays: 520,
      progress: 88,
      status: 'In-Progress',
      regulatoryMilestone: '512 / 650 Subjects Screened (78.8%)',
    },
    {
      stage: 'Enrolment',
      order: 6,
      icon: '👥',
      plannedStart: '2024-05-15',
      plannedEnd: '2026-12-31',
      actualStart: '2024-05-15',
      actualEnd: 'Ongoing',
      durationDays: 500,
      progress: 76,
      status: 'In-Progress',
      regulatoryMilestone: '382 / 500 Enrolled (12.4% Lag Detected)',
    },
    {
      stage: 'Randomization',
      order: 7,
      icon: '🎲',
      plannedStart: '2024-05-20',
      plannedEnd: '2027-01-15',
      actualStart: '2024-05-20',
      actualEnd: 'Ongoing',
      durationDays: 480,
      progress: 72,
      status: 'In-Progress',
      regulatoryMilestone: '360 Randomized via Centralized IWRS',
    },
    {
      stage: 'Subject Visits',
      order: 8,
      icon: '🗓️',
      plannedStart: '2024-06-01',
      plannedEnd: '2027-04-30',
      actualStart: '2024-06-01',
      actualEnd: 'Ongoing',
      durationDays: 470,
      progress: 64,
      status: 'In-Progress',
      regulatoryMilestone: 'Day 0, 14, 28, 56 & 90 Follow-ups on schedule',
    },
    {
      stage: 'Data Queries & SDV',
      order: 9,
      icon: '🔍',
      plannedStart: '2024-06-15',
      plannedEnd: '2027-06-30',
      actualStart: '2024-06-15',
      actualEnd: 'Ongoing',
      durationDays: 450,
      progress: 82,
      status: 'In-Progress',
      regulatoryMilestone: '82% Source Documents Verified; 28 Open Queries',
    },
    {
      stage: 'Milestones & Close-out',
      order: 10,
      icon: '🏁',
      plannedStart: '2027-05-01',
      plannedEnd: '2027-09-30',
      actualStart: 'Scheduled',
      actualEnd: 'Scheduled',
      durationDays: 150,
      progress: 0,
      status: 'Scheduled',
      regulatoryMilestone: 'Database Lock, CSR & CDISC SDTM Submission',
    },
  ],
}

export const StudyLifecycleTracker: React.FC<StudyLifecycleTrackerProps> = ({
  studies,
  selectedStudyId,
  onSelectStudy,
}) => {
  const [viewMode, setViewMode] = useState<'drilldown' | 'portfolio'>('drilldown')
  const currentStudy = studies.find((s) => s.id === selectedStudyId) || studies[0]
  const [inspectedStage, setInspectedStage] = useState<LifecycleStage>(currentStudy.currentStage)

  const ganttStages = studyGanttData[currentStudy.id] || studyGanttData['study-1']

  return (
    <div className="lifecycle-container">
      {/* Top Header & View Mode Switcher */}
      <div className="lifecycle-header">
        <div className="title-and-select">
          <span className="section-eyebrow">PORTFOLIO DRILL-DOWN &amp; TIMELINE</span>
          <h2 className="widget-title">Clinical Study Lifecycle &amp; Gantt Pipeline</h2>
          <p className="widget-subtitle">
            End-to-end multi-stage trial governance conforming to CDSCO Good Clinical Practice (GCP-ASU) and international ICH-GCP E6(R2) standards.
          </p>
        </div>

        <div className="header-view-toggle">
          <button
            type="button"
            className={`toggle-view-btn ${viewMode === 'drilldown' ? 'active' : ''}`}
            onClick={() => setViewMode('drilldown')}
          >
            🔬 Study Deep Drill-Down
          </button>
          <button
            type="button"
            className={`toggle-view-btn ${viewMode === 'portfolio' ? 'active' : ''}`}
            onClick={() => setViewMode('portfolio')}
          >
            📊 Portfolio Multi-Study View
          </button>
        </div>
      </div>

      {/* VIEW 1: PORTFOLIO MULTI-STUDY VIEW */}
      {viewMode === 'portfolio' && (
        <div className="portfolio-grid-container">
          <h3 className="sub-heading">AIIA Clinical Research Active Trials Portfolio</h3>
          <div className="portfolio-cards-grid">
            {studies.map((study) => (
              <div
                key={study.id}
                className={`portfolio-card ${study.id === selectedStudyId ? 'selected-card' : ''}`}
                onClick={() => {
                  onSelectStudy(study.id)
                  setViewMode('drilldown')
                }}
              >
                <div className="card-top-row">
                  <span className="proto-code font-mono">{study.protocolNumber}</span>
                  <span className={`status-badge ${study.overallStatus.toLowerCase().replace(/ /g, '-')}`}>
                    {study.overallStatus}
                  </span>
                </div>

                <h4 className="study-card-title">{study.shortTitle}</h4>
                <p className="study-therapy-tag font-mono">{study.therapeuticArea}</p>

                <div className="card-progress-bar-wrap">
                  <div className="progress-info">
                    <span>Stage: <strong>{study.currentStage}</strong></span>
                    <span>{study.stageProgressPercent}%</span>
                  </div>
                  <div className="progress-bg">
                    <div
                      className="progress-fill"
                      style={{ width: `${study.stageProgressPercent}%` }}
                    ></div>
                  </div>
                </div>

                <div className="card-metrics-row">
                  <div className="metric-col">
                    <span className="col-lbl">Enrolment:</span>
                    <span className="col-val font-semibold">
                      {study.enrolmentCurrent} / {study.enrolmentTarget}
                    </span>
                  </div>
                  <div className="metric-col">
                    <span className="col-lbl">CTRI ID:</span>
                    <span className="col-val font-mono text-accent">{study.ctriNumber}</span>
                  </div>
                  <div className="metric-col">
                    <span className="col-lbl">Active Sites:</span>
                    <span className="col-val">{study.sites.length} Centers</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-drill-card"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectStudy(study.id)
                    setViewMode('drilldown')
                  }}
                >
                  Inspect Full Lifecycle &amp; Gantt →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: STUDY DEEP DRILL-DOWN (GANTT + 10 STAGES + SITES) */}
      {viewMode === 'drilldown' && (
        <div className="drilldown-wrapper">
          {/* Study Selector Banner */}
          <div className="study-selector-banner">
            <div className="banner-left">
              <span className="tag-selected">SELECTED CLINICAL TRIAL:</span>
              <select
                className="study-dropdown-select font-semibold"
                value={selectedStudyId}
                onChange={(e) => {
                  onSelectStudy(e.target.value)
                  const matched = studies.find((s) => s.id === e.target.value)
                  if (matched) setInspectedStage(matched.currentStage)
                }}
              >
                {studies.map((s) => (
                  <option key={s.id} value={s.id}>
                    [{s.protocolNumber}] {s.shortTitle}
                  </option>
                ))}
              </select>
            </div>

            <div className="banner-stats">
              <div className="stat-unit">
                <span className="stat-label">CTRI Status</span>
                <span className="stat-val font-mono text-accent">{currentStudy.ctriNumber}</span>
              </div>
              <div className="stat-unit">
                <span className="stat-label">Ethics IEC</span>
                <span className="stat-val font-mono">{currentStudy.iecApprovalNumber}</span>
              </div>
              <div className="stat-unit">
                <span className="stat-label">Recruitment</span>
                <span className="stat-val font-bold">
                  {currentStudy.enrolmentCurrent}/{currentStudy.enrolmentTarget}
                  {currentStudy.enrolmentLagPercent > 0 && (
                    <span className="lag-pill"> -{currentStudy.enrolmentLagPercent}% Lag</span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* AI Enrolment Forecast Widget */}
          <div className="ai-forecast-card">
            <div className="forecast-icon">🤖</div>
            <div className="forecast-content">
              <div className="forecast-title-row">
                <h4>AI Predictive Enrolment Velocity Engine</h4>
                <span className="badge-ai-model">ML Model: Bayesian Cohort Projection</span>
              </div>
              <p>
                At current recruitment rate of <strong>18.4 subjects/month</strong> across {currentStudy.sites.length} sites, study is forecasted to achieve 100% target enrolment on <strong>14-March-2027</strong> (38 days after scheduled milestone).
                Recommended booster: Accelerate activation at NIA Jaipur site.
              </p>
            </div>
          </div>

          {/* VISUAL INTERACTIVE GANTT TIMELINE */}
          <div className="gantt-section-card">
            <div className="gantt-header-row">
              <div>
                <span className="gantt-eyebrow">INTERACTIVE SCHEDULE VISUALIZER</span>
                <h3 className="gantt-title">10-Stage Lifecycle Gantt Timeline</h3>
              </div>
              <div className="gantt-legend">
                <span className="legend-item"><span className="legend-box done"></span> Completed</span>
                <span className="legend-item"><span className="legend-box progress"></span> In-Progress</span>
                <span className="legend-item"><span className="legend-box scheduled"></span> Scheduled</span>
              </div>
            </div>

            <div className="gantt-table-wrapper">
              <table className="gantt-table">
                <thead>
                  <tr>
                    <th style={{ width: '22%' }}>Lifecycle Stage</th>
                    <th style={{ width: '12%' }}>Planned Schedule</th>
                    <th style={{ width: '12%' }}>Actual Schedule</th>
                    <th style={{ width: '10%' }}>Progress</th>
                    <th style={{ width: '44%' }}>Visual Gantt Timeline Bar</th>
                  </tr>
                </thead>
                <tbody>
                  {ganttStages.map((g) => (
                    <tr
                      key={g.stage}
                      className={`gantt-row ${inspectedStage === g.stage ? 'inspected-gantt-row' : ''}`}
                      onClick={() => setInspectedStage(g.stage)}
                    >
                      <td className="stage-name-cell">
                        <span className="stage-icon-mini">{g.icon}</span>
                        <div>
                          <strong>{g.order}. {g.stage}</strong>
                          <div className="milestone-sub">{g.regulatoryMilestone}</div>
                        </div>
                      </td>

                      <td className="font-mono text-muted date-cell">
                        {g.plannedStart.substring(5)} → {g.plannedEnd.substring(5)}
                      </td>

                      <td className="font-mono date-cell">
                        <span className={g.status === 'Completed' ? 'text-accent' : ''}>
                          {g.actualStart.substring(5)} → {g.actualEnd === 'Ongoing' ? 'Ongoing' : g.actualEnd.substring(5)}
                        </span>
                      </td>

                      <td>
                        <span className={`progress-badge ${g.status.toLowerCase()}`}>
                          {g.progress}%
                        </span>
                      </td>

                      <td className="gantt-bar-cell">
                        <div className="gantt-bar-track">
                          <div
                            className={`gantt-bar-fill bar-${g.status.toLowerCase()}`}
                            style={{ width: `${Math.max(g.progress, 8)}%` }}
                          >
                            <span className="gantt-bar-text">{g.status} ({g.progress}%)</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* MULTI-CENTRIC SITES BREAKDOWN TABLE */}
          <div className="sites-section-card">
            <div className="sites-header-row">
              <h3 className="sites-title">Multicentric Study Sites Operational Breakdown</h3>
              <span className="sites-sub font-mono">{currentStudy.sites.length} Active Centers</span>
            </div>

            <div className="table-responsive-wrapper">
              <table className="sites-breakdown-table">
                <thead>
                  <tr>
                    <th>Site Name &amp; Location</th>
                    <th>Principal Investigator</th>
                    <th>Enrolment Target vs Actual</th>
                    <th>Progress</th>
                    <th>SDV &amp; Open Queries</th>
                    <th>Last Monitoring Visit</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentStudy.sites.map((site) => {
                    const pct = Math.round((site.currentEnrolment / site.targetEnrolment) * 100)
                    return (
                      <tr key={site.id}>
                        <td>
                          <strong>{site.name}</strong>
                          <div className="site-loc font-mono">{site.location} · {site.id}</div>
                        </td>
                        <td>{site.piName}</td>
                        <td>
                          <span className="font-bold">{site.currentEnrolment}</span> / {site.targetEnrolment}
                        </td>
                        <td>
                          <div className="mini-progress-box">
                            <span>{pct}%</span>
                            <div className="mini-bar">
                              <div
                                className="mini-bar-fill"
                                style={{ width: `${pct}%`, backgroundColor: pct < 70 ? 'var(--critical)' : 'var(--accent)' }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="query-tag">{site.openQueries} Queries</span>
                        </td>
                        <td>
                          <div className="visit-box">
                            <span className="font-mono">{site.lastMonitoringDate}</span>
                            {site.isMonitoringOverdue && (
                              <span className="overdue-tag">⚠️ Overdue</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className="site-status-pill">{site.status}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
