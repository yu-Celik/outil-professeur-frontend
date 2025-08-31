# Schéma de Base de Données

## 🌍 Architecture SaaS Multi-Tenant

**Principe fondamental** : Isolation totale des données. Chaque professeur opère dans son propre univers - TOUTES les entités (sauf User) appartiennent à un professeur spécifique.

**Modèle SaaS B2C** : Conçu pour la vente directe aux professeurs individuels dans le monde entier. Aucun partage de données entre utilisateurs.

## 📊 Tables SQL

### users (Professeurs)
```sql
-- Table des professeurs (User = Professor dans la logique métier)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    academic_year_structure VARCHAR(20) DEFAULT 'trimester',  -- 'trimester', 'semester', 'quarter'
    periods_per_year INTEGER DEFAULT 3,                       -- 3, 2, 4
    period_names JSONB DEFAULT '{"1": "Trimestre 1", "2": "Trimestre 2", "3": "Trimestre 3"}',
    primary_notation VARCHAR(30) DEFAULT 'french_20',         -- 'french_20', 'percentage_100', 'letter_grade'
    notation_config JSONB DEFAULT '{"min": 0, "max": 20, "passing": 10}',
    allows_multiple_notations BOOLEAN DEFAULT FALSE,
    language VARCHAR(5) DEFAULT 'fr',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ,
    
    CONSTRAINT valid_academic_structure CHECK (academic_year_structure IN ('trimester', 'semester', 'quarter')),
    CONSTRAINT valid_periods_count CHECK (periods_per_year >= 1 AND periods_per_year <= 6),
    CONSTRAINT valid_primary_notation CHECK (primary_notation IN ('french_20', 'percentage_100', 'letter_grade')),
    CONSTRAINT valid_language CHECK (language IN ('fr', 'en', 'ja', 'es', 'de', 'pt', 'it'))
);

CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active);
```

### school_levels (Niveaux personnalisés par professeur)
```sql
CREATE TABLE school_levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    code VARCHAR(10) NOT NULL,
    "order" INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT unique_code_per_user UNIQUE(created_by, code)
);

CREATE INDEX idx_school_levels_created_by ON school_levels(created_by);
CREATE INDEX idx_school_levels_order ON school_levels(created_by, "order");

-- Plus de données d'exemple globales - chaque professeur crée les siennes
-- Exemples de création par différents professeurs :
-- Prof français : 'CP', 'CE1', 'CE2'...
-- Prof américain : 'Kindergarten', '1st Grade', '2nd Grade'...
-- Prof japonais : '小学1年', '小学2年', '小学3年'...
```

### school_years (Années personnalisées par professeur)
```sql
CREATE TABLE school_years (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT unique_name_per_user UNIQUE(created_by, name),
    CONSTRAINT valid_dates CHECK (start_date < end_date)
);

CREATE INDEX idx_school_years_created_by ON school_years(created_by);
CREATE INDEX idx_school_years_active ON school_years(created_by, is_active);

-- Plus de données d'exemple globales - personnalisé par professeur
-- Exemples : '2025-2025', 'Année 1', 'Academic Year 2025', '令和6年'...
```

### subjects (Matières personnalisées par professeur)
```sql
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT unique_code_per_user UNIQUE(created_by, code)
);

CREATE INDEX idx_subjects_created_by ON subjects(created_by);
CREATE INDEX idx_subjects_code ON subjects(created_by, code);

-- Plus de données globales - chaque professeur crée ses matières
-- Exemples :
-- Prof français : 'Mathématiques', 'Français', 'Sciences'...
-- Prof américain : 'Math', 'English', 'Science'...
-- Prof japonais : '算数', '国語', '理科'...
```

### time_slots (Créneaux personnalisés par professeur)
```sql
CREATE TABLE time_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_minutes INTEGER NOT NULL,
    display_order INTEGER NOT NULL,
    is_break BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_times CHECK (start_time < end_time)
);

CREATE INDEX idx_time_slots_created_by ON time_slots(created_by);
CREATE INDEX idx_time_slots_order ON time_slots(created_by, display_order);

-- Plus de données globales - personnalisé par professeur
-- Exemples :
-- Prof français : '8h00-9h00', '9h00-10h00', 'Récréation'...
-- Prof américain : '8:30-9:15', '9:15-10:00', 'Recess'...
-- Prof japonais : '1時間目', '2時間目', '休み時間'...
```

