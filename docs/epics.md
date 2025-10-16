# outil-professor - Epic Breakdown

**Author:** Yusuf
**Date:** 2025-10-13
**Project Level:** 3 (Full Product)
**Target Scale:** 25-30 user stories réparties sur 5 epics

---

## Epic Overview

Ce projet est organisé en **5 epics majeurs** couvrant l'ensemble des fonctionnalités de l'application de gestion pédagogique **outil-professor**. La livraison est séquentielle avec quelques éléments transversaux.

### Séquence de Livraison

**Epics 1-3 : MVP Fonctionnel de Base** (8-10 semaines)
- Epic 1 : Fondations (3-4 semaines) → Gestion administrative de base
- Epic 2 : Sessions & Présences (3-4 semaines) → Planification et suivi quotidien
- Epic 3 : Évaluations & Analytics (3-4 semaines) → Examens et détection proactive

**Epic 4 : Valeur Différenciante** (4-5 semaines)
- Epic 4 : Génération IA (4-5 semaines) → Rapports automatisés et appréciations

**Epic 5 : Transversal + Polish** (Intégré + 1-2 semaines finales)
- Epic 5 : Dashboard & UX (Transversal) → Expérience unifiée et fiabilité

**Total estimé:** 12-14 semaines pour MVP complet opérationnel.

---

## Epic 1 : Fondations et Gestion Administrative de Base

**Timeline:** Sprint 1-2 (3-4 semaines)
**Stories:** 6 user stories
**Priorité:** CRITIQUE - Bloquant pour tous les autres epics

### Objectif de l'Epic

Établir les fondations du système : authentification, gestion des entités de base (années scolaires, classes, matières, élèves, créneaux horaires) et configuration initiale de l'environnement pédagogique.

### User Stories

#### Story 1.1 : Authentification Enseignant

**En tant qu'** enseignante,
**Je veux** créer un compte et me connecter de manière sécurisée,
**Afin de** protéger les données de mes élèves et accéder à mon environnement personnel.

**Critères d'acceptation:**
1. Formulaire d'inscription avec email, mot de passe, confirmation mot de passe, langue préférée (français par défaut)
2. Validation email unique (erreur si déjà existant)
3. Mot de passe fort requis (min 8 caractères, majuscule, chiffre, caractère spécial)
4. Après inscription, redirection vers login
5. Formulaire de login avec email + mot de passe
6. Cookie HttpOnly créé après login réussi, valide 30 jours
7. Erreur claire si identifiants invalides : "Email ou mot de passe incorrect"
8. Bouton "Déconnexion" visible dans header, supprime cookie et redirige vers login

**Notes techniques:**
- Backend API : POST /auth/register, POST /auth/login, GET /auth/me
- Cookie HttpOnly avec SameSite=Strict pour sécurité
- Pas de "mot de passe oublié" dans MVP (utilisateur unique)

---

#### Story 1.2 : Gestion des Années Scolaires et Périodes Académiques

**En tant qu'** enseignante,
**Je veux** définir l'année scolaire en cours et ses périodes académiques (trimestres),
**Afin de** contextualiser toutes mes données de suivi dans le bon cadre temporel.

**Critères d'acceptation:**
1. Page "Paramètres > Années Scolaires" accessible depuis menu
2. Bouton "Nouvelle année scolaire" ouvre formulaire : nom (ex: "2024-2025"), date début, date fin
3. Création année scolaire réussie affiche l'année dans la liste
4. Pour une année scolaire, bouton "Gérer les périodes" ouvre interface périodes
5. Bouton "Nouvelle période" : nom (ex: "Trimestre 1"), date début, date fin, checkbox "Actif"
6. Validation : périodes ne doivent pas se chevaucher
7. Une seule période peut être marquée "active" à la fois (auto-désactive les autres)
8. Période active est utilisée comme filtre par défaut dans le système

**Notes techniques:**
- Backend API : CRUD /school-years, CRUD /academic-periods
- Validation business logic : pas de chevauchement dates périodes
- Période active stockée en session utilisateur pour filtrages

---

#### Story 1.3 : Gestion des Classes

**En tant qu'** enseignante,
**Je veux** créer et gérer mes classes avec leurs caractéristiques,
**Afin d'** organiser mes élèves par groupes d'enseignement.

**Critères d'acceptation:**
1. Page "Gestion > Classes" liste toutes les classes avec code, libellé, année scolaire
2. Bouton "Nouvelle classe" ouvre formulaire : code unique (ex: "5A"), libellé (ex: "5ème A"), année scolaire (dropdown)
3. Validation : code unique par enseignant
4. Classe créée apparaît dans liste immédiatement
5. Clic sur une classe ouvre page détail avec infos + actions "Modifier" et "Supprimer"
6. Modification classe met à jour en temps réel (optimistic UI)
7. Suppression classe demande confirmation : "Supprimer la classe 5ème A ? Cette action est irréversible."
8. Suppression réussie retire classe de la liste (soft delete backend)

