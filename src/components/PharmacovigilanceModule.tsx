import React, { useState } from 'react'
import type { AdverseEvent, Role } from '../types'

interface PharmacovigilanceModuleProps {
  adverseEvents: AdverseEvent[]
  currentRole: Role
  onAddNewEvent: (newEvent: AdverseEvent) => void
}

const sampleMedDraDatabase: Record<
  string,
  { llt: string; pt: string; soc: string; code: string }
> = {
  headache: {
    llt: 'Headache acute',
    pt: 'Headache',
    soc: 'Nervous system disorders',
    code: '10019211',
  },
  bronchospasm: {
    llt: 'Bronchospasm acute',
    pt: 'Bronchospasm',
    soc: 'Respiratory, thoracic and mediastinal disorders',
    code: '10006482',
  },
  jaundice: {
    llt: 'Ocular icterus / Jaundice',
    pt: 'Jaundice',
    soc: 'Hepatobiliary disorders',
    code: '10023126',
  },
  hypoglycaemia: {
    llt: 'Hypoglycaemia neonatal and adult',
    pt: 'Hypoglycaemia',
    soc: 'Metabolism and nutrition disorders',
    code: '10020993',
  },
  rash: {
    llt: 'Maculo-papular rash',
    pt: 'Rash maculo-papular',
    soc: 'Skin and subcutaneous tissue disorders',
    code: '10025409',
  },
}

