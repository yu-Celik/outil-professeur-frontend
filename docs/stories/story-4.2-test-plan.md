# Story 4.2: Guides de style configurables - Test Plan

**Status:** ✅ Implementation Complete
**Date:** 2025-10-17

## Implementation Summary

### Components Created/Modified

1. **API Client** - `src/features/appreciations/api/style-guides-client.ts`
   - Full CRUD operations (list, getById, create, update, delete)
   - Default guide management (setAsDefault, getDefault)
   - Filter methods (getByTone, getByRegister, getByLength)
   - Data mappers (API ↔ Frontend)
   - Validation helpers
   - French label mappings

2. **Hook Refactored** - `src/features/appreciations/hooks/use-style-guides.ts`
   - Migrated from mocks to API client
   - Async operations with toast notifications
   - Duplicate functionality
   - Default guide state management
   - Filter preservation
   - Error handling

3. **Component Updated** - `src/components/organisms/style-guide-management.tsx`
   - Default guide badge display
   - "Définir par défaut" button
   - Duplicate guide via hook
   - Full integration with API-backed hook

## Test Checklist

### AC1: Liste des guides avec paramètres
- [ ] Navigate to `/dashboard/appreciations`
- [ ] Verify style guides list displays
- [ ] Check that each guide shows:
  - [ ] Name
  - [ ] Tone badge
  - [ ] Register badge
  - [ ] Length badge
  - [ ] "Par défaut" badge (if default)
  - [ ] Variability
  - [ ] Preferred phrases count
  - [ ] Last modified date
- [ ] Verify loading state displays spinner
- [ ] Verify error state displays error message

### AC2: Nouveau guide - Formulaire complet
- [ ] Click "Nouveau guide" button
- [ ] Dialog opens with form
- [ ] Verify all fields present:
  - [ ] Nom du guide (text input)
  - [ ] Ton (select: formal, semi-formal, informal)
  - [ ] Registre (select: simple, standard, sophisticated)
  - [ ] Longueur (select: court, standard, long)
  - [ ] Personne (select: deuxieme, troisieme)
  - [ ] Variabilité (select: faible, moyenne, elevee)
  - [ ] Phrases bannies (optional - not in current form)
  - [ ] Phrases préférées (optional - not in current form)
- [ ] Fill out form with valid data
- [ ] Click "Créer" button
- [ ] Verify API call: `POST /style-guides`
- [ ] Verify success toast appears
- [ ] Verify new guide appears in list
- [ ] Dialog closes

**Validation Tests:**
- [ ] Try to submit empty name → error message
- [ ] Try to submit with invalid tone → validation error
- [ ] Verify all fields are properly normalized

### AC3: Actions Modifier, Dupliquer, Supprimer
**Modifier:**
- [ ] Click Edit icon on a guide card
- [ ] Edit dialog opens with pre-filled form
- [ ] Modify some fields (e.g., name, tone)
- [ ] Click "Modifier"
- [ ] Verify API call: `PATCH /style-guides/{id}`
- [ ] Verify success toast appears
- [ ] Verify guide updates in list
- [ ] Dialog closes

**Dupliquer:**
- [ ] Click Duplicate icon on a guide card
- [ ] Verify API call: `POST /style-guides` with "Copie de" prefix
- [ ] Verify success toast appears
- [ ] Verify new guide appears with "Copie de [name]"
- [ ] Original guide unchanged

**Supprimer:**
- [ ] Click Delete icon on a guide card
- [ ] Confirmation dialog appears
- [ ] Click "Annuler" → dialog closes, no deletion
- [ ] Click Delete icon again
- [ ] Click "Supprimer"
- [ ] Verify API call: `DELETE /style-guides/{id}`
- [ ] Verify success toast appears
- [ ] Verify guide removed from list

### AC4: Guide par défaut
- [ ] Verify one guide has "Par défaut" badge
- [ ] Click "Définir par défaut" on another guide
- [ ] Verify API call: `PATCH /style-guides/{id}` with `is_default: true`
- [ ] Verify success toast appears
- [ ] Verify "Par défaut" badge moves to new guide
- [ ] Old default guide no longer has badge
- [ ] "Définir par défaut" button hidden on current default
- [ ] Verify default persists after page refresh