**Notes techniques:**
- Backend API : CRUD /classes avec ETag pour concurrence optimiste
- Soft delete : classe marquée deleted_at mais pas supprimée physiquement
- Filtrage par année scolaire dans liste classes

---

#### Story 1.4 : Gestion des Matières

**En tant qu'** enseignante,
**Je veux** définir les matières que j'enseigne,
**Afin de** les associer à mes classes et mes sessions de cours.

**Critères d'acceptation:**
1. Page "Gestion > Matières" liste toutes les matières avec nom, code, description
2. Bouton "Nouvelle matière" ouvre formulaire : nom (ex: "Anglais"), code (ex: "ANG"), description (optionnelle)
3. Matière créée apparaît dans liste
4. Actions "Modifier" et "Supprimer" disponibles pour chaque matière
5. Suppression matière demande confirmation
6. Matière utilisée dans des sessions ne peut pas être supprimée (erreur explicite)

**Notes techniques:**
- Backend API : CRUD /subjects
- Validation dépendances avant suppression (check si utilisée dans teaching assignments ou sessions)

---

#### Story 1.5 : Gestion des Élèves

**En tant qu'** enseignante,
**Je veux** créer des profils élèves et les inscrire dans des classes,
**Afin de** suivre individuellement chaque élève.

**Critères d'acceptation:**
1. Page "Gestion > Élèves" liste tous les élèves avec nom, prénom, classes
2. Bouton "Nouvel élève" ouvre formulaire : nom, prénom, besoins particuliers (textarea optionnelle), observations générales (textarea optionnelle), forces identifiées (textarea optionnelle)
3. Élève créé apparaît dans liste
4. Clic sur élève ouvre profil détaillé
5. Dans profil élève, section "Classes" liste les classes où l'élève est inscrit
6. Bouton "Inscrire dans une classe" : dropdown classes disponibles, bouton "Inscrire"
7. Inscription réussie affiche la classe dans la liste
8. Bouton "Désinscrire" retire élève de la classe (confirmation demandée)

**Notes techniques:**
- Backend API : CRUD /students, POST /classes/{id}/students (enroll), DELETE /classes/{id}/students/{student_id} (unenroll)
- Recherche élèves par nom avec pagination
- Multi-classe : un élève peut être inscrit dans plusieurs classes

---

#### Story 1.6 : Gestion des Créneaux Horaires

**En tant qu'** enseignante,
**Je veux** définir les créneaux horaires de ma journée d'enseignement,
**Afin de** planifier mes sessions de cours sur ces créneaux.

**Critères d'acceptation:**
1. Page "Paramètres > Créneaux Horaires" liste tous les créneaux : heure début, heure fin, durée, jour, ordre, type (normal/pause)
2. Bouton "Nouveau créneau" ouvre formulaire : heure début (select), heure fin (select), jour de la semaine (select), ordre d'affichage (number), checkbox "Pause"
3. Durée calculée automatiquement (fin - début)
4. Créneaux "Pause" visuellement différenciés (badge gris)
5. Créneaux triés par jour puis ordre d'affichage
6. Actions "Modifier" et "Supprimer" disponibles
7. Créneau utilisé dans sessions ne peut pas être supprimé (erreur explicite)

**Notes techniques:**
- Backend API : CRUD /time-slots
- Validation : heure fin > heure début
- Créneaux "Pause" bloquent la planification de sessions

---

## Epic 2 : Planning et Suivi des Sessions de Cours

**Timeline:** Sprint 3-4 (3-4 semaines)
**Stories:** 6 user stories
**Priorité:** CRITIQUE - Cœur du workflow quotidien

### Objectif de l'Epic

Implémenter le système complet de planification des sessions (avec templates hebdomadaires), calendrier visuel, saisie ultra-rapide des présences et capture des données comportementales post-session.

### User Stories

#### Story 2.1 : Calendrier Visuel des Sessions

**En tant qu'** enseignante,
**Je veux** voir un calendrier visuel de mes sessions planifiées,
**Afin d'** avoir une vue d'ensemble de ma semaine/mois d'enseignement.

**Critères d'acceptation:**
1. Page "Calendrier" affiche vue mensuelle par défaut
2. Navigation mois précédent/suivant avec flèches
3. Toggle vue "Mois" / "Semaine"
4. Sessions affichées dans les cases jour avec : heure, classe, matière, statut (icône)
5. Code couleur par matière pour distinction visuelle rapide
6. Clic sur session ouvre modal détails : classe, matière, créneau, date, statut, actions
7. Sessions statut "Complétée" affichent badge vert ✅
8. Sessions futures affichent badge bleu "Planifiée"

**Notes techniques:**
- Frontend feature : calendar avec use-calendar hook
- Backend API : GET /course-sessions avec filtres date début/fin
- Composant calendar réutilise shadcn/ui calendar atom

---

#### Story 2.2 : Templates Hebdomadaires de Sessions

**En tant qu'** enseignante,
**Je veux** créer un template de ma semaine type de cours,
**Afin de** générer automatiquement toutes mes sessions récurrentes.

