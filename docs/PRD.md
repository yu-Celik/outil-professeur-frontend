# outil-professor Product Requirements Document (PRD)

**Author:** Yusuf
**Date:** 2025-10-13
**Project Level:** 3 (Full Product)
**Project Type:** Educational Management Platform
**Target Scale:** 20-30 user stories, 4-5 epics

---

## Description, Context and Goals

### Description

**outil-professor** est une application de gestion pédagogique locale-first conçue spécifiquement pour les enseignants d'anglais en ligne travaillant avec des classes de niveau secondaire. L'application transforme le processus chronophage et manuel de suivi des élèves en un système fluide et automatisé qui permet à l'enseignante de se concentrer sur la pédagogie plutôt que sur l'administratif.

Le système capture les données essentielles de chaque session d'enseignement (présence, participation, comportement, performance technique) et les transforme intelligemment en insights actionnables et en documents de communication professionnels. L'objectif principal est de réduire de 50% le temps consacré aux tâches administratives tout en améliorant la qualité et la cohérence des retours fournis aux parents et aux établissements scolaires.

L'application se distingue par trois piliers fondamentaux :

1. **Simplicité d'utilisation** : Interface française intuitive avec saisie rapide des données quotidiennes, pensée pour une utilisatrice non-technique
2. **Intelligence automatisée** : Génération automatique de rapports bihebdomadaires et d'appréciations trimestrielles bienveillantes basées sur l'analyse comportementale et académique
3. **Fiabilité locale-first** : Fonctionnement hors ligne garanti avec stockage local SQLite, export PDF intégré, et mécanisme de sauvegarde robuste

L'architecture technique s'appuie sur Next.js 15 avec une approche hybride combinant Atomic Design pour les composants UI et une organisation feature-based pour la logique métier. Le projet implémente déjà un modèle UML complet couvrant les entités Teacher, Student, Class, Subject, CourseSession, Exam, et des services d'analytics avancés.

La vision à long terme inclut une évolution vers un assistant complet pour enseignants en ligne, potentiellement commercialisable, avec synchronisation cloud, application mobile, et intégrations LMS.

### Deployment Intent

**Architecture Full-Stack avec déploiement progressif**

L'application **outil-professor** suit une architecture moderne full-stack avec :

**Backend (Souz Backend API v1.0.0)**
- API REST Rust avec 60+ endpoints organisés en 12 domaines fonctionnels
- Authentification par cookie HttpOnly sécurisé
- Gestion complète : enseignants, élèves, classes, matières, sessions, examens, présences
- Architecture ready-production avec validation, gestion d'erreurs, concurrence optimiste (ETag)

**Frontend (Next.js 15)**
- Application web React 19 avec App Router
- Architecture hybride : Atomic Design + Feature-Based
- Système de design cohérent (Tailwind CSS v4 + shadcn/ui)
- Mode local-first avec synchronisation backend

**Stratégie de déploiement en 3 phases :**

