import type { Rubric } from "@/types/uml-entities";

// Type pour une rubrique structurée
export interface RubricSection {
  id: string;
  name: string;
  weight: number; // Pondération en pourcentage (total doit faire 100%)
  criteria: RubricCriterion[];
}

export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  levels: RubricLevel[];
}

export interface RubricLevel {
  id: string;
  name: string;
  description: string;
  points: number;
}

export interface RubricConstraints {
  maxTotalPoints: number;
  sectionsRequired: boolean;
  minCriteria: number;
  maxCriteria: number;
  allowPartialPoints: boolean;
}

export const MOCK_RUBRICS: Rubric[] = [
  {
    id: "rubric-anglais-oral",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    name: "Grille évaluation oral anglais",
    sections: {
      "expression": {
        id: "expression",
        name: "Expression orale",
        weight: 50,
        criteria: [
          {
            id: "fluency",
            name: "Fluidité",
            description: "Capacité à s'exprimer de manière continue",
            levels: [
              {
                id: "excellent",
                name: "Excellent",
                description: "S'exprime avec fluidité, sans hésitation",
                points: 4
              },
              {
                id: "good",
                name: "Bien",
                description: "S'exprime avec quelques hésitations mineures",
                points: 3
              },
              {
                id: "satisfactory",
                name: "Satisfaisant",
                description: "S'exprime avec des hésitations fréquentes",
                points: 2
              },
              {
                id: "insufficient",
                name: "Insuffisant",
                description: "Grandes difficultés d'expression",
                points: 1
              }
            ]
          },
          {
            id: "pronunciation",
            name: "Prononciation",
            description: "Qualité de la prononciation et accentuation",
            levels: [
              {
                id: "excellent",
                name: "Excellent",
                description: "Prononciation proche du niveau natif",
                points: 4
              },
              {
                id: "good",
                name: "Bien",
                description: "Bonne prononciation avec quelques erreurs mineures",
                points: 3
              },
              {
                id: "satisfactory",
                name: "Satisfaisant",
                description: "Prononciation compréhensible malgré des erreurs",
                points: 2
              },
              {
                id: "insufficient",
                name: "Insuffisant",
                description: "Prononciation difficile à comprendre",
                points: 1
              }
            ]
          }
        ]
      },
      "content": {
        id: "content",
        name: "Contenu",
        weight: 30,
        criteria: [
          {
            id: "relevance",
            name: "Pertinence",
            description: "Adéquation du contenu avec le sujet",
            levels: [
              {
                id: "excellent",
                name: "Excellent",
                description: "Contenu très pertinent et bien développé",
                points: 4
              },
              {
                id: "good",
                name: "Bien",
                description: "Contenu pertinent avec quelques développements",
                points: 3
              },
              {
                id: "satisfactory",
                name: "Satisfaisant",
                description: "Contenu en rapport avec le sujet",
                points: 2
              },
              {
                id: "insufficient",
                name: "Insuffisant",
                description: "Contenu peu pertinent ou hors sujet",
                points: 1
              }
            ]
          }
        ]
      },
      "interaction": {
        id: "interaction",
        name: "Interaction",
        weight: 20,
        criteria: [
          {
            id: "comprehension",
            name: "Compréhension",
            description: "Capacité à comprendre les questions",
            levels: [
              {
                id: "excellent",
                name: "Excellent",
                description: "Comprend toutes les questions immédiatement",
                points: 4
              },
              {
                id: "good",
                name: "Bien",
                description: "Comprend les questions avec peu d'aide",
                points: 3
              },
              {
                id: "satisfactory",
                name: "Satisfaisant",
                description: "Comprend avec reformulation",
                points: 2
              },
              {
                id: "insufficient",
                name: "Insuffisant",
                description: "Difficultés importantes de compréhension",
                points: 1
              }
            ]
          }
        ]
      }
    } as Record<string, RubricSection>,
    constraints: {
      maxTotalPoints: 20,
      sectionsRequired: true,
      minCriteria: 1,
      maxCriteria: 10,
      allowPartialPoints: true
    } as unknown as Record<string, unknown>,
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date("2025-09-14"),
  },
  {
    id: "rubric-etlv-presentation",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    name: "Grille présentation ETLV",
    sections: {
      "technical": {
        id: "technical",
        name: "Contenu technique",
        weight: 40,
        criteria: [
          {
            id: "accuracy",
            name: "Exactitude technique",
            description: "Précision des informations techniques présentées",
            levels: [
              {
                id: "excellent",
                name: "Excellent",
                description: "Informations techniques parfaitement exactes",
                points: 5
              },
              {
                id: "good",
                name: "Bien",
                description: "Informations globalement exactes",
                points: 4
              },
              {
                id: "satisfactory",
                name: "Satisfaisant",
                description: "Quelques imprécisions techniques",
                points: 3
              },
              {
                id: "needs_improvement",
                name: "À améliorer",
                description: "Plusieurs erreurs techniques",
                points: 2
              },
              {
                id: "insufficient",
                name: "Insuffisant",
                description: "Nombreuses erreurs ou informations erronées",
                points: 1
              }
            ]
          },
          {
            id: "depth",
            name: "Profondeur d'analyse",
            description: "Niveau de détail et d'analyse technique",
            levels: [
              {
                id: "excellent",
                name: "Excellent",
                description: "Analyse approfondie et réflexion poussée",
                points: 5
              },
              {
                id: "good",
                name: "Bien",
                description: "Bonne analyse avec détails pertinents",
                points: 4
              },
              {
                id: "satisfactory",
                name: "Satisfaisant",
                description: "Analyse basique mais correcte",
                points: 3
              },
              {
                id: "needs_improvement",
                name: "À améliorer",
                description: "Analyse superficielle",
                points: 2
              },
              {
                id: "insufficient",
                name: "Insuffisant",
                description: "Manque d'analyse ou analyse incorrecte",
                points: 1
              }
            ]
          }
        ]
      },
      "language": {
        id: "language",
        name: "Maîtrise linguistique",
        weight: 35,
        criteria: [
          {
            id: "vocabulary",
            name: "Vocabulaire technique",
            description: "Utilisation appropriée du vocabulaire spécialisé",
            levels: [
              {
                id: "excellent",
                name: "Excellent",
                description: "Vocabulaire technique riche et précis",
                points: 4
              },
              {
                id: "good",
                name: "Bien",
                description: "Bon vocabulaire avec quelques approximations",
                points: 3
              },
              {
                id: "satisfactory",
                name: "Satisfaisant",
                description: "Vocabulaire de base suffisant",
                points: 2
              },
              {
                id: "insufficient",
                name: "Insuffisant",
                description: "Vocabulaire limité ou inapproprié",
                points: 1
              }
            ]
          },
          {
            id: "grammar",
            name: "Correction grammaticale",
            description: "Précision grammaticale en anglais",
            levels: [
              {
                id: "excellent",
                name: "Excellent",
                description: "Anglais grammaticalement correct",
                points: 3
              },
              {
                id: "good",
                name: "Bien",
                description: "Quelques erreurs mineures",
                points: 2.5
              },
              {
                id: "satisfactory",
                name: "Satisfaisant",
                description: "Erreurs qui n'entravent pas la compréhension",
                points: 2
              },
              {
                id: "needs_improvement",
                name: "À améliorer",
                description: "Erreurs fréquentes mais compréhensible",
                points: 1.5
              },
              {
                id: "insufficient",
                name: "Insuffisant",
                description: "Erreurs nombreuses gênant la compréhension",
                points: 1
              }
            ]
          }
        ]
      },
      "presentation": {
        id: "presentation",
        name: "Qualité de présentation",
        weight: 25,
        criteria: [
          {
            id: "structure",
            name: "Structure",
            description: "Organisation claire de la présentation",
            levels: [
              {
                id: "excellent",
                name: "Excellent",
                description: "Structure très claire et logique",
                points: 3
              },
              {
                id: "good",
                name: "Bien",
                description: "Bonne structure globale",
                points: 2.5
              },
              {
                id: "satisfactory",
                name: "Satisfaisant",
                description: "Structure basique mais cohérente",
                points: 2
              },
              {
                id: "needs_improvement",
                name: "À améliorer",
                description: "Structure peu claire",
                points: 1.5
              },
              {
                id: "insufficient",
                name: "Insuffisant",
                description: "Manque d'organisation",
                points: 1
              }
            ]
          }
        ]
      }
    } as Record<string, RubricSection>,
    constraints: {
      maxTotalPoints: 20,
      sectionsRequired: true,
      minCriteria: 1,
      maxCriteria: 15,
      allowPartialPoints: true
    } as unknown as Record<string, unknown>,
    createdAt: new Date("2025-09-10"),
    updatedAt: new Date("2025-09-14"),
  },
  {
    id: "rubric-anglais-ecrit",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    name: "Grille contrôle écrit anglais",
    sections: {
      "grammar": {
        id: "grammar",
        name: "Grammaire",
        weight: 50,
        criteria: [
          {
            id: "verb_forms",
            name: "Formes verbales",
            description: "Maîtrise des temps et formes verbales",
            levels: [
              {
                id: "excellent",
                name: "Excellent",
                description: "Formes verbales parfaitement maîtrisées",
                points: 5
              },
              {
                id: "good",
                name: "Bien",
                description: "Quelques erreurs mineures",
                points: 4
              },
              {
                id: "satisfactory",
                name: "Satisfaisant",
                description: "Formes de base correctes",
                points: 3
              },
              {
                id: "needs_improvement",
                name: "À améliorer",
                description: "Erreurs fréquentes",
                points: 2
              },
              {
                id: "insufficient",
                name: "Insuffisant",
                description: "Formes verbales incorrectes",
                points: 1
              }
            ]
          },
          {
            id: "syntax",
            name: "Syntaxe",
            description: "Construction des phrases",
            levels: [
              {
                id: "excellent",
                name: "Excellent",
                description: "Phrases bien construites et variées",
                points: 5
              },
              {
                id: "good",
                name: "Bien",
                description: "Construction correcte avec quelques maladresses",
                points: 4
              },
              {
                id: "satisfactory",
                name: "Satisfaisant",
                description: "Phrases simples mais correctes",
                points: 3
              },
              {
                id: "needs_improvement",
                name: "À améliorer",
                description: "Construction souvent incorrecte",
                points: 2
              },
              {
                id: "insufficient",
                name: "Insuffisant",
                description: "Phrases mal construites",
                points: 1
              }
            ]
          }
        ]
      },
      "vocabulary": {
        id: "vocabulary",
        name: "Vocabulaire",
        weight: 30,
        criteria: [
          {
            id: "accuracy",
            name: "Précision",
            description: "Choix approprié des mots",
            levels: [
              {
                id: "excellent",
                name: "Excellent",
                description: "Vocabulaire précis et varié",
                points: 3
              },
              {
                id: "good",
                name: "Bien",
                description: "Bon choix de mots avec quelques approximations",
                points: 2.5
              },
              {
                id: "satisfactory",
                name: "Satisfaisant",
                description: "Vocabulaire de base approprié",
                points: 2
              },
              {
                id: "needs_improvement",
                name: "À améliorer",
                description: "Choix de mots souvent inapproprié",
                points: 1.5
              },
              {
                id: "insufficient",
                name: "Insuffisant",
                description: "Vocabulaire limité et imprécis",
                points: 1
              }
            ]
          }
        ]
      },
      "spelling": {
        id: "spelling",
        name: "Orthographe",
        weight: 20,
        criteria: [
          {
            id: "accuracy",
            name: "Correction orthographique",
            description: "Orthographe des mots anglais",
            levels: [
              {
                id: "excellent",
                name: "Excellent",
                description: "Aucune erreur d'orthographe",
                points: 2
              },
              {
                id: "good",
                name: "Bien",
                description: "1-2 erreurs mineures",
                points: 1.5
              },
              {
                id: "satisfactory",
                name: "Satisfaisant",
                description: "3-5 erreurs d'orthographe",
                points: 1
              },
              {
                id: "needs_improvement",
                name: "À améliorer",
                description: "6-10 erreurs d'orthographe",
                points: 0.5
              },
              {
                id: "insufficient",
                name: "Insuffisant",
                description: "Plus de 10 erreurs d'orthographe",
                points: 0
              }
            ]
          }
        ]
      }
    } as Record<string, RubricSection>,
    constraints: {
      maxTotalPoints: 20,
      sectionsRequired: true,
      minCriteria: 1,
      maxCriteria: 10,
      allowPartialPoints: true
    } as unknown as Record<string, unknown>,
    createdAt: new Date("2025-08-15"),
    updatedAt: new Date("2025-09-14"),
  }
];

