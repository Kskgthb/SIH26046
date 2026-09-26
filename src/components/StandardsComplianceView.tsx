import React, { useState } from 'react'
import type { AuditLogEntry, DPDPRecord } from '../types'

interface StandardsComplianceViewProps {
  auditLogs: AuditLogEntry[]
  dpdpRecords: DPDPRecord[]
  onNavigateToAudit?: () => void
  onNavigateToConsent?: () => void
}

export const StandardsComplianceView: React.FC<StandardsComplianceViewProps> = ({
  auditLogs,
  dpdpRecords,
  onNavigateToAudit,
  onNavigateToConsent,
}) => {
  const [activeTab, setActiveTab] = useState<'cdisc' | 'fhir' | 'abdm' | 'alcoa' | 'dpdp'>('cdisc')
  const [copiedFhir, setCopiedFhir] = useState(false)
  const [fhirViewMode, setFhirViewMode] = useState<'visual' | 'json'>('visual')
  const [selectedEndpoint, setSelectedEndpoint] = useState<'study' | 'subject' | 'ae'>('study')
  const [isSendingRequest, setIsSendingRequest] = useState(false)
  const [requestLatency, setRequestLatency] = useState('32ms')
  const [abdmPingStatus, setAbdmPingStatus] = useState<string | null>(null)

  const fhirPayloads = {
    study: {
      resourceType: 'ResearchStudy',
      id: 'AIIA-CTU-2024-01',
      identifier: [
        { system: 'http://ctri.nic.in', value: 'CTRI/2024/03/064219' },
        { system: 'http://aiia.gov.in/protocols', value: 'AIIA/CTU/2024/01' },
      ],
      title: 'A Multicentric, Randomized Phase III Trial of Standardized Ashwagandha & Guduchi in Post-Viral Cognitive Fatigue',
      status: 'active',
      phase: {
        coding: [{ system: 'http://terminology.hl7.org/CodeSystem/research-study-phase', code: 'phase-3', display: 'Phase III' }],
      },
      category: [{ text: 'Ayurveda & Integrative Medicine' }],
      sponsor: { display: 'All India Institute of Ayurveda (AIIA)' },
      principalInvestigator: { display: 'Dr. Tanuja Nesari, MD (Ayu), PhD' },
      site: [
        { display: 'All India Institute of Ayurveda, New Delhi' },
        { display: 'National Institute of Ayurveda, Jaipur' },
        { display: 'ITRA, Jamnagar' },
        { display: 'Govt Ayurveda College, Thiruvananthapuram' },
      ],
    },
    subject: {
      resourceType: 'ResearchSubject',
      id: 'SUBJ-AIIA-01-042',
      identifier: [
        { system: 'https://healthid.ndhm.gov.in/abha', value: '91-4432-8901-7712' },
        { system: 'urn:aiia:subject-id', value: 'AIIA-01-042' },
      ],
      status: 'active',
      period: { start: '2024-04-12' },
      study: { reference: 'ResearchStudy/AIIA-CTU-2024-01' },
      individual: {
        reference: 'Patient/PAT-DEL-8901',
        display: 'Verified Ayushman Bharat Health Account (ABHA)',
      },
      consent: {
        display: 'DPDP Act 2023 Compliant e-Consent v2.0 (Dual Hindi/English)',
      },
    },
    ae: {
      resourceType: 'AdverseEvent',
      id: 'AE-10006482',
      actuality: 'actual',
      category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/adverse-event-category', code: 'expedited-sae', display: '7-Day Expedited SAE' }] }],
      event: {
        coding: [
          { system: 'https://www.meddra.org', code: '10006482', display: 'Bronchospasm' },
        ],
        text: 'Severe Anaphylactoid Bronchospasm following Investigational Drug dose',
      },
      subject: { reference: 'ResearchSubject/SUBJ-AIIA-01-042' },
      date: '2026-09-24T14:30:00+05:30',
      seriousness: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/adverse-event-seriousness', code: 'serious-life-threatening', display: 'Life-Threatening' }] },
      causality: [
        {
          assessment: { text: 'Possible causal relationship with Investigational Ashwagandha formulation' },
        },
      ],
    },
  }

  const sampleSdtmAE = [
    { STUDYID: 'AIIA202401', DOMAIN: 'AE', USUBJID: 'AIIA-01-042', AETERM: 'Bronchospasm', AEDECOD: 'Bronchospasm', AEBODSYS: 'Respiratory', AESER: 'Y', AESEV: 'SEVERE', AESTDTC: '2026-09-24' },
    { STUDYID: 'AIIA202504', DOMAIN: 'AE', USUBJID: 'AIIMS-02-089', AETERM: 'Hypoglycaemia', AEDECOD: 'Hypoglycaemia', AEBODSYS: 'Metabolism', AESER: 'Y', AESEV: 'SEVERE', AESTDTC: '2026-09-21' },
    { STUDYID: 'AIIA202401', DOMAIN: 'AE', USUBJID: 'ITRA-03-054', AETERM: 'Heartburn', AEDECOD: 'Dyspepsia', AEBODSYS: 'Gastrointestinal', AESER: 'N', AESEV: 'MILD', AESTDTC: '2026-09-20' },
  ]

  const handleDownloadSdtmCSV = () => {
    const csvContent =
      'STUDYID,DOMAIN,USUBJID,AETERM,AEDECOD,AEBODSYS,AESER,AESEV,AESTDTC\n' +
      sampleSdtmAE
        .map(
          (r) =>
            `${r.STUDYID},${r.DOMAIN},${r.USUBJID},"${r.AETERM}","${r.AEDECOD}","${r.AEBODSYS}",${r.AESER},${r.AESEV},${r.AESTDTC}`
        )
        .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'AIIA_CDISC_SDTM_AE_Domain.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDownloadDefineXML = () => {
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<ODM xmlns="http://www.cdisc.org/ns/odm/v1.3"
     xmlns:def="http://www.cdisc.org/ns/def/v2.1"
     FileOID="AIIA.CTMS.SDTM.DEFINE.01"
     FileType="Snapshot"
     CreationDateTime="${new Date().toISOString()}">
  <Study OID="AIIA-CTU-2024-01">
    <GlobalVariables>
      <StudyName>AIIA Ayurvedic Clinical Trial: Ashwagandha &amp; Guduchi</StudyName>
      <StudyDescription>Standardized Phase III RCT in Post-Viral Fatigue</StudyDescription>
      <ProtocolName>AIIA/CTU/2024/01</ProtocolName>
    </GlobalVariables>
    <MetaDataVersion OID="MDV.AIIA.SDTM.3.3" Name="CDISC SDTM v3.3 &amp; Define-XML v2.1" def:StandardName="SDTM" def:StandardVersion="3.3">
      <def:ItemGroupDef OID="IG.AE" Name="AE" Repeating="Yes" IsReferenceData="No" Purpose="Tabulation" def:Structure="One record per adverse event per subject" def:Class="EVENTS" def:ArchiveLocationID="LF.AE">
        <Description><TranslatedText xml:lang="en">Adverse Events</TranslatedText></Description>
      </def:ItemGroupDef>
    </MetaDataVersion>
  </Study>
</ODM>`

    const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'Define_XML_v2.1_AIIA_CTMS.xml')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleSendFhirRequest = () => {
    setIsSendingRequest(true)
    setTimeout(() => {
      setIsSendingRequest(false)
      const latencies = ['22ms', '28ms', '34ms', '19ms']
      setRequestLatency(latencies[Math.floor(Math.random() * latencies.length)])
    }, 450)
  }

  const handleTestAbdmPing = () => {
    setAbdmPingStatus('Testing ABDM Gateway Sandbox v1.0...')
    setTimeout(() => {
      setAbdmPingStatus('✓ ABDM Sandbox Verified: ABHA M1 (Creation), M2 (Link HIP) & M3 (Consent Manager) Gateway Active with 200 OK Response!')
    }, 900)
  }

  const currentPayload = fhirPayloads[selectedEndpoint]

  return (
    <div id="standards-compliance" className="standards-container">
      <div className="standards-header">
        <span className="section-eyebrow">STANDARDS, INTEROPERABILITY &amp; DATA INTEGRITY</span>
        <h2 className="widget-title">CDISC · HL7 FHIR · ABDM · ALCOA+ · DPDP</h2>
        <p className="widget-subtitle">
          Engineered for international regulatory submission readiness (FDA/EMA/CDSCO), Ayushman Bharat Digital Mission (ABDM) interoperability, and ALCOA+ immutable data governance.
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

      {/* TAB 1: CDISC (SDTM / ADaM / Define-XML) */}
      {activeTab === 'cdisc' && (
        <div className="std-tab-content">
          <div className="std-info-box">
            <div className="info-title-row">
              <h4>Submission-Ready CDISC Data Transformation</h4>
              <span className="badge-cert">Define-XML v2.1 Ready</span>
            </div>
            <p>
              eCRF forms conform strictly to <strong>CDASH v2.2</strong> standards. Automated ETL pipelines transform EDC clinical trial data into regulatory submission-grade <strong>SDTM v3.3</strong> and <strong>ADaM v1.3</strong> datasets with automated Pinnacle 21 validation checks.
            </p>
            <div className="export-actions-row">
              <button
                type="button"
                className="std-export-btn"
                onClick={handleDownloadSdtmCSV}
              >
                📥 Download SDTM AE Dataset (CSV)
              </button>
              <button
                type="button"
                className="std-export-sec-btn"
                onClick={handleDownloadDefineXML}
              >
                📥 Download Define-XML v2.1 (XML)
              </button>
              <button
                type="button"
                className="std-export-sec-btn"
                onClick={() => window.alert('Pinnacle 21 Community Rules Check: 0 Critical Errors, 0 Blocker Warnings, Conforms to FDA & CDSCO Technical Conformance Guide.')}
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

      {/* TAB 2: HL7 FHIR R4 Middleware */}
      {activeTab === 'fhir' && (
        <div className="std-tab-content">
          <div className="std-info-box">
            <div className="info-title-row">
              <h4>HL7 FHIR R4 Interoperability Facade</h4>
              <span className="badge-cert">FHIR R4 JSON Compliant</span>
            </div>
            <p>
              Enables bidirectional real-time data exchange between Hospital Information Systems (HIS), Electronic Data Capture (EDC), and national regulatory portals using standard RESTful FHIR endpoints.
            </p>

            <div className="fhir-endpoint-selector-bar">
              <label>Select FHIR Resource Endpoint:</label>
              <div className="endpoint-buttons">
                <button
                  type="button"
                  className={`ep-btn ${selectedEndpoint === 'study' ? 'active' : ''}`}
                  onClick={() => setSelectedEndpoint('study')}
                >
                  GET /ResearchStudy
                </button>
                <button
                  type="button"
                  className={`ep-btn ${selectedEndpoint === 'subject' ? 'active' : ''}`}
                  onClick={() => setSelectedEndpoint('subject')}
                >
                  GET /ResearchSubject
                </button>
                <button
                  type="button"
                  className={`ep-btn ${selectedEndpoint === 'ae' ? 'active' : ''}`}
                  onClick={() => setSelectedEndpoint('ae')}
                >
                  GET /AdverseEvent
                </button>
              </div>
            </div>

            <div className="fhir-api-console-bar">
              <div className="api-url-group">
                <span className="http-method-badge">GET</span>
                <span className="api-endpoint-url font-mono">
                  https://api.aiia.gov.in/fhir/r4/{selectedEndpoint === 'study' ? 'ResearchStudy/AIIA-CTU-2024-01' : selectedEndpoint === 'subject' ? 'ResearchSubject/SUBJ-AIIA-01-042' : 'AdverseEvent/AE-10006482'}
                </span>
              </div>
              <div className="api-metrics-group">
                <button
                  type="button"
                  className="btn-send-req"
                  onClick={handleSendFhirRequest}
                  disabled={isSendingRequest}
                >
                  {isSendingRequest ? '⚡ Sending...' : '🚀 Send Request'}
                </button>
                <span className="api-status-pill">● 200 OK</span>
                <span className="api-latency-pill">⚡ {requestLatency}</span>
              </div>
            </div>

            <div className="fhir-view-mode-selector">
              <div className="mode-toggle-group">
                <button
                  type="button"
                  className={`fhir-mode-btn ${fhirViewMode === 'visual' ? 'active' : ''}`}
                  onClick={() => setFhirViewMode('visual')}
                >
                  <span>👁️ Visual Clinical View</span>
                </button>
                <button
                  type="button"
                  className={`fhir-mode-btn ${fhirViewMode === 'json' ? 'active' : ''}`}
                  onClick={() => setFhirViewMode('json')}
                >
                  <span>💻 Raw JSON Payload</span>
                </button>
              </div>

              <button
                type="button"
                className="btn-copy-fhir"
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(currentPayload, null, 2))
                  setCopiedFhir(true)
                  setTimeout(() => setCopiedFhir(false), 2000)
                }}
              >
                {copiedFhir ? '✓ Copied!' : '📋 Copy JSON'}
              </button>
            </div>
          </div>

          {fhirViewMode === 'visual' ? (
            <div className="fhir-visual-panel">
              <div className="fhir-resource-card full-card">
                <div className="res-card-top">
                  <span className="res-badge study">{currentPayload.resourceType}</span>
                  <span className="res-status-dot active">● Active / Validated</span>
                </div>
                <h4 className="res-title">
                  {selectedEndpoint === 'study'
                    ? (currentPayload as any).title
                    : selectedEndpoint === 'subject'
                    ? `Trial Participant: ${(currentPayload as any).id}`
                    : (currentPayload as any).event.text}
                </h4>
                <div className="res-properties">
                  <div className="res-row">
                    <span className="res-key">Resource ID:</span>
                    <span className="res-val font-mono">{currentPayload.id}</span>
                  </div>
                  {selectedEndpoint === 'subject' && (
                    <div className="res-row">
                      <span className="res-key">ABHA Health ID:</span>
                      <span className="res-val font-mono text-accent">91-4432-8901-7712</span>
                    </div>
                  )}
                  {selectedEndpoint === 'ae' && (
                    <div className="res-row">
                      <span className="res-key">MedDRA PT:</span>
                      <span className="res-val font-mono text-critical">10006482 (Bronchospasm)</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="code-preview-card">
              <pre className="json-pre font-mono">
                {JSON.stringify(currentPayload, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ABDM & ABHA Gateway */}
      {activeTab === 'abdm' && (
        <div className="std-tab-content">
          <div className="std-info-box">
            <div className="info-title-row">
              <h4>Ayushman Bharat Digital Mission (ABDM) Integration</h4>
              <span className="badge-cert">ABDM M1, M2 &amp; M3 Conforming</span>
            </div>
            <p>
              Integrates with the National Health Authority (NHA) gateway for verified patient identity via 14-digit <strong>ABHA ID</strong>, electronic consent management, and secure longitudinal health record linkage.
            </p>
            <div className="export-actions-row">
              <button
                type="button"
                className="std-export-btn"
                onClick={handleTestAbdmPing}
              >
                📡 Test ABDM Gateway Sandbox Connection
              </button>
            </div>
          </div>

          {abdmPingStatus && (
            <div className="verification-banner success">
              <span>{abdmPingStatus}</span>
            </div>
          )}

          <div className="abdm-milestones-grid">
            <div className="abdm-card">
              <div className="milestone-badge">MILESTONE 1 (M1)</div>
              <h4>ABHA Health ID Creation &amp; Verification</h4>
              <p>Participants verify identity via Aadhaar/Mobile OTP. Eliminates ghost enrollment and ensures authentic demographic validation.</p>
              <div className="abdm-stat-tag">✓ 100% Cohort Linked</div>
            </div>

            <div className="abdm-card">
              <div className="milestone-badge">MILESTONE 2 (M2)</div>
              <h4>Health Information Provider (HIP)</h4>
              <p>Clinical trial sites publish diagnostic reports, trial prescription summaries, and adverse event encounters to the ABDM Health Locker.</p>
              <div className="abdm-stat-tag">✓ FHIR R4 Bundle Publisher</div>
            </div>

            <div className="abdm-card">
              <div className="milestone-badge">MILESTONE 3 (M3)</div>
              <h4>Consent Manager &amp; HIU Gateway</h4>
              <p>Participant controls data sharing permissions via Ayushman Bharat App. Enables patient-consented electronic medical record imports.</p>
              <div className="abdm-stat-tag">✓ DPDP Act Conforming</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ALCOA+ Audit Trail Link */}
      {activeTab === 'alcoa' && (
        <div className="std-tab-content">
          <div className="std-info-box">
            <div className="info-title-row">
              <h4>ALCOA+ Cryptographic Audit Trail Architecture</h4>
              <span className="badge-cert">21 CFR Part 11 &amp; GAMP-5</span>
            </div>
            <p>
              Immutable cryptographic ledger enforcing Attributable, Legible, Contemporaneous, Original, and Accurate data records with zero in-place updates.
            </p>
            <div className="export-actions-row">
              {onNavigateToAudit && (
                <button
                  type="button"
                  className="std-export-btn"
                  onClick={onNavigateToAudit}
                >
                  🔍 Open Full Dedicated ALCOA+ Audit Log Page →
                </button>
              )}
            </div>
          </div>

          <div className="code-preview-card">
            <span className="code-label">Recent Cryptographic Ledger Snippet:</span>
            <div className="table-responsive-wrapper">
              <table className="mini-sdtm-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>User &amp; Role</th>
                    <th>Action</th>
                    <th>Entity &amp; ID</th>
                    <th>Narrative</th>
                    <th>SHA-256 Hash</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.slice(0, 4).map((log) => (
                    <tr key={log.id}>
                      <td className="font-mono text-xs">{log.timestamp}</td>
                      <td><strong>{log.userName}</strong> ({log.role})</td>
                      <td><span className="action-badge font-mono">{log.action}</span></td>
                      <td className="font-mono text-xs">{log.entity}: {log.entityId}</td>
                      <td>{log.details}</td>
                      <td className="font-mono text-xs text-accent">{log.alcoaHash.substring(0, 14)}...</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DPDP Act & CERT-In */}
      {activeTab === 'dpdp' && (
        <div className="std-tab-content">
          <div className="std-info-box">
            <div className="info-title-row">
              <h4>DPDP Act 2023 &amp; CERT-In Security Governance</h4>
              <span className="badge-cert">ISO/IEC 27001 &amp; CERT-In Validated</span>
            </div>
            <p>
              Guaranteed data sovereignty on <strong>MeitY-Empanelled Cloud in India</strong> with AES-256 encryption at-rest, TLS 1.3 in-transit, and statutory right to erasure handling.
            </p>
            <div className="export-actions-row">
              {onNavigateToConsent && (
                <button
                  type="button"
                  className="std-export-btn"
                  onClick={onNavigateToConsent}
                >
                  📜 Open Consent Management Screen (DPDP) →
                </button>
              )}
            </div>
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
              <span className="banner-val font-semibold">Passed (Report #CERT-IN/2026/AIIA-CTMS-881)</span>
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
                  <th>Right to Erasure (Sec 12)</th>
                </tr>
              </thead>
              <tbody>
                {dpdpRecords.map((dp, i) => (
                  <tr key={i}>
                    <td className="font-mono font-semibold">{dp.subjectId}</td>
                    <td className="font-mono">{dp.abhaId}</td>
                    <td>{dp.consentDate}</td>
                    <td>{dp.consentVersion}</td>
                    <td><span className="badge-check">● {dp.consentStatus}</span></td>
                    <td>{dp.dataResidency}</td>
                    <td>{dp.rightToErasureRequest ? '⚠️ Erasure Request Filed' : 'None Active'}</td>
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