1. **Phase MVP (Actuelle - T0-T3 mois)**
   - Backend API déployé en local ou serveur privé
   - Frontend Next.js accessible via navigateur (desktop/tablette)
   - Utilisatrice unique pilote (l'enseignante)
   - Fonctionnalités core opérationnelles avec données persistées
   - Exports PDF et sauvegarde locale garantis

2. **Phase Production (T3-T6 mois)**
   - Backend hébergé sur serveur cloud (VPS ou PaaS type Fly.io/Railway)
   - Frontend déployé sur Vercel/Netlify ou package desktop (Tauri)
   - Multi-utilisateurs (5-10 enseignants bêta-testeurs)
   - Synchronisation temps réel, notifications, workflows optimisés

3. **Phase Plateforme (T6-T12 mois)**
   - SaaS multi-tenant avec isolation données par enseignant

Le déploiement privilégie **stabilité, sécurité des données, et expérience utilisateur fluide** sur la scalabilité immédiate.

### Context

**Contexte Pédagogique et Technique**

L'enseignement en ligne pour le niveau secondaire présente des défis uniques de suivi et d'évaluation des élèves. Les enseignants doivent jongler entre :
- Animer des sessions en direct (gestion caméras, participation, problèmes techniques)
- Capturer des données comportementales et académiques en temps réel
- Produire des rapports réguliers pour les parents (bihebdomadaires)
- Rédiger des appréciations trimestrielles personnalisées et bienveillantes

**Situation Actuelle**

L'enseignante cible utilise actuellement des outils fragmentés :
- Tableur Excel/Google Sheets pour le suivi quotidien (chronophage, erreurs manuelles)
- Documents Word pour les rapports (copier-coller, incohérences)
- Dossiers partagés désorganisés pour l'archivage
- Temps estimé : ~5h/semaine en tâches administratives répétitives

**Pourquoi Maintenant ?**

1. **Maturité technologique** : L'écosystème Rust + Next.js offre performance, fiabilité et DX moderne
2. **Architecture déjà établie** : Le backend API est fonctionnel avec 60+ endpoints opérationnels
3. **Besoin urgent** : L'année scolaire en cours nécessite un outil stable avant la prochaine période d'évaluation trimestrielle
4. **Potentiel de marché** : Post-pandémie, la demande d'outils pour l'enseignement en ligne reste forte
5. **Données existantes** : Modèle UML complet déjà implémenté, services d'analytics opérationnels

**Impact Attendu**

- **Court terme** (3 mois) : Réduction de 50% du temps administratif, zéro perte de données
- **Moyen terme** (6 mois) : Amélioration qualité des retours parents, stress réduit en périodes d'évaluation
- **Long terme** (12 mois) : Plateforme commercialisable pour l'écosystème enseignement en ligne

### Goals

**Objectifs Stratégiques (Niveau 3 - Full Product)**

#### Objectif 1 : Efficacité Administrative Maximale
**Mesure** : Réduire de 50% le temps hebdomadaire consacré aux tâches administratives
**Baseline** : ~5 heures/semaine actuellement
**Cible** : ≤ 2.5 heures/semaine après adoption complète (T+3 mois)
**KPI** :
- Génération d'un lot complet de rapports bihebdomadaires (20-30 élèves) en < 15 minutes
- Saisie post-session en ≤ 2 minutes vs 5-10 minutes manuellement
- Préparation appréciations trimestrielles en < 30 minutes vs 3-4 heures manuellement

#### Objectif 2 : Qualité et Cohérence des Retours
**Mesure** : 100% des communications générées respectent un standard bienveillant et constructif
**Baseline** : Incohérences actuelles entre rapports, ton variable selon fatigue enseignante
**Cible** : Score de satisfaction enseignante ≥ 8/10 sur qualité des commentaires automatiques
**KPI** :
- 0 plainte parent sur le ton ou la clarté des rapports
- 90% des commentaires générés nécessitent < 5% de modification manuelle
- Vocabulaire bienveillant standardisé dans 100% des documents

#### Objectif 3 : Fiabilité et Confiance Données (Mission-Critical)
**Mesure** : Zéro perte de données pendant toute l'année scolaire
**Baseline** : Risque actuel avec fichiers locaux non versionnés
**Cible** : 100% des sessions enregistrées avec sauvegarde automatique + mécanisme de récupération
**KPI** :
- 100% uptime du backend API (ou fallback local opérationnel)
- Export backup automatique hebdomadaire validé
- Temps de récupération après incident < 5 minutes (RPO = 0, RTO < 5min)

#### Objectif 4 : Adoption et Utilisation Quotidienne
**Mesure** : Intégration naturelle dans le workflow d'enseignement quotidien
**Baseline** : Résistance potentielle au changement, courbe d'apprentissage
**Cible** : Utilisation pour ≥ 90% des sessions d'enseignement après T+1 mois
**KPI** :
- DAU (Daily Active Usage) = 1 utilisatrice, 5 jours/semaine minimum
- Net Promoter Score (NPS) ≥ 40 après premier trimestre
- Taux d'abandon de sessions incomplètes < 5%

#### Objectif 5 : Préparation Bulletins Trimestriels Sans Stress
**Mesure** : Réduction drastique du temps et de la charge cognitive pendant périodes d'évaluation
**Baseline** : 3-4 heures de travail intensif pour 20-30 appréciations, stress élevé
**Cible** : Génération automatique + revue en < 30 minutes, charge mentale réduite de 70%
**KPI** :
- Génération complète des appréciations pour une classe (20-30 élèves) en < 20 minutes machine
- Temps de revue/édition humaine ≤ 10 minutes par classe
- Score de satisfaction enseignante sur période d'évaluation ≥ 9/10 (vs estimation 4-5/10 actuellement)

## Requirements

### Functional Requirements

**FR1 - Authentification et Gestion des Comptes Enseignants**
- Enregistrement de nouveaux enseignants avec email unique et mot de passe sécurisé
- Authentification par email/mot de passe avec cookie HttpOnly
- Profil enseignant avec langue préférée (français par défaut) et paramètres personnalisés
- Gestion de session sécurisée avec déconnexion propre
- **Backend API coverage:** ✅ POST /auth/register, POST /auth/login, GET /auth/me

**FR2 - Gestion des Années Scolaires et Périodes Académiques**
- Création et gestion des années scolaires avec dates de début/fin
- Définition des périodes académiques (trimestres/semestres) au sein de chaque année
- Marquage des périodes actives pour contextualiser les données de suivi
- Archivage et consultation des années précédentes
- **Backend API coverage:** ✅ CRUD complet sur /school-years et /academic-periods

**FR3 - Gestion des Classes**
- Création de classes avec code unique et libellé descriptif (ex: "5ème A", "3ème Anglais")
- Association des classes à une année scolaire spécifique
- Modification et soft-delete des classes
- Listing avec filtrage par année scolaire
- Concurrence optimiste via ETag pour éviter conflits de modification
- **Backend API coverage:** ✅ CRUD complet sur /classes avec gestion ETag

**FR4 - Gestion des Matières**
- Création de matières avec nom et code (ex: "Anglais", "ANG")
- Description optionnelle de la matière
- Association flexible des matières aux classes via teaching assignments
- Listing et recherche des matières
- **Backend API coverage:** ✅ CRUD complet sur /subjects

**FR5 - Gestion des Élèves**
- Création d'élèves avec nom, prénom et informations académiques
- Champs spécifiques : besoins particuliers, observations générales, forces identifiées
- Inscription/désinscription des élèves dans les classes
- Recherche d'élèves par nom avec résultats paginés
- Consultation de l'historique d'un élève (classes, présences, notes)
- **Backend API coverage:** ✅ CRUD complet sur /students + enroll/unenroll sur /classes/{id}/students

**FR6 - Gestion des Créneaux Horaires (Time Slots)**
- Définition de créneaux horaires réutilisables avec heure de début, fin et durée
- Marquage de créneaux comme "pause" (non utilisables pour planification)
- Ordre d'affichage personnalisable pour l'interface calendrier
- Jour de la semaine associé pour les templates hebdomadaires
- **Backend API coverage:** ✅ CRUD complet sur /time-slots

**FR7 - Templates Hebdomadaires de Sessions**
- Création de templates hebdomadaires définissant les cours récurrents
- Association template → classe + matière + créneau horaire + jour de la semaine
- Génération automatique de sessions réelles à partir des templates
- Modification et suppression de templates
- **Backend API coverage:** ✅ CRUD complet sur /weekly-templates

**FR8 - Planification et Gestion des Sessions de Cours**
- Création de sessions de cours avec date, créneau horaire, classe et matière
- Validation automatique : pas de conflit de planning, pas sur créneau de pause
- Statuts de session : planifiée, terminée, annulée, reportée
- Reprogrammation de sessions avec détection de conflits
- Consultation enrichie avec détails classe, matière, créneau, présences
- Filtrage par classe, matière, plage de dates, statut
- **Backend API coverage:** ✅ CRUD complet sur /course-sessions avec validation

**FR9 - Suivi des Présences par Session**
- Enregistrement de la présence/absence pour chaque élève inscrit dans la classe
- Saisie de participation (niveaux : faible, moyenne, élevée)
- Capture du comportement (positif, neutre, négatif)
- Statut caméra (activée, désactivée, problème technique)
- Notes textuelles libres par élève et par session
- Indicateur de problèmes techniques rencontrés
- Vue récapitulative des présences par session
- Mise à jour en lot (PUT) pour saisie rapide post-session
- **Backend API coverage:** ✅ GET/PUT /sessions/{id}/attendance

**FR10 - Analytics et Statistiques Élèves**
- Calcul du taux de présence global par élève sur période donnée
- Analyse comportementale automatique (tendances, patterns)
- Analyse académique (progression, forces, faiblesses)
- Vue agrégée des analytics de tous les élèves d'une classe
- Tri par différents critères (nom, présence, participation)
- Filtrage temporel flexible (date début/fin personnalisables)
- **Backend API coverage:** ✅ GET /students/{id}/attendance-rate, GET /classes/{id}/students/analytics
- **Frontend services:** ✅ behavioral-analysis-service, academic-analysis-service

**FR11 - Gestion des Examens et Évaluations**
- Création d'examens avec titre, date, classe, matière, année scolaire
- Définition du barème : points maximum, coefficient
- Marquage examens comme publiés/non-publiés
- Catégories d'examens (contrôle, devoir maison, oral, projet)
- Listing avec filtres avancés : classe, matière, plage de dates, statut publication
- Consultation des examens par classe ou par matière
- **Backend API coverage:** ✅ CRUD complet sur /exams avec filtres riches

**FR12 - Saisie et Gestion des Résultats d'Examens**
- Saisie des résultats par élève : points obtenus, commentaire optionnel
- Marquage élève comme absent à l'examen
- Upsert (create or update) en masse pour saisie rapide de toute une classe
- Validation : points obtenus ≤ points maximum de l'examen
- Effacement de commentaires (null) pour révision
- Listing paginé des résultats d'un examen
- **Backend API coverage:** ✅ PUT /exams/{id}/results (upsert batch), GET /exams/{id}/results

**FR13 - Statistiques d'Examens**
- Calcul automatique de statistiques d'examen : moyenne, médiane, min, max
- Distribution des notes (quartiles, percentiles)
- Taux de réussite selon seuil défini
- Nombre d'élèves présents vs absents
- **Backend API coverage:** ✅ GET /exams/{id}/stats

**FR14 - Génération Automatique de Rapports Bihebdomadaires**
- Génération automatique de rapports pour les parents toutes les 2 semaines
- Contenu : synthèse présences, participation, comportement, notes récentes
- Ton bienveillant et constructif garanti par système de phrases templates
- Personnalisation par élève basée sur analytics comportementales et académiques
- Révision manuelle possible avant finalisation
- Export PDF par élève avec mise en forme professionnelle
- **Frontend coverage:** ✅ Feature appreciations avec hooks, mocks, services

**FR15 - Génération Automatique d'Appréciations Trimestrielles**
- Génération d'appréciations de bulletins scolaires en fin de trimestre
- Synthèse complète sur période académique : présence, participation, progression, résultats
- Style rédactionnel adapté aux bulletins officiels (formel, bienveillant)
- Suggestions de pistes d'amélioration personnalisées
- Édition manuelle avec préservation de la structure
- Export batch pour toute une classe
- **Frontend coverage:** ✅ Feature appreciations + student-profile-service

**FR16 - Banque de Phrases et Guides de Style**
- Bibliothèque de phrases templates catégorisées (présence, comportement, progrès, difficultés)
- Guides de style configurables (ton, niveau de formalité, longueur)
- Association contexte → phrases appropriées (bonne présence, progrès notable, etc.)
- Modification et ajout de nouvelles phrases/styles
- **Frontend coverage:** ✅ useStyleGuides, usePhraseBank hooks

**FR17 - Tableau de Bord Enseignant**
- Vue d'ensemble des classes, élèves, sessions à venir
- Statistiques récapitulatives : taux de présence moyen, sessions de la semaine
- Alertes : élèves en difficulté, rapports à générer, examens à corriger
- Accès rapide aux fonctionnalités principales
- Calendrier visuel des sessions planifiées
- **Frontend coverage:** ✅ Feature accueil avec dashboard

**FR18 - Calendrier et Vue Planning**
- Visualisation calendrier mensuel/hebdomadaire des sessions
- Affichage des créneaux horaires avec codage couleur par matière/classe
- Navigation temporelle fluide (semaine précédente/suivante)
- Détails session au survol/clic
- Création rapide de session depuis le calendrier
- **Frontend coverage:** ✅ Feature calendar avec use-calendar, use-timeslots

**FR19 - Export et Sauvegarde des Données**
- Export manuel de toutes les données en format structuré (JSON/CSV)
- Sauvegarde automatique périodique (hebdomadaire recommandé)
- Export PDF individuel des rapports et appréciations
- Archivage des années scolaires complètes
- Restauration depuis backup en cas de besoin

**FR20 - Sélection de Contexte (Classe/Matière)**
- Sélection globale classe + matière active pour contextualiser l'interface
- Persistence de la sélection entre sessions utilisateur
- Filtrage automatique des données selon contexte sélectionné
- Indicateur visuel du contexte actif dans toute l'application
- **Frontend coverage:** ✅ ClassSelectorDropdown + class-selection-context

### Non-Functional Requirements

**NFR1 - Performance et Réactivité de l'Interface**
- Temps de chargement initial de l'application ≤ 2 secondes
- Navigation entre pages ≤ 300ms (transition instantanée perçue)
- Saisie des présences post-session complétée en ≤ 2 minutes pour 30 élèves
- Génération de rapport bihebdomadaire ≤ 10 secondes par élève
- Génération d'appréciation trimestrielle ≤ 15 secondes par élève
- **Justification**: Efficacité administrative requiert fluidité pour adoption

**NFR2 - Fiabilité et Disponibilité (Mission-Critical)**
- Taux de disponibilité backend API ≥ 99.5% en phase production
- Mode dégradé local-first : fonctionnement hors ligne avec synchronisation différée
- RPO (Recovery Point Objective) = 0 : aucune perte de donnée acceptable
- RTO (Recovery Time Objective) < 5 minutes : restauration rapide après incident
- Sauvegarde automatique toutes les 15 minutes en local
- Export backup hebdomadaire automatique validé
- **Justification**: Données pédagogiques critiques, zéro tolérance à la perte

**NFR3 - Sécurité et Confidentialité des Données**
- Authentification sécurisée avec cookie HttpOnly, SameSite=Strict
- Hachage mots de passe avec bcrypt (cost factor ≥ 12)
- HTTPS obligatoire en production (TLS 1.3 minimum)
- Isolation stricte des données enseignant (pas d'accès cross-teacher)
- Conformité RGPD : droit à l'oubli, export données, minimisation des données
- Logs d'audit pour actions sensibles (modification notes, suppression élèves)
- **Justification**: Données d'élèves mineurs, obligations légales strictes

**NFR4 - Utilisabilité et Accessibilité**
- Interface 100% en français (langue maternelle utilisatrice)
- Design responsive : desktop (primaire), tablette (secondaire), mobile (consultation)
- Contraste couleurs conforme WCAG 2.1 niveau AA minimum
- Navigation clavier complète (accessibilité)
- Pas de courbe d'apprentissage : utilisabilité immédiate pour utilisatrice non-technique
- Messages d'erreur clairs et actionnables en français
- **Justification**: Adoption critique, utilisatrice unique non-technique

**NFR5 - Maintenabilité et Qualité du Code**
- Architecture modulaire : Atomic Design + Feature-Based
- Documentation inline pour logique métier complexe
- Biome linting : 0 erreur critique avant commit
- Commits atomiques avec messages descriptifs conventionnels
- TypeScript strict mode activé : typage exhaustif
- **Justification**: Développement solo, maintenance long terme

**NFR6 - Scalabilité et Évolution**
- Architecture découplée frontend/backend pour évolution indépendante
- API REST versionnée (prête pour v2, v3)
- Schéma base de données avec migrations versionnées
- Support multi-tenant dans design backend (activation future)
- Extensibilité : système de plugins pour templates/guides de style
- **Justification**: Vision long terme plateforme commercialisable

**NFR7 - Compatibilité et Interopérabilité**
- Navigateurs supportés : Chrome/Edge (≥2 dernières versions), Firefox (≥2 dernières versions), Safari (≥2 dernières versions)
- Export PDF conforme standards : PDF/A pour archivage long terme
- Export données structurées : JSON et CSV pour interopérabilité
- API RESTful avec OpenAPI 3.0.3 spec complète
- Préparation intégration LMS (Moodle, Canvas) : webhooks et OAuth2
- **Justification**: Interopérabilité future, exports légaux

**NFR8 - Localisation et Internationalisation (i18n)**
- Interface française par défaut (MVP)
- Architecture i18n prête pour multilingue (anglais, espagnol en roadmap)
- Formats dates/heures localisés (format français : DD/MM/YYYY)
- Devise et notation adaptables (système français : /20, /10, lettres A-E)
- **Justification**: Expansion géographique future

**NFR9 - Observabilité et Monitoring**
- Logs structurés (JSON) avec niveaux (ERROR, WARN, INFO, DEBUG)
- Métriques techniques : temps de réponse API, taux d'erreur, usage mémoire
- Métriques métier : taux d'adoption, fonctionnalités utilisées, temps de saisie
- Alertes automatiques : erreurs critiques, backups échoués, disk space < 10%
- Dashboard monitoring pour l'enseignante : usage hebdomadaire, alertes élèves
- **Justification**: Détection proactive problèmes, amélioration continue

**NFR10 - Conformité Légale et Réglementaire**
- Conformité RGPD complète : consentement, droit accès/rectification/effacement
- Conformité FERPA (USA) si expansion internationale : confidentialité dossiers éducatifs
- Rétention données limitée : 3 ans post-année scolaire, puis archivage/suppression
- Consentement parental requis pour données élèves mineurs (<15 ans France)
- Mentions légales et politique de confidentialité accessibles
- **Justification**: Obligations légales éducation, données mineurs

**NFR11 - Expérience Développeur (DX)**
- Temps de build dev (Turbopack) ≤ 3 secondes
- Hot Module Replacement (HMR) < 500ms
- Documentation API backend complète (Swagger UI accessible)
- Scripts npm clairs : dev, build, test, lint, format
- Environnement dev 100% local (pas de dépendance cloud pour développement)
- **Justification**: Productivité développeur solo, itérations rapides

**NFR12 - Coût et Efficience Ressources**
- Coût hébergement MVP ≤ 20€/mois (VPS ou PaaS tier gratuit)
- Utilisation mémoire backend ≤ 512MB en production (utilisateur unique)
- Utilisation stockage ≤ 5GB par année scolaire (30 élèves × 3 classes)
- Optimisation bundle frontend : initial load ≤ 500KB gzippé
- Pas de dépendance services payants externes pour MVP
- **Justification**: Viabilité économique projet personnel/solo

## User Journeys

**Journey 1 : Workflow Hebdomadaire Typique de l'Enseignante**

*Persona : Marie, 38 ans, enseignante d'anglais en ligne, enseigne 15 heures/semaine à 3 classes (60 élèves total)*

**Lundi Matin (Préparation de la Semaine)**
1. Marie se connecte à **outil-professor** via son navigateur desktop
2. **Tableau de bord** : Elle voit son planning de la semaine avec 12 sessions programmées
3. Elle vérifie les **alertes** : 3 élèves avec taux de présence < 70%, 2 examens à corriger
4. Elle clique sur "Calendrier" pour avoir une vue d'ensemble visuelle
   - **Point de décision** : Une session Mercredi 14h est marquée "conflit" (férié oublié)
   - **Action** : Elle reprogramme la session au Jeudi 15h via drag-and-drop
   - **Validation** : Système confirme, pas de conflit, notifications envoyées

**Lundi 10h (Première Session de la Semaine - Classe 5ème A)**
5. 10 minutes avant la session, elle ouvre la page **Sessions** et sélectionne la session du jour
6. Elle voit la liste des 20 élèves inscrits, tous marqués "statut inconnu"
7. Elle lance sa visio sur autre écran et démarre le cours

**Lundi 10h55 (Fin de Session - Saisie Rapide)**
8. Elle revient sur **outil-professor**, page "Présences" pour la session terminée
9. **Saisie en lot rapide** (≤ 2 minutes pour 20 élèves) :
   - Marque 18/20 élèves présents (2 absents avec notification automatique parents)
   - Note participation : 12 "élevée", 4 "moyenne", 2 "faible"
   - Comportement : 16 "positif", 2 "neutre", 0 "négatif"
   - Statut caméra : 15 "activée", 3 "désactivée" (dont 1 pour problème technique noté)
   - Ajoute note textuelle pour 3 élèves : "Excellent oral", "Distrait aujourd'hui", "Problème micro"
10. Clique "Enregistrer" → **Confirmation** instantanée, retour au dashboard
11. Elle voit la session marquée "✅ Complétée" dans son calendrier

**Mardi 14h30 (Correction Examen de Vocabulaire - Classe 3ème B)**
12. Elle ouvre la page **Évaluations**, sélectionne l'examen "Contrôle Vocabulaire Unité 3" (28 élèves)
13. Clique "Saisir les résultats" → Interface de saisie batch
14. **Saisie rapide en tableau** :
    - Entre les notes sur 20 pour les 26 élèves présents
    - Marque 2 élèves "absents" avec raison
    - Ajoute commentaires pour 5 élèves (félicitations ou encouragements)
15. Clique "Enregistrer" → **Statistiques automatiques** s'affichent :
    - Moyenne classe : 14.2/20, Médiane : 15/20
    - Taux de réussite (≥10) : 89%
    - Distribution visualisée en graphique
16. **Point de décision** : Elle remarque 3 élèves < 8/20
    - Elle ouvre leurs profils élèves individuels
    - Consulte l'historique : tendance de baisse récente détectée
    - Ajoute note dans observations : "À surveiller, proposer soutien"

**Vendredi 16h (Génération Rapports Bihebdomadaires)**
17. Dashboard affiche **alerte** : "Rapports bihebdomadaires à générer (15 jours écoulés)"
18. Elle ouvre la page **Appréciations**, sélectionne "Classe 5ème A"
19. Clique "Générer rapports bihebdomadaires pour tous les élèves"
20. **Système travaille** (≤ 10 sec/élève = ~3min pour 20 élèves) :
    - Analyse automatique présences, participation, comportement, notes récentes
    - Génération de commentaires bienveillants personnalisés
    - Application des guides de style configurés
21. **Écran de révision batch** : Liste des 20 rapports générés avec aperçu
22. **Workflow de validation** :
    - Elle survole chaque rapport (lecture rapide)
    - Modifie manuellement 3 rapports (5% du contenu) pour ajuster ton
    - Valide les 17 autres sans modification
    - **Point de décision critique** : Rapport de Léa semble générique
      - Elle ouvre l'éditeur, ajoute phrase personnalisée sur progrès oral récent
      - Sauvegarde la modification
23. Clique "Exporter tous les rapports en PDF"
24. **Système génère** 20 PDFs individuels en < 30 secondes
25. Elle télécharge le ZIP, envoie les PDFs aux parents via email habituel
26. **Temps total** : 15 minutes pour 20 rapports (vs 2-3h manuellement) ✅ **Objectif atteint**

**Résultat de la Semaine**
- 12 sessions animées et suivies
- 60 présences enregistrées (temps total saisie : ~24 minutes)
- 1 examen corrigé et analysé
- 20 rapports bihebdomadaires générés et envoyés
- **Temps administratif hebdomadaire** : ~2h30 (vs 5h avant) ✅ **Réduction de 50%**

---

**Journey 2 : Préparation Fin de Trimestre (Appréciations Bulletins)**

*Même persona : Marie, en décembre, doit produire appréciations trimestrielles pour bulletins officiels de 60 élèves*

**J-7 : Vérification de la Complétude des Données**
1. Marie ouvre **outil-professor** et va sur "Paramètres / Périodes Académiques"
2. Elle vérifie que le "Trimestre 1" est bien défini (Sept-Déc) et marqué actif
3. Retour au Dashboard → Onglet "Statistiques Trimestrielles"
4. **Système affiche rapport de complétude** :
   - ✅ Classe 5ème A : 36/36 sessions enregistrées (100%)
   - ⚠️ Classe 4ème B : 33/36 sessions (92% - 3 sessions sans données de présence)
   - ✅ Classe 3ème C : 34/36 sessions (94%)
   - ⚠️ Examens : 8/10 examens corrigés (2 examens finaux en attente)
5. **Point de décision** : Données incomplètes Classe 4ème B
   - Elle ouvre le calendrier, identifie les 3 sessions
   - **Action corrective** : Elle complète rétrospectivement les présences depuis ses notes papier
   - Re-vérifie la complétude → ✅ Passe à 100%

**J-2 : Correction des Derniers Examens**
6. Elle termine la correction des 2 examens finaux via interface **Évaluations**
7. Consulte les statistiques d'examen pour identifier élèves en difficulté
8. Ajoute notes dans profils élèves concernés pour référence bulletins

**J-Day : Génération Massive des Appréciations Trimestrielles**
9. Marie ouvre la page **Appréciations**
10. Sélectionne "Génération Appréciations Trimestrielles"
11. **Configuration** :
    - Période : Trimestre 1 (Sept-Déc 2024)
    - Classes : Sélectionne les 3 classes (60 élèves total)
    - Style : "Formel - Bulletin Officiel" (vs "Informel - Parents")
    - Longueur : "Standard (80-120 mots)"
12. Clique "Générer pour toutes les classes sélectionnées"
13. **Système travaille intensément** (~15 sec/élève = 15 minutes pour 60 élèves) :
    - Pour chaque élève, analyse complète du trimestre :
      * Taux de présence global (36 sessions)
      * Moyenne de participation (tendance sur 3 mois)
      * Évolution comportementale (amélioration/stagnation/régression)
      * Résultats académiques (moyenne examens, progression)
      * Forces identifiées (champ profil élève)
      * Besoins particuliers (pris en compte dans formulation)
    - **Génération IA** de l'appréciation :
      * Phrase d'ouverture adaptée au profil
      * Corps structuré : présence → participation → résultats → comportement
      * Pistes d'amélioration constructives et bienveillantes
      * Phrase de conclusion encourageante
    - Application guide de style "Formel" : vocabulaire soutenu, ton professionnel
14. **Écran de révision** : Interface à 3 colonnes
    - Gauche : Liste des 60 élèves (tri par classe puis nom)
    - Centre : Appréciation générée pour élève sélectionné + données sous-jacentes
    - Droite : Statistiques de l'élève (graphiques présence, notes, participation)

**J-Day+1 : Révision et Personnalisation (Travail par Classe)**
15. **Classe 5ème A (20 élèves)** - Révision ~30 minutes
    - Elle lit chaque appréciation une par une
    - **Catégorisation mentale** :
      * 12 élèves : Appréciations parfaites, aucune modification ✅
      * 5 élèves : Ajustements mineurs (reformulation d'une phrase, ajout détail)
      * 3 élèves : Révision significative (10-15% du texte modifié pour personnalisation)
    - Pour chaque modification, elle utilise l'éditeur intégré
    - **Point de décision** : Appréciation de Thomas semble trop générique
      * Elle consulte ses notes personnelles (champ observations)
      * Ajoute paragraphe sur progrès remarquable en expression écrite ce trimestre
      * Sauvegarde
    - Marque la classe 5ème A comme "Validée"

16. **Classe 4ème B (18 élèves)** - Révision ~25 minutes
    - Processus similaire, 14 validées directement, 4 ajustées

17. **Classe 3ème C (22 élèves)** - Révision ~35 minutes
    - Processus similaire, 17 validées directement, 5 ajustées
    - **Point de friction** : Appréciation de Sarah (élève avec besoins particuliers)
      * L'IA a bien pris en compte ses difficultés, mais ton trop compatissant
      * Marie réécrit pour mettre l'accent sur les forces et progrès réalisés
      * Supprime mention explicite des difficultés (déjà documenté ailleurs)

**J-Day+2 : Export et Intégration Bulletins**
18. Les 60 appréciations sont validées
19. Elle clique "Exporter toutes les appréciations validées"
20. **Options d'export** :
    - Format : CSV (pour import dans logiciel bulletins de l'école) ✅ Sélectionné
    - Alternative : PDF individuels (pour consultation ultérieure)
21. Système génère fichier CSV structuré : `nom, prénom, classe, appréciation_trimestre_1`
22. Elle télécharge le CSV, l'importe dans le système de bulletins de l'école (hors outil-professor)
23. **Archivage** : Elle crée aussi un backup PDF de toutes les appréciations pour ses archives personnelles

**Bilan Fin de Trimestre**
- **Temps total génération appréciations** :
  * Génération automatique : 15 minutes (60 élèves)
  * Révision et personnalisation : 90 minutes (3 classes)
  * Export et intégration : 10 minutes
  * **TOTAL : ~2h pour 60 appréciations**
- **Comparaison baseline** : 3-4h manuellement pour 20-30 élèves → 6-8h pour 60 élèves
- **Réduction réelle** : ~75% de gain de temps ✅ **Dépasse l'objectif de 70%**
- **Qualité perçue** : Appréciations plus cohérentes, langage bienveillant garanti, zéro oubli de données importantes
- **Charge mentale** : Stress réduit, pas de nuits blanches avant la deadline bulletins

---

**Journey 3 : Gestion d'un Élève en Difficulté (Vue Longitudinale)**

*Focus sur le suivi d'un élève spécifique sur plusieurs semaines*

**Semaine 1 - Détection Automatique**
1. Tableau de bord affiche **alerte** : "⚠️ 2 élèves avec taux de présence < 75%"
2. Marie clique sur l'alerte → Liste des élèves concernés
3. Elle clique sur "Lucas Martin - 5ème A" → **Profil élève détaillé**
4. **Vue Analytics** :
   - Taux de présence : 65% (13/20 sessions depuis début année)
   - Tendance participation : En baisse (7 dernières sessions moyenne "faible")
   - Tendance comportement : Majoritairement "neutre", 2 sessions "négatif" récentes
   - Résultats examens : 2 examens, notes 8/20 et 11/20
   - **Graphique temporel** : Visualisation claire de la dégradation sur 6 semaines
5. **Analyse comportementale automatique** (service frontend) :
   - "Pattern détecté : Désengagement progressif depuis mi-octobre"
   - "Facteurs contributifs : Absences répétées les lundis (possiblement problème familial ou santé)"
   - "Participation réduite même lorsque présent (perte de motivation ?)"
6. **Point de décision** : Marie doit intervenir
   - Elle clique "Ajouter observation" dans le profil élève
   - Note : "16/11 - Discuté avec Lucas après session, mentionne fatigue. Contacter parents."
   - Marque un flag "À surveiller" sur le profil

**Semaine 2-3 - Suivi et Actions**
7. Marie contacte les parents (hors système)
8. Parents expliquent : Difficultés familiales temporaires, enfant épuisé
9. Mise en place plan : Réduction temporaire charge de travail, soutien péda
10. Marie retourne sur profil Lucas, section "Besoins particuliers"
11. **Mise à jour** : "Nov 2024 - Situation familiale difficile, besoin soutien et bienveillance. Plan adapté en place."
12. Les semaines suivantes, lors de saisie présences sessions Lucas :
    - Elle est particulièrement attentive, ajoute notes détaillées post-session
    - "18/11 - Plus participatif aujourd'hui, sourit davantage"
    - "22/11 - Présent et caméra activée, bonne participation orale"
    - "25/11 - Excellent travail sur exercice de groupe"

**Semaine 5-6 - Amélioration et Validation**
13. Début décembre, Marie consulte à nouveau le profil Lucas
14. **Analytics mis à jour automatiquement** :
    - Taux de présence : Remonté à 80% (16/20 sessions - 3 nouvelles présences)
    - Tendance participation : **Amélioration notable** (5 dernières sessions "moyenne" à "élevée")
    - Tendance comportement : Retour à majoritairement "positif"
    - Prochain examen à venir : Occasion de valider la remontée
15. **Graphique temporel** montre clairement la remontée en courbe en J
16. Marie prépare le rapport bihebdomadaire de Lucas
17. Lors de génération automatique, **système intègre** :
    - Historique complet des 2 dernières semaines (données fraîches)
    - Observations manuelles de Marie (notes positives récentes)
    - Amélioration détectée par analytics comportementales
18. **Rapport généré** met l'accent sur les progrès récents, ton encourageant
19. Marie le valide avec petite personnalisation finale
20. Envoi aux parents → Feedback positif, parents reconnaissants de l'attention portée

**Fin de Trimestre - Appréciation Bulletin**
21. Lors de génération des appréciations trimestrielles, profil Lucas est complet :
    - Données quantitatives sur tout le trimestre (bonnes et mauvaises périodes)
    - Observations qualitatives de Marie (contexte, actions, amélioration)
    - Besoins particuliers documentés (situation familiale temporaire)
22. **Appréciation générée** reflète parcours complet :
    - Reconnaît début de trimestre difficile avec bienveillance
    - Met en valeur la remontée et les efforts fournis
    - Ton encourageant pour le trimestre suivant
23. Marie valide l'appréciation avec modification mineure
24. Parents satisfaits de la compréhension et du soutien apportés

**Bénéfices de ce Journey**
- **Détection proactive** : Alertes automatiques empêchent oubli d'élèves en difficulté
- **Vue longitudinale** : Graphiques et analytics fournissent contexte temporel clair
- **Documentation centralisée** : Toutes observations et actions au même endroit
- **Impact sur génération de contenu** : Rapports et appréciations reflètent parcours réel et nuancé
- **Relation enseignante-élève** : Suivi personnalisé facilité par les outils, améliore outcomes

## UX Design Principles

**UXP1 - Efficacité Avant Tout ("Speed is a Feature")**
- Toute action fréquente doit être optimisée pour la vitesse : saisie présences ≤ 2min, génération rapports ≤ 15min
- Raccourcis clavier pour actions courantes (Tab pour navigation, Enter pour valider, Esc pour annuler)
- Saisie en lot privilégiée : batch update pour présences, résultats d'examens, validation rapports
- Retours visuels immédiats : confirmations instantanées, pas d'attente inutile
- **Rationale** : L'objectif principal est la réduction du temps administratif de 50%, la rapidité est critique pour l'adoption

**UXP2 - Clarté et Simplicité ("Don't Make Me Think")**
- Interface en français clair et naturel : vocabulaire pédagogique familier (classe, élève, session, présence)
- Hiérarchie visuelle forte : titres, sous-titres, espacements généreux, typographie lisible (16px minimum body text)
- Pas plus de 2 niveaux de navigation : Dashboard → Feature page → Detail view
- Actions principales toujours visibles : boutons primaires en haut à droite, couleur distinctive
- Messages d'erreur actionnables : "Le créneau 14h est déjà occupé. Choisir 15h ou 16h ?" vs "Erreur de conflit"
- **Rationale** : Utilisatrice non-technique, pas de temps pour courbe d'apprentissage, usage quotidien doit être fluide

**UXP3 - Contexte Persistant et Cohérent**
- Sélection Classe/Matière visible en permanence dans header (ClassSelectorDropdown)
- Toutes les vues filtrées automatiquement selon contexte sélectionné
- Breadcrumb navigation pour se situer : Dashboard > Sessions > Session du 15/11 > Présences
- Indicateurs d'état visuels partout : session "✅ Complétée", rapport "🟡 Brouillon", examen "📊 Publié"
- Cohérence terminologique absolue : même mot pour même concept à travers toute l'app
- **Rationale** : L'enseignante jongle entre 3 classes et plusieurs matières, le contexte doit être clair en permanence

**UXP4 - Prévention et Récupération d'Erreurs**
- Validation en temps réel avec feedback immédiat : "Points obtenus (14) > Maximum (10) ⚠️"
- Confirmations pour actions destructives : "Supprimer l'élève Lucas Martin ? Cette action est irréversible."
- Détection de conflits proactive : calendrier montre conflit AVANT création session
- Undo/Redo pour actions importantes : modification notes, suppression données
- **Rationale** : Données pédagogiques critiques, zéro tolérance aux pertes, erreurs humaines inévitables

**UXP5 - Feedback et Affordance Riches**
- États de boutons explicites : Enabled (bleu), Hover (bleu foncé), Loading (spinner), Disabled (gris avec tooltip explication)
- Animations subtiles et purposeful : fade-in pour alertes, slide-in pour panneaux latéraux, skeleton loading
- Toast notifications pour confirmations : "20 présences enregistrées ✅" (disparaît après 3sec)
- Progress indicators pour opérations longues : "Génération rapports : 12/20 élèves (60%)"
- Empty states constructifs : "Aucun examen ce trimestre. Créer le premier examen ?" (avec bouton CTA)
- **Rationale** : L'utilisatrice doit toujours savoir ce qui se passe, ce qui est cliquable, ce qui change

**UXP6 - Optimisation pour Tâches Récurrentes**
- Templates et defaults intelligents : valeurs pré-remplies basées sur historique (horaires habituels, classes fréquentes)
- Actions bulk où approprié : "Marquer tous présents puis ajuster les absents" vs saisir 30 fois "présent"
- Duplication et réutilisation : "Dupliquer cette session pour la semaine prochaine", "Réutiliser ce guide de style"
- Keyboard-first pour power users : Tab navigation fluide, Enter=Submit, Esc=Cancel, Ctrl+S=Save
- Mémorisation des préférences : tri par défaut, filtres récents, dernière classe sélectionnée
- **Rationale** : Même workflow toutes les semaines, optimiser le quotidien maximise les gains de productivité

**UXP7 - Transparence et Confiance dans l'Automatisation**
- Commentaires générés IA toujours visibles AVANT validation : écran de révision avec diff si modifié
- Données sources affichées à côté du contenu généré : appréciation élève + graphiques présence/notes
- Explications des calculs : "Taux de présence : 16 sessions présentes / 20 sessions total = 80%"
- Option de modification manuelle TOUJOURS disponible : éditeur richtext pour rapports/appréciations
- Historique des modifications : "Généré automatiquement le 15/11, édité manuellement le 16/11"
- **Rationale** : L'IA assiste mais ne remplace pas, l'enseignante garde contrôle et responsabilité finale

**UXP8 - Design Responsive et Adaptatif**
- Layout prioritaire : Desktop (primaire), Tablette (secondaire), Mobile (consultation uniquement)
- Adaptation intelligente : Dashboard en grille 3 colonnes (desktop) → 2 colonnes (tablette) → 1 colonne (mobile)
- Touch-friendly sur tablette : boutons ≥44px, espacement généreux, swipe gestures pour navigation
- Breakpoints clairs : Desktop (≥1024px), Tablette (768-1023px), Mobile (< 768px)
- Mode consultation mobile : lecture rapports, consultation profils élèves, calendrier simplifié (pas de saisie complexe)
- **Rationale** : Enseignement souvent sur desktop mais consultation en mobilité (tablette en classe, téléphone en déplacement)

**UXP9 - Accessibilité et Inclusivité**
- Contraste couleurs ≥4.5:1 (WCAG AA) : texte lisible sur tous fonds
- Navigation clavier complète : focus visible, ordre logique, shortcuts documentés
- Labels explicites et ARIA : screen reader friendly pour future expansion accessibilité
- Pas de dépendance couleur seule : icônes + couleur + texte (ex : ✅ Présent en vert, ❌ Absent en rouge)
- Tailles de police ajustables : respect des préférences navigateur, zoom jusqu'à 200% sans perte de fonctionnalité
- **Rationale** : Bonnes pratiques standards, préparation pour utilisateurs avec besoins spécifiques

**UXP10 - Découvrabilité Progressive et Onboarding**
- First-time user experience (FTUE) : tour guidé optionnel à la première connexion
- Tooltips contextuels : hover sur icône "?" pour explication features avancées
- Empty states éducatifs : "Créez votre première classe pour commencer" avec guide étape par étape
- Documentation intégrée : liens "En savoir plus" vers guide utilisateur dans l'app
- Progressive disclosure : features avancées cachées derrière "Options avancées" pour ne pas surcharger
- **Rationale** : Utilisatrice découvre l'outil progressivement, pas besoin de lire manuel 50 pages avant de commencer

## Epics

**Epic 1 : Fondations et Gestion Administrative de Base** (Stories: 1-6, Timeline: Sprint 1-2, 3-4 semaines)

Établir les fonctionnalités de base permettant à l'enseignante de configurer son environnement pédagogique et de gérer les entités fondamentales.

**Objectifs**:
- Configuration initiale complète : années scolaires, périodes, créneaux horaires
- Gestion CRUD des entités core : classes, matières, élèves
- Authentification et profil enseignant fonctionnels
- Backend API endpoints opérationnels pour toutes entités de base

**Valeur Livrée**:
- L'enseignante peut créer et organiser ses classes, inscrire ses élèves, définir ses matières
- Structure de données prête pour capture des données pédagogiques
- Base technique solide pour epics suivants

**Critères de Succès**:
- ✅ Création de 3 classes avec 60 élèves répartis fonctionnelle
- ✅ Définition année scolaire 2024-2025 avec 3 trimestres
- ✅ Configuration créneaux horaires récurrents (8h-18h, pauses incluses)
- ✅ 0 bug bloquant sur gestion élèves/classes
- ✅ Temps moyen création classe + inscription 20 élèves < 10 minutes

---

**Epic 2 : Planning et Suivi des Sessions de Cours** (Stories: 7-12, Timeline: Sprint 3-4, 3-4 semaines)

Implémenter le système complet de planification des sessions, de saisie des présences et de suivi participation/comportement.

**Objectifs**:
- Calendrier visuel des sessions avec templates hebdomadaires
- Planification sessions avec détection conflits et validation créneaux
- Interface de saisie rapide des présences (batch update ≤ 2min pour 30 élèves)
- Capture données participation, comportement, caméra, problèmes techniques
- Vue détaillée session avec liste élèves et données de présence

**Valeur Livrée**:
- L'enseignante peut planifier ses cours récurrents en quelques clics
- Saisie post-session ultra-rapide devient routine quotidienne
- Historique complet de présences et participation pour chaque élève
- Fondation data pour analytics et génération rapports

**Critères de Succès**:
- ✅ Création template hebdomadaire 12 sessions récurrentes < 5 minutes
- ✅ Saisie présences 30 élèves en ≤ 2 minutes (objectif clé)
- ✅ 0 conflit de planning non détecté (validation 100% fiable)
- ✅ Taux adoption saisie quotidienne ≥ 90% après 2 semaines

---

**Epic 3 : Évaluations et Suivi Académique** (Stories: 13-18, Timeline: Sprint 5-6, 3-4 semaines)

Construire le système complet de gestion des examens, saisie des résultats, analytics élèves et détection proactive des difficultés.

**Objectifs**:
- Création et gestion examens avec barèmes flexibles
- Saisie rapide résultats en batch avec validation (points ≤ max)
- Statistiques automatiques par examen (moyenne, médiane, distribution)
- Analytics élèves : taux présence, analyse comportementale, analyse académique
- Alertes automatiques : élèves en difficulté, présence < 75%, notes en baisse
- Profils élèves enrichis avec graphiques temporels et détections patterns

**Valeur Livrée**:
- Correction et saisie notes accélérée avec insights immédiats
- Détection proactive élèves en difficulté (alertes dashboard)
- Vue longitudinale complète de chaque élève (présence, participation, résultats)
- Données riches pour génération rapports et appréciations (Epic 4)

**Critères de Succès**:
- ✅ Saisie résultats 30 élèves d'un examen < 5 minutes
- ✅ Statistiques examen calculées et affichées en temps réel
- ✅ Analytics élèves mises à jour automatiquement après chaque saisie
- ✅ Alertes détection élèves en difficulté fonctionnent (100% des cas < 75% présence détectés)
- ✅ Graphiques temporels clairs et actionnables pour 100% des élèves

---

**Epic 4 : Génération Automatisée de Contenu Pédagogique** (Stories: 19-24, Timeline: Sprint 7-9, 4-5 semaines)

Implémenter le cœur de la valeur ajoutée : génération IA de rapports bihebdomadaires et d'appréciations trimestrielles avec système de phrases templates et guides de style.

**Objectifs**:
- Banque de phrases templates catégorisées et contextualisées
- Guides de style configurables (formel/informel, longueur, ton)
- Moteur génération rapports bihebdomadaires (≤ 10sec/élève)
- Moteur génération appréciations trimestrielles (≤ 15sec/élève)
- Interface révision batch avec édition inline
- Export PDF individuels et batch (ZIP pour classe complète)
- Export CSV pour intégration systèmes externes (bulletins école)

**Valeur Livrée**:
- Génération rapports parents 20 élèves en 15min vs 2-3h manuellement (✅ Objectif -50%)
- Génération appréciations trimestrielles 60 élèves en 2h vs 6-8h manuellement (✅ Objectif -70%)
- Qualité et cohérence garanties par templates et guides de style
- Personnalisation possible via édition manuelle avant export
- **Impact majeur : Réduction stress périodes d'évaluation**

**Critères de Succès**:
- ✅ Génération 20 rapports bihebdomadaires en < 15 minutes (machine + révision)
- ✅ Génération 60 appréciations trimestrielles en < 2 heures (machine + révision)
- ✅ 90% des commentaires nécessitent < 5% modification manuelle
- ✅ Ton bienveillant garanti dans 100% des cas (validation manuelle enseignante satisfaite ≥ 8/10)
- ✅ Export PDF fonctionnel pour 100% des rapports/appréciations

---

**Epic 5 : Dashboard, Expérience Utilisateur et Fiabilité** (Stories: 25-30, Timeline: Transversal Sprint 1-9 + Sprint 10 polish)

Construire l'interface unifiée, optimiser l'expérience utilisateur et garantir la fiabilité mission-critical du système.

**Objectifs**:
- Tableau de bord enseignant avec KPIs, alertes, accès rapides
- Sélection contexte classe/matière persistante (ClassSelectorDropdown)
- Navigation fluide et cohérente à travers toutes les features
- Export et sauvegarde données (backup manuel + auto hebdomadaire)
- Performance optimisée : chargement < 2sec, navigation < 300ms

**Valeur Livrée**:
- Point d'entrée unique et intuitif pour toute l'application
- Expérience fluide et efficace alignée sur les 10 UX principles
- Confiance absolue dans la persistance et sécurité des données
- Adoption facilitée par design centré utilisateur non-technique

**Critères de Succès**:
- ✅ Dashboard charge en < 2 secondes avec toutes statistiques
- ✅ Navigation entre pages < 300ms (perception instantanée)
- ✅ Sélection contexte fonctionne, filtrage automatique à travers app
- ✅ 0 perte de données pendant tout trimestre MVP (RPO=0 validé)
- ✅ Export backup hebdomadaire automatique fonctionne, récupération testée
- ✅ NPS utilisatrice ≥ 40 après premier trimestre complet d'utilisation

---

**Note sur la Séquence de Livraison:**

Les epics 1-3 forment le **MVP fonctionnel de base** (8-10 semaines) : l'enseignante peut gérer classes, planifier sessions, saisir présences, corriger examens, consulter analytics élèves.

L'Epic 4 délivre la **valeur différenciante majeure** (4-5 semaines) : génération automatique sauvant 2.5h/semaine.

L'Epic 5 est **transversal** : dashboard et UX sont construits progressivement, avec un sprint final de polish pour garantir l'expérience cohérente.

**Total estimé:** 12-14 semaines pour MVP complet avec génération IA opérationnelle.

*Voir [epics.md](./epics.md) pour décomposition détaillée en user stories avec critères d'acceptation.*

## Out of Scope

Les fonctionnalités suivantes sont explicitement **hors du périmètre du projet** et ne seront **jamais implémentées** :

**Fonctionnalités Explicitement Rejetées**

- **Application mobile native** (iOS/Android) : L'interface web responsive suffit définitivement
- **Portail élèves/parents** : Pas d'accès direct pour consultation en ligne, pas de login séparé
- **Collaboration temps réel** : Pas de co-enseignement, pas de partage classes entre enseignants, pas d'édition collaborative
- **Intégrations LMS externes** : Pas d'intégration Moodle, Canvas, Google Classroom, ni autres plateformes
- **Messagerie intégrée** : Pas de communication in-app avec parents/élèves
- **Système de notifications avancé** : Pas d'email/SMS automatiques pour absences, notes, rappels
- **Templates de rapports personnalisables** : Pas d'éditeur visuel pour formats custom
- **Visioconférence intégrée** : Outils dédiés externes (Zoom, Teams) restent séparés
- **Création de contenu pédagogique** : Pas de slides, exercices, quiz - hors cœur métier
- **Gamification élèves** : Pas de points, badges, leaderboards
- **Réseau social enseignants** : Pas de communauté, forums, ou partage social
- **Gestion financière** : Pas de facturation cours particuliers, pas de paiements

**Décisions Techniques Définitives**

- **Tests frontend automatisés** : Zéro fichier de test dans le codebase frontend (Next.js)
- **Tests backend** : Maintenus côté API Rust uniquement si déjà présents

**Fonctionnalités Post-MVP (Possibles si Besoin Validé)**

- **Multi-tenant SaaS** : Isolation données par enseignant si expansion vers plusieurs utilisateurs
- **Analytics prédictives ML** : Machine learning pour prédire risques décrochage (si ROI démontré)
- **Synchronisation cloud automatique** : Sync multi-appareils temps réel (actuellement local-first avec backup manuel)

---

## Next Steps

**Depuis ce PRD (outil-professor Level 3), voici les étapes immédiates :**

### Phase Immédiate : Architecture (REQUIS)

Puisque ce projet est **Level 3 (Full Product)** avec architecture full-stack complexe (Rust backend + Next.js frontend), **l'architecture doit être documentée AVANT le développement des user stories**.

**Action recommandée :**
1. **Démarrer nouvelle session avec architecte** (ou continuer dans ce contexte si tu le souhaites)
2. **Fournir documents d'entrée :**
   - Ce PRD : [PRD.md](./PRD.md)
   - Epic structure : [epics.md](./epics.md)
   - Product Brief : [product-brief-outil-professor-2025-10-13.md](./product-brief-outil-professor-2025-10-13.md)
   - OpenAPI spec backend : `http://localhost:3000/api-docs/openapi.json`
   - Analyse workflow : [project-workflow-analysis.md](./project-workflow-analysis.md)

3. **Demander à l'architecte de :**
   - Documenter l'architecture backend Rust existante (60+ endpoints)
   - Définir l'intégration frontend Next.js ↔ backend API
   - Spécifier stratégie local-first avec synchronisation backend
   - Concevoir système génération PDF
   - Architecturer moteur génération IA (templates + règles métier)
   - Créer schémas base de données (actuellement mocks → migration SQLite ou PostgreSQL)
   - Documenter stratégies sauvegarde et récupération (RPO=0, RTO<5min)

4. **Output attendu :** `docs/architecture.md`

### Checklist Complète

**✅ Phase 1 : Planification Produit (ACTUEL - COMPLÉTÉ)**
- [x] Product Brief créé et validé
- [x] Analyse du projet et classification Level 3
- [x] PRD complet généré (Description, Goals, Requirements, Journeys, UX Principles, Epics)
- [x] Epics.md détaillé généré avec user stories
- [ ] Validation PRD avec stakeholder (l'enseignante utilisatrice)

**🔄 Phase 2 : Architecture et Design (NEXT - REQUIS)**
- [ ] **Lancer workflow architecture** (nouvelle session recommandée)
- [ ] Architecture backend Rust documentée
- [ ] Architecture frontend Next.js + intégration API documentée
- [ ] Schéma base de données défini avec migrations
- [ ] Stratégie génération PDF spécifiée
- [ ] Système génération IA conçu (templates + analytics)
- [ ] Stratégies sauvegarde/récupération documentées
- [ ] Document architecture.md complet et validé

**📐 Phase 3 : Spécification UX (HAUTEMENT RECOMMANDÉ)**
- [ ] Lancer workflow UX specification
- [ ] Architecture d'information (IA) définie
- [ ] User flows détaillés pour 3 parcours critiques
- [ ] Wireframes/maquettes pour écrans principaux
- [ ] Composants UI catalogués (basé sur shadcn/ui existant)
- [ ] Guide de style visuel (couleurs, typographie, espacements)
- [ ] Document ux-specification.md complet

**📝 Phase 4 : Stories Détaillées**
- [ ] Affiner user stories depuis epics.md si nécessaire
- [ ] Compléter critères d'acceptation détaillés
- [ ] Estimations de complexité (points story ou heures)
- [ ] Priorisation stories par epic et dépendances
- [ ] Backlog prêt pour développement

**🏗️ Phase 5 : Préparation Développement**
- [ ] Configuration environnement dev (déjà en place, vérifier complétude)
- [ ] Définir stratégie de branches Git
- [ ] Setup CI/CD pipeline (build frontend, déploiement)
- [ ] Définir conventions commits (déjà conventionnels, documenter)
- [ ] Créer backlog dans outil de gestion (GitHub Projects, Linear, etc.)

**🚀 Phase 6 : Développement Itératif**
- [ ] Sprint 1-2 : Epic 1 (Fondations)
- [ ] Sprint 3-4 : Epic 2 (Sessions & Présences)
- [ ] Sprint 5-6 : Epic 3 (Évaluations & Analytics)
- [ ] Sprint 7-9 : Epic 4 (Génération IA)
- [ ] Sprint 10 : Epic 5 (Dashboard & Polish final)

**🧪 Phase 7 : Validation et Déploiement**
- [ ] Tests d'acceptation utilisateur (UAT avec l'enseignante)
- [ ] Correction bugs critiques
- [ ] Optimisation performance (objectifs NFR validés)
- [ ] Documentation utilisateur finale
- [ ] Formation utilisatrice
- [ ] Déploiement production
- [ ] Monitoring post-lancement

## Document Status

- [ ] Goals and context validated with stakeholders
- [ ] All functional requirements reviewed
- [ ] User journeys cover all major personas
- [ ] Epic structure approved for phased delivery
- [ ] Ready for architecture phase

_Note: See technical-decisions.md for captured technical context_

---

_This PRD adapts to project level 3 - providing appropriate detail without overburden._
