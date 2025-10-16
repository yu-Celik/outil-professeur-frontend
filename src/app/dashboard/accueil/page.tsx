"use client";

import { CalendarWidget } from "@/components/organisms/calendar-widget";
import { ChatAI } from "@/components/organisms/chat-ai";
import { ClassesStudentsCard } from "@/components/organisms/classes-students-card";
import { OnboardingBanner } from "@/components/organisms/onboarding-banner";
import { useDashboardData } from "@/features/accueil";
import { useUserSession } from "@/features/settings";
import { useSetPageTitle } from "@/shared/hooks";

export default function AccueilPage() {
  useSetPageTitle("Tableau de bord");

  const { user } = useUserSession();
  const { classes, students } = useDashboardData();

  // Utilise l'ID spécifique du teacher principal
  const currentTeacherId = user?.id || "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR";

  const handleSkipOnboarding = () => {
    console.log("Skipping onboarding");
  };

  const handleConfirmOnboarding = () => {
    console.log("Confirming onboarding");
  };

  const handleAddClass = () => {
    console.log("Adding new class");
  };

  const handleAddClassData = (classData: {
    identifier: string;
    level: string;
    schoolYear: string;
  }) => {
    console.log("Adding class with data:", classData);
    // Ici vous pourrez ajouter la logique pour sauvegarder la classe
  };

  const handleAddStudentData = (studentData: {
    class: string;
    name: string;
    firstName: string;
  }) => {
    console.log("Adding student with data:", studentData);
    // Ici vous pourrez ajouter la logique pour sauvegarder l'élève
  };

  const handleStudentSort = (sortBy: string) => {
    console.log("Sorting students by:", sortBy);
  };

  return (
    <main className="flex-1 lg:h-[calc(100vh-112px)] flex flex-col gap-4 overflow-hidden">
      {/* Bandeau d'onboarding */}
      <div className="flex-shrink-0">
        <OnboardingBanner
          step={1}
          totalSteps={4}
          message="Veuillez renseigner votre première classe"
          onSkip={handleSkipOnboarding}
          onConfirm={handleConfirmOnboarding}
        />
      </div>

      {/* Contenu principal - 2 colonnes sur desktop, 1 colonne sur mobile */}
      <div className="flex gap-4 flex-1 min-h-0 flex-col 2xl:flex-row xl:peer-data-[state=collapsed]:flex-row">
        {/* Section Classes */}
        <div className="flex flex-col gap-4 flex-3 min-w-0 min-h-0">
          <div className="flex-1 min-h-0">
            <ClassesStudentsCard
              type="classes"
              classes={classes}
              students={students}
              teacherId={currentTeacherId}
              onAdd={handleAddClass}
              onSortChange={handleStudentSort}
              onAddClass={handleAddClassData}
              onAddStudent={handleAddStudentData}
            />
          </div>
          <div className="flex-shrink-0 h-96">
            <CalendarWidget teacherId={currentTeacherId} />
          </div>
        </div>

        {/* Section Chat IA */}
        <div className="flex-2 min-w-0 min-h-0">
          <ChatAI />
        </div>
      </div>

      {/* Widget Prochains cours */}
    </main>
  );
}
