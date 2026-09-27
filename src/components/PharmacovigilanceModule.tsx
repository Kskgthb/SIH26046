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
  { llt: string; pt: string; hlt: string; hlgt: string; soc: string; code: string }
> = {
  bronchospasm: {
    llt: 'Bronchospasm acute (LLT: 10006451)',
    pt: 'Bronchospasm',
    hlt: 'Bronchospasm and obstruction',
    hlgt: 'Bronchial disorders (excl neoplasms)',
    soc: 'Respiratory, thoracic and mediastinal disorders',
    code: '10006482',
  },
  jaundice: {
    llt: 'Ocular icterus / Jaundice (LLT: 10023126)',
    pt: 'Jaundice',
    hlt: 'Hepatobiliary signs and symptoms',
    hlgt: 'Hepatic and hepatobiliary disorders',
    soc: 'Hepatobiliary disorders',
    code: '10023126',
  },
  hypoglycaemia: {
    llt: 'Hypoglycaemia adult (LLT: 10020993)',
    pt: 'Hypoglycaemia',
    hlt: 'Hypoglycaemic conditions NEC',
    hlgt: 'Glucose metabolism disorders (incl diabetes)',
    soc: 'Metabolism and nutrition disorders',
    code: '10020993',
  },
  headache: {
    llt: 'Headache acute throbbing (LLT: 10019211)',
    pt: 'Headache',
    hlt: 'Headaches NEC',
    hlgt: 'Headaches',
    soc: 'Nervous system disorders',
    code: '10019211',
  },
  rash: {
    llt: 'Maculo-papular erythematous rash (LLT: 10025409)',
    pt: 'Rash maculo-papular',
    hlt: 'Rashes, eruptions and exanthems NEC',
    hlgt: 'Epidermal and dermal conditions',
    soc: 'Skin and subcutaneous tissue disorders',
    code: '10025409',
  },
  anaphylaxis: {
    llt: 'Acute Anaphylactic Reaction (LLT: 10002198)',
    pt: 'Anaphylactic reaction',
    hlt: 'Anaphylactic and anaphylactoid responses',
    hlgt: 'Allergic conditions',
    soc: 'Immune system disorders',
    code: '10002198',
  },
  nausea: {
    llt: 'Transient nausea (LLT: 10028813)',
    pt: 'Nausea',
    hlt: 'Nausea and vomiting symptoms',
    hlgt: 'Gastrointestinal signs and symptoms',
    soc: 'Gastrointestinal disorders',
    code: '10028813',
  },
}

const sampleWhoDrugDb = [
  { name: 'Paracetamol 650mg', atc: 'N02BE01', category: 'Analgesics / Antipyretics' },
  { name: 'Ashwagandha Extract (Withania somnifera)', atc: 'A13A (Herbal Adaptogen)', category: 'Ayurvedic Botanical' },
  { name: 'Guduchi Ghanvati (Tinospora cordifolia)', atc: 'A13A (Immunomodulator)', category: 'Ayurvedic Botanical' },
  { name: 'Metformin Hydrochloride 500mg', atc: 'A10BA02', category: 'Oral Blood Glucose Lowering' },
  { name: 'Cetirizine 10mg', atc: 'R06AE07', category: 'Antihistamines for systemic use' },
  { name: 'Telmisartan 40mg', atc: 'C09CA07', category: 'Angiotensin II Receptor Blockers' },
  { name: 'Omeprazole 20mg', atc: 'A02BC01', category: 'Proton Pump Inhibitors' },
]

