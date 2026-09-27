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
      regulatoryMilestone: 'CDISC CDASH eCRF Design Locked (v2.1 Approved)',
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
      regulatoryMilestone: 'AIIA/IEC/2023/11/48 Clearance Granted (ECR/854/Inst/DL)',
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
      regulatoryMilestone: 'CTRI/2024/03/064219 Public ID Issued & Active',
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
      regulatoryMilestone: '4 Centers Green-Lighted (Delhi, Jaipur, Jamnagar, TVM)',
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
      regulatoryMilestone: '512 / 650 Subjects Screened (78.8% Eligibility Yield)',
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
      regulatoryMilestone: '382 / 500 Enrolled (12.4% Lag vs 436 Benchmark)',
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
      regulatoryMilestone: '360 Randomized via Centralized Stratified IWRS',
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
      regulatoryMilestone: 'Day 0, 7, 14, 28, 56 & 90 Follow-ups on schedule (±2d window)',
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
      regulatoryMilestone: 'Database Lock, CSR & CDISC SDTM 15-Year Archival',
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
  const [activeStageTab, setActiveStageTab] = useState<
    'gantt' | 'protocol' | 'iec' | 'ctri' | 'activation' | 'screening' | 'randomization' | 'visits' | 'queries' | 'closeout'
  >('gantt')

  const ganttStages = studyGanttData[currentStudy.id] || studyGanttData['study-1']

  // Interactive Randomization Simulator State
  const [randSite, setRandSite] = useState('site-101')
  const [randAgeGroup, setRandAgeGroup] = useState('<45')
  const [randFatigueGrade, setRandFatigueGrade] = useState('Moderate')
  const [randomizationResult, setRandomizationResult] = useState<{
    subjectId: string
    kitId: string
    allocation: string
    stratum: string
    timestamp: string
    hash: string
  } | null>(null)

  // Interactive Screening Checklist State
  const [screenAge, setScreenAge] = useState(38)
  const [screenConsentSigned, setScreenConsentSigned] = useState(true)
  const [screenFatigueMonths, setScreenFatigueMonths] = useState(4)
  const [screenSevereComorbidity, setScreenSevereComorbidity] = useState(false)
  const [screenPregnant, setScreenPregnant] = useState(false)

  const isScreeningEligible =
    screenAge >= 18 &&
    screenAge <= 65 &&
    screenConsentSigned &&
    screenFatigueMonths >= 3 &&
    !screenSevereComorbidity &&
    !screenPregnant

  const handleSimulateRandomization = () => {
    const nextSeq = Math.floor(Math.random() * 800 + 100)
    const subjId = `AIIA-01-${nextSeq}`
    const kitCode = `KIT-BLIND-${Math.floor(Math.random() * 90000 + 10000)}`
    const isArmA = Math.random() > 0.5
    setRandomizationResult({
      subjectId: subjId,
      kitId: kitCode,
      allocation: isArmA ? 'Arm A (Double-Blind Active Formulation)' : 'Arm B (Double-Blind Placebo Control)',
      stratum: `Age: ${randAgeGroup} | Baseline Fatigue: ${randFatigueGrade} | Site: ${randSite}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' IST',
      hash: Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    })
  }

  return (
    <div className="lifecycle-container">
      {/* Top Header & View Mode Switcher */}
      <div className="lifecycle-header">
        <div className="title-and-select">
          <span className="section-eyebrow">FULL CLINICAL STUDY LIFECYCLE MANAGEMENT</span>
          <h2 className="widget-title">Clinical Study Lifecycle &amp; CTMS Workflow Suite</h2>
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

      {/* VIEW 2: STUDY DEEP DRILL-DOWN */}
      {viewMode === 'drilldown' && (
        <div className="drilldown-wrapper">
          {/* Study Selector Banner */}
          <div className="study-selector-banner">
            <div className="banner-left">
              <span className="tag-selected">SELECTED CLINICAL TRIAL:</span>
              <select
                className="study-dropdown-select font-semibold"
                value={selectedStudyId}
                onChange={(e) => onSelectStudy(e.target.value)}
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

          {/* Lifecycle Stages Sub-Tabs Bar */}
          <div className="lifecycle-subtabs-bar">
            <button
              type="button"
              className={`stage-nav-pill ${activeStageTab === 'gantt' ? 'active' : ''}`}
              onClick={() => setActiveStageTab('gantt')}
            >
              📊 Gantt Timeline
            </button>
            <button
              type="button"
              className={`stage-nav-pill ${activeStageTab === 'protocol' ? 'active' : ''}`}
              onClick={() => setActiveStageTab('protocol')}
            >
              📄 Protocol &amp; Versioning
            </button>
            <button
              type="button"
              className={`stage-nav-pill ${activeStageTab === 'iec' ? 'active' : ''}`}
              onClick={() => setActiveStageTab('iec')}
            >
              🏛️ IEC Workflow
            </button>
            <button
              type="button"
              className={`stage-nav-pill ${activeStageTab === 'ctri' ? 'active' : ''}`}
              onClick={() => setActiveStageTab('ctri')}
            >
              🇮🇳 CTRI Register
            </button>
            <button
              type="button"
              className={`stage-nav-pill ${activeStageTab === 'activation' ? 'active' : ''}`}
              onClick={() => setActiveStageTab('activation')}
            >
              🏥 Site Activation
            </button>
            <button
              type="button"
              className={`stage-nav-pill ${activeStageTab === 'screening' ? 'active' : ''}`}
              onClick={() => setActiveStageTab('screening')}
            >
              🔬 Screening &amp; I/E
            </button>
            <button
              type="button"
              className={`stage-nav-pill ${activeStageTab === 'randomization' ? 'active' : ''}`}
              onClick={() => setActiveStageTab('randomization')}
            >
              🎲 Randomization &amp; IWRS
            </button>
            <button
              type="button"
              className={`stage-nav-pill ${activeStageTab === 'visits' ? 'active' : ''}`}
              onClick={() => setActiveStageTab('visits')}
            >
              🗓️ Visits &amp; Windows
            </button>
            <button
              type="button"
              className={`stage-nav-pill ${activeStageTab === 'queries' ? 'active' : ''}`}
              onClick={() => setActiveStageTab('queries')}
            >
              🔍 Data Queries
            </button>
            <button
              type="button"
              className={`stage-nav-pill ${activeStageTab === 'closeout' ? 'active' : ''}`}
              onClick={() => setActiveStageTab('closeout')}
            >
              🏁 Close-out &amp; Archival
            </button>
          </div>

          {/* TAB 1: GANTT CHART */}
          {activeStageTab === 'gantt' && (
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
                      <tr key={g.stage} className="gantt-row">
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
          )}

          {/* TAB 2: PROTOCOL DEVELOPMENT & VERSIONING */}
          {activeStageTab === 'protocol' && (
            <div className="ctms-stage-panel">
              <div className="panel-title-block">
                <h3>📄 Protocol Development, Version Control &amp; Substantial Amendments</h3>
                <p>Full audit trail of protocol versions under 21 CFR Part 312.30 &amp; CDSCO NDCT Rules 2019.</p>
              </div>
              <table className="persona-table">
                <thead>
                  <tr>
                    <th>Version</th>
                    <th>Effective Date</th>
                    <th>Type of Change</th>
                    <th>Key Amendment Summary</th>
                    <th>IEC Approval</th>
                    <th>CDSCO Filing</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>v2.1 (Current)</strong></td>
                    <td>2025-06-10</td>
                    <td><span className="badge-tag">Administrative</span></td>
                    <td>Updated contact details of National Pharmacovigilance Centre (NPvCC) and safety hotline.</td>
                    <td>AIIA/IEC/2025/06/18</td>
                    <td>Acknowledged</td>
                    <td><span className="status-pill active">Active &amp; Locked</span></td>
                  </tr>
                  <tr>
                    <td><strong>v2.0</strong></td>
                    <td>2024-11-15</td>
                    <td><span className="badge-tag">Substantial Amendment</span></td>
                    <td>Added pharmacokinetic (PK) sub-study sampling cohort (N=60) and extended follow-up window to 90 days.</td>
                    <td>AIIA/IEC/2024/11/04</td>
                    <td>Approved (SUGAM)</td>
                    <td><span className="status-pill info">Superseded</span></td>
                  </tr>
                  <tr>
                    <td><strong>v1.2</strong></td>
                    <td>2024-02-18</td>
                    <td><span className="badge-tag">Minor Amendment</span></td>
                    <td>Clarification of allowable visit window margins (±2 calendar days) for Visit 3 and Visit 4.</td>
                    <td>AIIA/IEC/2024/02/22</td>
                    <td>Notified</td>
                    <td><span className="status-pill info">Superseded</span></td>
                  </tr>
                  <tr>
                    <td><strong>v1.0 (Initial)</strong></td>
                    <td>2023-08-01</td>
                    <td><span className="badge-tag">Initial Protocol</span></td>
                    <td>Original Protocol design with CDISC CDASH aligned eCRFs for mild-to-moderate post-viral fatigue.</td>
                    <td>AIIA/IEC/2023/11/48</td>
                    <td>Approved</td>
                    <td><span className="status-pill info">Archived</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: IEC APPROVAL WORKFLOW */}
          {activeStageTab === 'iec' && (
            <div className="ctms-stage-panel">
              <div className="panel-title-block">
                <h3>🏛️ Institutional Ethics Committee (IEC / IRB) Governance &amp; Clearance Workflow</h3>
                <p>Compliant with CDSCO Ethics Committee Registration ECR/854/Inst/DL/2013/RR-19 &amp; ICMR Ethical Guidelines 2017.</p>
              </div>
              <div className="workflow-steps-horizontal">
                <div className="wf-step completed">
                  <div className="step-circle">1</div>
                  <strong>Dossier Submission</strong>
                  <span>Initial filing &amp; scientific review</span>
                  <small className="font-mono text-accent">✓ Completed</small>
                </div>
                <div className="wf-step completed">
                  <div className="step-circle">2</div>
                  <strong>Scientific Review</strong>
                  <span>Subject safety &amp; dose rationale</span>
                  <small className="font-mono text-accent">✓ Cleared</small>
                </div>
                <div className="wf-step completed">
                  <div className="step-circle">3</div>
                  <strong>Full Board Meeting</strong>
                  <span>Quorum review &amp; clarifications</span>
                  <small className="font-mono text-accent">✓ Unanimous</small>
                </div>
                <div className="wf-step completed">
                  <div className="step-circle">4</div>
                  <strong>Clearance Certificate</strong>
                  <span>Ref: AIIA/IEC/2023/11/48</span>
                  <small className="font-mono text-accent">✓ Issued</small>
                </div>
              </div>
              <div className="iec-meta-box">
                <h4>Active Ethics Dossier Metadata</h4>
                <div className="meta-grid">
                  <div><strong>Ethics Committee:</strong> Institutional Ethics Committee, AIIA New Delhi</div>
                  <div><strong>EC Registration No:</strong> ECR/854/Inst/DL/2013/RR-19 (CDSCO)</div>
                  <div><strong>Clearance Date:</strong> 20-November-2023</div>
                  <div><strong>Annual Renewal Status:</strong> Due 19-November-2026 (Compliant)</div>
                  <div><strong>Informed Consent Version:</strong> Dual Bilingual Hindi/English v2.0 (DPDP Aligned)</div>
                  <div><strong>Audio-Visual Consent Log:</strong> Mandatory in vulnerable subgroups</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CTRI REGISTRATION */}
          {activeStageTab === 'ctri' && (
            <div className="ctms-stage-panel">
              <div className="panel-title-block">
                <h3>🇮🇳 Clinical Trials Registry - India (CTRI) Statutory Record</h3>
                <p>Public registry conforming to WHO International Clinical Trials Registry Platform (ICTRP) 20-item dataset.</p>
              </div>
              <div className="ctri-card-view">
                <div className="ctri-header">
                  <span className="ctri-id-pill font-mono">{currentStudy.ctriNumber}</span>
                  <span className="badge-tag">Public Registry · Prospective Registration</span>
                </div>
                <div className="ctri-fields-grid">
                  <div className="field-group">
                    <label>Public Title of Study:</label>
                    <p>{currentStudy.title}</p>
                  </div>
                  <div className="field-group">
                    <label>Scientific Protocol Number:</label>
                    <p className="font-mono">{currentStudy.protocolNumber}</p>
                  </div>
                  <div className="field-group">
                    <label>Date of CTRI Registration:</label>
                    <p className="font-mono">{currentStudy.ctriSubmissionDate}</p>
                  </div>
                  <div className="field-group">
                    <label>Bi-Annual Progress Update Status:</label>
                    <p className="text-accent font-semibold">Next update due: {currentStudy.ctriUpdateDue} (On Schedule)</p>
                  </div>
                  <div className="field-group">
                    <label>Type of Trial &amp; Design:</label>
                    <p>Interventional, Double-Blind, Randomized, Placebo-Controlled, Multi-Center</p>
                  </div>
                  <div className="field-group">
                    <label>Primary Outcome Measure:</label>
                    <p>Change in Chalder Fatigue Scale (CFQ-11) score at Day 90 compared to baseline</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SITE ACTIVATION CHECKLIST */}
          {activeStageTab === 'activation' && (
            <div className="ctms-stage-panel">
              <div className="panel-title-block">
                <h3>🏥 Site Initiation Visit (SIV) &amp; Green-Light Activation Checklist</h3>
                <p>Rigorous 6-gate readiness verification prior to participant first dose authorization.</p>
              </div>
              <div className="activation-checklist-grid">
                <div className="check-item-card passed">
                  <span className="check-icon">✓</span>
                  <div>
                    <strong>Investigator Site File (ISF)</strong>
                    <p>Essential documents binder complete with Protocol v2.1, IB, and Lab normals.</p>
                  </div>
                </div>
                <div className="check-item-card passed">
                  <span className="check-icon">✓</span>
                  <div>
                    <strong>GCP &amp; Protocol Training</strong>
                    <p>PI, Co-PIs, and Study Coordinators certified on GCP-ASU &amp; eCRF completion.</p>
                  </div>
                </div>
                <div className="check-item-card passed">
                  <span className="check-icon">✓</span>
                  <div>
                    <strong>Laboratory Calibration</strong>
                    <p>NABL-accredited central &amp; local lab calibration certificates filed; freezers at -80°C logged.</p>
                  </div>
                </div>
                <div className="check-item-card passed">
                  <span className="check-icon">✓</span>
                  <div>
                    <strong>Investigational Product (IP) Depot</strong>
                    <p>Drug shipment received, temperature data logger (2-8°C / ambient) verified and logged.</p>
                  </div>
                </div>
                <div className="check-item-card passed">
                  <span className="check-icon">✓</span>
                  <div>
                    <strong>Institutional Agreement &amp; Insurance</strong>
                    <p>Clinical Trial Agreement signed; participant no-fault clinical trial insurance active.</p>
                  </div>
                </div>
                <div className="check-item-card passed">
                  <span className="check-icon">✓</span>
                  <div>
                    <strong>Formal Green-Light Authorization</strong>
                    <p>Lead Sponsor (AIIA) regulatory head signed off site activation green-light letter.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SCREENING LOGS & I/E CRITERIA */}
          {activeStageTab === 'screening' && (
            <div className="ctms-stage-panel">
              <div className="panel-title-block">
                <h3>🔬 Screening Log &amp; Interactive Inclusion / Exclusion Criteria Evaluator</h3>
                <p>Real-time subject eligibility assessment against Protocol Section 4.2.</p>
              </div>
              <div className="screening-interactive-box">
                <h4>Interactive Subject Eligibility Checker:</h4>
                <div className="criteria-inputs-grid">
                  <div className="input-group">
                    <label>Subject Age (Inclusion: 18 - 65 yrs):</label>
                    <input
                      type="number"
                      value={screenAge}
                      onChange={(e) => setScreenAge(Number(e.target.value))}
                    />
                  </div>
                  <div className="input-group">
                    <label>Duration of Fatigue (Inclusion: ≥ 3 months):</label>
                    <input
                      type="number"
                      value={screenFatigueMonths}
                      onChange={(e) => setScreenFatigueMonths(Number(e.target.value))}
                    />
                  </div>
                  <div className="checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={screenConsentSigned}
                        onChange={(e) => setScreenConsentSigned(e.target.checked)}
                      />
                      DPDP Bilingual Informed Consent Signed Prior to Screening
                    </label>
                  </div>
                  <div className="checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={screenSevereComorbidity}
                        onChange={(e) => setScreenSevereComorbidity(e.target.checked)}
                      />
                      Exclusion: Severe Hepatic / Renal Impairment
                    </label>
                  </div>
                  <div className="checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={screenPregnant}
                        onChange={(e) => setScreenPregnant(e.target.checked)}
                      />
                      Exclusion: Pregnancy / Lactation
                    </label>
                  </div>
                </div>

                <div className={`eligibility-result-banner ${isScreeningEligible ? 'eligible' : 'ineligible'}`}>
                  <span className="result-icon">{isScreeningEligible ? '✅' : '❌'}</span>
                  <div>
                    <strong>{isScreeningEligible ? 'SUBJECT ELIGIBLE FOR ENROLMENT & RANDOMIZATION' : 'SCREEN FAILURE: INCLUSION/EXCLUSION CRITERIA NOT MET'}</strong>
                    <p>{isScreeningEligible ? 'Proceed to stratified block randomization & blinded kit assignment.' : 'Document screen failure reason in master screening register.'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: RANDOMIZATION MODULE */}
          {activeStageTab === 'randomization' && (
            <div className="ctms-stage-panel">
              <div className="panel-title-block">
                <h3>🎲 Interactive Centralized IWRS / RTSM Randomization Module</h3>
                <p>1:1 Double-Blind Stratified Permuted Block Randomization Engine with treatment kit allocation.</p>
              </div>

              <div className="randomization-simulator-box">
                <div className="rand-form-row">
                  <div className="rand-select-col">
                    <label>Study Site:</label>
                    <select value={randSite} onChange={(e) => setRandSite(e.target.value)}>
                      <option value="site-101">Site 101 - AIIA New Delhi</option>
                      <option value="site-102">Site 102 - NIA Jaipur</option>
                      <option value="site-103">Site 103 - ITRA Jamnagar</option>
                      <option value="site-104">Site 104 - Govt Ayurveda College, TVM</option>
                    </select>
                  </div>

                  <div className="rand-select-col">
                    <label>Age Stratum:</label>
                    <select value={randAgeGroup} onChange={(e) => setRandAgeGroup(e.target.value)}>
                      <option value="<45">Stratum A: Age &lt; 45 Years</option>
                      <option value=">=45">Stratum B: Age ≥ 45 Years</option>
                    </select>
                  </div>

                  <div className="rand-select-col">
                    <label>Baseline Fatigue Grade:</label>
                    <select value={randFatigueGrade} onChange={(e) => setRandFatigueGrade(e.target.value)}>
                      <option value="Mild">Mild (Score 12 - 18)</option>
                      <option value="Moderate">Moderate (Score 19 - 24)</option>
                      <option value="Severe">Severe (Score 25 - 33)</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    className="btn-randomize-action"
                    onClick={handleSimulateRandomization}
                  >
                    🎲 Execute Randomization Allocation
                  </button>
                </div>

                {randomizationResult && (
                  <div className="rand-output-card">
                    <div className="rand-output-header">
                      <span className="badge-tag">IWRS ALLOCATION CONFIRMED</span>
                      <span className="font-mono text-muted">{randomizationResult.timestamp}</span>
                    </div>
                    <div className="rand-details-grid">
                      <div><strong>Generated Subject ID:</strong> <code>{randomizationResult.subjectId}</code></div>
                      <div><strong>Blinded Drug Kit ID:</strong> <code>{randomizationResult.kitId}</code></div>
                      <div><strong>Allocated Treatment Arm:</strong> <span className="text-accent font-semibold">{randomizationResult.allocation}</span></div>
                      <div><strong>Stratification Group:</strong> <small>{randomizationResult.stratum}</small></div>
                      <div className="hash-col"><strong>ALCOA+ Cryptographic Seed:</strong> <code>{randomizationResult.hash}</code></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 8: VISIT SCHEDULING & WINDOW TRACKING */}
          {activeStageTab === 'visits' && (
            <div className="ctms-stage-panel">
              <div className="panel-title-block">
                <h3>🗓️ Participant Visit Scheduling &amp; Allowable Window Matrix (±2 Days)</h3>
                <p>Standardized schedule of activities tracking protocol adherence across trial visits.</p>
              </div>
              <table className="persona-table">
                <thead>
                  <tr>
                    <th>Visit Code</th>
                    <th>Target Study Day</th>
                    <th>Allowable Margin</th>
                    <th>Required eCRFs &amp; Procedures</th>
                    <th>Protocol Deviation Threshold</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Visit 1 (V1)</strong></td>
                    <td>Day 0 (Baseline)</td>
                    <td>Target Day</td>
                    <td>Informed Consent, Demographics, Medical History, Baseline Chalder Scale, Blood Draw</td>
                    <td>Required prior to dispensing</td>
                  </tr>
                  <tr>
                    <td><strong>Visit 2 (V2)</strong></td>
                    <td>Day 7</td>
                    <td>±1 Calendar Day</td>
                    <td>Safety Vital Signs, Concomitant Meds Review, Early Tolerability Assessment</td>
                    <td>&gt; ±1 day = Minor Deviation</td>
                  </tr>
                  <tr>
                    <td><strong>Visit 3 (V3)</strong></td>
                    <td>Day 14</td>
                    <td>±2 Calendar Days</td>
                    <td>Adverse Event Check, Drug Accountability, Vitals, Compliance Pill Count</td>
                    <td>&gt; ±2 days = Minor Deviation</td>
                  </tr>
                  <tr>
                    <td><strong>Visit 4 (V4)</strong></td>
                    <td>Day 28</td>
                    <td>±2 Calendar Days</td>
                    <td>Mid-study Fatigue Scale, Safety Labs (Liver &amp; Renal Functions), Drug Dispensation #2</td>
                    <td>&gt; ±2 days = Major Deviation if labs missed</td>
                  </tr>
                  <tr>
                    <td><strong>Visit 5 (V5)</strong></td>
                    <td>Day 56</td>
                    <td>±3 Calendar Days</td>
                    <td>Phone Follow-up &amp; Safety Review, Adverse Event Monitoring</td>
                    <td>&gt; ±3 days = Minor Deviation</td>
                  </tr>
                  <tr>
                    <td><strong>Visit 6 (V6)</strong></td>
                    <td>Day 90 (End of Study)</td>
                    <td>±3 Calendar Days</td>
                    <td>Primary Outcome CFQ-11, Complete Lab Panel, Empty Kit Retrieval, Study Exit eCRF</td>
                    <td>&gt; ±3 days = Major Protocol Deviation</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 9: DATA QUERIES LIFECYCLE */}
          {activeStageTab === 'queries' && (
            <div className="ctms-stage-panel">
              <div className="panel-title-block">
                <h3>🔍 eCRF Data Query Lifecycle &amp; Discrepancy Management</h3>
                <p>Closed-loop discrepancy workflow: Open → Under Investigation → Answered → Resolved → Closed.</p>
              </div>
              <table className="persona-table">
                <thead>
                  <tr>
                    <th>Query Ref</th>
                    <th>Subject ID</th>
                    <th>eCRF Form / Domain</th>
                    <th>Discrepancy Details</th>
                    <th>Originator</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>QRY-0941</code></td>
                    <td><strong>AIIA-01-042</strong></td>
                    <td>Adverse Events (AE)</td>
                    <td>Bronchospasm severity marked as 'Severe' in text narrative but 'Moderate' in eCRF dropdown.</td>
                    <td>CRA Monitor</td>
                    <td><span className="status-pill danger">Open</span></td>
                  </tr>
                  <tr>
                    <td><code>QRY-0942</code></td>
                    <td><strong>NIA-02-019</strong></td>
                    <td>Laboratory (LB)</td>
                    <td>ALT enzyme test value &gt; 5x ULN missing expedited safety physician re-check notation.</td>
                    <td>Data Manager</td>
                    <td><span className="status-pill warn">Under Investigation</span></td>
                  </tr>
                  <tr>
                    <td><code>QRY-0938</code></td>
                    <td><strong>ITRA-03-024</strong></td>
                    <td>Concomitant Meds (CM)</td>
                    <td>Stop date missing for Cetirizine 10mg. PI provided clarification: ongoing medication.</td>
                    <td>CRA Monitor</td>
                    <td><span className="status-pill active">Resolved &amp; Closed</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 10: CLOSE-OUT & STATUTORY ARCHIVAL */}
          {activeStageTab === 'closeout' && (
            <div className="ctms-stage-panel">
              <div className="panel-title-block">
                <h3>🏁 Study Close-Out, Database Lock &amp; 15-Year GCP Archival</h3>
                <p>Statutory close-out procedures conforming to New Drugs and Clinical Trials Rules 2019.</p>
              </div>
              <div className="closeout-milestones-grid">
                <div className="co-card">
                  <span className="co-icon">🔒</span>
                  <strong>1. Database Lock Protocol</strong>
                  <p>All eCRF forms completed, all queries resolved, blind break codes reconciled before final hard lock.</p>
                </div>
                <div className="co-card">
                  <span className="co-icon">📊</span>
                  <strong>2. Blind Unblinding &amp; Analysis</strong>
                  <p>Independent biostatistician executes pre-specified Statistical Analysis Plan (SAP) using CDISC ADaM datasets.</p>
                </div>
                <div className="co-card">
                  <span className="co-icon">📑</span>
                  <strong>3. Clinical Study Report (CSR)</strong>
                  <p>ICH E3 compliant CSR authored, signed by PI and Sponsor, submitted to CDSCO SUGAM portal.</p>
                </div>
                <div className="co-card">
                  <span className="co-icon">🏛️</span>
                  <strong>4. 15-Year MeitY Archival</strong>
                  <p>WORM immutable storage of all Trial Master File (TMF) records in MeitY empanelled national cloud.</p>
                </div>
              </div>
            </div>
          )}

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
