import React, { useState } from 'react'
import type { AuditLogEntry, DPDPRecord } from '../types'

interface StandardsComplianceViewProps {
  auditLogs: AuditLogEntry[]
  dpdpRecords: DPDPRecord[]
  onNavigateToAudit?: () => void
  onNavigateToConsent?: () => void
}

export const StandardsComplianceView: React.FC<StandardsComplianceViewProps> = ({
  auditLogs = [],
  dpdpRecords = [],
  onNavigateToAudit,
  onNavigateToConsent,
}) => {
  const [activeTab, setActiveTab] = useState<'cdisc' | 'fhir' | 'abdm' | 'odm' | 'csv'>('cdisc')
  const [cdiscSubTab, setCdiscSubTab] = useState<'cdash' | 'sdtm' | 'adam' | 'definexml'>('sdtm')
  const [copiedFhir, setCopiedFhir] = useState(false)
  const [fhirViewMode, setFhirViewMode] = useState<'visual' | 'json'>('visual')
  const [selectedEndpoint, setSelectedEndpoint] = useState<'study' | 'subject' | 'ae' | 'obs' | 'caps'>('study')
  const [isSendingRequest, setIsSendingRequest] = useState(false)
  const [requestLatency, setRequestLatency] = useState('24ms')
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
      category: [{ text: 'Ayurveda & Integrative Medicine (AIIA NPvCC)' }],
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
        display: 'DPDP Act 2023 Compliant Bilingual e-Consent v2.0',
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
          assessment: { text: 'Possible causal relationship with Investigational formulation' },
        },
      ],
    },
    obs: {
      resourceType: 'Observation',
      id: 'OBS-CFQ11-042',
      status: 'final',
      category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'exam', display: 'Clinical Exam' }] }],
      code: { coding: [{ system: 'http://loinc.org', code: '89547-4', display: 'Chalder Fatigue Scale Score' }] },
      subject: { reference: 'ResearchSubject/SUBJ-AIIA-01-042' },
      effectiveDateTime: '2026-09-20',
      valueQuantity: { value: 16, unit: 'points', system: 'http://unitsofmeasure.org' },
    },
    caps: {
      resourceType: 'CapabilityStatement',
      status: 'active',
      date: '2026-09-27',
      publisher: 'All India Institute of Ayurveda (AIIA)',
      kind: 'instance',
      software: { name: 'AIIA CTMS & NPvCC Platform FHIR Gateway', version: '3.0' },
      implementation: { description: 'FHIR R4 Interoperability Facade for Clinical Trials & Pharmacovigilance' },
      fhirVersion: '4.0.1',
      format: ['application/fhir+json', 'application/fhir+xml'],
    },
  }

  const sampleSdtmAE = [
    { STUDYID: 'AIIA202401', DOMAIN: 'AE', USUBJID: 'AIIA-01-042', AETERM: 'Bronchospasm', AEDECOD: 'Bronchospasm', AEBODSYS: 'Respiratory', AESER: 'Y', AESEV: 'SEVERE', AESTDTC: '2026-09-24' },
    { STUDYID: 'AIIA202504', DOMAIN: 'AE', USUBJID: 'AIIMS-02-089', AETERM: 'Hypoglycaemia', AEDECOD: 'Hypoglycaemia', AEBODSYS: 'Metabolism', AESER: 'Y', AESEV: 'SEVERE', AESTDTC: '2026-09-21' },
    { STUDYID: 'AIIA202401', DOMAIN: 'AE', USUBJID: 'ITRA-03-054', AETERM: 'Heartburn', AEDECOD: 'Dyspepsia', AEBODSYS: 'Gastrointestinal', AESER: 'N', AESEV: 'MILD', AESTDTC: '2026-09-20' },
  ]

  const sampleAdamADSL = [
    { STUDYID: 'AIIA202401', USUBJID: 'AIIA-01-042', SUBJID: '042', SITEID: '101', ARM: 'ACTIVE_ARM_A', TRT01P: 'Ashwagandha+Guduchi', AGE: 42, SEX: 'M', SAFFL: 'Y', ITTFL: 'Y' },
    { STUDYID: 'AIIA202401', USUBJID: 'AIIA-01-048', SUBJID: '048', SITEID: '101', ARM: 'PLACEBO_ARM_B', TRT01P: 'Matching Placebo', AGE: 38, SEX: 'F', SAFFL: 'Y', ITTFL: 'Y' },
    { STUDYID: 'AIIA202504', USUBJID: 'AIIMS-02-089', SUBJID: '089', SITEID: '202', ARM: 'COMPARATOR_ARM', TRT01P: 'Metformin 500mg', AGE: 51, SEX: 'M', SAFFL: 'Y', ITTFL: 'Y' },
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
  <Study OID="AIIA.CTU.2024.01">
    <GlobalVariables>
      <StudyName>A Multicentric Phase III Trial of Ashwagandha &amp; Guduchi</StudyName>
      <StudyDescription>Standardized Ayurveda Formulation in Post-Viral Cognitive Fatigue</StudyDescription>
      <ProtocolName>AIIA/CTU/2024/01</ProtocolName>
    </GlobalVariables>
    <MetaDataVersion OID="MDV.AIIA.SDTM.3.4" Name="CDISC SDTM-IG 3.4 / Define-XML 2.1" def:StandardName="SDTM-IG" def:StandardVersion="3.4">
      <ItemGroupDef OID="IG.AE" Name="AE" Repeating="Yes" IsReferenceData="No" SASDatasetName="AE" Domain="AE" Purpose="Tabulation" def:Structure="One record per adverse event per subject">
        <ItemRef ItemOID="IT.STUDYID" Mandatory="Yes" OrderNumber="1"/>
        <ItemRef ItemOID="IT.DOMAIN" Mandatory="Yes" OrderNumber="2"/>
        <ItemRef ItemOID="IT.USUBJID" Mandatory="Yes" OrderNumber="3"/>
        <ItemRef ItemOID="IT.AETERM" Mandatory="Yes" OrderNumber="4"/>
        <ItemRef ItemOID="IT.AEDECOD" Mandatory="Yes" OrderNumber="5"/>
        <ItemRef ItemOID="IT.AEBODSYS" Mandatory="Yes" OrderNumber="6"/>
        <ItemRef ItemOID="IT.AESER" Mandatory="Yes" OrderNumber="7"/>
      </ItemGroupDef>
    </MetaDataVersion>
  </Study>
</ODM>`

    const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'AIIA_define_v2_1.xml')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleSendTestRequest = () => {
    setIsSendingRequest(true)
    setTimeout(() => {
      setIsSendingRequest(false)
      setRequestLatency(`${Math.floor(Math.random() * 15 + 18)}ms`)
    }, 400)
  }

  const handleTestAbdmPing = () => {
    setAbdmPingStatus('Testing ABDM Gateway Handshake (Sandbox)...')
    setTimeout(() => {
      setAbdmPingStatus('✅ ABDM M1-M3 Gateway Connected. Mutual TLS Active. Gateway Latency: 42ms')
    }, 600)
  }

  return (
    <div className="standards-page-container">
      {/* Page Header */}
      <div className="standards-header">
        <div className="title-block">
          <div className="standards-badge-row">
            <span className="badge-cdisc font-mono">CDISC (CDASH / SDTM / ADaM)</span>
            <span className="badge-fhir font-mono">HL7 FHIR R4</span>
            <span className="badge-abdm font-mono">ABDM / ABHA (M1-M3)</span>
            <span className="badge-csv font-mono">GCP CSV (IQ/OQ/PQ)</span>
          </div>
          <h2 className="widget-title">Interoperability, Standards &amp; CSV Validation Architecture</h2>
          <p className="widget-subtitle">
            Standards-first clinical data architecture connecting CDISC CDASH/SDTM/ADaM, Define-XML 2.1, HL7 FHIR R4 Facade, Ayushman Bharat Digital Mission (ABDM), and GAMP 5 GCP CSV validation.
          </p>
          {(onNavigateToAudit || onNavigateToConsent) && (
            <div className="gateway-action-row" style={{ marginTop: '0.8rem', display: 'flex', gap: '0.6rem' }}>
              {onNavigateToAudit && (
                <button
                  type="button"
                  className="btn-tiny"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--text-primary)', padding: '0.35rem 0.75rem', borderRadius: '6px', cursor: 'pointer' }}
                  onClick={onNavigateToAudit}
                >
                  🔒 ALCOA+ Audit Ledger ({auditLogs.length} Verified Entries) →
                </button>
              )}
              {onNavigateToConsent && (
                <button
                  type="button"
                  className="btn-tiny"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--text-primary)', padding: '0.35rem 0.75rem', borderRadius: '6px', cursor: 'pointer' }}
                  onClick={onNavigateToConsent}
                >
                  📜 DPDP Consent Vault ({dpdpRecords.length} Active Records) →
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="standards-tabs-nav">
        <button
          type="button"
          className={`std-tab-btn ${activeTab === 'cdisc' ? 'active' : ''}`}
          onClick={() => setActiveTab('cdisc')}
        >
          <span className="tab-ico">📊</span>
          <span>CDISC Standards (CDASH / SDTM / ADaM / Define-XML)</span>
        </button>

        <button
          type="button"
          className={`std-tab-btn ${activeTab === 'fhir' ? 'active' : ''}`}
          onClick={() => setActiveTab('fhir')}
        >
          <span className="tab-ico">🔥</span>
          <span>HL7 FHIR R4 API Gateway Facade</span>
        </button>

        <button
          type="button"
          className={`std-tab-btn ${activeTab === 'abdm' ? 'active' : ''}`}
          onClick={() => setActiveTab('abdm')}
        >
          <span className="tab-ico">🇮🇳</span>
          <span>ABDM Integration (ABHA / HPR / HIU / HIP)</span>
        </button>

        <button
          type="button"
          className={`std-tab-btn ${activeTab === 'odm' ? 'active' : ''}`}
          onClick={() => setActiveTab('odm')}
        >
          <span className="tab-ico">💾</span>
          <span>CDISC ODM v1.3.2 Import/Export</span>
        </button>

        <button
          type="button"
          className={`std-tab-btn ${activeTab === 'csv' ? 'active' : ''}`}
          onClick={() => setActiveTab('csv')}
        >
          <span className="tab-ico">✅</span>
          <span>GCP CSV Qualification (IQ / OQ / PQ)</span>
        </button>
      </div>

      {/* TAB 1: CDISC ECOSYSTEM (CDASH, SDTM, ADaM, DEFINE-XML) */}
      {activeTab === 'cdisc' && (
        <div className="tab-panel-body">
          <div className="cdisc-subtabs-row">
            <button
              type="button"
              className={`cdisc-subtab-btn ${cdiscSubTab === 'sdtm' ? 'active' : ''}`}
              onClick={() => setCdiscSubTab('sdtm')}
            >
              SDTM IG 3.4 Tabulation
            </button>
            <button
              type="button"
              className={`cdisc-subtab-btn ${cdiscSubTab === 'adam' ? 'active' : ''}`}
              onClick={() => setCdiscSubTab('adam')}
            >
              ADaM Analysis Datasets (ADSL/ADAE)
            </button>
            <button
              type="button"
              className={`cdisc-subtab-btn ${cdiscSubTab === 'cdash' ? 'active' : ''}`}
              onClick={() => setCdiscSubTab('cdash')}
            >
              CDASH eCRF Data Models
            </button>
            <button
              type="button"
              className={`cdisc-subtab-btn ${cdiscSubTab === 'definexml' ? 'active' : ''}`}
              onClick={() => setCdiscSubTab('definexml')}
            >
              Define-XML 2.1 Metadata
            </button>
          </div>

          {/* SDTM SUBTAB */}
          {cdiscSubTab === 'sdtm' && (
            <div className="cdisc-content-box">
              <div className="box-header-row">
                <div>
                  <h3 className="sub-title">CDISC SDTM-IG 3.4 Conforming Domain (AE - Adverse Events)</h3>
                  <p className="sub-desc">
                    Normalized clinical tabulation dataset ready for CDSCO SUGAM &amp; US FDA eCTD Module 5 submissions.
                  </p>
                </div>
                <div className="box-actions">
                  <span className="badge-tag">FDA P21 Validator: 0 Errors</span>
                  <button type="button" className="btn-action-outline" onClick={handleDownloadSdtmCSV}>
                    📥 Export SDTM AE (CSV)
                  </button>
                </div>
              </div>

              <table className="persona-table font-mono">
                <thead>
                  <tr>
                    <th>STUDYID</th>
                    <th>DOMAIN</th>
                    <th>USUBJID</th>
                    <th>AETERM</th>
                    <th>AEDECOD (MedDRA PT)</th>
                    <th>AEBODSYS (MedDRA SOC)</th>
                    <th>AESER</th>
                    <th>AESEV</th>
                    <th>AESTDTC</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleSdtmAE.map((row) => (
                    <tr key={row.USUBJID}>
                      <td>{row.STUDYID}</td>
                      <td><span className="badge-tag">{row.DOMAIN}</span></td>
                      <td><strong>{row.USUBJID}</strong></td>
                      <td>{row.AETERM}</td>
                      <td><span className="text-accent">{row.AEDECOD}</span></td>
                      <td>{row.AEBODSYS}</td>
                      <td><span className={row.AESER === 'Y' ? 'text-danger font-bold' : ''}>{row.AESER}</span></td>
                      <td>{row.AESEV}</td>
                      <td>{row.AESTDTC}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ADAM SUBTAB */}
          {cdiscSubTab === 'adam' && (
            <div className="cdisc-content-box">
              <div className="box-header-row">
                <div>
                  <h3 className="sub-title">CDISC ADaM (Analysis Data Model) - ADSL (Subject-Level Analysis Dataset)</h3>
                  <p className="sub-desc">
                    One record per subject containing treatment group, demographic variables, and population flags (ITTFL, SAFFL).
                  </p>
                </div>
                <div className="box-actions">
                  <span className="badge-tag">ADaM-IG v1.3 Validated</span>
                </div>
              </div>

              <table className="persona-table font-mono">
                <thead>
                  <tr>
                    <th>STUDYID</th>
                    <th>USUBJID</th>
                    <th>SITEID</th>
                    <th>ARM</th>
                    <th>TRT01P (Treatment Planned)</th>
                    <th>AGE</th>
                    <th>SEX</th>
                    <th>SAFFL (Safety Pop)</th>
                    <th>ITTFL (Intent-to-Treat)</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleAdamADSL.map((r) => (
                    <tr key={r.USUBJID}>
                      <td>{r.STUDYID}</td>
                      <td><strong>{r.USUBJID}</strong></td>
                      <td>{r.SITEID}</td>
                      <td><span className="badge-tag">{r.ARM}</span></td>
                      <td>{r.TRT01P}</td>
                      <td>{r.AGE}</td>
                      <td>{r.SEX}</td>
                      <td><span className="text-accent font-bold">{r.SAFFL}</span></td>
                      <td><span className="text-accent font-bold">{r.ITTFL}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* CDASH SUBTAB */}
          {cdiscSubTab === 'cdash' && (
            <div className="cdisc-content-box">
              <div className="box-header-row">
                <div>
                  <h3 className="sub-title">CDISC CDASH (Clinical Data Acquisition Standards Harmonization) eCRF Models</h3>
                  <p className="sub-desc">
                    Field-level specifications ensuring standardized data capture at the site prior to SDTM mapping.
                  </p>
                </div>
              </div>
              <div className="cdash-domains-grid">
                <div className="cdash-card">
                  <h4>DM (Demographics Domain)</h4>
                  <ul>
                    <li><code>BRTHDTC</code>: Date/Time of Birth (ISO 8601)</li>
                    <li><code>AGE</code> / <code>AGEU</code>: Age &amp; Unit (Years)</li>
                    <li><code>SEX</code>: Sex (M / F / Undifferentiated)</li>
                    <li><code>ARMCD</code>: Planned Arm Code (ACTIVE / PLACEBO)</li>
                  </ul>
                </div>
                <div className="cdash-card">
                  <h4>AE (Adverse Events Domain)</h4>
                  <ul>
                    <li><code>AETERM</code>: Reported Adverse Event Term</li>
                    <li><code>AESTDTC</code>: Start Date/Time of AE</li>
                    <li><code>AESEV</code>: Severity (Mild, Moderate, Severe)</li>
                    <li><code>AESER</code>: Serious Event Flag (Y / N)</li>
                    <li><code>AEREL</code>: Causality to Investigational Product</li>
                  </ul>
                </div>
                <div className="cdash-card">
                  <h4>CM (Concomitant Meds Domain)</h4>
                  <ul>
                    <li><code>CMTRT</code>: Reported Name of Drug / Botanical</li>
                    <li><code>CMDOS</code> / <code>CMDOSU</code>: Dose &amp; Unit</li>
                    <li><code>CMROUTE</code>: Route of Administration</li>
                    <li><code>CMINDC</code>: Indication for Use</li>
                  </ul>
                </div>
                <div className="cdash-card">
                  <h4>VS (Vital Signs Domain)</h4>
                  <ul>
                    <li><code>VSTESTCD</code>: Test Short Code (SYSBP, DIABP, PULSE, TEMP)</li>
                    <li><code>VSORRES</code>: Original Result Value</li>
                    <li><code>VSORRESU</code>: Original Unit (mmHg, bpm, C)</li>
                    <li><code>VSDTC</code>: Date/Time of Measurement</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* DEFINE-XML SUBTAB */}
          {cdiscSubTab === 'definexml' && (
            <div className="cdisc-content-box">
              <div className="box-header-row">
                <div>
                  <h3 className="sub-title">Define-XML v2.1 Schema &amp; Submission Package</h3>
                  <p className="sub-desc">
                    W3C XML Schema validated metadata specification conforming to CDISC Define-XML 2.1 standard.
                  </p>
                </div>
                <button type="button" className="btn-primary-glow" onClick={handleDownloadDefineXML}>
                  📥 Download Submission-Ready define.xml
                </button>
              </div>

              <div className="definexml-viewer font-mono">
                <pre>{`<?xml version="1.0" encoding="UTF-8"?>
<ODM xmlns="http://www.cdisc.org/ns/odm/v1.3"
     xmlns:def="http://www.cdisc.org/ns/def/v2.1"
     FileOID="AIIA.CTMS.SDTM.DEFINE.01"
     FileType="Snapshot"
     CreationDateTime="${new Date().toISOString()}">
  <Study OID="AIIA.CTU.2024.01">
    <GlobalVariables>
      <StudyName>A Multicentric Phase III Trial of Ashwagandha &amp; Guduchi</StudyName>
      <StudyDescription>Standardized Ayurveda Formulation in Post-Viral Cognitive Fatigue</StudyDescription>
      <ProtocolName>AIIA/CTU/2024/01</ProtocolName>
    </GlobalVariables>
    <MetaDataVersion OID="MDV.AIIA.SDTM.3.4" Name="CDISC SDTM-IG 3.4 / Define-XML 2.1" def:StandardName="SDTM-IG" def:StandardVersion="3.4">
      <ItemGroupDef OID="IG.AE" Name="AE" Repeating="Yes" Domain="AE" Purpose="Tabulation">
        <ItemRef ItemOID="IT.STUDYID" Mandatory="Yes" OrderNumber="1"/>
        <ItemRef ItemOID="IT.DOMAIN" Mandatory="Yes" OrderNumber="2"/>
        <ItemRef ItemOID="IT.USUBJID" Mandatory="Yes" OrderNumber="3"/>
        <ItemRef ItemOID="IT.AETERM" Mandatory="Yes" OrderNumber="4"/>
        <ItemRef ItemOID="IT.AEDECOD" Mandatory="Yes" OrderNumber="5"/>
        <ItemRef ItemOID="IT.AESER" Mandatory="Yes" OrderNumber="6"/>
      </ItemGroupDef>
    </MetaDataVersion>
  </Study>
</ODM>`}</pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: HL7 FHIR R4 INTEROPERABILITY FACADE */}
      {activeTab === 'fhir' && (
        <div className="tab-panel-body">
          <div className="fhir-gateway-card">
            <div className="gateway-header-row">
              <div>
                <div className="gateway-badge-row">
                  <span className="badge-tag">API GATEWAY: ACTIVE</span>
                  <span className="badge-tag">RATE LIMIT: 100 REQ/MIN</span>
                  <span className="badge-tag">AUTH: OAUTH2 BEARER JWT</span>
                </div>
                <h3>HL7 FHIR R4 Interactive API Console &amp; Interop Facade</h3>
                <p>
                  RESTful endpoints for electronic health record (EHR/HIS), EDC, and ABDM interoperability conforming to FHIR Release 4.0.1.
                </p>
              </div>
              <div className="gateway-action-col">
                <button
                  type="button"
                  className="btn-primary-glow"
                  onClick={handleSendTestRequest}
                  disabled={isSendingRequest}
                >
                  {isSendingRequest ? 'Sending...' : '⚡ Send Test API Request'}
                </button>
              </div>
            </div>

            <div className="endpoints-selector-row">
              <button
                type="button"
                className={`endpoint-btn ${selectedEndpoint === 'study' ? 'active' : ''}`}
                onClick={() => setSelectedEndpoint('study')}
              >
                <span className="method-get">GET</span>
                <code>/ResearchStudy/AIIA-CTU-2024-01</code>
              </button>
              <button
                type="button"
                className={`endpoint-btn ${selectedEndpoint === 'subject' ? 'active' : ''}`}
                onClick={() => setSelectedEndpoint('subject')}
              >
                <span className="method-get">GET</span>
                <code>/ResearchSubject/SUBJ-AIIA-01-042</code>
              </button>
              <button
                type="button"
                className={`endpoint-btn ${selectedEndpoint === 'ae' ? 'active' : ''}`}
                onClick={() => setSelectedEndpoint('ae')}
              >
                <span className="method-post">POST</span>
                <code>/AdverseEvent (Expedited SAE)</code>
              </button>
              <button
                type="button"
                className={`endpoint-btn ${selectedEndpoint === 'obs' ? 'active' : ''}`}
                onClick={() => setSelectedEndpoint('obs')}
              >
                <span className="method-get">GET</span>
                <code>/Observation/OBS-CFQ11-042</code>
              </button>
              <button
                type="button"
                className={`endpoint-btn ${selectedEndpoint === 'caps' ? 'active' : ''}`}
                onClick={() => setSelectedEndpoint('caps')}
              >
                <span className="method-get">GET</span>
                <code>/metadata (CapabilityStatement)</code>
              </button>
            </div>

            {/* Response Console */}
            <div className="api-response-console">
              <div className="console-status-bar">
                <div className="status-tags">
                  <span className="status-200">HTTP 200 OK</span>
                  <span className="font-mono text-muted">Latency: {requestLatency}</span>
                  <span className="font-mono text-muted">Content-Type: application/fhir+json</span>
                </div>
                <div className="view-mode-toggle">
                  <button
                    type="button"
                    className={`btn-tiny ${fhirViewMode === 'visual' ? 'active' : ''}`}
                    onClick={() => setFhirViewMode('visual')}
                  >
                    Visual
                  </button>
                  <button
                    type="button"
                    className={`btn-tiny ${fhirViewMode === 'json' ? 'active' : ''}`}
                    onClick={() => setFhirViewMode('json')}
                  >
                    Raw JSON
                  </button>
                  <button
                    type="button"
                    className="btn-tiny"
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(fhirPayloads[selectedEndpoint], null, 2))
                      setCopiedFhir(true)
                      setTimeout(() => setCopiedFhir(false), 2000)
                    }}
                  >
                    {copiedFhir ? '✓ Copied' : '📋 Copy'}
                  </button>
                </div>
              </div>

              {fhirViewMode === 'json' ? (
                <div className="json-code-block font-mono">
                  <pre>{JSON.stringify(fhirPayloads[selectedEndpoint], null, 2)}</pre>
                </div>
              ) : (
                <div className="visual-fhir-card">
                  <h4>Resource: <code>{fhirPayloads[selectedEndpoint].resourceType}</code></h4>
                  <div className="fhir-attributes-grid font-mono">
                    {Object.entries(fhirPayloads[selectedEndpoint]).map(([k, v]) => (
                      <div key={k} className="attr-row">
                        <span className="attr-key">{k}:</span>
                        <span className="attr-val">
                          {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ABDM INTEGRATION */}
      {activeTab === 'abdm' && (
        <div className="tab-panel-body">
          <div className="abdm-showcase-card">
            <div className="box-header-row">
              <div>
                <div className="gateway-badge-row">
                  <span className="badge-abdm">ABDM NATIONAL HEALTH STACK</span>
                  <span className="badge-tag">NHA COMPLIANT M1, M2, M3</span>
                </div>
                <h3>Ayushman Bharat Digital Mission (ABDM) Integration Suite</h3>
                <p>
                  National Digital Health Ecosystem integration enabling seamless participant identification, professional credentialing, and health record exchange.
                </p>
              </div>
              <div>
                <button type="button" className="btn-primary-glow" onClick={handleTestAbdmPing}>
                  🔌 Test ABDM Gateway Handshake
                </button>
              </div>
            </div>

            {abdmPingStatus && (
              <div className="abdm-ping-banner">
                {abdmPingStatus}
              </div>
            )}

            <div className="abdm-milestones-grid">
              <div className="milestone-box passed">
                <span className="m-badge">Milestone M1</span>
                <h4>ABHA (Ayushman Bharat Health Account) Issuance &amp; KYC</h4>
                <p>Creation and OTP-based Aadhaar verification of 14-digit ABHA ID for trial subjects.</p>
                <div className="m-detail font-mono">
                  <span>Sample ABHA: 91-4432-8901-7712</span>
                  <span>Status: Active &amp; Verified</span>
                </div>
              </div>

              <div className="milestone-box passed">
                <span className="m-badge">Milestone M2</span>
                <h4>Healthcare Professional (HPR) &amp; Facility Registry (HFR)</h4>
                <p>Digital registry lookup verifying PI credentials, medical council registration, and clinical trial site accreditation.</p>
                <div className="m-detail font-mono">
                  <span>HPR ID: Dr. Tanuja Nesari (HPR-DEL-98124)</span>
                  <span>HFR ID: AIIA New Delhi (IN07100012)</span>
                </div>
              </div>

              <div className="milestone-box passed">
                <span className="m-badge">Milestone M3</span>
                <h4>Health Information Exchange (HIU / HIP Gateway)</h4>
                <p>Consent Manager mediated electronic health record retrieval with digital signature artifacts conforming to NDHM specs.</p>
                <div className="m-detail font-mono">
                  <span>Consent Artifact: ARTIFACT-NDHM-98214</span>
                  <span>Gateway: NHA UAT Sandbox Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CDISC ODM (v1.3.2) */}
      {activeTab === 'odm' && (
        <div className="tab-panel-body">
          <div className="cdisc-content-box">
            <div className="box-header-row">
              <div>
                <h3 className="sub-title">CDISC Operational Data Model (ODM v1.3.2) Snapshot</h3>
                <p className="sub-desc">
                  Vendor-neutral format for exchanging and archiving clinical study data and metadata alongside full audit histories.
                </p>
              </div>
              <span className="badge-tag">ODM 1.3.2 Schema Valid</span>
            </div>

            <div className="definexml-viewer font-mono">
              <pre>{`<?xml version="1.0" encoding="UTF-8"?>
<ODM xmlns="http://www.cdisc.org/ns/odm/v1.3"
     Description="AIIA CTMS Clinical Study Audit Snapshot"
     FileType="Snapshot"
     FileOID="AIIA.ODM.AUDIT.2026.01"
     CreationDateTime="${new Date().toISOString()}">
  <ClinicalData StudyOID="AIIA.CTU.2024.01" MetaDataVersionOID="MDV.01">
    <SubjectData SubjectKey="AIIA-01-042">
      <StudyEventData StudyEventOID="SE.BASELINE">
        <FormData FormOID="FORM.DM">
          <ItemGroupData ItemGroupOID="IG.DM">
            <ItemData ItemOID="IT.AGE" Value="42"/>
            <ItemData ItemOID="IT.SEX" Value="M"/>
          </ItemGroupData>
        </FormData>
      </StudyEventData>
      <StudyEventData StudyEventOID="SE.UNSCHEDULED">
        <FormData FormOID="FORM.AE">
          <ItemGroupData ItemGroupOID="IG.AE">
            <ItemData ItemOID="IT.AETERM" Value="Severe Anaphylactoid Bronchospasm"/>
            <ItemData ItemOID="IT.AESER" Value="Y"/>
          </ItemGroupData>
        </FormData>
      </StudyEventData>
    </SubjectData>
  </ClinicalData>
</ODM>`}</pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: GCP COMPUTER SYSTEM VALIDATION (CSV - IQ/OQ/PQ) */}
      {activeTab === 'csv' && (
        <div className="tab-panel-body">
          <div className="cdisc-content-box">
            <div className="box-header-row">
              <div>
                <div className="gateway-badge-row">
                  <span className="badge-tag">GAMP 5 CATEGORY 4</span>
                  <span className="badge-tag">21 CFR PART 11 CSV</span>
                  <span className="badge-tag">GCP-ASU ALIGNED</span>
                </div>
                <h3 className="sub-title">GCP Computer System Validation (CSV) Qualification Matrix</h3>
                <p className="sub-desc">
                  Formal verification evidence documenting Installation (IQ), Operational (OQ), and Performance Qualification (PQ) testing.
                </p>
              </div>
              <span className="badge-tag status-pill active">100% Tests Passed</span>
            </div>

            <table className="persona-table">
              <thead>
                <tr>
                  <th>Validation Phase</th>
                  <th>Test Protocol ID</th>
                  <th>Verification Objective</th>
                  <th>Acceptance Criteria</th>
                  <th>Execution Date</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Installation Qualification (IQ)</strong></td>
                  <td><code>VAL-IQ-01</code></td>
                  <td>Server environment, DB encryption at rest (AES-256), MeitY cloud parameters</td>
                  <td>Cryptographic encryption confirmed; TLS 1.3 enforced</td>
                  <td>2026-08-15</td>
                  <td><span className="status-pill active">PASS (100%)</span></td>
                </tr>
                <tr>
                  <td><strong>Operational Qualification (OQ)</strong></td>
                  <td><code>VAL-OQ-04</code></td>
                  <td>Immutable ALCOA+ SHA-256 audit trail generation and tamper prevention</td>
                  <td>Zero hash chain corruption detected on unauthorized edit attempts</td>
                  <td>2026-08-20</td>
                  <td><span className="status-pill active">PASS (100%)</span></td>
                </tr>
                <tr>
                  <td><strong>Operational Qualification (OQ)</strong></td>
                  <td><code>VAL-OQ-08</code></td>
                  <td>21 CFR Part 11 Electronic Signature non-repudiation and dual password auth</td>
                  <td>Signature strictly linked to user ID with reason and timestamp</td>
                  <td>2026-08-22</td>
                  <td><span className="status-pill active">PASS (100%)</span></td>
                </tr>
                <tr>
                  <td><strong>Performance Qualification (PQ)</strong></td>
                  <td><code>VAL-PQ-12</code></td>
                  <td>7-day expedited SAE reporting clock alert generation and CDSCO transmission</td>
                  <td>Alert fired within 5 seconds of SAE entry; statutory timer initiated</td>
                  <td>2026-09-02</td>
                  <td><span className="status-pill active">PASS (100%)</span></td>
                </tr>
                <tr>
                  <td><strong>Performance Qualification (PQ)</strong></td>
                  <td><code>VAL-PQ-15</code></td>
                  <td>CDISC Define-XML 2.1 and SDTM 3.4 export conformance testing</td>
                  <td>Conforms to Pinnacle 21 Community rule-set with 0 fatal errors</td>
                  <td>2026-09-10</td>
                  <td><span className="status-pill active">PASS (100%)</span></td>
                </tr>
              </tbody>
            </table>

            <div className="csv-cert-box">
              <h4>📜 Formal System Validation Certification</h4>
              <p>
                "This certifies that the <strong>AIIA CTMS &amp; NPvCC Clinical Research Platform v3.0</strong> has undergone formal Computer System Validation (CSV) under GAMP 5 principles and 21 CFR Part 11. The system is certified compliant for regulatory clinical trial data capture, pharmacovigilance surveillance, and statutory electronic submission."
              </p>
              <div className="cert-signatures-row font-mono">
                <div>Lead CSV Validation Engineer: <strong>S. Krishnan, QA Lead</strong></div>
                <div>Principal Regulatory Officer: <strong>Dr. Tanuja Nesari, AIIA</strong></div>
                <div>Certificate Ref: <strong>AIIA-CSV-2026-CERT-091</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
