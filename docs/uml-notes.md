# Notes sur le Diagramme UML

## 🌍 Architecture SaaS Multi-Tenant

**Principe fondamental** : Isolation totale des données. Chaque professeur opère dans son univers isolé - aucun partage de données entre utilisateurs.

**Cible** : Professeurs individuels dans le monde entier utilisant leurs propres systèmes éducatifs, langues et méthodes de notation.

## 🛡️ Sécurité des Données

### Pattern d'Isolation
```sql
-- TOUJOURS filtrer par created_by
WHERE created_by = $current_user_id
```

### Entités avec `created_by`
- ✅ **User** (propriétaire)
- ✅ **Class** (classes du professeur)
- ✅ **Student** (élèves du professeur)  
- ✅ **CourseSession** (sessions du professeur)
- ✅ **Exam** (examens du professeur)
- ✅ **StudentExamResult** (résultats du professeur)
- ✅ **StudentParticipation** (participations du professeur)
- ✅ **SchoolLevel** (niveaux du professeur)
- ✅ **SchoolYear** (années du professeur)
- ✅ **Subject** (matières du professeur)
- ✅ **TimeSlot** (créneaux du professeur)
- ✅ **AcademicPeriod** (périodes du professeur)
- ✅ **GeneratedContent** (contenu généré par IA du professeur)

### Exemples de Personnalisation
- **Prof français** : "CP", "Mathématiques", "8h-9h", "Trimestre 1"
- **Prof américain** : "Grade 1", "Math", "8:30-9:15", "Semester 1"  
- **Prof japonais** : "小学1年", "算数", "1時間目", "前期"

## 🔗 Relations

