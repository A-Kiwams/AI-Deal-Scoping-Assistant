export type SessionStatus = "Draft" | "In Review" | "Completed";

export type CloudPlatform = "AWS" | "Azure" | "GCP" | "Undecided";

export type RequirementOrigin = "Customer-stated" | "AI-inferred" | "Assumed";

export type RequirementType =
  | "BR"
  | "FR"
  | "NFR"
  | "INT"
  | "DATA"
  | "SEC"
  | "CONSTRAINT"
  | "DEPENDENCY";

export type RequirementPriority = "High" | "Medium" | "Low" | "Unassigned";

export type AnalysisProvider = "mock" | "live";

export type AnalysisStatus =
  | "Not Started"
  | "Analyzing"
  | "Analyzed"
  | "Failed";

export interface CustomerContext {
  customerName: string;
  opportunityName: string;
  industry: string;
  description: string;
}

export interface SourceReference {
  sourceId: string;
  text: string;
  section?: string;
  lineStart?: number;
  lineEnd?: number;
}

export interface ScopeRequirement {
  id: string;
  type: RequirementType;
  description: string;
  priority: RequirementPriority;
  origin: RequirementOrigin;
  sourceReferences: SourceReference[];
  dependencies: string[];
  openQuestions: string[];
}

export interface ScopeAssumption {
  id: string;
  description: string;
  reason: string;
  status: "Needs Review" | "Accepted" | "Rejected";
  relatedRequirementIds: string[];
}

export interface ClarificationQuestion {
  id: string;
  question: string;
  reason: string;
  relatedRequirementIds: string[];
  priority: "High" | "Medium" | "Low";
  status: "Open" | "Answered";
}

export interface ScopeModel {
  requirements: ScopeRequirement[];
  assumptions: ScopeAssumption[];
  clarificationQuestions: ClarificationQuestion[];
  analyzedAt: string;
  provider: AnalysisProvider;
}

export interface ScopingSession {
  id: string;
  name: string;
  customerName: string;
  status: SessionStatus;
  updatedAt: string;

  customerContext: CustomerContext;
  preferredCloud: CloudPlatform;
  rawRequirements: string;
  sourceType: "text" | "markdown" | "rfp" | "discovery-notes";

  analysisStatus: AnalysisStatus;
  scopeModel?: ScopeModel;
  functionalScope?: FunctionalScopeModel;
  architectureModel?: ArchitectureModel;
  dataAISolution?: DataAISolutionModel;
  estimationModel?: EstimationModel;
  qualityGate?: QualityGateModel;

  changeHistory?: ScopeChange[];
  lastChangeImpact?: ChangeImpactAnalysis;

  outputVersions?: OutputVersion[];
  outputFreshness?: OutputFreshness[];
}

export type ScopeItemOrigin =
  | "Customer-requested"
  | "AI-recommended"
  | "Assumed"
  | "Out-of-scope";

export interface ScopeCapability {
  id: string;
  name: string;
  description: string;
  origin: ScopeItemOrigin;
  requirementIds: string[];
}

export interface ScopeModule {
  id: string;
  name: string;
  description: string;
  capabilityIds: string[];
  requirementIds: string[];
}

export interface ScopeWorkstream {
  id: string;
  name: string;
  description: string;
  moduleIds: string[];
  requirementIds: string[];
}

export interface DeliveryPackage {
  id: string;
  name: string;
  description: string;
  workstreamIds: string[];
  requirementIds: string[];
}

export interface OutOfScopeItem {
  id: string;
  description: string;
  reason: string;
  relatedRequirementIds: string[];
}

export interface FunctionalScopeModel {
  capabilities: ScopeCapability[];
  modules: ScopeModule[];
  workstreams: ScopeWorkstream[];
  deliveryPackages: DeliveryPackage[];
  outOfScopeItems: OutOfScopeItem[];
  generatedAt: string;
  provider: AnalysisProvider;
}

export type ArchitectureComponentType =
  | "Frontend"
  | "Backend"
  | "Database"
  | "Integration"
  | "Security"
  | "Messaging"
  | "Monitoring"
  | "Storage";

export interface ArchitectureComponent {
  id: string;
  name: string;
  type: ArchitectureComponentType;
  description: string;
  cloudService: string;
  rationale: string;
  tradeoffs: string[];
  requirementIds: string[];
}

export interface ArchitectureConnection {
  id: string;
  sourceComponentId: string;
  targetComponentId: string;
  label: string;
}

export interface ArchitectureModel {
  cloudPlatform: CloudPlatform;
  components: ArchitectureComponent[];
  connections: ArchitectureConnection[];
  assumptions: string[];
  generatedAt: string;
  provider: AnalysisProvider;
}

export type DataClassification =
  | "Public"
  | "Internal"
  | "Confidential"
  | "Restricted";

export type ProcessingType =
  | "Deterministic"
  | "AI-assisted"
  | "AI-generated"
  | "Human decision";

export interface DataEntity {
  id: string;
  name: string;
  description: string;
  source: string;
  classification: DataClassification;
  retentionNotes: string;
  requirementIds: string[];
}

export interface DataFlow {
  id: string;
  name: string;
  source: string;
  destination: string;
  description: string;
  dataTransferred: string[];
  securityConsiderations: string[];
  requirementIds: string[];
}