// Fonction pour obtenir les rubriques par enseignant
export function getRubricsByTeacher(teacherId: string): Rubric[] {
  return MOCK_RUBRICS.filter(rubric => rubric.createdBy === teacherId);
}

// Fonction pour obtenir une rubrique par ID
export function getRubricById(rubricId: string): Rubric | undefined {
  return MOCK_RUBRICS.find(rubric => rubric.id === rubricId);
}

// Fonction pour calculer le score maximum d'une rubrique
export function calculateRubricMaxScore(rubric: Rubric): number {
  const sections = rubric.sections as Record<string, RubricSection>;
  let maxScore = 0;

  Object.values(sections).forEach(section => {
    section.criteria.forEach(criterion => {
      const maxPoints = Math.max(...criterion.levels.map(level => level.points));
      maxScore += maxPoints;
    });
  });

  return maxScore;
}

// Fonction pour valider qu'une rubrique est cohérente
export function validateRubric(rubric: Rubric): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const sections = rubric.sections as Record<string, RubricSection>;
  const constraints = rubric.constraints as unknown as RubricConstraints;

  // Vérifier les pondérations des sections
  const totalWeight = Object.values(sections).reduce((sum, section) => sum + section.weight, 0);
  if (Math.abs(totalWeight - 100) > 0.1) {
    errors.push(`Total des pondérations (${totalWeight}%) doit égaler 100%`);
  }

  // Vérifier le nombre de critères
  const totalCriteria = Object.values(sections).reduce((sum, section) => sum + section.criteria.length, 0);
  if (totalCriteria < constraints.minCriteria) {
    errors.push(`Nombre minimum de critères: ${constraints.minCriteria} (actuel: ${totalCriteria})`);
  }
  if (totalCriteria > constraints.maxCriteria) {
    errors.push(`Nombre maximum de critères: ${constraints.maxCriteria} (actuel: ${totalCriteria})`);
  }

  // Vérifier le score maximum
  const maxScore = calculateRubricMaxScore(rubric);
  if (maxScore !== constraints.maxTotalPoints) {
    errors.push(`Score maximum calculé (${maxScore}) ne correspond pas au maximum défini (${constraints.maxTotalPoints})`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}