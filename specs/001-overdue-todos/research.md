# Research: Overdue Todo Items Feature

**Feature**: Support for Overdue Todo Items  
**Date**: January 29, 2026  
**Status**: Complete

## Overview

This document consolidates research findings for implementing visual identification and overdue duration display for todo items. The feature is primarily frontend-focused with no backend schema changes required.

## Key Research Areas

### 1. Date Comparison in JavaScript

**Decision**: Use native JavaScript `Date` objects for comparison  
**Rationale**: 
- No additional dependencies required (avoids libraries like moment.js or date-fns)
- Native `Date` API is sufficient for simple date comparison
- Better performance with zero bundle size impact
- Follows KISS principle (Keep It Simple)

**Implementation Approach**:
```javascript
// Compare dates at midnight (ignore time component)
function isOverdue(dueDate, currentDate = new Date()) {
  if (!dueDate) return false;
  
  const due = new Date(dueDate);
  const today = new Date(currentDate);
  
  // Set to midnight for fair comparison
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  return due < today;
}
```

**Alternatives Considered**:
- **date-fns**: Rejected - adds 12KB+ to bundle, overkill for simple comparison
- **moment.js**: Rejected - deprecated, very large (67KB), discouraged by community
- **Day.js**: Rejected - still adds dependency when native API works fine

### 2. Overdue Duration Calculation

**Decision**: Calculate days difference and format to abbreviated strings  
**Rationale**:
- Spec requires abbreviated format: "Xd", "Xw", "Xmo"
- Simple mathematical calculation (milliseconds → days → format)
- Rules clearly defined: <7 days = days, 7-29 days = weeks, ≥30 days = months

**Implementation Approach**:
```javascript
function getOverdueDuration(dueDate, currentDate = new Date()) {
  const due = new Date(dueDate);
  const today = new Date(currentDate);
  
  // Calculate difference in days
  const diffMs = today - due;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays < 7) {
    return `${diffDays}d overdue`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks}w overdue`;
  } else {
    const months = Math.floor(diffDays / 30);
    return `${months}mo overdue`;
  }
}
```

**Edge Cases Handled**:
- Due date = today: NOT overdue (only past dates count)
- No due date: Never overdue
- Completed todos: Overdue status not displayed (handled in component logic)

**Alternatives Considered**:
- **Relative time libraries**: Rejected - spec requires specific format, not "2 days ago"
- **Server-side calculation**: Rejected - would require backend changes, adds latency, unnecessary complexity

### 3. Visual Indicators for Accessibility

**Decision**: Multiple indicators (color + icon + text label)  
**Rationale**:
- WCAG AA compliance requires not relying solely on color
- Users with color blindness need additional cues
- Spec explicitly requires: danger color, ⚠️ emoji, "OVERDUE" text label

**Implementation Approach**:
- **Color**: Use existing danger colors from theme.css
  - Light mode: `#c62828` (red)
  - Dark mode: `#ef5350` (light red)
  - Apply to: due date text, border (optional)
- **Icon**: ⚠️ emoji positioned before "OVERDUE" text
- **Text Label**: "⚠️ OVERDUE" displayed below due date

**CSS Classes**:
```css
.todo-card.overdue {
  border-left: 4px solid var(--danger-color);
}

.overdue-indicator {
  color: var(--danger-color);
  font-weight: 600;
  font-size: 12px;
  margin-top: 4px;
}

.overdue-duration {
  color: var(--text-secondary);
  font-size: 12px;
  margin-top: 2px;
}
```

**Alternatives Considered**:
- **Color only**: Rejected - fails accessibility requirements
- **Animation/flashing**: Rejected - spec says "minimal to no motion", could be distracting
- **Background color change**: Considered but opted for border accent instead (less visually overwhelming)

### 4. Component Architecture

**Decision**: Extract date logic into utility functions, keep TodoCard presentational  
**Rationale**:
- Single Responsibility Principle (SRP): TodoCard displays, utils calculate
- DRY: Utility functions can be reused if needed elsewhere
- Testability: Easier to test pure utility functions independently
- Existing pattern: Project already has `services/` folder, adding `utils/` is consistent

**File Structure**:
```
src/
  utils/
    dateUtils.js         # Pure functions for date logic
    __tests__/
      dateUtils.test.js  # Unit tests for utilities
  components/
    TodoCard.js          # Uses utility functions, handles display
    __tests__/
      TodoCard.test.js   # Integration tests for rendering
```

