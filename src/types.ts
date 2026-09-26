export type Role =
  | 'PI'
  | 'Coordinator'
  | 'Monitor'
  | 'EC'
  | 'PV'
  | 'Admin'
  | 'Regulator';

export type DashboardPage = 'lifecycle' | 'kpis' | 'pv' | 'standards';

export type LifecycleStage =
  | 'Protocol'
  | 'IEC Approval'
  | 'CTRI Registration'
  | 'Site Activation'
  | 'Screening'
  | 'Enrolment'
  | 'Randomization'
  | 'Subject Visits'
  | 'Data Queries & SDV'
  | 'Milestones & Close-out';

export interface StudySite {
  id: string;
  name: string;
  location: string;
  piName: string;
  activationDate: string;
  status: 'Active' | 'Pending EC' | 'Initiating' | 'Closed';
  targetEnrolment: number;
  currentEnrolment: number;
  openQueries: number;
  lastMonitoringDate: string;
  nextMonitoringDue: string;
  isMonitoringOverdue: boolean;
}

export interface Study {
  id: string;
  protocolNumber: string;
  title: string;
  shortTitle: string;
  therapeuticArea: string; // e.g., 'Ayurveda / Integrative Medicine (AIIA)'
  phase: 'Phase I' | 'Phase II' | 'Phase III' | 'Phase IV' | 'Observational';
  currentStage: LifecycleStage;
  stageProgressPercent: number; // 0 - 100
  overallStatus: 'Active' | 'Recruiting' | 'Paused' | 'Close-out' | 'Regulatory Review';
  
  // Recruitment & Enrolment KPIs
  screeningTarget: number;
  screeningCurrent: number;
  enrolmentTarget: number;
  enrolmentCurrent: number;
  randomizedCurrent: number;
  enrolmentLagPercent: number; // Positive if lagging behind target schedule
  
  // Regulatory & Ethics
  iecApprovalNumber: string;
  iecApprovalDate: string;
  iecRenewalDue: string;
  isIecRenewalUrgent: boolean;
  ctriNumber: string;
  ctriSubmissionDate: string;
  ctriUpdateDue: string;
  isCtriUpdateOverdue: boolean;
  
  // Quality & Monitoring
  sites: StudySite[];
  totalOpenQueries: number;
  sdvCompletedPercent: number;
  protocolDeviationsCount: number;
  
  // Pharmacovigilance Link
  activeSAEsCount: number;
  pendingRegulatoryReports: number;
}

export interface AdverseEvent {
  id: string;
  studyId: string;
  protocolNumber: string;
  subjectId: string;
  siteName: string;
  eventTerm: string;
  onsetDate: string;
  reportedDate: string;
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Life-Threatening' | 'Fatal';
  isSAE: boolean;
  saeCriteria?: 'Death' | 'Life Threatening' | 'Hospitalization' | 'Disability' | 'Congenital Anomaly' | 'Medically Significant';
  
  // MedDRA Classification (LLT -> PT -> SOC)
  meddra: {
    llt: string;
    pt: string;
    soc: string;
    code: string;
  };
  
  // WHODrug Concomitant Medications
  concomitantMeds: string[];
  
  // Investigational Product (IP) Causality
  causality: 'Definite' | 'Probable' | 'Possible' | 'Unlikely' | 'Not Related';
  
  // Expedited Regulatory Reporting Timeline (7-Day / 15-Day / 90-Day Periodic)
  regulatoryReporting: {
    timelineType: '7-Day Expedited' | '15-Day Serious Unexpected' | '90-Day Periodic';
    submissionDeadline: string;
    daysRemaining: number;
    cdscoSubmissionStatus: 'Pending' | 'Drafted' | 'Submitted' | 'Acknowledged';
    ethicsCommitteeStatus: 'Pending' | 'Submitted' | 'Reviewed';
    dsmbNotified: boolean;
  };

  outcome: 'Recovered' | 'Recovering' | 'Not Recovered' | 'Fatal' | 'Unknown';
}

export interface Alert {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';
  category: 'Enrolment Lag' | 'Ethics & CTRI' | 'PV / SAE Reporting' | 'Monitoring Overdue' | 'Data Query SDV';
  studyId: string;
  studyCode: string;
  title: string;
  description: string;
  dueDate?: string;
  actionRequired: string;
  roleAudience: Role[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: Role;
  action: 'CREATE' | 'UPDATE' | 'ELECTRONIC_SIGNATURE' | 'EXPORT_SDTM' | 'CONSENT_VERIFY' | 'STATUS_CHANGE';
  entity: 'STUDY' | 'SUBJECT' | 'AE_SAE' | 'ETHICS_SUBMISSION' | 'MONITORING_REPORT' | 'CONSENT';
  entityId: string;
  details: string;
  ipAddress: string;
  alcoaHash: string; // SHA-256 cryptographically immutable representation
}

export interface DPDPRecord {
  subjectId: string;
  studyProtocol: string;
  abhaId: string;
  consentDate: string;
  consentVersion: string;
  consentStatus: 'Active' | 'Withdrawn' | 'Re-consent Needed';
  encryptionStatus: 'AES-256 (At-Rest & In-Transit)';
  dataResidency: 'MeitY-Empanelled Cloud (New Delhi / Mumbai Region)';
  rightToErasureRequest: boolean;
}
