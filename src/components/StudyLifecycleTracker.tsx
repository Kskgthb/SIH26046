import React, { useState } from 'react'
import type { Study, LifecycleStage } from '../types'

interface StudyLifecycleTrackerProps {
  studies: Study[]
  selectedStudyId: string
  onSelectStudy: (id: string) => void
}

const allStages: { stage: LifecycleStage; order: number; icon: string; summary: string }[] = [
  { stage: 'Protocol', order: 1, icon: '📄', summary: 'Scientific design, synopsis, and endpoints' },
  { stage: 'IEC Approval', order: 2, icon: '🏛️', summary: 'Institutional Ethics Committee clearance' },
  { stage: 'CTRI Registration', order: 3, icon: '🇮🇳', summary: 'Clinical Trials Registry - India ID' },
  { stage: 'Site Activation', order: 4, icon: '🏥', summary: 'Investigator meeting, SIV, drug shipment' },
  { stage: 'Screening', order: 5, icon: '🔬', summary: 'Inclusion/exclusion verification & labs' },
  { stage: 'Enrolment', order: 6, icon: '👥', summary: 'e-Consent, ABHA verification, cohort allocation' },
  { stage: 'Randomization', order: 7, icon: '🎲', summary: 'IWRS / Double-blind allocation' },
  { stage: 'Subject Visits', order: 8, icon: '🗓️', summary: 'Scheduled follow-ups & IP administration' },
  { stage: 'Data Queries & SDV', order: 9, icon: '🔍', summary: 'Source document verification & eCRF locks' },
  { stage: 'Milestones & Close-out', order: 10, icon: '🏁', summary: 'CSR generation, CDISC submission, archiving' },
]

export const StudyLifecycleTracker: React.FC<StudyLifecycleTrackerProps> = ({
  studies,
  selectedStudyId,
  onSelectStudy,
}) => {
  const currentStudy = studies.find((s) => s.id === selectedStudyId) || studies[0]
  const [inspectedStage, setInspectedStage] = useState<LifecycleStage>(currentStudy.currentStage)

  const activeStageIndex = allStages.findIndex((s) => s.stage === currentStudy.currentStage)

  return (
    <div className="lifecycle-container">
      <div className="lifecycle-header">
        <div className="title-and-select">
          <span className="section-eyebrow">END-TO-END STUDY GOVERNANCE</span>
          <h2 className="widget-title">Study Lifecycle Pipeline</h2>
        </div>

        <div className="study-selector-box">
          <label htmlFor="study-dropdown" className="selector-label">
            Active Clinical Trial:
          </label>
          <select
            id="study-dropdown"
            className="study-select-input"
            value={selectedStudyId}
            onChange={(e) => {
              onSelectStudy(e.target.value)
              const matched = studies.find((s) => s.id === e.target.value)
              if (matched) setInspectedStage(matched.currentStage)
            }}
          >
            {studies.map((study) => (
              <option key={study.id} value={study.id}>
                [{study.protocolNumber}] {study.shortTitle}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="study-meta-banner">
        <div className="meta-item">
          <span className="meta-label">Protocol ID</span>
          <span className="meta-val font-mono">{currentStudy.protocolNumber}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">CTRI Reg No.</span>
          <span className="meta-val font-mono ctri-highlight">{currentStudy.ctriNumber}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Ethics IEC ID</span>
          <span className="meta-val font-mono">{currentStudy.iecApprovalNumber}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Phase &amp; Discipline</span>
          <span className="meta-val">{currentStudy.phase} · {currentStudy.therapeuticArea}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Active Sites</span>
          <span className="meta-val">{currentStudy.sites.length} Multicentric Centers</span>
        </div>
      </div>

      {/* 10-Stage Pipeline Horizontal Stepper */}
      <div className="stepper-scroll-track">
        <div className="stepper-stages-grid">
          {allStages.map((item, idx) => {
            const isCompleted = idx < activeStageIndex
            const isCurrent = idx === activeStageIndex
            const isSelected = item.stage === inspectedStage

            let statusClass = 'upcoming'
            if (isCompleted) statusClass = 'completed'
            if (isCurrent) statusClass = 'current'

            return (
              <div
                key={item.stage}
                className={`stepper-node ${statusClass} ${isSelected ? 'inspected' : ''}`}
                onClick={() => setInspectedStage(item.stage)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setInspectedStage(item.stage)}
              >
                <div className="node-number-bubble">
                  {isCompleted ? '✓' : item.order}
                </div>
                <div className="node-icon">{item.icon}</div>
                <span className="node-label">{item.stage}</span>
                <span className="node-status-pill">
                  {isCompleted ? 'Completed' : isCurrent ? 'In-Progress' : 'Pending'}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Stage Inspection Details Panel */}
      <div className="stage-inspection-card">
        <div className="stage-card-header">
          <div className="stage-icon-big">
            {allStages.find((s) => s.stage === inspectedStage)?.icon}
          </div>
          <div>
            <span className="stage-badge">Stage {allStages.find((s) => s.stage === inspectedStage)?.order} of 10</span>
            <h3 className="stage-title">{inspectedStage}</h3>
            <p className="stage-summary">
              {allStages.find((s) => s.stage === inspectedStage)?.summary}
            </p>
          </div>
        </div>

        <div className="stage-details-grid">
          <div className="detail-pane">
            <h4 className="pane-heading">Operational Status &amp; Metrics</h4>
            <div className="detail-rows">
              <div className="detail-row">
                <span>Current Stage Progression:</span>
                <span className="font-semibold text-accent">
                  {inspectedStage === currentStudy.currentStage ? `${currentStudy.stageProgressPercent}% Executed` : inspectedStage < currentStudy.currentStage ? '100% Completed & Validated' : 'Queued (Awaiting prerequisites)'}
                </span>
              </div>
              <div className="detail-row">
                <span>Enrolment Trajectory:</span>
                <span>{currentStudy.enrolmentCurrent} / {currentStudy.enrolmentTarget} Subjects ({Math.round((currentStudy.enrolmentCurrent / currentStudy.enrolmentTarget) * 100)}%)</span>
              </div>
              <div className="detail-row">
                <span>Source Data Verification (SDV):</span>
                <span>{currentStudy.sdvCompletedPercent}% of Case Report Forms Locked</span>
              </div>
            </div>
          </div>

          <div className="detail-pane">
            <h4 className="pane-heading">Compliance &amp; Regulatory Checkpoints</h4>
            <div className="detail-rows">
              <div className="detail-row">
                <span>CDISC CDASH eCRF:</span>
                <span className="badge-check">✓ Fully Conforming (DM, AE, VS, LB)</span>
              </div>
              <div className="detail-row">
                <span>CTRI Progress Reporting:</span>
                <span className={currentStudy.isCtriUpdateOverdue ? 'badge-warn' : 'badge-check'}>
                  {currentStudy.isCtriUpdateOverdue ? '⚠️ Bi-annual Update Overdue' : `Next Due: ${currentStudy.ctriUpdateDue}`}
                </span>
              </div>
              <div className="detail-row">
                <span>IEC Annual Approval:</span>
                <span className={currentStudy.isIecRenewalUrgent ? 'badge-warn' : 'badge-check'}>
                  {currentStudy.isIecRenewalUrgent ? '⚠️ Renewal Due within 15 Days' : `Valid till: ${currentStudy.iecRenewalDue}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