**Critères d'acceptation:**
1. Page "Paramètres > Templates Hebdomadaires" liste templates existants
2. Bouton "Nouveau template" ouvre formulaire : nom template, classe, matière, jour de la semaine, créneau horaire
3. Template créé apparaît dans liste
4. Bouton "Générer sessions depuis ce template" : date début (date picker), date fin (date picker)
5. Génération crée toutes les sessions entre début et fin selon récurrence template
6. Confirmation affichée : "24 sessions créées avec succès"
7. Sessions générées visibles dans calendrier immédiatement

**Notes techniques:**
- Backend API : CRUD /weekly-templates
- Service session-generator.ts génère sessions depuis templates
- Validation : pas de conflit entre sessions générées

---

#### Story 2.3 : Planification Manuelle de Session

**En tant qu'** enseignante,
**Je veux** créer une session de cours ponctuelle manuellement,
**Afin de** planifier un cours exceptionnel ou modifier mon planning.

**Critères d'acceptation:**
1. Depuis calendrier, clic sur jour vide ouvre modal "Nouvelle session"
2. Formulaire : classe (dropdown), matière (dropdown), date (date picker pré-remplie), créneau horaire (dropdown)
3. Validation temps réel : si conflit détecté, erreur "Créneau déjà occupé par session Classe 5A - Anglais"
4. Validation : créneau type "Pause" ne peut pas être sélectionné (désactivé dans dropdown)
5. Bouton "Créer" crée session et ferme modal
6. Session apparaît immédiatement dans calendrier
7. Si création échoue (conflit backend), message erreur clair affiché

**Notes techniques:**
- Backend API : POST /course-sessions avec validation conflits
- Frontend : detection conflits côté client pour UX réactive + validation backend authoritative

---

#### Story 2.4 : Reprogrammation de Session

**En tant qu'** enseignante,
**Je veux** reprogrammer une session à un autre jour/créneau,
**Afin de** gérer les imprévus (férié, absence, problème technique).

**Critères d'acceptation:**
1. Depuis modal détails session, bouton "Reprogrammer"
2. Formulaire affiche date actuelle et créneau, permet modification
3. Validation temps réel : détection conflit nouvelle date/créneau
4. Option statut : "Reportée" ou "Annulée" (dropdown)
5. Si "Reportée" : nouvelle date obligatoire
6. Si "Annulée" : nouvelle date non requise, session marquée annulée
7. Bouton "Confirmer" met à jour session
8. Notification succès : "Session reprogrammée au Jeudi 16/11 à 14h"

**Notes techniques:**
- Backend API : PATCH /course-sessions/{id}
- Frontend : drag-and-drop sur calendrier pour reprogrammation visuelle (nice-to-have)

---

#### Story 2.5 : Saisie Rapide des Présences Post-Session (CRITIQUE)

**En tant qu'** enseignante,
**Je veux** enregistrer rapidement les présences et données de session juste après mon cours,
**Afin de** capturer les informations pendant qu'elles sont fraîches, en moins de 2 minutes.

**Critères d'acceptation:**
1. Après session terminée, depuis calendrier ou dashboard, clic "Saisir présences" ouvre interface batch
2. Interface affiche tableau : colonnes Élève, Présent (checkbox), Participation (select: Faible/Moyenne/Élevée), Comportement (select: Positif/Neutre/Négatif), Caméra (select: Activée/Désactivée/Problème), Notes (textarea courte)
3. **Action bulk** : Bouton "Marquer tous présents" coche toutes les cases présence en un clic
4. Ensuite ajuster uniquement les 2-3 absents et cas particuliers
5. Auto-save toutes les 10 secondes (indicateur "Sauvegarde automatique...")
6. Raccourcis clavier : Tab navigation, Enter valide ligne suivante
7. Bouton "Enregistrer et fermer" sauvegarde définitivement et retourne au dashboard
8. **Objectif timing** : Saisie complète 30 élèves en ≤ 2 minutes (mesure UX critique)

**Notes techniques:**
- Backend API : PUT /sessions/{id}/attendance (batch upsert)
- Frontend : Optimistic UI avec rollback si échec
- Auto-save utilise debounce 10sec pour éviter trop de requêtes

---

#### Story 2.6 : Consultation Détaillée Session et Historique Présences

**En tant qu'** enseignante,
**Je veux** consulter les détails d'une session passée avec toutes les données de présence,
**Afin de** vérifier l'historique et préparer mes rapports.

**Critères d'acceptation:**
1. Clic sur session complétée dans calendrier ouvre page détail session
2. Header affiche : Classe, Matière, Date, Créneau horaire, Statut
3. Section "Présences" : tableau élèves avec toutes données capturées (présent, participation, comportement, caméra, notes)
4. Indicateurs visuels : ✅ Présent (vert), ❌ Absent (rouge), 🔴 Caméra désactivée
5. Statistiques session en header : Taux de présence (18/20 = 90%), Participation moyenne
6. Bouton "Modifier les présences" permet édition rétroactive
7. Historique horodaté des modifications (qui, quand, quoi changé)

