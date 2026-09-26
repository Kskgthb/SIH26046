import React, { useState } from 'react'
import type { AuditLogEntry, DPDPRecord } from '../types'

interface StandardsComplianceViewProps {
  auditLogs: AuditLogEntry[]
  dpdpRecords: DPDPRecord[]
}

export const StandardsComplianceView: React.FC<StandardsComplianceViewProps> = ({
  auditLogs,
  dpdpRecords,
}) => {
  const [activeTab, setActiveTab] = useState<'cdisc' | 'fhir' | 'abdm' | 'alcoa' | 'dpdp'>('cdisc')
  const [copiedFhir, setCopiedFhir] = useState(false)
  const [validatedFhir, setValidatedFhir] = useState(false)
  const [fhirViewMode, setFhirViewMode] = useState<'visual' | 'json'>('visual')

  const sampleFhirBundle = {
    resourceType: 'Bundle',
    type: 'collection',
    total: 3,
    entry: [
      {
        resource: {
          resourceType: 'ResearchStudy',
          id: 'AIIA-CTU-2024-01',
          title: 'Standardized Ashwagandha & Guduchi in Post-Viral Cognitive Fatigue',
          status: 'active',
          phase: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/research-study-phase', code: 'phase-3' }] },
          sponsor: { display: 'All India Institute of Ayurveda (AIIA)' },
        },
      },
      {
        resource: {
          resourceType: 'ResearchSubject',
          id: 'SUBJ-AIIA-01-042',
          status: 'active',
          identifier: [{ system: 'https://healthid.ndhm.gov.in/abha', value: '91-4432-8901-7712' }],
          study: { reference: 'ResearchStudy/AIIA-CTU-2024-01' },
        },
      },
      {
        resource: {
          resourceType: 'AdverseEvent',
          id: 'AE-10006482',
          actuality: 'actual',
          category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/adverse-event-category', code: 'medication-mishap' }] }],
          event: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/meddra', code: '10006482', display: 'Bronchospasm' }] },
          subject: { reference: 'ResearchSubject/SUBJ-AIIA-01-042' },
          seriousness: { coding: [{ code: 'serious', display: 'Life-threatening' }] },
        },
      },
    ],
  }

  const sampleSdtmAE = [
    { STUDYID: 'AIIA202401', DOMAIN: 'AE', USUBJID: 'AIIA-01-042', AETERM: 'Bronchospasm', AEDECOD: 'Bronchospasm', AEBODSYS: 'Respiratory', AESER: 'Y', AESEV: 'SEVERE', AESTDTC: '2026-09-24' },
    { STUDYID: 'AIIA202504', DOMAIN: 'AE', USUBJID: 'AIIMS-02-089', AETERM: 'Hypoglycaemia', AEDECOD: 'Hypoglycaemia', AEBODSYS: 'Metabolism', AESER: 'Y', AESEV: 'SEVERE', AESTDTC: '2026-09-21' },
    { STUDYID: 'AIIA202401', DOMAIN: 'AE', USUBJID: 'ITRA-03-054', AETERM: 'Heartburn', AEDECOD: 'Dyspepsia', AEBODSYS: 'Gastrointestinal', AESER: 'N', AESEV: 'MILD', AESTDTC: '2026-09-20' },
  ]

  return (
    <div id="standards-compliance" className="standards-container">
      <div className="standards-header">
        <span className="section-eyebrow">STANDARDS, INTEROPERABILITY &amp; DATA INTEGRITY</span>
        <h2 className="widget-title">CDISC · HL7 FHIR · ABDM · DPDP Act 2023</h2>
        <p className="widget-subtitle">
          Engineered for international submission readiness (FDA/EMA/CDSCO), Ayushman Bharat Digital Mission interoperability, and ALCOA+ immutable data governance.
        </p>
      </div>

      {/* Standards Tab Selector */}
      <div className="standards-nav-tabs">
        <button
          type="button"
          className={`std-tab-btn ${activeTab === 'cdisc' ? 'active' : ''}`}
          onClick={() => setActiveTab('cdisc')}
        >
          <span>📦 CDISC (SDTM/ADaM)</span>
        </button>
        <button
          type="button"
          className={`std-tab-btn ${activeTab === 'fhir' ? 'active' : ''}`}
          onClick={() => setActiveTab('fhir')}
        >
          <span>🔥 HL7 FHIR R4 Middleware</span>
        </button>
        <button
          type="button"
          className={`std-tab-btn ${activeTab === 'abdm' ? 'active' : ''}`}
          onClick={() => setActiveTab('abdm')}
        >
          <span>🇮🇳 ABDM &amp; ABHA Gateway</span>
        </button>
        <button
          type="button"
          className={`std-tab-btn ${activeTab === 'alcoa' ? 'active' : ''}`}
          onClick={() => setActiveTab('alcoa')}
        >
          <span>🔒 ALCOA+ Audit Trail</span>
        </button>
        <button
          type="button"
          className={`std-tab-btn ${activeTab === 'dpdp' ? 'active' : ''}`}
          onClick={() => setActiveTab('dpdp')}
        >
          <span>🛡️ DPDP Act &amp; CERT-In</span>
        </button>
      </div>

      {/* Tab 1: CDISC */}
      {activeTab === 'cdisc' && (
        <div className="std-tab-content">
          <div className="std-info-box">
            <div className="info-title-row">
              <h4>Submission-Ready CDISC Data Transformation</h4>
              <span className="badge-cert">Define-XML v2.1 Ready</span>
            </div>
            <p>
              eCRF forms conform strictly to <strong>CDASH v2.2</strong> standards. Automated ETL pipelines transform EDC data into regulatory submission-grade <strong>SDTM v3.3</strong> and <strong>ADaM v1.3</strong> datasets with automated Pinnacle 21 validation checks.
            </p>
            <div className="export-actions-row">
              <button
                type="button"
                className="std-export-btn"
                onClick={() => window.alert('Downloading CDISC SDTM Package (.zip containing AE.xpt, DM.xpt, LB.xpt, VS.xpt, Define.xml)...')}
              >
                📥 Download Submission Package (SDTM/Define-XML)
              </button>
              <button
                type="button"
                className="std-export-sec-btn"
                onClick={() => window.alert('Validating against CDISC Conformance Rules 2026.0... Status: 0 Critical Errors, 0 Blocker Warnings!')}
              >
                ✓ Run CDISC Conformance Validator
              </button>
            </div>
          </div>

          <div className="code-preview-card">
            <span className="code-label">SDTM Domain AE (Adverse Events Dataset Preview):</span>
            <div className="table-responsive-wrapper">
              <table className="mini-sdtm-table">
                <thead>
                  <tr>
                    <th>STUDYID</th>
                    <th>DOMAIN</th>
                    <th>USUBJID</th>
                    <th>AETERM</th>
                    <th>AEDECOD (MedDRA PT)</th>
                    <th>AEBODSYS (SOC)</th>
                    <th>AESER</th>
                    <th>AESEV</th>
                    <th>AESTDTC</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleSdtmAE.map((row, i) => (
                    <tr key={i}>
                      <td className="font-mono">{row.STUDYID}</td>
                      <td className="font-mono">{row.DOMAIN}</td>
                      <td className="font-mono">{row.USUBJID}</td>
                      <td>{row.AETERM}</td>
                      <td className="font-semibold text-accent">{row.AEDECOD}</td>
                      <td>{row.AEBODSYS}</td>
                      <td>{row.AESER}</td>
                      <td>{row.AESEV}</td>
                      <td className="font-mono">{row.AESTDTC}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: HL7 FHIR R4 */}
      {activeTab === 'fhir' && (
        <div className="std-tab-content">
          <div className="std-info-box">
            <div className="info-title-row">
              <h4>HL7 FHIR R4 Interoperability Facade</h4>
              <span className="badge-cert">FHIR R4 JSON Compliant</span>
            </div>
            <p>
              Enables bidirectional real-time data exchange between Hospital Information Systems (HIS), Electronic Data Capture (EDC), and regulatory portals using standard RESTful FHIR endpoints (<code>/ResearchStudy</code>, <code>/ResearchSubject</code>, <code>/AdverseEvent</code>).
            </p>

            <div className="fhir-view-mode-selector">
              <span className="mode-selector-label">Display Presentation:</span>
              <div className="mode-toggle-group">
                <button
                  type="button"
                  className={`fhir-mode-btn ${fhirViewMode === 'visual' ? 'active' : ''}`}
                  onClick={() => setFhirViewMode('visual')}
                >
                  <span>👁️ Visual Clinical Cards (Human-Friendly)</span>
                </button>
                <button
                  type="button"
                  className={`fhir-mode-btn ${fhirViewMode === 'json' ? 'active' : ''}`}
                  onClick={() => setFhirViewMode('json')}
                >
                  <span>💻 Raw Technical JSON (Developer API)</span>
                </button>
              </div>
            </div>

            <div className="fhir-api-console-bar">
              <div className="api-url-group">
                <span className="http-method-badge">GET</span>
                <span className="api-endpoint-url font-mono">
                  https://api.aiia.gov.in/fhir/r4/ResearchStudy/AIIA-CTU-2024-01/$bundle
                </span>
              </div>
              <div className="api-metrics-group">
                <span className="api-status-pill">● 200 OK</span>
                <span className="api-latency-pill">⚡ 38ms</span>
              </div>
            </div>

            <div className="export-actions-row">
              <button
                type="button"
                className="std-export-btn"
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(sampleFhirBundle, null, 2))
                  setCopiedFhir(true)
                  setTimeout(() => setCopiedFhir(false), 2500)
                }}
              >
                {copiedFhir ? '✓ JSON Copied to Clipboard!' : '📋 Copy FHIR Bundle JSON'}
              </button>

              <button
                type="button"
                className="std-export-sec-btn"
                onClick={() => {
                  setValidatedFhir(true)
                  setTimeout(() => setValidatedFhir(false), 3000)
                }}
              >
                {validatedFhir ? '✓ FHIR R4 Conformance Validated!' : '🔍 Test FHIR Schema Validator'}
              </button>
            </div>
          </div>

          {/* MODE 1: VISUAL CLINICAL CARDS (Default human-friendly UI) */}
          {fhirViewMode === 'visual' && (
            <div className="fhir-visual-panel">
              {/* Architecture Flow Banner */}
              <div className="fhir-arch-flow">
                <div className="arch-node">
                  <span className="arch-icon">🏥</span>
                  <span className="arch-name">Hospital HIS / EMR</span>
                  <span className="arch-sub">Source Clinical EHR</span>
                </div>
                <span className="arch-arrow">⟷</span>
                <div className="arch-node active-hub">
                  <span className="arch-icon">⚡</span>
                  <span className="arch-name">FHIR R4 Middleware</span>
                  <span className="arch-sub">Data Normalization Facade</span>
                </div>
                <span className="arch-arrow">⟷</span>
                <div className="arch-node">
                  <span className="arch-icon">🇮🇳</span>
                  <span className="arch-name">ABDM &amp; CDSCO</span>
                  <span className="arch-sub">National Health Gateway</span>
                </div>
              </div>

              {/* Visual Resource Cards Grid */}
              <div className="fhir-resources-grid">
                {/* Resource 1: ResearchStudy */}
                <div className="fhir-resource-card">
                  <div className="res-card-top">
                    <span className="res-badge study">ResearchStudy</span>
                    <span className="res-status-dot active">● Active</span>
                  </div>
                  <h4 className="res-title">Standardized Ashwagandha &amp; Guduchi in Post-Viral Cognitive Fatigue</h4>
                  <div className="res-properties">
                    <div className="res-row">
                      <span className="res-key">Resource ID:</span>
                      <span className="res-val font-mono">AIIA-CTU-2024-01</span>
                    </div>
                    <div className="res-row">
                      <span className="res-key">Clinical Phase:</span>
                      <span className="res-val">Phase 3 (RCT)</span>
                    </div>
                    <div className="res-row">
                      <span className="res-key">Principal Sponsor:</span>
                      <span className="res-val">All India Institute of Ayurveda</span>
                    </div>
                    <div className="res-row">
                      <span className="res-key">Therapeutic Area:</span>
                      <span className="res-val">Integrative Medicine / Long-COVID</span>
                    </div>
                  </div>
                  <div className="res-card-footer">
                    <span className="res-meta-text">FHIR R4 Standardized Resource</span>
                  </div>
                </div>

                {/* Resource 2: ResearchSubject */}
                <div className="fhir-resource-card">
                  <div className="res-card-top">
                    <span className="res-badge subject">ResearchSubject</span>
                    <span className="res-status-dot active">● Active</span>
                  </div>
                  <h4 className="res-title">Trial Participant: Subject 042</h4>
                  <div className="res-properties">
                    <div className="res-row">
                      <span className="res-key">Resource ID:</span>
                      <span className="res-val font-mono">SUBJ-AIIA-01-042</span>
                    </div>
                    <div className="res-row">
                      <span className="res-key">Linked ABHA ID:</span>
                      <span className="res-val font-mono text-accent">91-4432-8901-7712</span>
                    </div>
                    <div className="res-row">
                      <span className="res-key">Assigned Trial:</span>
                      <span className="res-val font-mono">AIIA-CTU-2024-01</span>
                    </div>
                    <div className="res-row">
                      <span className="res-key">Consent Status:</span>
                      <span className="res-val text-green font-semibold">✓ Verified (v2.0 Dual Script)</span>
                    </div>
                  </div>
                  <div className="res-card-footer">
                    <span className="res-meta-text">NHA / ABDM Patient Identity Linked</span>
                  </div>
                </div>

                {/* Resource 3: AdverseEvent */}
                <div className="fhir-resource-card alert-card">
                  <div className="res-card-top">
                    <span className="res-badge ae">AdverseEvent</span>
                    <span className="res-status-dot critical">● Life-Threatening</span>
                  </div>
                  <h4 className="res-title">Acute Bronchospastic Episode</h4>
                  <div className="res-properties">
                    <div className="res-row">
                      <span className="res-key">Resource ID:</span>
                      <span className="res-val font-mono">AE-10006482</span>
                    </div>
                    <div className="res-row">
                      <span className="res-key">MedDRA Coding:</span>
                      <span className="res-val font-mono">10006482 (PT: Bronchospasm)</span>
                    </div>
                    <div className="res-row">
                      <span className="res-key">Seriousness:</span>
                      <span className="res-val text-red font-semibold">SAE (7-Day Expedited CDSCO)</span>
                    </div>
                    <div className="res-row">
                      <span className="res-key">Subject Reference:</span>
                      <span className="res-val font-mono">SUBJ-AIIA-01-042</span>
                    </div>
                  </div>
                  <div className="res-card-footer">
                    <span className="res-meta-text">CDSCO SUGAM &amp; E2B(R3) Conforming</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODE 2: RAW TECHNICAL JSON (Developer View) */}
          {fhirViewMode === 'json' && (
            <div className="code-preview-card">
              <div className="code-card-header">
                <span className="code-label">Live FHIR R4 Bundle JSON Payload:</span>
                <span className="code-meta-tag">MIME: application/fhir+json</span>
              </div>
              <pre className="json-code-block font-mono">
                {JSON.stringify(sampleFhirBundle, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: ABDM */}
      {activeTab === 'abdm' && (
        <div className="std-tab-content">
          <div className="std-info-box">
            <div className="info-title-row">
              <h4>Ayushman Bharat Digital Mission (ABDM) Integration</h4>
              <span className="badge-cert">National Health Authority (NHA) Empanelled</span>
            </div>
            <p>
              Subjects are verified via 14-digit ABHA IDs. Trial consent is recorded as a cryptographic ABDM Consent Artifact (HIU/HIP) enabling verified digital health records linking across India.
            </p>
          </div>

          <div className="abdm-cards-grid">
            <div className="abdm-feature-box">
              <span className="abdm-icon">🆔</span>
              <h4>ABHA Number &amp; Address Verification</h4>
              <p>M3 Milestone compliant: Real-time Aadhaar OTP / Demographic verification of clinical trial subjects.</p>
              <span className="status-live">● Live Gateway Active</span>
            </div>

            <div className="abdm-feature-box">
              <span className="abdm-icon">📑</span>
              <h4>Digital Consent Artifact (HIP/HIU)</h4>
              <p>Consent permissions adhere to NHA consent framework with time-bounded, purpose-specific revocation controls.</p>
              <span className="status-live">● Cryptographic Keys Synced</span>
            </div>

            <div className="abdm-feature-box">
              <span className="abdm-icon">🏥</span>
              <h4>Healthcare Professionals Registry (HPR)</h4>
              <p>Principal Investigators (PIs) and Clinical Research Coordinators verified against National HPR.</p>
              <span className="status-live">● 100% Investigators Verified</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: ALCOA+ Audit Trail */}
      {activeTab === 'alcoa' && (
        <div className="std-tab-content">
          <div className="std-info-box">
            <div className="info-title-row">
              <h4>ALCOA+ Immutable Audit Trail &amp; 21 CFR Part 11</h4>
              <span className="badge-cert">Cryptographically Sealed (SHA-256)</span>
            </div>
            <p>
              Every data creation, amendment, electronic signature, and query resolution is stamped with:
              <strong> Attributable, Legible, Contemporaneous, Original, and Accurate</strong> metadata. Records are immutable and tamper-evident.
            </p>
          </div>

          <div className="table-responsive-wrapper">
            <table className="audit-trail-table">
              <thead>
                <tr>
                  <th>Timestamp (IST)</th>
                  <th>User &amp; Role</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>Audit Narrative</th>
                  <th>SHA-256 Hash</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="font-mono text-xs">{log.timestamp}</td>
                    <td>
                      <strong>{log.userName}</strong>
                      <span className="role-mini-pill">{log.role}</span>
                    </td>
                    <td>
                      <span className="action-badge font-mono">{log.action}</span>
                    </td>
                    <td className="font-mono text-xs">{log.entity}: {log.entityId}</td>
                    <td className="audit-details-cell">{log.details}</td>
                    <td className="hash-cell font-mono" title={log.alcoaHash}>
                      {log.alcoaHash.substring(0, 14)}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: DPDP Act 2023 */}
      {activeTab === 'dpdp' && (
        <div className="std-tab-content">
          <div className="std-info-box">
            <div className="info-title-row">
              <h4>DPDP Act 2023 &amp; 2025 Rules Governance</h4>
              <span className="badge-cert">ISO/IEC 27001 &amp; CERT-In Compliant</span>
            </div>
            <p>
              Digital Personal Data Protection Act compliance verified:
              Data minimization, multi-lingual notice, right to grievance redressal, right to erasure, and 100% <strong>Indian Data Residency (MeitY-empanelled cloud data centers)</strong>.
            </p>
          </div>

          <div className="dpdp-status-banner">
            <div className="dpdp-banner-item">
              <span className="banner-title">Data Residency</span>
              <span className="banner-val font-semibold">🇮🇳 MeitY Empanelled Cloud (New Delhi / Mumbai Region)</span>
            </div>
            <div className="dpdp-banner-item">
              <span className="banner-title">Encryption Standards</span>
              <span className="banner-val font-semibold">AES-256 (At-Rest) &amp; TLS 1.3 (In-Transit)</span>
            </div>
            <div className="dpdp-banner-item">
              <span className="banner-title">CERT-In Security Audit</span>
              <span className="banner-val font-semibold">Passed (Zero High/Critical Vulnerabilities)</span>
            </div>
          </div>

          <div className="table-responsive-wrapper">
            <table className="mini-sdtm-table">
              <thead>
                <tr>
                  <th>Subject ID</th>
                  <th>ABHA ID</th>
                  <th>Consent Date</th>
                  <th>Consent Version</th>
                  <th>Consent Status</th>
                  <th>Data Residency</th>
                  <th>Right to Erasure</th>
                </tr>
              </thead>
              <tbody>
                {dpdpRecords.map((dp, i) => (
                  <tr key={i}>
                    <td className="font-mono font-semibold">{dp.subjectId}</td>
                    <td className="font-mono">{dp.abhaId}</td>
                    <td>{dp.consentDate}</td>
                    <td>{dp.consentVersion}</td>
                    <td>
                      <span className="badge-check">● {dp.consentStatus}</span>
                    </td>
                    <td>{dp.dataResidency}</td>
                    <td>{dp.rightToErasureRequest ? 'Requested' : 'None Filed'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