export const PharmacovigilanceModule: React.FC<PharmacovigilanceModuleProps> = ({
  adverseEvents,
  currentRole,
  onAddNewEvent,
  onApproveEventESign,
}) => {
  const [pvActiveTab, setPvActiveTab] = useState<'events' | 'timers' | 'coding' | 'signals' | 'causality' | 'dsmb'>('events')
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
  const [formDechallenge, setFormDechallenge] = useState<'Positive' | 'Negative' | 'Not Done'>('Positive')
  const [formRechallenge, setFormRechallenge] = useState<'Positive' | 'Negative' | 'Not Done'>('Not Done')
  const [formTimelineType, setFormTimelineType] = useState<'7-Day Expedited' | '15-Day Serious Unexpected' | '90-Day Periodic'>('7-Day Expedited')

  // Interactive Naranjo Algorithm State
  const [q1, setQ1] = useState(1) // Previous reports (+1 / 0)
  const [q2, setQ2] = useState(2) // Event after drug (+2 / -1)
  const [q3, setQ3] = useState(1) // Improved on de-challenge (+1 / 0)
  const [q4, setQ4] = useState(0) // Reappeared on re-challenge (+2 / -1 / 0)
  const [q5, setQ5] = useState(-1) // Alternative causes (-1 / +2)
  const [q6, setQ6] = useState(0) // Placebo response (-1 / +1 / 0)
  const [q7, setQ7] = useState(1) // Drug detected in toxic conc (+1 / 0)

  const naranjoScore = q1 + q2 + q3 + q4 + q5 + q6 + q7
  const getNaranjoVerdict = (score: number) => {
    if (score >= 9) return { label: 'DEFINITE CAUSALITY (Score ≥ 9)', color: 'text-danger' }
    if (score >= 5) return { label: 'PROBABLE CAUSALITY (Score 5-8)', color: 'text-warn' }
    if (score >= 1) return { label: 'POSSIBLE CAUSALITY (Score 1-4)', color: 'text-accent' }
    return { label: 'DOUBTFUL / UNLIKELY (Score ≤ 0)', color: 'text-muted' }
  }

  // DSMB Packet State
  const [dsmbGenerated, setDsmbGenerated] = useState(false)

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
      hlgt: 'General signs and symptoms',
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
    if (!formTerm.trim()) return

    const newEvent: AdverseEvent = {
      id: `SAE-${new Date().getFullYear()}-${Math.floor(Math.random() * 800 + 100)}`,
      studyId: formProtocol === 'AIIA/CTU/2024/01' ? 'study-1' : 'study-2',
      protocolNumber: formProtocol,
      subjectId: formSubjectId,
      siteName: 'All India Institute of Ayurveda, New Delhi',
      eventTerm: formTerm,
      onsetDate: new Date().toISOString().substring(0, 10),
      reportedDate: new Date().toISOString().substring(0, 10),
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
        timelineType: formTimelineType,
        submissionDeadline:
          formTimelineType === '7-Day Expedited'
            ? '7 Calendar Days'
            : formTimelineType === '15-Day Serious Unexpected'
            ? '15 Calendar Days'
            : '90 Calendar Days',
        daysRemaining: formTimelineType === '7-Day Expedited' ? 7 : formTimelineType === '15-Day Serious Unexpected' ? 15 : 90,
        cdscoSubmissionStatus: 'Drafted',
        ethicsCommitteeStatus: 'Submitted',
        dsmbNotified: true,
      },
      outcome: 'Recovering',
    }

    onAddNewEvent(newEvent)
    setShowModal(false)
    setFormTerm('')
  }

  const handleConfirmESign = (e: React.FormEvent) => {
    e.preventDefault()
    if (!signingEvent || !eSignPassword) return
    if (onApproveEventESign) {
      onApproveEventESign(signingEvent.id, eSignUsername, eSignReason)
    }
    setESignConfirmed(true)
    setTimeout(() => {
      setSigningEvent(null)
      setESignConfirmed(false)
      setESignPassword('')
    }, 1200)
  }

  const filteredEvents = adverseEvents.filter((ev) => {
    const term = searchTerm.toLowerCase()
    return (
      ev.eventTerm.toLowerCase().includes(term) ||
      ev.subjectId.toLowerCase().includes(term) ||
      ev.meddra.pt.toLowerCase().includes(term) ||
      ev.protocolNumber.toLowerCase().includes(term)
    )
  })

  return (
    <div className="pv-module-container">
      {/* PV Module Header */}
      <div className="pv-header-bar">
        <div className="pv-title-group">
          <div className="pv-badge-tag">
            <span className="pulse-dot"></span>
            <span>NATIONAL PHARMACOVIGILANCE PROGRAM (NPvCC)</span>
            <span className="badge-tag ml-2 font-mono">Persona: {currentRole}</span>
          </div>
          <h2 className="widget-title">Clinical Trial Pharmacovigilance &amp; Safety Desk</h2>
          <p className="widget-subtitle">
            Statutory adverse event surveillance, MedDRA v27.0 auto-coding, WHODrug dictionaries, Disproportionality Signal Detection, and 21 CFR Part 11 electronic sign-off.
          </p>
        </div>

        <div className="pv-header-actions">
          <button
            type="button"
            className="btn-primary-glow"
            onClick={() => setShowModal(true)}
          >
            ➕ Log New AE / Expedited SAE
          </button>
        </div>
      </div>

      {/* PV Sub-Tabs Navigation */}
      <div className="pv-subtabs-bar">
        <button
          type="button"
          className={`pv-tab-pill ${pvActiveTab === 'events' ? 'active' : ''}`}
          onClick={() => setPvActiveTab('events')}
        >
          📋 Safety Register ({adverseEvents.length})
        </button>
        <button
          type="button"
          className={`pv-tab-pill ${pvActiveTab === 'timers' ? 'active' : ''}`}
          onClick={() => setPvActiveTab('timers')}
        >
          ⏱️ 7 / 15 / 90-Day Timers
        </button>
        <button
          type="button"
          className={`pv-tab-pill ${pvActiveTab === 'coding' ? 'active' : ''}`}
          onClick={() => setPvActiveTab('coding')}
        >
          🏷️ MedDRA &amp; WHODrug Auto-Coder
        </button>
        <button
          type="button"
          className={`pv-tab-pill ${pvActiveTab === 'signals' ? 'active' : ''}`}
          onClick={() => setPvActiveTab('signals')}
        >
          📊 Signal Detection (PRR / ROR)
        </button>
        <button
          type="button"
          className={`pv-tab-pill ${pvActiveTab === 'causality' ? 'active' : ''}`}
          onClick={() => setPvActiveTab('causality')}
        >
          ⚖️ Naranjo Causality Calculator
        </button>
        <button
          type="button"
          className={`pv-tab-pill ${pvActiveTab === 'dsmb' ? 'active' : ''}`}
          onClick={() => setPvActiveTab('dsmb')}
        >
          🛡️ DSMB Safety Feed
        </button>
      </div>

      {/* TAB 1: SAFETY EVENTS REGISTER & E-SIGN */}
      {pvActiveTab === 'events' && (
        <div className="pv-body-content">
          <div className="pv-search-filter-bar">
            <input
              type="text"
              className="pv-search-input"
              placeholder="Search by Event Term, MedDRA PT, Subject ID (e.g. AIIA-01-042)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="pv-count-tag font-mono">
              Showing {filteredEvents.length} of {adverseEvents.length} Events
            </span>
          </div>

          <div className="pv-table-wrap">
            <table className="pv-table">
              <thead>
                <tr>
                  <th>Event ID &amp; Type</th>
                  <th>Subject &amp; Protocol</th>
                  <th>Clinical Term (Verbatim)</th>
                  <th>MedDRA PT &amp; Code</th>
                  <th>Causality</th>
                  <th>Statutory Reporting Window</th>
                  <th>CDSCO Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((ev) => (
                  <tr key={ev.id} className={ev.isSAE ? 'sae-row-highlight' : ''}>
                    <td>
                      <div className="ev-id-badge">
                        <span className={`tag-pill ${ev.isSAE ? 'tag-sae' : 'tag-ae'}`}>
                          {ev.isSAE ? '🚨 SAE' : 'AE'}
                        </span>
                        <code>{ev.id}</code>
                      </div>
                      <small className="font-mono text-muted">{ev.onsetDate}</small>
                    </td>

                    <td>
                      <strong>{ev.subjectId}</strong>
                      <div className="font-mono text-muted">{ev.protocolNumber}</div>
                    </td>

                    <td>
                      <div className="ev-term font-semibold">{ev.eventTerm}</div>
                      <span className="severity-badge">{ev.severity}</span>
                    </td>

                    <td>
                      <div className="meddra-pt-badge">
                        <span className="font-semibold">{ev.meddra.pt}</span>
                        <code className="text-accent">{ev.meddra.code}</code>
                      </div>
                      <small className="text-muted soc-label">{ev.meddra.soc}</small>
                    </td>

                    <td>
                      <span className={`causality-tag causality-${ev.causality.toLowerCase().replace(/ /g, '-')}`}>
                        {ev.causality}
                      </span>
                    </td>

                    <td>
                      <div className="timer-col">
                        <span className="timer-type-label font-semibold">
                          {ev.regulatoryReporting.timelineType}
                        </span>
                        <div className="timer-bar-wrap">
                          <div
                            className="timer-bar-fill"
                            style={{
                              width: `${Math.min(100, (ev.regulatoryReporting.daysRemaining / (ev.regulatoryReporting.timelineType.includes('7') ? 7 : 15)) * 100)}%`,
                            }}
                          ></div>
                        </div>
                        <span className="days-left-text">
                          ⏳ {ev.regulatoryReporting.daysRemaining} Days Remaining
                        </span>
                      </div>
                    </td>

                    <td>
                      <span className={`status-pill ${ev.regulatoryReporting.cdscoSubmissionStatus === 'Submitted' ? 'active' : 'warn'}`}>
                        {ev.regulatoryReporting.cdscoSubmissionStatus}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons-cell">
                        <button
                          type="button"
                          className="btn-inspect-small"
                          onClick={() => setInspectingEvent(ev)}
                        >
                          👁️ Details
                        </button>

                        {ev.isSAE && ev.regulatoryReporting.cdscoSubmissionStatus !== 'Submitted' && (
                          <button
                            type="button"
                            className="btn-esign-small"
                            onClick={() => setSigningEvent(ev)}
                          >
                            ✍️ e-Sign
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: THREE STATUTORY TIMERS (7-DAY / 15-DAY / 90-DAY) */}
      {pvActiveTab === 'timers' && (
        <div className="pv-body-content">
          <div className="statutory-timers-grid">
            {/* 7-DAY EXPEDITED CLOCK */}
            <div className="timer-card critical">
              <div className="timer-card-header">
                <span className="timer-icon">🚨</span>
                <div>
                  <h4>7-Day Expedited Reporting Clock</h4>
                  <small>Fatal or Life-Threatening SAEs (CDSCO Rule 2019)</small>
                </div>
              </div>
              <div className="timer-countdown-big text-danger">
                5 Days : 14 Hrs : 22 Min
              </div>
              <p className="timer-card-desc">
                Mandatory expedited preliminary report to CDSCO SUGAM &amp; Institutional Ethics Committee within 7 calendar days of PI awareness.
              </p>
              <div className="timer-stats-row">
                <div><strong>Subject:</strong> AIIA-01-042</div>
                <div><strong>Event:</strong> Acute Bronchospasm</div>
                <div><strong>Deadline:</strong> 2026-10-01 17:00 IST</div>
              </div>
              <button
                type="button"
                className="btn-timer-action"
                onClick={() => {
                  const ev = adverseEvents.find((e) => e.isSAE)
                  if (ev) setSigningEvent(ev)
                }}
              >
                ✍️ Apply 21 CFR Part 11 Electronic Signature →
              </button>
            </div>

            {/* 15-DAY SUSAR CLOCK */}
            <div className="timer-card warning">
              <div className="timer-card-header">
                <span className="timer-icon">⚠️</span>
                <div>
                  <h4>15-Day Serious Unexpected Clock</h4>
                  <small>Non-fatal Serious Unexpected Adverse Reactions (SUSAR)</small>
                </div>
              </div>
              <div className="timer-countdown-big text-warn">
                11 Days : 06 Hrs : 45 Min
              </div>
              <p className="timer-card-desc">
                Comprehensive follow-up safety narrative &amp; laboratory panel submission required within 15 calendar days.
              </p>
              <div className="timer-stats-row">
                <div><strong>Subject:</strong> AIIMS-02-089</div>
                <div><strong>Event:</strong> Hospitalized Hypoglycaemia</div>
                <div><strong>Deadline:</strong> 2026-10-07 18:00 IST</div>
              </div>
              <button type="button" className="btn-timer-action" onClick={() => setPvActiveTab('causality')}>
                Review Naranjo Causality Assessment →
              </button>
            </div>

            {/* 90-DAY PERIODIC CLOCK */}
            <div className="timer-card info">
              <div className="timer-card-header">
                <span className="timer-icon">📅</span>
                <div>
                  <h4>90-Day Periodic Update Clock</h4>
                  <small>Non-serious Aggregate Safety Data &amp; Trend Analysis</small>
                </div>
              </div>
              <div className="timer-countdown-big text-accent">
                85 Days Remaining
              </div>
              <p className="timer-card-desc">
                Aggregated safety summary report for DSMB and ethics committee review due quarterly.
              </p>
              <div className="timer-stats-row">
                <div><strong>Batch:</strong> Q3 2026 Aggregate</div>
                <div><strong>Events Logged:</strong> 14 Non-serious</div>
                <div><strong>Deadline:</strong> 2026-12-20 23:59 IST</div>
              </div>
              <button type="button" className="btn-timer-action" onClick={() => setPvActiveTab('dsmb')}>
                Generate DSMB Interim Safety Feed →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MEDDRA & WHODRUG AUTO-CODER */}
      {pvActiveTab === 'coding' && (
        <div className="pv-body-content">
          <div className="coder-layout-grid">
            {/* MedDRA Coder */}
            <div className="coder-panel">
              <div className="panel-title-row">
                <h3>🏷️ MedDRA v27.0 Multitier Auto-Coder</h3>
                <span className="badge-tag">LLT → PT → HLT → HLGT → SOC</span>
              </div>
              <p className="panel-sub">
                Type any verbatim clinical symptom to inspect automated coding hierarchy:
              </p>
              <div className="coder-input-group">
                <input
                  type="text"
                  className="coder-input"
                  value={coderInput}
                  onChange={(e) => handleMedDraCode(e.target.value)}
                  placeholder="e.g. bronchospasm, jaundice, hypoglycemia, rash..."
                />
              </div>

              <div className="meddra-hierarchy-card">
                <div className="h-level">
                  <span className="level-badge llt">LLT</span>
                  <div>
                    <label>Lowest Level Term:</label>
                    <p>{codedResult.llt}</p>
                  </div>
                </div>
                <div className="h-level">
                  <span className="level-badge pt">PT</span>
                  <div>
                    <label>Preferred Term:</label>
                    <p className="font-bold text-accent">{codedResult.pt}</p>
                  </div>
                </div>
                <div className="h-level">
                  <span className="level-badge hlt">HLT</span>
                  <div>
                    <label>High Level Term:</label>
                    <p>{codedResult.hlt}</p>
                  </div>
                </div>
                <div className="h-level">
                  <span className="level-badge hlgt">HLGT</span>
                  <div>
                    <label>High Level Group Term:</label>
                    <p>{codedResult.hlgt}</p>
                  </div>
                </div>
                <div className="h-level">
                  <span className="level-badge soc">SOC</span>
                  <div>
                    <label>System Organ Class:</label>
                    <p className="font-semibold">{codedResult.soc}</p>
                  </div>
                </div>
                <div className="meddra-code-footer">
                  <span>Official MedDRA Code: <code>{codedResult.code}</code></span>
                  <span className="verified-badge">✓ Validated against MedDRA MSSO Dictionary</span>
                </div>
              </div>
            </div>

            {/* WHODrug Concomitant Medications Coder */}
            <div className="coder-panel">
              <div className="panel-title-row">
                <h3>💊 WHODrug Global Concomitant Medications Dictionary</h3>
                <span className="badge-tag">Anatomical Therapeutic Chemical (ATC)</span>
              </div>
              <p className="panel-sub">
                Standardized coding of concomitant pharmaceutical &amp; herbal medications:
              </p>
              <table className="persona-table">
                <thead>
                  <tr>
                    <th>Medication Name</th>
                    <th>ATC Code</th>
                    <th>Therapeutic Category</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleWhoDrugDb.map((m) => (
                    <tr key={m.name}>
                      <td><strong>{m.name}</strong></td>
                      <td><code>{m.atc}</code></td>
                      <td><span className="badge-tag">{m.category}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SIGNAL DETECTION & DISPROPORTIONALITY ANALYSIS */}
      {pvActiveTab === 'signals' && (
        <div className="pv-body-content">
          <div className="signals-dashboard">
            <div className="signals-header-row">
              <div>
                <h3>📊 Disproportionality Signal Detection Engine</h3>
                <p>
                  Statistical data mining via Proportional Reporting Ratio (PRR), Reporting Odds Ratio (ROR), and Bayesian Confidence Propagation Neural Network (BCPNN / IC025).
                </p>
              </div>
              <div className="signal-summary-badge">
                <span className="pulse-dot"></span>
                <span>Surveillance Active on 3 Active Trials</span>
              </div>
            </div>

            <table className="persona-table">
              <thead>
                <tr>
                  <th>Preferred Term (PT)</th>
                  <th>System Organ Class</th>
                  <th>Observed Cases (A)</th>
                  <th>Expected (E)</th>
                  <th>PRR (95% CI)</th>
                  <th>ROR (95% CI)</th>
                  <th>BCPNN (IC025)</th>
                  <th>Signal Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Bronchospasm</strong></td>
                  <td>Respiratory disorders</td>
                  <td>1</td>
                  <td>0.88</td>
                  <td>1.14 (0.2 - 6.4)</td>
                  <td>1.15 (0.2 - 6.5)</td>
                  <td>+0.12</td>
                  <td><span className="status-pill active">Within Expected Range</span></td>
                </tr>
                <tr>
                  <td><strong>Hypoglycaemia</strong></td>
                  <td>Metabolism disorders</td>
                  <td>1</td>
                  <td>0.92</td>
                  <td>1.08 (0.2 - 5.8)</td>
                  <td>1.09 (0.2 - 5.9)</td>
                  <td>+0.08</td>
                  <td><span className="status-pill active">Within Expected Range</span></td>
                </tr>
                <tr>
                  <td><strong>Dyspepsia</strong></td>
                  <td>Gastrointestinal disorders</td>
                  <td>2</td>
                  <td>1.75</td>
                  <td>1.14 (0.3 - 4.2)</td>
                  <td>1.16 (0.3 - 4.4)</td>
                  <td>+0.15</td>
                  <td><span className="status-pill active">Within Expected Range</span></td>
                </tr>
              </tbody>
            </table>

            <div className="expectedness-check-card">
              <h4>🛡️ Reference Safety Information (RSI) Expectedness Check</h4>
              <p>
                Cross-referenced against <strong>Investigator's Brochure (IB) Section 6.2 (Summary of Known Risks)</strong>:
              </p>
              <ul>
                <li>Dyspepsia / Pyrosis is listed as <strong>Expected Mild Reaction (Frequency: 1.2%)</strong>.</li>
                <li>Acute Bronchospasm following Ashwagandha extract is <strong>Unexpected (SUSAR)</strong>. Prompted immediate 7-day expedited filing.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: NARANJO CAUSALITY CALCULATOR */}
      {pvActiveTab === 'causality' && (
        <div className="pv-body-content">
          <div className="naranjo-calculator-card">
            <div className="panel-title-row">
              <h3>⚖️ Interactive Naranjo Adverse Drug Reaction Probability Scale</h3>
              <span className="badge-tag">WHO-UMC &amp; Naranjo Algorithm</span>
            </div>
            <p className="panel-sub">
              Evaluate objective causality between Investigational Product and adverse event:
            </p>

            <div className="naranjo-questions-list">
              <div className="n-question-row">
                <span className="q-text">1. Are there previous conclusive reports on this adverse reaction?</span>
                <select value={q1} onChange={(e) => setQ1(Number(e.target.value))}>
                  <option value={1}>Yes (+1)</option>
                  <option value={0}>No / Do not know (0)</option>
                </select>
              </div>

              <div className="n-question-row">
                <span className="q-text">2. Did the adverse event appear after the suspected drug was administered?</span>
                <select value={q2} onChange={(e) => setQ2(Number(e.target.value))}>
                  <option value={2}>Yes (+2)</option>
                  <option value={-1}>No (-1)</option>
                  <option value={0}>Do not know (0)</option>
                </select>
              </div>

              <div className="n-question-row">
                <span className="q-text">3. Did the adverse reaction improve when the drug was discontinued (de-challenge)?</span>
                <select value={q3} onChange={(e) => setQ3(Number(e.target.value))}>
                  <option value={1}>Yes (+1)</option>
                  <option value={0}>No / Not done (0)</option>
                </select>
              </div>

              <div className="n-question-row">
                <span className="q-text">4. Did the adverse reaction reappear when the drug was re-administered (re-challenge)?</span>
                <select value={q4} onChange={(e) => setQ4(Number(e.target.value))}>
                  <option value={2}>Yes (+2)</option>
                  <option value={-1}>No (-1)</option>
                  <option value={0}>Not done (0)</option>
                </select>
              </div>

              <div className="n-question-row">
                <span className="q-text">5. Are there alternative causes that could on their own have caused the reaction?</span>
                <select value={q5} onChange={(e) => setQ5(Number(e.target.value))}>
                  <option value={-1}>Yes (-1)</option>
                  <option value={2}>No (+2)</option>
                  <option value={0}>Do not know (0)</option>
                </select>
              </div>

              <div className="n-question-row">
                <span className="q-text">6. Did the reaction reappear when a placebo was given?</span>
                <select value={q6} onChange={(e) => setQ6(Number(e.target.value))}>
                  <option value={-1}>Yes (-1)</option>
                  <option value={1}>No (+1)</option>
                  <option value={0}>Do not know (0)</option>
                </select>
              </div>

              <div className="n-question-row">
                <span className="q-text">7. Was the drug detected in the blood or other fluids in toxic concentrations?</span>
                <select value={q7} onChange={(e) => setQ7(Number(e.target.value))}>
                  <option value={1}>Yes (+1)</option>
                  <option value={0}>No / Not tested (0)</option>
                </select>
              </div>
            </div>

            <div className="naranjo-score-banner">
              <div className="score-number-box">
                <span className="score-lbl">Total Score:</span>
                <span className="score-val font-mono">{naranjoScore}</span>
              </div>
              <div className="score-verdict-box">
                <span className={`score-verdict ${getNaranjoVerdict(naranjoScore).color}`}>
                  {getNaranjoVerdict(naranjoScore).label}
                </span>
                <small>Calculated according to Naranjo CA et al. Clin Pharmacol Ther 1981.</small>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: DSMB AUTO-FEED */}
      {pvActiveTab === 'dsmb' && (
        <div className="pv-body-content">
          <div className="dsmb-panel-card">
            <div className="panel-title-row">
              <h3>🛡️ Independent Data Safety Monitoring Board (DSMB) Interim Feed</h3>
              <span className="badge-tag">Unblinded Safety Package</span>
            </div>
            <p className="panel-sub">
              Automated compilation of unblinded interim safety statistics for DSMB review:
            </p>

            <div className="dsmb-controls-row">
              <button
                type="button"
                className="btn-primary-glow"
                onClick={() => setDsmbGenerated(true)}
              >
                📑 Generate DSMB Interim Safety Package
              </button>
            </div>

            {dsmbGenerated && (
              <div className="dsmb-package-preview">
                <div className="dsmb-package-header">
                  <span className="badge-tag">INTERIM SAFETY DOSSIER (CONFIDENTIAL)</span>
                  <span className="font-mono text-muted">Generated: {new Date().toISOString().substring(0, 10)}</span>
                </div>
                <div className="dsmb-package-body">
                  <h4>AIIA Multi-Center Clinical Trial Safety Overview:</h4>
                  <table className="persona-table">
                    <thead>
                      <tr>
                        <th>Metric</th>
                        <th>Treatment Arm A (Active)</th>
                        <th>Treatment Arm B (Placebo)</th>
                        <th>Total Cohort</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Randomized Subjects</td>
                        <td>180</td>
                        <td>180</td>
                        <td>360</td>
                      </tr>
                      <tr>
                        <td>Total Adverse Events (AEs)</td>
                        <td>8 (4.4%)</td>
                        <td>6 (3.3%)</td>
                        <td>14 (3.9%)</td>
                      </tr>
                      <tr>
                        <td>Serious Adverse Events (SAEs)</td>
                        <td>1 (0.55%)</td>
                        <td>0 (0.0%)</td>
                        <td>1 (0.27%)</td>
                      </tr>
                      <tr>
                        <td>Discontinuations due to Adverse Events</td>
                        <td>1</td>
                        <td>0</td>
                        <td>1</td>
                      </tr>
                      <tr>
                        <td>DSMB Safety Stopping Boundary</td>
                        <td>Not Exceeded (p &gt; 0.05)</td>
                        <td>Not Exceeded</td>
                        <td>Study Cleared to Continue</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="dsmb-recommendation-note">
                    <strong>DSMB Independent Recommendation:</strong> "Based on current safety monitoring data, the safety profile of the investigational formulation remains favorable. Trial recruitment should proceed without protocol modification."
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: LOG NEW AE/SAE */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-dialog-large">
            <div className="modal-header">
              <h3>➕ Log Clinical Adverse Event / Expedited SAE</h3>
              <button type="button" className="close-x" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmitNewSAE} className="modal-form">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Clinical Trial Protocol:</label>
                  <select value={formProtocol} onChange={(e) => setFormProtocol(e.target.value)}>
                    <option value="AIIA/CTU/2024/01">AIIA/CTU/2024/01 (Ashwagandha &amp; Guduchi Phase III)</option>
                    <option value="AIIA/CTU/2025/04">AIIA/CTU/2025/04 (Nisha Amalaki Phase IIb)</option>
                    <option value="AIIA/CTU/2026/02">AIIA/CTU/2026/02 (Adjuvant Rasayana Phase II)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Participant Subject ID:</label>
                  <input
                    type="text"
                    value={formSubjectId}
                    onChange={(e) => setFormSubjectId(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Reported Clinical Symptom (Verbatim):</label>
                <input
                  type="text"
                  placeholder="e.g. Acute severe bronchospasm following morning dose"
                  value={formTerm}
                  onChange={(e) => {
                    setFormTerm(e.target.value)
                    handleMedDraCode(e.target.value)
                  }}
                  required
                />
              </div>

              {/* Live MedDRA Hierarchy Preview */}
              <div className="meddra-live-pill-box">
                <span className="badge-tag">MedDRA Auto-Code:</span>
                <span><strong>PT:</strong> {codedResult.pt}</span>
                <span><strong>Code:</strong> <code>{codedResult.code}</code></span>
                <span><strong>SOC:</strong> {codedResult.soc}</span>
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label>Severity Grade:</label>
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
                  <label>Classification:</label>
                  <select
                    value={formIsSAE ? 'yes' : 'no'}
                    onChange={(e) => setFormIsSAE(e.target.value === 'yes')}
                  >
                    <option value="yes">Serious Adverse Event (SAE)</option>
                    <option value="no">Non-Serious Adverse Event (AE)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Statutory Reporting Clock:</label>
                  <select
                    value={formTimelineType}
                    onChange={(e) => setFormTimelineType(e.target.value as any)}
                  >
                    <option value="7-Day Expedited">7-Day Expedited (Fatal / Life Threatening)</option>
                    <option value="15-Day Serious Unexpected">15-Day Expedited (SUSAR)</option>
                    <option value="90-Day Periodic">90-Day Periodic Update</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Investigational Product Causality (WHO-UMC):</label>
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

              <div className="form-grid-2">
                <div className="form-group">
                  <label>De-challenge Response:</label>
                  <select value={formDechallenge} onChange={(e) => setFormDechallenge(e.target.value as any)}>
                    <option value="Positive">Positive (Reaction abated on stopping drug)</option>
                    <option value="Negative">Negative (Reaction continued)</option>
                    <option value="Not Done">Not Done</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Re-challenge Response:</label>
                  <select value={formRechallenge} onChange={(e) => setFormRechallenge(e.target.value as any)}>
                    <option value="Not Done">Not Done (Contraindicated)</option>
                    <option value="Positive">Positive (Reaction recurred)</option>
                    <option value="Negative">Negative (No recurrence)</option>
                  </select>
                </div>
              </div>

              {/* WHODrug Selector */}
              <div className="form-group">
                <label>Concomitant Medications (WHODrug Dictionaries):</label>
                <div className="meds-checkbox-grid">
                  {sampleWhoDrugDb.map((m) => (
                    <label key={m.name} className="med-check-item">
                      <input
                        type="checkbox"
                        checked={selectedMeds.includes(m.name)}
                        onChange={() => toggleMed(m.name)}
                      />
                      <span>{m.name} <small>({m.atc})</small></span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary-glow">
                  ✓ Log Adverse Event &amp; Initiate ALCOA+ Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: 21 CFR PART 11 ELECTRONIC SIGNATURE */}
      {signingEvent && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3>✍️ 21 CFR Part 11 Electronic Signature Approval</h3>
              <button type="button" className="close-x" onClick={() => setSigningEvent(null)}>✕</button>
            </div>

            <form onSubmit={handleConfirmESign} className="modal-form">
              <div className="esign-info-box">
                <div><strong>Event ID:</strong> {signingEvent.id}</div>
                <div><strong>Subject:</strong> {signingEvent.subjectId} ({signingEvent.protocolNumber})</div>
                <div><strong>Event Term:</strong> {signingEvent.eventTerm}</div>
                <div><strong>Statutory Target:</strong> CDSCO SUGAM &amp; Institutional Ethics Committee</div>
              </div>

              <div className="form-group">
                <label>Signer Username / Digital ID:</label>
                <input
                  type="text"
                  value={eSignUsername}
                  onChange={(e) => setESignUsername(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Signer Authorization Password:</label>
                <input
                  type="password"
                  placeholder="Enter secure password to e-sign"
                  value={eSignPassword}
                  onChange={(e) => setESignPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Meaning of Electronic Signature:</label>
                <input
                  type="text"
                  value={eSignReason}
                  onChange={(e) => setESignReason(e.target.value)}
                  required
                />
              </div>

              {eSignConfirmed && (
                <div className="esign-success-banner">
                  ✓ 21 CFR Part 11 Electronic Signature Applied &amp; Cryptographically Sealed!
                </div>
              )}

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setSigningEvent(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary-glow">
                  🔒 Apply Non-Repudiation Electronic Signature
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: INSPECT EVENT DETAILS */}
      {inspectingEvent && (
        <div className="modal-overlay">
          <div className="modal-dialog-large">
            <div className="modal-header">
              <h3>👁️ Clinical Safety Case Details ({inspectingEvent.id})</h3>
              <button type="button" className="close-x" onClick={() => setInspectingEvent(null)}>✕</button>
            </div>
            <div className="inspect-body">
              <div className="inspect-grid">
                <div><strong>Subject ID:</strong> {inspectingEvent.subjectId}</div>
                <div><strong>Protocol:</strong> {inspectingEvent.protocolNumber}</div>
                <div><strong>Site:</strong> {inspectingEvent.siteName}</div>
                <div><strong>Onset Date:</strong> {inspectingEvent.onsetDate}</div>
                <div><strong>Reported Date:</strong> {inspectingEvent.reportedDate}</div>
                <div><strong>Severity:</strong> {inspectingEvent.severity}</div>
                <div><strong>MedDRA PT:</strong> {inspectingEvent.meddra.pt} (Code: {inspectingEvent.meddra.code})</div>
                <div><strong>MedDRA SOC:</strong> {inspectingEvent.meddra.soc}</div>
                <div><strong>Causality:</strong> {inspectingEvent.causality}</div>
                <div><strong>Outcome:</strong> {inspectingEvent.outcome}</div>
              </div>
              <div className="concomitant-box">
                <strong>WHODrug Concomitant Medications:</strong>
                <ul>
                  {inspectingEvent.concomitantMeds.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-cancel" onClick={() => setInspectingEvent(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