**Notes techniques:**
- Backend API : GET /course-sessions/{id} (enrichi avec présences)
- Frontend : SessionDetailPage avec tableaux atoms + organisms

---

## Epic 3 : Évaluations et Suivi Académique

**Timeline:** Sprint 5-6 (3-4 semaines)
**Stories:** 6 user stories
**Priorité:** HAUTE - Fonde les analytics et génération contenu

### Objectif de l'Epic

Construire le système complet de gestion des examens, saisie des résultats, calcul automatique de statistiques, et surtout les **analytics élèves avancées** avec détection proactive des difficultés.

### User Stories

#### Story 3.1 : Création et Gestion d'Examens

**En tant qu'** enseignante,
**Je veux** créer des examens avec leurs caractéristiques (date, barème, coefficient),
**Afin de** structurer mes évaluations et préparer la saisie des résultats.

**Critères d'acceptation:**
1. Page "Évaluations > Examens" liste examens avec titre, date, classe, points max, statut publication
2. Bouton "Nouvel examen" ouvre formulaire : titre, date (date picker), classe (dropdown), matière (dropdown), année scolaire (dropdown), points maximum (number), coefficient (number, défaut 1), type examen (select: Contrôle/Devoir/Oral/Projet), publié (checkbox)
3. Examen créé apparaît dans liste
4. Filtres liste : par classe, par matière, par plage de dates, par statut publication
5. Tri par date (plus récent en premier)
6. Actions "Modifier", "Dupliquer", "Supprimer" pour chaque examen
7. Badge statut : "📝 Brouillon" si non publié, "📊 Publié" si publié

**Notes techniques:**
- Backend API : CRUD /exams avec filtres avancés
- Examen "publié" détermine si résultats visibles dans analytics élèves

---

#### Story 3.2 : Saisie Batch des Résultats d'Examen

**En tant qu'** enseignante,
**Je veux** saisir rapidement les résultats de tous les élèves d'un examen,
**Afin de** corriger efficacement et enregistrer les notes en moins de 5 minutes.

**Critères d'acceptation:**
1. Depuis page examen, bouton "Saisir les résultats" ouvre interface batch
2. Tableau affiche tous élèves de la classe : Nom, Prénom, Points obtenus (input number), Absent (checkbox), Commentaire (textarea courte)
3. Validation temps réel : points obtenus ≤ points maximum examen (erreur si dépassement)
4. Si "Absent" coché, champ points obtenus désactivé
5. Auto-save toutes les 10 secondes
6. Progress indicator : "12/28 élèves saisis"
7. Bouton "Enregistrer et calculer statistiques" sauvegarde tout et affiche stats
8. **Objectif timing** : Saisie 30 élèves en < 5 minutes

**Notes techniques:**
- Backend API : PUT /exams/{id}/results (upsert batch)
- Frontend : Validation inline, optimistic UI

---

#### Story 3.3 : Statistiques Automatiques d'Examen

**En tant qu'** enseignante,
**Je veux** voir automatiquement les statistiques d'un examen après saisie,
**Afin d'** évaluer rapidement le niveau de la classe et identifier les difficultés.

**Critères d'acceptation:**
1. Après saisie résultats, section "Statistiques" affichée automatiquement
2. Métriques : Moyenne classe, Médiane, Note min, Note max, Écart-type
3. Taux de réussite : % élèves ≥ 10/20 (seuil configurable)
4. Graphique distribution notes : histogramme par tranche de notes
5. Liste "Élèves en difficulté" : notes < 8/20 avec nom + note
6. Nombre élèves absents affiché séparément
7. Bouton "Exporter statistiques PDF" génère rapport synthétique

**Notes techniques:**
- Backend API : GET /exams/{id}/stats (calculs côté backend)
- Frontend : Recharts pour graphiques

---

#### Story 3.4 : Profil Élève avec Analytics Complètes

**En tant qu'** enseignante,
**Je veux** consulter le profil complet d'un élève avec toutes ses analytics,
**Afin d'** avoir une vue longitudinale de sa progression et détecter problèmes.

**Critères d'acceptation:**
1. Page "Mes Élèves" puis clic sur élève ouvre profil détaillé
2. Header : Nom, Prénom, Photo (optionnelle), Classes, Besoins particuliers
3. Section "Taux de Présence" : Pourcentage global + graphique temporel (évolution sur trimestre)
4. Section "Participation" : Tendance (icône ↗↘→) + graphique temporel
5. Section "Comportement" : Distribution (X% positif, Y% neutre, Z% négatif) + graphique
6. Section "Résultats Académiques" : Liste examens avec notes + moyenne générale + graphique évolution
7. Section "Analyse Comportementale" : Texte généré automatiquement identifiant patterns (ex: "Désengagement progressif détecté depuis mi-octobre, absences répétées les lundis")
8. Section "Observations Enseignante" : Timeline des notes manuelles ajoutées

