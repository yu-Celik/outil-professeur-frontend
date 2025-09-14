classDiagram
  direction TB

  class Teacher {
    +Uuid id
    +String email
    +String language
    +DateTime createdAt
    +DateTime updatedAt
  }

  class NotationSystem {
    +Uuid id
    +Uuid createdBy
    +String name
    +String scaleType
    +Decimal minValue
    +Decimal maxValue
    +Json rules
    +DateTime createdAt
    +DateTime updatedAt
    +Boolean validateGrade(Decimal value)
    +Decimal convert(Decimal value, NotationSystem fromSystem)
    +String formatDisplay(Decimal value, String locale)
  }

  class AcademicStructure {
    +Uuid id
    +Uuid createdBy
    +String name
    +String periodModel
    +Integer periodsPerYear
    +Json periodNames
    +DateTime createdAt
    +DateTime updatedAt
  }

  class SchoolYear {
    +Uuid id
    +Uuid createdBy
    +String name
    +Date startDate
    +Date endDate
    +Boolean isActive
    +DateTime createdAt
    +DateTime updatedAt
    +AcademicPeriod createPeriod(String name, Date start, Date end, Integer order)
  }

  class AcademicPeriod {
    +Uuid id
    +Uuid createdBy
    +Uuid schoolYearId
    +String name
    +Integer order
    +Date startDate
    +Date endDate
    +Boolean isActive
    +DateTime createdAt
    +DateTime updatedAt
    +Boolean contains(Date d)
  }

  class Class {
    +Uuid id
    +Uuid createdBy
    +String classCode
    +String gradeLabel
    +Uuid schoolYearId
    +DateTime createdAt
    +DateTime updatedAt
    +Void assignStudent(Uuid studentId)
    +Void transferStudent(Uuid studentId, Uuid toClassId)
    +List~Student~ getStudents()
    +List~CourseSession~ getSessions()
    +List~Exam~ getExams()
  }

  class Subject {
    +Uuid id
    +Uuid createdBy
    +String name
    +String code
    +String description
    +DateTime createdAt
    +DateTime updatedAt
  }

  class Student {
    +Uuid id
    +Uuid createdBy
    +String firstName
    +String lastName
    +Uuid currentClassId
    +Text[] needs
    +Text[] observations
    +Text[] strengths
    +Text[] improvementAxes
    +DateTime createdAt
    +DateTime updatedAt
    +String fullName()
    +Decimal attendanceRate(Date start, Date end)
    +Decimal participationAverage(Date start, Date end)
  }

  class TimeSlot {
    +Uuid id
    +Uuid createdBy
    +String name
    +String startTime  <<HH:mm>>
    +String endTime    <<HH:mm>>
    +Integer durationMinutes
    +Integer displayOrder
    +Boolean isBreak
    +DateTime createdAt
    +DateTime updatedAt
    +Boolean overlaps(TimeSlot other)
    +Integer getDuration()
  }

  class CourseSession {
    +Uuid id
    +Uuid createdBy
    +Uuid classId
    +Uuid subjectId
    +Uuid timeSlotId
    +Date sessionDate
    +String status  // planned|in_progress|done|cancelled
    +String objectives  <<nullable>>
    +String content     <<nullable>>
    +String homeworkAssigned <<nullable>>
    +Boolean isMakeup
    +Boolean isMoved
    +String notes       <<nullable>>
    +DateTime createdAt
    +DateTime updatedAt
    +Void reschedule(Date newDate)
    +Void takeAttendance()
    +String summary()
  }

  class StudentParticipation {
    +Uuid id
    +Uuid createdBy
    +Uuid courseSessionId
    +Uuid studentId
    +Boolean isPresent
    +String behavior
    +Integer participationLevel
    +Boolean homeworkDone
    +String specificRemarks
    +String technicalIssues
    +Boolean cameraEnabled
    +DateTime markedAt
    +Void markAttendance(Boolean isPresent)
    +Void setParticipationLevel(Integer level)
    +Void addRemarks(String remarks)
    +Void updateBehavior(String behavior)
  }

    class WeeklyTemplate {
    +Uuid id
    +Uuid teacherId
    +Int dayOfWeek
    +Uuid timeSlotId
    +Uuid classId
    +Uuid subjectId
    +Uuid schoolYearId
    +Boolean isActive
  }

 class Exam {
    +Uuid id
    +Uuid createdBy
    +String title
    +String description
    +Uuid classId
    +Uuid subjectId
    +Uuid academicPeriodId
    +Uuid notationSystemId   %% <--- nouveau
    +Date examDate
    +String examType
    +Integer durationMinutes
    +Decimal totalPoints
    +Decimal coefficient
    +String instructions
    +Boolean isPublished
    +DateTime createdAt
    +DateTime updatedAt
    +Void publish()
    +Void unpublish()
    +Json calculateStatistics()
    +StudentExamResult addResult(Uuid studentId, Decimal points)
  }

  class StudentExamResult {
    +Uuid id
    +Uuid createdBy
    +Uuid examId
    +Uuid studentId
    +Decimal pointsObtained
    +Decimal grade
    +String gradeDisplay
    +Boolean isAbsent
    +String comments
    +DateTime markedAt
    +Boolean isPassing(NotationSystem system)
    +String gradeCategory(NotationSystem system)
    +Decimal percentage(Decimal examTotalPoints)
    +Void updateDisplay(NotationSystem system, String locale)
  }

  class StudentProfile {
    +Uuid id
    +Uuid createdBy
    +Uuid studentId
    +Uuid academicPeriodId
    +Json features
    +Json evidenceRefs
    +String status
    +DateTime generatedAt
    +DateTime updatedAt
    +Void review(String notes)
  }

  class StyleGuide {
    +Uuid id
    +Uuid createdBy
    +String name
    +String tone
    +String register
    +String length
    +String person
    +String variability
    +String[] bannedPhrases
    +String[] preferredPhrases
    +DateTime createdAt
    +DateTime updatedAt
  }

  class PhraseBank {
    +Uuid id
    +Uuid createdBy
    +String scope
    +Uuid subjectId
    +Json entries
    +DateTime createdAt
    +DateTime updatedAt
  }

  class Rubric {
    +Uuid id
    +Uuid createdBy
    +String name
    +Json sections
    +Json constraints
    +DateTime createdAt
    +DateTime updatedAt
  }

  class AppreciationContent {
    +Uuid id
    +Uuid createdBy
    +Uuid studentId
    +Uuid subjectId    <<optional>>
    +Uuid academicPeriodId <<optional>>
    +Uuid schoolYearId <<optional>>
    +Uuid styleGuideId
    +Uuid phraseBankId <<optional>>
    +Uuid rubricId     <<optional>>
    +String contentKind
    +String scope
    +String audience
    +String generationTrigger
    +Text content
    +Json inputData
    +Json generationParams
    +String language
    +String status
    +Boolean isFavorite
    +Integer reuseCount
    +DateTime generatedAt
    +DateTime updatedAt
    +String exportAs(String format)
    +Void updateContent(Text newText)
    +Void markAsFavorite()
    +Void unmarkFavorite()
    +Void incrementReuseCount()
    +Boolean canBeReused()
    +AppreciationContent regenerate(Json params)
  }

  class TeachingAssignment {
    +Uuid id
    +Uuid createdBy
    +Uuid userId
    +Uuid classId
    +Uuid subjectId
    +Uuid schoolYearId
    +String role
    +Boolean isActive
    +DateTime createdAt
    +DateTime updatedAt
  }

  class UserPreferences {
    +Uuid id
    +Uuid userId
    +Uuid schoolYearId
    +Json preferences
    +DateTime createdAt
    +DateTime updatedAt
    +Void updateClassColor(String classId, String colorHex)
    +String getClassColor(String classId)
    +Void resetToDefaults()
    +Json exportPreferences()
    +Void importPreferences(Json data)
  }

