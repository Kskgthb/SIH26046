import React from 'react'
import type { Role } from '../types'

interface RoleSelectorProps {
  currentRole: Role
  onSelectRole: (role: Role) => void
  onTriggerDemoAlert?: (type: 'sae' | 'lag' | 'ethics') => void
  onOpenWorkspace?: () => void
}

const rolesList: { role: Role; label: string; icon: string; desc: string; scope: string }[] = [
  {
    role: 'PI',
    label: 'Principal Investigator',
    icon: '🩺',
    desc: 'Protocol deviations, enrolment targets, safety oversight',
    scope: 'Full Trial Portfolio · Participant Safety · e-Signature Authority',
  },
  {
    role: 'Coordinator',
    label: 'Study Coordinator',
    icon: '📋',
    desc: 'Subject visits, screening, digital e-consent & ABHA link',
    scope: 'e-Consent Management · Participant Onboarding · Visit Logs',
  },
  {
    role: 'Monitor',
    label: 'Clinical Monitor (CRA)',
    icon: '🔍',
    desc: 'SDV status, source verification, monitoring visit reports',
    scope: 'Source Data Verification (SDV) · Site Monitoring · Data Queries',
  },
  {
    role: 'EC',
    label: 'Ethics Committee',
    icon: '🏛️',
    desc: 'IEC approvals, annual renewals, expedited SAE reviews',
    scope: 'Institutional Ethics Oversight · Annual Renewals · Safety Letters',
  },
  {
    role: 'PV',
    label: 'Pharmacovigilance (NPvCC)',
    icon: '💊',
    desc: 'ADR/SAE triage, MedDRA auto-coding, 7/15-day CDSCO alerts',
    scope: 'Expedited SAE Reporting · MedDRA Coding · WHODrug Checks',
  },
  {
    role: 'Admin',
    label: 'System Administrator',
    icon: '⚙️',
    desc: 'ALCOA+ audit logs, 21 CFR Part 11 controls, DPDP data residency',
    scope: 'System Ledger · User Governance · Right to Erasure Tracker',
  },
  {
    role: 'Regulator',
    label: 'CDSCO / CTRI (Auditor)',
    icon: '⚖️',
    desc: 'Read-only compliance verification, SDTM & FHIR export',
    scope: 'Statutory Verification · SDTM Export · Regulatory Audit',
  },
]

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  currentRole,
  onSelectRole,
  onTriggerDemoAlert,
  onOpenWorkspace,
}) => {
  const activeRoleData = rolesList.find((r) => r.role === currentRole) || rolesList[0]

  return (
    <div className="role-selector-bar">
      <div className="role-selector-header">
        <div className="role-badge-tag">
          <span className="pulse-dot"></span>
          <span>ROLE-BASED ACCESS CONTROL (RBAC)</span>
        </div>
        <span className="role-hint">
          Active Security Context: <strong>{activeRoleData.label}</strong> ({activeRoleData.scope})
        </span>
        {onOpenWorkspace && (
          <button
            type="button"
            className="btn-open-persona-desk"
            onClick={onOpenWorkspace}
            title="Open tailored dashboard for active role"
          >
            🖥️ Launch {activeRoleData.role} Workspace →
          </button>
        )}
      </div>

      <div className="roles-scroll-container">
        {rolesList.map((item) => {
          const isActive = currentRole === item.role
          return (
            <button
              key={item.role}
              type="button"
              className={`role-pill-btn ${isActive ? 'active' : ''}`}
              onClick={() => onSelectRole(item.role)}
              title={`${item.label}: ${item.desc}`}
            >
              <span className="role-btn-icon">{item.icon}</span>
              <span className="role-btn-text">{item.role}</span>
              {isActive && <span className="active-dot">✓</span>}
            </button>
          )
        })}
      </div>

      {/* SIH Live Demo Simulation Control Bar */}
      {onTriggerDemoAlert && (
        <div className="demo-sim-bar">
          <div className="demo-label-group">
            <span className="demo-pulse-bolt">⚡</span>
            <span className="demo-title">SIH DEMO SIMULATION:</span>
          </div>
          <div className="demo-actions-row">
            <button
              type="button"
              className="btn-demo-trigger red"
              onClick={() => onTriggerDemoAlert('sae')}
              title="Simulate immediate occurrence of a 7-day expedited SAE"
            >
              🚨 Trigger Critical SAE Alert (7-Day CDSCO)
            </button>
            <button
              type="button"
              className="btn-demo-trigger yellow"
              onClick={() => onTriggerDemoAlert('lag')}
              title="Simulate sudden enrolment lag detection"
            >
              📉 Trigger Enrolment Lag (-15% Deficit)
            </button>
            <button
              type="button"
              className="btn-demo-trigger blue"
              onClick={() => onTriggerDemoAlert('ethics')}
              title="Simulate urgent IEC annual renewal deadline"
            >
              🏛️ Trigger Ethics Renewal Notice
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