### academic_periods (Périodes personnalisées par professeur)
```sql
-- Périodes académiques (trimestres ou semestres selon la préférence du professeur)
CREATE TABLE academic_periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    school_year_id UUID NOT NULL REFERENCES school_years(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,              -- "Trimestre 1", "Semester 1", "前期", etc.
    period_type VARCHAR(20) NOT NULL,       -- "trimester", "semester", "quarter", etc.
    period_order INTEGER NOT NULL,         -- 1, 2, 3 pour trimestres ou 1, 2 pour semestres
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_dates CHECK (start_date < end_date),
    CONSTRAINT valid_period_order CHECK (period_order >= 1)
);

CREATE INDEX idx_academic_periods_created_by ON academic_periods(created_by);
CREATE INDEX idx_academic_periods_school_year ON academic_periods(school_year_id);
CREATE INDEX idx_academic_periods_type ON academic_periods(created_by, period_type);
CREATE INDEX idx_academic_periods_active ON academic_periods(created_by, is_active);

-- Plus d'exemples globaux - personnalisé par professeur
-- Exemples de nommage :
-- Prof français : 'Trimestre 1', 'Trimestre 2', 'Trimestre 3'
-- Prof américain : 'Fall Semester', 'Spring Semester'  
-- Prof japonais : '前期', '後期'
-- Prof canadien : 'Term 1', 'Term 2', 'Term 3'
```

### classes
```sql
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_code VARCHAR(10) NOT NULL,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    school_level_id UUID NOT NULL REFERENCES school_levels(id),
    school_year_id UUID NOT NULL REFERENCES school_years(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_classes_created_by ON classes(created_by);
CREATE INDEX idx_classes_level ON classes(created_by, school_level_id);
CREATE INDEX idx_classes_year ON classes(created_by, school_year_id);
CREATE INDEX idx_classes_code ON classes(created_by, class_code);
```

### students
```sql
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
    needs TEXT[],
    observations TEXT[],
    strengths TEXT[],
    improve_axes TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_students_created_by ON students(created_by);
CREATE INDEX idx_students_class ON students(class_id);
CREATE INDEX idx_students_name ON students(first_name, last_name);
```

### course_sessions
```sql
CREATE TYPE session_status AS ENUM ('planned', 'in_progress', 'completed', 'cancelled');

CREATE TABLE course_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id),
    time_slot_id UUID NOT NULL REFERENCES time_slots(id),
    session_date DATE NOT NULL,
    room VARCHAR(50),
    status session_status DEFAULT 'planned',
    objectives TEXT,
    content TEXT,
    homework_assigned TEXT,
    notes TEXT,
    attendance_taken BOOLEAN DEFAULT FALSE,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_course_sessions_created_by ON course_sessions(created_by);
CREATE INDEX idx_course_sessions_class ON course_sessions(class_id);
CREATE INDEX idx_course_sessions_subject ON course_sessions(subject_id);
CREATE INDEX idx_course_sessions_time_slot ON course_sessions(time_slot_id);
CREATE INDEX idx_course_sessions_date ON course_sessions(session_date);
```

### student_participation
```sql
CREATE TABLE student_participation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_session_id UUID NOT NULL REFERENCES course_sessions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    is_present BOOLEAN NOT NULL DEFAULT FALSE,
    specific_remarks VARCHAR(500),
    behavior VARCHAR(200),
    participation_level INTEGER CHECK (participation_level >= 1 AND participation_level <= 10),
    technical_issues VARCHAR(300),
    camera_enabled BOOLEAN DEFAULT FALSE,
    marked_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT unique_participation_per_session UNIQUE(course_session_id, student_id)
);

CREATE INDEX idx_student_participation_created_by ON student_participation(created_by);
CREATE INDEX idx_student_participation_session ON student_participation(course_session_id);
CREATE INDEX idx_student_participation_student ON student_participation(student_id);
CREATE INDEX idx_student_participation_present ON student_participation(created_by, is_present);
CREATE INDEX idx_student_participation_level ON student_participation(created_by, participation_level);
CREATE INDEX idx_student_participation_camera ON student_participation(created_by, camera_enabled);
```

