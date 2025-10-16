import type { PhraseBank } from "@/types/uml-entities";

export const MOCK_PHRASE_BANKS: PhraseBank[] = [
  {
    id: "phrase-bank-anglais-general",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    scope: "subject",
    subjectId: "subject-anglais",
    entries: {
      positiveElements: {
        participation: [
          "participe activement aux discussions en classe",
          "prend régulièrement la parole en anglais",
          "pose des questions pertinentes pour approfondir sa compréhension",
          "montre une belle aisance à l'oral",
          "s'exprime avec confiance malgré les difficultés",
          "fait preuve d'initiative dans les activités de groupe",
        ],
        comprehension: [
          "comprend les documents audio et vidéo proposés",
          "saisit les idées principales des textes étudiés",
          "démontre une bonne compréhension globale",
          "identifie les informations essentielles",
          "analyse avec pertinence les supports proposés",
          "fait preuve de finesse dans l'interprétation",
        ],
        expression: [
          "s'exprime de manière claire et structurée",
          "utilise un vocabulaire varié et approprié",
          "maîtrise les structures grammaticales de base",
          "développe des idées avec cohérence",
          "fait preuve de créativité dans ses productions",
          "adapte son registre selon la situation",
        ],
        methodology: [
          "organise efficacement son travail personnel",
          "utilise les outils méthodologiques proposés",
          "révise régulièrement le vocabulaire et les structures",
          "prend des notes de manière autonome",
          "applique les conseils donnés pour progresser",
          "fait preuve de rigueur dans ses apprentissages",
        ],
      },
      improvementAreas: [
        "gagnerait à enrichir son vocabulaire actif",
        "pourrait améliorer la précision de sa prononciation",
        "devrait consolider les structures grammaticales fondamentales",
        "peut développer ses stratégies de compréhension",
        "pourrait s'impliquer davantage à l'oral",
        "devrait réviser plus régulièrement",
        "gagnerait en fluidité avec plus de pratique",
        "peut améliorer la cohérence de ses productions écrites",
      ],
      encouragements: [
        "les progrès sont encourageants",
        "continue sur cette voie prometteuse",
        "le travail fourni porte ses fruits",
        "montre une belle motivation",
        "fait preuve de persévérance",
        "développe progressivement ses compétences",
        "la progression est notable",
        "les efforts consentis sont appréciables",
      ],
      objectives: [
        "consolider les acquis pour le trimestre suivant",
        "développer l'autonomie en expression orale",
        "enrichir le vocabulaire thématique",
        "améliorer la fluidité de lecture",
        "perfectionner la méthodologie de travail",
        "renforcer la confiance en soi à l'oral",
        "développer l'esprit critique en analyse de documents",
      ],
    },
    createdAt: new Date("2025-08-15"),
    updatedAt: new Date("2025-09-06"),
  },
  {
    id: "phrase-bank-etlv-general",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    scope: "subject",
    subjectId: "subject-etlv",
    entries: {
      positiveElements: {
        technicalSkills: [
          "maîtrise le vocabulaire technique spécialisé",
          "comprend les concepts technologiques abordés",
          "établit des liens pertinents entre langue et technologie",
          "analyse avec précision les documents techniques",
          "utilise appropriément la terminologie professionnelle",
          "démontre une solide culture technologique",
        ],
        linguisticSkills: [
          "s'exprime avec aisance dans le contexte professionnel",
          "adapte son discours au domaine technique",
          "maîtrise les structures spécifiques à la communication professionnelle",
          "comprend les nuances du registre technique",
          "développe ses compétences de communication interculturelle",
          "fait preuve de précision dans ses explications",
        ],
        methodology: [
          "organise ses recherches de manière méthodique",
          "utilise efficacement les ressources numériques",
          "structure ses présentations techniques",
          "applique une démarche scientifique rigoureuse",
          "développe son esprit d'analyse et de synthèse",
          "fait preuve d'autonomie dans ses apprentissages",
        ],
        collaboration: [
          "travaille efficacement en équipe sur les projets",
          "communique clairement ses idées techniques",
          "contribue de manière constructive aux débats",
          "fait preuve de leadership dans les activités de groupe",
          "sait écouter et intégrer les apports de ses pairs",
          "développe ses compétences de négociation",
        ],
      },
      improvementAreas: [
        "peut enrichir son vocabulaire technique spécialisé",
        "devrait consolider certaines notions technologiques",
        "gagnerait à améliorer la fluidité de ses présentations",
        "pourrait développer ses capacités d'argumentation",
        "devrait approfondir sa culture du domaine technique",
        "peut améliorer la précision de ses analyses",
        "gagnerait en aisance dans les débats techniques",
        "devrait renforcer ses compétences méthodologiques",
      ],
      encouragements: [
        "montre un réel intérêt pour la dimension technologique",
        "progresse de manière constante dans les deux domaines",
        "développe une approche interdisciplinaire intéressante",
        "fait preuve de curiosité intellectuelle",
        "s'investit avec sérieux dans cette matière exigeante",
        "démontre une bonne capacité d'adaptation",
        "développe progressivement son expertise",
      ],
      objectives: [
        "approfondir la maîtrise du vocabulaire technique",
        "développer l'autonomie en recherche documentaire",
        "améliorer les compétences de présentation orale",
        "renforcer l'analyse critique de documents techniques",
        "consolider la méthodologie de projet",
        "développer la culture du domaine technologique",
      ],
    },
    createdAt: new Date("2025-08-15"),
    updatedAt: new Date("2025-09-06"),
  },
  {
    id: "phrase-bank-general-transversal",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    scope: "general",
    subjectId: "",
    entries: {
      positiveElements: {
        attitude: [
          "fait preuve d'une attitude positive et constructive",
          "montre un réel investissement personnel",
          "démontre de la persévérance face aux difficultés",
          "manifeste de la curiosité et de l'intérêt",
          "fait preuve de sérieux et de régularité",
          "développe progressivement son autonomie",
        ],
        socialSkills: [
          "s'intègre parfaitement dans le groupe classe",
          "collabore efficacement avec ses pairs",
          "fait preuve de respect et d'écoute",
          "aide volontiers ses camarades",
          "contribue positivement au climat de classe",
          "développe ses compétences relationnelles",
        ],
        progression: [
          "progresse de manière régulière et constante",
          "montre une belle évolution depuis le début d'année",
          "consolide progressivement ses acquis",
          "développe ses compétences avec détermination",
          "améliore continuellement ses performances",
          "fait preuve d'une progression encourageante",
        ],
      },
      improvementAreas: [
        "peut développer davantage sa confiance en soi",
        "gagnerait à s'investir plus régulièrement",
        "pourrait améliorer son organisation personnelle",
        "devrait consolider ses méthodes de travail",
        "peut développer sa participation active",
        "gagnerait en autonomie dans ses apprentissages",
        "pourrait améliorer sa gestion du temps",
        "devrait renforcer sa motivation personnelle",
      ],
      encouragements: [
        "continue tes efforts, ils portent leurs fruits",
        "la progression est nette et encourageante",
        "montre de belles capacités à développer",
        "fait preuve de qualités humaines appréciables",
        "développe un potentiel prometteur",
        "les progrès réalisés sont significatifs",
        "l'investissement personnel est notable",
        "démontre une évolution positive constante",
      ],
    },
    createdAt: new Date("2025-08-15"),
    updatedAt: new Date("2025-09-06"),
  },
];