**Notes techniques:**
- Backend API : GET /students/{id} avec toutes relations
- Frontend services : behavioral-analysis-service.ts, academic-analysis-service.ts
- Graphiques temporels avec Recharts

---

#### Story 3.5 : Alertes Automatiques Élèves en Difficulté

**En tant qu'** enseignante,
**Je veux** recevoir des alertes automatiques pour élèves en difficulté,
**Afin de** pouvoir intervenir proactivement avant qu'il ne soit trop tard.

**Critères d'acceptation:**
1. Dashboard affiche widget "Alertes" avec compteur badge rouge
2. Clic sur widget ouvre panneau latéral liste des alertes
3. Types d'alertes :
   - "⚠️ Présence < 75%" : élèves avec taux présence faible
   - "📉 Notes en baisse" : élèves avec moyenne derniers 3 examens < moyenne trimestre -2 points
   - "😐 Participation faible" : élèves avec participation "Faible" sur 5 dernières sessions
   - "🔴 Comportement négatif" : élèves avec 3+ comportements négatifs dans 2 dernières semaines
4. Chaque alerte cliquable ouvre profil élève concerné
5. Alertes calculées en temps réel après chaque saisie (présence, note, etc.)
6. Badge compteur mis à jour dynamiquement

**Notes techniques:**
- Backend API : GET /classes/{id}/students/analytics avec détection patterns
- Frontend : Dashboard widget avec polling ou WebSocket pour temps réel

---

#### Story 3.6 : Ajout d'Observations Manuelles sur Profil Élève

**En tant qu'** enseignante,
**Je veux** ajouter des notes/observations sur un élève,
**Afin de** documenter contexte, actions prises, et suivi personnalisé.

