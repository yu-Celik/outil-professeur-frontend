export { BehavioralAnalysisService } from "./behavioral-analysis-service";
export { AcademicAnalysisService } from "./academic-analysis-service";
export { StudentProfileService } from "./student-profile-service";
export { StudentAlertsService } from "./student-alerts-service";

export type {
  BehavioralFeatures,
  BehavioralTrends,
  BehavioralAlert,
  Recommendation,
} from "./behavioral-analysis-service";
export type {
  SubjectPerformances,
  AcademicProgress,
  AcademicRisk,
} from "./academic-analysis-service";
export type {
  StudentProfileFeatures,
  StudentProfileEvidenceRefs,
  ProfileGenerationParams,
} from "./student-profile-service";
export type {
  StudentAlert,
  StudentAlertMetrics,
  StudentAlertSeverity,
  StudentAlertType,
  StudentAlertsResult,
} from "./student-alerts-service";
