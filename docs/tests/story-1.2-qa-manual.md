# Story 1.2 - Manual QA Testing Guide

## Prerequisites

### Backend Setup
1. Start Souz API backend:
```bash
cd ~/Codebases/souz-backend
cargo run --bin souz-api
```

2. Verify backend is running:
```bash
curl http://localhost:8080/health
# Expected: {"status":"ok"}
```

### Frontend Setup
1. Start Next.js development server:
```bash
cd ~/Codebases/outil-professor
npm run dev
```

2. Navigate to: `http://localhost:3000/dashboard/reglages`

3. Login with test teacher account

## Test Suite

### Test 1: Create School Year (AC 1-3)

**Steps:**
1. Navigate to **Paramètres > Années scolaires** tab
2. Click **"Nouvelle année scolaire"** button
3. Fill form:
   - Nom: "Année scolaire 2025-2026"
   - Date de début: 2025-09-01
   - Date de fin: 2026-06-30
4. Click **"Créer"**

**Expected Results:**
- ✓ Form validates dates (start < end)
- ✓ New year appears immediately in list
- ✓ **No page reload** required
- ✓ Statistics update (+1 year)
- ✓ "Actif" badge NOT shown (year not active by default)

**Validation:**
```bash
# Check API call in DevTools Network tab
curl http://localhost:8080/school-years \
  -H "Cookie: auth_token=..." \
  -H "Content-Type: application/json"

# Response should include the new year
```

**Pass/Fail:** ☐ Pass ☐ Fail
**Notes:** _________________________________

---

### Test 2: Activate School Year

**Steps:**
1. In school years list, find "Année scolaire 2025-2026"
2. Click **"Activer"** button

**Expected Results:**
- ✓ Year gets "Actif" badge and primary border
- ✓ Previously active year (if any) becomes inactive
- ✓ Statistics show "1" active year
- ✓ Button changes to just show status (no "Activer" button)

**Validation:**
```bash
# Verify API response
curl http://localhost:8080/school-years?is_active=true \
  -H "Cookie: auth_token=..."

# Should return only ONE active year
```

**Pass/Fail:** ☐ Pass ☐ Fail
**Notes:** _________________________________

---

### Test 3: Create Academic Periods (AC 4-5)

**Steps:**
1. Click **"Gérer les périodes"** for the active year
2. Dialog opens showing empty periods list
3. Click **"Nouvelle période"**
4. Fill form for **Trimestre 1**:
   - Nom: "Trimestre 1"
   - Ordre: 1
   - Date de début: 2025-09-01
   - Date de fin: 2025-12-20
   - ☐ Période active: NO
5. Click **"Créer"**
6. Repeat for **Trimestre 2** (2026-01-05 to 2026-03-31)
7. Repeat for **Trimestre 3** (2026-04-15 to 2026-06-30)

**Expected Results:**
- ✓ Each period appears immediately in dialog
- ✓ Periods sorted by order number
- ✓ Statistics show "3 Périodes, 0 Active"
- ✓ No overlap errors since dates don't overlap

**Validation:**
```bash
# Check periods created
curl "http://localhost:8080/academic-periods?school_year_id=<YEAR_ID>" \
  -H "Cookie: auth_token=..."

# Should return 3 periods
```

**Pass/Fail:** ☐ Pass ☐ Fail
**Notes:** _________________________________

---

### Test 4: Date Overlap Validation (AC 6)

**Steps:**
1. In periods dialog, click **"Nouvelle période"**
2. Try to create overlapping period:
   - Nom: "Période Test"
   - Ordre: 4
   - Date de début: 2025-10-01 (OVERLAPS with Trimestre 1)
   - Date de fin: 2025-11-01
3. Click **"Créer"**

**Expected Results:**
- ✓ Error message appears: "Chevauchement détecté avec Trimestre 1"
- ✓ Period is NOT created
- ✓ Form remains open with error highlighted
- ✓ User can correct dates

