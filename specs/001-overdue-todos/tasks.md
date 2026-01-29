# Tasks: Support for Overdue Todo Items

**Feature Branch**: `001-overdue-todos`  
**Input**: Design documents from `/specs/001-overdue-todos/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api-contracts.md

**Tests**: OPTIONAL - tests are NOT explicitly requested in the feature specification, so test tasks are EXCLUDED from this task list.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This is a monorepo web application:
- **Frontend**: `packages/frontend/src/`
- **Backend**: `packages/backend/src/` (NO CHANGES for this feature)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create necessary directory structure for new utility files

- [ ] T001 Create utils directory at packages/frontend/src/utils/
- [ ] T002 Create __tests__ directory at packages/frontend/src/utils/__tests__/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core date utility functions that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 [P] Implement isOverdue() function in packages/frontend/src/utils/dateUtils.js
- [ ] T004 [P] Implement getOverdueDuration() function in packages/frontend/src/utils/dateUtils.js
- [ ] T005 Add JSDoc comments and export statements in packages/frontend/src/utils/dateUtils.js

**Checkpoint**: Date utilities ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Visual Identification of Overdue Todos (Priority: P1) 🎯 MVP

**Goal**: Users can immediately see which incomplete todos are overdue through distinct visual indicators (danger color, border, icon, and "OVERDUE" label)

**Independent Test**: 
1. Create a todo with due date = yesterday
2. Keep it incomplete
3. View todo list
4. Verify the todo displays with: red/danger color, left border accent, ⚠️ icon, and "OVERDUE" text label
5. Mark todo as complete → overdue indicator disappears
6. Mark back to incomplete → overdue indicator reappears

### Implementation for User Story 1

- [ ] T006 [US1] Import isOverdue utility into packages/frontend/src/components/TodoCard.js
- [ ] T007 [US1] Add overdue status calculation in TodoCard component using isOverdue() function
- [ ] T008 [US1] Add conditional CSS class 'overdue' to todo card container based on overdue status
- [ ] T009 [US1] Create overdue visual indicator JSX element with ⚠️ emoji and "OVERDUE" text in packages/frontend/src/components/TodoCard.js
- [ ] T010 [US1] Position overdue indicator below due date display in TodoCard component
- [ ] T011 [US1] Add CSS styles for .todo-card.overdue class in packages/frontend/src/components/TodoCard.css (or appropriate styles file)
- [ ] T012 [US1] Add CSS styles for .overdue-indicator class with danger color and proper sizing
- [ ] T013 [US1] Verify overdue styling works in both light and dark modes using existing CSS custom properties

**Checkpoint**: At this point, User Story 1 should be fully functional - overdue todos are visually distinguished from non-overdue todos

---

## Phase 4: User Story 2 - Clear Date Context for Overdue Items (Priority: P2)

**Goal**: Users see how long a todo has been overdue (e.g., "2d overdue", "1w overdue") to understand urgency level

**Independent Test**:
1. Create todos with various past due dates (2 days ago, 10 days ago, 45 days ago)
2. Keep them incomplete
3. View todo list
4. Verify each displays correct abbreviated duration format:
   - 2 days ago → "2d overdue"
   - 10 days ago → "1w overdue" 
   - 45 days ago → "1mo overdue"

### Implementation for User Story 2

- [ ] T014 [US2] Import getOverdueDuration utility into packages/frontend/src/components/TodoCard.js
- [ ] T015 [US2] Calculate overdue duration using getOverdueDuration() when todo is overdue
- [ ] T016 [US2] Create overdue duration JSX element in TodoCard component
- [ ] T017 [US2] Position overdue duration text below the overdue indicator in TodoCard
- [ ] T018 [US2] Add CSS styles for .overdue-duration class with appropriate text styling and color
- [ ] T019 [US2] Verify duration formatting is correct for all time ranges (days, weeks, months)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - overdue todos show visual indicator plus duration text

---

## Phase 5: User Story 3 - Consistent Overdue Status Across Sessions (Priority: P3)

**Goal**: Overdue status updates dynamically based on current date without requiring backend changes or manual user action

**Independent Test**:
1. Create todo with due date = tomorrow
2. Verify it does NOT show as overdue today
3. Wait until tomorrow (or modify system date for testing)
4. Refresh page
5. Verify todo now shows as overdue
6. Mark as complete → verify overdue indicator disappears
7. Mark as incomplete → verify overdue indicator reappears

### Implementation for User Story 3

- [ ] T020 [US3] Review date comparison logic in dateUtils.js to ensure it uses current date dynamically (not cached)
- [ ] T021 [US3] Verify isOverdue() function correctly handles edge case: due date = today (should NOT be overdue)
- [ ] T022 [US3] Verify isOverdue() function correctly handles edge case: due date = yesterday (should be overdue)
- [ ] T023 [US3] Verify isOverdue() function correctly handles edge case: no due date (should NOT be overdue)
- [ ] T024 [US3] Verify isOverdue() function correctly handles edge case: completed todo with past due date (should NOT be overdue)
- [ ] T025 [US3] Test TodoCard component re-renders correctly when todo completion status changes
- [ ] T026 [US3] Verify overdue status updates on component re-render without requiring page refresh

**Checkpoint**: All user stories should now be independently functional - overdue status is reliable and consistent

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements, documentation, and validation

- [ ] T027 [P] Add accessibility attributes (aria-label) to overdue indicator if needed in packages/frontend/src/components/TodoCard.js
- [ ] T028 [P] Verify WCAG AA color contrast for danger colors in light and dark modes
- [ ] T029 [P] Review TodoList component at packages/frontend/src/components/TodoList.js to ensure no changes needed
- [ ] T030 [P] Review theme.css at packages/frontend/src/styles/theme.css to confirm danger color variables are properly defined
- [ ] T031 Code cleanup: Remove any console.log statements or debug code
- [ ] T032 Run quickstart.md validation scenarios to ensure all requirements are met
- [ ] T033 Update documentation if needed (README, comments)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Depends on User Story 1 completion (adds duration to existing visual indicator)
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Validates behavior, doesn't add new features

### Within Each User Story

- User Story 1: Import utils → Calculate status → Add visual elements → Style
- User Story 2: Import duration function → Calculate → Display → Style (builds on US1)
- User Story 3: Review and verify existing logic handles all edge cases

### Parallel Opportunities

- **Phase 1**: T001 and T002 can run in parallel (different directories)
- **Phase 2**: T003 and T004 can run in parallel (different functions in same file, can be developed separately then combined)
- **Phase 6**: T027, T028, T029, T030 can all run in parallel (different files and concerns)

---

## Parallel Example: Setup Phase

```bash
# Launch both setup tasks together:
Task T001: "Create utils directory at packages/frontend/src/utils/"
Task T002: "Create __tests__ directory at packages/frontend/src/utils/__tests__/"
```

## Parallel Example: Foundational Phase

```bash
# Both functions can be developed in parallel then merged:
Task T003: "Implement isOverdue() function in packages/frontend/src/utils/dateUtils.js"
Task T004: "Implement getOverdueDuration() function in packages/frontend/src/utils/dateUtils.js"
```

## Parallel Example: Polish Phase

```bash
# Launch all review/validation tasks together:
Task T027: "Add accessibility attributes (aria-label) to overdue indicator if needed"
Task T028: "Verify WCAG AA color contrast for danger colors in light and dark modes"
Task T029: "Review TodoList component to ensure no changes needed"
Task T030: "Review theme.css to confirm danger color variables are properly defined"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (2 tasks, ~5 minutes)
2. Complete Phase 2: Foundational (3 tasks, ~30-45 minutes)
3. Complete Phase 3: User Story 1 (8 tasks, ~2-3 hours)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready - core value delivered!

