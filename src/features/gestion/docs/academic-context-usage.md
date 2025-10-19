# Academic Context Usage Guide

## Overview

The Academic Context provides global access to the active school year and academic period across the entire application. This enables consistent filtering and date-based calculations.

## Setup

### 1. Wrap your app with the provider

```tsx
// app/layout.tsx or app/dashboard/layout.tsx
import { AcademicContextProvider } from "@/features/gestion";

export default function DashboardLayout({ children }) {
  return (
    <AcademicContextProvider teacherId={user?.id} useMockData={false}>
      {children}
    </AcademicContextProvider>
  );
}
```

### 2. Use the hook in any component

```tsx
import { useAcademicContext } from "@/features/gestion";

export function StudentAnalytics() {
  const { activeSchoolYear, activePeriod, loading } = useAcademicContext();

  if (loading) return <div>Chargement...</div>;
  if (!activePeriod) return <div>Aucune période active</div>;

  // Filter sessions by active period
  const filteredSessions = sessions.filter(s =>
    activePeriod.contains(s.sessionDate)
  );

  return (
    <div>
      <h2>Période: {activePeriod.name}</h2>
      <p>Du {formatDate(activePeriod.startDate)} au {formatDate(activePeriod.endDate)}</p>
      {/* Your analytics... */}
    </div>
  );
}
```

## API Reference

### `useAcademicContext()`

Returns the current academic context:

```typescript
interface AcademicContextValue {
  // Active entities
  activeSchoolYear: SchoolYear | null;
  activePeriod: AcademicPeriod | null;

  // All available data
  schoolYears: SchoolYear[];
  periods: AcademicPeriod[];

  // Loading states
  loading: boolean;
  error: string | null;

  // Actions
  setActiveSchoolYear: (id: string) => Promise<void>;
  setActivePeriod: (id: string) => Promise<void>;
  reload: () => void;
}
```

### `useActiveAcademicEntities()`

Standalone hook (no context provider required):

```tsx
import { useActiveAcademicEntities } from "@/features/gestion";

export function MyComponent() {
  const { activeSchoolYear, activePeriod, loading } = useActiveAcademicEntities();

  // Use active entities...
}
```

## Common Use Cases

### 1. Filter data by active period

```tsx
const { activePeriod } = useAcademicContext();

// Filter sessions
const currentSessions = allSessions.filter(session =>
  activePeriod?.contains(session.sessionDate)
);

// Filter exams
const currentExams = allExams.filter(exam =>
  activePeriod && exam.examDate >= activePeriod.startDate &&
  exam.examDate <= activePeriod.endDate
);
```

### 2. Calculate period-based analytics

```tsx
const { activePeriod } = useAcademicContext();

// Attendance rate for active period
const attendanceRate = useAttendanceRate(studentId, {
  startDate: activePeriod?.startDate,
  endDate: activePeriod?.endDate
});

// Participation average
const participationAvg = useParticipationAverage(studentId, {
  startDate: activePeriod?.startDate,
  endDate: activePeriod?.endDate
});
```

### 3. Display period selector

```tsx
const { activePeriod, periods, setActivePeriod } = useAcademicContext();

return (
  <Select value={activePeriod?.id} onValueChange={setActivePeriod}>
    {periods.map(period => (
      <SelectItem key={period.id} value={period.id}>
        {period.name}
      </SelectItem>
    ))}
  </Select>
);
```

### 4. Generate periods from academic structure

```tsx
import { PeriodCalculator } from "@/services/period-calculator";
import { useAcademicContext } from "@/features/gestion";

const { activeSchoolYear } = useAcademicContext();
const { getTeacherStructure } = useAcademicStructures();

const structure = getTeacherStructure();

if (activeSchoolYear && structure) {
  const generatedPeriods = PeriodCalculator.generatePeriods({
    schoolYear: activeSchoolYear,
    academicStructure: structure,
    teacherId: user.id
  });
}
```

## Integration with Existing Features

### Students Feature
```tsx
// Filter student participation by active period
const { activePeriod } = useAcademicContext();
const participations = useStudentParticipations(studentId, {
  startDate: activePeriod?.startDate,
  endDate: activePeriod?.endDate
});
```

### Calendar Feature
```tsx
// Show only sessions in active period
const { activePeriod } = useAcademicContext();
const sessions = useCourseSessions({
  from: activePeriod?.startDate.toISOString(),
  to: activePeriod?.endDate.toISOString()
});
```

### Evaluations Feature
```tsx
// Filter exams by active period
const { activePeriod } = useAcademicContext();
const exams = useExams({
  from: activePeriod?.startDate.toISOString().split('T')[0],
  to: activePeriod?.endDate.toISOString().split('T')[0]
});
```

## Testing

### Mock the context in tests

```tsx
import { AcademicContextProvider } from "@/features/gestion";

it('filters data by active period', () => {
  render(
    <AcademicContextProvider teacherId="test-user" useMockData={true}>
      <MyComponent />
    </AcademicContextProvider>
  );

  // Test your component...
});
```

## Migration Guide

If you were previously using `MOCK_SCHOOL_YEARS` or `getCurrentSchoolYear()`:

**Before:**
```tsx
import { MOCK_SCHOOL_YEARS } from "@/features/gestion/mocks";
const activeYear = MOCK_SCHOOL_YEARS.find(y => y.isActive);
```

**After:**
```tsx
import { useAcademicContext } from "@/features/gestion";
const { activeSchoolYear } = useAcademicContext();
```