**Pass/Fail:** ☐ Pass ☐ Fail
**Notes:** _________________________________

---

### Test 5: Activate Period - Exclusivity (AC 7)

**Steps:**
1. In periods dialog for active year
2. Find **Trimestre 1**
3. Click **"Activer"** button
4. Observe UI updates

**Expected Results:**
- ✓ Trimestre 1 shows "Actif" badge
- ✓ ALL other periods (2, 3) have NO "Actif" badge
- ✓ Statistics show "1 Active"
- ✓ Trimestre 1 has primary border/background

**Validation:**
```bash
# Check only one active period
curl "http://localhost:8080/academic-periods?school_year_id=<YEAR_ID>&is_active=true" \
  -H "Cookie: auth_token=..."

# Should return ONLY Trimestre 1
```

**Pass/Fail:** ☐ Pass ☐ Fail
**Notes:** _________________________________

---

### Test 6: Switch Active Period

**Steps:**
1. With Trimestre 1 active
2. Click **"Activer"** on **Trimestre 2**
3. Observe changes

**Expected Results:**
- ✓ Trimestre 2 becomes active (badge appears)
- ✓ Trimestre 1 loses active status (badge disappears)
- ✓ Statistics still show "1 Active" (not 2)
- ✓ No error messages

**Validation:**
```bash
# Verify switch via API
curl "http://localhost:8080/academic-periods?school_year_id=<YEAR_ID>&is_active=true" \
  -H "Cookie: auth_token=..."

# Should return ONLY Trimestre 2
```

**Pass/Fail:** ☐ Pass ☐ Fail
**Notes:** _________________________________

---

### Test 7: Period Bounds Validation

**Steps:**
1. Try to create period OUTSIDE school year bounds:
   - Nom: "Période Été"
   - Date de début: 2026-07-01 (AFTER school year ends)
   - Date de fin: 2026-08-31
2. Click **"Créer"**

**Expected Results:**
- ✓ Error: "La période doit se terminer avant la fin de l'année scolaire"
- ✓ Period NOT created
- ✓ Form stays open for correction

**Pass/Fail:** ☐ Pass ☐ Fail
**Notes:** _________________________________

---

### Test 8: Active Period Propagation (AC 8)

#### 8A: useAcademicContext Hook

**Steps:**
1. Open DevTools Console
2. Navigate to any dashboard page
3. In console, verify context is available

**Expected Results:**
- ✓ No errors about "useAcademicContext must be used within provider"
- ✓ Components can access active period data

**Pass/Fail:** ☐ Pass ☐ Fail

---

#### 8B: Period Displayed in Student View (Example Integration)

**Prerequisites:** Add AcademicContextProvider to dashboard layout

**Steps:**
1. Ensure Trimestre 2 is active (2026-01-05 to 2026-03-31)
2. Navigate to **Mes Élèves**
3. Select any student
4. Check student analytics section

**Expected Results:**
- ✓ Period name visible: "Trimestre 2"
- ✓ Period dates visible: "05 jan. 2026 - 31 mars 2026"
- ✓ Analytics filtered by these dates (if implementation exists)

**Note:** This test validates the HOOK WORKS. Full integration with student analytics is Story 1.2 Task 4 completion requirement.

**Pass/Fail:** ☐ Pass ☐ Fail
**Notes:** _________________________________

---

### Test 9: Update School Year

**Steps:**
1. Find any school year
2. Click **Edit** (pencil icon)
3. Change name to "Année scolaire 2025-2026 (Modifié)"
4. Click **"Mettre à jour"**

**Expected Results:**
- ✓ Name updates immediately in list
- ✓ No page reload
- ✓ updatedAt timestamp changes (visible in DevTools)

**Validation:**
```bash
# Check ETag handling
curl http://localhost:8080/school-years/<YEAR_ID> \
  -H "Cookie: auth_token=..."

# Response includes "updated_at" field with new timestamp
```

