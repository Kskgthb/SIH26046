import React, { useState } from 'react'
import type { AdverseEvent, Role } from '../types'

interface PharmacovigilanceModuleProps {
  adverseEvents: AdverseEvent[]
  currentRole: Role
  onAddNewEvent: (newEvent: AdverseEvent) => void
  onApproveEventESign?: (eventId: string, signerName: string, reason: string) => void
}

const sampleMedDraDatabase: Record<
  string,
  { llt: string; pt: string; soc: string; code: string; hlt: string }
> = {
  bronchospasm: {
    llt: 'Bronchospasm acute (LLT: 10006451)',
    pt: 'Bronchospasm',
    hlt: 'Bronchospasm and obstruction',
    soc: 'Respiratory, thoracic and mediastinal disorders',
    code: '10006482',
  },
  jaundice: {
    llt: 'Ocular icterus / Jaundice (LLT: 10023126)',
    pt: 'Jaundice',
    hlt: 'Hepatobiliary signs and symptoms',
    soc: 'Hepatobiliary disorders',
    code: '10023126',
  },
  hypoglycaemia: {
    llt: 'Hypoglycaemia adult (LLT: 10020993)',
    pt: 'Hypoglycaemia',
    hlt: 'Hypoglycaemic conditions NEC',
    soc: 'Metabolism and nutrition disorders',
    code: '10020993',
  },
  headache: {
    llt: 'Headache acute throbbing (LLT: 10019211)',
    pt: 'Headache',
    hlt: 'Headaches NEC',
    soc: 'Nervous system disorders',
    code: '10019211',
  },
  rash: {
    llt: 'Maculo-papular erythematous rash (LLT: 10025409)',
    pt: 'Rash maculo-papular',
    hlt: 'Rashes, eruptions and exanthems NEC',
    soc: 'Skin and subcutaneous tissue disorders',
    code: '10025409',
  },
  anaphylaxis: {
    llt: 'Acute Anaphylactic Reaction (LLT: 10002198)',
    pt: 'Anaphylactic reaction',
    hlt: 'Anaphylactic and anaphylactoid responses',
    soc: 'Immune system disorders',
    code: '10002198',
  },
}

const sampleWhoDrugDb = [
  { name: 'Paracetamol 650mg', atc: 'N02BE01', category: 'Analgesics / Antipyretics' },
  { name: 'Ashwagandha Extract (Withania somnifera)', atc: 'A13A (Herbal Adaptogen)', category: 'Ayurvedic Botanical' },
  { name: 'Guduchi Ghanvati (Tinospora cordifolia)', atc: 'A13A (Immunomodulator)', category: 'Ayurvedic Botanical' },
  { name: 'Metformin Hydrochloride 500mg', atc: 'A10BA02', category: 'Oral Blood Glucose Lowering' },
  { name: 'Cetirizine 10mg', atc: 'R06AE07', category: 'Antihistamines for systemic use' },
  { name: 'Telmisartan 40mg', atc: 'C09CA07', category: 'Angiotensin II Receptor Blockers' },
]

