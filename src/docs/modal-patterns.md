# 🎭 Guide des Patterns de Modales Standardisées

Ce guide explique comment utiliser le pattern élégant `useModal` basé sur l'ouverture `SessionContextMenu → SessionCancelDialog`.

## ✨ Le Hook `useModal`

### Pattern Avec Données (Recommandé)

```typescript
import { useModal } from "@/hooks/use-modal";
import type { CourseSession, Student, Class } from "@/types/uml-entities";

// ✨ Pour une modal avec des données d'entité
const cancelModal = useModal<CourseSession>();
const editStudentModal = useModal<Student>();
const editClassModal = useModal<Class>();

// Ouverture élégante avec contexte
const handleCancel = (session: CourseSession) => {
  cancelModal.open(session); // Données d'abord, modal ensuite
};

// Fermeture propre
const handleConfirm = () => {
  // Faire l'action avec cancelModal.data
  cancelModal.close(); // Fermer et nettoyer
};

// JSX avec props automatiques
<SessionCancelDialog
  session={cancelModal.data}           // Les données
  {...cancelModal.modalProps}         // open + onOpenChange
  onConfirm={handleConfirm}
/>
```

### Pattern Simple (Sans Données)

```typescript
import { useSimpleModal } from "@/hooks/use-modal";

// ✨ Pour les modales simples sans données
const colorPickerModal = useSimpleModal();
const helpModal = useSimpleModal();

// Ouverture simple
<Button onClick={colorPickerModal.open}>
  Couleurs
</Button>

// JSX avec props automatiques
<ColorPicker
  {...colorPickerModal.modalProps}    // open + onOpenChange
  isOpen={colorPickerModal.isOpen}    // Pour compatibilité
  onClose={colorPickerModal.close}
/>
```

## 🎯 Exemples d'Application

### 1. Context Menu → Modal (Pattern de Référence)

```typescript
// ✅ SessionContextMenu → SessionCancelDialog
const cancelModal = useModal<CourseSession>();

// Dans le context menu
<SessionContextMenu
  session={session}
  onCancel={cancelModal.open}  // Passage direct de la fonction
  onViewDetails={handleView}
/>

// Modal
<SessionCancelDialog
  session={cancelModal.data}
  {...cancelModal.modalProps}
  onConfirm={(sessionId) => {
    cancelSession(sessionId);
    cancelModal.close();
  }}
/>
```

### 2. Bouton → Modal avec Formulaire

```typescript
// ✅ Bouton → Formulaire d'édition
const editStudentModal = useModal<Student>();

// Bouton d'édition
<Button onClick={() => editStudentModal.open(student)}>
  ✏️ Modifier
</Button>

// Modal avec formulaire pré-rempli
<StudentEditDialog
  student={editStudentModal.data}
  {...editStudentModal.modalProps}
  onSave={(updatedStudent) => {
    updateStudent(updatedStudent);
    editStudentModal.close();
  }}
/>
```

### 3. Liste → Modal de Confirmation

```typescript
// ✅ Liste d'éléments → Confirmation de suppression
const deleteModal = useModal<Class>();

// Dans la liste
{classes.map(classEntity => (
  <div key={classEntity.id}>
    <span>{classEntity.name}</span>
    <Button
      variant="destructive"
      onClick={() => deleteModal.open(classEntity)}
    >
      🗑️
    </Button>
  </div>
))}

// Modal de confirmation
<DeleteConfirmDialog
  item={deleteModal.data}
  {...deleteModal.modalProps}
  onConfirm={(id) => {
    deleteClass(id);
    deleteModal.close();
  }}
/>
```

### 4. Toolbar → Modal de Configuration

```typescript
// ✅ Barre d'outils → Configuration
const settingsModal = useSimpleModal();

// Dans la toolbar
<CalendarToolbar
  onManageColors={settingsModal.open}  // Fonction directe
  onCreateSession={createModal.open}
/>

// Modal simple
<SettingsDialog
  {...settingsModal.modalProps}
  onSave={settingsModal.close}
/>
```

## 🔧 Refactoring d'Anciennes Modales

