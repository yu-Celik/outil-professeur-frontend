import type { AppreciationContent } from "@/types/uml-entities";

export const MOCK_APPRECIATION_CONTENT: AppreciationContent[] = [
  {
    id: "appreciation-student-1-anglais-t1",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    studentId: "student-1A-1",
    subjectId: "subject-anglais",
    academicPeriodId: "period-trimester-1",
    schoolYearId: "year-2025",
    styleGuideId: "style-guide-bienveillant",
    phraseBankId: "phrase-bank-anglais-general",
    rubricId: undefined,
    contentKind: "bulletin",
    scope: "trimester",
    audience: "parents",
    generationTrigger: "manual",
    content:
      "Emma montre un réel investissement en anglais ce trimestre. Elle participe activement aux discussions en classe et s'exprime avec une confiance croissante malgré quelques hésitations. Sa compréhension des documents audio s'améliore notablement, et elle identifie désormais les informations essentielles sans difficulté. À l'écrit, Emma utilise un vocabulaire de plus en plus varié, même si elle gagnerait à consolider certaines structures grammaticales. Ses efforts portent leurs fruits et les progrès sont encourageants. Pour le prochain trimestre, Emma pourrait enrichir son vocabulaire actif et développer davantage sa fluidité à l'oral. Continue sur cette voie prometteuse !",
    inputData: {
      studentName: "Emma Martin",
      participationLevel: 8.2,
      averageGrade: 14.5,
      attendanceRate: 95,
      strengths: [
        "oral participation",
        "listening comprehension",
        "vocabulary",
      ],
      improvementAreas: ["grammar", "fluency", "written expression"],
      behaviorNotes: ["active", "motivated", "helpful"],
    },
    generationParams: {
      tone: "bienveillant",
      length: "long",
      person: "troisieme",
      includeStrengths: true,
      includeImprovements: true,
      includeEncouragement: true,
      focusAreas: ["participation", "comprehension", "expression"],
    },
    language: "fr",
    status: "validated",
    isFavorite: true,
    reuseCount: 2,
    generatedAt: new Date("2025-11-15T14:30:00"),
    updatedAt: new Date("2025-11-16T09:15:00"),
    exportAs: (format: string) => {
      switch (format) {
        case "pdf":
          return "PDF export content...";
        case "word":
          return "Word export content...";
        default:
          return "Plain text export...";
      }
    },
    updateContent: function (newText: string) {
      this.content = newText;
      this.updatedAt = new Date();
    },
    markAsFavorite: function () {
      this.isFavorite = true;
      this.updatedAt = new Date();
    },
    unmarkFavorite: function () {
      this.isFavorite = false;
      this.updatedAt = new Date();
    },
    incrementReuseCount: function () {
      this.reuseCount++;
      this.updatedAt = new Date();
    },
    canBeReused: function () {
      return this.status === "validated" && this.isFavorite;
    },
    regenerate: function (params: Record<string, unknown>) {
      return {
        ...this,
        id: `${this.id}-regenerated-${Date.now()}`,
        generationParams: { ...this.generationParams, ...params },
        generatedAt: new Date(),
        status: "draft",
        reuseCount: 0,
      } as AppreciationContent;
    },
  },
  {
    id: "appreciation-student-2-etlv-t1",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    studentId: "student-1A-2",
    subjectId: "subject-etlv",
    academicPeriodId: "period-trimester-1",
    schoolYearId: "year-2025",
    styleGuideId: "style-guide-professionnel",
    phraseBankId: "phrase-bank-etlv-general",
    rubricId: undefined,
    contentKind: "bulletin",
    scope: "trimester",
    audience: "parents",
    generationTrigger: "automatic",
    content:
      "Lucas démontre une excellente maîtrise du vocabulaire technique spécialisé en ETLV. Il établit des liens pertinents entre les concepts technologiques et leur expression en anglais, faisant preuve d'une solide culture dans le domaine. Lucas analyse avec précision les documents techniques proposés et utilise appropriément la terminologie professionnelle. Ses présentations orales sont bien structurées et témoignent d'une méthodologie rigoureuse. Il travaille efficacement en équipe sur les projets collaboratifs et contribue de manière constructive aux débats. Lucas pourrait approfondir certaines notions technologiques pour gagner en expertise. La progression est constante et les résultats obtenus reflètent un investissement sérieux dans cette matière exigeante.",
    inputData: {
      studentName: "Lucas Dubois",
      participationLevel: 9.1,
      averageGrade: 16.8,
      attendanceRate: 98,
      strengths: ["technical vocabulary", "presentations", "teamwork"],
      improvementAreas: ["technical depth", "argumentation"],
      behaviorNotes: ["rigorous", "collaborative", "analytical"],
    },
    generationParams: {
      tone: "professionnel",
      length: "moyen",
      person: "troisieme",
      includeStrengths: true,
      includeImprovements: true,
      includeEncouragement: true,
      focusAreas: ["technicalSkills", "methodology", "collaboration"],
    },
    language: "fr",
    status: "validated",
    isFavorite: false,
    reuseCount: 0,
    generatedAt: new Date("2025-11-20T10:45:00"),
    updatedAt: new Date("2025-11-20T10:45:00"),
    exportAs: (format: string) => {
      switch (format) {
        case "pdf":
          return "PDF export content...";
        case "word":
          return "Word export content...";
        default:
          return "Plain text export...";
      }
    },
    updateContent: function (newText: string) {
      this.content = newText;
      this.updatedAt = new Date();
    },
    markAsFavorite: function () {
      this.isFavorite = true;
      this.updatedAt = new Date();
    },
    unmarkFavorite: function () {
      this.isFavorite = false;
      this.updatedAt = new Date();
    },
    incrementReuseCount: function () {
      this.reuseCount++;
      this.updatedAt = new Date();
    },
    canBeReused: function () {
      return this.status === "validated" && this.isFavorite;
    },
    regenerate: function (params: Record<string, unknown>) {
      return {
        ...this,
        id: `${this.id}-regenerated-${Date.now()}`,
        generationParams: { ...this.generationParams, ...params },
        generatedAt: new Date(),
        status: "draft",
        reuseCount: 0,
      } as AppreciationContent;
    },
  },
  {
    id: "appreciation-student-3-anglais-draft",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    studentId: "student-1A-3",
    subjectId: "subject-anglais",
    academicPeriodId: "period-trimester-1",
    schoolYearId: "year-2025",
    styleGuideId: "style-guide-constructif",
    phraseBankId: "phrase-bank-anglais-general",
    rubricId: undefined,
    contentKind: "bulletin",
    scope: "trimester",
    audience: "parents",
    generationTrigger: "manual",
    content:
      "Léa montre une progression encourageante en anglais ce trimestre. Elle peut améliorer sa participation orale en prenant davantage la parole spontanément. Sa compréhension des documents écrits est correcte, mais elle gagnerait à développer ses stratégies d'analyse. Les productions écrites révèlent une bonne maîtrise des structures de base, néanmoins il serait bénéfique d'enrichir le vocabulaire actif. Léa pourrait développer sa confiance en expression orale par une pratique plus régulière. Les prochains objectifs incluent la consolidation des acquis grammaticaux et l'amélioration de la fluidité. Avec plus d'investissement personnel, les résultats ne peuvent que s'améliorer.",
    inputData: {
      studentName: "Léa Bernard",
      participationLevel: 6.5,
      averageGrade: 11.8,
      attendanceRate: 92,
      strengths: ["written comprehension", "basic grammar"],
      improvementAreas: ["oral participation", "vocabulary", "confidence"],
      behaviorNotes: ["reserved", "careful", "needs encouragement"],
    },
    generationParams: {
      tone: "constructif",
      length: "moyen",
      person: "troisieme",
      includeStrengths: true,
      includeImprovements: true,
      includeEncouragement: true,
      focusAreas: ["participation", "comprehension", "expression"],
    },
    language: "fr",
    status: "draft",
    isFavorite: false,
    reuseCount: 0,
    generatedAt: new Date("2025-11-25T16:20:00"),
    updatedAt: new Date("2025-11-25T16:35:00"),
    exportAs: (format: string) => {
      switch (format) {
        case "pdf":
          return "PDF export content...";
        case "word":
          return "Word export content...";
        default:
          return "Plain text export...";
      }
    },
    updateContent: function (newText: string) {
      this.content = newText;
      this.updatedAt = new Date();
    },
    markAsFavorite: function () {
      this.isFavorite = true;
      this.updatedAt = new Date();
    },
    unmarkFavorite: function () {
      this.isFavorite = false;
      this.updatedAt = new Date();
    },
    incrementReuseCount: function () {
      this.reuseCount++;
      this.updatedAt = new Date();
    },
    canBeReused: function () {
      return this.status === "validated" && this.isFavorite;
    },
    regenerate: function (params: Record<string, unknown>) {
      return {
        ...this,
        id: `${this.id}-regenerated-${Date.now()}`,
        generationParams: { ...this.generationParams, ...params },
        generatedAt: new Date(),
        status: "draft",
        reuseCount: 0,
      } as AppreciationContent;
    },
  },
  {
    id: "appreciation-student-4-general",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    studentId: "student-1A-4",
    subjectId: undefined,
    academicPeriodId: "period-trimester-1",
    schoolYearId: "year-2025",
    styleGuideId: "style-guide-valorisant",
    phraseBankId: "phrase-bank-general-transversal",
    rubricId: undefined,
    contentKind: "bulletin",
    scope: "general",
    audience: "parents",
    generationTrigger: "automatic",
    content:
      "Thomas fait preuve d'une attitude positive et constructive remarquable ce trimestre. Il montre un réel investissement personnel dans l'ensemble de ses matières et démontre une persévérance exemplaire face aux difficultés. Thomas s'intègre parfaitement dans le groupe classe et contribue positivement au climat d'apprentissage. Il développe progressivement son autonomie et manifeste de la curiosité dans ses apprentissages. Sa progression est régulière et constante, témoignant d'un travail sérieux et méthodique. Thomas possède des qualités humaines appréciables qui lui permettront de continuer à exceller. Les progrès réalisés sont significatifs et l'évolution positive constante est encourageante pour la suite de l'année.",
    inputData: {
      studentName: "Thomas Petit",
      globalBehavior: "exemplary",
      classIntegration: "excellent",
      autonomyLevel: "developing",
      overallProgression: "steady",
      personalQualities: ["positive", "perseverant", "collaborative"],
    },
    generationParams: {
      tone: "valorisant",
      length: "long",
      person: "troisieme",
      includeStrengths: true,
      includeImprovements: false,
      includeEncouragement: true,
      focusAreas: ["attitude", "socialSkills", "progression"],
    },
    language: "fr",
    status: "validated",
    isFavorite: true,
    reuseCount: 1,
    generatedAt: new Date("2025-11-18T11:10:00"),
    updatedAt: new Date("2025-11-19T08:45:00"),
    exportAs: (format: string) => {
      switch (format) {
        case "pdf":
          return "PDF export content...";
        case "word":
          return "Word export content...";
        default:
          return "Plain text export...";
      }
    },
    updateContent: function (newText: string) {
      this.content = newText;
      this.updatedAt = new Date();
    },
    markAsFavorite: function () {
      this.isFavorite = true;
      this.updatedAt = new Date();
    },
    unmarkFavorite: function () {
      this.isFavorite = false;
      this.updatedAt = new Date();
    },
    incrementReuseCount: function () {
      this.reuseCount++;
      this.updatedAt = new Date();
    },
    canBeReused: function () {
      return this.status === "validated" && this.isFavorite;
    },
    regenerate: function (params: Record<string, unknown>) {
      return {
        ...this,
        id: `${this.id}-regenerated-${Date.now()}`,
        generationParams: { ...this.generationParams, ...params },
        generatedAt: new Date(),
        status: "draft",
        reuseCount: 0,
      } as AppreciationContent;
    },
  },
];

