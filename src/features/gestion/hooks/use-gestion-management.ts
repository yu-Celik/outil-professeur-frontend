/**
 * Hook principal de gestion administrative
 * Combine la gestion des classes, matières et années scolaires
 */

import { useClassManagement } from './use-class-management';
import { useSubjectManagement } from './use-subject-management';
import { useAcademicStructures } from './use-academic-structures';
import { MOCK_SCHOOL_YEARS } from '../mocks';

export function useGestionManagement() {
  const classManagement = useClassManagement();
  const subjectManagement = useSubjectManagement();
  const academicStructures = useAcademicStructures();

  return {
    // Classes
    classes: classManagement.classes,
    createClass: classManagement.createClass,
    updateClass: classManagement.updateClass,
    deleteClass: classManagement.deleteClass,
    getClassById: classManagement.getClassById,
    isCreatingClass: classManagement.loading,

    // Années scolaires
    schoolYears: MOCK_SCHOOL_YEARS,

    // Matières
    subjects: subjectManagement.subjects,
    createSubject: subjectManagement.createSubject,
    updateSubject: subjectManagement.updateSubject,
    deleteSubject: subjectManagement.deleteSubject,

    // États globaux
    loading: classManagement.loading || subjectManagement.loading || academicStructures.loading,
    error: classManagement.error || subjectManagement.error || academicStructures.error,

    // Méthodes utilitaires
    refresh: () => {
      classManagement.refresh();
      subjectManagement.refresh();
      academicStructures.reload();
    },
  };
}