### exams
```sql
-- Types d'examens possibles
CREATE TYPE exam_type AS ENUM ('controle', 'evaluation', 'devoir_maison');

CREATE TABLE exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id),
    academic_period_id UUID NOT NULL REFERENCES academic_periods(id),
    exam_date DATE NOT NULL,
    exam_type exam_type NOT NULL,
    duration_minutes INTEGER,
    -- Système de notation unifié selon préférence du professeur
    total_points DECIMAL(5,2) NOT NULL,     -- Points totaux dans le système choisi
    notation_type VARCHAR(30) NOT NULL,     -- Type hérité du professeur
    coefficient DECIMAL(3,2) DEFAULT 1.0,   -- Coefficient pour moyennes
    instructions TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_total_points CHECK (total_points > 0),
    CONSTRAINT valid_coefficient CHECK (coefficient > 0),
    CONSTRAINT valid_notation_type CHECK (notation_type IN ('french_20', 'percentage_100', 'letter_grade'))
);

CREATE INDEX idx_exams_created_by ON exams(created_by);
CREATE INDEX idx_exams_class ON exams(class_id);
CREATE INDEX idx_exams_subject ON exams(subject_id);
CREATE INDEX idx_exams_period ON exams(academic_period_id);
CREATE INDEX idx_exams_date ON exams(exam_date);
CREATE INDEX idx_exams_type ON exams(exam_type);
CREATE INDEX idx_exams_published ON exams(is_published);
```

### student_exam_results
```sql
CREATE TABLE student_exam_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    -- Système de notation unifié
    points_obtained DECIMAL(5,2),           -- Points obtenus dans le système choisi
    grade DECIMAL(5,2),                     -- Note unifiée dans le système choisi
    grade_display VARCHAR(10),              -- Format d'affichage localisé
    is_absent BOOLEAN DEFAULT FALSE,
    comments TEXT,                          -- Commentaires du professeur
    corrections TEXT,                       -- Points à revoir
    marked_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT unique_student_exam UNIQUE(exam_id, student_id),
    CONSTRAINT valid_points_obtained CHECK (points_obtained IS NULL OR points_obtained >= 0),
    CONSTRAINT valid_grade CHECK (grade IS NULL OR grade >= 0),
    -- Une note doit être saisie (sauf si absent)
    CONSTRAINT grade_required_unless_absent CHECK (
        is_absent = true OR grade IS NOT NULL
    )
);

CREATE INDEX idx_student_exam_results_created_by ON student_exam_results(created_by);
CREATE INDEX idx_student_exam_results_exam ON student_exam_results(exam_id);
CREATE INDEX idx_student_exam_results_student ON student_exam_results(student_id);
CREATE INDEX idx_student_exam_results_absent ON student_exam_results(created_by, is_absent);
CREATE INDEX idx_student_exam_results_grade ON student_exam_results(created_by, grade);
```

