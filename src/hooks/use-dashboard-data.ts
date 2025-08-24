import { useState } from "react";

interface Student {
  id: string;
  name: string;
  class: string;
  level?: string;
  status?: "present" | "absent" | "late";
}

interface Class {
  id: string;
  name: string;
  studentCount: number;
}

interface UpcomingCourse {
  id: string;
  class: string;
  time: string;
  duration: string;
}

export function useDashboardData() {
  const [classes] = useState<Class[]>([
    { id: "1", name: "B1", studentCount: 15 },
    { id: "2", name: "C1", studentCount: 12 },
    { id: "3", name: "A2", studentCount: 18 },
    { id: "4", name: "B2", studentCount: 14 },
    { id: "5", name: "C2", studentCount: 10 },
    { id: "6", name: "A1", studentCount: 20 },
    { id: "7", name: "Préparatoire", studentCount: 8 },
    { id: "8", name: "Avancé", studentCount: 6 },
  ]);

  const [students] = useState<Student[]>([
    // Classe B1 (15 élèves)
    { id: "1", name: "Emma Martin", class: "B1" },
    { id: "2", name: "Lucas Dubois", class: "B1" },
    { id: "3", name: "Léa Rousseau", class: "B1" },
    { id: "4", name: "Nathan Bernard", class: "B1" },
    { id: "5", name: "Chloé Moreau", class: "B1" },
    { id: "6", name: "Hugo Laurent", class: "B1" },
    { id: "7", name: "Manon Simon", class: "B1" },
    { id: "8", name: "Théo Michel", class: "B1" },
    { id: "9", name: "Camille Leroy", class: "B1" },
    { id: "10", name: "Maxime Fournier", class: "B1" },
    { id: "11", name: "Clara Bonnet", class: "B1" },
    { id: "12", name: "Antoine Dupont", class: "B1" },
    { id: "13", name: "Sarah Mercier", class: "B1" },
    { id: "14", name: "Julien Blanc", class: "B1" },
    { id: "15", name: "Océane Girard", class: "B1" },

    // Classe C1 (12 élèves)
    { id: "16", name: "Thomas Roux", class: "C1" },
    { id: "17", name: "Jade Morel", class: "C1" },
    { id: "18", name: "Raphaël André", class: "C1" },
    { id: "19", name: "Inès Lefebvre", class: "C1" },
    { id: "20", name: "Enzo Garcia", class: "C1" },
    { id: "21", name: "Lola Thomas", class: "C1" },
    { id: "22", name: "Gabriel Robert", class: "C1" },
    { id: "23", name: "Nina Petit", class: "C1" },
    { id: "24", name: "Arthur Durand", class: "C1" },
    { id: "25", name: "Zoé Richard", class: "C1" },
    { id: "26", name: "Valentin Lemoine", class: "C1" },
    { id: "27", name: "Margot Vincent", class: "C1" },

    // Classe A2 (18 élèves)
    { id: "28", name: "Alexis Faure", class: "A2" },
    { id: "29", name: "Mathilde Perrin", class: "A2" },
    { id: "30", name: "Quentin Masson", class: "A2" },
    { id: "31", name: "Eva Lopez", class: "A2" },
    { id: "32", name: "Romain Fontaine", class: "A2" },
    { id: "33", name: "Juliette Chevalier", class: "A2" },
    { id: "34", name: "Nicolas Robin", class: "A2" },
    { id: "35", name: "Anaïs Masson", class: "A2" },
    { id: "36", name: "Loïc Clement", class: "A2" },
    { id: "37", name: "Elise Lambert", class: "A2" },
    { id: "38", name: "Kevin Roussel", class: "A2" },
    { id: "39", name: "Marina Bertrand", class: "A2" },
    { id: "40", name: "Dylan Garnier", class: "A2" },
    { id: "41", name: "Amélie Fabre", class: "A2" },
    { id: "42", name: "Bastien Muller", class: "A2" },
    { id: "43", name: "Pauline Barbier", class: "A2" },
    { id: "44", name: "Florian Meyer", class: "A2" },
    { id: "45", name: "Laurine Dupuis", class: "A2" },

    // Classe B2 (14 élèves)
    { id: "46", name: "Benjamin Lecomte", class: "B2" },
    { id: "47", name: "Alicia Boyer", class: "B2" },
    { id: "48", name: "Adrien Carpentier", class: "B2" },
    { id: "49", name: "Justine Meunier", class: "B2" },
    { id: "50", name: "Guillaume Lacroix", class: "B2" },
    { id: "51", name: "Coralie Joly", class: "B2" },
    { id: "52", name: "Damien Guillot", class: "B2" },
    { id: "53", name: "Tiffany Riviere", class: "B2" },
    { id: "54", name: "Sébastien Gauthier", class: "B2" },
    { id: "55", name: "Melody Perret", class: "B2" },
    { id: "56", name: "Mickael Renard", class: "B2" },
    { id: "57", name: "Estelle Bourgeois", class: "B2" },
    { id: "58", name: "Jeremy Blanchard", class: "B2" },
    { id: "59", name: "Audrey Hubert", class: "B2" },

    // Classe C2 (10 élèves)
    { id: "60", name: "Alexandre Giraud", class: "C2" },
    { id: "61", name: "Céline Marchand", class: "C2" },
    { id: "62", name: "Vincent Moulin", class: "C2" },
    { id: "63", name: "Emilie Brunet", class: "C2" },
    { id: "64", name: "Fabien Leclerc", class: "C2" },
    { id: "65", name: "Laetitia Rolland", class: "C2" },
    { id: "66", name: "Cyril Brun", class: "C2" },
    { id: "67", name: "Virginie Schmitt", class: "C2" },
    { id: "68", name: "Samuel Lemaire", class: "C2" },
    { id: "69", name: "Sophie Rey", class: "C2" },

    // Classe A1 (20 élèves)
    { id: "70", name: "Pierre Collin", class: "A1" },
    { id: "71", name: "Marie Vasseur", class: "A1" },
    { id: "72", name: "Julien Hamon", class: "A1" },
    { id: "73", name: "Aurélie Benoit", class: "A1" },
    { id: "74", name: "David Lefevre", class: "A1" },
    { id: "75", name: "Caroline Colin", class: "A1" },
    { id: "76", name: "Mathieu Vidal", class: "A1" },
    { id: "77", name: "Nathalie Morvan", class: "A1" },
    { id: "78", name: "Christophe Berger", class: "A1" },
    { id: "79", name: "Isabelle Fleury", class: "A1" },
    { id: "80", name: "Laurent Gaillard", class: "A1" },
    { id: "81", name: "Sandrine Dias", class: "A1" },
    { id: "82", name: "François Leclercq", class: "A1" },
    { id: "83", name: "Valérie Pastor", class: "A1" },
    { id: "84", name: "Philippe Menard", class: "A1" },
    { id: "85", name: "Corinne Pons", class: "A1" },
    { id: "86", name: "Stéphane Torres", class: "A1" },
    { id: "87", name: "Patricia Caron", class: "A1" },
    { id: "88", name: "Michel Gonzalez", class: "A1" },
    { id: "89", name: "Sylvie Roche", class: "A1" },

    // Classe Préparatoire (8 élèves)
    { id: "90", name: "Antoine Lejeune", class: "Préparatoire" },
    { id: "91", name: "Charlotte Delaunay", class: "Préparatoire" },
    { id: "92", name: "Louis Marin", class: "Préparatoire" },
    { id: "93", name: "Pauline Cousin", class: "Préparatoire" },
    { id: "94", name: "Victor Leconte", class: "Préparatoire" },
    { id: "95", name: "Alice Renaud", class: "Préparatoire" },
    { id: "96", name: "Clément Prevost", class: "Préparatoire" },
    { id: "97", name: "Julie Germain", class: "Préparatoire" },

    // Classe Avancé (6 élèves)
    { id: "98", name: "Maxime Olivier", class: "Avancé" },
    { id: "99", name: "Clara Perez", class: "Avancé" },
    { id: "100", name: "Rémi Picard", class: "Avancé" },
    { id: "101", name: "Lisa König", class: "Avancé" },
    { id: "102", name: "Jordan Martinez", class: "Avancé" },
    { id: "103", name: "Anaëlle Weber", class: "Avancé" },
  ]);

  const [upcomingCourses] = useState<UpcomingCourse[]>([
    { id: "1", class: "B1", time: "09h00 - 10h30", duration: "Dans 30 min" },
    { id: "2", class: "C1", time: "10h45 - 12h15", duration: "Dans 1h45min" },
    { id: "3", class: "A2", time: "14h00 - 15h30", duration: "Dans 5h30min" },
    { id: "4", class: "B2", time: "15h45 - 17h15", duration: "Dans 7h15min" },
    {
      id: "5",
      class: "Préparatoire",
      time: "08h00 - 09h00",
      duration: "Demain 8h",
    },
    { id: "6", class: "A1", time: "13h30 - 15h00", duration: "Demain 13h30" },
    { id: "7", class: "C2", time: "16h00 - 17h30", duration: "Demain 16h" },
    { id: "8", class: "Avancé", time: "18h00 - 19h30", duration: "Demain 18h" },
    { id: "9", class: "B1", time: "10h00 - 11h30", duration: "Lundi 10h" },
    { id: "10", class: "A2", time: "14h30 - 16h00", duration: "Lundi 14h30" },
  ]);

  const addNewClass = (className: string) => {
    // Logic to add new class
    console.log("Adding new class:", className);
  };

  const addNewStudent = (studentName: string, studentClass: string) => {
    // Logic to add new student
    console.log("Adding new student:", studentName, "to class:", studentClass);
  };

  return {
    classes,
    students,
    upcomingCourses,
    addNewClass,
    addNewStudent,
  };
}