### Avant (Pattern Inconsistant)

```typescript
// ❌ Ancien pattern avec état manuel
const [showDialog, setShowDialog] = useState(false);
const [sessionData, setSessionData] = useState(null);

const handleOpen = (session) => {
  setSessionData(session);
  setShowDialog(true);
};

const handleClose = () => {
  setShowDialog(false);
  setSessionData(null);
};

// JSX verbeux
{showDialog && (
  <Dialog open={showDialog} onOpenChange={setShowDialog}>
    <DialogContent>
      {/* ... */}
    </DialogContent>
  </Dialog>
)}
```

### Après (Pattern Standardisé)

```typescript
// ✅ Nouveau pattern avec hook
const dialogModal = useModal<Session>();

// Ouverture élégante
const handleOpen = dialogModal.open;

// JSX propre
<Dialog
  session={dialogModal.data}
  {...dialogModal.modalProps}
  onConfirm={(id) => {
    performAction(id);
    dialogModal.close();
  }}
/>
```

## 📋 Checklist de Migration

Pour migrer vos modales existantes :

### ✅ Étapes de Refactoring

1. **Remplacer les useState manuels**
   ```typescript
   // ❌ Supprimer
   const [showModal, setShowModal] = useState(false);
   const [modalData, setModalData] = useState(null);
   
   // ✅ Remplacer par
   const modal = useModal<EntityType>();
   ```

2. **Simplifier l'ouverture**
   ```typescript
   // ❌ Ancien
   const handleOpen = (data) => {
     setModalData(data);
     setShowModal(true);
   };
   
   // ✅ Nouveau
   const handleOpen = modal.open;
   ```

3. **Utiliser les props automatiques**
   ```typescript
   // ❌ Ancien
   <Dialog open={showModal} onOpenChange={setShowModal}>
   
   // ✅ Nouveau
   <Dialog {...modal.modalProps}>
   ```

4. **Nettoyer la fermeture**
   ```typescript
   // ❌ Ancien
   const handleClose = () => {
     setShowModal(false);
     setModalData(null);
   };
   
   // ✅ Nouveau
   // Utiliser directement modal.close
   ```

## 🎨 Avantages du Pattern Standardisé

### 🚀 Performance
- Moins de re-renders inutiles
- État optimisé avec `useCallback`
- Nettoyage automatique des données

### 🧹 Code Plus Propre
- Moins de boilerplate
- Pattern cohérent partout
- Props automatiques pour Radix UI

### 🔒 Type Safety
- Types TypeScript stricts
- IntelliSense complet
- Erreurs de compilation précoces

### 🎯 UX Cohérente
- Comportement uniforme
- Animations cohérentes
- Gestion d'erreurs standardisée

## 🚀 Utilisation Avancée

### Modal avec Validation

```typescript
const formModal = useModal<{ mode: 'create' | 'edit', data?: Student }>();

// Ouverture avec contexte
<Button onClick={() => formModal.open({ mode: 'create' })}>
  Nouveau
</Button>

<Button onClick={() => formModal.open({ mode: 'edit', data: student })}>
  Modifier
</Button>

// Modal adaptative
<StudentForm
  mode={formModal.data?.mode}
  initialData={formModal.data?.data}
  {...formModal.modalProps}
  onSubmit={(student) => {
    if (formModal.data?.mode === 'create') {
      createStudent(student);
    } else {
      updateStudent(student);
    }
    formModal.close();
  }}
/>
```

### Multi-Step Modal

```typescript
const wizardModal = useModal<{ step: number, data: Partial<CourseSession> }>();

// Ouverture du wizard
const startWizard = () => {
  wizardModal.open({ step: 1, data: {} });
};

// Navigation dans les étapes
const nextStep = (newData: Partial<CourseSession>) => {
  wizardModal.open({
    step: (wizardModal.data?.step || 1) + 1,
    data: { ...wizardModal.data?.data, ...newData }
  });
};
```

---

Ce pattern garantit une expérience utilisateur cohérente et un code maintenable dans toute l'application ! 🎉