### Cardinalités
- **User → Class** : 1..N (Un professeur peut créer plusieurs classes)
- **User → Student** : 1..N (Un professeur peut gérer plusieurs élèves)
- **User → CourseSession** : 1..N (Un professeur peut créer plusieurs sessions de cours)
- **User → Exam** : 1..N (Un professeur peut créer plusieurs examens)
- **Class → Student** : 0..N (Une classe peut contenir plusieurs élèves, optionnel)
- **Class → CourseSession** : 1..N (Une classe peut avoir plusieurs sessions de cours)
- **Class → Exam** : 1..N (Une classe peut avoir plusieurs examens)
- **Class → SchoolLevel** : N..1 (Plusieurs classes peuvent avoir le même niveau)
- **Class → SchoolYear** : N..1 (Plusieurs classes dans la même année)
- **CourseSession → Subject** : N..1 (Plusieurs sessions peuvent enseigner la même matière)
- **CourseSession → TimeSlot** : N..1 (Plusieurs sessions peuvent utiliser le même créneau)
- **CourseSession → StudentParticipation** : 1..N (Un cours peut avoir plusieurs participations)
- **Student → StudentParticipation** : 1..N (Un élève peut participer à plusieurs cours)
- **Student → StudentExamResult** : 1..N (Un élève peut avoir plusieurs résultats d'examens)
- **SchoolYear → AcademicPeriod** : 1..N (Une année scolaire a plusieurs périodes)
- **Exam → Subject** : N..1 (Plusieurs examens peuvent évaluer la même matière)
- **Exam → AcademicPeriod** : N..1 (Plusieurs examens dans la même période)
- **Exam → StudentExamResult** : 1..N (Un examen peut avoir plusieurs résultats)
- **StudentExamResult → Exam** : N..1 (Plusieurs résultats par examen)
- **StudentExamResult → Student** : N..1 (Plusieurs résultats par élève)
- **User → GeneratedContent** : 1..N (Un professeur peut générer plusieurs contenus)
- **Student → GeneratedContent** : 1..N (Un élève peut avoir plusieurs contenus générés)
- **AcademicPeriod → GeneratedContent** : 0..N (Une période peut avoir des contenus générés, optionnel)

### Contraintes Métier
1. **Isolation professeur** : Chaque entité appartient à un professeur via `created_by` (User = Professor)
2. **Élève optionnel classe** : Un élève peut exister sans être affecté à une classe
3. **Élève unique professeur** : Un élève appartient à un seul professeur
4. **Année active unique** : Une seule année scolaire peut être active à la fois
5. **Structure académique flexible** : Chaque professeur configure sa structure via `academic_year_structure` 
6. **Périodes personnalisées** : Le professeur définit le nombre et les noms de ses périodes via `periods_per_year` et `period_names`
7. **Sessions de cours manuelles** : Les sessions de cours sont créées manuellement par le professeur
8. **Sessions modifiables** : Les sessions peuvent être annulées ou reprogrammées
9. **Matière par session** : Chaque session enseigne une matière spécifique
10. **Participation par session** : Chaque élève peut avoir une participation par session de cours
11. **Examens par classe** : Les examens appartiennent à une classe et une matière  
12. **Système de notation unifié** : Professeur configure son système via `primary_notation` et `notation_config`
13. **Notation cohérente** : Examens et résultats utilisent systématiquement le système configuré par le professeur
14. **Types d'examens** : controle, evaluation, devoir_maison
15. **Résultat unique par examen** : Un élève ne peut avoir qu'un seul résultat par examen
16. **Publication contrôlée** : Les résultats sont publiés via `is_published`
17. **Moyennes pondérées** : Calcul avec coefficients par matière et période selon système choisi
18. **Validation notation cohérente** : Tous les examens héritent du système de notation du professeur
19. **Affichage localisé** : Les notes sont formatées selon les préférences culturelles du professeur  
20. **API unifiée** : Une seule interface pour tous les systèmes de notation
21. **Moyennes automatiques** : Calculs adaptés automatiquement au système configuré
22. **Objectif bulletins** : L'application vise à faciliter la rédaction d'appréciations et de bulletins
23. **Évaluation complète** : La participation inclut présence, comportement, niveau et remarques
24. **Suivi longitudinal** : Les participations et examens permettent le suivi de l'élève sur l'année
25. **Profils dynamiques** : Les besoins, observations, forces et axes d'amélioration sont des arrays évolutifs
26. **Génération à la demande** : Le contenu IA est généré uniquement sur demande explicite du professeur
27. **Isolation du contenu généré** : Chaque contenu généré appartient exclusivement à un professeur via `created_by`
28. **Types de contenu IA** : 'appreciation' (appréciation par matière), 'biweekly_report' (bilan bihebdomadaire)
29. **Déclencheurs de génération** : 'manual' (demande prof), 'periodic' (automatique), 'event' (événement)
30. **Historique complet** : Toutes les générations sont tracées avec paramètres et données d'entrée
31. **Multi-langue IA** : La génération respecte la langue du professeur (User.language)
32. **Régénération possible** : Le professeur peut régénérer du contenu avec de nouveaux paramètres
33. **Statuts de contenu** : 'draft', 'final', 'archived' pour gestion du cycle de vie
34. **Données d'entrée sauvegardées** : Paramètres et données utilisées pour traçabilité et régénération
35. **Appréciations liées période** : Les appréciations sont générées pour matière + période académique spécifique
36. **Bilans indépendants** : Les bilans bihebdomadaires sont transversaux, sans matière/période spécifique
37. **Objectif intégration externe** : Le contenu généré est destiné à être copié dans les bulletins officiels de l'école
38. **Métriques StudentParticipation** : Calculs d'assiduité, moyennes participation, tendances comportement intégrés

## 🎯 Cas d'Usage Typiques

### Onboarding Professeur
1. **Inscription** → Création compte User avec paramètres par défaut
2. **Configuration académique** → Personnalisation structure (`academic_year_structure`, `periods_per_year`, `period_names`)
3. **Configuration notation** → Choix système (`primary_notation`, `notation_config`, `allows_multiple_notations`)
4. **Initialisation** → Création données de référence personnalisées (niveaux, matières, créneaux)
5. **Première classe** → Ajout élèves et planning

### Workflow Quotidien
1. **Planning** → Création sessions de cours
2. **Enseignement** → Saisie participation temps réel
3. **Évaluation** → Création/correction examens
4. **Communication** → Génération appréciations pour intégration dans bulletins externes

### Workflow Génération IA - Appréciations & Bilans
1. **Collecte données** → Le professeur accumule données élève (notes, participations, observations)
2. **Génération appréciations** → `User.generateAppreciation(studentId, subjectId)` → appréciation par matière
3. **Génération bilans bihebdomadaires** → `User.generateBiweeklyReport(studentId)` → bilan global élève
4. **Utilisation externe** → Le professeur copie-colle le contenu généré dans le bulletin officiel de l'école
5. **Historique** → `User.getGenerationHistory(studentId)` → consultation des générations précédentes

### Différence Appréciations vs Bilans
- **Appréciations** : Texte par matière et période académique (trimestre/semestre) pour bulletins officiels
- **Bilans bihebdomadaires** : Synthèse transversale sur 2 semaines, toutes matières, pour suivi rapide

### Flexibilité Internationale
- **France** : CP, Mathématiques, Trimestre 1-2-3, notation french_20 (0-20, seuil 10)
- **USA** : Grade 1, Math, Fall/Spring Semester, notation percentage_100 (0-100%, seuil 60%)  
- **Japon** : 小学1年, 算数, 前期/後期, notation letter_grade (A-F, seuil B)
- **Canada** : Year 1, Mathematics, Term 1-2-3, notation percentage_100 (0-100%, seuil 50%)

### Exemples Concrets de Données
```yaml
# Professeur Français
academic_year_structure: "trimester"
periods_per_year: 3
period_names: {"1": "Trimestre 1", "2": "Trimestre 2", "3": "Trimestre 3"}
primary_notation: "french_20"
notation_config: {"min": 0, "max": 20, "passing": 10}
school_levels: ["CP", "CE1", "CE2"]
subjects: ["Mathématiques", "Français", "Sciences"]

# Professeur Américain  
academic_year_structure: "semester"
periods_per_year: 2
period_names: {"1": "Fall Semester", "2": "Spring Semester"}
primary_notation: "percentage_100"
notation_config: {"min": 0, "max": 100, "passing": 60}
school_levels: ["Kindergarten", "1st Grade", "2nd Grade"]
subjects: ["Math", "English", "Science"]

# Professeur Japonais
academic_year_structure: "semester"
periods_per_year: 2
period_names: {"1": "前期", "2": "後期"}
primary_notation: "letter_grade"
notation_config: {"grades": ["A", "B", "C", "D", "F"], "passing": "B"}
school_levels: ["小学1年", "小学2年", "小学3年"]
subjects: ["算数", "国語", "理科"]
```

### Exemples de Contenu Généré

```yaml
# Appréciation Math - Professeur Français (pour bulletin officiel)
contentType: "appreciation"
subjectId: "math_subject_id"
academicPeriodId: "trimestre_1_id"
language: "fr"
content: |
  Pierre montre des facilités en mathématiques avec une logique développée.
  Ses points forts: résolution de problèmes, calcul mental rapide.
  Axes d'amélioration: attention soutenue, méthode de travail.

# Bilan bihebdomadaire - Professeur Américain (suivi rapide)
contentType: "biweekly_report"
subjectId: null  # Toutes matières
academicPeriodId: null  # Indépendant des périodes officielles
language: "en"
content: |
  Sarah demonstrates strong progress across all subjects this fortnight.
  She shows excellent problem-solving skills in Math and participates actively in English.
  Areas for growth: organizational skills, homework completion consistency.

# Appréciation Sciences - Professeur Japonais (pour bulletin officiel)
contentType: "appreciation" 
subjectId: "science_subject_id"
academicPeriodId: "zenki_id"  # 前期
language: "ja"
content: |
  太郎くんは理科の学習に意欲的に取り組んでいます。
  実験への取り組みが積極的で、観察力も向上しています。
  今後の課題：仮説立案の精度向上、記録の丁寧さ。

# Bilan bihebdomadaire - Professeur Français (suivi rapide)
contentType: "biweekly_report"
subjectId: null
academicPeriodId: null
language: "fr"
content: |
  Marie progresse de manière satisfaisante sur ces 2 dernières semaines.
  Points positifs: assiduité exemplaire, participation active en français.
  À surveiller: concentration en mathématiques, autonomie dans le travail.
```