// Helper functions
export const getPhraseBankById = (id: string): PhraseBank | undefined => {
  return MOCK_PHRASE_BANKS.find((bank) => bank.id === id);
};

export const getPhraseBanksBySubject = (subjectId: string): PhraseBank[] => {
  return MOCK_PHRASE_BANKS.filter(
    (bank) => bank.subjectId === subjectId || bank.scope === "general",
  );
};

export const getPhraseBanksByScope = (scope: string): PhraseBank[] => {
  return MOCK_PHRASE_BANKS.filter((bank) => bank.scope === scope);
};

export const getGeneralPhraseBank = (): PhraseBank | undefined => {
  return MOCK_PHRASE_BANKS.find((bank) => bank.scope === "general");
};

export const getAllAvailablePhrases = (
  subjectId?: string,
): Record<string, string[]> => {
  const relevantBanks = subjectId
    ? getPhraseBanksBySubject(subjectId)
    : MOCK_PHRASE_BANKS;

  const allPhrases: Record<string, string[]> = {};

  relevantBanks.forEach((bank) => {
    const entries = bank.entries as Record<string, any>;
    Object.keys(entries).forEach((category) => {
      if (typeof entries[category] === "object") {
        if (Array.isArray(entries[category])) {
          if (!allPhrases[category]) {
            allPhrases[category] = [];
          }
          allPhrases[category].push(...entries[category]);
        } else {
          Object.keys(entries[category]).forEach((subCategory) => {
            const fullCategory = `${category}.${subCategory}`;
            if (!allPhrases[fullCategory]) {
              allPhrases[fullCategory] = [];
            }
            allPhrases[fullCategory].push(...entries[category][subCategory]);
          });
        }
      }
    });
  });

  return allPhrases;
};
