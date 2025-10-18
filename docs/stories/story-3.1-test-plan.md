# Story 3.1 - Test Plan

## Testing Strategy

This document outlines the comprehensive testing strategy for Story 3.1: Gestion des examens et publication.

## Unit Tests

### `useExamManagement` Hook Tests

**File**: `src/features/evaluations/hooks/use-exam-management.test.ts`

#### Test Cases:

1. **Initial Loading**
   - Should load exams from API on mount
   - Should filter exams by classId when provided
   - Should filter exams by subjectId when provided
   - Should sort exams by date descending
   - Should set loading state correctly
   - Should handle API errors gracefully

2. **createExam**
   - Should create exam via API POST /exams
   - Should map form data to API snake_case format
   - Should add new exam to state sorted by date
   - Should show success toast on completion
   - Should set is_published to false for new exams
   - Should handle validation errors (422)
   - Should handle network errors

3. **updateExam**
   - Should update exam via API PATCH /exams/{id}
   - Should update exam in state maintaining sort order
   - Should show success toast on completion
   - Should handle 404 errors when exam not found
   - Should handle validation errors

4. **deleteExam**
   - Should delete exam via API DELETE /exams/{id}
   - Should remove exam from state
   - Should show success toast on completion
   - Should handle 404 errors gracefully

5. **duplicateExam**
   - Should create duplicate exam via API POST /exams
   - Should append " - Copie YYYY-MM-DD" to title
   - Should copy all exam properties except id and dates
   - Should set is_published to false for duplicates
   - Should add duplicate to state sorted by date
   - Should show success toast on completion

6. **toggleExamPublication**
   - Should toggle is_published via API PATCH /exams/{id}
   - Should update exam in state with new publication status
   - Should show appropriate toast ("publié" or "dépublié")
   - Should handle errors gracefully

### API Client Tests

**File**: `src/lib/api.test.ts`

#### Test Cases:

1. **api.exams.list**
   - Should call GET /exams with correct params
   - Should include class_id query param when provided
   - Should include subject_id query param when provided
   - Should include is_published filter when provided
   - Should handle pagination with cursor
   - Should handle empty results

2. **api.exams.create**
   - Should call POST /exams with correct body
   - Should send snake_case field names
   - Should return created exam

3. **api.exams.update**
   - Should call PATCH /exams/{id} with correct body
   - Should handle partial updates

4. **api.exams.delete**
   - Should call DELETE /exams/{id}
   - Should handle 204 response

### Mapper Function Tests

**File**: `src/features/evaluations/hooks/use-exam-management.test.ts`

#### Test Cases:

1. **mapApiToExam**
   - Should convert snake_case API response to camelCase Exam entity
   - Should map school_year_id to academicPeriodId
   - Should map max_points to totalPoints
   - Should parse ISO date strings to Date objects
   - Should attach UML entity methods (publish, unpublish, etc.)
   - Should handle null/undefined optional fields

2. **mapFormDataToApi**
   - Should convert camelCase form data to snake_case API format
   - Should only include defined fields in output
   - Should convert Date to ISO date string (YYYY-MM-DD)
   - Should handle partial updates correctly

## Integration Tests

### Evaluations Page Flow Tests

**File**: `src/app/dashboard/evaluations/page.test.tsx`

#### Test Cases:

1. **Initial Render**
   - Should show loading state while fetching
   - Should display empty state when no class selected
   - Should load exams for selected class
   - Should display exam cards when exams exist

2. **Create Exam Flow**
   - Should open dialog when clicking "Nouvel examen"
   - Should call createExam with form data on submit
   - Should refresh exam list on success
   - Should close dialog on success

3. **Edit Exam Flow**
   - Should open dialog with exam data when editing
   - Should call updateExam with changes on submit
   - Should update exam in list on success

4. **Delete Exam Flow**
   - Should show confirmation dialog
   - Should call deleteExam on confirmation
   - Should remove exam from list on success

5. **Duplicate Exam Flow**
   - Should call duplicateExam when clicking duplicate
   - Should add new exam to list with modified title
   - Should keep duplicate unpublished

6. **Toggle Publication Flow**
   - Should call toggleExamPublication when clicking publish/unpublish
   - Should update badge from "Brouillon" to "Publié" and vice versa

### ExamsList Component Tests

**File**: `src/components/organisms/exams-list.test.tsx`

#### Test Cases:

1. **Filtering**
   - Should filter exams by selectedClassId when provided
   - Should show all exams when selectedClassId is null

2. **Actions**
   - Should call onEdit when edit button clicked
   - Should call onDelete when delete button clicked
   - Should call onDuplicate when duplicate button clicked
   - Should call onGrade when grade button clicked

3. **Display**
   - Should show correct publication badge based on is_published
   - Should display exam statistics when available
   - Should sort exams by date descending

## End-to-End Tests

### Complete User Journey

**File**: `e2e/evaluations.spec.ts` (if e2e framework available)

#### Test Scenarios:

1. **Teacher Creates and Publishes Exam**
   - Navigate to Evaluations page
   - Select a class
   - Click "Nouvel examen"
   - Fill form with valid data
   - Submit form
   - Verify exam appears in list with "Brouillon" badge
   - Click publish action
   - Verify badge changes to "Publié"