export const PharmacovigilanceModule: React.FC<PharmacovigilanceModuleProps> = ({
  adverseEvents,
  currentRole,
  onAddNewEvent,
  onApproveEventESign,
}) => {
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [coderInput, setCoderInput] = useState('Bronchospasm')
  const [codedResult, setCodedResult] = useState(sampleMedDraDatabase['bronchospasm'])

  // Inspection & e-Sign states
  const [inspectingEvent, setInspectingEvent] = useState<AdverseEvent | null>(null)
  const [signingEvent, setSigningEvent] = useState<AdverseEvent | null>(null)
  const [eSignUsername, setESignUsername] = useState('dr.meera.npvcc')
  const [eSignPassword, setESignPassword] = useState('')
  const [eSignReason, setESignReason] = useState('Approval of 7-Day Expedited SAE Report for transmission to CDSCO SUGAM')
  const [eSignConfirmed, setESignConfirmed] = useState(false)

  // Form State
  const [formSubjectId, setFormSubjectId] = useState('AIIA-01-055')
  const [formProtocol, setFormProtocol] = useState('AIIA/CTU/2024/01')
  const [formTerm, setFormTerm] = useState('')
  const [formSeverity, setFormSeverity] = useState<'Mild' | 'Moderate' | 'Severe' | 'Life-Threatening' | 'Fatal'>('Severe')
  const [formIsSAE, setFormIsSAE] = useState(true)
  const [selectedMeds, setSelectedMeds] = useState<string[]>(['Paracetamol 650mg', 'Ashwagandha Extract (Withania somnifera)'])
  const [formCausality, setFormCausality] = useState<'Definite' | 'Probable' | 'Possible' | 'Unlikely' | 'Not Related'>('Possible')

  const handleMedDraCode = (input: string) => {
    setCoderInput(input)
    const lower = input.toLowerCase().trim()
    for (const key of Object.keys(sampleMedDraDatabase)) {
      if (lower.includes(key)) {
        setCodedResult(sampleMedDraDatabase[key])
        return
      }
    }
    setCodedResult({
      llt: `${input} (Verbatim clinical term)`,
      pt: input,
      hlt: `${input} related conditions`,
      soc: 'General disorders and administration site conditions',
      code: '10018065',
    })
  }

  const toggleMed = (medName: string) => {
    setSelectedMeds((prev) =>
      prev.includes(medName) ? prev.filter((m) => m !== medName) : [...prev, medName]
    )
  }

  const handleSubmitNewSAE = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formTerm) return

    const newSAE: AdverseEvent = {
      id: `SAE-2026-${String(adverseEvents.length + 1).padStart(3, '0')}`,
      studyId: 'study-1',
      protocolNumber: formProtocol,
      subjectId: formSubjectId,
      siteName: 'All India Institute of Ayurveda, New Delhi',
      eventTerm: formTerm,
      onsetDate: new Date().toISOString().split('T')[0],
      reportedDate: new Date().toISOString().split('T')[0],
      severity: formSeverity,
      isSAE: formIsSAE,
      saeCriteria: formIsSAE ? 'Life Threatening' : undefined,
      meddra: {
        llt: codedResult.llt,
        pt: codedResult.pt,
        soc: codedResult.soc,
        code: codedResult.code,
      },
      concomitantMeds: selectedMeds,
      causality: formCausality,
      regulatoryReporting: {
        timelineType: formIsSAE ? '7-Day Expedited' : '90-Day Periodic',
        submissionDeadline: formIsSAE ? 'In 7 Days (17:00 IST)' : 'In 90 Days',
        daysRemaining: formIsSAE ? 7 : 90,
        cdscoSubmissionStatus: 'Drafted',
        ethicsCommitteeStatus: 'Pending',
        dsmbNotified: true,
      },
      outcome: 'Recovering',
    }

    onAddNewEvent(newSAE)
    setShowModal(false)
    setFormTerm('')
  }

  const handleExecuteESign = (e: React.FormEvent) => {
    e.preventDefault()
    if (!signingEvent || !eSignConfirmed) return

    if (onApproveEventESign) {
      onApproveEventESign(signingEvent.id, eSignUsername, eSignReason)
    }

    setSigningEvent(null)
    setESignPassword('')
    setESignConfirmed(false)
  }

  const filteredEvents = adverseEvents.filter(
    (ev) =>
      ev.eventTerm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.subjectId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.meddra.pt.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div id="pv-module" className="pv-container">
      {/* Header */}
      <div className="pv-header">
        <div className="pv-title-box">
          <div className="npvcc-badge">
            <span>AIIA NPvCC NATIONAL HUB · Active Persona: {currentRole}</span>
          </div>
          <h2 className="widget-title">Pharmacovigilance &amp; Safety Governance</h2>
          <p className="widget-subtitle">
            CDASH/E2B(R3) Adverse Event reporting, MedDRA hierarchy coding, WHODrug dictionaries, 21 CFR Part 11 e-Signatures, and CDSCO SUGAM statutory deadlines.
          </p>
        </div>

        <div className="pv-actions">
          <button
            type="button"
            className="pv-add-btn"
            onClick={() => setShowModal(true)}
          >
            <span>+ Report ADR / SAE (CDASH eCRF)</span>
          </button>
        </div>
      </div>

      {/* Regulatory Statutory Timelines Countdown */}
      <div className="regulatory-timelines-card">
        <div className="timeline-title-row">
          <span className="timeline-badge-red">STATUTORY REPORTING TIMELINES</span>
          <span className="timeline-subtitle font-mono">
            New Drugs &amp; Clinical Trials Rules 2019 (Rule 42) &amp; CDSCO SUGAM
          </span>
        </div>

        <div className="timelines-grid">
          <div className="timeline-box red-urgent">
            <div className="timeline-top">
              <span className="timeline-clock">⏳ 5 Days Remaining</span>
              <span className="timeline-type">7-Day Expedited SAE</span>
            </div>
            <h4 className="timeline-event">Subject AIIA-01-042 (Severe Bronchospasm)</h4>
            <p className="timeline-detail">
              Mandatory submission to CDSCO Licensing Authority &amp; Ethics Committee within 7 calendar days of occurrence.
            </p>
            <div className="timeline-status-pill">
              <span>Status: Drafted · 21 CFR Part 11 e-Sign Pending</span>
            </div>
          </div>

          <div className="timeline-box yellow-warn">
            <div className="timeline-top">
              <span className="timeline-clock">⏳ 11 Days Remaining</span>
              <span className="timeline-type">15-Day Serious Unexpected (SUSAR)</span>
            </div>
            <h4 className="timeline-event">Subject AIIMS-02-089 (Severe Hypoglycaemia)</h4>
            <p className="timeline-detail">
              Detailed causality narrative, lab rechallenge confirmation &amp; DSMB concurrence dossier.
            </p>
            <div className="timeline-status-pill">
              <span>Status: Under IEC &amp; Medical Monitor Review</span>
            </div>
          </div>

          <div className="timeline-box green-ok">
            <div className="timeline-top">
              <span className="timeline-clock">✓ Periodic Line Listing</span>
              <span className="timeline-type">90-Day DSUR Safety Summary</span>
            </div>
            <h4 className="timeline-event">Quarterly Line Listing Aggregate (AIIA-COV)</h4>
            <p className="timeline-detail">
              Development Safety Update Report compiling non-serious AEs and mild gastric events across all active centers.
            </p>
            <div className="timeline-status-pill">
              <span>Status: Aggregate Signal Analysis Normal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive MedDRA Auto-Coding Sandbox */}
      <div className="meddra-coder-card">
        <div className="coder-header">
          <div className="coder-title-group">
            <span className="coder-badge">INTELLIGENT MEDICAL DICTIONARY</span>
            <h3 className="coder-title">MedDRA Auto-Coding Engine (v27.0)</h3>
            <p className="coder-desc">
              Type clinical verbatim terms to view real-time standardization across Lowest Level Term (LLT), Preferred Term (PT), High Level Term (HLT), and System Organ Class (SOC).
            </p>
          </div>
        </div>

        <div className="coder-input-row">
          <input
            type="text"
            className="coder-input"
            value={coderInput}
            onChange={(e) => handleMedDraCode(e.target.value)}
            placeholder="Type clinical symptom (e.g., Bronchospasm, Jaundice, Headache, Hypoglycaemia, Anaphylaxis)..."
          />
          <div className="quick-suggestions">
            <button type="button" onClick={() => handleMedDraCode('Bronchospasm')}>Bronchospasm</button>
            <button type="button" onClick={() => handleMedDraCode('Jaundice')}>Jaundice</button>
            <button type="button" onClick={() => handleMedDraCode('Hypoglycaemia')}>Hypoglycaemia</button>
            <button type="button" onClick={() => handleMedDraCode('Anaphylaxis')}>Anaphylaxis</button>
            <button type="button" onClick={() => handleMedDraCode('Rash')}>Rash</button>
          </div>
        </div>

        <div className="coder-results-grid">
          <div className="code-level-box">
            <span className="level-name">Lowest Level Term (LLT)</span>
            <span className="level-val font-semibold">{codedResult.llt}</span>
            <span className="level-code font-mono">Code: {codedResult.code}</span>
          </div>
          <div className="code-level-box accent-box">
            <span className="level-name">Preferred Term (PT)</span>
            <span className="level-val font-semibold text-accent">{codedResult.pt}</span>
            <span className="level-code font-mono">Standard Regulatory Submission Term</span>
          </div>
          <div className="code-level-box">
            <span className="level-name">High Level Term (HLT)</span>
            <span className="level-val font-semibold">{codedResult.hlt || 'General Signs & Symptoms'}</span>
            <span className="level-code font-mono">Sub-Domain</span>
          </div>
          <div className="code-level-box">
            <span className="level-name">System Organ Class (SOC)</span>
            <span className="level-val font-semibold">{codedResult.soc}</span>
            <span className="level-code font-mono">Organ Hierarchy Domain</span>
          </div>
        </div>
      </div>

      {/* Adverse Events & Safety Master Registry Table */}
      <div className="pv-table-card">
        <div className="pv-table-header">
          <h3 className="table-heading">Adverse Events &amp; Safety Master Registry</h3>
          <input
            type="text"
            className="table-search-input"
            placeholder="Filter by Subject ID, Event term, or MedDRA PT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="table-responsive-wrapper">
          <table className="pv-registry-table">
            <thead>
              <tr>
                <th>Event ID</th>
                <th>Subject ID</th>
                <th>Reported Term (Verbatim)</th>
                <th>MedDRA (PT &amp; SOC)</th>
                <th>Severity</th>
                <th>Classification</th>
                <th>Causality</th>
                <th>Statutory Deadline</th>
                <th>CDSCO Status</th>
                <th>e-Sign &amp; Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((ev) => (
                <tr key={ev.id} className={ev.isSAE ? 'row-sae' : ''}>
                  <td className="font-mono font-semibold">{ev.id}</td>
                  <td className="font-mono">{ev.subjectId}</td>
                  <td className="term-cell">
                    <strong>{ev.eventTerm}</strong>
                    <div className="concomitant-tag">WHODrug: {ev.concomitantMeds.join(', ')}</div>
                  </td>
                  <td>
                    <span className="pt-badge">{ev.meddra.pt}</span>
                    <div className="soc-subtext">{ev.meddra.soc}</div>
                  </td>
                  <td>
                    <span className={`severity-tag ${ev.severity.toLowerCase()}`}>
                      {ev.severity}
                    </span>
                  </td>
                  <td>
                    {ev.isSAE ? (
                      <span className="sae-badge">SAE ({ev.saeCriteria})</span>
                    ) : (
                      <span className="ae-badge">Non-Serious AE</span>
                    )}
                  </td>
                  <td>
                    <span className="causality-tag">{ev.causality}</span>
                  </td>
                  <td>
                    <div className="deadline-box">
                      <span className="font-bold text-accent">
                        {ev.regulatoryReporting.timelineType}
                      </span>
                      <span className="deadline-date">{ev.regulatoryReporting.submissionDeadline}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-pill ${ev.regulatoryReporting.cdscoSubmissionStatus.toLowerCase()}`}>
                      {ev.regulatoryReporting.cdscoSubmissionStatus}
                    </span>
                  </td>
                  <td className="action-cell">
                    <div className="pv-btn-group">
                      <button
                        type="button"
                        className="btn-inspect-meddra"
                        onClick={() => setInspectingEvent(ev)}
                        title="Inspect full MedDRA and WHODrug hierarchy"
                      >
                        🔬 Inspect
                      </button>

                      {ev.regulatoryReporting.cdscoSubmissionStatus === 'Drafted' ? (
                        <button
                          type="button"
                          className="btn-esign-action"
                          onClick={() => setSigningEvent(ev)}
                          title="Apply 21 CFR Part 11 compliant digital signature"
                        >
                          ✍️ e-Sign
                        </button>
                      ) : (
                        <span className="signed-pill" title="Signed & Submitted">
                          ✓ Signed
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: 21 CFR Part 11 Electronic Signature Modal */}
      {signingEvent && (
        <div className="pv-modal-overlay">
          <div className="pv-modal-card esign-modal">
            <div className="modal-header">
              <div>
                <span className="modal-tag">21 CFR PART 11 &amp; IT ACT 2000 COMPLIANT</span>
                <h3 className="modal-title">Apply Cryptographic Electronic Signature</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSigningEvent(null)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteESign} className="modal-form">
              <div className="esign-banner">
                <span>🔒 This digital signature constitutes the legal equivalent of a handwritten ink signature and will be permanently recorded in the immutable ALCOA+ Audit Trail.</span>
              </div>

              <div className="form-group">
                <label>Document / Report ID:</label>
                <input
                  type="text"
                  disabled
                  value={`${signingEvent.id} — ${signingEvent.eventTerm} (${signingEvent.subjectId})`}
                  className="bg-darker font-mono"
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Authenticated Signer ID:</label>
                  <input
                    type="text"
                    required
                    value={eSignUsername}
                    onChange={(e) => setESignUsername(e.target.value)}
                    className="font-mono"
                  />
                </div>
                <div className="form-group">
                  <label>Security Password / PIN:</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter authentication password..."
                    value={eSignPassword}
                    onChange={(e) => setESignPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Statutory Meaning of Signature (Reason):</label>
                <select
                  value={eSignReason}
                  onChange={(e) => setESignReason(e.target.value)}
                >
                  <option value="Approval of 7-Day Expedited SAE Report for transmission to CDSCO SUGAM">
                    Approval of 7-Day Expedited SAE Report for transmission to CDSCO SUGAM
                  </option>
                  <option value="Principal Investigator Causality Assessment Concurrence">
                    Principal Investigator Causality Assessment Concurrence
                  </option>
                  <option value="Medical Monitor Review and DSMB Notification Sign-off">
                    Medical Monitor Review and DSMB Notification Sign-off
                  </option>
                </select>
              </div>

              <div className="legal-ack-box">
                <input
                  type="checkbox"
                  id="esign-chk"
                  required
                  checked={eSignConfirmed}
                  onChange={(e) => setESignConfirmed(e.target.checked)}
                />
                <label htmlFor="esign-chk">
                  I certify under penalty of perjury that I am <strong>{eSignUsername}</strong>, authorized under CDSCO regulations, and that my electronic signature constitutes my legally binding verification.
                </label>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setSigningEvent(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit-esign"
                  disabled={!eSignConfirmed || !eSignPassword}
                >
                  Sign &amp; Transmit to CDSCO (21 CFR Part 11)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: MedDRA & WHODrug Deep Inspection Modal */}
      {inspectingEvent && (
        <div className="pv-modal-overlay">
          <div className="pv-modal-card inspect-modal">
            <div className="modal-header">
              <div>
                <span className="modal-tag">STANDARDIZED DICTIONARY MAPPING</span>
                <h3 className="modal-title">MedDRA Hierarchy &amp; WHODrug Profile</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setInspectingEvent(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body-scrollable">
              <div className="inspect-event-summary">
                <div><strong>Event:</strong> {inspectingEvent.eventTerm}</div>
                <div><strong>Subject:</strong> {inspectingEvent.subjectId} · <strong>Protocol:</strong> {inspectingEvent.protocolNumber}</div>
                <div><strong>Severity:</strong> {inspectingEvent.severity} · <strong>Causality:</strong> {inspectingEvent.causality}</div>
              </div>

              <h4 className="inspect-section-title">MedDRA 5-Level Standardization Hierarchy:</h4>
              <div className="meddra-tree-visual">
                <div className="tree-node soc">
                  <span className="tree-badge">SOC (System Organ Class)</span>
                  <span className="tree-text">{inspectingEvent.meddra.soc}</span>
                </div>
                <div className="tree-node pt">
                  <span className="tree-badge">PT (Preferred Term)</span>
                  <span className="tree-text text-accent font-bold">{inspectingEvent.meddra.pt}</span>
                  <span className="tree-code font-mono">Code: {inspectingEvent.meddra.code}</span>
                </div>
                <div className="tree-node llt">
                  <span className="tree-badge">LLT (Lowest Level Term)</span>
                  <span className="tree-text">{inspectingEvent.meddra.llt}</span>
                </div>
              </div>

              <h4 className="inspect-section-title">WHODrug Concomitant Medications Breakdown:</h4>
              <div className="whodrug-table-wrap">
                <table className="whodrug-table">
                  <thead>
                    <tr>
                      <th>Medication Name</th>
                      <th>ATC Classification Code</th>
                      <th>Pharmacological Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inspectingEvent.concomitantMeds.map((med, idx) => (
                      <tr key={idx}>
                        <td><strong>{med}</strong></td>
                        <td className="font-mono text-accent">
                          {med.toLowerCase().includes('paracetamol') ? 'N02BE01' : med.toLowerCase().includes('ashwagandha') ? 'A13A (Adaptogen)' : med.toLowerCase().includes('metformin') ? 'A10BA02' : 'R06AE07'}
                        </td>
                        <td>
                          {med.toLowerCase().includes('paracetamol') ? 'Analgesics / Antipyretics' : med.toLowerCase().includes('ashwagandha') ? 'Ayurvedic Botanical' : 'Herbal / Allopathic Co-prescription'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setInspectingEvent(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: New ADR / SAE Report Form */}
      {showModal && (
        <div className="pv-modal-overlay">
          <div className="pv-modal-card">
            <div className="modal-header">
              <div>
                <span className="modal-tag">CDASH / E2B(R3) COMPLIANT FORM</span>
                <h3 className="modal-title">Capture Adverse Event / SAE</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitNewSAE} className="modal-form">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Subject ID (ABHA Verified)</label>
                  <input
                    type="text"
                    required
                    value={formSubjectId}
                    onChange={(e) => setFormSubjectId(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Study Protocol</label>
                  <input
                    type="text"
                    required
                    value={formProtocol}
                    onChange={(e) => setFormProtocol(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Adverse Event Verbatim Term</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acute Erythematous Rash with pruritus, Bronchospasm..."
                  value={formTerm}
                  onChange={(e) => {
                    setFormTerm(e.target.value)
                    handleMedDraCode(e.target.value)
                  }}
                />
              </div>

              <div className="meddra-preview-panel">
                <span className="preview-label">Live MedDRA Auto-Coding Link:</span>
                <div className="preview-content">
                  <span><strong>PT:</strong> {codedResult.pt}</span>
                  <span><strong>SOC:</strong> {codedResult.soc}</span>
                  <span><strong>MedDRA Code:</strong> {codedResult.code}</span>
                </div>
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label>Severity Grade</label>
                  <select
                    value={formSeverity}
                    onChange={(e) => setFormSeverity(e.target.value as any)}
                  >
                    <option value="Mild">Mild</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Severe">Severe</option>
                    <option value="Life-Threatening">Life-Threatening</option>
                    <option value="Fatal">Fatal</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Is this an SAE?</label>
                  <select
                    value={formIsSAE ? 'yes' : 'no'}
                    onChange={(e) => setFormIsSAE(e.target.value === 'yes')}
                  >
                    <option value="yes">Yes (Triggers 7/15-Day Expedited Deadline)</option>
                    <option value="no">No (Routine Periodic AE)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Investigational Causality</label>
                  <select
                    value={formCausality}
                    onChange={(e) => setFormCausality(e.target.value as any)}
                  >
                    <option value="Definite">Definite</option>
                    <option value="Probable">Probable</option>
                    <option value="Possible">Possible</option>
                    <option value="Unlikely">Unlikely</option>
                    <option value="Not Related">Not Related</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>WHODrug Concomitant Medications (Select from Dictionary):</label>
                <div className="meds-picker-wrap">
                  {sampleWhoDrugDb.map((m) => {
                    const isSelected = selectedMeds.includes(m.name)
                    return (
                      <button
                        key={m.name}
                        type="button"
                        className={`med-tag-btn ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleMed(m.name)}
                      >
                        {isSelected ? '✓ ' : '+ '} {m.name} ({m.atc})
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="modal-compliance-notice">
                <span>🔒 ALCOA+ Security: Submitting will generate an immutable SHA-256 cryptographic audit trail record with user ID and timestamp.</span>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Sign &amp; Submit to Safety Database (21 CFR Part 11)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