// Helper functions
export const getAppreciationContentById = (
  id: string,
): AppreciationContent | undefined => {
  return MOCK_APPRECIATION_CONTENT.find((content) => content.id === id);
};

export const getAppreciationContentByStudent = (
  studentId: string,
): AppreciationContent[] => {
  return MOCK_APPRECIATION_CONTENT.filter(
    (content) => content.studentId === studentId,
  );
};

export const getAppreciationContentBySubject = (
  subjectId: string,
): AppreciationContent[] => {
  return MOCK_APPRECIATION_CONTENT.filter(
    (content) => content.subjectId === subjectId,
  );
};

export const getAppreciationContentByPeriod = (
  periodId: string,
): AppreciationContent[] => {
  return MOCK_APPRECIATION_CONTENT.filter(
    (content) => content.academicPeriodId === periodId,
  );
};

export const getAppreciationContentByStatus = (
  status: string,
): AppreciationContent[] => {
  return MOCK_APPRECIATION_CONTENT.filter(
    (content) => content.status === status,
  );
};

export const getFavoriteAppreciationContent = (): AppreciationContent[] => {
  return MOCK_APPRECIATION_CONTENT.filter((content) => content.isFavorite);
};

export const getReusableAppreciationContent = (): AppreciationContent[] => {
  return MOCK_APPRECIATION_CONTENT.filter((content) => content.canBeReused());
};

export const getAppreciationContentStats = () => {
  const total = MOCK_APPRECIATION_CONTENT.length;
  const byStatus = MOCK_APPRECIATION_CONTENT.reduce(
    (acc, content) => {
      acc[content.status] = (acc[content.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const favorites = MOCK_APPRECIATION_CONTENT.filter(
    (c) => c.isFavorite,
  ).length;
  const reusable = MOCK_APPRECIATION_CONTENT.filter((c) =>
    c.canBeReused(),
  ).length;

  return {
    total,
    byStatus,
    favorites,
    reusable,
  };
};