**Pass/Fail:** ☐ Pass ☐ Fail
**Notes:** _________________________________

---

### Test 10: Delete School Year

**Steps:**
1. Create a test year: "Test Delete Year" (2027-09-01 to 2028-06-30)
2. Do NOT activate it
3. Click **Delete** (trash icon)
4. Confirm deletion

**Expected Results:**
- ✓ Confirmation dialog appears
- ✓ After confirmation, year disappears from list
- ✓ Statistics update (-1 year)
- ✓ If year had periods, those are also deleted (cascade)

**Validation:**
```bash
# Verify deletion
curl http://localhost:8080/school-years \
  -H "Cookie: auth_token=..."

# "Test Delete Year" should NOT be in list
```

**Pass/Fail:** ☐ Pass ☐ Fail
**Notes:** _________________________________

---

### Test 11: Delete Academic Period

**Steps:**
1. Open periods for active year
2. Create a test period: "Période Test" (any valid dates)
3. Click **Delete** (trash icon)
4. Confirm deletion

**Expected Results:**
- ✓ Confirmation dialog
- ✓ Period removed from list immediately
- ✓ Statistics update

**Pass/Fail:** ☐ Pass ☐ Fail
**Notes:** _________________________________

---

### Test 12: Loading States

**Steps:**
1. Open DevTools Network tab
2. Throttle network to "Slow 3G"
3. Navigate to Années scolaires tab
4. Observe loading behavior

**Expected Results:**
- ✓ Loading indicator shown while fetching data
- ✓ No flash of empty state
- ✓ Smooth transition to data display
- ✓ No layout shift

**Pass/Fail:** ☐ Pass ☐ Fail
**Notes:** _________________________________

---

### Test 13: Error Handling - Backend Down

**Steps:**
1. Stop Souz backend (Ctrl+C)
2. Try to create a new school year
3. Observe error handling

**Expected Results:**
- ✓ Clear error message: "Le service est temporairement indisponible..."
- ✓ Form data preserved (not cleared)
- ✓ User can retry after backend restarts
- ✓ No console errors breaking the app

**Pass/Fail:** ☐ Pass ☐ Fail
**Notes:** _________________________________

---

### Test 14: Cookie Authentication

**Steps:**
1. Open DevTools > Application > Cookies
2. Verify `auth_token` cookie exists
3. Create a school year
4. Check Network tab for API request

**Expected Results:**
- ✓ Cookie automatically sent with requests
- ✓ No need for manual Authorization headers
- ✓ HttpOnly flag set on cookie
- ✓ Secure flag set (if HTTPS)

**Pass/Fail:** ☐ Pass ☐ Fail
**Notes:** _________________________________

---

## Final Checklist

### Functional Requirements
- [ ] All CRUD operations work for school years
- [ ] All CRUD operations work for academic periods
- [ ] Period overlap validation prevents conflicts
- [ ] Only one period can be active at a time
- [ ] Active period visible in settings UI
- [ ] Changes persist after page reload

### Non-Functional Requirements
- [ ] No console errors or warnings
- [ ] API responses under 500ms (local)
- [ ] UI responsive and smooth
- [ ] Forms have clear validation messages
- [ ] Loading states present for async operations

### Integration
- [ ] useAcademicContext hook accessible
- [ ] Active period data structure correct
- [ ] Period dates properly formatted (camelCase in UI, snake_case in API)

## Bug Report Template

If you find issues, document them here:

**Bug #**: ___
**Title**: _____________________
**Severity**: ☐ Critical ☐ Major ☐ Minor
**Steps to Reproduce**:
1.
2.
3.

**Expected**: ___________________
**Actual**: ____________________
**Screenshots**: ________________
**Console Errors**: _____________

---

## Sign-off

**Tester Name**: ___________________
**Date**: __________________________
**Overall Result**: ☐ PASS ☐ FAIL
**Ready for Production**: ☐ YES ☐ NO

**Notes**: ________________________________________________________
__________________________________________________________________
