// Types TypeScript basés exactement sur le diagramme UML

export interface Teacher {
  id: string;
  email: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotationSystem {
  id: string;
  createdBy: string;
  name: string;
  scaleType: string;
  minValue: number;
  maxValue: number;
  rules: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  validateGrade(value: number): boolean;
  convert(value: number, fromSystem: NotationSystem): number;
  formatDisplay(value: number, locale: string): string;
}

export interface AcademicStructure {
  id: string;
  createdBy: string;
  name: string;
  periodModel: string;
  periodsPerYear: number;
  periodNames: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface SchoolYear {
  id: string;
  createdBy: string;
  name: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createPeriod(
    name: string,
    start: Date,
    end: Date,
    order: number,
  ): AcademicPeriod;
}

export interface AcademicPeriod {
  id: string;
  createdBy: string;
  schoolYearId: string;
  name: string;
  order: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  contains(date: Date): boolean;
}

export interface Class {
  id: string;
  createdBy: string;
  classCode: string;
  gradeLabel: string;
  schoolYearId: string;
  createdAt: Date;
  updatedAt: Date;
  assignStudent(studentId: string): void;
  transferStudent(studentId: string, toClassId: string): void;
  getStudents(): Student[];
  getSessions(): CourseSession[];
  getExams(): Exam[];
}

export interface Subject {
  id: string;
  createdBy: string;
  name: string;
  code: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Student {
  id: string;
  createdBy: string;
  firstName: string;
  lastName: string;
  currentClassId: string;
  needs: string[];
  observations: string[];
  strengths: string[];
  improvementAxes: string[];
  createdAt: Date;
  updatedAt: Date;
  fullName(): string;
  attendanceRate(start: Date, end: Date): number;
  participationAverage(start: Date, end: Date): number;
}

export interface TimeSlot {
  id: string;
  createdBy: string;
  name: string;
  startTime: string; // Format: "HH:mm"
  endTime: string;
  durationMinutes: number;
  displayOrder: number;
  isBreak: boolean;
  createdAt: Date;
  updatedAt: Date;
  overlaps(other: TimeSlot): boolean;
  getDuration(): number;
}

export interface CourseSession {
  id: string;
  createdBy: string;
  classId: string;
  subjectId: string;
  timeSlotId: string;
  sessionDate: Date;
  room: string;
  status: string;
  objectives: string;
  content: string;
  homeworkAssigned: string;
  notes: string;
  attendanceTaken: boolean;
  createdAt: Date;
  updatedAt: Date;
  reschedule(newDate: Date): void;
  takeAttendance(): void;
  summary(): string;
}

export interface StudentParticipation {
  id: string;
  createdBy: string;
  courseSessionId: string;
  studentId: string;
  isPresent: boolean;
  behavior: string;
  participationLevel: number;
  specificRemarks: string;
  technicalIssues: string;
  cameraEnabled: boolean;
  markedAt: Date;
  markAttendance(isPresent: boolean): void;
  setParticipationLevel(level: number): void;
  addRemarks(remarks: string): void;
  updateBehavior(behavior: string): void;
}

export interface Exam {
  id: string;
  createdBy: string;
  title: string;
  description: string;
  classId: string;
  subjectId: string;
  academicPeriodId: string;
  examDate: Date;
  examType: string;
  durationMinutes: number;
  totalPoints: number;
  notationType: string;
  coefficient: number;
  instructions: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  publish(): void;
  unpublish(): void;
  calculateStatistics(): Record<string, unknown>;
  addResult(studentId: string, points: number): StudentExamResult;
}

export interface StudentExamResult {
  id: string;
  createdBy: string;
  examId: string;
  studentId: string;
  pointsObtained: number;
  grade: number;
  gradeDisplay: string;
  isAbsent: boolean;
  comments: string;
  markedAt: Date;
  isPassing(system: NotationSystem): boolean;
  gradeCategory(system: NotationSystem): string;
  percentage(examTotalPoints: number): number;
  updateDisplay(system: NotationSystem, locale: string): void;
}

export interface StudentProfile {
  id: string;
  createdBy: string;
  studentId: string;
  academicPeriodId: string;
  features: Record<string, unknown>;
  evidenceRefs: Record<string, unknown>;
  status: string;
  generatedAt: Date;
  updatedAt: Date;
  review(notes: string): void;
}

export interface StudentProfileStatic {
  generate(studentId: string, periodId: string): StudentProfile;
}

export interface TeachingAssignment {
  id: string;
  createdBy: string;
  userId: string;
  classId: string;
  subjectId: string;
  schoolYearId: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StyleGuide {
  id: string;
  createdBy: string;
  name: string;
  tone: string;
  register: string;
  length: string;
  person: string;
  variability: string;
  bannedPhrases: string[];
  preferredPhrases: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PhraseBank {
  id: string;
  createdBy: string;
  scope: string;
  subjectId: string;
  entries: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Rubric {
  id: string;
  createdBy: string;
  name: string;
  sections: Record<string, unknown>;
  constraints: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppreciationContent {
  id: string;
  createdBy: string;
  studentId: string;
  subjectId?: string;
  academicPeriodId?: string;
  schoolYearId?: string;
  styleGuideId: string;
  phraseBankId?: string;
  rubricId?: string;
  contentKind: string;
  scope: string;
  audience: string;
  generationTrigger: string;
  content: string;
  inputData: Record<string, unknown>;
  generationParams: Record<string, unknown>;
  language: string;
  status: string;
  isFavorite: boolean;
  reuseCount: number;
  generatedAt: Date;
  updatedAt: Date;
  exportAs(format: string): string;
  updateContent(newText: string): void;
  markAsFavorite(): void;
  unmarkFavorite(): void;
  incrementReuseCount(): void;
  canBeReused(): boolean;
  regenerate(params: Record<string, unknown>): AppreciationContent;
}

// Types pour UserPreferences
type ColorHex = `#${string}`;
type CalendarView = "month" | "week"; // extensible plus tard

export interface UserPreferences {
  id: string;
  userId: string; // ex-createdBy
  schoolYearId: string; // portée par année scolaire
  preferences: {
    version: number; // pour migrations futures
    classColors: Record<string, ColorHex>; // classId -> #RRGGBB
    calendarDefaultView: CalendarView;
    autoAssignColors: boolean;
    contrastMode: "auto" | "high" | "off";
    colorPalette: readonly ColorHex[];
    notificationSettings?: Record<string, unknown>;
    displaySettings?: Record<string, unknown>;
  };
  createdAt: Date;
  updatedAt: Date;
  updateClassColor(classId: string, color: ColorHex): void;
  getClassColor(classId: string): ColorHex | null;
  resetToDefaults(): void;
  exportPreferences(): Record<string, unknown>;
  importPreferences(data: Record<string, unknown>): void;
}

// Relations UML (pour référence)
export interface UMLRelations {
  // Teacher owns everything
  teacher_classes: Teacher & { classes: Class[] };
  teacher_subjects: Teacher & { subjects: Subject[] };
  teacher_students: Teacher & { students: Student[] };

  // Class relationships
  class_students: Class & { students: Student[] };
  class_sessions: Class & { courseSessions: CourseSession[] };
  class_exams: Class & { exams: Exam[] };

  // CourseSession relationships
  courseSession_timeSlot: CourseSession & { timeSlot: TimeSlot };
  courseSession_subject: CourseSession & { subject: Subject };
  courseSession_participations: CourseSession & {
    participations: StudentParticipation[];
  };

  // Student relationships
  student_participations: Student & { participations: StudentParticipation[] };
  student_examResults: Student & { examResults: StudentExamResult[] };
  student_profiles: Student & { profiles: StudentProfile[] };

  // TeachingAssignment authorizations
  teachingAssignment_class: TeachingAssignment & { class: Class };
  teachingAssignment_subject: TeachingAssignment & { subject: Subject };
  teachingAssignment_schoolYear: TeachingAssignment & {
    schoolYear: SchoolYear;
  };

  // UserPreferences relationship
  teacher_preferences: Teacher & { preferences: UserPreferences };
}