### AC5: Disponibilité dans interfaces de génération
**AppreciationGenerationInterface:**
- [ ] Navigate to appreciation generation interface
- [ ] Verify style guide selector present
- [ ] Verify all style guides appear in dropdown
- [ ] Verify default guide pre-selected
- [ ] Select different guide
- [ ] Verify selection persists

**ChatAppreciationInterface:**
- [ ] Navigate to chat interface
- [ ] Verify style guide selector present
- [ ] Same verifications as above

### AC6: État de chargement/erreur et filtres
**Loading State:**
- [ ] Verify spinner shows on initial load
- [ ] Verify spinner shows during CRUD operations
- [ ] Verify buttons disabled during operations

**Error Handling:**
- [ ] Simulate API error (disconnect network)
- [ ] Verify error toast appears
- [ ] Verify error message is user-friendly
- [ ] Verify error state recoverable (refresh works)

**Filtres:**
- [ ] Use search bar to filter by name
- [ ] Verify filtered results update in real-time
- [ ] Use tone filter dropdown
- [ ] Verify guides filter by selected tone
- [ ] Combine search + tone filter
- [ ] Verify filters work together
- [ ] Clear filters (select "Tous les tons")
- [ ] Verify all guides return

## API Integration Tests

### Endpoints Used
- `GET /style-guides` - List all guides
- `GET /style-guides/{id}` - Get single guide
- `POST /style-guides` - Create guide
- `PATCH /style-guides/{id}` - Update guide
- `DELETE /style-guides/{id}` - Delete guide
- `PATCH /style-guides/{id}` with `is_default: true` - Set default

### Request/Response Validation
- [ ] Verify snake_case API → camelCase frontend mapping
- [ ] Verify camelCase frontend → snake_case API mapping
- [ ] Verify date strings converted to Date objects
- [ ] Verify arrays (banned_phrases, preferred_phrases) handled
- [ ] Verify null handling for optional fields

## Edge Cases

1. **No guides exist:**
   - [ ] Verify empty state message
   - [ ] Verify "Créer un guide de style" button shown

2. **Search returns no results:**
   - [ ] Verify "Aucun guide ne correspond" message

3. **Delete last guide:**
   - [ ] Verify deletion succeeds
   - [ ] Verify defaultGuide becomes null
   - [ ] Verify empty state shows

4. **Network error during operation:**
   - [ ] Verify error toast
   - [ ] Verify state doesn't corrupt
   - [ ] Verify retry works

5. **Concurrent modifications:**
   - [ ] Create guide in one tab
   - [ ] Verify it doesn't appear in other tab (no real-time sync)
   - [ ] Refresh → verify it appears

## Performance Tests

- [ ] Create 20+ guides → verify list renders smoothly
- [ ] Filter with 50+ guides → verify filtering is instant
- [ ] Duplicate guide → verify completes in < 2s
- [ ] Set default → verify updates in < 1s

## Accessibility Tests

- [ ] All form fields have labels
- [ ] Buttons have titles/aria-labels for icons
- [ ] Keyboard navigation works
- [ ] Dialog can be closed with Escape
- [ ] Focus traps work in dialogs

## Browser Compatibility

- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari

## Notes for Testers

### Test Data Setup
Since this uses live API, ensure backend is running and accessible.

**Recommended test guides:**
1. Formel - Standard (default)
2. Informel - Court (for parents)
3. Semi-formel - Long (for bulletins)

### Known Limitations
- Phrases bannies/préférées not in form UI yet (Story 4.1 integration pending)
- No real-time sync between tabs
- No undo functionality

### Future Enhancements
- Bulk operations (duplicate multiple, set multiple defaults per document type)
- Import/export guide templates
- Guide versioning
- Usage analytics (which guides most used)

## Completion Criteria

Story 4.2 is considered complete when:
- ✅ All 6 acceptance criteria pass
- ✅ No critical bugs in CRUD operations
- ✅ No lint errors introduced
- ✅ Default guide management works correctly
- ✅ Integration with generation interfaces verified
- ✅ Error handling robust
- ✅ User feedback (toasts) clear and helpful

---

**Test Plan Version:** 1.0
**Last Updated:** 2025-10-17
**Tested By:** [To be filled]
**Test Results:** [To be filled]
