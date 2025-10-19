# Academic Period Propagation - Test Specification

## Test: Verify active period propagates to consumer features

**Story**: 1.2 - Configurer les années scolaires et périodes
**Acceptance Criteria**: AC 8 - La période active est propagée au reste du système

## Test Setup

### Prerequisites
1. Souz backend running on `http://localhost:8080`
2. Test teacher account authenticated
3. At least one school year with multiple academic periods configured
4. At least one period marked as active

### Test Data
```typescript
const testData = {
  schoolYear: {
    name: "Année scolaire 2025-2026",
    startDate: "2025-09-01",
    endDate: "2026-06-30",
    isActive: true
  },
  periods: [
    {
      name: "Trimestre 1",
      order: 1,
      startDate: "2025-09-01",
      endDate: "2025-12-20",
      isActive: true
    },
    {
      name: "Trimestre 2",
      order: 2,
      startDate: "2026-01-05",
      endDate: "2026-03-31",
      isActive: false
    },
    {
      name: "Trimestre 3",
      order: 3,
      startDate: "2026-04-15",
      endDate: "2026-06-30",
      isActive: false
    }
  ]
};
```

## Test Scenarios

### Scenario 1: Period displayed in Settings page

**Steps:**
1. Navigate to `/dashboard/reglages`
2. Click on "Années scolaires" tab
3. Verify active school year is displayed with "Actif" badge
4. Click "Gérer les périodes" for the active year
5. Verify "Trimestre 1" shows "Actif" badge
6. Verify statistics show "1" active period

**Expected Results:**
- ✓ Active school year highlighted with primary color border
- ✓ "Actif" badge visible next to active period name
- ✓ Statistics correctly show 1/3 periods active

**Playwright Implementation:**
```typescript
test('displays active period in settings', async ({ page }) => {
  await page.goto('/dashboard/reglages');
  await page.getByRole('button', { name: 'Années scolaires' }).click();

  // Verify active year
  const activeYear = page.locator('[data-testid="school-year-item"]', {
    has: page.locator('text=Actif')
  });
  await expect(activeYear).toBeVisible();

  // Open periods dialog
  await activeYear.getByRole('button', { name: 'Gérer les périodes' }).click();

  // Verify active period
  const activePeriod = page.locator('[data-testid="period-item"]', {
    has: page.locator('text=Trimestre 1')
  });
  await expect(activePeriod.locator('text=Actif')).toBeVisible();

  // Verify statistics
  await expect(page.getByText('1')).toBeVisible(); // Active count
});
```

### Scenario 2: Period switch updates across app

**Steps:**
1. Navigate to `/dashboard/reglages` (Années scolaires tab)
2. Open periods management for active year
3. Activate "Trimestre 2" (deactivates Trimestre 1)
4. Navigate to `/dashboard/mes-eleves`
5. Select a student
6. Verify student analytics reflect Trimestre 2 dates

**Expected Results:**
- ✓ Only one period active after switch
- ✓ Student analytics recalculated for new period
- ✓ Participation and attendance filtered by new date range

**Playwright Implementation:**
```typescript
test('switching period updates consumer features', async ({ page }) => {
  // Setup: Navigate and switch period
  await page.goto('/dashboard/reglages');
  await page.getByRole('button', { name: 'Années scolaires' }).click();
  await page.getByRole('button', { name: 'Gérer les périodes' }).click();

  // Activate Trimestre 2
  const trimestre2 = page.locator('[data-testid="period-item"]', {
    has: page.locator('text=Trimestre 2')
  });
  await trimestre2.getByRole('button', { name: 'Activer' }).click();
  await page.waitForResponse(resp => resp.url().includes('/academic-periods'));

  // Verify only one active
  const activePeriods = page.locator('[data-testid="period-item"]:has-text("Actif")');
  await expect(activePeriods).toHaveCount(1);

  // Navigate to student view
  await page.goto('/dashboard/mes-eleves');
  await page.getByRole('link', { name: /Premier élève/ }).click();

  // Verify period dates displayed
  await expect(page.locator('text=Trimestre 2')).toBeVisible();
  await expect(page.locator('text=/05 jan.*31 mars/i')).toBeVisible();

  // Verify analytics filtered
  const analyticsCard = page.locator('[data-testid="student-analytics"]');
  await expect(analyticsCard).toContainText('Période: Trimestre 2');
});
```

### Scenario 3: useAcademicContext hook integration

**Steps:**
1. Create test component using `useAcademicContext`
2. Verify hook returns active period
3. Change active period
4. Verify hook updates reactively

**Expected Results:**
- ✓ Hook returns current active period
- ✓ Updates trigger re-render
- ✓ All consumers receive updated context

**Component Test (React Testing Library):**
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { AcademicContextProvider, useAcademicContext } from '@/features/gestion';

