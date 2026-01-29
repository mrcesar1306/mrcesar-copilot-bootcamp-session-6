# Implementation Plan: Support for Overdue Todo Items

**Branch**: `001-overdue-todos` | **Date**: January 29, 2026 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-overdue-todos/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Add visual identification and overdue duration display for incomplete todo items that have passed their due date. This is a frontend-focused feature that calculates overdue status dynamically using client-side date comparison, with no backend schema changes required. The feature will add multiple visual indicators (red color, ⚠️ icon, "OVERDUE" label) and display abbreviated overdue duration (e.g., "2d overdue") below the due date in todo cards.

## Technical Context

**Language/Version**: JavaScript (ES6+), Node.js v16+  
**Primary Dependencies**: React 18.2.0, React Testing Library 14.0.0, Jest 29.7.0, Express.js 4.18.2  
**Storage**: SQLite (better-sqlite3) - existing schema, no changes needed  
**Testing**: Jest with React Testing Library (frontend), Jest with Supertest (backend - minimal changes)  
**Target Platform**: Web application (Chrome, Firefox, Safari), Linux development environment  
**Project Type**: Web application (monorepo with frontend/backend packages)  
**Performance Goals**: <100ms for overdue calculation on client-side, instant visual feedback  
**Constraints**: Must maintain 80%+ test coverage, WCAG AA accessibility compliance, support light/dark modes  
**Scale/Scope**: Single-user app, ~5-10 components affected, primarily frontend work

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Initial Evaluation (Pre-Research)

#### I. Code Quality First (DRY, KISS, SOLID)
**Status**: ✅ PASS  
**Analysis**: Feature follows existing patterns. Overdue calculation will be extracted into a utility function (DRY). TodoCard component will display overdue status without taking on calculation responsibility (SRP). Simple date comparison logic (KISS).

#### II. Test-Driven Development
**Status**: ✅ PASS  
**Analysis**: 80%+ coverage required. Will add unit tests for utility functions (date calculations, duration formatting) and integration tests for TodoCard overdue display. Existing test infrastructure in place.

#### III. Consistent Code Style
**Status**: ✅ PASS  
**Analysis**: Will follow existing naming conventions (camelCase), 2-space indentation, and import organization. ESLint already configured in React project.

#### IV. User Experience Focus
**Status**: ✅ PASS  
**Analysis**: Multiple visual indicators (color + icon + text) for accessibility. WCAG AA contrast requirements met (danger colors already defined in design system). Keyboard accessible (no new interactive elements). Supports light/dark modes per existing theme.

#### V. Maintainability & Documentation
**Status**: ✅ PASS  
**Analysis**: Will add JSDoc comments for utility functions. Error handling for date parsing. Clear commit messages per existing Git practices. Feature is well-documented in spec with edge cases defined.

### Post-Design Re-Evaluation

#### I. Code Quality First (DRY, KISS, SOLID)
**Status**: ✅ CONFIRMED  
**Design Validation**:
- **DRY**: Created `dateUtils.js` with reusable `isOverdue()` and `getOverdueDuration()` functions
- **KISS**: Native JavaScript Date API, no external dependencies, simple arithmetic for duration calculation
- **SRP**: TodoCard handles display only, dateUtils handles calculation logic
- **Open/Closed**: Utility functions can be extended without modifying TodoCard
- **Dependency Inversion**: TodoCard depends on utility abstractions, not concrete Date logic

#### II. Test-Driven Development
**Status**: ✅ CONFIRMED  
**Design Validation**:
- Unit tests defined for all dateUtils functions (100% coverage target)
- Integration tests defined for TodoCard overdue rendering
- Test cases cover all edge cases from spec (no due date, completed, today's date, etc.)
- Tests can be written before implementation (TDD-ready)

#### III. Consistent Code Style
**Status**: ✅ CONFIRMED  
**Design Validation**:
- File naming: `dateUtils.js`, `dateUtils.test.js` (camelCase)
- Function naming: `isOverdue`, `getOverdueDuration` (camelCase)
- Import organization: utilities before styles
- JSDoc comments added to utility functions
- Follows existing project patterns (utils/ directory structure)

#### IV. User Experience Focus
**Status**: ✅ CONFIRMED  
**Design Validation**:
- Multiple indicators: CSS danger color + ⚠️ emoji + "OVERDUE" text (WCAG AA compliant)
- Dark mode support via CSS custom properties (--danger-color)
- No new interactive elements (keyboard accessibility maintained)
- Visual hierarchy: overdue indicator below due date (logical reading order)
- Accessible duration format: "2d overdue" is clear and concise

#### V. Maintainability & Documentation
**Status**: ✅ CONFIRMED  
**Design Validation**:
- JSDoc comments added to all utility functions with param/return types
- Error handling: guard clauses for null dates, completed status checks
- Comprehensive documentation created:
  - research.md: Technical decisions and alternatives
  - data-model.md: Derived properties and calculation rules
  - quickstart.md: Developer implementation guide
  - contracts/api-contracts.md: API stability confirmation
- Clear separation of concerns: presentation (TodoCard) vs. logic (dateUtils)

### Final Gate Decision

**PROCEED TO IMPLEMENTATION** ✅

All constitution principles satisfied:
- ✅ Code quality principles embedded in design
- ✅ Test strategy comprehensive and achievable
- ✅ Style consistency maintained
- ✅ UX accessibility requirements met
- ✅ Maintainability through documentation and structure

No violations requiring justification.

## Project Structure

### Documentation (this feature)

```text
specs/001-overdue-todos/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
packages/
├── backend/
│   ├── src/
│   │   ├── services/
│   │   │   └── todoService.js      # No changes - existing CRUD operations
│   │   ├── app.js                   # No changes - existing routes
│   │   └── index.js                 # No changes
│   └── __tests__/
│       └── app.test.js              # Minimal/no changes
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── TodoCard.js          # MODIFIED - add overdue visual treatment
    │   │   ├── TodoList.js          # REVIEW - ensure no logic changes needed
    │   │   ├── TodoForm.js          # No changes
    │   │   ├── ThemeToggle.js       # No changes
    │   │   └── ConfirmDialog.js     # No changes
    │   │   └── __tests__/
    │   │       ├── TodoCard.test.js # MODIFIED - add overdue tests
    │   │       └── ...              # Existing tests
    │   ├── utils/                   # NEW DIRECTORY
    │   │   ├── dateUtils.js         # NEW - overdue calculation utilities
    │   │   └── __tests__/
    │   │       └── dateUtils.test.js # NEW - utility tests
    │   ├── styles/
    │   │   └── theme.css            # REVIEW - may need overdue-specific styles
    │   ├── services/
    │   │   └── todoService.js       # No changes - API client
    │   ├── App.js                   # No changes
    │   └── index.js                 # No changes
    └── __tests__/
        └── App.test.js              # May add integration test
```

**Structure Decision**: Web application monorepo. This is a **frontend-focused feature** with no backend schema changes. The existing SQLite database already stores todos with `title`, `dueDate`, `completed`, and `createdAt` fields. Overdue status is a **derived/computed property** calculated client-side by comparing `dueDate` to current date for incomplete todos. All business logic additions will be in the frontend package, primarily affecting TodoCard component and creating new date utility functions.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations. All constitution principles are satisfied by this feature design.
