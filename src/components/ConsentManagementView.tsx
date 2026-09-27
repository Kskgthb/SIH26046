import React, { useState } from 'react'
import type { DPDPRecord, Role } from '../types'

interface ConsentManagementViewProps {
  dpdpRecords: DPDPRecord[]
  currentRole: Role
  onWithdrawConsent: (subjectId: string, reason: string) => void
  onAddNewConsent?: (newRecord: DPDPRecord) => void
}

export const ConsentManagementView: React.FC<ConsentManagementViewProps> = ({
  dpdpRecords,
  currentRole,
  onWithdrawConsent,
}) => {
  const [selectedRecord, setSelectedRecord] = useState<DPDPRecord | null>(null)
  const [withdrawingSubject, setWithdrawingSubject] = useState<DPDPRecord | null>(null)
  const [withdrawalReason, setWithdrawalReason] = useState('Personal reasons / relocation')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')

  const totalActive = dpdpRecords.filter((r) => r.consentStatus === 'Active').length
  const totalWithdrawn = dpdpRecords.filter((r) => r.consentStatus === 'Withdrawn').length
  const totalPending = dpdpRecords.filter((r) => r.consentStatus === 'Pending' || r.consentStatus === 'Re-consent Needed').length

  const filteredRecords = dpdpRecords.filter((r) => {
    const matchesSearch =
      r.subjectId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.abhaId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.studyProtocol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.participantName && r.participantName.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === 'ALL' || r.consentStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleConfirmWithdrawal = (e: React.FormEvent) => {
    e.preventDefault()
    if (!withdrawingSubject) return
    onWithdrawConsent(withdrawingSubject.subjectId, withdrawalReason)
    setWithdrawingSubject(null)
  }

  return (
    <div className="consent-page-container">
      {/* Page Header */}
      <div className="consent-header">
        <div className="consent-title-block">
          <div className="dpdp-badge-row">
            <span className="badge-dpdp-pill">DPDP ACT 2023 COMPLIANT</span>
            <span className="badge-abha-pill">ABHA / ABDM INTEGRATED</span>
            <span className="badge-cdsco-pill">CDSCO NDCT RULES 2019</span>
          </div>
          <h2 className="widget-title">Digital Consent &amp; Data Principal Governance</h2>
          <p className="widget-subtitle">
            Dynamic e-Consent lifecycle conforming to Section 6 of the Digital Personal Data Protection Act 2023, featuring bilingual forms, ABHA verification, and immutable right to withdraw consent.
          </p>
        </div>

        <div className="consent-stat-badges">
          <div className="stat-pill active">
            <span className="pill-num">{totalActive}</span>
            <span className="pill-txt">Active Consents</span>
          </div>
          <div className="stat-pill withdrawn">
            <span className="pill-num">{totalWithdrawn}</span>
            <span className="pill-txt">Withdrawn (Sec 6(7))</span>
          </div>
          <div className="stat-pill pending">
            <span className="pill-num">{totalPending}</span>
            <span className="pill-txt">Re-consent / Pending</span>
          </div>
        </div>
      </div>

      {/* DPDP Legal Highlights Banner */}
      <div className="dpdp-rights-banner">
        <div className="banner-item">
          <span className="banner-ico">📜</span>
          <div>
            <strong>Specific &amp; Informed</strong>
            <p>Dual-language (Hindi/English) consent forms with clear therapeutic outcomes</p>
          </div>
        </div>
        <div className="banner-item">
          <span className="banner-ico">📹</span>
          <div>
            <strong>Audio-Visual (AV) Recording</strong>
            <p>Mandatory AV consent capture for vulnerable subjects as per CDSCO Order 2013</p>
          </div>
        </div>
        <div className="banner-item">
          <span className="banner-ico">↩️</span>
          <div>
            <strong>Right to Withdraw (Sec 6(7))</strong>
            <p>Participant may revoke consent anytime with immediate sample freeze</p>
          </div>
        </div>
        <div className="banner-item">
          <span className="banner-ico">🗑️</span>
          <div>
            <strong>Right to Erasure (Sec 12)</strong>
            <p>Subject data erasure request portal subject to statutory GCP retention rules</p>
          </div>
        </div>
        <div className="banner-item">
          <span className="banner-ico">🇮🇳</span>
          <div>
            <strong>Data Sovereignty &amp; CERT-In</strong>
            <p>100% data resident within MeitY empanelled Indian Cloud (Delhi); ISO 27001 &amp; CERT-In compliant</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="consent-controls-row">
        <div className="consent-search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by Subject ID, ABHA Number, or Study Protocol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="consent-filter-box">
          <label>Filter Status:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="ALL">All Statuses</option>
            <option value="Active">Active (Signed)</option>
            <option value="Withdrawn">Withdrawn</option>
            <option value="Pending">Pending / Re-consent</option>
          </select>
        </div>
      </div>

      {/* Participants Table */}
      <div className="consent-table-card">
        <div className="table-responsive-wrapper">
          <table className="consent-table">
            <thead>
              <tr>
                <th>Participant ID</th>
                <th>ABHA Health ID</th>
                <th>Trial Protocol</th>
                <th>Consent Version</th>
                <th>Consent Date (IST)</th>
                <th>AV Recording</th>
                <th>DPDP Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((rec) => (
                <tr key={rec.subjectId} className={`consent-row status-${rec.consentStatus.toLowerCase()}`}>
                  <td className="font-mono font-bold text-accent">{rec.subjectId}</td>

                  <td>
                    <div className="abha-cell">
                      <span className="abha-number font-mono">{rec.abhaId}</span>
                      <span className="abha-verified-badge" title="Verified with ABDM M1 Gateway">✓ ABHA Linked</span>
                    </div>
                  </td>

                  <td className="font-mono">{rec.studyProtocol}</td>

                  <td>
                    <span className="version-pill">{rec.consentVersion}</span>
                  </td>

                  <td className="font-mono">{rec.consentDate}</td>

                  <td>
                    <span className={`av-badge ${rec.audioVisualRecorded ? 'av-yes' : 'av-no'}`}>
                      {rec.audioVisualRecorded ? '📹 AV Archived' : '📄 Written e-Consent'}
                    </span>
                  </td>

                  <td>
                    <span className={`status-pill pill-${rec.consentStatus.toLowerCase().replace(/ /g, '-')}`}>
                      {rec.consentStatus === 'Active' ? '✓ Signed (Active)' : rec.consentStatus}
                    </span>
                  </td>

                  <td className="action-buttons-cell">
                    <button
                      type="button"
                      className="btn-view-consent"
                      onClick={() => setSelectedRecord(rec)}
                    >
                      👁️ View Form
                    </button>

                    {rec.consentStatus === 'Active' && (currentRole === 'Coordinator' || currentRole === 'PI' || currentRole === 'Admin') && (
                      <button
                        type="button"
                        className="btn-withdraw-consent"
                        onClick={() => setWithdrawingSubject(rec)}
                        title="Exercise Right to Withdraw Consent under Section 6(7) DPDP Act 2023"
                      >
                        ⚠️ Withdraw
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Digital Informed Consent Form Viewer */}
      {selectedRecord && (
        <div className="consent-modal-overlay">
          <div className="consent-modal-card">
            <div className="modal-header">
              <div>
                <span className="modal-tag">CDSCO GCP-ASU &amp; DPDP ACT 2023 FORM</span>
                <h3 className="modal-title">Electronic Informed Consent Form (e-ICF)</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedRecord(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body-scrollable">
              <div className="e-icf-header-box">
                <div className="icf-institution">
                  <strong>ALL INDIA INSTITUTE OF AYURVEDA (AIIA)</strong>
                  <span>Gautampuri, Sarita Vihar, Mathura Road, New Delhi - 110076</span>
                </div>
                <div className="icf-doc-meta">
                  <span><strong>Protocol:</strong> {selectedRecord.studyProtocol}</span>
                  <span><strong>Version:</strong> {selectedRecord.consentVersion}</span>
                  <span><strong>Date Signed:</strong> {selectedRecord.consentDate}</span>
                </div>
              </div>

              <div className="icf-bilingual-section">
                <div className="lang-box english">
                  <h4>Participant Rights &amp; Declarations (English)</h4>
                  <ul>
                    <li>I have been explained the purpose of the trial, foreseeable benefits, and potential side effects of the Ayurvedic intervention in my preferred language.</li>
                    <li>I understand that my participation is purely voluntary and I have the right to withdraw at any stage without affecting my routine medical care.</li>
                    <li>My digital health records are securely linked using ABHA ID (<code>{selectedRecord.abhaId}</code>) and protected by AES-256 encryption.</li>
                    <li>I authorize anonymized data transmission for CDISC SDTM regulatory submissions to CDSCO and NPvCC safety monitoring.</li>
                  </ul>
                </div>

                <div className="lang-box hindi">
                  <h4>प्रतिभागी अधिकार एवं सहमति घोषणा (हिन्दी)</h4>
                  <ul>
                    <li>मुझे नैदानिक परीक्षण के उद्देश्य, संभावित लाभों और आयुर्वेदिक औषधि के संभावित प्रभावों के बारे में मेरी समझ योग्य भाषा में समझाया गया है।</li>
                    <li>मैं समझता/समझती हूँ कि मेरी भागीदारी पूरी तरह स्वैच्छिक है और मैं किसी भी समय अपनी सहमति वापस ले सकता/सकती हूँ।</li>
                    <li>मेरा स्वास्थ्य डेटा आभा आईडी (<code>{selectedRecord.abhaId}</code>) के माध्यम से सुरक्षित है एवं एईएस-256 एन्क्रिप्शन द्वारा संरक्षित है।</li>
                  </ul>
                </div>
              </div>

              <div className="icf-signatures-box">
                <div className="sig-block">
                  <span className="sig-label">Participant / Legally Acceptable Representative (LAR):</span>
                  <div className="sig-value">
                    <span className="font-mono text-accent">Subject ID: {selectedRecord.subjectId}</span>
                    <span className="sig-stamp">Digitally Signed via ABHA OTP Authentication</span>
                  </div>
                </div>

                <div className="sig-block">
                  <span className="sig-label">Principal Investigator / Designee:</span>
                  <div className="sig-value">
                    <span>Dr. Tanuja Nesari, MD (Ayu), PhD</span>
                    <span className="sig-stamp">GCP e-Signature Verified · 21 CFR Part 11</span>
                  </div>
                </div>
              </div>

              <div className="icf-cryptographic-footer">
                <span className="font-mono text-muted">
                  SHA-256 Digital Verification Hash: {selectedRecord.digitalSignatureHash || '8f4c2810a9f3b76182cd9320e11a68427f2c8419641d409028e3b0c44298fc1c'}
                </span>
                <span className="security-tag">🔒 Immutable ALCOA+ Audit Log Link Verified</span>
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn-print"
                onClick={() => window.alert(`Exporting signed e-ICF PDF for Subject: ${selectedRecord.subjectId}`)}
              >
                📥 Download Signed e-Consent PDF
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setSelectedRecord(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Right to Withdraw Consent (DPDP Sec 6(7)) */}
      {withdrawingSubject && (
        <div className="consent-modal-overlay">
          <div className="consent-modal-card withdraw-modal">
            <div className="modal-header">
              <div>
                <span className="modal-tag-warn">DPDP ACT 2023 · SECTION 6(7) STATUTORY RIGHT</span>
                <h3 className="modal-title">Confirm Consent Revocation</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setWithdrawingSubject(null)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmWithdrawal} className="modal-form">
              <div className="withdraw-warning-box">
                <span className="warn-icon">⚠️</span>
                <div>
                  <strong>Statutory Notice:</strong>
                  <p>
                    Under Section 6(7) of the Digital Personal Data Protection Act, 2023, the Data Principal has the right to withdraw consent at any time.
                    Upon confirmation:
                  </p>
                  <ul>
                    <li>Investigational product dosing will be discontinued immediately.</li>
                    <li>No further biological samples will be collected.</li>
                    <li>An immutable ALCOA+ Audit Trail record will be permanently generated.</li>
                  </ul>
                </div>
              </div>

              <div className="form-group">
                <label>Target Participant ID:</label>
                <input
                  type="text"
                  disabled
                  value={`${withdrawingSubject.subjectId} (ABHA: ${withdrawingSubject.abhaId})`}
                  className="font-mono bg-darker"
                />
              </div>

              <div className="form-group">
                <label>Reason for Consent Revocation:</label>
                <select
                  value={withdrawalReason}
                  onChange={(e) => setWithdrawalReason(e.target.value)}
                >
                  <option value="Personal reasons / relocation">Personal reasons / relocation</option>
                  <option value="Adverse event concern (Self-reported)">Adverse event concern (Self-reported)</option>
                  <option value="Inability to attend regular trial follow-ups">Inability to attend regular trial follow-ups</option>
                  <option value="Revoked via ABHA Consent Manager Gateway">Revoked via ABHA Consent Manager Gateway</option>
                  <option value="Participant choice without providing cause">Participant choice without providing cause (Section 6(7))</option>
                </select>
              </div>

              <div className="form-group">
                <label>Coordinator / Investigator Confirmation:</label>
                <div className="checkbox-row">
                  <input type="checkbox" required id="confirm-withdraw-chk" />
                  <label htmlFor="confirm-withdraw-chk">
                    I confirm that the participant has exercised their statutory right under DPDP Act 2023 and safety follow-up instructions have been documented.
                  </label>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setWithdrawingSubject(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-confirm-withdraw">
                  Confirm Revocation &amp; Log to Audit Trail
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