**MVP Delivers**: Visual identification of overdue todos (core feature value)

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready (~45 minutes)
2. Add User Story 1 → Test independently → Deploy/Demo (MVP! ~3 hours total)
3. Add User Story 2 → Test independently → Deploy/Demo (~1 hour, adds duration context)
4. Add User Story 3 → Test independently → Deploy/Demo (~1 hour, validates edge cases)
5. Polish → Final validation (~1 hour)

**Total Estimated Effort**: 5-6 hours for complete feature

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (~45 minutes)
2. Once Foundational is done:
   - Developer A: User Story 1 (visual indicators)
   - Developer B: Can prepare User Story 2 tasks (duration display)
   - Developer C: Can prepare User Story 3 tests (validation)
3. User Story 2 starts after User Story 1 completes
4. User Story 3 can proceed independently to validate
5. Team collaborates on Polish phase

**Note**: User Story 2 depends on User Story 1, so parallel work is limited. Best approach is sequential for this feature.

---

## Notes

- [P] tasks = different files/functions, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group of related tasks
- Stop at any checkpoint to validate story independently
- **NO BACKEND CHANGES** required - this is frontend-only work
- **NO TEST FILES** created unless explicitly requested later
- All date calculations use JavaScript native Date API (no external dependencies)
- Visual styling uses existing design system danger colors for light/dark mode support
