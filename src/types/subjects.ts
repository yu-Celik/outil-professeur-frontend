export interface Subject {
  id: string;
  name: string;
  code: string;
  category: SubjectCategory;
  level: EducationLevel[];
  description?: string;
}

export type SubjectCategory =
  | "mathematics"
  | "sciences"
  | "languages"
  | "humanities"
  | "arts"
  | "sports"
  | "technology"
  | "other";

export type EducationLevel = "primaire" | "college" | "lycee" | "superieur";

export interface UserSubject {
  subjectId: string;
  userId: string;
  levels: EducationLevel[];
  experience?: number; // en années
  certification?: string;
  isActive: boolean;
  createdAt: Date;
}