### generated_content
```sql
-- Contenus générés par IA (appréciations, bilans bihebdomadaires)
CREATE TABLE generated_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,         -- NULL pour les bilans bihebdomadaires
    academic_period_id UUID REFERENCES academic_periods(id) ON DELETE CASCADE, -- NULL pour les bilans bihebdomadaires
    content_type VARCHAR(50) NOT NULL,                                  -- 'appreciation', 'biweekly_report'
    generation_trigger VARCHAR(50) NOT NULL,                            -- 'manual', 'periodic', 'event'
    content TEXT NOT NULL,                                               -- Contenu généré par IA
    input_data JSONB NOT NULL,                                          -- Données d'entrée utilisées pour la génération
    generation_params JSONB NOT NULL,                                   -- Paramètres de génération utilisés
    language VARCHAR(5) NOT NULL DEFAULT 'fr',                         -- Langue du contenu généré
    status VARCHAR(20) NOT NULL DEFAULT 'draft',                       -- 'draft', 'final', 'archived'
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_content_type CHECK (content_type IN ('appreciation', 'biweekly_report')),
    CONSTRAINT valid_generation_trigger CHECK (generation_trigger IN ('manual', 'periodic', 'event')),
    CONSTRAINT valid_status CHECK (status IN ('draft', 'final', 'archived')),
    CONSTRAINT valid_language CHECK (language IN ('fr', 'en', 'ja', 'es', 'de')),
    -- Pour les appréciations, subject_id et academic_period_id sont requis
    CONSTRAINT appreciation_requires_subject_period CHECK (
        (content_type = 'appreciation' AND subject_id IS NOT NULL AND academic_period_id IS NOT NULL) OR
        (content_type = 'biweekly_report' AND subject_id IS NULL AND academic_period_id IS NULL)
    )
);

CREATE INDEX idx_generated_content_created_by ON generated_content(created_by);
CREATE INDEX idx_generated_content_student ON generated_content(student_id);
CREATE INDEX idx_generated_content_subject ON generated_content(subject_id);
CREATE INDEX idx_generated_content_period ON generated_content(academic_period_id);
CREATE INDEX idx_generated_content_type ON generated_content(created_by, content_type);
CREATE INDEX idx_generated_content_status ON generated_content(created_by, status);
CREATE INDEX idx_generated_content_language ON generated_content(created_by, language);
CREATE INDEX idx_generated_content_generated_at ON generated_content(generated_at);

-- Exemples de contenu généré
-- Appréciation en français :
INSERT INTO generated_content (created_by, student_id, subject_id, academic_period_id, content_type, generation_trigger, content, input_data, generation_params, language, status) VALUES
($teacher_id, $student_id, $subject_id, $period_id, 'appreciation', 'manual', 
'Pierre montre des facilités en mathématiques avec une logique développée. Ses points forts: résolution de problèmes, calcul mental rapide. Axes d''amélioration: attention soutenue, méthode de travail.',
'{"grades": [{"exam": "Contrôle 1", "grade": 15.5}, {"exam": "Contrôle 2", "grade": 17}], "participation": {"average": 7.8, "attendance_rate": 0.95, "behavior": "good"}}',
'{"tone": "professional", "focus": "strengths_and_improvements", "max_length": 200}',
'fr', 'final');

-- Bilan bihebdomadaire en anglais :
INSERT INTO generated_content (created_by, student_id, subject_id, academic_period_id, content_type, generation_trigger, content, input_data, generation_params, language, status) VALUES
($teacher_id, $student_id, NULL, NULL, 'biweekly_report', 'manual',
'Sarah demonstrates strong progress across all subjects this fortnight. She shows excellent problem-solving skills in Math and participates actively in English discussions. Areas for growth: organizational skills, homework completion consistency.',
'{"period": "2025-03-01 to 2025-03-14", "sessions_attended": 12, "total_sessions": 14, "subjects_summary": {"Math": {"participation": 8.5, "behavior": "excellent"}, "English": {"participation": 7.0, "behavior": "good"}}}',
'{"format": "biweekly_summary", "include_all_subjects": true, "max_length": 300}',
'en', 'draft');
```

## 🚀 Migrations

Les migrations sont gérées avec SQLx :

```bash
# Créer une migration
sqlx migrate add create_users_table

# Appliquer les migrations
sqlx migrate run

# Revenir en arrière
sqlx migrate revert
```

## 📈 Performance

### Index Recommandés (Architecture SaaS)

#### Index de Sécurité (Isolation)
- `users(email)` - Authentification
- **CRITIQUES** : Tous les index `(created_by)` pour isolation des données