%% ==========================
%% Relations principales
%% ==========================

Teacher "1" o-- "*" Class : owns
Teacher "1" o-- "*" Subject : owns
Teacher "1" o-- "*" Student : owns
Teacher "1" o-- "*" TimeSlot : owns
Teacher "1" o-- "*" SchoolYear : owns
Teacher "1" o-- "*" AcademicPeriod : owns
Teacher "1" o-- "*" NotationSystem : owns
Teacher "1" o-- "*" AcademicStructure : owns
Teacher "1" o-- "*" CourseSession : owns
Teacher "1" o-- "*" Exam : owns
Teacher "1" o-- "*" StudentExamResult : owns
Teacher "1" o-- "*" StudentParticipation : owns
Teacher "1" o-- "*" StudentProfile : owns
Teacher "1" o-- "*" StyleGuide : owns
Teacher "1" o-- "*" PhraseBank : owns
Teacher "1" o-- "*" Rubric : owns
Teacher "1" o-- "*" AppreciationContent : owns
Teacher "1" o-- "*" TeachingAssignment : owns
Teacher "1" o-- "*" UserPreferences : owns
Teacher "1" o-- "*" WeeklyTemplate : owns

SchoolYear "1" -- "*" WeeklyTemplate : has
SchoolYear "1" -- "*" AcademicPeriod : has

Class "1" -- "1" SchoolYear : belongsTo
Class "1" -- "*" Student : contains
Class "1" -- "*" CourseSession : schedules
Class "1" -- "*" Exam : has

CourseSession "1" -- "1" TimeSlot : at
CourseSession "1" -- "1" Subject : teaches
CourseSession "1" -- "*" StudentParticipation : records
CourseSession ..> SchoolYear : occursIn (by sessionDate)

WeeklyTemplate "*" -- "1" TimeSlot : at
WeeklyTemplate "*" -- "1" Subject : teaches
WeeklyTemplate "*" -- "1" Class : for

Student "1" -- "*" StudentParticipation : attends
Student "1" -- "*" StudentExamResult : gradedIn
Student "1" -- "*" StudentProfile : profiledFor

Subject "1" -- "*" Exam : evaluatedBy

AcademicPeriod "1" -- "*" Exam : scheduledIn
AcademicPeriod "1" -- "*" StudentProfile : scopedIn

Exam "*" -- "1" NotationSystem : uses
Exam "1" -- "*" StudentExamResult : results

NotationSystem "1" -- "*" StudentExamResult : formats

AppreciationContent "*" --> "0..1" Subject : about
AppreciationContent "*" --> "0..1" AcademicPeriod : periodOf
AppreciationContent "*" --> "0..1" SchoolYear : yearOf
AppreciationContent "*" --> "1" StyleGuide : uses
AppreciationContent "*" --> "0..1" PhraseBank : varies
AppreciationContent "*" --> "0..1" Rubric : shapes

%% TeachingAssignment relations
TeachingAssignment "*" -- "1" Teacher : assignedTo
TeachingAssignment "*" -- "1" Class : for
TeachingAssignment "*" -- "1" Subject : teaches
TeachingAssignment "*" -- "1" SchoolYear : scopedTo
