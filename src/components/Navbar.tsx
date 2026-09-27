import React, { useState, useEffect, useRef } from 'react'
import type { DashboardPage } from '../types'
import { ThemeToggle } from './ThemeToggle'

interface NavbarProps {
  theme: 'light' | 'dark'
  activePage: DashboardPage
  onSelectPage: (page: DashboardPage) => void
  onToggleTheme: () => void
}

const pagesList: { id: DashboardPage; label: string; icon: string; sub: string }[] = [
  { id: 'workspace', label: 'Persona Workspace', icon: '🩺', sub: 'Role-tailored views' },
  { id: 'kpis', label: 'KPIs & Alerts', icon: '📊', sub: 'Enrolment & deviations' },
  { id: 'lifecycle', label: 'Lifecycle & Gantt', icon: '🔄', sub: '10-stage trial timeline' },
  { id: 'pv', label: 'Pharmacovigilance', icon: '💊', sub: 'SAE & MedDRA coding' },
  { id: 'consent', label: 'Consent (DPDP)', icon: '📜', sub: 'Bilingual e-Consent' },
  { id: 'audit', label: 'Audit Trail', icon: '🔒', sub: 'ALCOA+ SHA-256 ledger' },
  { id: 'standards', label: 'Standards & FHIR', icon: '🛡️', sub: 'CDISC, ABDM & Interop' },
]

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  activePage,
  onSelectPage,
  onToggleTheme,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showSecurityModal, setShowSecurityModal] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  const handlePageClick = (page: DashboardPage) => {
    onSelectPage(page)
    setIsMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <header className="glass-navbar">
        <div className="nav-brand" onClick={() => handlePageClick('kpis')} role="button" tabIndex={0}>
          <div className="brand-badge-icon">
            <span>🩺</span>
          </div>
          <div>
            <div className="brand-title-row">
              <span className="brand-title">AIIA CTMS</span>
              <span className="badge-pill">NPvCC Hub v3.0</span>
            </div>
            <span className="brand-sub">Clinical Trial Management &amp; Pharmacovigilance</span>
          </div>
        </div>

        {/* Desktop Quick Nav Links */}
        <nav className="desktop-nav-links">
          {pagesList.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`desktop-nav-btn ${activePage === p.id ? 'active' : ''}`}
              onClick={() => handlePageClick(p.id)}
            >
              <span className="btn-ico">{p.icon}</span>
              <span className="btn-txt">{p.label}</span>
              {activePage === p.id && <span className="active-pill-dot"></span>}
            </button>
          ))}
        </nav>

        <div className="nav-actions" ref={menuRef}>
          <div
            className="compliance-shield"
            onClick={() => setShowSecurityModal(true)}
            role="button"
            tabIndex={0}
            title="Click to view ISO 27001, CERT-In & DPDP Act 2023 Security Certifications"
          >
            <span className="shield-icon">🛡️</span>
            <span className="shield-text">CERT-In &amp; DPDP</span>
          </div>

          <ThemeToggle theme={theme} onToggle={onToggleTheme} />

          {/* Mobile / Compact Hamburger Dropdown */}
          <div className="hamburger-dropdown-wrapper">
            <button
              type="button"
              className={`hamburger-btn ${isMenuOpen ? 'open' : ''}`}
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label="Toggle Navigation Menu"
              aria-expanded={isMenuOpen}
              title="Navigation Pages"
            >
              <span className="hamburger-line top-line"></span>
              <span className="hamburger-line mid-line"></span>
              <span className="hamburger-line bot-line"></span>
            </button>

            {isMenuOpen && (
              <div className="glass-dropdown-menu">
                <div className="dropdown-header">
                  <span className="dropdown-label">CORE SYSTEM MODULES</span>
                </div>
                <nav className="dropdown-nav">
                  {pagesList.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className={`dropdown-item ${activePage === p.id ? 'active-page' : ''}`}
                      onClick={() => handlePageClick(p.id)}
                    >
                      <span className="dropdown-icon">{p.icon}</span>
                      <div className="dropdown-text-group">
                        <span className="dropdown-title">{p.label}</span>
                        <span className="dropdown-sub">{p.sub}</span>
                      </div>
                      {activePage === p.id && <span className="active-check">✓</span>}
                    </button>
                  ))}
                </nav>

                <div className="dropdown-footer">
                  <span className="dropdown-footer-badge">🔒 21 CFR Part 11 &amp; ALCOA+ Compliant</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Security & Regulatory Compliance Modal */}
      {showSecurityModal && (
        <div className="security-modal-overlay">
          <div className="security-modal-card">
            <div className="modal-header">
              <div>
                <span className="modal-tag">STATUTORY &amp; SECURITY ASSURANCE</span>
                <h3 className="modal-title">National Security &amp; Compliance Credentials</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowSecurityModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="cert-item-box">
                <span className="cert-icon">🇮🇳</span>
                <div>
                  <strong>CERT-In Empanelled Security Audit</strong>
                  <p>Certificate #CERT-IN/2026/AIIA-CTMS-881. Clean bill of health with zero critical/high OWASP vulnerabilities.</p>
                </div>
              </div>

              <div className="cert-item-box">
                <span className="cert-icon">📜</span>
                <div>
                  <strong>Digital Personal Data Protection (DPDP) Act 2023</strong>
                  <p>Section 6 compliant consent forms with bilingual notices, 100% Indian Cloud Data Residency, and Section 12 erasure workflows.</p>
                </div>
              </div>

              <div className="cert-item-box">
                <span className="cert-icon">🔒</span>
                <div>
                  <strong>ISO/IEC 27001:2022 ISMS Certified</strong>
                  <p>Comprehensive Information Security Management System covering role-based access control and AES-256 database encryption.</p>
                </div>
              </div>

              <div className="cert-item-box">
                <span className="cert-icon">⚖️</span>
                <div>
                  <strong>21 CFR Part 11 &amp; GCP-ASU Compliant</strong>
                  <p>Cryptographic electronic signatures, password re-authentication, and write-once immutable audit logs.</p>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setShowSecurityModal(false)}
              >
                Close Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