#### Index de Performance par Utilisateur
- `school_levels(created_by)` - Niveaux par professeur
- `school_levels(created_by, order)` - Tri des niveaux
- `school_years(created_by)` - Années par professeur  
- `school_years(created_by, is_active)` - Année active
- `subjects(created_by)` - Matières par professeur
- `time_slots(created_by)` - Créneaux par professeur
- `time_slots(created_by, display_order)` - Tri des créneaux
- `academic_periods(created_by)` - Périodes par professeur
- `academic_periods(created_by, is_active)` - Période active
- `classes(created_by)` - Classes par professeur
- `classes(created_by, school_year_id)` - Classes par année
- `students(created_by)` - Élèves par professeur
- `students(created_by, class_id)` - Élèves par classe
- `course_sessions(created_by)` - Sessions par professeur
- `course_sessions(created_by, session_date)` - Sessions par date
- `student_participation(created_by)` - Participations par professeur
- `student_participation(created_by, is_present)` - Recherche présence
- `exams(created_by)` - Examens par professeur
- `exams(created_by, exam_date)` - Examens par date
- `student_exam_results(created_by)` - Résultats par professeur
- `student_exam_results(created_by, grade_fr)` - Tri notes françaises
- `student_exam_results(created_by, grade_percent)` - Tri notes pourcentages
- `generated_content(created_by)` - Contenus générés par professeur
- `generated_content(created_by, content_type)` - Contenus par type (appréciation/bilan)
- `generated_content(created_by, status)` - Contenus par statut
- `generated_content(student_id)` - Contenus par élève
- `generated_content(generated_at)` - Tri chronologique des générations

### Requêtes Optimisées