**Critères d'acceptation:**
1. Dans profil élève, section "Observations Enseignante" affiche timeline des notes
2. Bouton "+ Ajouter observation" ouvre modal
3. Formulaire : Date (auto pré-remplie aujourd'hui, modifiable), Observation (textarea riche)
4. Observation sauvegardée apparaît dans timeline avec horodatage
5. Actions "Modifier" et "Supprimer" pour chaque observation
6. Observations incluses dans génération rapports et appréciations (Epic 4)
7. Flag "À surveiller" (toggle) marque élève pour attention particulière

**Notes techniques:**
- Backend : champ observations dans Student model (JSON ou table séparée)
- Frontend : Timeline component réutilisable

---

## Epic 4 : Génération Automatisée de Contenu Pédagogique

**Timeline:** Sprint 7-9 (4-5 semaines)
**Stories:** 6 user stories
**Priorité:** TRÈS HAUTE - Valeur différenciante majeure

### Objectif de l'Epic

Implémenter le cœur de la proposition de valeur : génération IA de rapports bihebdomadaires pour parents et d'appréciations trimestrielles pour bulletins, avec système de phrases templates et guides de style garantissant qualité et bienveillance.

### User Stories

#### Story 4.1 : Banque de Phrases Templates

**En tant qu'** enseignante,
**Je veux** créer et organiser une bibliothèque de phrases types,
**Afin de** construire mes rapports et appréciations avec vocabulaire cohérent et bienveillant.

**Critères d'acceptation:**
1. Page "Appréciations > Banque de Phrases" liste phrases organisées par catégories
2. Catégories : Présence, Participation, Comportement, Progrès, Difficultés, Encouragements
3. Bouton "Nouvelle phrase" ouvre formulaire : catégorie (select), phrase (textarea), tags/contexte (ex: "bonne_présence", "progrès_notable")
4. Phrases affichées avec prévisualisation et tags
5. Actions "Modifier" et "Supprimer" pour chaque phrase
6. Recherche phrases par catégorie ou tag
7. Import/Export CSV pour partage phrases entre enseignants (future)

**Notes techniques:**
- Frontend feature : appreciations/hooks/use-phrase-bank.ts
- Mocks : MOCK_PHRASE_BANK avec phrases pré-remplies françaises bienveillantes

---

#### Story 4.2 : Guides de Style Configurables

**En tant qu'** enseignante,
**Je veux** définir des guides de style pour différents types de documents,
**Afin d'** adapter le ton (formel/informel) et la longueur selon le contexte (parents/bulletin).

**Critères d'acceptation:**
1. Page "Appréciations > Guides de Style" liste guides existants
2. Bouton "Nouveau guide" ouvre formulaire : nom (ex: "Formel - Bulletin"), ton (select: Formel/Semi-formel/Informel), longueur cible (select: Court 50-80 mots / Standard 80-120 / Long 120-150), niveau langage (select: Simple/Soutenu)
3. Guide créé utilisable lors génération rapports/appréciations
4. Guide par défaut sélectionnable pour chaque type document
5. Actions "Modifier", "Dupliquer", "Supprimer"

**Notes techniques:**
- Frontend : appreciations/hooks/use-style-guides.ts
- Guides stockés en JSON, utilisés par services génération

---

#### Story 4.3 : Génération Automatique Rapports Bihebdomadaires

**En tant qu'** enseignante,
**Je veux** générer automatiquement des rapports bihebdomadaires pour tous les élèves d'une classe,
**Afin de** communiquer rapidement aux parents en 15min vs 2-3h manuellement.

**Critères d'acceptation:**
1. Dashboard affiche alerte : "Rapports bihebdomadaires à générer (15 jours écoulés)"
2. Clic alerte ou depuis page "Appréciations", bouton "Générer rapports bihebdomadaires"
3. Modal configuration : Classe (dropdown), Guide de style (dropdown défaut "Informel - Parents"), Période (dernières 2 semaines auto-sélectionnée)
4. Bouton "Générer pour tous les élèves" lance génération
5. Progress bar : "Génération : 12/20 élèves (60%)" avec estimation temps restant
6. **Logique génération** (≤ 10sec/élève) :
   - Analyse présences 2 dernières semaines
   - Synthèse participation (tendance)
   - Résumé comportement
   - Mention notes récentes si examens dans période
   - Sélection phrases banque selon contexte
   - Application guide de style
7. Écran révision : Liste 20 rapports avec aperçu, possibilité édition inline avant validation
8. **Objectif global** : 15 minutes machine + révision pour 20 élèves

**Critères d'acceptation (suite):**
9. Bouton "Valider tous" ou validation individuelle
10. Export PDF batch : génère 20 PDFs individuels en ZIP téléchargeable
11. Confirmation : "20 rapports générés et exportés ✅"

**Notes techniques:**
- Frontend services : appreciation-generator.ts
- Utilise behavioral-analysis + academic-analysis pour contexte
- Génération côté frontend (pas d'API IA externe dans MVP, juste règles + templates)

---

#### Story 4.4 : Révision et Édition Manuelle Rapports Bihebdomadaires

**En tant qu'** enseignante,
**Je veux** pouvoir éditer manuellement chaque rapport généré avant export,
**Afin de** personnaliser et ajuster le contenu selon ma connaissance de l'élève.

**Critères d'acceptation:**
1. Écran révision batch affiche liste élèves gauche, rapport centre, stats droite (3 colonnes)
2. Sélection élève dans liste affiche son rapport au centre
3. Éditeur richtext (bold, italic, listes) permet modification libre
4. Indicateur "✏️ Modifié" si rapport édité vs original
5. Bouton "Réinitialiser" restaure version générée automatiquement
6. Compteur caractères/mots pour respecter longueur cible guide de style
7. Sauvegarde auto toutes les 10 secondes
8. Navigation élève suivant/précédent (flèches clavier)
9. Validation rapport individuelle : marque rapport "Validé ✅"
10. Seuls rapports validés exportables en PDF

**Notes techniques:**
- Éditeur richtext : Tiptap ou similaire (léger)
- État validation stocké en mémoire (pas persisté backend dans MVP)

---

#### Story 4.5 : Génération Automatique Appréciations Trimestrielles

**En tant qu'** enseignante,
**Je veux** générer automatiquement les appréciations de bulletins trimestriels pour tous mes élèves,
**Afin de** préparer les bulletins en 2h vs 6-8h manuellement pour 60 élèves.

**Critères d'acceptation:**
1. Page "Appréciations", bouton "Générer appréciations trimestrielles"
2. Modal configuration : Période académique (dropdown trimestre), Classes (multi-select), Guide de style (dropdown défaut "Formel - Bulletin"), Longueur (dropdown défaut "Standard 80-120 mots")
3. Bouton "Générer pour toutes les classes sélectionnées" (ex: 3 classes, 60 élèves)
4. Progress bar globale : "15/60 élèves (25%)"
5. **Logique génération** (≤ 15sec/élève) :
   - Analyse complète trimestre : taux présence global, moyenne participation, évolution comportementale
   - Synthèse résultats académiques : moyenne examens, progression
   - Intégration observations manuelles enseignante
   - Prise en compte besoins particuliers élève (formulation adaptée)
   - Sélection phrases banque selon profil complet
   - Structure : ouverture → corps (présence, participation, résultats, comportement) → pistes amélioration → conclusion encourageante
   - Application guide style formel : vocabulaire soutenu, ton professionnel

**Critères d'acceptation (suite):**
6. Écran révision : Interface 3 colonnes similaire rapports bihebdomadaires
7. Possibilité révision par classe (toggle filtre classe)
8. **Objectif global** : ~2h pour génération + révision 60 élèves (vs 6-8h manuellement)

**Notes techniques:**
- Service : student-profile-service.ts orchestre génération
- Données sources : toutes présences trimestre, tous examens, observations, besoins particuliers

---

#### Story 4.6 : Export Multi-Format (PDF et CSV)

**En tant qu'** enseignante,
**Je veux** exporter mes rapports/appréciations validés en PDF et CSV,
**Afin de** les envoyer aux parents (PDF) et les importer dans le logiciel bulletins de l'école (CSV).

**Critères d'acceptation:**
1. Écran révision, bouton "Exporter" ouvre modal options export
2. Options :
   - Format PDF : génère fichiers individuels (1 par élève) en ZIP
   - Format CSV : génère fichier structuré (colonnes: nom, prénom, classe, appréciation)
   - Format PDF batch : génère PDF multi-pages avec tous élèves (pour impression)
3. Pour PDF, template professionnel : header avec logo/nom école, mise en forme claire, footer avec date génération
4. Export CSV structure : `nom,prénom,classe,appréciation` (compatible import logiciels bulletins standard)
5. Téléchargement déclenché automatiquement après génération
6. Confirmation : "Export réussi : 20 fichiers PDF (archive.zip) téléchargé"
7. Option "Archiver dans système" : sauvegarde copie exports pour référence future

**Notes techniques:**
- Génération PDF : jsPDF ou similaire côté client
- Format CSV : export simple avec papa parse ou manual
- Archivage : stockage local ou S3 selon architecture choisie

---

## Epic 5 : Dashboard, Expérience Utilisateur et Fiabilité

**Timeline:** Transversal Sprint 1-9 + Sprint 10 polish (1-2 semaines finales)
**Stories:** 6 user stories
**Priorité:** MOYENNE initialement, CRITIQUE en fin de projet

### Objectif de l'Epic

Construire l'interface unifiée (dashboard), garantir une expérience utilisateur fluide et cohérente à travers toute l'application, et implémenter les mécanismes de fiabilité mission-critical (auto-save, backup, récupération).

### User Stories

#### Story 5.1 : Tableau de Bord Enseignant

**En tant qu'** enseignante,
**Je veux** accéder à un tableau de bord central avec vue d'ensemble,
**Afin de** démarrer ma journée et accéder rapidement aux actions importantes.

**Critères d'acceptation:**
1. Après login, redirection automatique vers Dashboard
2. Header dashboard : Message personnalisé "Bonjour Marie, bienvenue sur outil-professor"
3. Widget "Sessions Aujourd'hui" : Liste sessions du jour avec heure, classe, matière, statut
4. Widget "Sessions À Venir Cette Semaine" : Prochaines 5 sessions avec dates
5. Widget "Alertes" : Badge compteur + liste élèves nécessitant attention (Epic 3.5)
6. Widget "Statistiques Rapides" : Taux présence moyen semaine, nombre examens à corriger, rapports en attente
7. Widget "Accès Rapides" : Boutons vers actions fréquentes (Saisir présences, Créer session, Voir calendrier, Générer rapports)
8. Chargement dashboard complet en < 2 secondes (NFR)

**Notes techniques:**
- Frontend feature : accueil/hooks/use-dashboard-data.ts
- Widgets composables : dashboard-widgets organisms
- Données chargées en parallèle avec React Suspense

---

#### Story 5.2 : Sélection Contexte Classe/Matière Globale

**En tant qu'** enseignante,
**Je veux** sélectionner un contexte classe/matière actif qui filtre toute l'application,
**Afin de** me concentrer sur un groupe spécifique sans naviguer constamment.

**Critères d'acceptation:**
1. Header application affiche ClassSelectorDropdown toujours visible
2. Dropdown double : Classe (dropdown 1) + Matière (dropdown 2 filtré selon classe)
3. Sélection persiste entre sessions (localStorage)
4. Changement contexte recharge données filtrées dans page actuelle
5. Pages concernées auto-filtrées : Sessions, Présences, Examens, Élèves de la classe
6. Indicateur visuel contexte actif : badge dans header "5ème A - Anglais"
7. Option "Toutes classes" désactive filtre (vue globale)

**Notes techniques:**
- Frontend context : class-selection-context.tsx
- Component : ClassSelectorDropdown molecule
- Filtrage propagé via React Context API

---

#### Story 5.3 : Navigation Fluide et Breadcrumb

**En tant qu'** enseignante,
**Je veux** naviguer facilement entre pages et savoir où je suis,
**Afin de** ne jamais me perdre dans l'application.

**Critères d'acceptation:**
1. Sidebar gauche toujours visible avec sections : Accueil, Calendrier, Sessions, Mes Élèves, Évaluations, Appréciations, Gestion, Paramètres
2. Item menu actif visuellement distinct (couleur primaire, fond)
3. Breadcrumb en haut de page : Dashboard > Sessions > Session du 15/11 > Présences
4. Breadcrumb cliquable pour navigation rapide niveau supérieur
5. Navigation page ≤ 300ms (perception instantanée - NFR)
6. Transition fade subtile entre pages pour fluidité
7. Raccourcis clavier : Alt+1 Dashboard, Alt+2 Calendrier, Alt+3 Sessions, etc.

**Notes techniques:**
- Template : app-sidebar.tsx (déjà existant)
- Breadcrumb component réutilisable
- Next.js App Router pour navigation rapide

---

#### Story 5.4 : Export et Sauvegarde Manuelle Données

**En tant qu'** enseignante,
**Je veux** exporter et sauvegarder manuellement toutes mes données,
**Afin de** créer des backups de sécurité et éviter perte de données.

**Critères d'acceptation:**
1. Page "Paramètres > Sauvegarde et Export"
2. Section "Export Complet" : Bouton "Exporter toutes les données (JSON)" télécharge archive complète
3. Archive contient : classes, élèves, sessions, présences, examens, résultats, appréciations en JSON structuré
4. Nom fichier : `outil-professor-backup-2024-11-15.zip`
5. Section "Export Sélectif" : Checkboxes par type données, bouton "Exporter sélection"
6. Section "Historique Exports" : Liste 10 derniers exports avec date, taille, bouton re-télécharger
7. Confirmation post-export : "Backup créé avec succès : 245 KB, 1500 enregistrements"

**Notes techniques:**
- Export JSON côté client (gather data from backend API)
- Compression ZIP avec JSZip
- Stockage historique exports en localStorage (métadonnées)

---

#### Story 5.5 : Sauvegarde Automatique et Récupération (Mission-Critical)

**En tant qu'** enseignante,
**Je veux** que mes données soient sauvegardées automatiquement sans action de ma part,
**Afin de** ne jamais perdre mon travail même en cas de crash.

**Critères d'acceptation:**
1. Auto-save toutes les 15 minutes en arrière-plan (silencieux)
2. Indicateur header : "Dernière sauvegarde : il y a 3 minutes" (mise à jour dynamique)
3. Lors saisie formulaires (présences, notes), auto-save toutes les 10 secondes
4. En cas échec auto-save, notification alerte : "⚠️ Échec sauvegarde, vérifiez connexion" + retry automatique
5. Backup hebdomadaire automatique (dimanche 2h du matin si app ouverte, ou au prochain démarrage)
6. Page "Paramètres > Sauvegardes Auto" : Liste backups auto avec dates, bouton restaurer
7. **RPO = 0** : Aucune donnée perdue validée (auto-save immédiat après action critique)
8. **RTO < 5 minutes** : Récupération depuis backup testée et fonctionnelle en < 5min

**Notes techniques:**
- Frontend : Interval timer pour auto-save périodique
- Backend : Endpoints batch save optimisés
- Backup storage : local SQLite ou cloud S3 selon architecture

---

#### Story 5.6 : Performance et Optimisation

**En tant qu'** enseignante,
**Je veux** que l'application soit rapide et fluide à tout moment,
**Afin de** ne pas perdre de temps à attendre les chargements.

**Critères d'acceptation:**
1. Temps chargement initial application ≤ 2 secondes (NFR)
2. Navigation entre pages ≤ 300ms (NFR)
3. Saisie présences 30 élèves complétée en ≤ 2 minutes (objectif UX - NFR)
4. Génération rapport bihebdomadaire ≤ 10 secondes par élève (NFR)
5. Génération appréciation trimestrielle ≤ 15 secondes par élève (NFR)
6. Skeleton loading pour opérations longues (génération rapports)
7. Optimistic UI : actions apparaissent instantanées (confirmation backend async)
8. Bundle frontend initial ≤ 500KB gzipped (NFR)

**Notes techniques:**
- Next.js code splitting automatique
- React Suspense pour loading states
- Debounce inputs recherche/filtres
- Memoization hooks coûteux (useMemo, React.memo)
- Images optimisées next/image

---

## Récapitulatif des Stories

**Epic 1 : Fondations** → 6 stories
**Epic 2 : Sessions & Présences** → 6 stories
**Epic 3 : Évaluations & Analytics** → 6 stories
**Epic 4 : Génération IA** → 6 stories
**Epic 5 : Dashboard & UX** → 6 stories

**TOTAL : 30 user stories**

---

## Notes Transversales

### Dépendances Entre Epics

- Epic 2 dépend de Epic 1 (besoin classes, élèves, créneaux pour planifier sessions)
- Epic 3 dépend de Epic 2 (besoin sessions et présences pour analytics élèves)
- Epic 4 dépend de Epic 3 (besoin analytics pour générer rapports intelligents)
- Epic 5 est transversal : dashboard construit progressivement, polish final après Epic 4

### Priorisation Recommandée

**Phase MVP Minimale** (Sprint 1-6, 9-12 semaines) :
- Epic 1 complet ✅
- Epic 2 complet ✅
- Epic 3.1 à 3.4 (examens + profils, pas alertes ni observations manuelles)
- Epic 5.1 à 5.3 (dashboard + navigation de base)

**Phase MVP Complet** (Sprint 7-10, 12-14 semaines) :
- Epic 3 complet (ajout alertes + observations)
- Epic 4 complet (génération IA - valeur différenciante)
- Epic 5 complet (polish UX + fiabilité mission-critical)

### Estimation Globale

- **Développement** : 12-14 semaines (temps plein)
- **Testing UAT** : 2 semaines
- **Corrections bugs** : 1-2 semaines
- **Total avant déploiement production** : 15-18 semaines (~4 mois)

---

_Ce document epics.md doit être utilisé comme base pour la création du backlog détaillé et la planification sprint._

_Prochaine étape recommandée : Workflow architecture pour documenter l'architecture technique avant développement._
