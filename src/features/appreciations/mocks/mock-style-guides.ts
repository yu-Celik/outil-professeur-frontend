import type { StyleGuide } from "@/types/uml-entities";

export const MOCK_STYLE_GUIDES: StyleGuide[] = [
  {
    id: "style-guide-professionnel",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    name: "Style professionnel",
    tone: "professionnel",
    register: "soutenu",
    length: "moyen",
    person: "troisieme",
    variability: "elevee",
    bannedPhrases: [
      "c'est nul",
      "pas terrible",
      "décevant",
      "catastrophique",
      "lamentable"
    ],
    preferredPhrases: [
      "montre des progrès",
      "fait preuve d'attention",
      "s'investit dans",
      "développe ses compétences",
      "manifeste un intérêt",
      "progresse significativement"
    ],
    createdAt: new Date("2025-08-15"),
    updatedAt: new Date("2025-09-06"),
  },
  {
    id: "style-guide-bienveillant",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    name: "Style bienveillant",
    tone: "bienveillant",
    register: "courant",
    length: "long",
    person: "deuxieme",
    variability: "elevee",
    bannedPhrases: [
      "échec",
      "insuffisant",
      "mauvais",
      "problématique",
      "difficultés importantes"
    ],
    preferredPhrases: [
      "vous progressez",
      "vos efforts portent leurs fruits",
      "vous montrez de belles capacités",
      "continuez sur cette voie",
      "vos progrès sont encourageants",
      "vous développez vos talents"
    ],
    createdAt: new Date("2025-08-15"),
    updatedAt: new Date("2025-09-06"),
  },
  {
    id: "style-guide-constructif",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    name: "Style constructif",
    tone: "constructif",
    register: "courant",
    length: "moyen",
    person: "troisieme",
    variability: "moyenne",
    bannedPhrases: [
      "toujours",
      "jamais",
      "aucun effort",
      "ne fait rien",
      "pas du tout"
    ],
    preferredPhrases: [
      "peut améliorer",
      "gagnerait à",
      "pourrait développer",
      "il serait bénéfique de",
      "les prochains objectifs",
      "axes d'amélioration"
    ],
    createdAt: new Date("2025-08-15"),
    updatedAt: new Date("2025-09-06"),
  },
  {
    id: "style-guide-valorisant",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    name: "Style valorisant",
    tone: "valorisant",
    register: "courant",
    length: "long",
    person: "deuxieme",
    variability: "elevee",
    bannedPhrases: [
      "manque",
      "déficit",
      "lacune",
      "faiblesse",
      "point faible"
    ],
    preferredPhrases: [
      "excellente progression",
      "remarquable investissement",
      "qualités indéniables",
      "potentiel certain",
      "très bonne maîtrise",
      "capacités prometteuses"
    ],
    createdAt: new Date("2025-08-15"),
    updatedAt: new Date("2025-09-06"),
  },
  {
    id: "style-guide-concis",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    name: "Style concis",
    tone: "neutre",
    register: "courant",
    length: "court",
    person: "troisieme",
    variability: "faible",
    bannedPhrases: [
      "il faut absolument",
      "très très",
      "extrêmement",
      "énormément",
      "beaucoup trop"
    ],
    preferredPhrases: [
      "progresse",
      "maîtrise",
      "développe",
      "acquiert",
      "améliore",
      "consolide"
    ],
    createdAt: new Date("2025-08-15"),
    updatedAt: new Date("2025-09-06"),
  },
  {
    id: "style-guide-detaille",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    name: "Style détaillé",
    tone: "informatif",
    register: "soutenu",
    length: "long",
    person: "troisieme",
    variability: "elevee",
    bannedPhrases: [
      "ok",
      "pas mal",
      "ça va",
      "moyen",
      "correct"
    ],
    preferredPhrases: [
      "démontre une compréhension approfondie",
      "analyse avec pertinence",
      "structure sa réflexion",
      "argumente de manière cohérente",
      "fait preuve de rigueur",
      "développe une approche méthodique"
    ],
    createdAt: new Date("2025-08-15"),
    updatedAt: new Date("2025-09-06"),
  }
];

// Helper functions
export const getStyleGuideById = (id: string): StyleGuide | undefined => {
  return MOCK_STYLE_GUIDES.find((guide) => guide.id === id);
};

export const getStyleGuidesByTone = (tone: string): StyleGuide[] => {
  return MOCK_STYLE_GUIDES.filter((guide) => guide.tone === tone);
};

export const getStyleGuidesByLength = (length: string): StyleGuide[] => {
  return MOCK_STYLE_GUIDES.filter((guide) => guide.length === length);
};

export const getDefaultStyleGuide = (): StyleGuide => {
  return MOCK_STYLE_GUIDES[0]; // Style professionnel par défaut
};

export const getAllStyleGuideTones = (): string[] => {
  return [...new Set(MOCK_STYLE_GUIDES.map(guide => guide.tone))];
};

export const getAllStyleGuideRegisters = (): string[] => {
  return [...new Set(MOCK_STYLE_GUIDES.map(guide => guide.register))];
};

export const getAllStyleGuideLengths = (): string[] => {
  return [...new Set(MOCK_STYLE_GUIDES.map(guide => guide.length))];
};