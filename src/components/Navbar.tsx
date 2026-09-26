import React, { useState, useEffect, useRef } from 'react'
import type { DashboardPage } from '../types'
import { ThemeToggle } from './ThemeToggle'

interface NavbarProps {
  theme: 'light' | 'dark'
  activePage: DashboardPage
  onSelectPage: (page: DashboardPage) => void
  onToggleTheme: () => void
}

const pageLabels: Record<DashboardPage, { label: string; icon: string }> = {
  kpis: { label: 'KPIs & Alerts', icon: '📊' },
  lifecycle: { label: 'Lifecycle Pipeline', icon: '🔄' },
  pv: { label: 'Pharmacovigilance', icon: '💊' },
  standards: { label: 'Standards & Audit', icon: '🛡️' },
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  activePage,
  onSelectPage,
  onToggleTheme,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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
    <header className="glass-navbar">
      <div className="nav-brand">
        <div className="brand-badge-icon">
          <span>🩺</span>
        </div>
        <div>
          <div className="brand-title-row">
            <span className="brand-title">AIIA CTMS</span>
            <span className="badge-pill">NPvCC Hub v2.5</span>
          </div>
          <span className="brand-sub">Clinical Trial Management &amp; Pharmacovigilance</span>
        </div>
      </div>

      {/* Active Page Indicator */}
      <div className="current-page-indicator">
        <span className="current-page-dot">●</span>
        <span className="current-page-icon">{pageLabels[activePage].icon}</span>
        <span className="current-page-title">{pageLabels[activePage].label}</span>
      </div>

      <div className="nav-actions" ref={menuRef}>
        <div className="compliance-shield" title="ISO 27001, CERT-In, ALCOA+ & DPDP Act 2023 Verified">
          <span className="shield-icon">🛡️</span>
          <span className="shield-text">CERT-In &amp; DPDP</span>
        </div>

        <ThemeToggle theme={theme} onToggle={onToggleTheme} />

        {/* 3-Line Hamburger Dropdown in Right Upper Corner */}
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
                <span className="dropdown-label">CHOOSE ACTIVE PAGE</span>
              </div>
              <nav className="dropdown-nav">
                <button
                  type="button"
                  className={`dropdown-item ${activePage === 'lifecycle' ? 'active-page' : ''}`}
                  onClick={() => handlePageClick('lifecycle')}
                >
                  <span className="dropdown-icon">🔄</span>
                  <div className="dropdown-text-group">
                    <span className="dropdown-title">Lifecycle Pipeline</span>
                    <span className="dropdown-sub">10-stage trial tracker</span>
                  </div>
                  {activePage === 'lifecycle' && <span className="active-check">✓</span>}
                </button>

                <button
                  type="button"
                  className={`dropdown-item ${activePage === 'kpis' ? 'active-page' : ''}`}
                  onClick={() => handlePageClick('kpis')}
                >
                  <span className="dropdown-icon">📊</span>
                  <div className="dropdown-text-group">
                    <span className="dropdown-title">KPIs &amp; Alerts</span>
                    <span className="dropdown-sub">Enrolment &amp; compliance</span>
                  </div>
                  {activePage === 'kpis' && <span className="active-check">✓</span>}
                </button>

                <button
                  type="button"
                  className={`dropdown-item ${activePage === 'pv' ? 'active-page' : ''}`}
                  onClick={() => handlePageClick('pv')}
                >
                  <span className="dropdown-icon">💊</span>
                  <div className="dropdown-text-group">
                    <span className="dropdown-title">Pharmacovigilance</span>
                    <span className="dropdown-sub">ADR/SAE &amp; MedDRA coding</span>
                  </div>
                  {activePage === 'pv' && <span className="active-check">✓</span>}
                </button>

                <button
                  type="button"
                  className={`dropdown-item ${activePage === 'standards' ? 'active-page' : ''}`}
                  onClick={() => handlePageClick('standards')}
                >
                  <span className="dropdown-icon">🛡️</span>
                  <div className="dropdown-text-group">
                    <span className="dropdown-title">Standards &amp; Audit</span>
                    <span className="dropdown-sub">CDISC, FHIR, ABDM, ALCOA+</span>
                  </div>
                  {activePage === 'standards' && <span className="active-check">✓</span>}
                </button>
              </nav>

              <div className="dropdown-footer">
                <span className="dropdown-footer-badge">🔒 21 CFR Part 11 Compliant</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