function TestComponent() {
  const { activePeriod, loading } = useAcademicContext();

  if (loading) return <div>Loading...</div>;
  if (!activePeriod) return <div>No active period</div>;

  return (
    <div>
      <div data-testid="period-name">{activePeriod.name}</div>
      <div data-testid="period-dates">
        {activePeriod.startDate.toISOString()} - {activePeriod.endDate.toISOString()}
      </div>
    </div>
  );
}

test('useAcademicContext provides active period', async () => {
  render(
    <AcademicContextProvider teacherId="test-teacher" useMockData={true}>
      <TestComponent />
    </AcademicContextProvider>
  );

  await waitFor(() => {
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  expect(screen.getByTestId('period-name')).toHaveTextContent(/Trimestre/);
  expect(screen.getByTestId('period-dates')).toBeInTheDocument();
});
```

### Scenario 4: Filter persistence across navigation

**Steps:**
1. Activate a specific period (e.g., Trimestre 2)
2. Navigate to Calendar view
3. Verify sessions filtered by active period dates
4. Navigate to Evaluations view
5. Verify exams filtered by active period dates
6. Return to Settings and verify same period still active

**Expected Results:**
- ✓ Period selection persists across navigation
- ✓ All views consistently filter by same period
- ✓ No unexpected period switches

**Playwright Implementation:**
```typescript
test('active period persists across navigation', async ({ page }) => {
  // Activate Trimestre 2
  await page.goto('/dashboard/reglages');
  await page.getByRole('button', { name: 'Années scolaires' }).click();
  await page.getByRole('button', { name: 'Gérer les périodes' }).click();
  await page.getByRole('button', { name: 'Activer' }).nth(1).click(); // Trimestre 2
  await page.getByRole('button', { name: 'Fermer' }).click();

  // Navigate to Calendar
  await page.goto('/dashboard/calendrier');
  await expect(page.locator('text=Trimestre 2')).toBeVisible();

  // Navigate to Evaluations
  await page.goto('/dashboard/evaluations');
  await expect(page.locator('text=Trimestre 2')).toBeVisible();

  // Return to Settings
  await page.goto('/dashboard/reglages');
  await page.getByRole('button', { name: 'Années scolaires' }).click();
  await page.getByRole('button', { name: 'Gérer les périodes' }).click();

  // Verify Trimestre 2 still active
  const trimestre2 = page.locator('[data-testid="period-item"]', {
    has: page.locator('text=Trimestre 2')
  });
  await expect(trimestre2.locator('text=Actif')).toBeVisible();
});
```

## Manual QA Checklist

### Settings Page - School Years Management
- [ ] Navigate to Paramètres > Années scolaires
- [ ] Create a new school year with valid dates
- [ ] Verify year appears in list immediately
- [ ] Click "Gérer les périodes"
- [ ] Create 3 periods for the year
- [ ] Activate the first period
- [ ] Verify other periods deactivated
- [ ] Verify statistics update correctly

### Period Propagation
- [ ] Navigate to Mes Élèves with active period
- [ ] Verify student analytics show period name and dates
- [ ] Change active period in Settings
- [ ] Return to Mes Élèves
- [ ] Verify analytics updated to new period

### API Integration
- [ ] Verify GET /school-years returns data
- [ ] Verify POST /school-years creates new year
- [ ] Verify PATCH /school-years/{id} updates year
- [ ] Verify GET /academic-periods?school_year_id={id} filters correctly
- [ ] Verify PATCH /academic-periods/{id} updates active status
- [ ] Check browser DevTools Network tab for proper cookie handling

### Error Handling
- [ ] Try creating overlapping periods - verify error message
- [ ] Try creating period outside school year bounds - verify error
- [ ] Activate period without school year - verify graceful handling
- [ ] Disconnect backend - verify error messages clear and user-friendly

## Success Criteria

All tests pass when:
1. ✅ Active period visible in Settings UI
2. ✅ Period switch triggers UI updates across features
3. ✅ `useAcademicContext` hook provides reactive access
4. ✅ Period selection persists during session
5. ✅ All CRUD operations work with Souz API
6. ✅ No console errors or warnings
7. ✅ Proper loading states during async operations

## Implementation Notes

### Test Data Attributes
Add these data-testid attributes to components:
- `[data-testid="school-year-item"]` - School year list item
- `[data-testid="period-item"]` - Period list item
- `[data-testid="student-analytics"]` - Student analytics card
- `[data-testid="period-selector"]` - Period dropdown/selector

### Mock Backend Setup
For CI/CD, consider mocking Souz API:
```typescript
// playwright.config.ts
use: {
  baseURL: 'http://localhost:3000',
  // Mock API responses
  extraHTTPHeaders: {
    'X-Test-Mode': 'true'
  }
}
```

## Related Documentation
- Story 1.2: [docs/stories/story-1.2.md](../stories/story-1.2.md)
- Academic Context Usage: [src/features/gestion/docs/academic-context-usage.md](../../src/features/gestion/docs/academic-context-usage.md)
- API Spec: [docs/souz-api-openapi.json](../souz-api-openapi.json)