```sql
-- Classes d'un utilisateur pour l'année courante (SaaS isolé)
SELECT c.*, sl.name as level_name, sy.name as year_name
FROM classes c
JOIN school_levels sl ON c.school_level_id = sl.id AND sl.created_by = c.created_by
JOIN school_years sy ON c.school_year_id = sy.id AND sy.created_by = c.created_by
WHERE c.created_by = $1 AND sy.is_active = true;

-- Élèves d'un utilisateur avec classe optionnelle
SELECT st.*, c.class_code, c.id as class_id
FROM students st
LEFT JOIN classes c ON st.class_id = c.id
WHERE st.created_by = $1
ORDER BY st.last_name, st.first_name;

-- Sessions d'une classe pour une période (SaaS isolé)
SELECT cs.*, s.name as subject_name, ts.name as time_slot_name
FROM course_sessions cs
JOIN subjects s ON cs.subject_id = s.id AND s.created_by = cs.created_by
JOIN time_slots ts ON cs.time_slot_id = ts.id AND ts.created_by = cs.created_by
WHERE cs.class_id = $1 
AND cs.created_by = $2
AND cs.session_date BETWEEN $3 AND $4
ORDER BY cs.session_date, ts.display_order;

-- Participations d'une session avec détails élève
SELECT sp.*, st.first_name, st.last_name, st.class_id
FROM student_participation sp
JOIN students st ON sp.student_id = st.id
WHERE sp.course_session_id = $1
ORDER BY st.last_name, st.first_name;

-- Historique des participations d'un élève
SELECT sp.*, cs.title, cs.session_date, s.name as subject_name
FROM student_participation sp
JOIN course_sessions cs ON sp.course_session_id = cs.id
JOIN subjects s ON cs.subject_id = s.id
WHERE sp.student_id = $1
ORDER BY cs.session_date DESC;

-- Analyse de participation d'une classe sur une période
SELECT AVG(sp.participation_level) as avg_participation,
       COUNT(CASE WHEN sp.is_present THEN 1 END) as presents,
       COUNT(CASE WHEN sp.camera_enabled THEN 1 END) as cameras_on,
       COUNT(*) as total_sessions
FROM student_participation sp
JOIN course_sessions cs ON sp.course_session_id = cs.id
WHERE cs.class_id = $1 
AND cs.session_date BETWEEN $2 AND $3;

-- Rapport d'un élève pour une matière
SELECT sp.specific_remarks, sp.behavior, sp.participation_level, 
       sp.technical_issues, sp.is_present, sp.camera_enabled,
       cs.title, cs.session_date, s.name as subject_name
FROM student_participation sp
JOIN course_sessions cs ON sp.course_session_id = cs.id
JOIN subjects s ON cs.subject_id = s.id
WHERE sp.student_id = $1 
AND s.id = $2
AND cs.session_date BETWEEN $3 AND $4
ORDER BY cs.session_date;

-- Statistiques techniques d'une session
SELECT COUNT(CASE WHEN sp.technical_issues IS NOT NULL THEN 1 END) as technical_issues,
       COUNT(CASE WHEN sp.camera_enabled = true THEN 1 END) as cameras_enabled,
       AVG(sp.participation_level) as avg_participation,
       COUNT(CASE WHEN sp.is_present THEN 1 END) as attendees
FROM student_participation sp
WHERE sp.course_session_id = $1;

-- Examens d'un professeur pour une période
SELECT e.*, c.class_code, s.name as subject_name, ap.name as period_name
FROM exams e
JOIN classes c ON e.class_id = c.id
JOIN subjects s ON e.subject_id = s.id
JOIN academic_periods ap ON e.academic_period_id = ap.id
WHERE e.created_by = $1 
AND ap.id = $2
ORDER BY e.exam_date DESC;

-- Résultats d'un examen avec détails élèves
SELECT ser.*, st.first_name, st.last_name, st.class_id,
       e.title as exam_title, e.total_points_fr, e.exam_type
FROM student_exam_results ser
JOIN students st ON ser.student_id = st.id
JOIN exams e ON ser.exam_id = e.id
WHERE ser.exam_id = $1
ORDER BY st.last_name, st.first_name;

-- Moyennes d'un élève par matière pour une période
SELECT s.name as subject_name, s.code as subject_code,
       AVG(ser.grade_fr) as moyenne_fr,
       AVG(ser.grade_percent) as moyenne_percent,
       COUNT(CASE WHEN ser.is_absent = false THEN 1 END) as nb_evaluations,
       COUNT(CASE WHEN ser.is_absent = true THEN 1 END) as nb_absences,
       -- Moyenne pondérée par coefficients
       SUM(ser.grade_fr * e.coefficient) / SUM(e.coefficient) as moyenne_ponderee_fr
FROM student_exam_results ser
JOIN exams e ON ser.exam_id = e.id
JOIN subjects s ON e.subject_id = s.id
WHERE ser.student_id = $1 
AND e.academic_period_id = $2
GROUP BY s.id, s.name, s.code
ORDER BY s.name;

-- Moyennes d'une classe par matière pour une période
SELECT s.name as subject_name,
       AVG(ser.grade_fr) as moyenne_classe_fr,
       AVG(ser.grade_percent) as moyenne_classe_percent,
       MIN(ser.grade_fr) as note_min_fr,
       MAX(ser.grade_fr) as note_max_fr,
       COUNT(CASE WHEN ser.is_absent = false THEN 1 END) as total_evaluations,
       COUNT(DISTINCT ser.student_id) as nb_eleves_evalues,
       -- Répartition par tranches
       COUNT(CASE WHEN ser.grade_fr >= 16 THEN 1 END) as excellent_16_20,
       COUNT(CASE WHEN ser.grade_fr >= 14 AND ser.grade_fr < 16 THEN 1 END) as bien_14_16,
       COUNT(CASE WHEN ser.grade_fr >= 12 AND ser.grade_fr < 14 THEN 1 END) as assez_bien_12_14,
       COUNT(CASE WHEN ser.grade_fr >= 10 AND ser.grade_fr < 12 THEN 1 END) as passable_10_12,
       COUNT(CASE WHEN ser.grade_fr < 10 THEN 1 END) as insuffisant_0_10
FROM student_exam_results ser
JOIN exams e ON ser.exam_id = e.id
JOIN subjects s ON e.subject_id = s.id
WHERE e.class_id = $1 
AND e.academic_period_id = $2
AND ser.is_absent = false
GROUP BY s.id, s.name
ORDER BY s.name;

-- Évolution des notes d'un élève dans une matière
SELECT e.exam_date, e.title, e.exam_type, 
       ser.grade_fr, ser.grade_percent,
       ser.comments, ser.corrections
FROM student_exam_results ser
JOIN exams e ON ser.exam_id = e.id
WHERE ser.student_id = $1 
AND e.subject_id = $2
AND ser.is_absent = false
ORDER BY e.exam_date;

-- Périodes académiques pour un système (trimestre/semestre)
SELECT ap.*
FROM academic_periods ap
JOIN school_years sy ON ap.school_year_id = sy.id
WHERE sy.is_active = true
AND ap.period_type = (
    CASE 
        WHEN (SELECT semester_system FROM users WHERE id = $1) = true 
        THEN 'semestre' 
        ELSE 'trimestre' 
    END
)
ORDER BY ap.period_number;

-- Moyennes d'un élève adaptées au système de notation du professeur
SELECT s.name as subject_name, s.code as subject_code,
       -- Moyennes selon le système de notation choisi par le professeur
       CASE u.notation_system
           WHEN 'french' THEN AVG(ser.grade_fr)
           WHEN 'percentage' THEN AVG(ser.grade_percent)
           WHEN 'both' THEN AVG(ser.grade_fr)  -- Priorité français si les deux
       END as moyenne_principale,
       CASE u.notation_system
           WHEN 'french' THEN NULL
           WHEN 'percentage' THEN NULL
           WHEN 'both' THEN AVG(ser.grade_percent)  -- Secondaire si les deux
       END as moyenne_secondaire,
       COUNT(CASE WHEN ser.is_absent = false THEN 1 END) as nb_evaluations,
       COUNT(CASE WHEN ser.is_absent = true THEN 1 END) as nb_absences,
       -- Moyenne pondérée selon le système
       CASE u.notation_system
           WHEN 'french' THEN SUM(ser.grade_fr * e.coefficient) / SUM(e.coefficient)
           WHEN 'percentage' THEN SUM(ser.grade_percent * e.coefficient) / SUM(e.coefficient)
           WHEN 'both' THEN SUM(ser.grade_fr * e.coefficient) / SUM(e.coefficient)
       END as moyenne_ponderee
FROM student_exam_results ser
JOIN exams e ON ser.exam_id = e.id
JOIN subjects s ON e.subject_id = s.id
JOIN users u ON e.created_by = u.id
WHERE ser.student_id = $1 
AND e.academic_period_id = $2
GROUP BY s.id, s.name, s.code, u.notation_system
ORDER BY s.name;

-- Statistiques d'une classe adaptées au système de notation
SELECT s.name as subject_name,
       u.notation_system,
       -- Moyennes selon le système choisi
       CASE u.notation_system
           WHEN 'french' THEN AVG(ser.grade_fr)
           WHEN 'percentage' THEN AVG(ser.grade_percent)
           WHEN 'both' THEN AVG(ser.grade_fr)
       END as moyenne_classe_principale,
       CASE u.notation_system
           WHEN 'french' THEN MIN(ser.grade_fr)
           WHEN 'percentage' THEN MIN(ser.grade_percent)
           WHEN 'both' THEN MIN(ser.grade_fr)
       END as note_min,
       CASE u.notation_system
           WHEN 'french' THEN MAX(ser.grade_fr)
           WHEN 'percentage' THEN MAX(ser.grade_percent)
           WHEN 'both' THEN MAX(ser.grade_fr)
       END as note_max,
       COUNT(CASE WHEN ser.is_absent = false THEN 1 END) as total_evaluations,
       COUNT(DISTINCT ser.student_id) as nb_eleves_evalues,
       -- Répartition adaptée au système français seulement (si applicable)
       CASE 
           WHEN u.notation_system IN ('french', 'both') THEN
               COUNT(CASE WHEN ser.grade_fr >= 16 THEN 1 END)
           ELSE NULL
       END as excellent_16_20,
       CASE 
           WHEN u.notation_system IN ('french', 'both') THEN
               COUNT(CASE WHEN ser.grade_fr >= 14 AND ser.grade_fr < 16 THEN 1 END)
           ELSE NULL
       END as bien_14_16,
       CASE 
           WHEN u.notation_system IN ('french', 'both') THEN
               COUNT(CASE WHEN ser.grade_fr >= 12 AND ser.grade_fr < 14 THEN 1 END)
           ELSE NULL
       END as assez_bien_12_14,
       CASE 
           WHEN u.notation_system IN ('french', 'both') THEN
               COUNT(CASE WHEN ser.grade_fr >= 10 AND ser.grade_fr < 12 THEN 1 END)
           ELSE NULL
       END as passable_10_12,
       CASE 
           WHEN u.notation_system IN ('french', 'both') THEN
               COUNT(CASE WHEN ser.grade_fr < 10 THEN 1 END)
           ELSE NULL
       END as insuffisant_0_10,
       -- Répartition pour système pourcentage
       CASE 
           WHEN u.notation_system = 'percentage' THEN
               COUNT(CASE WHEN ser.grade_percent >= 80 THEN 1 END)
           ELSE NULL
       END as excellent_80_100,
       CASE 
           WHEN u.notation_system = 'percentage' THEN
               COUNT(CASE WHEN ser.grade_percent >= 70 AND ser.grade_percent < 80 THEN 1 END)
           ELSE NULL
       END as bien_70_80,
       CASE 
           WHEN u.notation_system = 'percentage' THEN
               COUNT(CASE WHEN ser.grade_percent >= 60 AND ser.grade_percent < 70 THEN 1 END)
           ELSE NULL
       END as assez_bien_60_70,
       CASE 
           WHEN u.notation_system = 'percentage' THEN
               COUNT(CASE WHEN ser.grade_percent >= 50 AND ser.grade_percent < 60 THEN 1 END)
           ELSE NULL
       END as passable_50_60,
       CASE 
           WHEN u.notation_system = 'percentage' THEN
               COUNT(CASE WHEN ser.grade_percent < 50 THEN 1 END)
           ELSE NULL
       END as insuffisant_0_50
FROM student_exam_results ser
JOIN exams e ON ser.exam_id = e.id
JOIN subjects s ON e.subject_id = s.id
JOIN users u ON e.created_by = u.id
WHERE e.class_id = $1 
AND e.academic_period_id = $2
AND ser.is_absent = false
GROUP BY s.id, s.name, u.notation_system
ORDER BY s.name;

-- Contenus générés par IA pour un élève
SELECT gc.*, s.name as subject_name, ap.name as period_name
FROM generated_content gc
LEFT JOIN subjects s ON gc.subject_id = s.id
LEFT JOIN academic_periods ap ON gc.academic_period_id = ap.id
WHERE gc.student_id = $1
AND gc.created_by = $2
ORDER BY gc.generated_at DESC;

-- Appréciations d'un élève pour une matière et période
SELECT gc.content, gc.status, gc.generated_at, gc.generation_params
FROM generated_content gc
WHERE gc.student_id = $1
AND gc.subject_id = $2
AND gc.academic_period_id = $3
AND gc.content_type = 'appreciation'
AND gc.created_by = $4
ORDER BY gc.generated_at DESC;

-- Bilans bihebdomadaires d'un élève
SELECT gc.content, gc.status, gc.generated_at, gc.input_data
FROM generated_content gc
WHERE gc.student_id = $1
AND gc.content_type = 'biweekly_report'
AND gc.created_by = $2
ORDER BY gc.generated_at DESC;

-- Historique des générations d'un professeur
SELECT gc.*, st.first_name, st.last_name, s.name as subject_name
FROM generated_content gc
JOIN students st ON gc.student_id = st.id
LEFT JOIN subjects s ON gc.subject_id = s.id
WHERE gc.created_by = $1
AND gc.generated_at >= $2  -- Date de début
ORDER BY gc.generated_at DESC;

-- Statistiques de génération par professeur
SELECT 
    COUNT(*) as total_generations,
    COUNT(CASE WHEN content_type = 'appreciation' THEN 1 END) as appreciations,
    COUNT(CASE WHEN content_type = 'biweekly_report' THEN 1 END) as biweekly_reports,
    COUNT(CASE WHEN status = 'final' THEN 1 END) as finalized,
    COUNT(CASE WHEN status = 'draft' THEN 1 END) as drafts,
    AVG(LENGTH(content)) as avg_content_length
FROM generated_content
WHERE created_by = $1
AND generated_at >= $2;  -- Période de référence
```