**Alternatives Considered**:
- **Logic in TodoCard**: Rejected - violates SRP, harder to test
- **Custom React hook (useOverdue)**: Considered but overkill for simple calculations
- **Redux/Context**: Rejected - no state management needed, purely derived values

### 5. Testing Strategy

**Decision**: Unit tests for utilities + Integration tests for components  
**Rationale**:
- Pure utility functions are easy to unit test (no mocking needed)
- TodoCard integration tests verify visual rendering
- Target: 80%+ coverage per constitution

**Test Cases**:

**dateUtils.test.js**:
- `isOverdue()`: returns false for future dates, null dates, today's date
- `isOverdue()`: returns true for past dates
- `getOverdueDuration()`: formats correctly for days (1d, 5d)
- `getOverdueDuration()`: formats correctly for weeks (1w, 3w)
- `getOverdueDuration()`: formats correctly for months (1mo, 6mo)
- Edge case: exactly 7 days = 1 week
- Edge case: exactly 30 days = 1 month

**TodoCard.test.js** (new tests):
- Incomplete todo with past due date displays overdue indicator
- Incomplete todo with future due date does NOT display overdue indicator
- Incomplete todo with no due date does NOT display overdue indicator
- Completed todo with past due date does NOT display overdue indicator
- Overdue indicator shows correct duration text
- Overdue styling applies (danger color, border, icon)
- Accessibility: overdue indicator has proper aria-label or role

**Alternatives Considered**:
- **E2E tests**: Out of scope per spec (focus on unit/integration)
- **Visual regression tests**: Nice to have but not required for initial implementation

### 6. Dark Mode Support

**Decision**: Use CSS custom properties (already implemented in theme.css)  
**Rationale**:
- Design system already defines light/dark danger colors
- CSS variables automatically switch based on theme toggle
- No JavaScript logic needed for theming

**Implementation**:
```css
/* theme.css already has: */
:root {
  --danger-color: #c62828;
}

[data-theme='dark'] {
  --danger-color: #ef5350;
}

/* New overdue styles will use: */
.overdue-indicator {
  color: var(--danger-color);
}
```

**Alternatives Considered**:
- **Inline styles with theme prop**: Rejected - CSS custom properties are simpler
- **Separate CSS files per theme**: Rejected - unnecessary complexity

## Technology Choices Summary

| Technology | Decision | Rationale |
|------------|----------|-----------|
| Date handling | Native JavaScript `Date` API | No dependencies, sufficient for needs |
| Duration calculation | Custom utility function | Simple math, spec-specific format |
| Visual indicators | Color + Icon + Text | Accessibility compliance (WCAG AA) |
| Architecture | Utility functions + presentational components | SRP, testability, DRY |
| Testing | Jest + React Testing Library | Already in project, 80%+ coverage target |
| Styling | CSS with custom properties | Existing theme system, dark mode support |

## Dependencies

**No new dependencies required.**

The feature uses existing technologies:
- React 18.2.0 (already installed)
- Jest 29.7.0 (already installed)
- React Testing Library 14.0.0 (already installed)
- Native JavaScript Date API (built-in)

## Performance Considerations

**Date Calculations**: O(1) complexity, <1ms execution time  
**Rendering Impact**: Minimal - adds ~2 lines of text per overdue todo  
**Bundle Size Impact**: ~0.5KB for utility functions (negligible)

**Optimization**: Date comparisons will happen on every render of TodoCard, but this is acceptable because:
1. Todo lists are typically small (<100 items)
2. Calculation is very fast (native Date API)
3. No memoization needed unless performance issues observed

## Open Questions Resolved

1. **Q: How to handle timezone differences?**  
   A: Use local time for both due date and current date. System date is user's responsibility. No server-side date handling needed.

2. **Q: Should overdue status persist in database?**  
   A: No. Overdue is a derived property calculated client-side. This keeps backend simple and ensures accuracy across sessions.

3. **Q: What about todos due "today"?**  
   A: Per spec FR-007, due date = today is NOT overdue. Overdue only when date is in the past.

4. **Q: Should we use a date library?**  
   A: No. Native Date API is sufficient for requirements. Avoids unnecessary dependencies.

## Next Steps (Phase 1)

With research complete, proceed to:
1. Document data model (data-model.md)
2. Define API contracts (if any - likely none for this feature)
3. Create developer quickstart guide (quickstart.md)
4. Update agent context with findings