export const PharmacovigilanceModule: React.FC<PharmacovigilanceModuleProps> = ({
  adverseEvents,
  currentRole,
  onAddNewEvent,
}) => {
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [coderInput, setCoderInput] = useState('Bronchospasm')
  const [codedResult, setCodedResult] = useState(sampleMedDraDatabase['bronchospasm'])

  // Form State
  const [formSubjectId, setFormSubjectId] = useState('AIIA-01-055')
  const [formProtocol, setFormProtocol] = useState('AIIA/CTU/2024/01')
  const [formTerm, setFormTerm] = useState('')
  const [formSeverity, setFormSeverity] = useState<'Mild' | 'Moderate' | 'Severe' | 'Life-Threatening' | 'Fatal'>('Severe')
  const [formIsSAE, setFormIsSAE] = useState(true)
  const [formMeds, setFormMeds] = useState('Guduchi 500mg, Paracetamol 650mg')
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
      llt: `${input} unspecified`,
      pt: input,
      soc: 'General disorders and administration site conditions',
      code: '10018065',
    })
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
      meddra: codedResult,
      concomitantMeds: formMeds.split(',').map((s) => s.trim()),
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

  const filteredEvents = adverseEvents.filter(
    (ev) =>
      ev.eventTerm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.subjectId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.meddra.pt.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div id="pv-module" className="pv-container">
      <div className="pv-header">
        <div className="pv-title-box">
          <div className="npvcc-badge">
            <span>AIIA NPvCC COORDINATION HUB · Persona: {currentRole}</span>
          </div>
          <h2 className="widget-title">Pharmacovigilance &amp; Safety Governance</h2>
          <p className="widget-subtitle">
            CDASH/E2B(R3) Adverse Drug Reaction capture, MedDRA hierarchy coding, WHODrug checks, and CDSCO SUGAM statutory timeline tracking.
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

      {/* Regulatory Timeline Tracker Countdown Card */}
      <div className="regulatory-timelines-card">
        <div className="timeline-title-row">
          <span className="timeline-badge-red">STATUTORY REPORTING TIMELINES</span>
          <span className="timeline-subtitle font-mono">
            New Drugs &amp; Clinical Trials Rules, 2019 (CDSCO) &amp; GCP-ASU
          </span>
        </div>

        <div className="timelines-grid">
          <div className="timeline-box red-urgent">
            <div className="timeline-top">
              <span className="timeline-clock">⏳ 5 Days Remaining</span>
              <span className="timeline-type">7-Day Expedited</span>
            </div>
            <h4 className="timeline-event">Subject AIIA-01-042 (Severe Bronchospasm)</h4>
            <p className="timeline-detail">
              Mandatory submission to CDSCO Central Licensing Authority &amp; Ethics Committee within 7 calendar days.
            </p>
            <div className="timeline-status-pill">
              <span>Status: Drafted · 21 CFR Part 11 e-Sign Pending</span>
            </div>
          </div>

          <div className="timeline-box yellow-warn">
            <div className="timeline-top">
              <span className="timeline-clock">⏳ 11 Days Remaining</span>
              <span className="timeline-type">15-Day Serious Unexpected</span>
            </div>
            <h4 className="timeline-event">Subject AIIMS-02-089 (Severe Hypoglycaemia)</h4>
            <p className="timeline-detail">
              In-depth medical narrative, lab dechallenge/rechallenge analysis &amp; DSMB causality concurrence.
            </p>
            <div className="timeline-status-pill">
              <span>Status: Under IEC &amp; Medical Monitor Review</span>
            </div>
          </div>

          <div className="timeline-box green-ok">
            <div className="timeline-top">
              <span className="timeline-clock">✓ On Track</span>
              <span className="timeline-type">90-Day Periodic Safety</span>
            </div>
            <h4 className="timeline-event">Quarterly Line Listing Aggregate (AIIA-COV)</h4>
            <p className="timeline-detail">
              DSUR (Development Safety Update Report) compiling all non-serious AEs and mild gastric events.
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
              Type clinical verbatim terms to view real-time standardization across Lowest Level Term (LLT), Preferred Term (PT), and System Organ Class (SOC).
            </p>
          </div>
        </div>

        <div className="coder-input-row">
          <input
            type="text"
            className="coder-input"
            value={coderInput}
            onChange={(e) => handleMedDraCode(e.target.value)}
            placeholder="Type clinical symptom (e.g., Bronchospasm, Jaundice, Headache, Hypoglycaemia)..."
          />
          <div className="quick-suggestions">
            <button type="button" onClick={() => handleMedDraCode('Bronchospasm')}>Bronchospasm</button>
            <button type="button" onClick={() => handleMedDraCode('Jaundice')}>Jaundice</button>
            <button type="button" onClick={() => handleMedDraCode('Hypoglycaemia')}>Hypoglycaemia</button>
            <button type="button" onClick={() => handleMedDraCode('Headache')}>Headache</button>
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
            <span className="level-code font-mono">Standard Regulatory Term</span>
          </div>
          <div className="code-level-box">
            <span className="level-name">System Organ Class (SOC)</span>
            <span className="level-val font-semibold">{codedResult.soc}</span>
            <span className="level-code font-mono">Organ Hierarchy Domain</span>
          </div>
        </div>
      </div>

      {/* Adverse Events & SAE Master Registry Table */}
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
                <th>MedDRA (PT)</th>
                <th>Severity</th>
                <th>Classification</th>
                <th>Causality</th>
                <th>Statutory Deadline</th>
                <th>CDSCO Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((ev) => (
                <tr key={ev.id} className={ev.isSAE ? 'row-sae' : ''}>
                  <td className="font-mono font-semibold">{ev.id}</td>
                  <td className="font-mono">{ev.subjectId}</td>
                  <td className="term-cell">
                    <strong>{ev.eventTerm}</strong>
                    <div className="concomitant-tag">Meds: {ev.concomitantMeds.join(', ')}</div>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for reporting ADR / SAE */}
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
                  placeholder="e.g. Acute Erythematous Rash with pruritus"
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
                    <option value="yes">Yes (Triggers Expedited Timeline)</option>
                    <option value="no">No (Routine AE)</option>
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
                <label>Concomitant Medications (WHODrug format)</label>
                <input
                  type="text"
                  value={formMeds}
                  onChange={(e) => setFormMeds(e.target.value)}
                />
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