export interface IntegrationConsideration {
  id: string;
  systemName: string;
  purpose: string;
  integrationMethod: string;
  status: "Confirmed" | "To be confirmed" | "Assumed";
  openQuestions: string[];
  requirementIds: string[];
}

export interface AIDecisionPoint {
  id: string;
  name: string;
  description: string;
  processingType: ProcessingType;
  proposedTechnology: string;
  rationale: string;
  humanApprovalRequired: boolean;
  requirementIds: string[];
}

export interface ResponsibleAIItem {
  id: string;
  category:
    | "Privacy"
    | "Security"
    | "Fairness"
    | "Transparency"
    | "Reliability"
    | "Human oversight";
  consideration: string;
  proposedControl: string;
  priority: "High" | "Medium" | "Low";
}

export interface AIEvaluationCriterion {
  id: string;
  name: string;
  description: string;
  measurementApproach: string;
  target: string;
}

export interface DataAISolutionModel {
  dataEntities: DataEntity[];
  dataFlows: DataFlow[];
  integrations: IntegrationConsideration[];
  aiDecisionPoints: AIDecisionPoint[];
  responsibleAIItems: ResponsibleAIItem[];
  evaluationCriteria: AIEvaluationCriterion[];
  assumptions: string[];
  generatedAt: string;
  provider: AnalysisProvider;
}

export type EstimateConfidence = "Low" | "Medium" | "High";

export type EstimateRole =
  | "Solution Architect"
  | "Frontend Developer"
  | "Backend Developer"
  | "Integration Developer"
  | "Data Engineer"
  | "AI Engineer"
  | "QA Engineer"
  | "DevOps Engineer"
  | "Project Manager";

export interface EstimateLineItem {
  id: string;
  workstreamId: string;
  workstreamName: string;
  description: string;
  role: EstimateRole;
  effortHours: number;
  hourlyRate: number;
  subtotal: number;
  requirementIds: string[];
  assumptions: string[];
}

export interface TimelinePhase {
  id: string;
  name: string;
  description: string;
  durationWeeks: number;
  dependencies: string[];
  workstreamIds: string[];
}

export interface EstimateAssumption {
  id: string;
  description: string;
  impact: string;
  confirmed: boolean;
}

export interface EstimationModel {
  currency: string;
  lineItems: EstimateLineItem[];
  timelinePhases: TimelinePhase[];
  assumptions: EstimateAssumption[];
  contingencyPercentage: number;
  subtotal: number;
  contingencyAmount: number;
  totalEstimate: number;
  totalHours: number;
  estimatedDurationWeeks: number;
  confidence: EstimateConfidence;
  limitations: string[];
  generatedAt: string;
  provider: AnalysisProvider;
}

export type QualityCheckSeverity = "Error" | "Warning" | "Info";

export type QualityCheckStatus = "Passed" | "Failed" | "Needs Review";

export interface QualityCheckResult {
  id: string;
  category:
    | "Requirements"
    | "Traceability"
    | "Architecture"
    | "Data & AI"
    | "Estimation"
    | "Assumptions"
    | "Consistency";
  title: string;
  description: string;
  severity: QualityCheckSeverity;
  status: QualityCheckStatus;
  relatedIds: string[];
  recommendation: string;
}

export interface QualityGateSummary {
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  warningChecks: number;
  overallStatus: "Passed" | "Passed with Warnings" | "Blocked";
}

export interface QualityGateModel {
  results: QualityCheckResult[];
  summary: QualityGateSummary;
  generatedAt: string;
  provider: AnalysisProvider;
}

export type ChangeType =
  | "Requirement"
  | "Assumption"
  | "Cloud Configuration"
  | "Scope Configuration";

export type ImpactLevel = "High" | "Medium" | "Low" | "None";

export type OutputArea =
  | "Requirements"
  | "Functional Scope"
  | "Architecture"
  | "Data & AI"
  | "Estimation"
  | "Quality Gate";

export interface ScopeChange {
  id: string;
  changeType: ChangeType;
  title: string;
  description: string;
  relatedRequirementIds: string[];
  createdAt: string;
}

export interface ChangeImpact {
  id: string;
  outputArea: OutputArea;
  impactLevel: ImpactLevel;
  reason: string;
  affectedIds: string[];
  recommendedAction: string;
  requiresRegeneration: boolean;
}

export interface ChangeImpactAnalysis {
  change: ScopeChange;
  impacts: ChangeImpact[];
  generatedAt: string;
  provider: AnalysisProvider;
}

export type VersionedOutputArea =
  | "Requirements"
  | "Functional Scope"
  | "Architecture"
  | "Data & AI"
  | "Estimation"
  | "Quality Gate";

export interface OutputVersion {
  id: string;
  outputArea: VersionedOutputArea;
  versionNumber: number;
  title: string;
  snapshot: unknown;
  createdAt: string;
  createdBy: AnalysisProvider;
  basedOnChangeId?: string;
  isCurrent: boolean;
}

export interface OutputFreshness {
  outputArea: VersionedOutputArea;
  status: "Current" | "Outdated" | "Not Generated";
  lastGeneratedAt?: string;
  outdatedReason?: string;
  relatedChangeIds: string[];
}
