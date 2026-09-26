import React from 'react'
import type { Role } from '../types'

interface RoleSelectorProps {
  currentRole: Role
  onSelectRole: (role: Role) => void
}

const rolesList: { role: Role; label: string; icon: string; desc: string }[] = [
  {
    role: 'PI',
    label: 'Principal Investigator',
    icon: '🩺',
    desc: 'Protocol deviations, enrolment targets, safety oversight',
  },
  {
    role: 'Coordinator',
    label: 'Study Coordinator',
    icon: '📋',
    desc: 'Subject visits, screening, digital e-consent & ABHA link',
  },
  {
    role: 'Monitor',
    label: 'Clinical Monitor (CRA)',
    icon: '🔍',
    desc: 'SDV status, source verification, monitoring visit reports',
  },
  {
    role: 'EC',
    label: 'Ethics Committee',
    icon: '🏛️',
    desc: 'IEC approvals, annual renewals, expedited SAE reviews',
  },
  {
    role: 'PV',
    label: 'Pharmacovigilance (NPvCC)',
    icon: '💊',
    desc: 'ADR/SAE triage, MedDRA auto-coding, 7/15-day CDSCO alerts',
  },
  {
    role: 'Admin',
    label: 'System Administrator',
    icon: '⚙️',
    desc: 'ALCOA+ audit logs, 21 CFR Part 11 controls, DPDP data residency',
  },
  {
    role: 'Regulator',
    label: 'CDSCO / CTRI (Auditor)',
    icon: '⚖️',
    desc: 'Read-only compliance verification, SDTM & FHIR export',
  },
]

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  currentRole,
  onSelectRole,
}) => {
  return (
    <div className="role-selector-bar">
      <div className="role-selector-header">
        <div className="role-badge-tag">
          <span className="pulse-dot"></span>
          <span>ROLE-BASED ACCESS CONTROL (RBAC)</span>
        </div>
        <span className="role-hint">
          Switch persona to view role-tailored dashboard controls, permissions &amp; data visibility:
        </span>
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
              title={item.desc}
            >
              <span className="role-btn-icon">{item.icon}</span>
              <span className="role-btn-text">{item.role}</span>
              {isActive && <span className="active-dot">✓</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
