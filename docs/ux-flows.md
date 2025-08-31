flowchart TB
  %% =========================
  %% Styles globaux
  %% =========================
  classDef action fill:#ECF3FF,stroke:#3A6EA5,stroke-width:2px,color:#0F2A43;
  classDef decision fill:#FFF3CD,stroke:#C39B0E,stroke-width:2px,color:#5C4A07;
  classDef io fill:#E8F7EE,stroke:#2E7D32,stroke-width:2px,color:#0B3D16;
  classDef finish fill:#F3E8FF,stroke:#7B61FF,stroke-width:2px,color:#2E1065;

  %% =========================
  %% S0 — Onboarding & Configuration minimale
  %% =========================
  subgraph OB["🚀 Onboarding & Configuration"]
    direction TB
    OB0([Inscription / Connexion Teacher]):::action --> OB1{Profil ok ?}:::decision
    OB1 -- Non --> OB2[Compléter langue / fuseau / préférences]:::action
    OB1 -- Oui --> OB3[Assistant de démarrage]:::action
    OB3 --> OB4[Créer SchoolYear]:::action
    OB4 --> OB5[Créer AcademicPeriods]:::action
    OB5 --> OB6[Créer Subjects]:::action
    OB6 --> OB7[Créer Class + gradeLabel + year]:::action
    OB7 --> OB8[Créer TeachingAssignment]:::action
    OB8 --> OB9[Configurer NotationSystem]:::action
    OB9 --> OB10[Créer StyleGuide]:::action
    OB10 --> OB11[Créer PhraseBank / Rubric]:::action
    OB11 --> OB12{Checklist validée ?}:::decision
    OB12 -- Oui --> OB13[Dashboard]:::action
    OB12 -- Non --> OB6
  end

  %% =========================
  %% S1 — Gestion des élèves
  %% =========================
  subgraph SM["👥 Gestion Élèves"]
    direction TB
    SM0[Ajouter / Importer Students]:::action --> SM1{Affecter à Class ?}:::decision
    SM1 -- Oui --> SM2[Student.currentClassId = Class]:::io
    SM2 --> SM3[Créer/MAJ TeachingAssignment HOMEROOM]:::action
    SM3 --> SM4[Préparer données profil]:::action
    SM1 -- Non --> SM5[File d'attente À affecter]:::action
    SM5 --> SM6[Vue Affectations en attente]:::action
  end

  %% =========================
  %% S2 — Planification & Présence
  %% =========================
  subgraph PL["📅 Planification & Présence"]
    direction TB
    PL0[Vue Emploi du temps]:::action --> PL1[Créer TimeSlots]:::action
    PL1 --> PL2[Planifier CourseSession]:::action
    PL2 --> PL3{TeachingAssignment actif ?}:::decision
    PL3 -- Non --> PLX[Blocage: non autorisé]:::action
    PL3 -- Oui --> PL4[Session créée]:::action
    PL4 --> PL5[Prendre présence → StudentParticipation]:::io
    PL5 --> PL6[Notes objectives / consignes]:::io
    PL6 --> PL7[Marquer attendanceTaken = true]:::action
  end

  %% =========================
  %% S3 — Évaluations & Notes
  %% =========================
  subgraph EV["📝 Évaluations & Notes"]
    direction TB
    EV0[Créer Exam Class Subject Period]:::action --> EV1{TeachingAssignment ok ?}:::decision
    EV1 -- Non --> EVX[Blocage: non autorisé]:::action
    EV1 -- Oui --> EV2[Exam créé notationType totalPoints]:::action
    EV2 --> EV3[Saisir résultats → StudentExamResult]:::io
    EV3 --> EV4[Conversion via NotationSystem]:::action
    EV4 --> EV5[Calculs agrégés stats JSON]:::action
    EV5 --> EV6[Publier Exam isPublished=true]:::action
  end

  %% =========================
  %% S4 — Profils IA
  %% =========================
  subgraph AI["🤖 Profils IA"]
    direction TB
    AI0[Page Élève]:::action --> AI1[Choisir AcademicPeriod]:::action
    AI1 --> AI2[Collecter sources: Participation + ExamResult]:::action
    AI2 --> AI3[Générer StudentProfile features evidenceRefs]:::action
    AI3 --> AI4[Relecture GENERATED → REVIEWED]:::action
    AI4 --> AI5[Prêt pour appréciations / bilans]:::action
  end

  %% =========================
  %% S5 — Appréciations par matière
  %% =========================
  subgraph AP["📋 Appréciations Matière"]
    direction TB
    AP0[Vue Matière → Élève]:::action --> AP1{TeachingAssignment Subject ?}:::decision
    AP1 -- Non --> APX[Blocage: non autorisé]:::action
    AP1 -- Oui --> AP2[Préparer inputs: StudentProfile + metrics]:::action
    AP2 --> AP3[Composer texte StyleGuide + PhraseBank]:::action
    AP3 --> AP4[Éditer / Variant / Antidoublon]:::action
    AP4 --> AP5[Status: DRAFT → REVIEWED → FINAL]:::action
    AP5 --> AP6[Export texte / RTF / HTML]:::io
  end

  %% =========================
  %% S6 — Bilans globaux
  %% =========================
  subgraph GB["📊 Bilans Globaux"]
    direction TB
    GB0[Vue Classe → Élève]:::action --> GB1{Rôle HOMEROOM ?}:::decision
    GB1 -- Non --> GBX[Blocage: non autorisé]:::action
    GB1 -- Oui --> GB2[Choisir portée: Period OU Year]:::action
    GB2 --> GB3[Assembler faits: tendances comportements]:::action
    GB3 --> GB4[Rédaction bilan subjectId=null]:::action
    GB4 --> GB5[Status: DRAFT → REVIEWED → FINAL]:::action
    GB5 --> GB6[Export texte / RTF / HTML]:::io
  end

  %% =========================
  %% S7 — Garde-fous
  %% =========================
  subgraph AUTH["🔒 Garde-fous Autorisation"]
    direction TB
    AUTH0([Action utilisateur]):::action --> AUTH1{TeachingAssignment actif ?}:::decision
    AUTH1 -- Non --> AUTHX[Refuser / Afficher pourquoi]:::action
    AUTH1 -- Oui --> AUTH2{Type d'action}:::decision
    AUTH2 -- Session/Exam/Appreciation --> AUTH3[Contrôle Class Subject SchoolYear]:::action
    AUTH2 -- Bilan global --> AUTH4[Contrôle HOMEROOM Class SchoolYear]:::action
    AUTH3 --> AUTHOK([Autoriser]):::finish
    AUTH4 --> AUTHOK
  end

  %% =========================
  %% S8 — Archivage
  %% =========================
  subgraph AR["🗄️ Cycle de vie & Archivage"]
    direction TB
    AR0[Fin d'année]:::action --> AR1[Clôturer SchoolYear isActive=false]:::action
    AR1 --> AR2[Créer nouvelle SchoolYear + Periods]:::action
    AR2 --> AR3[Cloner Classes + TeachingAssignments]:::action
    AR3 --> AR4[Migrer Students transferts de classe]:::action
    AR4 --> AR5[Conserver historiques]:::action
    AR5 --> AR6[Nettoyage guidé / Indexation / Exports]:::action
  end

  %% =========================
  %% Connexions principales
  %% =========================
  OB13 --> SM0
  SM0 --> PL0
  PL4 --> EV0
  EV3 --> AI2
  AI5 --> AP0
  AP6 --> GB0
  GB6 --> AR0