2. **Teacher Duplicates Exam**
   - Create an exam
   - Click duplicate action
   - Verify new exam appears with " - Copie" suffix
   - Verify duplicate is unpublished

3. **Teacher Updates Exam**
   - Create an exam
   - Click edit action
   - Modify title and points
   - Submit changes
   - Verify changes appear in list

4. **Error Handling**
   - Attempt to create exam with invalid data
   - Verify validation error displayed
   - Verify form data is preserved
   - Simulate network error
   - Verify error toast appears

## Acceptance Criteria Validation

### AC1: List Exams by Class
- ✅ ExamsList receives selectedClassId
- ✅ useExamManagement filters by class_id via API
- ✅ Exams display title, date, class, points, publication badge

### AC2: Create Exam
- ✅ Dialog opens with form
- ✅ Form collects all required fields
- ✅ POST /exams called with correct data
- ✅ Exam appears immediately in list
- ✅ New exam is unpublished by default

### AC3: Filtering via API
- ✅ class_id query param sent to API
- ✅ subject_id query param sent to API
- ✅ from/to date params supported
- ✅ is_published filter supported

### AC4: Sorting by Date Descending
- ✅ Exams sorted by examDate descending
- ✅ Sort maintained after mutations

### AC5: CRUD Operations via API
- ✅ PATCH /exams/{id} for updates
- ✅ POST /exams for create/duplicate
- ✅ DELETE /exams/{id} for delete
- ✅ UI updates without full reload

### AC6: Publication Badge
- ✅ "📝 Brouillon" when is_published = false
- ✅ "📊 Publié" when is_published = true

### AC7: Error Handling
- ✅ 422 validation errors shown via toast
- ✅ 404 errors handled gracefully
- ✅ Form state preserved on error
- ✅ Network errors display user-friendly message

## Manual Testing Checklist

### Smoke Tests
- [ ] Open Evaluations page - loads without errors
- [ ] Create new exam - saves successfully
- [ ] Edit exam - updates correctly
- [ ] Delete exam - removes from list
- [ ] Duplicate exam - creates copy with modified title
- [ ] Publish exam - toggles status badge
- [ ] Switch classes - loads correct exams

### Edge Cases
- [ ] Create exam with minimum required fields
- [ ] Create exam with all optional fields
- [ ] Edit published exam
- [ ] Duplicate published exam (should be unpublished)
- [ ] Delete exam with results (should prompt confirmation)
- [ ] Handle empty exam list
- [ ] Handle API timeout
- [ ] Handle concurrent edits

### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## Performance Tests

### Load Testing
- [ ] List with 100+ exams renders in < 2s
- [ ] Create exam completes in < 1s
- [ ] Update exam completes in < 1s
- [ ] Delete exam completes in < 1s

### Network Conditions
- [ ] Works on slow 3G connection
- [ ] Handles offline gracefully
- [ ] Retries failed requests appropriately

## Regression Tests

### Existing Functionality
- [ ] useNotationSystem hook still works
- [ ] ExamStatistics calculations unchanged
- [ ] ExamFormDialog validation works
- [ ] ExamCard display correct
- [ ] Grade entry flow unaffected

## Test Data Requirements

### Mock API Responses
```typescript
// GET /exams response
{
  items: [
    {
      id: "uuid-1",
      title: "Contrôle UML",
      class_id: "class-uuid",
      subject_id: "subject-uuid",
      school_year_id: "year-uuid",
      exam_date: "2025-10-20",
      max_points: 20,
      coefficient: 1.5,
      exam_type: "contrôle",
      is_published: false,
      created_at: "2025-10-17T10:00:00Z",
      updated_at: "2025-10-17T10:00:00Z"
    }
  ],
  next_cursor: null
}

// POST /exams request
{
  title: "Nouveau contrôle",
  class_id: "class-uuid",
  subject_id: "subject-uuid",
  school_year_id: "year-uuid",
  exam_date: "2025-11-15",
  max_points: 20,
  coefficient: 1,
  exam_type: "contrôle",
  is_published: false
}

// PATCH /exams/{id} request
{
  is_published: true
}

// Error response (422)
{
  error: "Validation failed",
  message: "Le titre est requis",
  code: "VALIDATION_ERROR"
}
```

## CI/CD Integration

### Pre-commit
- Run linting (npm run lint)
- Run type checking (npx tsc --noEmit)

### Pre-push
- Run all unit tests
- Run integration tests

### PR Checks
- Unit test coverage > 80%
- All tests passing
- No lint errors
- Type check passing

## Test Implementation Notes

1. **Mock API Client**: Use MSW (Mock Service Worker) or similar to intercept API calls
2. **Mock useToast**: Mock toast notifications to verify they're called with correct messages
3. **Mock useClassSelection**: Provide test context with mock selectedClassId
4. **Date Handling**: Use fixed dates in tests to ensure consistency
5. **Async Testing**: Use waitFor/act properly for async operations
6. **Test Isolation**: Reset mock state between tests

## Future Test Enhancements

- [ ] Add visual regression tests (Percy, Chromatic)
- [ ] Add accessibility tests (jest-axe)
- [ ] Add performance budgets
- [ ] Add load testing (k6, Artillery)
- [ ] Add security tests (SQL injection, XSS)
